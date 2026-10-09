<script>
  import { onDestroy } from 'svelte';
  import ShortcutIcon from './ShortcutIcon.svelte';

  export let label;
  export let iconPath;
  /** @type {string | null} */
  export let faviconPath = null;
  export let variant = 'desktop';
  export let initialX = 16;
  export let initialY = 16;
  /** @type {() => void} */
  export let onOpen = () => {};
  /** @type {(position: { x: number, y: number }) => void} */
  export let onMove = () => {};

  let x = initialX;
  let y = initialY;
  let dragStartX = 0;
  let dragStartY = 0;
  let shortcutStartX = 0;
  let shortcutStartY = 0;
  let hasMoved = false;

  $: isDesktop = variant === 'desktop';
  $: shortcutClass = variant === 'mobile' ? 'mobile-shortcut-button' : 'desktop-shortcut';
  $: iconClass = variant === 'mobile' ? 'mobile-shortcut-icon' : 'desktop-shortcut-icon';
  $: labelClass = variant === 'mobile' ? 'mobile-shortcut-label' : 'desktop-shortcut-label';
  $: shortcutStyle = isDesktop ? `left: ${x}px; top: ${y}px;` : '';

  /** @param {PointerEvent} event */
  const handlePointerMove = (event) => {
    const deltaX = event.clientX - dragStartX;
    const deltaY = event.clientY - dragStartY;

    hasMoved = hasMoved || Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4;
    x = Math.max(0, shortcutStartX + deltaX);
    y = Math.max(0, shortcutStartY + deltaY);
    onMove({ x, y });
  };

  const stopDragging = () => {
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
    document.removeEventListener('pointercancel', stopDragging);
  };

  onDestroy(stopDragging);

  /** @param {PointerEvent} event */
  const handlePointerUp = (event) => {
    if (isDesktop) {
      stopDragging();
    }

    if (!hasMoved) {
      onOpen();
    }

    event.preventDefault();
  };

  /** @param {PointerEvent} event */
  const handlePointerDown = (event) => {
    if (!isDesktop) {
      hasMoved = false;
      return;
    }

    dragStartX = event.clientX;
    dragStartY = event.clientY;
    shortcutStartX = x;
    shortcutStartY = y;
    hasMoved = false;

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', stopDragging);
    event.preventDefault();
  };

  /** @param {KeyboardEvent} event */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen();
    }
  };
</script>

<button
  class={shortcutClass}
  style={shortcutStyle}
  type="button"
  aria-label={`Open ${label}`}
  onpointerdown={handlePointerDown}
  onpointerup={isDesktop ? undefined : handlePointerUp}
  onkeydown={handleKeyDown}
>
  <span class={iconClass} aria-hidden="true">
    <ShortcutIcon {iconPath} {faviconPath} />
  </span>
  <span class={labelClass}>{label}</span>
</button>
