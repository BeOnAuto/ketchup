#!/usr/bin/env npx tsx

import { formatInitResult, initClaudeAuto } from '../src/init.js';

const result = initClaudeAuto(process.cwd());
console.log(formatInitResult(result));
