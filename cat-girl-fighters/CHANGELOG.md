# Changelog

All notable changes to Cat Girl Fighters are documented here.

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
