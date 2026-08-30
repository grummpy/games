# Cat Girl Fighters

Current version: **2.0.0**

An adult arcade fighting game built with HTML5 Canvas. Shiroka and Ragna occupy the neon arena as animated bodies — not rectangular photo cards layered on the stage. Photo portraits remain for fighter select and in-arena jumbotrons.

## Start the game

Keep this folder together (`index.html`, `arena-core.js`, `game_sprites/`, `neon-combat.m4a`), then open `index.html` in a modern browser, or play from the hub at the repo root.

## Controls

### 1P vs AI

- Move: W/A/S/D or arrow keys
- Claw / punch: J
- Kick: K
- Block: L
- Power: Space
- Pause: P

### 2P local

- Player 1: W/A/S/D, J/K/L, Space
- Player 2: arrow keys, 1/2/3, 0 or Enter
- Pause: P

## Fighters

- **Shiroka** — Silver Claw, speed. Claw slashes, dash slide, Silver Fury flurry.
- **Ragna** — Crimson Fang, power. Heavy hooks, Fang Kick, Crimson Uppercut during power.

## Music

`neon-combat.m4a` is included as the looping battle soundtrack. Use the `MUSIC: ON/OFF` button in the lower-right corner. Music pauses with the game and resumes when the fight continues.

## Notes

- Contains fictional adult nudity, sexual post-fight scenes, and stylized violence.
- The game itself runs locally; the optional Google fonts require an internet connection.
- Pose and combat logic live in `arena-core.js`. Run `node tests/arena-core.test.mjs` from this folder.
- See `CHANGELOG.md` for the complete revision history.
