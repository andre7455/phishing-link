<script>
  import { onDestroy } from 'svelte';
  import ShortcutContent from './ShortcutContent.svelte';

  export let title;
  export let markdown;
  /** @type {string | null} */
  export let pdfUrl = null;
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

  let offsetX = 0;
  let offsetY = 0;
  let dragX = 0;
  let dragY = 0;
  let isDragging = false;

  $: frameStyle = isFullscreen ? '' : [
    `width: ${width}px; height: ${height}px;`,
    `translate: ${offsetX}px ${offsetY}px;`,
  ].join(' ');

  /** @param {PointerEvent} event */
  const moveFrame = (event) => {
    offsetX = event.clientX - dragX;
    offsetY = event.clientY - dragY;
  };

  const stopDragging = () => {
    isDragging = false;
    document.removeEventListener('pointermove', moveFrame);
    document.removeEventListener('pointerup', stopDragging);
    document.removeEventListener('pointercancel', stopDragging);
  };

  /** @param {PointerEvent} event */
  const startDragging = (event) => {
    if (isFullscreen || event.button > 0) {
      return;
    }

    dragX = event.clientX - offsetX;
    dragY = event.clientY - offsetY;
    isDragging = true;
    document.addEventListener('pointermove', moveFrame);
    document.addEventListener('pointerup', stopDragging);
    document.addEventListener('pointercancel', stopDragging);
    event.preventDefault();
  };

  /** @param {KeyboardEvent} event */
  const handleMoveKey = (event) => {
    if (isFullscreen) {
      return;
    }

    const step = event.shiftKey ? 40 : 10;
    switch (event.key) {
      case 'ArrowLeft': offsetX -= step; break;
      case 'ArrowRight': offsetX += step; break;
      case 'ArrowUp': offsetY -= step; break;
      case 'ArrowDown': offsetY += step; break;
      default: return;
    }
    event.preventDefault();
  };

  onDestroy(() => {
    stopDragging();
    document.removeEventListener('pointermove', handleResizeMove);
    document.removeEventListener('pointerup', handleResizeEnd);
  });

  const toggleFullscreen = () => {
    stopDragging();
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
    <button
      type="button"
      class="min-w-0 flex-1 touch-none select-none text-left cursor-move"
      aria-label={`Move ${title}`}
      onpointerdown={startDragging}
      onkeydown={handleMoveKey}
    >
      <span class="desktop-frame-title">{title}</span>
    </button>
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

  <div class="desktop-frame-body" class:pointer-events-none={isDragging}>
    <ShortcutContent {markdown} {pdfUrl} />
  </div>

  <button
    class="desktop-frame-resize-handle"
    class:desktop-frame-resize-handle-hidden={isFullscreen}
    type="button"
    aria-label={`Resize ${title}`}
    onpointerdown={handleResizeStart}
  ></button>
</section>
