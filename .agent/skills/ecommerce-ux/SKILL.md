---
name: ecommerce-ux
description: Design conversion-focused storefront, product, cart, checkout, coupon, shipping, and order-tracking experiences for this Brazilian multi-tenant e-commerce SaaS.
---

# E-commerce UX

Design around confident purchase decisions and low-friction completion. Use the existing API and composables before inventing client-side state or new flows.

## Storefront

- Make product identity, price, installment information, availability, shipping, and primary action easy to scan.
- Provide useful loading, empty, unavailable, and error states.
- Keep search, categories, filters, sorting, and cart access discoverable on mobile and desktop.
- Use real product imagery and meaningful badges such as new, discount, free shipping, and low stock.

## Product detail

- Preserve a clear image gallery, title, price, payment terms, variants, quantity, stock, shipping calculation, and add-to-cart action.
- Explain selection errors next to the relevant control.
- Keep the purchase action visible without obscuring important product information.

## Cart and checkout

- Show item summary, quantity controls, subtotal, shipping, discount, total, and next action.
- Use a lightweight step indicator when the flow has multiple stages.
- For Pix, support QR code state, copy-and-paste state, expiry, payment confirmation, and failure recovery.
- For coupon and shipping errors, preserve entered data and explain the next action.
- Make trust signals factual and restrained: payment security, returns, delivery estimate, and support contact.

## Microcopy

Use direct Brazilian Portuguese labels such as "Adicionar ao carrinho", "Calcular frete", "Aplicar cupom", "Copiar chave Pix", and "Finalizar compra". Avoid vague labels like "Continuar" when the destination is known.

## Validation

Test the complete path from catalog to order confirmation, including empty cart, invalid coupon, unavailable product, missing required fields, slow network, and mobile viewport behavior.
