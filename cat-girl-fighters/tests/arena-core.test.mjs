import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const here = path.dirname(fileURLToPath(import.meta.url));
const corePath = path.join(here, '..', 'arena-core.js');
const code = fs.readFileSync(corePath, 'utf8');
const sandbox = { console, Math, Date, module: { exports: {} }, exports: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const Core = sandbox.ArenaCore || sandbox.module.exports;
assert.ok(Core, 'ArenaCore should export');

function check(name, fn) {
  try { fn(); console.log('ok  ' + name); }
  catch (err) { console.error('FAIL ' + name + '\n  ' + err.message); process.exitCode = 1; }
}

check('roster has Shiroka speed and Ragna power with numeric damage', () => {
  const s = Core.CHAR.shiroka;
  const r = Core.CHAR.ragna;
  assert.equal(s.name, 'SHIROKA');
  assert.equal(r.name, 'RAGNA');
  assert.equal(s.isSpeed, true);
  assert.equal(r.isSpeed, false);
  assert.equal(typeof s.punchDamage, 'number');
  assert.equal(typeof r.specialDamage, 'number');
  assert.ok(s.speed > r.speed);
  assert.ok(r.punchDamage > s.punchDamage);
});

check('makeFighter copies stats and plants a body-sized hitbox, not a photo card', () => {
  const f = Core.makeFighter('shiroka', true, 200);
  assert.equal(f.hp, 100);
  assert.equal(f.punchDamage, 10);
  assert.ok(Array.isArray(f.punchDamage) === false);
  assert.ok(f.spriteW < 120, 'body width should be a silhouette, not a JPEG card');
  assert.ok(f.spriteH >= 280, 'bodies should occupy vertical arena space');
  assert.equal(f.state, 'idle');
});

check('every combat state has a pose', () => {
  for (const state of Core.STATES) {
    const pose = Core.poseForState(state, 'shiroka');
    assert.ok(pose, 'missing pose for ' + state);
    assert.equal(typeof pose.torso, 'number');
    assert.equal(typeof pose.lArmS, 'number');
  }
  assert.ok(Core.poseForState('punch', 'shiroka') === Core.POSES.claw);
  assert.ok(Core.poseForState('punch', 'ragna') === Core.POSES.haymaker);
});

check('attackWeight stays in 0..1 and peaks in the active window', () => {
  assert.equal(Core.attackWeight(-1, 0.48), 0);
  assert.ok(Core.attackWeight(0.05, 0.48) > 0);
  const peak = Core.attackWeight(0.31, 0.48);
  assert.ok(peak > 0.8);
  assert.ok(peak <= 1);
  assert.ok(Core.attackWeight(0.22, 0.48) > 0.6);
  assert.equal(Core.attackWeight(0.48, 0.48), 0);
});

check('computeHit misses out of range and connects when facing in range', () => {
  const atk = Core.makeFighter('shiroka', true, 100);
  const def = Core.makeFighter('ragna', false, 400);
  atk.state = 'punch'; atk.facing = 1;
  let miss = Core.computeHit(atk, def);
  assert.equal(miss.hit, false);
  def.x = 180;
  let hit = Core.computeHit(atk, def);
  assert.equal(hit.hit, true);
  assert.equal(hit.blocked, false);
  assert.equal(hit.move, 'silver-claw');
  assert.ok(hit.dmg > 0);
});

check('block chips damage and Ragna special is an uppercut', () => {
  const atk = Core.makeFighter('ragna', true, 100);
  const def = Core.makeFighter('shiroka', false, 180);
  atk.state = 'special'; atk.facing = 1;
  def.state = 'block';
  const blocked = Core.computeHit(atk, def);
  assert.equal(blocked.hit, true);
  assert.equal(blocked.blocked, true);
  assert.ok(blocked.dmg < atk.specialDamage);
  def.state = 'idle';
  atk.atkHit = false;
  const raw = Core.computeHit(atk, def);
  assert.equal(raw.isUpper, true);
  assert.equal(raw.move, 'crimson-uppercut');
  Core.applyHit(atk, def, raw);
  assert.equal(def.state, 'flop');
  assert.ok(def.hp < 100);
});

check('pose interpolation and idle animation produce finite joint angles', () => {
  const f = Core.makeFighter('shiroka', true, 200);
  const a = Core.getPose(f, 0);
  const b = Core.getPose(f, 800);
  assert.notEqual(a.tail, b.tail);
  f.state = 'punch'; f.st = 0.2;
  const claw = Core.getPose(f, 1000);
  for (const k in claw) assert.equal(Number.isFinite(claw[k]), true, k);
});

check('power duration and speed modifiers stay character-specific', () => {
  const s = Core.makeFighter('shiroka', true, 100);
  const r = Core.makeFighter('ragna', false, 200);
  s.power = true; r.power = true;
  assert.ok(Core.powerDuration('shiroka') > Core.powerDuration('ragna'));
  assert.ok(Core.speedFor(s) > s.speed);
  assert.ok(Core.speedFor(r) < r.speed);
});

if (process.exitCode) {
  console.error('\nSome arena-core tests failed.');
  process.exit(1);
}
console.log('\nAll arena-core tests passed.');
