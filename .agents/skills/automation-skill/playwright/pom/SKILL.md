---
name: playwright-pom
description: Page Object Model patterns for Playwright — when to use POM, how to structure page objects, and when fixtures or helpers are a better fit.
---

# Playwright Page Object Model

> Structure your test code for maintainability — know when POM helps and when simpler patterns win.

## EShop HW04 decision gate

This workspace requires `pages/base.page.ts` plus one page class for each automated FR. Every FR page class extends `BasePage`; it owns verified locators and user-intent actions, while data stays external.

For every FR generation and review, read both guides and record decisions for any additional abstraction. Use fixtures for lifecycle/auth contexts and helpers for stateless utilities. Do not add API clients, database resources, credentials, test inputs, or expected results to page objects.

**2 guides** covering Page Object Model implementation and the decision framework for choosing between POM, fixtures, and helpers.

## Guide Index

| Topic | Guide |
|---|---|
| Page Object Model patterns | [page-object-model.md](page-object-model.md) |
| POM vs fixtures vs helpers | [pom-vs-fixtures-vs-helpers.md](pom-vs-fixtures-vs-helpers.md) |
