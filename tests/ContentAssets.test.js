import { describe, expect, it } from 'vitest';
import contactIcon from '../src/content/assets/shortcut-icons/contact-me.svg?raw';
import publicContactIcon from '../public/assets/shortcut-icons/contact-me.svg?raw';

const pictures = import.meta.glob('../src/content/assets/pictures/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

describe('content assets', () => {
  it('keeps the public assets path linked to the relocated content assets', () => {
    expect(contactIcon).toContain('<svg');
    expect(publicContactIcon).toBe(contactIcon);
  });

  it('includes the About me picture in the content assets directory', () => {
    expect(Object.keys(pictures)).toContain(
      '../src/content/assets/pictures/TALENTENTUIN_PHOTO--104.jpg',
    );
  });
});
