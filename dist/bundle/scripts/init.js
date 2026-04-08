#!/usr/bin/env npx tsx
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/init.ts
var fs = __toESM(require("node:fs"));
var path = __toESM(require("node:path"));

// src/hook-state.ts
var DEFAULT_HOOK_STATE = {
  autoContinue: {
    mode: "smart",
    maxIterations: 0,
    skipModes: ["plan"]
  },
  validateCommit: {
    mode: "strict",
    batchCount: 3
  },
  denyList: {
    enabled: true,
    extraPatterns: []
  },
  promptReminder: {
    enabled: true
  },
  subagentHooks: {
    validateCommitOnExplore: false,
    validateCommitOnWork: true,
    validateCommitOnUnknown: true
  },
  overrides: {
    validators: {},
    reminders: {}
  }
};

// src/init.ts
function initClaudeAuto(projectRoot2) {
  const autoDir = path.join(projectRoot2, ".claude-auto");
  if (fs.existsSync(autoDir)) {
    return { created: false, autoDir, gitignoreAdvice: checkGitignoreAdvice(projectRoot2) };
  }
  fs.mkdirSync(autoDir, { recursive: true });
  const stateFile = path.join(autoDir, ".claude.hooks.json");
  fs.writeFileSync(stateFile, `${JSON.stringify(DEFAULT_HOOK_STATE, null, 2)}
`);
  return { created: true, autoDir, gitignoreAdvice: checkGitignoreAdvice(projectRoot2) };
}
function checkGitignoreAdvice(projectRoot2) {
  const gitignorePath = path.join(projectRoot2, ".gitignore");
  if (!fs.existsSync(gitignorePath)) {
    return true;
  }
  const content = fs.readFileSync(gitignorePath, "utf-8");
  const lines = content.split("\n").map((l) => l.trim());
  return !lines.some((line) => line === ".claude-auto" || line === ".claude-auto/");
}

// scripts/init.ts
var projectRoot = process.cwd();
var result = initClaudeAuto(projectRoot);
if (result.created) {
  console.log(`Initialized claude-auto at ${result.autoDir}`);
  console.log("Default configuration written to .claude-auto/.claude.hooks.json");
} else {
  console.log(`claude-auto is already initialized at ${result.autoDir}`);
}
if (result.gitignoreAdvice) {
  console.log("");
  console.log("Note: .claude-auto is not in your .gitignore.");
  console.log("If this is for personal use only, consider adding it:");
  console.log('  echo ".claude-auto" >> .gitignore');
}
