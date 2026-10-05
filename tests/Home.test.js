import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Home from '../src/routes/Home.svelte';

describe('Home', () => {
  it('renders desktop and mobile shells for responsive layouts', () => {
    render(Home);

    expect(screen.getByLabelText('Desktop')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile home')).toBeInTheDocument();
  });
});
