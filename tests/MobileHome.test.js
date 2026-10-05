import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import MobileHome from '../src/routes/MobileHome.svelte';

afterEach(() => {
  cleanup();
});

describe('MobileHome', () => {
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

  it('opens shortcuts fullscreen and returns home with the home button', async () => {
    render(MobileHome);

    const shortcut = screen.getByRole('button', { name: 'Open About me' });

    await fireEvent.pointerDown(shortcut);
    await fireEvent.pointerUp(shortcut);

    expect(screen.getByLabelText('About me mobile app')).toBeInTheDocument();
    expect(screen.getByText('Welcome to my portfolio desktop.')).toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'Home' }));

    expect(screen.queryByLabelText('About me mobile app')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Mobile shortcuts')).toBeInTheDocument();
  });
});
