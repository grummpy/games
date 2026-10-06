import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sandbox = { module: { exports: {} }, exports: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'vale-core.js'), 'utf8'), sandbox);
const Core = sandbox.ValeCore || sandbox.module.exports;

function check(name, fn) {
  try { fn(); console.log('ok  ' + name); }
  catch (error) { console.error('FAIL ' + name + '\n  ' + error.message); process.exitCode = 1; }
}

check('seeded random map/spawn sequence is reproducible', () => {
  const a = Core.createRng('same-seed');
  const b = Core.createRng('same-seed');
  assert.deepEqual(Array.from({ length: 8 }, () => a()), Array.from({ length: 8 }, () => b()));
});

check('fixed tick accounting carries remainder and caps a stalled frame', () => {
  let result = Core.fixedSteps(0, 1 / 120);
  assert.equal(result.steps, 0);
  result = Core.fixedSteps(result.accumulator, 1 / 120);
  assert.equal(result.steps, 1);
  assert.equal(result.accumulator, 0);
  assert.equal(Core.fixedSteps(0, 2).steps, Core.MAX_SIMULATION_STEPS);
});

check('required routes, co-op leash, and survivor camera are deterministic', () => {
  const map = Array.from({ length: 4 }, () => Array(5).fill(0));
  map[1][2] = 2;
  assert.equal(Core.requiredRoutesReachable(map, 5, 4, { x: 0, y: 0 }, [{ x: 4, y: 0 }, { x: 0, y: 3 }]), true);
  const leashed = Core.clampToLeash({ x: 400, y: 0 }, { x: 0, y: 0 }, 100);
  assert.deepEqual(JSON.parse(JSON.stringify(leashed)), { x: 100, y: 0, leashed: true });
  const camera = Core.cameraFocus([{ id: 0, isHuman: true, hp: 0, x: 0, y: 0 }, { id: 1, isHuman: true, hp: 3, x: 90, y: 40 }]);
  assert.deepEqual(JSON.parse(JSON.stringify(camera)), { x: 90, y: 40, ids: [1] });
});

check('duel team projectiles and draw/winner rules cannot affect co-op teammates', () => {
  const projectile = { ownerId: 0, team: 'p1' };
  assert.equal(Core.projectileCanDamage(projectile, { kind: 'hero', id: 1, team: 'p2', hp: 1 }, 'pvp'), true);
  assert.equal(Core.projectileCanDamage(projectile, { kind: 'hero', id: 1, team: 'p1', hp: 1 }, 'coop'), false);
  assert.equal(Core.canUseAbility({ hp: 2, attacking: false, attackCd: 0 }, 'pvp'), true);
  assert.deepEqual(JSON.parse(JSON.stringify(Core.duelOutcome([{ id: 0, hp: 0 }, { id: 1, hp: 0 }]))), { type: 'draw' });
  assert.deepEqual(JSON.parse(JSON.stringify(Core.duelOutcome([{ id: 0, hp: 0 }, { id: 1, hp: 2 }]))), { type: 'winner', winnerId: 1 });
});

if (process.exitCode) process.exit(1);
console.log('All Vale core tests passed.');
