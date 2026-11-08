# Mobile structural migration re-audit

**Mode:** D. **Branch:** `temp`.

## Scope and completion boundary

The remaining live legacy runtime has been migrated to explicit feature/core owners with all consumers rewritten. Old runtime directories are removed, not retained as shims. Existing business behavior and storage contracts are preserved. This completes the requested structural migration; it is not full production/native-runtime or all-numbered-rule compliance.

## Structural acceptance evidence

- Old `src/context`, `src/hooks`, `src/services`, `src/storage`, `src/constants`, `src/types`, `src/utils`, and `src/i18n` directories no longer exist; `src/assets` retains only static images.
- `App.tsx` composes the migrated providers and direct audio/notification modules; `index.js` imports migrated audio stop logic.
- Task state is owned by `features/frontend_user/user_todos/todos_management/state/UserTodosContext.js`; purpose-specific hooks are below the 150-line hook ceiling. Shared consumers use `core/contracts/taskHost.js`, with the typed DTO/capability contract in `taskHost.types.ts`.
- Task normalization/category/recurrence/trash decisions are feature-local; Todos and Pomodoro own their domain-specific notification behavior. Shared native channels/state/permissions remain in core.
- The old 807-line notification service and 466-line audio service are split into focused concrete modules without runtime business export facades. Export-symbol checks preserved all 27 notification and 10 audio capabilities. Sound data contents were compared against the prior revision.
- Source imports use the `@/` alias resolved consistently by TypeScript, Jest and Metro. No dependency or native project changes were introduced for aliasing.
- Mode and accent no longer have two competing mode owners. The canonical theme provider restores legacy mode when needed; saved mode/accent migration is covered by `core/theme/ThemeMigration.test.tsx`.
- Canonical haptics now respect persisted preference gating, covered by `core/interaction/haptics.test.ts`.

## Behavior regression evidence

- `__tests__/TodoContext.test.tsx`: storage failure/invalid-shape recovery still avoids overwriting tasks and supports retry.
- `features/frontend_user/user_todos/todos_management/state/UserTodosContext.test.js`: migrated provider retains load-error write protection and exposes existing task operations.
- `features/frontend_user/user_todos/todos_management/tests/userTodosNotificationMigration.test.js`: scheduling and cancellation retain the existing reminder identifier and shared notification enable/disable state.
- `core/audio/__tests__/audioModules.test.js`: initialization, audio priority/conflict behavior, active source and stopping alarm/alert/tick playback.
- `core/auth/LocalProfileProvider.test.js`: restored profile and updates use the existing storage key.
- Existing CRUD/trash/forms/import, voice cleanup/permission recovery, i18n, storage, analytics, and Pomodoro persistence tests remain enabled; no tests were deleted to weaken coverage.

## Executed checks

Exact final commands/counts and Metro bundle result are recorded in `compliance_manifest.json`. Bundle output is a local verification artifact, not an APK or device proof. Native build/emulator/Maestro/device visual/accessibility checks remain `DEFERRED_TO_HOST_RUNTIME`.

**Final verification:** 39 Jest suites / 103 tests passed; TypeScript passed; ESLint has 0 errors and 61 warnings; diff checks passed. Both Android and iOS production Metro bundles were generated successfully. Metro emitted an upstream React Native private-feature-flags exports warning and used its documented file-resolution fallback; neither bundle failed.

## Open release requirements

| Gate | Current status |
|---|---|
| Legacy runtime placement/imports | Migrated to explicit owners; no old-path forwarding files. |
| Source-level behavioral checks | See final test/typecheck/lint results in the manifest; warnings are not hidden. |
| Native runtime and visual proof | Not executed; no emulator/ADB/native toolchain is available in this workspace. |
| Backend/auth/API contracts | `CONTRACT_MISSING` / `SOURCE_CONFLICT`: no invented endpoints, server DTOs, tenant rules, or remote refresh behavior. |
| Dependency advisories | Still open; compatible dependency remediation was excluded from the previously approved plan. No force-upgrades applied. |
| Full architecture/design/43P ledger | Not individually certified. Existing JS typing, remaining visual/token/string gaps, full standalone mocks/host stubs, and oversized pre-existing navigation shells remain separate work. |
| Maestro hierarchy/scenarios | Incomplete and unexecuted; JavaScript tests do not replace device E2E. |
| Final all-RBG ZIP | Not issued while the broader release gates remain open. |

Historical baseline documents describe earlier revisions. This report and the integration map supersede their old-path placement statements, not their unresolved external contracts or runtime checks.

## Independent review notes

- **Accent behavior — existing source/design conflict:** saved accent selection remains a preference, while canonical visual tokens stay Gold as required by the supplied design guide. The previous drawer already used canonical `useThemeTokens()` independently of the legacy accent provider (`cf6b2a5:src/core/navigation/PremiumDrawerContent.tsx:170-171`). This migration preserves that behavior; it does not claim that selecting a palette changes all application tokens. Resolving customization versus the mandatory Gold theme needs an explicit design decision.
- **Task host boundary — architecture review remains open:** `core/contracts/taskHost.js` hosts only injected context and its DTO/capability contract; task state, mutations, normalization, retention and selectors remain in the owning feature. This removes sibling store imports without duplicating persisted state. The reviewer flagged the todo-specific core port as a strict-isolation concern. It is recorded, not treated as proof of complete architectural compliance; replacing it with fully autonomous local ports is separate from preserving the existing integrated offline app.
