<script>
  export let endpoint = import.meta.env.VITE_CONTACT_URL ?? '';

  const emailPattern = '[^\\s@]+@[^\\s@]+\\.[^\\s@]+';
  let isSending = false;
  let status = '';

  /** @param {SubmitEvent} event */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement) || !form.reportValidity() || isSending) {
      return;
    }
    if (!endpoint.trim()) {
      status = 'The contact URL has not been configured yet. Your message was not sent.';
      return;
    }

    isSending = true;
    status = '';
    const data = new FormData(form);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
        }),
      });
      if (!response.ok) {
        throw new Error('Contact request failed');
      }
      status = 'Your message has been sent.';
      form.reset();
    } catch {
      status = 'Your message could not be sent. Please try again.';
    } finally {
      isSending = false;
    }
  };
</script>

<form class="flex max-w-lg flex-col gap-4" aria-label="Contact me" onsubmit={handleSubmit}>
  <h1 class="text-xl font-bold">Contact me</h1>
  <label class="flex flex-col gap-1">
    <span>Name</span>
    <input
      class="rounded border border-gray-400 bg-white p-2 text-black"
      name="name"
      autocomplete="name"
      required
    />
  </label>
  <label class="flex flex-col gap-1">
    <span>Email</span>
    <input
      class="rounded border border-gray-400 bg-white p-2 text-black"
      type="email"
      pattern={emailPattern}
      title="Enter an email address such as name@example.com"
      name="email"
      autocomplete="email"
      required
    />
  </label>
  <label class="flex flex-col gap-1">
    <span>Message</span>
    <textarea
      class="rounded border border-gray-400 bg-white p-2 text-black"
      name="message"
      rows="5"
      required
    ></textarea>
  </label>
  <p id="contact-status" class="text-sm" role="status">{status}</p>
  <button
    class="self-start rounded border border-gray-400 px-4 py-2 disabled:opacity-50"
    type="submit"
    aria-describedby="contact-status"
    disabled={isSending}
  >{isSending ? 'Sending…' : 'Send message'}</button>
</form>
