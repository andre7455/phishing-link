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
    expect(screen.getAllByRole('heading', { name: 'About me' })).toHaveLength(2);
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
