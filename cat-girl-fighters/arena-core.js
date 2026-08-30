/* Cat Girl Fighters — shared combat, pose, and fighter-state core.
   Loaded by index.html in the browser and by tests/arena-core.test.mjs in Node. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.ArenaCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const CHAR = {
    shiroka: {
      name: 'SHIROKA', color: '#00e8ff', alt: '#9ef6ff', speed: 5.2, jump: 14,
      punchDamage: 10, kickDamage: 13, specialDamage: 26, range: 110, isSpeed: true,
      skin: '#f7d9cb', skinShadow: '#e8b7a4', hair: '#e8f0f6', hairDark: '#9db0c2',
      eye: '#ff4d7a', accent: '#00e8ff', title: 'SILVER CLAW', role: 'SPEED'
    },
    ragna: {
      name: 'RAGNA', color: '#ff3db4', alt: '#ff9ad8', speed: 4.0, jump: 12,
      punchDamage: 14, kickDamage: 17, specialDamage: 32, range: 125, isSpeed: false,
      skin: '#f0c4b0', skinShadow: '#dca089', hair: '#ff4ec8', hairDark: '#c01880',
      eye: '#ff66ee', accent: '#ff3db4', title: 'CRIMSON FANG', role: 'POWER'
    }
  };

  const ATTACK_WINDUP = 0.10;
  const ATTACK_ACTIVE_END = 0.32;
  const ATTACK_RECOVER = 0.48;
  const STATES = ['idle', 'walk', 'punch', 'kick', 'block', 'hit', 'jump', 'slide', 'power', 'special', 'flop'];

  const POSES = {
    idle: {
      hip: 0.04, torso: 0.06, head: -0.04,
      lArmS: 0.55, lArmE: 0.85, rArmS: -0.35, rArmE: 0.95,
      lLegH: 0.18, lLegK: 0.28, rLegH: -0.12, rLegK: 0.18,
      tail: 0.55, ear: 0.08
    },
    walk: {
      hip: 0.02, torso: 0.10, head: 0.02,
      lArmS: 0.70, lArmE: 0.55, rArmS: -0.55, rArmE: 0.55,
      lLegH: 0.55, lLegK: 0.45, rLegH: -0.45, rLegK: 0.20,
      tail: 0.35, ear: 0.12
    },
    punchWind: {
      hip: 0.10, torso: -0.28, head: -0.12,
      lArmS: 1.15, lArmE: 1.35, rArmS: -1.05, rArmE: 0.40,
      lLegH: 0.35, lLegK: 0.40, rLegH: -0.25, rLegK: 0.18,
      tail: 0.75, ear: 0.18
    },
    claw: {
      hip: -0.08, torso: 0.42, head: 0.10,
      lArmS: -0.15, lArmE: 0.20, rArmS: 0.15, rArmE: 0.10,
      lLegH: -0.05, lLegK: 0.12, rLegH: 0.42, rLegK: 0.35,
      tail: 1.05, ear: 0.22
    },
    haymaker: {
      hip: -0.12, torso: 0.55, head: 0.16,
      lArmS: -0.40, lArmE: 0.25, rArmS: 0.85, rArmE: 1.20,
      lLegH: -0.18, lLegK: 0.10, rLegH: 0.50, rLegK: 0.40,
      tail: 0.90, ear: 0.16
    },
    kickWind: {
      hip: 0.18, torso: -0.22, head: -0.08,
      lArmS: 0.90, lArmE: 0.70, rArmS: -0.80, rArmE: 0.55,
      lLegH: -0.15, lLegK: 0.20, rLegH: 0.95, rLegK: 1.40,
      tail: 0.20, ear: 0.14
    },
    kick: {
      hip: -0.05, torso: 0.18, head: 0.08,
      lArmS: -0.55, lArmE: 0.40, rArmS: 0.85, rArmE: 0.50,
      lLegH: 0.15, lLegK: 0.20, rLegH: -1.35, rLegK: 0.12,
      tail: 1.15, ear: 0.20
    },
    block: {
      hip: 0.16, torso: 0.02, head: -0.10,
      lArmS: 0.15, lArmE: 1.55, rArmS: -0.05, rArmE: 1.60,
      lLegH: 0.32, lLegK: 0.55, rLegH: 0.10, rLegK: 0.40,
      tail: 0.30, ear: -0.06
    },
    hit: {
      hip: -0.18, torso: -0.45, head: -0.35,
      lArmS: 1.40, lArmE: 0.50, rArmS: -1.25, rArmE: 0.35,
      lLegH: 0.25, lLegK: 0.15, rLegH: -0.20, rLegK: 0.10,
      tail: -0.40, ear: -0.18
    },
    jump: {
      hip: 0, torso: -0.05, head: 0.08,
      lArmS: -0.70, lArmE: 0.40, rArmS: 0.55, rArmE: 0.45,
      lLegH: 0.55, lLegK: 0.95, rLegH: 0.35, rLegK: 0.80,
      tail: 0.80, ear: 0.22
    },
    slide: {
      hip: 0.85, torso: 0.35, head: 0.20,
      lArmS: 0.40, lArmE: 0.70, rArmS: -0.60, rArmE: 0.50,
      lLegH: 0.10, lLegK: 0.15, rLegH: 1.15, rLegK: 0.25,
      tail: 1.40, ear: 0.10
    },
    power: {
      hip: 0.08, torso: -0.12, head: -0.18,
      lArmS: -1.35, lArmE: 0.25, rArmS: 1.45, rArmE: 0.20,
      lLegH: 0.28, lLegK: 0.35, rLegH: -0.22, rLegK: 0.18,
      tail: 0.95, ear: 0.28
    },
    special: {
      hip: -0.20, torso: 0.25, head: -0.22,
      lArmS: -0.20, lArmE: 0.15, rArmS: -1.55, rArmE: 0.12,
      lLegH: 0.45, lLegK: 0.55, rLegH: -0.15, rLegK: 0.12,
      tail: 1.20, ear: 0.24
    },
    flop: {
      hip: 1.15, torso: 0.55, head: 0.40,
      lArmS: 1.60, lArmE: 0.40, rArmS: -1.50, rArmE: 0.30,
      lLegH: 0.70, lLegK: 0.40, rLegH: -0.35, rLegK: 0.20,
      tail: -0.55, ear: -0.10
    },
    embrace: {
      hip: 0.06, torso: 0.22, head: 0.12,
      lArmS: 0.45, lArmE: 1.10, rArmS: 0.15, rArmE: 1.25,
      lLegH: 0.12, lLegK: 0.22, rLegH: -0.08, rLegK: 0.16,
      tail: 0.70, ear: 0.06
    }
  };

  function clonePose(p) {
    const o = {};
    for (const k in p) o[k] = p[k];
    return o;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function lerpPose(a, b, t) {
    const o = {};
    for (const k in a) o[k] = lerp(a[k], b[k] !== undefined ? b[k] : a[k], t);
    return o;
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function attackWeight(st, duration) {
    const wind = ATTACK_WINDUP;
    const active = ATTACK_ACTIVE_END;
    const rec = duration;
    if (st < 0) return 0;
    if (st < wind) return (st / wind) * 0.42;
    if (st < active) return 0.42 + ((st - wind) / (active - wind)) * 0.58;
    if (st >= rec) return 0;
    return Math.max(0, 1 - (st - active) / (rec - active));
  }

  function makeFighter(who, isP1, startX) {
    const base = CHAR[who];
    if (!base) throw new Error('Unknown fighter: ' + who);
    return {
      who, isP1,
      name: base.name, color: base.color, speed: base.speed, jump: base.jump,
      punchDamage: base.punchDamage, kickDamage: base.kickDamage,
      specialDamage: base.specialDamage, range: base.range, isSpeed: base.isSpeed,
      x: startX, y: 0, vx: 0, vy: 0,
      hp: 100, energy: 0, facing: startX < 0 ? 1 : -1,
      state: 'idle', st: 0, frame: 0, frameT: 0,
      power: false, powerT: 0, inv: 0, atkHit: false,
      damageLevel: 0, spriteH: 310, spriteW: 96
    };
  }

  function paletteFor(who) {
    return CHAR[who] || CHAR.shiroka;
  }

  function poseForState(state, who) {
    if (state === 'punch') return who === 'shiroka' ? POSES.claw : POSES.haymaker;
    return POSES[state] || POSES.idle;
  }

  function getPose(f, nowMs) {
    const t = nowMs || 0;
    const breathe = Math.sin(t * 0.0042) * 0.035;
    const tailIdle = Math.sin(t * 0.0055 + (f.isP1 ? 0 : 1.7)) * 0.28;
    let pose;

    if (f.state === 'punch' || f.state === 'kick' || f.state === 'special') {
      const peak = poseForState(f.state, f.who);
      const wind = f.state === 'kick' ? POSES.kickWind : (f.state === 'punch' ? POSES.punchWind : POSES.power);
      const w = attackWeight(f.st, ATTACK_RECOVER);
      const u = f.st < ATTACK_WINDUP ? (f.st / ATTACK_WINDUP) : w;
      const from = f.st < ATTACK_ACTIVE_END ? wind : peak;
      const to = f.st < ATTACK_ACTIVE_END ? peak : POSES.idle;
      const blend = f.st < ATTACK_ACTIVE_END ? u : (1 - w);
      pose = lerpPose(from, to, clamp(blend, 0, 1));
    } else if (f.state === 'walk') {
      pose = clonePose(POSES.walk);
      const cyc = Math.sin(t * 0.013 * f.speed);
      pose.lLegH = 0.50 * cyc;
      pose.lLegK = 0.22 + Math.max(0, -cyc) * 0.45;
      pose.rLegH = -0.50 * cyc;
      pose.rLegK = 0.22 + Math.max(0, cyc) * 0.45;
      pose.lArmS = 0.55 + cyc * 0.45;
      pose.rArmS = -0.35 - cyc * 0.45;
      pose.hip = 0.04 + Math.abs(cyc) * 0.06;
      pose.torso = 0.08 + cyc * 0.06;
      pose.tail = 0.45 + cyc * 0.35;
    } else if (f.state === 'idle') {
      pose = clonePose(POSES.idle);
      pose.torso += breathe;
      pose.lArmS += breathe * 0.4;
      pose.rArmS -= breathe * 0.3;
      pose.tail += tailIdle;
      pose.ear += Math.sin(t * 0.007) * 0.05;
    } else if (f.state === 'jump') {
      pose = clonePose(POSES.jump);
      const air = clamp(-f.y / 80, 0, 1);
      pose.lLegK = lerp(0.4, 1.05, air);
      pose.rLegK = lerp(0.35, 0.9, air);
    } else {
      pose = clonePose(poseForState(f.state, f.who));
      if (f.state === 'power') {
        pose.lArmS += Math.sin(t * 0.02) * 0.08;
        pose.rArmS += Math.cos(t * 0.02) * 0.08;
        pose.tail += Math.sin(t * 0.018) * 0.2;
      }
      if (f.state === 'block') pose.torso += breathe * 0.4;
    }

    if (f.power && f.who === 'shiroka' && (f.state === 'idle' || f.state === 'walk')) {
      pose.lArmS -= 0.15;
      pose.rArmS += 0.12;
    }
    return pose;
  }

  function facingOk(atk, def) {
    const dist = Math.abs(atk.x - def.x);
    const dirOk = (atk.facing > 0 && atk.x < def.x) || (atk.facing < 0 && atk.x > def.x);
    return dirOk || dist <= 70;
  }

  function hitRange(atk, def) {
    const visibleContact = (atk.spriteW + def.spriteW) * 0.38;
    return Math.max(atk.range * (atk.power ? 1.4 : 1), visibleContact);
  }

  function computeHit(atk, def) {
    if (atk.atkHit || def.inv > 0) return { hit: false, reason: 'already' };
    const dist = Math.abs(atk.x - def.x);
    if (dist > hitRange(atk, def)) return { hit: false, reason: 'range' };
    if (!facingOk(atk, def) && dist > 70) return { hit: false, reason: 'facing' };

    let dmg = 0, knock = 8, isUpper = false, move = atk.state;
    if (atk.state === 'punch') {
      dmg = atk.punchDamage;
      move = atk.who === 'shiroka' ? 'silver-claw' : 'crimson-hook';
    } else if (atk.state === 'kick') {
      dmg = atk.kickDamage;
      move = atk.who === 'shiroka' ? 'tail-spin' : 'fang-kick';
    } else if (atk.state === 'special') {
      dmg = atk.specialDamage;
      isUpper = atk.who === 'ragna';
      move = atk.who === 'ragna' ? 'crimson-uppercut' : 'silver-rush';
    }
    if (atk.power) dmg *= atk.who === 'shiroka' ? 1.7 : 1.5;
    if (def.damageLevel >= 2) dmg *= 1.1;

    const blocked = def.state === 'block' && def.y <= 0;
    if (blocked) dmg *= 0.2;

    return {
      hit: true, blocked, dmg, knock, isUpper, move, dist,
      atkEnergy: blocked ? 6 : 12,
      defEnergy: blocked ? 14 : 5
    };
  }

  function applyHit(atk, def, result) {
    if (!result || !result.hit) return result;
    atk.atkHit = true;
    def.hp = Math.max(0, def.hp - result.dmg);
    def.energy = Math.min(100, def.energy + result.defEnergy);
    atk.energy = Math.min(100, atk.energy + result.atkEnergy);
    if (result.blocked) return result;
    def.state = result.isUpper ? 'flop' : 'hit';
    def.st = 0;
    def.inv = 0.4;
    def.vx = atk.facing * result.knock * (result.isUpper ? 1.6 : 1);
    def.vy = result.isUpper ? -12 : -3;
    def.damageLevel = def.hp > 70 ? 0 : def.hp > 45 ? 1 : def.hp > 25 ? 2 : 3;
    return result;
  }

  function powerDuration(who) {
    return who === 'shiroka' ? 8.5 : 7.5;
  }

  function speedFor(f) {
    return f.speed
      * (f.power && f.who === 'shiroka' ? 1.85 : 1)
      * (f.power && f.who === 'ragna' ? 0.9 : 1)
      * (f.damageLevel >= 2 ? 0.85 : 1);
  }

  function chance(perFrameChance, dt) {
    return Math.random() < 1 - Math.pow(1 - perFrameChance, dt * 60);
  }

  function damageLevelFromHp(hp) {
    return hp > 70 ? 0 : hp > 45 ? 1 : hp > 25 ? 2 : 3;
  }

  return {
    CHAR, POSES, STATES,
    ATTACK_WINDUP, ATTACK_ACTIVE_END, ATTACK_RECOVER,
    clonePose, lerp, lerpPose, clamp, attackWeight,
    makeFighter, paletteFor, poseForState, getPose,
    facingOk, hitRange, computeHit, applyHit,
    powerDuration, speedFor, chance, damageLevelFromHp
  };
});
