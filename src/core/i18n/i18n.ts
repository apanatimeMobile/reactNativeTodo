/**
 * RESPONSIBILITY: Canonical i18n core manifest and translation orchestrator (Section 967).
 * FLOW: Consumed by useTranslation and network client for localized telemetry and Accept-Language headers.
 */

export {
  type SupportedLocale,
  getActiveLocale,
  setActiveLocale,
  normalizeLocale,
  detectDeviceLocale,
} from "@/core/i18n/locale";

export { useTranslation, I18nProvider } from "@/core/i18n/useTranslation";
