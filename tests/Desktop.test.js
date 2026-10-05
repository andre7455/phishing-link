import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Desktop from '../src/routes/Desktop.svelte';

afterEach(() => {
  cleanup();
});

describe('Desktop', () => {
  it('renders the desktop workspace and start menu bar', () => {
    render(Desktop);

    expect(screen.getByLabelText('Desktop')).toBeInTheDocument();
    expect(screen.getByLabelText('Desktop workspace')).toBeInTheDocument();
    expect(screen.getByLabelText('Desktop taskbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open start menu' })).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByLabelText('System clock')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open About me' })).toBeInTheDocument();
  });

  it('opens markdown content from the desktop shortcut', async () => {
    render(Desktop);

    const shortcut = screen.getByRole('button', { name: 'Open About me' });

    await fireEvent.pointerDown(shortcut, { clientX: 16, clientY: 16 });
    await fireEvent.pointerUp(document, { clientX: 16, clientY: 16 });

    expect(screen.getByLabelText('About me desktop frame')).toBeInTheDocument();
    expect(screen.getByText('Welcome to my portfolio desktop.')).toBeInTheDocument();
  });
});
