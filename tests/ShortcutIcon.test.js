import { cleanup, fireEvent, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import ShortcutIcon from '../src/components/ShortcutIcon.svelte';

afterEach(cleanup);

describe('ShortcutIcon', () => {
  const iconPath = '/assets/shortcut-icons/1-Website.png';
  const faviconPath = 'https://example.com/favicon.ico';

  it('loads a favicon without sending a referrer and falls back on error', async () => {
    const { container } = render(ShortcutIcon, { iconPath, faviconPath });
    const image = container.querySelector('img');
    if (image === null) {
      throw new Error('Shortcut icon was not rendered');
    }
    expect(image).toHaveAttribute('src', faviconPath);
    expect(image).toHaveAttribute('referrerpolicy', 'no-referrer');
    await fireEvent.error(image);
    expect(image).toHaveAttribute('src', iconPath);
    await fireEvent.error(image);
    expect(image).toHaveAttribute('src', iconPath);
  });

  it('uses the local icon for shortcuts without a favicon', () => {
    const { container } = render(ShortcutIcon, { iconPath });
    expect(container.querySelector('img')).toHaveAttribute('src', iconPath);
  });
});
