# Inference Engine

This is a small Node.js CLI that runs a forward-chaining inference (with Certainty Factor) against the project's `rules.json`.

Usage

- From the `inference-engine` folder run:

  node src/engine.js GG01 GG02

It will print a JSON object with the matched damages and their computed CFs.

Notes

- The CLI expects `rules.json` to be present at the repository root (one level up from `inference-engine`).
- This module is intentionally dependency-free so it can run with any recent Node.js without installation.
