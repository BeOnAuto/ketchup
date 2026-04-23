# In the Stack

Ketchup doesn't sit alone. It's the execution discipline layer in a wider stack of properties. Each one does one job; together they describe a way of building software that takes specifications seriously.

## The bridge

> Auto gives you the spec. Ketchup gives you the discipline to execute against it without babysitting.

Use that sentence wherever the two products meet. It's the through-line.

## How the properties relate

| Property | Role |
|----------|------|
| [specdriven.com](https://specdriven.com) | The category. Spec-driven development as a movement, with lineage from formal methods, BDD, and contract-first design. |
| [narrativedriven.org](https://narrativedriven.org) | The dialect. Narrative-Driven Development (NDD) as the specification format. |
| [on.auto](https://on.auto) | The product. Auto turns narratives into working software. |
| **ketchup.on.auto** | The quality layer. Ketchup installs trust into the coding agent so you can let it run. |

Each property is independently useful. You can adopt the methodology without the tool. You can use the tool without the broader movement. The composition is where the value compounds.

## Where Ketchup sits

Auto drives the model. Ketchup keeps the agent honest while it implements against that model. The spec says what. The agent does. The quality loop verifies. You direct.

If Auto decides what to build, Ketchup enforces how. They compose:

- Use Auto to generate vertical slices from a narrative spec.
- Use Ketchup to keep the implementation honest, commit by commit, test by test.
- Open another worktree. Repeat.

If you don't use Auto yet, Ketchup is still useful. The Ketchup Technique (the methodology behind the tool) works with any AI coding agent by hand. Bursts, TCR, ketchup-plan.md. The tool just automates the loop for Claude Code.

## The two-tier brand

Two things share the Ketchup name. Keep them distinct in your head:

- **The Ketchup Technique** is the methodology. Bursts, TCR, ketchup-plan.md, controlled scope. It is what you *do*.
- **Ketchup** is the open-source toolkit that automates the technique for Claude Code. It is what you *install*.

This split matches how spec-driven development separates the movement from a dialect, and how narrative-driven development separates the method from the tool. Same pattern at three layers. The methodology is durable. Tools come and go.

## Roadmap

The Ketchup Technique is agent-agnostic. The Ketchup tool is Claude Code-first today. If your agent exposes hooks or an equivalent integration surface, [open an issue on GitHub](https://github.com/BeOnAuto/auto-ketchup/issues) so we can scope adapter work.

## Further reading

- [The Ketchup Technique](/ketchup-technique): the planning methodology
- [Origin Story](/origin-story): how this came to be
- [Auto](https://on.auto): the spec-driven platform
- [Spec-driven development](https://specdriven.com): the category
- [Narrative-driven development](https://narrativedriven.org): the spec dialect
