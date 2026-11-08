/**
 * RESPONSIBILITY: Define the host-injected task capability boundary without owning business state.
 * FLOW: The owning task provider supplies actions/data; unrelated domains consume this port.
 */
import { createContext, useContext } from 'react';

/** @type {import('react').Context<import('./taskHost.types').TaskHost | null>} */
export const TaskHostContext = createContext(null);

export function useTaskHost() {
  const host = useContext(TaskHostContext);
  if (!host) throw new Error('useTaskHost requires the app task host provider.');
  return host;
}
