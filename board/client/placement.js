// Pure mapping from pipeline (stage,status) to a visual zone. No WebGL, so it
// is unit-tested directly with node --test.

export const STAGE_INDEX = { pad: 0, build: 1, test: 2, clearance: 3, liftoff: 4 };
const LAST = 4;

export function placement({ stage, status } = {}) {
  if (status === 'failed' || status === 'aborted') return { zone: 'grounded', t: 0 };
  if (stage === 'liftoff' && (status === 'passed' || status === 'shipped')) return { zone: 'orbit', t: 1 };
  const idx = STAGE_INDEX[stage] ?? 0;
  return { zone: 'ascending', t: idx / LAST };
}
