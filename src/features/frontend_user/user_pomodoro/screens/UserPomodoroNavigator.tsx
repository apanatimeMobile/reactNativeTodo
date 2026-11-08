/**
 * RESPONSIBILITY: Pure Navigation Stack Shell for the User Pomodoro domain (≤80 lines).
 * FLOW: Mounts route screens for focus timer sessions; zero business logic.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { USER_POMODORO_ROUTES } from "@/features/frontend_user/user_pomodoro/pomodoro_timer/config/user_pomodoro.url_config";
import { UserPomodoroScreen } from "@/features/frontend_user/user_pomodoro/pomodoro_timer/screens/UserPomodoroScreen";

const Stack = createNativeStackNavigator();

export function UserPomodoroNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={USER_POMODORO_ROUTES.TIMER}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name={USER_POMODORO_ROUTES.TIMER} component={UserPomodoroScreen} />
    </Stack.Navigator>
  );
}
