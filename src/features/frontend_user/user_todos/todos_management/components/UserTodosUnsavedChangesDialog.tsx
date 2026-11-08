/**
 * RESPONSIBILITY: Renders the dirty-form discard decision using the Todo confirmation modal.
 * FLOW: useUnsavedChangesGuard state → Todo-local dialog → cancel or discard handler.
 */
import React from 'react';
import { useTranslation } from '../../../../../core/i18n/useTranslation';
import type { useUnsavedChangesGuard } from '../../../../../core/hooks/useUnsavedChangesGuard';
import { UserTodosConfirmDialog } from './UserTodosConfirmDialog';

interface UserTodosUnsavedChangesDialogProps {
  guard: ReturnType<typeof useUnsavedChangesGuard>;
}

export function UserTodosUnsavedChangesDialog({ guard }: UserTodosUnsavedChangesDialogProps) {
  const { t } = useTranslation();
  return (
    <UserTodosConfirmDialog
      visible={guard.isOpen}
      title={guard.options.title}
      description={guard.options.description}
      confirmLabel={guard.options.confirmLabel ?? t('user_todos_management.DISCARD_CHANGES_CONFIRM')}
      onCancel={guard.handleCancel}
      onConfirm={guard.handleConfirm}
    />
  );
}
