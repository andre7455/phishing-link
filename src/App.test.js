import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import App from './App.svelte';

describe('App', () => {
  it('renders the under construction page', () => {
    render(App);

    expect(screen.getByText('Under construction')).toBeInTheDocument();
    expect(screen.getByText('Come back later!')).toBeInTheDocument();
    expect(screen.getByText('Last updated: april 2025')).toBeInTheDocument();
    expect(screen.getByAltText('funny meme')).toHaveAttribute(
      'src',
      '/assets/pictures/9XryZQt2.png',
    );
  });
});
