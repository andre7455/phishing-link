<script>
  export let label;
  export let icon = '▣';
</script>

<button class="desktop-shortcut" type="button" aria-label={`Open ${label}`}>
  <span class="desktop-shortcut-icon" aria-hidden="true">{icon}</span>
  <span class="desktop-shortcut-label">{label}</span>
</button>
