#!/usr/bin/env node
const { cpSync, mkdirSync, copyFileSync, rmSync } = require('node:fs');
const { join, resolve } = require('node:path');

const root = resolve(__dirname, '..');
const repoRoot = resolve(root, '..');
const mediaDir = join(root, 'media');
const viewerDist = join(repoRoot, 'viewer', 'dist');
const eventsViewerJs = join(repoRoot, 'dist', 'bundle', 'scripts', 'events-viewer.js');

rmSync(mediaDir, { recursive: true, force: true });
mkdirSync(join(mediaDir, 'scripts'), { recursive: true });
cpSync(viewerDist, join(mediaDir, 'viewer'), { recursive: true });
copyFileSync(eventsViewerJs, join(mediaDir, 'scripts', 'events-viewer.js'));

console.log(`Copied viewer dist + events-viewer.js into ${mediaDir}`);
