import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { tick } from 'svelte';
import MobileHome from '../src/routes/MobileHome.svelte';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('MobileHome', () => {
  it('shows the current local time, updates it, and cleans up its timer', async () => {
    vi.useFakeTimers();
    const date = new Date(2026, 9, 17, 14, 37, 59);
    vi.setSystemTime(date);
    const { unmount } = render(MobileHome);
    const formatter = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    expect(screen.getByLabelText('Mobile clock')).toHaveTextContent(formatter.format(date));
    expect(screen.getByLabelText('Mobile clock')).toHaveAttribute('datetime', date.toISOString());

    await vi.advanceTimersByTimeAsync(1000);
    await tick();

    expect(screen.getByLabelText('Mobile clock')).toHaveTextContent(
      formatter.format(new Date()),
    );
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('toggles the apps menu and launches an app from it', async () => {
    render(MobileHome);
    const menuButton = screen.getByRole('button', { name: 'Menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await fireEvent.click(menuButton);
    expect(screen.getByRole('navigation', { name: 'Mobile apps' })).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    await fireEvent.click(menuButton);
    expect(screen.queryByRole('navigation', { name: 'Mobile apps' })).not.toBeInTheDocument();

    await fireEvent.click(menuButton);
    await fireEvent.click(screen.getByRole('button', { name: 'About me' }));
    expect(screen.getByLabelText('About me mobile app')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Mobile apps' })).not.toBeInTheDocument();
  });

  it.each(['Home', 'Back'])('closes the menu with %s', async (button) => {
    render(MobileHome);
    await fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    await fireEvent.click(screen.getByRole('button', { name: button }));
    expect(screen.queryByRole('navigation', { name: 'Mobile apps' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Mobile shortcuts')).toBeInTheDocument();
  });
  it('renders a mobile home screen using shared shortcuts', () => {
    render(MobileHome);

    expect(screen.getByLabelText('Mobile home')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile status bar')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile home screen')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile status')).toHaveTextContent('3G ▮▮ 100%');
    expect(screen.getByRole('button', { name: 'Open About me' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
  });

  it.each(['Home', 'Back'])('returns home from an app with %s', async (button) => {
    render(MobileHome);

    const shortcut = screen.getByRole('button', { name: 'Open About me' });

    await fireEvent.pointerDown(shortcut);
    await fireEvent.pointerUp(shortcut);

    expect(screen.getByLabelText('About me mobile app')).toBeInTheDocument();
    expect(screen.queryByLabelText('Mobile shortcuts')).not.toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: button }));

    expect(screen.queryByLabelText('About me mobile app')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Mobile shortcuts')).toBeInTheDocument();
  });
});
