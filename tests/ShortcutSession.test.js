import { get } from 'svelte/store';
import { describe, expect, it, vi } from 'vitest';
import { createShortcutSession } from '../src/lib/shortcutSession.js';
import { createShortcuts } from '../src/lib/shortcuts.js';

describe('shortcut sessions', () => {
  it('opens markdown and PDF content and clears content when closed', () => {
    const session = createShortcutSession();
    const [markdown, pdf] = createShortcuts({
      '/content/1-About.md': '# About',
      '/content/2-CV.pdf': '/assets/cv.pdf',
    });
    expect(get(session.content)).toBeNull();
    session.open(markdown);
    expect(get(session.content)).toEqual({ title: 'About', markdown: '# About', pdfUrl: null });
    session.open(pdf);
    expect(get(session.content)).toEqual({ title: 'CV', markdown: '', pdfUrl: '/assets/cv.pdf' });
    session.close();
    expect(get(session.content)).toBeNull();
  });

  it('navigates URL and markdown redirects without opening content', () => {
    const navigate = vi.fn();
    const session = createShortcutSession(navigate);
    const shortcuts = createShortcuts({
      '/content/1-Website.url': 'https://example.com',
      '/content/2-Local.md': '---\nredirect: /some-page\n---\n',
    });
    shortcuts.forEach(session.open);
    expect(navigate.mock.calls).toEqual([['https://example.com'], ['/some-page']]);
    expect(get(session.content)).toBeNull();
  });

  it('keeps desktop and mobile sessions independent', () => {
    const desktop = createShortcutSession();
    const mobile = createShortcutSession();
    const [shortcut] = createShortcuts({ '/content/1-About.md': '# About' });
    desktop.open(shortcut);
    expect(get(mobile.content)).toBeNull();
    mobile.open(shortcut);
    desktop.close();
    expect(get(mobile.content)?.title).toBe('About');
  });
});
