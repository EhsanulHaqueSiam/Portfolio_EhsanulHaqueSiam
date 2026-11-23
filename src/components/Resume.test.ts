import { describe, expect, it } from 'vitest';
import { addsToSummary } from './Resume';

describe('addsToSummary', () => {
  const summary = 'Shipped 4 production React websites, driving 1.5x client revenue growth.';
  it('drops a bullet whose bold number the summary already states', () => {
    expect(addsToSummary('Shipped sites that drove **1.5x client revenue growth**', summary)).toBe(false);
  });
  it('keeps a bullet with a new bold number', () => {
    expect(addsToSummary('Built Relay: **31 Agent SDK agents** behind 5 gates', summary)).toBe(true);
  });
  it('drops a bullet with no bold number', () => {
    expect(addsToSummary('Built RAG pipelines for tutoring backends', summary)).toBe(false);
  });
});
