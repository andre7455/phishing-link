<script>
  import { onMount } from 'svelte';
  import Home from './Home.svelte';

  const welcomeMessage = 'Hey, Welcome';
  const typeDelayMs = 90;
  const continuePromptDelayMs = 750;
  const startupCookieName = 'portfolioStartupSeen';
  const startupCookieValue = 'true';

  let typedMessage = '';
  let isContinuePromptVisible = false;
  let isIntroComplete = false;

  const hasStartupCookie = () => document.cookie
    .split('; ')
    .some((cookie) => cookie === `${startupCookieName}=${startupCookieValue}`);

  const setStartupCookie = () => {
    document.cookie = [
      `${startupCookieName}=${startupCookieValue}`,
      'max-age=31536000',
      'path=/',
      'SameSite=Lax',
    ].join('; ');
  };

  onMount(() => {
    if (hasStartupCookie()) {
      isIntroComplete = true;
      return undefined;
    }

    let characterIndex = 0;
    /** @type {number | undefined} */
    let continuePromptTimer;

    const finishIntro = () => {
      if (isContinuePromptVisible) {
        setStartupCookie();
        isIntroComplete = true;
      }
    };

    const typeTimer = globalThis.setInterval(() => {
      characterIndex += 1;
      typedMessage = welcomeMessage.slice(0, characterIndex);

      if (characterIndex === welcomeMessage.length) {
        globalThis.clearInterval(typeTimer);

        continuePromptTimer = globalThis.setTimeout(() => {
          isContinuePromptVisible = true;
        }, continuePromptDelayMs);
      }
    }, typeDelayMs);

    document.addEventListener('keydown', finishIntro);
    document.addEventListener('pointerdown', finishIntro);

    return () => {
      globalThis.clearInterval(typeTimer);

      if (continuePromptTimer !== undefined) {
        globalThis.clearTimeout(continuePromptTimer);
      }

      document.removeEventListener('keydown', finishIntro);
      document.removeEventListener('pointerdown', finishIntro);
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
  <Home />
{/if}
