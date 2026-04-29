#!/usr/bin/env npx tsx

import { homedir } from 'node:os';

import { formatInitResult, initKetchup } from '../src/init.js';

const result = initKetchup(process.cwd(), {
  pluginRoot: process.env.CLAUDE_PLUGIN_ROOT,
  userHomeDir: homedir(),
});
console.log(formatInitResult(result));
