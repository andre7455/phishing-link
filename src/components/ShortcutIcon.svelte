<script>
  export let iconPath;
  /** @type {string | null} */
  export let faviconPath = null;
  export let imageClass = 'shortcut-icon-image';

  /** @type {string | null} */
  let failedFavicon = null;
  $: imageSource = faviconPath && failedFavicon !== faviconPath ? faviconPath : iconPath;
</script>

<img
  class={imageClass}
  src={imageSource}
  alt=""
  referrerpolicy="no-referrer"
  onerror={() => {
    failedFavicon = faviconPath;
  }}
/>
