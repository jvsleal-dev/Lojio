---
name: responsive-visual-qa
description: Validate Nuxt UI behavior and visual quality across desktop and mobile using focused browser checks, screenshots, and real user flows.
---

# Responsive Visual QA

Validate the actual rendered application, not only the component source. Start the Nuxt dev server when needed and use the smallest focused route that exercises the change.

## Required viewport checks

Check at least one narrow mobile viewport and one desktop viewport. For storefront changes, verify catalog, product detail, cart, and checkout as relevant. For admin changes, verify navigation, list or table, form, and mutation states as relevant.

## Inspect for

- horizontal overflow and clipped content
- overlapping text, buttons, dialogs, drawers, and sticky elements
- unstable layout caused by long names, prices, badges, or loading states
- unreadable contrast, missing focus styles, and inaccessible icon actions
- broken image aspect ratios and missing empty or error states
- touch targets and mobile navigation behavior
- hydration or console errors after navigation

## Behavioral flows

Exercise the changed action end to end: search, add to cart, update quantity, apply coupon, calculate shipping, submit a form, change order status, or publish a store. Verify success and failure paths, not only the happy path.

## Reporting

Record the route, viewport, reproduction steps, expected behavior, observed behavior, and severity. Prefer a small screenshot or focused test when it makes a visual regression easier to reproduce.
