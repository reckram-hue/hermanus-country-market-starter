// src/smoke.test.ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('runs a basic assertion and can access the DOM', () => {
    expect(1 + 1).toBe(2);
    const el = document.createElement('div');
    expect(el).toBeInstanceOf(HTMLElement);
  });
});