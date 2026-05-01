# Implementation Plan: Next.js E-commerce Template Rebuild

## Objective
Rebuild the existing static HTML/CSS/JS e-commerce site into a highly configurable Next.js (App Router) + TypeScript template using Tailwind CSS and shadcn/ui. The goal is to allow deploying new stores for different clients by simply modifying a central configuration file and replacing assets, without needing to write or change code.

## Key Files & Context
- **Current Architecture:** Static files (`index.html`, `pages/*`), vanilla JS (`scripts/*`), CSS (`css/*`).
- **New Architecture:** Next.js App Router (`app/*`), React Components (`components/*`), Centralized Config (`config/*`).

## Proposed Solution
1. **Centralized Configuration:** Create a `config/site.ts` file to hold global store settings (store name, descriptions, contact info) and a centralized way to define theming colors that hook into Tailwind variables.
2. **Product Data Management:** Store product inventory in a centralized `data/products.ts` or JSON file so it can be easily updated per client.
3. **Modern UI Stack:** Utilize Tailwind CSS for styling and `shadcn/ui` for accessible, pre-built components (buttons, cards, forms, navigation).
4. **State Management:** Migrate vanilla `cart.js` logic to a React Context or a lightweight state manager (like Zustand) to handle cart operations across the app.

## Implementation Steps
### Phase 1: Initialization
1. Initialize a new Next.js project with TypeScript, Tailwind CSS, and App Router.
2. Set up `shadcn/ui` and configure the base theme variables.
3. Create the `config/site.ts` for branding and `data/products.ts` for product data.

### Phase 2: Component Migration
1. Build core layout components (Header, Footer, Mobile Navigation).
2. Recreate the homepage (`index.html`) using React components mapping to the new config.
3. Recreate the Store page (`pages/store.html`) with product listing and filtering logic.
4. Recreate the Checkout (`pages/checkout.html`) and Contact (`pages/contact.html`) pages.

### Phase 3: Logic Migration
1. Implement global Cart State (add, remove, update quantities, calculate totals).
2. Migrate EmailJS functionality for the Contact form into a Next.js component/Server Action.
3. Ensure responsive design parity with the original site using Tailwind utility classes.

## Verification & Testing
1. Verify that changing values in `config/site.ts` immediately updates branding across all pages.
2. Verify product data changes reflect correctly on the store and checkout pages.
3. Test all cart operations (add, remove, totals) to ensure functional parity with the old site.
4. Test responsive layouts on mobile and desktop viewports.