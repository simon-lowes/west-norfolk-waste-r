// Jev "Snap it": photo of an item -> bin, with a 'none of these' companion check.
// Jev judges; code decides. All questions and thresholds live in this module.
//
// OFF unless EXPO_PUBLIC_JEV_PROXY_URL is set. The app never holds the TypeSafe
// key: the proxy (your own server/function) adds `Authorization: Bearer
// <TYPESAFE_API_KEY>` and the `TypeSafe-Danger-Zone-Images: true` header, then
// forwards the body to POST https://api.typesafe.ai/v1/systemone.
// Any failure returns null, so callers keep today's text search behaviour.
import { BinType, WasteItem, getBinTypeName } from '../types';

export const JEV_THRESHOLDS = {
  oneItemMin: 0.6,   // below: ask the user to photograph one thing
  anyFitsMin: 0.5,   // below: show top two + 'check the council A-Z'
  confidentBin: 0.8, // above: show the bin badge
} as const;

const BINS: BinType[] = [
  BinType.GENERAL,
  BinType.RECYCLING,
  BinType.GARDEN,
  BinType.FOOD,
  BinType.RECYCLING_CENTRE,
];

export function getJevProxyUrl(): string | null {
  const url = process.env.EXPO_PUBLIC_JEV_PROXY_URL;
  return url && url.trim() ? url.trim() : null;
}

export function buildSnapRequest(imageBase64: string, format: 'png' | 'jpg', items: WasteItem[]) {
  const criteria = BINS.map((bin) => {
    const examples = items.filter((i) => i.binType === bin).slice(0, 12).map((i) => i.name);
    return `${bin}: ${getBinTypeName(bin)}. Examples: ${examples.join(', ') || 'none listed'}`;
  }).join('\n');
  return {
    model: process.env.EXPO_PUBLIC_JEV_MODEL || 'jev-latest',
    state: 'Photo of a household item in West Norfolk: {{photo}}',
    assets: { '{{photo}}': { type: 'image', format, data_base64: imageBase64 } },
    questions: {
      bin: {
        type: 'choice',
        instructions: 'Which West Norfolk bin or service should the main item in the photo go in?',
        criteria: { options: BINS, guidance: criteria },
      },
      any_fits: { type: 'noul', instructions: 'Does any listed option clearly fit the item in the photo?' },
      one_item: { type: 'noul', instructions: 'Does the photo show a single main item?' },
      item: { type: 'box', instructions: 'Draw a box around the main item you judged.' },
    },
  };
}

export type SnapDecision =
  | { kind: 'retake' }
  | { kind: 'unsure'; top: BinType[] } // show top two + link to text search / council A-Z
  | { kind: 'bin'; bin: BinType; box?: { top: number; bottom: number; left: number; right: number } };

// Pure: maps Jev's answers to what the app shows. Returns null on malformed answers.
export function decideSnap(answers: any): SnapDecision | null {
  const oneItem = answers?.one_item?.noul;
  const anyFits = answers?.any_fits?.noul;
  const probs: Record<string, number> | undefined = answers?.bin?.probabilities;
  if (typeof oneItem !== 'number' || typeof anyFits !== 'number' || !probs) return null;
  if (oneItem < JEV_THRESHOLDS.oneItemMin) return { kind: 'retake' };
  const ranked = (Object.entries(probs) as [BinType, number][])
    .filter(([b]) => BINS.includes(b))
    .sort((a, b) => b[1] - a[1]);
  if (!ranked.length) return null;
  const [best, p] = ranked[0];
  if (anyFits < JEV_THRESHOLDS.anyFitsMin || p <= JEV_THRESHOLDS.confidentBin) {
    return { kind: 'unsure', top: ranked.slice(0, 2).map(([b]) => b) };
  }
  return { kind: 'bin', bin: best, box: answers?.item?.box };
}

export async function snapToBin(
  imageBase64: string,
  format: 'png' | 'jpg',
  items: WasteItem[],
  fetchImpl: typeof fetch = fetch,
): Promise<SnapDecision | null> {
  const url = getJevProxyUrl();
  if (!url) return null;
  try {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildSnapRequest(imageBase64, format, items)),
    });
    if (!res.ok) return null;
    const json: any = await res.json();
    return decideSnap(json?.answers ?? json);
  } catch {
    return null;
  }
}
