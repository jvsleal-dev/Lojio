---
name: admin-dashboard-design
description: Design efficient merchant and master-admin workflows for dashboards, catalog, orders, reports, categories, coupons, tenants, and store customization.
---

# Admin Dashboard Design

Admin screens are work tools. Prioritize scanning, comparison, predictable navigation, and fast repeated actions over decorative marketing layouts.

## Information architecture

- Keep primary navigation stable across admin routes.
- Make the current location and active store context obvious.
- Use page titles, a concise supporting description when needed, and one clear primary action.
- Preserve filters, search, pagination, and sort state when navigating or returning from detail views.

## Tables and lists

- Align numeric values consistently and use tabular numerals.
- Include useful empty, loading, error, and no-results states.
- Keep row actions discoverable without crowding the most important data.
- Confirm destructive actions and explain the result after mutations.
- Use responsive alternatives for dense tables instead of forcing horizontal overflow without context.

## Metrics and reports

- Label the time range and comparison period.
- Distinguish currency, counts, percentages, and rates.
- Avoid charts that imply precision unsupported by the data.
- Pair metrics with useful status and next actions, not ornamental cards.

## Forms and customization

- Group related fields and provide immediate validation.
- Show a preview when changing storefront appearance.
- Make unsaved changes and publish state explicit.
- Preserve entered values when server validation fails.

## Interaction states

Every CRUD surface needs loading, empty, error, success, disabled, and permission-denied states. Destructive actions must be reversible when possible or require confirmation.
