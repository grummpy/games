# Changelog

All notable changes to Cat Girl Fighters are documented here.

## [2.0.0] - 2026-08-30

Arena evolution: fighters occupy the ring as bodies, not JPEG cards. Fight flow, 1P vs AI, 2P local, stages, energy/power, pause, rematch, and finishers are preserved.

### Phase 1 — Replace card-like sprites

- In-fight fighters are articulated canvas bodies (silhouette, contact shadow, floor reflection, stage rim light).
- Photo JPEGs in `game_sprites/` stay as select portraits and arena jumbotron stills, not as rectangular sprites pasted on the stage.
- Hitboxes use a body-sized width instead of a photo-card aspect.

### Phase 2 — Expressive combat animation

- Shared pose set for idle, walk, punch, kick, block, hit, jump, slide, power, special, and flop.
- Attack windup / active / recovery blending, walk cycle, breathing idle, and tail / ear motion.
- Hitstop, impact rings, sparks, and camera ease toward the clinch.

### Phase 3 — Character-specific moves

- Shiroka: Silver Claw slashes, tail-spin kick, dash slide, Silver Fury afterimages and auto-claw flurry.
- Ragna: crimson hook, Fang Kick, Crimson Uppercut while powered, heavier silhouette and slower power walk.

### Phase 4 — Cinematic finishers

- SAVE HER: bodies close in the arena with letterbox, hearts, and portrait screens — not full-frame photo cards as the fighters.
- EXECUTE: camera push, impact flash, and the existing KO → rematch flow.
- Skip Cutscene and music ducking still apply to the save ending.

### Added

- `arena-core.js` combat / pose module and `tests/arena-core.test.mjs`.

## [1.4.0] - 2026-08-30

### Added

- Full-screen `SAVE HER` kissing cutscene rendered by the game.
- Cinematic close-up framing, animated approach, kiss hold, heart effects, captions, and black bars.
- Music ducking during the cutscene.
- Skip Cutscene control and automatic return to Rematch.

## [1.3.0] - 2026-08-30

### Fixed

- Corrected the health system by separating damage values from animation-frame arrays.
- Replaced unreliable width-based health updates with transform-based health bars.
- Added numeric HP displays.
- Added chip damage while blocking.
- Expanded contact detection to better match the fighters' visible size.
- Feathered sprite edges and added stage-matched glow to reduce the JPEG-card appearance.

## [1.2.0] - 2026-08-30

### Security and privacy

- Removed detectable local paths, user identifiers, development references, and hidden comments.
- Removed source metadata and unique creation identifiers from the soundtrack.
- Removed metadata from sprite images and excluded extended filesystem attributes from releases.

## [1.1.0] - 2026-08-30

### Added

- `Neon Combat` looping battle soundtrack.
- Music on/off control with pause and resume integration.

### Fixed

- Made movement, gravity, particles, and AI behavior refresh-rate independent.
- Prevented held controls from repeatedly restarting attacks, jumps, and slides.
- Prevented repeated Pause key events from rapidly toggling pause state.
- Cleared held controls when the browser loses focus.
- Fixed a canvas save/restore leak during damage rendering.
- Stabilized blood-overlay rendering.
- Improved missing-sprite reporting and rematch state cleanup.

## [1.0.0] - 2026-08-30

- Initial playable release with two fighters, two stages, 1P AI, local 2P, health and energy systems, power moves, blood effects, and post-fight endings.
