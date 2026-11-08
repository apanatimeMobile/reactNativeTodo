import {useAuthContext} from "./LocalProfileProvider";

function useAuth() {
  return useAuthContext();
}

export default useAuth;