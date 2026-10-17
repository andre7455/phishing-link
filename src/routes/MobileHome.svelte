<script>
  import { onMount } from 'svelte';
  import DesktopShortcut from '../components/DesktopShortcut.svelte';
  import ShortcutContent from '../components/ShortcutContent.svelte';
  import { shortcuts } from '../lib/shortcuts.js';
  import { createShortcutSession } from '../lib/shortcutSession.js';

  const { content: openApp, open: openShortcut, close } = createShortcutSession();
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  let currentDate = new Date();
  let isMenuOpen = false;

  const goHome = () => {
    isMenuOpen = false;
    close();
  };

  /** @param {import('../lib/shortcuts.js').Shortcut} shortcut */
  const launchShortcut = (shortcut) => {
    isMenuOpen = false;
    openShortcut(shortcut);
  };

  onMount(() => {
    const updateClock = () => {
      currentDate = new Date();
    };
    updateClock();
    const timer = globalThis.setInterval(updateClock, 1000);
    return () => globalThis.clearInterval(timer);
  });
</script>

<main class="mobile-home" aria-label="Mobile home">
  <header class="mobile-status-bar" aria-label="Mobile status bar">
    <span>Portfolio</span>
    <span aria-label="Mobile status">3G ▮▮ 100%</span>
  </header>

  <section class="mobile-screen" aria-label="Mobile home screen">
    {#if $openApp === null}
      <time class="mobile-clock" aria-label="Mobile clock" datetime={currentDate.toISOString()}>
        {timeFormatter.format(currentDate)}
      </time>

      <div class="mobile-shortcut-grid" aria-label="Mobile shortcuts">
        {#each shortcuts as shortcut (shortcut.id)}
          <DesktopShortcut
            variant="mobile"
            label={shortcut.label}
            iconPath={shortcut.iconPath}
            faviconPath={shortcut.faviconPath ?? null}
            onOpen={() => launchShortcut(shortcut)}
          />
        {/each}
      </div>
    {:else}
      <section class="mobile-fullscreen-app" aria-label={`${$openApp.title} mobile app`}>
        <header class="mobile-app-titlebar">
          <span>{$openApp.title}</span>
        </header>
        <ShortcutContent
          markdown={$openApp.markdown}
          pdfUrl={$openApp.pdfUrl}
          isContact={$openApp.isContact ?? false}
        />
      </section>
    {/if}
  </section>

  {#if isMenuOpen}
    <nav id="mobile-app-menu" class="mobile-app-menu" aria-label="Mobile apps">
      {#each shortcuts as shortcut (shortcut.id)}
        <button type="button" onclick={() => launchShortcut(shortcut)}>
          {shortcut.label}
        </button>
      {/each}
    </nav>
  {/if}

  <nav class="mobile-nav-bar" aria-label="Mobile navigation">
    <button class="mobile-nav-button" type="button" aria-label="Back" onclick={goHome}>‹</button>
    <button class="mobile-nav-button" type="button" aria-label="Home" onclick={goHome}>⌂</button>
    <button
      class="mobile-nav-button"
      type="button"
      aria-label="Menu"
      aria-expanded={isMenuOpen}
      aria-controls="mobile-app-menu"
      onclick={() => { isMenuOpen = !isMenuOpen; }}
    >☰</button>
  </nav>
</main>
