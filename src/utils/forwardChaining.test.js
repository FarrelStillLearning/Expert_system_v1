import { describe, it, expect } from 'vitest';
import { inferDamage } from './forwardChaining';

const mockRules = [
  { id: 1, condition: ['A', 'B'], conclusion: 'X' },
  { id: 2, condition: ['X', 'C'], conclusion: 'Y' }
];

const mockDamage = [
  { id: 'X', name: 'Damage X' },
  { id: 'Y', name: 'Damage Y' }
];

const mockGetSolution = (id) => `sol-${id}`;

describe('inferDamage', () => {
  it('infers single-level conclusions', () => {
    const res = inferDamage(['A', 'B'], mockRules, mockDamage, mockGetSolution);
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe('X');
    expect(res[0].solution).toBe('sol-X');
  });

  it('infers multi-level conclusions (chaining)', () => {
    const res = inferDamage(['A', 'B', 'C'], mockRules, mockDamage, mockGetSolution);
    // X then Y
    expect(res.map(r => r.id)).toEqual(['X','Y']);
  });

  it('returns empty array when no rules match', () => {
    const res = inferDamage(['Z'], mockRules, mockDamage, mockGetSolution);
    expect(res).toHaveLength(0);
  });
});
