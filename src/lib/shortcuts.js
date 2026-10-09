const shortcutModules = import.meta.glob('../content/shortcuts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const pdfModules = import.meta.glob('../content/shortcuts/*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
});

const urlModules = import.meta.glob('../content/shortcuts/*.url', {
  eager: true,
  query: '?raw',
  import: 'default',
});

/**
 * @typedef {object} Shortcut
 * @property {string} id
 * @property {string} label
 * @property {string} iconPath
 * @property {string | null} [faviconPath]
 * @property {string} markdown
 * @property {number} order
 * @property {string | null} redirect
 * @property {string | null} [pdfUrl]
 */

const shortcutFilePattern = /^(\d+)-(.+)\.(md|pdf|url)$/;
const frontmatterPattern = /^---\n([\s\S]*?)\n---\n?/;

/** @param {string} value */
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** @param {string | null} destination */
const getFaviconPath = (destination) => {
  if (destination?.startsWith('/') && !destination.startsWith('//')) {
    return '/favicon.ico';
  }
  try {
    const url = new URL(destination ?? '');
    return ['http:', 'https:'].includes(url.protocol)
      ? `${url.origin}/favicon.ico` : null;
  } catch {
    return null;
  }
};

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
    throw new Error(`Invalid shortcut filename: ${fileName}`);
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

/**
 * @param {Record<string, unknown>} modules
 * @returns {Shortcut[]}
 */
export const createShortcuts = (modules) => Object.entries(modules)
  .map(([path, markdown]) => {
    const shortcut = parseShortcutPath(path);
    const isPdf = shortcut.fileName.endsWith('.pdf');
    const isUrl = shortcut.fileName.endsWith('.url');
    const destination = isUrl ? String(markdown).trim() : null;
    if (isUrl && (!destination || /[\r\n]/.test(destination))) {
      throw new Error(`Shortcut URL file must contain one URL: ${shortcut.fileName}`);
    }
    const content = parseFrontmatter(isPdf || isUrl ? '' : String(markdown));
    const iconFileName = shortcut.fileName.replace(/\.(md|pdf|url)$/, '.png');
    const iconPath = `/assets/shortcut-icons/${iconFileName}`;

    return {
      id: shortcut.id,
      label: shortcut.label,
      order: shortcut.order,
      iconPath,
      ...(isUrl ? { faviconPath: getFaviconPath(destination) } : {}),
      markdown: content.markdown,
      redirect: isUrl ? destination : content.redirect,
      pdfUrl: isPdf ? String(markdown) : null,
    };
  })
  .sort((firstShortcut, secondShortcut) => firstShortcut.order - secondShortcut.order);

export const shortcuts = createShortcuts({ ...shortcutModules, ...pdfModules, ...urlModules });
