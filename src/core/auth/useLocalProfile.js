/**
 * RESPONSIBILITY: Expose the current profile host state to app consumers.
 * FLOW: App composition and feature adapters consume this shared host contract.
 */
import {useAuthContext} from "./LocalProfileProvider";

function useAuth() {
  return useAuthContext();
}

export default useAuth;