<!-- eslint-disable svelte/no-at-html-tags -->
<script>
  import { marked } from 'marked';

  export let markdown;

  $: renderedMarkdown = marked.parse(markdown, {
    async: false,
  });
</script>

<article class="shortcut-content">
  {@html renderedMarkdown}
</article>
