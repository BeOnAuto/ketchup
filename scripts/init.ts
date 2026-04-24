#!/usr/bin/env npx tsx

import { formatInitResult, initKetchup } from '../src/init.js';

const result = initKetchup(process.cwd());
console.log(formatInitResult(result));
