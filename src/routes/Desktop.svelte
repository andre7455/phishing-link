<script>
  import DesktopFrame from '../components/DesktopFrame.svelte';
  import DesktopShortcut from '../components/DesktopShortcut.svelte';
  import StartMenuBar from '../components/StartMenuBar.svelte';
  import { shortcuts } from '../lib/shortcuts.js';

  const shortcutStartX = 16;
  const shortcutStartY = 16;
  const shortcutRowGap = 104;

  /** @type {{ title: string, markdown: string } | null} */
  let openFrame = null;

  /** @param {import('../lib/shortcuts.js').Shortcut} shortcut */
  const openShortcut = (shortcut) => {
    if (shortcut.redirect !== null) {
      globalThis.location.href = shortcut.redirect;
      return;
    }

    openFrame = {
      title: shortcut.label,
      markdown: shortcut.markdown,
    };
  };

  const closeFrame = () => {
    openFrame = null;
  };
</script>

<main class="desktop-page" aria-label="Desktop">
  <section class="desktop-workspace" aria-label="Desktop workspace">
    {#each shortcuts as shortcut, shortcutIndex (shortcut.id)}
      <DesktopShortcut
        label={shortcut.label}
        iconPath={shortcut.iconPath}
        initialX={shortcutStartX}
        initialY={shortcutStartY + shortcutIndex * shortcutRowGap}
        onOpen={() => openShortcut(shortcut)}
      />
    {/each}

    {#if openFrame !== null}
      <DesktopFrame title={openFrame.title} markdown={openFrame.markdown} onClose={closeFrame} />
    {/if}
  </section>
  <StartMenuBar {shortcuts} onOpenShortcut={openShortcut} />
</main>
