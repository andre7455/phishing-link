<script>
  import ShortcutContent from './ShortcutContent.svelte';

  export let title;
  export let markdown;
  /** @type {() => void} */
  export let onClose = () => {};

  const minWidth = 320;
  const minHeight = 220;

  let width = 672;
  let height = 420;
  let startWidth = width;
  let startHeight = height;
  let resizeStartX = 0;
  let resizeStartY = 0;
  let isFullscreen = false;

  $: frameStyle = isFullscreen ? '' : `width: ${width}px; height: ${height}px;`;

  const toggleFullscreen = () => {
    isFullscreen = !isFullscreen;
  };

  /** @param {PointerEvent} event */
  const handleResizeMove = (event) => {
    const deltaX = event.clientX - resizeStartX;
    const deltaY = event.clientY - resizeStartY;

    width = Math.max(minWidth, startWidth + deltaX);
    height = Math.max(minHeight, startHeight + deltaY);
  };

  /** @param {PointerEvent} event */
  const handleResizeEnd = (event) => {
    document.removeEventListener('pointermove', handleResizeMove);
    document.removeEventListener('pointerup', handleResizeEnd);
    event.preventDefault();
  };

  /** @param {PointerEvent} event */
  const handleResizeStart = (event) => {
    if (isFullscreen) {
      return;
    }

    resizeStartX = event.clientX;
    resizeStartY = event.clientY;
    startWidth = width;
    startHeight = height;

    document.addEventListener('pointermove', handleResizeMove);
    document.addEventListener('pointerup', handleResizeEnd);
    event.preventDefault();
  };
</script>

<section
  class="desktop-frame"
  class:desktop-frame-fullscreen={isFullscreen}
  style={frameStyle}
  aria-label={`${title} desktop frame`}
>
  <header class="desktop-frame-titlebar">
    <h2 class="desktop-frame-title">{title}</h2>
    <div class="desktop-frame-actions">
      <button
        class="desktop-frame-action"
        type="button"
        aria-label={`${isFullscreen ? 'Restore' : 'Fullscreen'} ${title}`}
        onclick={toggleFullscreen}
      >
        {isFullscreen ? '❐' : '□'}
      </button>
      <button
        class="desktop-frame-action"
        type="button"
        aria-label={`Close ${title}`}
        onclick={onClose}
      >
        ×
      </button>
    </div>
  </header>

  <div class="desktop-frame-body">
    <ShortcutContent {markdown} />
  </div>

  <button
    class="desktop-frame-resize-handle"
    class:desktop-frame-resize-handle-hidden={isFullscreen}
    type="button"
    aria-label={`Resize ${title}`}
    onpointerdown={handleResizeStart}
  ></button>
</section>
