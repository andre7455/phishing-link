<script>
  import { onMount } from 'svelte';

  export let shortcuts = [];
  /** @type {(shortcut: import('../lib/shortcuts.js').Shortcut) => void} */
  export let onOpenShortcut = () => {};

  const startLabel = 'Start';

  const timeFormatter = new Intl.DateTimeFormat('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  let currentDate = new Date();
  let isStartMenuOpen = false;

  /** @param {Date} date */
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  /** @param {Date} date */
  const formatTime = (date) => timeFormatter.format(date);

  /** @param {import('../lib/shortcuts.js').Shortcut} shortcut */
  const openShortcut = (shortcut) => {
    onOpenShortcut(shortcut);
    isStartMenuOpen = false;
  };

  onMount(() => {
    const updateClock = () => {
      currentDate = new Date();
    };

    updateClock();

    const clockTimer = globalThis.setInterval(updateClock, 1000);

    return () => {
      globalThis.clearInterval(clockTimer);
    };
  });
</script>

<nav class="start-menu-bar" aria-label="Desktop taskbar">
  {#if isStartMenuOpen}
    <section class="start-menu-panel" aria-label="Start menu">
      <header class="start-menu-header">Portfolio</header>
      <div class="start-menu-items">
        {#each shortcuts as shortcut (shortcut.id)}
          <button class="start-menu-item" type="button" onclick={() => openShortcut(shortcut)}>
            <img class="start-menu-item-icon" src={shortcut.iconPath} alt="" />
            <span>{shortcut.label}</span>
          </button>
        {/each}
      </div>
    </section>
  {/if}

  <button
    class="start-button"
    type="button"
    aria-label="Open start menu"
    aria-expanded={isStartMenuOpen}
    onclick={() => {
      isStartMenuOpen = !isStartMenuOpen;
    }}
  >
    <span aria-hidden="true">▣</span>
    <span>{startLabel}</span>
  </button>

  <div class="taskbar-spacer" aria-hidden="true"></div>

  <time class="taskbar-clock" datetime={currentDate.toISOString()} aria-label="System clock">
    <span>{formatTime(currentDate)}</span>
    <span>{formatDate(currentDate)}</span>
  </time>
</nav>
