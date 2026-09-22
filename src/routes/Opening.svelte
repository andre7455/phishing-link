<script>
  import { onMount } from 'svelte';
  import Desktop from './Desktop.svelte';

  const welcomeMessage = 'Hey, Welcome';
  const typeDelayMs = 90;
  const continuePromptDelayMs = 750;

  let typedMessage = '';
  let isContinuePromptVisible = false;
  let isIntroComplete = false;

  onMount(() => {
    let characterIndex = 0;
    /** @type {number | undefined} */
    let continuePromptTimer;

    const finishIntro = () => {
      if (isContinuePromptVisible) {
        isIntroComplete = true;
      }
    };

    const typeTimer = window.setInterval(() => {
      characterIndex += 1;
      typedMessage = welcomeMessage.slice(0, characterIndex);

      if (characterIndex === welcomeMessage.length) {
        window.clearInterval(typeTimer);

        continuePromptTimer = window.setTimeout(() => {
          isContinuePromptVisible = true;
        }, continuePromptDelayMs);
      }
    }, typeDelayMs);

    window.addEventListener('keydown', finishIntro);
    window.addEventListener('pointerdown', finishIntro);

    return () => {
      window.clearInterval(typeTimer);

      if (continuePromptTimer !== undefined) {
        window.clearTimeout(continuePromptTimer);
      }

      window.removeEventListener('keydown', finishIntro);
      window.removeEventListener('pointerdown', finishIntro);
    };
  });
</script>

{#if !isIntroComplete}
  <main class="terminal-intro-screen" aria-label="Loading site">
    <div class="terminal-intro-content">
      <p class="terminal-typed-line" aria-live="polite">
        <span>{typedMessage}</span>
        <span class="terminal-cursor" aria-hidden="true"></span>
      </p>

      <p
        class="terminal-continue-prompt"
        class:opacity-100={isContinuePromptVisible}
        class:opacity-0={!isContinuePromptVisible}
        aria-hidden={!isContinuePromptVisible}
        data-testid="continue-prompt"
      >
        <span class="hidden sm:inline">Press any key to continue</span>
        <span class="sm:hidden">Tap the screen to continue</span>
      </p>
    </div>
  </main>
{:else}
  <Desktop />
{/if}
