/**
 * RESPONSIBILITY: Standalone bootstrap entry point for UserPomodoro (≤120 lines).
 * FLOW: Exposes the isolated timer harness; session persistence and network interception are intentionally absent.
 */

import { UserPomodoroHarness } from "@/features/frontend_user/user_pomodoro/pomodoro_timer/tests/harness/UserPomodoroHarness";

export function bootstrapUserPomodoro() {
  return {
    mount: UserPomodoroHarness,
    status: 'READY',
  };
}
