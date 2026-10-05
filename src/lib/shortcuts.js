const shortcutModules = import.meta.glob('../content/shortcuts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

/**
 * @typedef {object} Shortcut
 * @property {string} id
 * @property {string} label
 * @property {string} iconPath
 * @property {string} markdown
 * @property {number} order
 * @property {string | null} redirect
 */

const shortcutFilePattern = /^(\d+)-(.+)\.md$/;
const frontmatterPattern = /^---\n([\s\S]*?)\n---\n?/;

/** @param {string} value */
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** @param {string} markdown */
const parseFrontmatter = (markdown) => {
  const match = frontmatterPattern.exec(markdown);

  if (match === null) {
    return {
      markdown,
      redirect: null,
    };
  }

  const metadata = match[1];
  const redirectLine = metadata
    .split('\n')
    .find((line) => line.trim().toLowerCase().startsWith('redirect:'));
  const redirect = redirectLine?.split(':').slice(1).join(':').trim() || null;

  return {
    markdown: markdown.slice(match[0].length),
    redirect,
  };
};

/** @param {string} path */
const parseShortcutPath = (path) => {
  const pathParts = path.split('/');
  const fileName = pathParts[pathParts.length - 1] ?? '';
  const match = shortcutFilePattern.exec(fileName);

  if (match === null) {
    throw new Error(`Invalid shortcut markdown filename: ${fileName}`);
  }

  const order = Number(match[1]);
  const label = match[2].trim();
  const id = slugify(label);

  return {
    fileName,
    id,
    label,
    order,
  };
};

/** @type {Shortcut[]} */
export const shortcuts = Object.entries(shortcutModules)
  .map(([path, markdown]) => {
    const shortcut = parseShortcutPath(path);
    const content = parseFrontmatter(String(markdown));
    const iconPath = `/assets/shortcut-icons/${shortcut.fileName.replace(/\.md$/, '.png')}`;

    return {
      id: shortcut.id,
      label: shortcut.label,
      order: shortcut.order,
      iconPath,
      markdown: content.markdown,
      redirect: content.redirect,
    };
  })
  .sort((firstShortcut, secondShortcut) => firstShortcut.order - secondShortcut.order);
