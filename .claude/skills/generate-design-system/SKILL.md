---
name: generate-design-system
description: Run the full design system generation pipeline — tokens, components, tests, and Storybook stories. Invokes token-agent, component-agent, test-agent, and storybook-agent in sequence. User can edit the component list and spec below before running.
allowed-tools: [Read, Write, Bash, Agent]
---

# Generate Design System

You are the orchestrator for a multi-phase design system generation pipeline. Execute the phases below in order. For each phase, delegate to the appropriate subagent — do not write component code yourself.

---

## Design System Spec

Edit this section to change what gets generated:

- **Name:** puma-ui
- **Description:** A clean, accessible component library with a warm neutral palette
- **Color palette:** warm neutrals with a black primary accent
- **Border radius:** rounded
- **Components:**
  - Badge
  - Button
  - Tooltip
  - Dropdown
  - Modal
  - Accordion
  - Input
  - Pagination
  - Radio Button
  - Toggle
  - Checkbox
  - Textarea
  - Banner
  - Toast
  - Progress Bar
  - Spinner
  - Card

---

## SRC_DIR

All output goes to: `/Users/davidchuang/enterprise-design-system/src`

---

## Phase 0: Determine What to Build

1. Read `SRC_DIR/components/` — list all existing subdirectory names.
2. From the component list above, filter out any that already have a folder. Those are **skipped**.
3. Report which components will be built and which are skipped.
4. If all components already exist, stop and tell the user — nothing to do.

---

## Phase 1: Design Tokens

1. Check if `SRC_DIR/tokens/variables.css` exists.
   - If it does, skip this phase entirely and note that tokens already exist.
   - If it does not, proceed:

2. Invoke the **token-agent** with:
   - Color palette and border radius from the spec above
   - Write `SRC_DIR/tokens/variables.css` (CSS custom properties)
   - Write `SRC_DIR/tokens/tokens.json` (raw token values)

3. After token-agent completes, run this Bash command to generate the JS token exports (no LLM call):
   ```
   npx tsx /Users/davidchuang/enterprise-design-system/scripts/generate-tokens.ts \
     /Users/davidchuang/enterprise-design-system/src/tokens/tokens.json \
     /Users/davidchuang/enterprise-design-system/src/tokens
   ```

4. **Pause here.** Show the user the paths to the generated token files and ask them to confirm before proceeding to component generation. Wait for explicit approval.

---

## Phase 2: Components, Tests, and Stories

For each component that needs to be built (from Phase 0):

1. Invoke **component-agent** to scaffold the component:
   - Output directory: `SRC_DIR/components/<ComponentName>/`
   - Token variables path: `SRC_DIR/tokens/variables.css`
   - Produces: `<Name>.tsx`, `<Name>.module.css`, `index.ts`

2. Once component-agent succeeds, invoke **test-agent** AND **storybook-agent** in parallel (they depend only on the component files, not on each other):
   - Both receive: component name and directory path `SRC_DIR/components/<ComponentName>/`
   - test-agent produces: `<Name>.test.tsx`
   - storybook-agent produces: `<Name>.stories.tsx`

3. Process components one at a time (not all in parallel) — each gets a fresh context.

4. After each component, report PASS or FAIL. On failure, report the reason in one sentence and move to the next component.

---

## Phase 3: Update Barrel Export

After all components are processed:

1. Read `SRC_DIR/index.ts` (or start with `export * from './tokens';\n` if it doesn't exist).
2. For each successfully built component, add `export * from './components/<Name>';` if not already present.
3. Write the updated `SRC_DIR/index.ts`.

---

## Phase 4: Summary

Report:
- Which components succeeded
- Which components failed (with reasons)
- Which components were skipped (already existed)
