/**
 * RESPONSIBILITY: Standalone bootstrap entry point for UserTodos (≤120 lines).
 * FLOW: Exposes the scenario-driven standalone harness; network interception is not configured here.
 */

import { UserTodosHarness } from "@/features/frontend_user/user_todos/todos_management/tests/harness/UserTodosHarness";

export function bootstrapUserTodos() {
  return {
    mount: UserTodosHarness,
    status: 'READY',
  };
}
