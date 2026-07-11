import { test } from 'node:test';
import assert from 'node:assert/strict';
import { placement } from './placement.js';

test('failed/aborted → grounded at any stage', () => {
  assert.deepEqual(placement({ stage: 'liftoff', status: 'failed' }), { zone: 'grounded', t: 0 });
  assert.deepEqual(placement({ stage: 'test', status: 'aborted' }), { zone: 'grounded', t: 0 });
});

test('liftoff + passed/shipped → orbit', () => {
  assert.deepEqual(placement({ stage: 'liftoff', status: 'shipped' }), { zone: 'orbit', t: 1 });
  assert.deepEqual(placement({ stage: 'liftoff', status: 'passed' }), { zone: 'orbit', t: 1 });
});

test('running stages → ascending, height by stage index', () => {
  assert.deepEqual(placement({ stage: 'pad', status: 'running' }), { zone: 'ascending', t: 0 });
  assert.deepEqual(placement({ stage: 'test', status: 'running' }), { zone: 'ascending', t: 0.5 });
  assert.deepEqual(placement({ stage: 'liftoff', status: 'running' }), { zone: 'ascending', t: 1 });
});

test('unknown stage falls back to pad height', () => {
  assert.deepEqual(placement({ stage: 'bogus', status: 'running' }), { zone: 'ascending', t: 0 });
});
