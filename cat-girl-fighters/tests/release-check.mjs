import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

for (const text of [
  '<script src="arena-core.js"></script>',
  '<button type="button" class="card" id="c0"',
  '<button type="button" class="card ragna" id="c1"',
  'function startGame()',
  'function pauseForFocusLoss()',
  "e.code === 'KeyP' && (gameState==='fight'||gameState==='pause')",
  "if (gameState !== 'menu') canvas.focus();",
  "document.addEventListener('visibilitychange'",
  'C.advanceRoundTimer(timeLeft, tAcc, dt)',
  'C.resolveRound(player, enemy)',
  'function doRematch()',
  'id="zoomOut"',
  'id="reduceEffects"'
]) assert.ok(html.includes(text), 'release check missing: ' + text);

assert.ok(!html.includes('if (tAcc >= 1) { tAcc = 0;'), 'round timer must keep its remainder');
console.log('Cat Girl Fighters select/fight/pause/timeout/rematch release checks passed.');
