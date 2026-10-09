import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DesktopFrame from '../src/components/DesktopFrame.svelte';

const markdown = [
  '# About me',
  '',
  'Markdown content.',
  '',
  '![Example local image](/assets/pictures/9XryZQt2.png)',
].join('\n');

afterEach(() => {
  cleanup();
});

describe('DesktopFrame', () => {
  it('renders a desktop frame with markdown content', () => {
    render(DesktopFrame, {
      props: {
        title: 'About me',
        markdown,
      },
    });

    const frameElement = screen.getByLabelText('About me desktop frame');

    expect(frameElement).toBeInTheDocument();
    expect(frameElement).toHaveClass('desktop-frame');
    expect(screen.getByRole('heading', { name: 'About me' })).toBeInTheDocument();
    expect(screen.getByText('Markdown content.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Example local image' })).toHaveAttribute(
      'src',
      '/assets/pictures/9XryZQt2.png',
    );
  });

  it('calls close when the close button is clicked', async () => {
    const onClose = vi.fn();

    render(DesktopFrame, {
      props: {
        title: 'About me',
        markdown,
        onClose,
      },
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Close About me' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('resizes from the resize handle', async () => {
    render(DesktopFrame, {
      props: {
        title: 'About me',
        markdown,
      },
    });

    const frameElement = screen.getByLabelText('About me desktop frame');
    const resizeHandle = screen.getByRole('button', { name: 'Resize About me' });

    await fireEvent.pointerDown(resizeHandle, { clientX: 0, clientY: 0 });
    await fireEvent.pointerMove(document, { clientX: 50, clientY: 30 });
    await fireEvent.pointerUp(document, { clientX: 50, clientY: 30 });

    expect(frameElement).toHaveStyle({ width: '722px', height: '450px' });
  });

  it('moves by the title bar and stops after release or cancellation', async () => {
    render(DesktopFrame, { props: { title: 'About me', markdown } });
    const frame = screen.getByLabelText('About me desktop frame');
    const titleBar = screen.getByRole('button', { name: 'Move About me' });

    await fireEvent.pointerDown(titleBar, { clientX: 10, clientY: 20, button: 0 });
    await fireEvent.pointerMove(document, { clientX: 60, clientY: 50 });
    expect(frame).toHaveStyle({ translate: '50px 30px' });
    await fireEvent.pointerUp(document);
    await fireEvent.pointerMove(document, { clientX: 100, clientY: 100 });
    expect(frame).toHaveStyle({ translate: '50px 30px' });

    await fireEvent.pointerDown(titleBar, { clientX: 60, clientY: 50, button: 0 });
    await fireEvent.pointerMove(document, { clientX: 70, clientY: 60 });
    await fireEvent.pointerCancel(document);
    await fireEvent.pointerMove(document, { clientX: 100, clientY: 100 });
    expect(frame).toHaveStyle({ translate: '60px 40px' });
  });

  it('ignores secondary clicks and dragging from the frame controls', async () => {
    render(DesktopFrame, { props: { title: 'About me', markdown } });
    const frame = screen.getByLabelText('About me desktop frame');
    await fireEvent.pointerDown(screen.getByRole('button', { name: 'Move About me' }), {
      clientX: 0, clientY: 0, button: 2,
    });
    await fireEvent.pointerMove(document, { clientX: 50, clientY: 30 });
    expect(frame).toHaveStyle({ translate: '0px 0px' });
    await fireEvent.pointerDown(screen.getByRole('button', { name: 'Close About me' }));
    await fireEvent.pointerMove(document, { clientX: 80, clientY: 60 });
    expect(frame).toHaveStyle({ translate: '0px 0px' });
  });

  it('supports keyboard movement and preserves position through fullscreen', async () => {
    render(DesktopFrame, { props: { title: 'About me', markdown } });
    const frame = screen.getByLabelText('About me desktop frame');
    const titleBar = screen.getByRole('button', { name: 'Move About me' });
    await fireEvent.keyDown(titleBar, { key: 'ArrowRight' });
    await fireEvent.keyDown(titleBar, { key: 'ArrowDown', shiftKey: true });
    expect(frame).toHaveStyle({ translate: '10px 40px' });
    await fireEvent.click(screen.getByRole('button', { name: 'Fullscreen About me' }));
    await fireEvent.pointerDown(titleBar, { clientX: 0, clientY: 0, button: 0 });
    await fireEvent.pointerMove(document, { clientX: 100, clientY: 100 });
    await fireEvent.keyDown(titleBar, { key: 'ArrowLeft' });
    await fireEvent.click(screen.getByRole('button', { name: 'Restore About me' }));
    expect(frame).toHaveStyle({ translate: '10px 40px' });
  });

  it('toggles fullscreen mode', async () => {
    render(DesktopFrame, {
      props: {
        title: 'About me',
        markdown,
      },
    });

    const frameElement = screen.getByLabelText('About me desktop frame');

    await fireEvent.click(screen.getByRole('button', { name: 'Fullscreen About me' }));

    expect(frameElement).toHaveClass('desktop-frame-fullscreen');
    expect(screen.getByRole('button', { name: 'Restore About me' })).toBeInTheDocument();

    await fireEvent.click(screen.getByRole('button', { name: 'Restore About me' }));

    expect(frameElement).not.toHaveClass('desktop-frame-fullscreen');
  });
});
