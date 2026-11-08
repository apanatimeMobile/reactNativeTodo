import React from 'react';

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import notifee, {EventType} from '@notifee/react-native';

import {
  LocalProfileProvider,
} from "@/core/auth/LocalProfileProvider";

import { TodoProvider } from "@/features/frontend_user/user_todos/todos_management/state/UserTodosContext";

import {
  AccentPreferencesProvider,
} from "@/core/theme/AccentThemeProvider";

import {
  PreferencesProvider,
} from "@/core/preferences/PreferencesProvider";

import RootNavigator from "@/core/navigation/RootNavigator";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from "@/core/i18n/useTranslation";

import { prepareTodoTimerNotifications } from "@/core/notifications/prepareTodoTimerNotifications";
import { initSoundService } from "@/core/audio/soundInitialization";
import { playAlarmSound } from "@/core/audio/alarmPlayback";
import { playAlertSound } from "@/core/audio/alertPlayback";
import { stopSound } from "@/core/audio/audioState";

import Toast from 'react-native-toast-message';

import {
  AppLockProvider,
} from "@/core/security/AppLockProvider";
import LockScreen from "@/core/ui/LockScreen";
import ErrorBoundary from "@/core/ui/ErrorBoundary";

import {
  ThemeProvider as CoreThemeProvider,
} from "@/core/theme/ThemeProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
    mutations: { retry: 0 },
  },
});

/* ============================================================ */
/*  APP COMPONENT                                               */
/* ============================================================ */
function App() {
  React.useEffect(() => {
    initSoundService().catch(() => {});
    prepareTodoTimerNotifications().catch(() => {});

    // Foreground notification sound + vibration trigger
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.DELIVERED) {
        const notif = detail.notification;
        const notifId = String(notif?.id || '');
        const isStartOrRunning =
          notifId.includes('start') || notifId.includes('running');
        const isDoneBanner =
          notifId.includes('done') || notifId.includes('alert');

        if (!isStartOrRunning && !isDoneBanner) {
          if (notifId.startsWith('todo-timer') && !notifId.includes('start') && !notifId.includes('running')) {
            playAlarmSound(true, 5000);
          } else if (
            notifId === 'focus-timer-completion' ||
            notifId === 'pomodoro-focus-completion'
          ) {
            playAlarmSound(true, 3000);
          } else if (notifId.startsWith('todo-reminder')) {
            playAlertSound(true);
          }
        }
      } else if (
        type === EventType.PRESS ||
        type === EventType.DISMISSED ||
        type === EventType.ACTION_PRESS
      ) {
        stopSound();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <CoreThemeProvider>
            <QueryClientProvider client={queryClient}>
              <I18nProvider>
                <AccentPreferencesProvider>
                  <PreferencesProvider>
                <AppLockProvider>
                  <LocalProfileProvider>
                    <TodoProvider>
                      <RootNavigator />
                      <LockScreen />
                      <Toast />
                    </TodoProvider>
                  </LocalProfileProvider>
                </AppLockProvider>
                  </PreferencesProvider>
                </AccentPreferencesProvider>
              </I18nProvider>
            </QueryClientProvider>
          </CoreThemeProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

export default App;
