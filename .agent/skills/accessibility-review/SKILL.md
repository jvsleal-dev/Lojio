---
name: accessibility-review
description: Review and implement accessible Vue and Tailwind interfaces for the storefront, checkout, and admin areas of this Nuxt application.
---

# Accessibility Review

Treat accessibility as part of the component contract, not a final polish step. Preserve native HTML semantics and the existing Vue patterns.

## Interaction

- Every interactive element must be reachable and usable with keyboard input.
- Use visible `focus-visible` styles with sufficient contrast.
- Do not use click handlers on non-interactive elements when a button or link is appropriate.
- Keep focus inside open drawers and dialogs, restore focus when they close, and support Escape where expected.
- Never communicate state with color alone.

## Semantics

- Use one meaningful page heading and a logical heading hierarchy.
- Give form controls explicit labels, descriptions, and error associations.
- Use landmarks such as header, nav, main, aside, and footer appropriately.
- Provide accessible names for icon-only buttons and tooltips for unfamiliar actions.
- Use `aria-live` carefully for cart totals, checkout status, validation, and payment updates.
- Give meaningful images useful alt text; mark decorative images as decorative.

## Visual checks

- Verify text and controls have adequate contrast in every theme state.
- Keep touch targets comfortably usable on mobile.
- Support zoom and larger text without clipping or overlap.
- Check reduced-motion behavior before adding transitions.
- Ensure loading, empty, error, disabled, and success states remain understandable without color.

## Review output

When reviewing a screen, report issues by severity, identify the component or route, explain the user impact, and suggest the smallest code-level fix.
