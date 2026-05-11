# Project Instructions: Spec-Kit Plus Integration

This project follows a Spec-Driven Development (SDD) approach using a structure inspired by Spec-Kit Plus.

## Directory Structure
- `.specify/memory/`: Contains the `constitution.md` (project principles).
- `.specify/specs/`: Functional and technical specifications.
- `.specify/templates/`: Templates for specs and plans.
- `docs/`: Final generated chapters for the Docusaurus site.

## Workflow Rules
1. **Specify First**: Do not write book chapters directly. Always create a specification in `.specify/specs/` first.
2. **Use Templates**: Use `.specify/templates/spec.md` when creating new specifications.
3. **Linkage**: The `specs` folder is mounted as a separate Docusaurus documentation plugin at `/specs`.
4. **Consistency**: Ensure technical details in specs are consistent with the `constitution.md`.

## Slash Commands (Internal Gemini CLI)
- `/sp.constitution`: Update or read the project constitution.
- `/sp.specify [name]`: Create a new specification file in `.specify/specs/[name]/spec.md`.
- `/sp.plan [name]`: Create an implementation plan based on a spec.
- `/sp.generate [name]`: Transform a spec/plan into a final chapter in `docs/`.

*Note: These commands are conceptual instructions for the AI agent to follow the workflow.*
