import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DesktopShortcut from '../src/components/DesktopShortcut.svelte';

const iconPath = '/assets/shortcut-icons/1-About me.png';

afterEach(() => {
  cleanup();
});

describe('DesktopShortcut', () => {
  it('renders a desktop shortcut button with label and icon image', () => {
    render(DesktopShortcut, {
      props: {
        label: 'About me',
        iconPath,
      },
    });

    expect(screen.getByRole('button', { name: 'Open About me' })).toBeInTheDocument();
    expect(screen.getByText('About me')).toBeInTheDocument();
    const icon = document.querySelector('.shortcut-icon-image');

    expect(icon).toHaveAttribute('src', iconPath);
  });

  it('moves when dragged with the pointer', async () => {
    const onMove = vi.fn();

    render(DesktopShortcut, {
      props: {
        label: 'About me',
        iconPath,
        initialX: 16,
        initialY: 16,
        onMove,
      },
    });

    const shortcut = screen.getByRole('button', { name: 'Open About me' });

    await fireEvent.pointerDown(shortcut, { clientX: 16, clientY: 16 });
    await fireEvent.pointerMove(document, { clientX: 66, clientY: 46 });
    await fireEvent.pointerUp(document, { clientX: 66, clientY: 46 });

    expect(shortcut).toHaveStyle({ left: '66px', top: '46px' });
    expect(onMove).toHaveBeenCalledWith({ x: 66, y: 46 });
  });

  it('cleans up dragging when cancelled or removed', async () => {
    const onMove = vi.fn();
    const onOpen = vi.fn();
    const { unmount } = render(DesktopShortcut, {
      props: { label: 'About me', iconPath, onMove, onOpen },
    });
    const shortcut = screen.getByRole('button', { name: 'Open About me' });
    await fireEvent.pointerDown(shortcut, { clientX: 16, clientY: 16 });
    await fireEvent.pointerCancel(document);
    await fireEvent.pointerMove(document, { clientX: 66, clientY: 46 });
    await fireEvent.pointerUp(document);
    expect(onMove).not.toHaveBeenCalled();
    expect(onOpen).not.toHaveBeenCalled();

    await fireEvent.pointerDown(shortcut, { clientX: 16, clientY: 16 });
    unmount();
    await fireEvent.pointerMove(document, { clientX: 66, clientY: 46 });
    await fireEvent.pointerUp(document);
    expect(onMove).not.toHaveBeenCalled();
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('opens on pointer press without dragging', async () => {
    const onOpen = vi.fn();

    render(DesktopShortcut, {
      props: {
        label: 'About me',
        iconPath,
        onOpen,
      },
    });

    const shortcut = screen.getByRole('button', { name: 'Open About me' });

    await fireEvent.pointerDown(shortcut, { clientX: 16, clientY: 16 });
    await fireEvent.pointerUp(document, { clientX: 16, clientY: 16 });

    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
