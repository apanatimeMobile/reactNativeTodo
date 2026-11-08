/**
 * RESPONSIBILITY: Fail closed until a verified token-exchange contract is available.
 * FLOW: Refresh request → unavailable result; never return a refresh token as an access token.
 */

/**
 * No refresh endpoint is supplied. Callers must require re-authentication on null.
 * Existing stored credentials are not removed by this unavailable exchange.
 */
export async function refreshAuthToken(): Promise<string | null> {
  return null;
}

export default { refreshAuthToken };
