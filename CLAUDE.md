# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Roll20 API scripts (mods), character ability macros, and mule configuration files for a D&D 5e campaign. Scripts are uploaded manually to Roll20's API sandbox — there is no build step or deployment pipeline.

## Commands

```bash
npx eslint .          # Lint all JS files
npx prettier --check . # Check formatting
npx prettier --write . # Fix formatting
```

There is no test suite.

## Architecture

### Script layer (`Scripts/`)

All scripts are uploaded directly into Roll20's API mod system. They run in Roll20's sandboxed Node.js environment with access to Roll20 globals (`state`, `on`, `findObjs`, `getObj`, `sendChat`, `createObj`, `sendPing`, `toFront`, `playerIsGM`, etc.).

**Dependency order for installation:**
1. `Paraselene-Common.js` — Core library used by all other scripts
2. `Paraselene-Installer.js` — Installs/updates character abilities and macros
3. `Paraselene-Tools.js` — Game-independent token utilities
4. `Paraselene-DnD5e.js` — D&D 5e–specific features (AOE patterns, spell menus)

`Summon-Spiritual-Weapon.js` is an older-style script that uses a `paraselene` namespace instead of the IIFE pattern; it does not depend on Paraselene-Common.

### Script conventions

Every modern script follows this structure:

- **`API_Meta` registration** — A try/catch error-throw trick at the top and bottom of each script records the line offset and line count, so Roll20 stack traces can be mapped to the correct source line.
- **IIFE module pattern** — Each script is wrapped in `const ScriptName = (() => { ... })()` and exports only a minimal public interface (usually just `version`).
- **Dependency check** — Scripts that depend on Paraselene-Common check `API_Meta.ParaseleneCommon` and call `pc.compareVersions` to enforce a minimum version before proceeding.
- **`state` schema versioning** — Each script manages its own `state[scriptName]` object with a `version` field. The `checkSchema()` function uses a fall-through switch for migrations.
- **Event registration** — All chat command handlers are registered in `registerEventHandlers()`, called from `on('ready', ...)`.
- **Chat commands** — Follow the pattern `!ScriptName-CommandName --optionName optionValue`. The `--speakAs` option controls which name appears as the chat sender. Commands are parsed by splitting `msg.content` on whitespace; `pc.extractCommandLineOption` mutates the args array to consume named options.

### `ParaseleneCommon` public API

The shared library (`Scripts/Paraselene-Common.js`) exposes:
- `compareVersions(v1, v2)` — semver comparison returning -1/0/1
- `extractCommandLineOption(args, option, defaultValue)` — mutates args array, returns value
- `getPlayerPageId(playerId)` — respects per-player page overrides
- `sendChatNoArchive(speakAs, message)` — sends chat with `noarchive: true`
- `sortTokens(tokens)` — sorts by token name (case-insensitive)
- `stringOrBlank(str)` — returns `"<Blank>"` for empty strings
- `whisperTokenDoesNotExist / whisperTokenNotOnPage / whisperTokenNotSelected` — standard error whispers
- HTML builder classes: `HtmlElement`, `HtmlContainer`, `HtmlTable`, `HtmlTableRow`, `HtmlTableHeader`, `HtmlTableCell`, `HtmlLink`, `HtmlSpan`, and bordered variants (`HtmlBorderedTable`, etc.)

### Character abilities (`Character-Abilities/`)

`.txt` files containing Roll20 ability macro text. These are installed into Roll20 characters via `ParaseleneInstaller`. Each file maps to a character ability that calls an API command. Abilities that should appear as token actions include the comment `!# Settings: Token Action: Yes`.

### Mules (`Mules/`)

Key-value configuration files read by Roll20's mule mechanism (`{& mule <Name>.<Key>}`). `Mules/ParaseleneDnD5e/SpiritualWeapons.txt` stores weapon name/image-URL pairs for the Spiritual Weapon spell. Update the placeholder URLs in this file with real Roll20 image URLs before use.

## ESLint globals

The Roll20 sandbox injects globals (`state`, `on`, `findObjs`, `getObj`, `sendChat`, `log`, `Campaign`, `playerIsGM`, `toFront`, `sendPing`, `spawnFx`, `createObj`) that ESLint doesn't know about. Add them to the `globals` block in `eslint.config.mjs` when ESLint flags them as undeclared, or suppress with `// eslint-disable-next-line no-undef` (already used in scripts for cross-script references like `ParaseleneCommon`).
