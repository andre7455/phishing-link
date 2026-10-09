import { describe, expect, it } from 'vitest';
import { createShortcuts } from '../src/lib/shortcuts.js';

describe('URL shortcuts', () => {
  it('generates a redirect shortcut from a plain text URL and matching icon', () => {
    const [shortcut] = createShortcuts({
      '/content/3-GitHub.url': '  https://github.com/example?tab=repositories\r\n',
    });

    expect(shortcut).toEqual({
      id: 'github',
      label: 'GitHub',
      order: 3,
      iconPath: '/assets/shortcut-icons/3-GitHub.png',
      faviconPath: 'https://github.com/favicon.ico',
      redirect: 'https://github.com/example?tab=repositories',
      markdown: '',
      pdfUrl: null,
    });
  });

  it('sorts URL shortcuts together with markdown and PDF files', () => {
    const shortcuts = createShortcuts({
      '/content/10-Website.url': 'https://example.com',
      '/content/2-About.md': '# About',
      '/content/3-CV.pdf': '/assets/cv.pdf',
      '/content/1-Local page.url': '/some-page',
    });

    expect(shortcuts.map((shortcut) => shortcut.label))
      .toEqual(['Local page', 'About', 'CV', 'Website']);
    expect(shortcuts[0].redirect).toBe('/some-page');
    expect(shortcuts[0].faviconPath).toBe('/favicon.ico');
  });

  it('does not request favicons for non-web or invalid destinations', () => {
    for (const destination of ['mailto:hello@example.com', 'not a URL']) {
      const [shortcut] = createShortcuts({ '/content/1-Link.url': destination });
      expect(shortcut.faviconPath).toBeNull();
    }
  });

  it('rejects empty files and files with multiple URL lines', () => {
    for (const content of ['', ' \r\n', 'https://example.com\nhttps://other.example']) {
      expect(() => createShortcuts({ '/content/1-Website.url': content }))
        .toThrow('Shortcut URL file must contain one URL: 1-Website.url');
    }
  });
});
