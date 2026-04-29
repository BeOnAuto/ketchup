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

// scripts/init.ts
var import_node_os = require("node:os");

// src/init.ts
var fs = __toESM(require("node:fs"));
var path = __toESM(require("node:path"));

// src/brand.ts
var BRAND = {
  packageName: "ketchup",
  displayName: "Ketchup",
  attribution: "Ketchup, from Auto",
  dataDir: ".ketchup",
  stateFile: "state.json",
  docsUrl: "https://ketchup.on.auto",
  repoUrl: "https://github.com/BeOnAuto/ketchup",
  leadTagline: "Turn every AI mistake into a rule AI can't repeat.",
  subTagline: "Ketchup runs 20+ LLM-powered guardrails on every AI commit, so bad commits don't land.",
  categoryLine: "LLM-powered guardrails for AI coding agents."
};

// src/hook-state.ts
var DEFAULT_HOOK_STATE = {
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

// src/permissions-allow.ts
function buildKetchupAllowPatterns(pluginRoot) {
  return [`Bash(node "${pluginRoot}/*")`, `Bash(node "${pluginRoot}/*" *)`];
}
function mergeAllowList(settings, patterns) {
  const base = settings ?? {};
  const existingAllow = base.permissions?.allow ?? [];
  const allow = [...existingAllow];
  for (const pattern of patterns) {
    if (!allow.includes(pattern)) allow.push(pattern);
  }
  return {
    ...base,
    permissions: { ...base.permissions ?? {}, allow }
  };
}

// src/init.ts
function initKetchup(projectRoot, options = {}) {
  const autoDir = path.join(projectRoot, BRAND.dataDir);
  const created = !fs.existsSync(autoDir);
  if (created) {
    fs.mkdirSync(autoDir, { recursive: true });
    const stateFile = path.join(autoDir, BRAND.stateFile);
    fs.writeFileSync(stateFile, `${JSON.stringify(DEFAULT_HOOK_STATE, null, 2)}
`);
  }
  const permissionsUpdated = options.pluginRoot && options.userHomeDir ? writeUserAllowList(options.userHomeDir, options.pluginRoot) : false;
  return {
    created,
    autoDir,
    gitignoreAdvice: checkGitignoreAdvice(projectRoot),
    permissionsUpdated
  };
}
function writeUserAllowList(userHomeDir, pluginRoot) {
  const claudeDir = path.join(userHomeDir, ".claude");
  const settingsPath = path.join(claudeDir, "settings.json");
  const existing = fs.existsSync(settingsPath) ? JSON.parse(fs.readFileSync(settingsPath, "utf-8")) : null;
  const merged = mergeAllowList(existing, buildKetchupAllowPatterns(pluginRoot));
  if (existing && JSON.stringify(existing) === JSON.stringify(merged)) {
    return false;
  }
  fs.mkdirSync(claudeDir, { recursive: true });
  fs.writeFileSync(settingsPath, `${JSON.stringify(merged, null, 2)}
`);
  return true;
}
function formatInitResult(result2) {
  const lines = [];
  if (result2.created) {
    lines.push(`\u2705 Initialized ${BRAND.displayName} at ${result2.autoDir}`);
    lines.push(`\u{1F3AF} Default configuration written to ${BRAND.dataDir}/${BRAND.stateFile}`);
    if (result2.permissionsUpdated) {
      lines.push(`\u{1F513} Added Ketchup Bash patterns to ~/.claude/settings.json allow list`);
    }
    if (result2.gitignoreAdvice) {
      lines.push("");
      lines.push(`\u{1F4CC} Note: ${BRAND.dataDir} is not in your .gitignore.`);
      lines.push("   If this is for personal use only, consider adding it:");
      lines.push(`     echo "${BRAND.dataDir}" >> .gitignore`);
    }
    lines.push("");
    lines.push(
      `On your next reply, mention once (then proceed with the user's request): "Reminder: Defaults are active. Run /${BRAND.packageName}:config show anytime to review or customize."`
    );
  } else {
    lines.push(`\u2705 ${BRAND.displayName} is already initialized at ${result2.autoDir}`);
    if (result2.permissionsUpdated) {
      lines.push(`\u{1F513} Added Ketchup Bash patterns to ~/.claude/settings.json allow list`);
    }
  }
  return lines.join("\n");
}
function checkGitignoreAdvice(projectRoot) {
  const gitignorePath = path.join(projectRoot, ".gitignore");
  if (!fs.existsSync(gitignorePath)) {
    return true;
  }
  const content = fs.readFileSync(gitignorePath, "utf-8");
  const lines = content.split("\n").map((l) => l.trim());
  return !lines.some((line) => line === BRAND.dataDir || line === `${BRAND.dataDir}/`);
}

// scripts/init.ts
var result = initKetchup(process.cwd(), {
  pluginRoot: process.env.CLAUDE_PLUGIN_ROOT,
  userHomeDir: (0, import_node_os.homedir)()
});
console.log(formatInitResult(result));
