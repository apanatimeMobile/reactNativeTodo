/**
 * RESPONSIBILITY: Standalone bootstrap entry point for UserOverview (≤120 lines).
 * FLOW: Configures mock network interceptors, seeds initial test fixtures, and mounts harness.
 */

import { UserOverviewHarness } from "@/features/frontend_user/user_overview/overview_dashboard/tests/harness/UserOverviewHarness";

export function bootstrapUserOverview() {
  return {
    mount: UserOverviewHarness,
    status: 'READY',
  };
}
