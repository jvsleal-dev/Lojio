---
name: design-system
description: Build and maintain a coherent design system for this Nuxt and Tailwind e-commerce SaaS, including tokens, typography, spacing, components, and interaction states.
---

# Design System

Treat the existing Nuxt, Vue, Tailwind, and Lucide stack as the source of truth. Before adding UI, inspect nearby components and preserve their APIs and visual language.

## Required process

1. Identify the owning surface: storefront, checkout, admin, or master panel.
2. Define or reuse semantic tokens for surfaces, text, borders, brand accent, success, warning, and danger.
3. Keep typography roles explicit: display, heading, body, label, numeric, and microcopy.
4. Use stable spacing, sizing, and responsive constraints so content cannot shift controls unexpectedly.
5. Implement interaction states: hover, active, focus-visible, disabled, loading, empty, error, and success.
6. Use Lucide icons through the installed library; do not draw replacement SVG icons.
7. Prefer reusable Vue components and Tailwind classes over page-specific one-off styling.

## E-commerce conventions

- Use tabular numerals for prices, stock counts, dates, order numbers, and metrics.
- Keep Brazilian currency formatting consistent.
- Make badges, buttons, inputs, tables, drawers, modals, and alerts visually related.
- Use cards only for genuinely framed tools or repeated items, not as containers for entire page sections.
- Keep borders, shadows, radii, and focus rings restrained and consistent.

## Review checklist

- Does the change reuse existing tokens and components?
- Are all states and breakpoints represented?
- Does long text remain inside its container?
- Is the contrast and hierarchy clear without relying on color alone?
- Does the result feel like the same product on storefront and admin surfaces?
