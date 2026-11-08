# TaskLume Mobile Integration Guide

**Target:** bare React Native, New Architecture (Fabric/TurboModules).

**Repair branch:** `temp`.

**Status:** source repairs and safe legacy migration; not a full compliance/release certification.

## 1. Changelog

The follow-up cleanup moved the unused global focus-history service and its tests into the owning Pomodoro capability, retained the stored history key/cap, and connected timer completion to real local history. Live contexts, audio/notification services, declarations and integration artifacts were retained after reference tracing.

Additional repairs cover strict storage recovery (including corrupt task payloads), real loading/error branches, missing-record navigation, safe crash recovery, fail-closed unconfigured token refresh, feedback validation/pending state, dirty todo-form confirmation, localized accessible controls, and voice-file/permission recovery tests. See `RE_AUDIT_CHECKLIST_RESULT.md` for evidence and remaining gates.

## 2. Integration points

- Entry: `index.js` → `App.tsx`; navigation: `src/core/navigation/`.
- Host providers remain in `App.tsx`; their live consumers must not be removed as unused legacy code.
- Feature ownership: `src/features/frontend_user/`.
- Focus-session persistence: `user_pomodoro/pomodoro_timer/utils/userPomodoroSessions.js`; no backend is required for local history. The prior global `focusService.js` path is removed.
- Theme: `src/core/theme/ThemeProvider.tsx` and `useThemeTokens()`; outermost crash recovery uses the existing static dark tokens because providers may themselves have failed.
- Credentials: centralized auth/secure-storage modules. Unconfigured refresh returns `null`; callers must require re-authentication rather than use a refresh token as an access token.

## 3. Verification commands

```bash
npm test -- --runInBand
npm run typecheck
npm run lint
npm audit --omit=dev
```

Executed final results are recorded in `compliance_manifest.json`. Native builds and device interaction checks have not been run. On a configured native host, use the existing `npm run android` / `npm run ios` scripts and `maestro test mobile_e2e/`; the current Maestro suite still needs coverage and hierarchy repairs before it can certify the feature set.

## 4. Release limitations

No backend contract pack or source web ZIP was supplied. Documented API routes that conflict with local implementation are not authorization to invent server behavior. No dependency upgrades or native project modifications were made. The production dependency audit, remaining architecture/design/mock/E2E findings and full item-by-item rule evidence are still open. Do not describe this branch as `ALL-RBGS-COMPLETE` or production-ready based only on passing source tests.
