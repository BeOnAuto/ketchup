export function buildKetchupAllowPatterns(pluginRoot: string): string[] {
  return [`Bash(node "${pluginRoot}/*")`, `Bash(node "${pluginRoot}/*" *)`];
}

interface SettingsShape {
  permissions?: { allow?: string[] };
  [key: string]: unknown;
}

export function mergeAllowList(settings: SettingsShape | null, patterns: string[]): SettingsShape {
  const base: SettingsShape = settings ?? {};
  const existingAllow = base.permissions?.allow ?? [];
  const allow = [...existingAllow];
  for (const pattern of patterns) {
    if (!allow.includes(pattern)) allow.push(pattern);
  }
  return {
    ...base,
    permissions: { ...(base.permissions ?? {}), allow },
  };
}
