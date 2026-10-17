import { describe, expect, it } from 'vitest';
import html from '../index.html?raw';

describe('page title', () => {
  it('names the browser tab André\'s desktop', () => {
    const page = new DOMParser().parseFromString(html, 'text/html');
    expect(page.title).toBe('André\'s desktop');
  });
});
