<script>
  import DesktopShortcut from '../components/DesktopShortcut.svelte';
  import ShortcutContent from '../components/ShortcutContent.svelte';
  import { shortcuts } from '../lib/shortcuts.js';

  /** @type {{ title: string, markdown: string, pdfUrl: string | null } | null} */
  let openApp = null;

  /** @param {import('../lib/shortcuts.js').Shortcut} shortcut */
  const openShortcut = (shortcut) => {
    if (shortcut.redirect !== null) {
      globalThis.location.href = shortcut.redirect;
      return;
    }

    openApp = {
      title: shortcut.label,
      markdown: shortcut.markdown,
      pdfUrl: shortcut.pdfUrl ?? null,
    };
  };

  const goHome = () => {
    openApp = null;
  };
</script>

<main class="mobile-home" aria-label="Mobile home">
  <header class="mobile-status-bar" aria-label="Mobile status bar">
    <span>Portfolio</span>
    <span aria-label="Mobile status">3G ▮▮ 100%</span>
  </header>

  <section class="mobile-screen" aria-label="Mobile home screen">
    {#if openApp === null}
      <div class="mobile-clock" aria-label="Mobile clock">12:00</div>

      <div class="mobile-shortcut-grid" aria-label="Mobile shortcuts">
        {#each shortcuts as shortcut (shortcut.id)}
          <DesktopShortcut
            variant="mobile"
            label={shortcut.label}
            iconPath={shortcut.iconPath}
            onOpen={() => openShortcut(shortcut)}
          />
        {/each}
      </div>
    {:else}
      <section class="mobile-fullscreen-app" aria-label={`${openApp.title} mobile app`}>
        <header class="mobile-app-titlebar">
          <span>{openApp.title}</span>
        </header>
        <ShortcutContent markdown={openApp.markdown} pdfUrl={openApp.pdfUrl} />
      </section>
    {/if}
  </section>

  <nav class="mobile-nav-bar" aria-label="Mobile navigation">
    <button class="mobile-nav-button" type="button" aria-label="Back">‹</button>
    <button class="mobile-nav-button" type="button" aria-label="Home" onclick={goHome}>⌂</button>
    <button class="mobile-nav-button" type="button" aria-label="Menu">☰</button>
  </nav>
</main>
