import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App.svelte';

const typingCompleteMs = 1200;
const promptDelayMs = 750;

const clearStartupCookie = () => {
  document.cookie = 'portfolioStartupSeen=; max-age=0; path=/';
};

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  clearStartupCookie();
});

describe('App', () => {
  it('types the terminal intro before showing the continue prompt', async () => {
    vi.useFakeTimers();

    render(App);

    expect(screen.getByLabelText('Loading site')).toBeInTheDocument();
    expect(screen.queryByLabelText('Desktop')).not.toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(typingCompleteMs);

    expect(screen.getByText('Hey, Welcome')).toBeInTheDocument();
    expect(screen.getByTestId('continue-prompt')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByLabelText('Desktop')).not.toBeInTheDocument();
  });

  it('shows the continue prompt after the configured delay', async () => {
    vi.useFakeTimers();

    render(App);

    await vi.advanceTimersByTimeAsync(typingCompleteMs + promptDelayMs);

    expect(screen.getByTestId('continue-prompt')).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByText('Press any key to continue')).toBeInTheDocument();
    expect(screen.getByText('Tap the screen to continue')).toBeInTheDocument();
  });

  it('renders the desktop page after a key press and stores the startup cookie', async () => {
    vi.useFakeTimers();

    render(App);

    await vi.advanceTimersByTimeAsync(typingCompleteMs + promptDelayMs);
    await fireEvent.keyDown(document, { key: 'Enter' });

    expect(screen.queryByLabelText('Loading site')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Desktop')).toBeInTheDocument();
    expect(screen.getByLabelText('Desktop taskbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open start menu' })).toBeInTheDocument();
    expect(document.cookie).toContain('portfolioStartupSeen=true');
  });

  it('renders the desktop page after tapping the screen', async () => {
    vi.useFakeTimers();

    render(App);

    await vi.advanceTimersByTimeAsync(typingCompleteMs + promptDelayMs);
    await fireEvent.pointerDown(document);

    expect(screen.queryByLabelText('Loading site')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Desktop')).toBeInTheDocument();
  });

  it('skips the startup animation when the startup cookie exists', () => {
    document.cookie = 'portfolioStartupSeen=true; path=/';

    render(App);

    expect(screen.queryByLabelText('Loading site')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Desktop')).toBeInTheDocument();
  });
});
