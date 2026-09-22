<script>
  import DesktopShortcut from '../components/DesktopShortcut.svelte';
  import StartMenuBar from '../components/StartMenuBar.svelte';
</script>

<main class="desktop-page" aria-label="Desktop">
  <section class="desktop-workspace" aria-label="Desktop workspace">
    <DesktopShortcut label="About me" icon="☻" />
  </section>
  <StartMenuBar />
</main>
