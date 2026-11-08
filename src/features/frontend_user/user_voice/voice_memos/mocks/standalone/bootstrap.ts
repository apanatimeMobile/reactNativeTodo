/**
 * RESPONSIBILITY: Standalone bootstrap entry point for UserVoice (≤120 lines).
 * FLOW: Configures mock network interceptors, seeds initial test fixtures, and mounts harness.
 */

import { UserVoiceHarness } from "@/features/frontend_user/user_voice/voice_memos/tests/harness/UserVoiceHarness";

export function bootstrapUserVoice() {
  return {
    mount: UserVoiceHarness,
    status: 'READY',
  };
}
