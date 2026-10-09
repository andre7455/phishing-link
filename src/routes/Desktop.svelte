<script>
  import DesktopFrame from '../components/DesktopFrame.svelte';
  import DesktopShortcut from '../components/DesktopShortcut.svelte';
  import StartMenuBar from '../components/StartMenuBar.svelte';
  import { shortcuts } from '../lib/shortcuts.js';
  import { createShortcutSession } from '../lib/shortcutSession.js';

  const shortcutStartX = 16;
  const shortcutStartY = 16;
  const shortcutRowGap = 104;

  const { content: openFrame, open: openShortcut, close: closeFrame } = createShortcutSession();
</script>

<main class="desktop-page" aria-label="Desktop">
  <section class="desktop-workspace" aria-label="Desktop workspace">
    {#each shortcuts as shortcut, shortcutIndex (shortcut.id)}
      <DesktopShortcut
        label={shortcut.label}
        iconPath={shortcut.iconPath}
        faviconPath={shortcut.faviconPath ?? null}
        initialX={shortcutStartX}
        initialY={shortcutStartY + shortcutIndex * shortcutRowGap}
        onOpen={() => openShortcut(shortcut)}
      />
    {/each}

    {#if $openFrame !== null}
      <DesktopFrame
        title={$openFrame.title}
        markdown={$openFrame.markdown}
        pdfUrl={$openFrame.pdfUrl}
        onClose={closeFrame}
      />
    {/if}
  </section>
  <StartMenuBar {shortcuts} onOpenShortcut={openShortcut} />
</main>
