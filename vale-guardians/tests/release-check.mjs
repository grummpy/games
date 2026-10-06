import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const core = fs.readFileSync(path.join(root, 'vale-core.js'), 'utf8');

for (const text of [
  '<script src="vale-core.js"></script>',
  'id="seedInput"',
  'V.fixedSteps(simulationAccumulator, elapsed)',
  'function setPaused(paused)',
  "window.addEventListener('blur'",
  'V.projectileCanDamage(pr, target, gameMode)',
  'V.duelOutcome(players)',
  'frame = 0;',
  'V.clampToLeash',
  'V.cameraFocus(players)',
  'V.requiredRoutesReachable'
]) assert.ok(html.includes(text), 'release check missing: ' + text);

assert.ok(!html.includes('setTimeout(() => {\n          state = \'victory\''), 'boss completion must use the fixed simulation clock');
assert.ok(!core.includes('total = 0;'), 'fixed tick helper must retain capped-frame remainder');
assert.ok(!html.includes('Math.min(0.25, Math.max(0, (ts - lastTime) / 1000))'), 'render loop must not discard elapsed simulation time');
console.log('Vale Guardians fixed-step/mode/route release checks passed.');
