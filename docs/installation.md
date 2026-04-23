# Installation Guide

Ketchup is a plugin for Claude Code. There are two ways to install it.

---

## Option 1: Marketplace (Recommended)

```
/plugin marketplace add BeOnAuto/auto-plugins
/plugin install auto-ketchup
```

This installs the plugin and registers all hooks and skills automatically.

---

## Option 2: Local Plugin Mode

For development or when working from a local clone:

```bash
claude --plugin-dir /path/to/auto-ketchup
```

---

## Activating in a Project

After installing the plugin, Claude will mention that Ketchup is available. To activate it:

```
/auto-ketchup-init
```

This creates the following structure in your project:

```
your-project/
├── .ketchup/
│   ├── .claude.hooks.json  # Hook behavior state
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
/auto-ketchup-config show
```

---

## Configuration

All configuration is managed via the `/auto-ketchup-config` skill:

```
/auto-ketchup-config show          # View current configuration
/auto-ketchup-config set <key> <value>  # Update a setting
/auto-ketchup-config validators    # List active validators
/auto-ketchup-config reminders     # List active reminders
```

Configuration is stored in `.ketchup/.claude.hooks.json`.

---

## Troubleshooting

### Hooks not firing

1. Verify the plugin is installed: check that Claude Code shows auto-ketchup in the active plugins
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
/plugin uninstall auto-ketchup
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
4. [Enable auto-continue](/configuration#autocontinue) - Keep AI working

---

## Support

If you run into issues:

1. Run `/auto-ketchup-config show` to check configuration state
2. Check `.ketchup/logs/` for detailed error messages
3. Report persistent issues at [GitHub Issues](https://github.com/BeOnAuto/auto-ketchup/issues)
