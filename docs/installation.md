# Installation Guide

Ketchup is a plugin for Claude Code. There are two ways to install it.

---

## Option 1: Marketplace (Recommended)

```
/plugin marketplace add BeOnAuto/auto-plugins
/plugin install ketchup
```

This installs the plugin and registers all hooks and skills automatically.

---

## Option 2: Local Plugin Mode

For development or when working from a local clone:

```bash
claude --plugin-dir /path/to/ketchup
```

---

## Activating in a Project

After installing the plugin, Claude will mention that Ketchup is available. To activate it:

```
/ketchup:init
```

This creates the following structure in your project:

```
your-project/
├── .ketchup/
│   ├── state.json  # Hook behavior state
│   ├── reminders/          # Custom context injection files (*.md)
│   ├── validators/         # Custom commit validation rules (*.md)
│   └── logs/
│       └── activity.log    # Activity log
```

You can add `.ketchup` to `.gitignore` for personal use, or commit it for the whole team.

See the [Reminders Guide](/reminders-guide) and [Validators Guide](/validators-guide) for the complete list of built-in reminders and validators.

---

## Verify Installation

After installing the plugin, use the config skill to check the current state:

```
/ketchup:config show
```

---

## Configuration

All configuration is managed via the `/ketchup:config` skill:

```
/ketchup:config show          # View current configuration
/ketchup:config set <key> <value>  # Update a setting
/ketchup:config validators    # List active validators
/ketchup:config reminders     # List active reminders
```

Configuration is stored in `.ketchup/state.json`.

---

## Troubleshooting

### Hooks not firing

1. Verify the plugin is installed: check that Claude Code shows ketchup in the active plugins
2. Ensure you're in the project root when starting Claude
3. Check logs in `.ketchup/logs/` for errors

### Permission denied

On Unix systems, you might need to fix permissions:

```bash
chmod +x .ketchup/scripts/*.js
```

---

## Uninstall

Remove the plugin via Claude Code:

```
/plugin uninstall ketchup
```

To clean up project files:

```bash
rm -rf .ketchup
```

---

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `AUTO_ROOT` | Force project root path | Auto-detected |
| `DEBUG` | Enable debug logging | - |

---

## Next Steps

After installation:

1. [Configure your hooks](/hooks-guide) - Customize supervision rules
2. [Add reminders](/configuration#reminder-frontmatter) - Inject your guidelines
3. [Set up file protection](/hooks-guide#protect-files-with-deny-list) - Protect sensitive files
4. [Plan for parallel sub-agents](/guardrail-engineering#_5-parallel-subagent-planning) - Run independent bursts in parallel

---

## Support

If you run into issues:

1. Run `/ketchup:config show` to check configuration state
2. Check `.ketchup/logs/` for detailed error messages
3. Report persistent issues at [GitHub Issues](https://github.com/BeOnAuto/ketchup/issues)
