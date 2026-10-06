/* Vale Guardians deterministic simulation helpers. Browser and Node use the
   same small rules so display refresh rate cannot change game outcomes. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.ValeCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const FIXED_STEP_SECONDS = 1 / 60;
  const MAX_SIMULATION_STEPS = 5;
  const COOP_LEASH_DISTANCE = 260;

  function hashSeed(value) {
    const text = String(value || 'eldenbrook');
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function createRng(seed) {
    let value = hashSeed(seed) || 1;
    return function random() {
      value += 0x6D2B79F5;
      let next = value;
      next = Math.imul(next ^ (next >>> 15), next | 1);
      next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
      return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
    };
  }

  function fixedSteps(accumulator, elapsedSeconds) {
    let total = Math.max(0, accumulator || 0) + Math.max(0, elapsedSeconds || 0);
    let steps = Math.floor(total / FIXED_STEP_SECONDS);
    if (steps > MAX_SIMULATION_STEPS) {
      steps = MAX_SIMULATION_STEPS;
      total = 0;
    } else {
      total -= steps * FIXED_STEP_SECONDS;
    }
    return { steps, accumulator: total };
  }

  function isWalkable(map, width, height, x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return false;
    const tile = map[y] && map[y][x];
    return ![2, 3, 4, 6, 7].includes(tile);
  }

  function routeExists(map, width, height, from, to) {
    if (!isWalkable(map, width, height, from.x, from.y) || !isWalkable(map, width, height, to.x, to.y)) return false;
    const pending = [from];
    const visited = new Set([from.x + ',' + from.y]);
    while (pending.length) {
      const current = pending.shift();
      if (current.x === to.x && current.y === to.y) return true;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const next = { x: current.x + dx, y: current.y + dy };
        const key = next.x + ',' + next.y;
        if (!visited.has(key) && isWalkable(map, width, height, next.x, next.y)) {
          visited.add(key);
          pending.push(next);
        }
      }
    }
    return false;
  }

  function requiredRoutesReachable(map, width, height, from, targets) {
    return targets.every(target => routeExists(map, width, height, from, target));
  }

  function clampToLeash(candidate, anchor, maxDistance) {
    const limit = maxDistance || COOP_LEASH_DISTANCE;
    const dx = candidate.x - anchor.x;
    const dy = candidate.y - anchor.y;
    const distance = Math.hypot(dx, dy);
    if (!distance || distance <= limit) return { x: candidate.x, y: candidate.y, leashed: false };
    return { x: anchor.x + dx / distance * limit, y: anchor.y + dy / distance * limit, leashed: true };
  }

  function cameraFocus(players) {
    const alive = players.filter(player => player.isHuman && player.hp > 0);
    if (!alive.length) return null;
    return {
      x: alive.reduce((sum, player) => sum + player.x, 0) / alive.length,
      y: alive.reduce((sum, player) => sum + player.y, 0) / alive.length,
      ids: alive.map(player => player.id)
    };
  }

  function canUseAbility(actor, mode) {
    if (!actor || actor.hp <= 0 || actor.attacking || actor.attackCd > 0) return false;
    return mode === 'solo' || mode === 'coop' || mode === 'pvp';
  }

  function projectileCanDamage(projectile, target, mode) {
    if (!projectile || !target || target.hp <= 0) return false;
    if (target.kind === 'enemy') return projectile.team === 'heroes';
    if (target.kind === 'hero') return mode === 'pvp' && target.team !== projectile.team && target.id !== projectile.ownerId;
    return false;
  }

  function duelOutcome(players) {
    const [first, second] = players;
    if (!first || !second) return null;
    if (first.hp <= 0 && second.hp <= 0) return { type: 'draw' };
    if (first.hp <= 0) return { type: 'winner', winnerId: second.id };
    if (second.hp <= 0) return { type: 'winner', winnerId: first.id };
    return null;
  }

  return {
    FIXED_STEP_SECONDS, MAX_SIMULATION_STEPS, COOP_LEASH_DISTANCE,
    hashSeed, createRng, fixedSteps, isWalkable, routeExists, requiredRoutesReachable,
    clampToLeash, cameraFocus, canUseAbility, projectileCanDamage, duelOutcome
  };
});
