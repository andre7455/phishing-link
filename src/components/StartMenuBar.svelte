<script>
  import { onMount } from 'svelte';

  const startLabel = 'Start';

  const timeFormatter = new Intl.DateTimeFormat('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  let currentDate = new Date();

  /** @param {Date} date */
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  /** @param {Date} date */
  const formatTime = (date) => timeFormatter.format(date);

  onMount(() => {
    const updateClock = () => {
      currentDate = new Date();
    };

    updateClock();

    const clockTimer = window.setInterval(updateClock, 1000);

    return () => {
      window.clearInterval(clockTimer);
    };
  });
</script>

<nav class="start-menu-bar" aria-label="Desktop taskbar">
  <button class="start-button" type="button" aria-label="Open start menu">
    <span aria-hidden="true">▣</span>
    <span>{startLabel}</span>
  </button>

  <div class="taskbar-spacer" aria-hidden="true"></div>

  <time class="taskbar-clock" datetime={currentDate.toISOString()} aria-label="System clock">
    <span>{formatTime(currentDate)}</span>
    <span>{formatDate(currentDate)}</span>
  </time>
</nav>
