# TaskLume Mobile Integration Guide

**Target:** bare React Native with the New Architecture (Fabric/TurboModules)

**Active repair branch:** `temp`

**Source status:** partial Mode D audit and repair; this guide does not certify the app as release-ready.

## 1. Current change summary

This branch repairs telemetry redaction for `auth`/`ssn`, masks the email in the profile summary, prevents voice memo deletion from reporting success when audio cleanup fails, prevents the feedback screen from claiming an unconfigured submission succeeded, and fixes focused test/lint/type issues. See `RE_AUDIT_CHECKLIST_RESULT.md` for verified findings and the remaining scope.

## 2. App integration points

- Native entry point: `index.js` → `App.tsx`.
- App-level providers and navigation are composed in `App.tsx` and `src/core/navigation/`.
- Feature code is organized beneath `src/features/frontend_user/`.
- Secure session token storage is centralized in `src/core/auth/authSession.ts` and `src/core/storage/secureStorage.ts`.
- Theme and shared visual tokens are provided by `src/core/theme/ThemeProvider.tsx` and `useThemeTokens()`.

## 3. Local checks

```bash
npm test -- --runInBand
npm run typecheck
npm run lint
```

Native builds and Maestro scenarios require the corresponding host toolchain/device. The repository has Maestro flows in `mobile_e2e/`, but they are not yet a complete, audited role/module suite.

## 4. Verified checks on this branch

- Jest: 19 suites / 57 tests pass.
- TypeScript: `npm run typecheck` passes.
- ESLint: exits successfully with 64 warnings remaining.
- `git diff --check`: passes.
- Maestro, Android/iOS builds, and device accessibility behavior: `DEFERRED_TO_HOST_RUNTIME`.

## 5. Contract and release limitations

Backend contracts for profile/feedback endpoints, calendar day/reschedule flows, overview activity/recalculation, Pomodoro session/settings persistence, and token refresh were not supplied or are inconsistent with current feature documentation. Do not invent endpoints, permissions, payload fields, or persistence behavior. These items remain explicitly open in `RE_AUDIT_CHECKLIST_RESULT.md`.

The dependency audit reports production dependency findings (1 critical, 4 high, 7 moderate, 4 low); dependency upgrades were not included because approved compatible versions and migration scope have not been established. Required all-item 43P evidence, complete scenario mocks/tests, role/module-nested Maestro suites, and a final archive are also still pending. This branch must not be treated as an `ALL-RBGS-COMPLETE` delivery.
