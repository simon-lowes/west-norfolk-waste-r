import { decideSnap, snapToBin } from '../jevSnap';
import { BinType } from '../../types';

const ans = (o: number, f: number, probs: Record<string, number>) => ({
  one_item: { noul: o }, any_fits: { noul: f }, bin: { choice: 'x', probabilities: probs },
});

describe('jevSnap', () => {
  it('asks for a retake when not one item', () => {
    expect(decideSnap(ans(0.3, 0.9, { recycling: 0.9 }))).toEqual({ kind: 'retake' });
  });
  it('is unsure when nothing fits or low confidence', () => {
    expect(decideSnap(ans(0.9, 0.2, { recycling: 0.9, general: 0.1 }))?.kind).toBe('unsure');
    expect(decideSnap(ans(0.9, 0.9, { recycling: 0.6, general: 0.4 }))).toEqual({
      kind: 'unsure', top: [BinType.RECYCLING, BinType.GENERAL],
    });
  });
  it('picks the bin when confident', () => {
    expect(decideSnap(ans(0.9, 0.9, { recycling: 0.95 }))?.kind).toBe('bin');
  });
  it('returns null on malformed answers', () => {
    expect(decideSnap({})).toBeNull();
  });
  it('is off without a proxy url', async () => {
    delete process.env.EXPO_PUBLIC_JEV_PROXY_URL;
    const f = jest.fn();
    expect(await snapToBin('x', 'jpg', [], f as any)).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });
  it('falls back on fetch failure', async () => {
    process.env.EXPO_PUBLIC_JEV_PROXY_URL = 'https://proxy.example';
    const f = jest.fn().mockRejectedValue(new Error('down'));
    expect(await snapToBin('x', 'jpg', [], f as any)).toBeNull();
    delete process.env.EXPO_PUBLIC_JEV_PROXY_URL;
  });
});
