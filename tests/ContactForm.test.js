import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ContactForm from '../src/components/ContactForm.svelte';
import Desktop from '../src/routes/Desktop.svelte';
import MobileHome from '../src/routes/MobileHome.svelte';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const fillForm = async () => {
  await fireEvent.input(screen.getByLabelText('Name'), { target: { value: 'Visitor' } });
  await fireEvent.input(screen.getByLabelText('Email'), {
    target: { value: 'visitor@example.com' },
  });
  await fireEvent.input(screen.getByLabelText('Message'), { target: { value: 'Hello!' } });
};

describe('Contact me', () => {
  it('validates required fields and explains when no endpoint is configured', async () => {
    render(ContactForm);
    const name = screen.getByRole('textbox', { name: 'Name' });
    const email = screen.getByRole('textbox', { name: 'Email' });
    const message = screen.getByRole('textbox', { name: 'Message' });
    for (const field of [name, email, message]) {
      expect(field).toBeRequired();
    }
    await fireEvent.input(name, { target: { value: 'Test visitor' } });
    await fireEvent.input(email, { target: { value: 'invalid' } });
    expect(email).toBeInvalid();
    await fireEvent.input(email, { target: { value: 'visitor@example.com' } });
    await fireEvent.input(message, { target: { value: 'Hello!' } });
    expect(email).toBeValid();
    expect(message).toHaveValue('Hello!');
    await fireEvent.input(email, { target: { value: 'visitor@localhost' } });
    expect(email).toBeInvalid();
    await fireEvent.input(email, { target: { value: 'visitor@example.com' } });
    expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled();
    const form = screen.getByRole('form', { name: 'Contact me' });
    expect(await fireEvent.submit(form)).toBe(false);
    expect(screen.getByRole('status')).toHaveTextContent('URL has not been configured');
  });

  it('posts the fields as JSON to the configured URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    render(ContactForm, { endpoint: 'https://example.com/contact' });
    await fillForm();
    await fireEvent.submit(screen.getByRole('form', { name: 'Contact me' }));
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Visitor', email: 'visitor@example.com', message: 'Hello!' }),
    });
    expect(await screen.findByText('Your message has been sent.')).toBeInTheDocument();
  });

  it('retains the message when the server rejects the request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    render(ContactForm, { endpoint: 'https://example.com/contact' });
    await fillForm();
    await fireEvent.submit(screen.getByRole('form', { name: 'Contact me' }));
    expect(await screen.findByText(/could not be sent/)).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toHaveValue('Hello!');
  });

  it('opens the contact form from the desktop shortcut', async () => {
    render(Desktop);
    await fireEvent.keyDown(screen.getByRole('button', { name: 'Open Contact me' }), {
      key: 'Enter',
    });
    expect(screen.getByRole('form', { name: 'Contact me' })).toBeInTheDocument();
  });

  it('opens the contact form on mobile', async () => {
    render(MobileHome);
    const shortcut = screen.getByRole('button', { name: 'Open Contact me' });
    await fireEvent.pointerDown(shortcut);
    await fireEvent.pointerUp(shortcut);
    expect(screen.getByRole('form', { name: 'Contact me' })).toBeInTheDocument();
  });
});
