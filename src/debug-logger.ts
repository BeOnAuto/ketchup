import fs from 'node:fs';
import path from 'node:path';

import { BRAND } from './brand.js';

export function debugLog(autoDir: string, hookName: string, message: string): void {
  if (!fs.existsSync(autoDir)) {
    return;
  }

  const debug = process.env.DEBUG;
  if (!debug || !debug.includes(BRAND.packageName)) {
    return;
  }

  const logsDir = path.join(autoDir, 'logs', BRAND.packageName);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const logPath = path.join(logsDir, 'debug.log');
  const timestamp = new Date().toISOString();
  const entry = `${timestamp} [${hookName}] ${message}\n`;
  fs.appendFileSync(logPath, entry);
}
