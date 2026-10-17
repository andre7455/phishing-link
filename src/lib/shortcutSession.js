import { writable } from 'svelte/store';

/**
 * @typedef {object} OpenContent
 * @property {string} title
 * @property {string} markdown
 * @property {string | null} pdfUrl
 * @property {boolean} [isContact]
 */

/**
 * Each launcher owns its session so desktop and mobile keep independent content state.
 * @param {(destination: string) => void} navigate
 */
export const createShortcutSession = (navigate = (destination) => {
  globalThis.location.href = destination;
}) => {
  const content = writable(/** @type {OpenContent | null} */ (null));

  /** @param {import('./shortcuts.js').Shortcut} shortcut */
  const open = (shortcut) => {
    if (shortcut.redirect !== null) {
      if (shortcut.openInNewTab) {
        globalThis.open(shortcut.redirect, '_blank', 'noopener,noreferrer');
      } else {
        navigate(shortcut.redirect);
      }
      return;
    }

    content.set({
      title: shortcut.label,
      markdown: shortcut.markdown,
      pdfUrl: shortcut.pdfUrl ?? null,
      ...(shortcut.isContact ? { isContact: true } : {}),
    });
  };

  const close = () => content.set(null);

  return { content, open, close };
};
