import { describe, expect, it } from 'vitest';
import compose from '../docker-compose.yaml?raw';
import dockerfile from '../Dockerfile?raw';

describe('Docker contact URL configuration', () => {
  it('passes the optional Compose URL into the frontend build argument', () => {

    expect(compose).toContain('VITE_CONTACT_URL: ${CONTACTFORM_URL:-}');
  });

  it('makes the build argument available when Vite builds the frontend', () => {

    expect(dockerfile).toContain('ARG VITE_CONTACT_URL=""');
    expect(dockerfile).toContain('RUN VITE_CONTACT_URL="$VITE_CONTACT_URL" npm run build');
    expect(dockerfile.indexOf('ARG VITE_CONTACT_URL')).toBeLessThan(
      dockerfile.indexOf('npm run build'),
    );
  });
});
