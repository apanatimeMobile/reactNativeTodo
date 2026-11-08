import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, create } from 'react-test-renderer';
import { LocalProfileProvider, useLocalProfileContext } from "@/core/auth/LocalProfileProvider";
import APP_CONFIG from "@/core/config/appConfig";

it('keeps the persisted local profile and updates it using the original storage key', async () => {
  await AsyncStorage.clear();
  await AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify({ name: 'Saved', email: 'saved@example.invalid', mobile: '' }));
  let profile;
  function Capture() { profile = useLocalProfileContext(); return null; }
  let root;
  await act(async () => { root = create(<LocalProfileProvider><Capture /></LocalProfileProvider>); });
  expect(profile.user.name).toBe('Saved');
  await act(async () => { await profile.updateProfile(' Updated ', '', 'updated@example.invalid'); });
  expect(JSON.parse(await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_USER))).toMatchObject({ name: 'Updated', email: 'updated@example.invalid' });
  await act(async () => root.unmount());
});
