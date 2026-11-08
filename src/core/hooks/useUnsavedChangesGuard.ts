/**
 * RESPONSIBILITY: Prevents navigation away from dirty forms until the user decides.
 * FLOW: React Navigation removal → confirmation state → cancel or dispatch original action.
 */
import { useCallback, useRef } from 'react';
import { useNavigation, usePreventRemove } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useConfirm, type ConfirmOptions } from './useConfirm';

export function useUnsavedChangesGuard(isDirty: boolean, options: ConfirmOptions) {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const confirmation = useConfirm();
  const pendingRef = useRef(false);
  const submitNavigationRef = useRef(false);

  usePreventRemove(isDirty, ({ data }) => {
    if (submitNavigationRef.current) {
      submitNavigationRef.current = false;
      navigation.dispatch(data.action);
      return;
    }
    if (pendingRef.current) return;

    pendingRef.current = true;
    confirmation.confirm(options).then((shouldDiscard) => {
      pendingRef.current = false;
      if (shouldDiscard) navigation.dispatch(data.action);
    });
  });

  const allowNavigationAfterSubmit = useCallback(() => {
    submitNavigationRef.current = true;
  }, []);

  return {
    isOpen: confirmation.isOpen,
    options: confirmation.options,
    handleConfirm: confirmation.handleConfirm,
    handleCancel: confirmation.handleCancel,
    allowNavigationAfterSubmit,
  };
}

export default useUnsavedChangesGuard;
