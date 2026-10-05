import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import StartMenuBar from '../src/components/StartMenuBar.svelte';

const fixedDate = new Date(2026, 8, 22, 13, 5);
const shortcuts = [
  {
    id: 'about-me',
    label: 'About me',
    iconPath: '/assets/shortcut-icons/1-About me.png',
    markdown: '# About me',
    order: 1,
    redirect: null,
  },
];

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('StartMenuBar', () => {
  it('renders the start button and system clock', () => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);

    render(StartMenuBar, {
      props: {
        shortcuts,
      },
    });

    expect(screen.getByLabelText('Desktop taskbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open start menu' })).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByLabelText('System clock')).toHaveTextContent('13:05');
    expect(screen.getByLabelText('System clock')).toHaveTextContent('22-09-2026');
  });

  it('opens the start menu and launches shortcuts', async () => {
    const onOpenShortcut = vi.fn();

    render(StartMenuBar, {
      props: {
        shortcuts,
        onOpenShortcut,
      },
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Open start menu' }));

    expect(screen.getByLabelText('Start menu')).toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'About me' }));

    expect(onOpenShortcut).toHaveBeenCalledWith(shortcuts[0]);
    expect(screen.queryByLabelText('Start menu')).not.toBeInTheDocument();
  });
});
