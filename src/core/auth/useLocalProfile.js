/**
 * RESPONSIBILITY: Expose the current profile host state to app consumers.
 * FLOW: App composition and feature adapters consume this shared host contract.
 */
import {useLocalProfileContext} from "@/core/auth/LocalProfileProvider";

function useLocalProfile() {
  return useLocalProfileContext();
}

export default useLocalProfile;