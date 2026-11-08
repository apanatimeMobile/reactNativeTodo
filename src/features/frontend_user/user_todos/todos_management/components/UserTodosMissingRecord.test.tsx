import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { I18nProvider } from "@/core/i18n/useTranslation";
import { ThemeProvider } from "@/core/theme/ThemeProvider";
import { UserTodosMissingRecord } from "@/features/frontend_user/user_todos/todos_management/components/UserTodosMissingRecord";

it('explains missing tasks and provides an explicit back action', async () => {
  const onBack = jest.fn();
  let root!: ReactTestRenderer;
  await act(async () => {
    root = create(<I18nProvider><ThemeProvider><UserTodosMissingRecord onBack={onBack} /></ThemeProvider></I18nProvider>);
  });
  expect(JSON.stringify(root.toJSON())).toContain('This task is no longer available.');
  const button = root.root.findAll((node) => node.props.testID === 'user_todos-missing-back' && typeof node.props.onPress === 'function')[0];
  await act(async () => button.props.onPress());
  expect(onBack).toHaveBeenCalledTimes(1);
  await act(async () => root.unmount());
});
