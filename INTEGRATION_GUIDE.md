# TaskLume Mobile Integration Guide

## 1. Changelog — legacy runtime migration

Branch: `temp`. Live runtime code has been migrated out of the old `src/context`, `src/hooks`, `src/services`, `src/storage`, `src/constants`, `src/types`, `src/utils`, and `src/i18n` locations. Those directories are no longer retained as compatibility facades. Static app images remain in `src/assets/images`.

This migration preserves local/offline features, stored task/profile/preferences/history keys, trash retention, audio payloads, and native notification identifiers. It does not invent backend contracts or change dependency versions/native project configuration.

## 2. Ownership and integration map

| Previous location | Current owner |
|---|---|
| `context/TodoContext.js` | `features/frontend_user/user_todos/todos_management/state/UserTodosContext.js`, composed from lifecycle/category/CRUD/import/completion/timer/trash/selector hooks. |
| Task-aware consumers in other domains | `core/contracts/taskHost.js` and `taskHost.types.ts`: host-injected port; the owning feature remains the single state owner. No cross-feature store import is required. |
| `utils/todoHelpers.js`, `utils/recurrence.js` | Todos feature-local normalization, category, recurrence, summary, and trash-retention utilities. |
| `utils/todoTimerNotifications.js` | Domain notification behavior in Todos/Pomodoro utilities; shared native channel/configuration/permission/state/vibration plumbing in `core/notifications`. All callers import concrete modules. |
| `services/soundService.js`, `assets/soundsData.js` | Focused `core/audio` initialization/loading/playback/priority/state/data modules. Task/focus conflict decisions remain with Todos. Embedded sound data is preserved. |
| `context/AuthContext.js`, `hooks/useAuth.js` | `core/auth/LocalProfileProvider.js` and `useLocalProfile.js`; local profile is not remote session authentication. |
| `context/SettingsContext.js` | `core/preferences/PreferencesProvider.js`; existing preference values and keys retained. |
| `context/AppLockContext.js` | `core/security/AppLockProvider.js`; device authentication and Keychain service retained. |
| `context/ThemeContext.js`, `hooks/useTheme.js`, `constants/colors.js` | Canonical `core/theme/ThemeProvider.tsx` owns mode; `AccentThemeProvider.js` owns the existing accent preference. Legacy saved mode is read when the canonical key is absent; palettes and stored accent selection remain available. |
| `storage/storage.js` | `core/storage/jsonStorage.js`; existing fallback/strict I/O semantics retained. Secure credentials still use the separate secure-storage gateway. |
| `constants/appConfig.js` | `core/config/appConfig.js`; original storage-key values retained. |
| `utils/helpers.js`, `utils/dateUtils.js`, `utils/haptics.js` | Generic helpers in `core/utils`; preference-aware device feedback in `core/interaction`. Todo-specific summaries moved to their owning feature. |
| `types/index.d.ts` | Generic preferences/appearance declarations in `core/contracts`; Todo/Pomodoro declarations in owning feature `types` folders. |
| `i18n/generated` | `core/i18n/generated`; feature-local locale JSONs remain with their features. |

## 3. Host composition and imports

`index.js` mounts `App.tsx`. App composition supplies the canonical theme, accent preferences, global preferences, local profile, app lock, task host, and navigation. Feature screens consume canonical theme tokens and typed host contracts.

Repository source imports now use `@/` for paths below `src/`. The same mapping is configured in `tsconfig.json`, `jest.config.js`, and Metro's resolver. No new resolver dependency or Babel plugin was installed. Direct module imports replace legacy barrels or forwarding files.

## 4. Verification

```bash
npm test -- --runInBand
npm run typecheck
npm run lint
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output /tmp/mobile-migration/index.android.bundle --assets-dest /tmp/mobile-migration/assets --max-workers 2
```

Final executed counts and bundle status are recorded in `compliance_manifest.json` and `RE_AUDIT_CHECKLIST_RESULT.md`. Native device/emulator execution is separate from Metro bundling: no device appearance, permissions, alarms, biometrics, or Maestro execution is certified by a JavaScript bundle or component tests.

**Final verification:** 39 Jest suites / 103 tests passed; TypeScript passed; ESLint has 0 errors and 61 warnings; diff checks passed. Both Android and iOS production Metro bundles were generated successfully. Metro emitted an upstream React Native private-feature-flags exports warning and used its documented file-resolution fallback; neither bundle failed.

## 5. Remaining release gates

Structural migration is not a certification that every original prompt rule is satisfied. Dependency advisories, backend contracts, full item-by-item rule evidence, standalone mock/host coverage, remaining UI/token/typed-source cleanup, oversized existing navigation shells, and full Maestro/device checks remain open. Local data was not converted to a newly invented server or storage schema. Do not label this `ALL-RBGS-COMPLETE` solely because structural checks and tests pass.
