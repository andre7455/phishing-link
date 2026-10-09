<!-- eslint-disable svelte/no-at-html-tags -->
<script>
  import { marked } from 'marked';

  export let markdown = '';
  /** @type {string | null} */
  export let pdfUrl = null;

  $: renderedMarkdown = marked.parse(markdown, {
    async: false,
  });
</script>

<article class="shortcut-content">
  {#if pdfUrl !== null}
    <a class="text-blue-700 underline" href={pdfUrl}>Open or download PDF</a>
    <iframe class="h-full min-h-96 w-full border-0" src={pdfUrl} title="PDF document"></iframe>
  {:else}
    {@html renderedMarkdown}
  {/if}
</article>
