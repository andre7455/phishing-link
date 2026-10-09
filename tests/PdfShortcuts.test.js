import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import DesktopFrame from '../src/components/DesktopFrame.svelte';
import { createShortcuts } from '../src/lib/shortcuts.js';

afterEach(cleanup);

describe('PDF shortcuts', () => {
  it('discovers PDFs alongside markdown and sorts numerically', () => {
    const shortcuts = createShortcuts({
      '/content/10-CV.pdf': '/assets/cv-hash.pdf',
      '/content/2-About.md': '# About',
    });

    expect(shortcuts.map((shortcut) => shortcut.label)).toEqual(['About', 'CV']);
    expect(shortcuts[1]).toMatchObject({
      order: 10,
      iconPath: '/assets/shortcut-icons/10-CV.png',
      pdfUrl: '/assets/cv-hash.pdf',
      markdown: '',
      redirect: null,
    });
    expect(shortcuts[0].pdfUrl).toBeNull();
  });

  it('opens a PDF inside the desktop frame with a fallback link', () => {
    render(DesktopFrame, {
      title: 'CV',
      markdown: '',
      pdfUrl: '/assets/cv.pdf',
    });

    expect(screen.getByTitle('PDF document')).toHaveAttribute('src', '/assets/cv.pdf');
    expect(screen.getByRole('link', { name: 'Open or download PDF' }))
      .toHaveAttribute('href', '/assets/cv.pdf');
  });
});
