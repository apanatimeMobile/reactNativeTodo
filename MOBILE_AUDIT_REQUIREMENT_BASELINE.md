# Mobile audit requirement baseline

Status: frozen for the Mode D audit; implementation and repairs have not started.

## Scope and authority

- Audit the existing native React Native mobile project across `src/features/frontend_user`, shared app infrastructure, root documentation/configuration, tests, and `mobile_e2e/`.
- Do not audit backend implementation or expand beyond the supplied mobile frontend scope. Do not invent APIs, permissions, product behavior, design tokens, or domain boundaries.
- Apply precedence: security/privacy/legal/authorization/tenant isolation/data protection; accessibility and native safety; approved scope and verified contracts; `MOBILE_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1.md`; `MOBILE_UI_UX_DESIGN.md`; the V2.11 execution/delivery workflow; feature-local documentation; existing conventions.
- Source of truth: the three supplied documents remain authoritative in full. This frozen summary records the applicable gates; it does not replace or weaken those documents.

## Architecture and implementation gates

- Target bare React Native New Architecture (Fabric/TurboModules); no Expo contamination or unapproved dependencies. Do not alter native project files without authorization.
- Keep each bounded-context domain and capability isolated; business code stays in its owning submodule. No sibling/feature business imports or shared parent business-component buckets.
- Check canonical paths/naming, role-prefixed artifacts, absolute `@/` imports, no runtime barrels, and per-file ceilings: screen 80 lines, component 200, hook/API 150, store 180, utility 120, unless an allowed exception is documented.
- Check submodule documentation (`_features.md`, `_forbidden.md`, `_theme_contract.md`), `contracts/host-stubs.d.ts`, tests/harness, mocks, locales, and API URL/query-key registries where applicable.
- Preserve existing and partially implemented features; make repairs additive. No fake/no-op interactions, raw alerts, guessed behavior, unsafe credential storage, or sensitive logging. Use the required form, server-state, and feature-UI-state patterns when applicable.

## UI, accessibility, and evidence gates

- `MOBILE_UI_UX_DESIGN.md` is the canonical source for visual values; feature UI consumes theme tokens through the project theme API. Do not invent visual values.
- Verify contrast, Dynamic Type/font scaling, safe areas, meaningful accessible names/roles/states, logical reading order, reduced motion, native conventions, and 44pt iOS / 48dp Android touch targets.
- Verify applicable loading, empty, error, permission-denied, and declared offline states, with safe user-facing errors and masked sensitive list/card data.
- Every finding/claim must have file-and-line evidence and a status such as `VERIFIED`, `DERIVED`, `CONTRACT_MISSING`, `NOT_VERIFIED`, `SOURCE_CONFLICT`, or `BLOCKED_BY_SUPPLIED_SCOPE`; never present assumptions as facts. Runtime-only gaps are `DEFERRED_TO_HOST_RUNTIME`.

## Workflow and delivery gates

- Complete and report the audit, then publish a dependency-ordered RBG repair plan and obtain explicit approval before source repairs.
- Re-audit repaired work; do not claim compliance without file-level evidence. Run relevant tests/checks and report baseline failures separately from repair regressions.
- Required mobile delivery evidence includes root `INTEGRATION_GUIDE.md`, `RE_AUDIT_CHECKLIST_RESULT.md`, `compliance_manifest.json`, and Maestro E2E under `mobile_e2e/`.
- Use `*-PARTIAL-rbg{X}.zip` only for intermediate batches; use `*-ALL-RBGS-COMPLETE.zip` only after every planned RBG and pre-delivery checks pass. Never claim an unavailable or uncreated artifact.
- Work is on the requested temporary branch `temp`; repository changes must remain scoped, reviewable, and pushed only after the approved repairs and verification.

## Current verified baseline

- Project: existing React Native application with feature modules and native Android/iOS trees.
- Branch: `temp`, created from the supplied checkout without source edits.
- Initial checks: TypeScript check passed; Jest had 4 failed suites (14 passed), 4 failed tests (51 passed); ESLint reported 40 errors and 64 warnings. Exact affected-file details are tracked in the audit findings before repair.
- Initial dependency audit (`npm audit` / `npm audit --omit=dev`): 36 total findings; production dependency tree reports 16 (1 critical, 4 high, 7 moderate, 4 low). Dependency remediation may require major-version or package-scope decisions and is not assumed approved by this baseline.
- No Expo imports/packages were found in the scanned app/config source. Root `INTEGRATION_GUIDE.md` and seven Maestro YAML files exist; root `RE_AUDIT_CHECKLIST_RESULT.md` and `compliance_manifest.json` do not exist at baseline.
- No backend/API contracts were supplied in the user attachments; client behavior that requires an external contract must be marked unresolved rather than inferred.
