/**
 * RESPONSIBILITY: Verifies feedback validation, submit guarding, and confirmed-success reset behavior.
 * FLOW: Interact with the controlled form and assert callback and retained/reset values.
 */
import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { Text, TextInput } from 'react-native';
import { I18nProvider } from '../../../../../core/i18n/useTranslation';
import { getMinTouchTarget } from '../../../../../core/theme/getMinTouchTarget';
import { triggerSuccessNotification } from '../../../../../core/interaction/haptics';
import { UserFeedbackMainView } from './UserFeedbackMainView';

jest.mock('../../../../../core/theme/useThemeTokens', () => ({
  useThemeTokens: () => ({
    color: {
      background: '#fff', card: '#fff', border: '#ddd', foreground: '#111', muted: '#555',
      primary: '#06c', primarySubtle: '#eef', primaryText: '#05a', onPrimary: '#fff', destructive: '#b00',
    },
    space: { 2: 8, 3: 12, 4: 16, 9: 36 },
    radius: { md: 8, lg: 12 },
    typography: {
      headingLg: { fontSize: 24 }, body: { fontSize: 16 }, bodySm: { fontSize: 14 },
      labelUppercase: { fontSize: 14 },
    },
  }),
}));

jest.mock('../../../../../core/interaction/haptics', () => ({
  triggerLightImpact: jest.fn(),
  triggerSuccessNotification: jest.fn(),
}));

jest.mock('lucide-react-native', () => {
  const ReactMock = require('react');
  const { View } = require('react-native');
  const Icon = () => ReactMock.createElement(View);
  return { ArrowLeft: Icon, Send: Icon, Star: Icon, Bug: Icon, Lightbulb: Icon, Heart: Icon, MessageCircle: Icon };
});

function renderFeedback(onSubmit: (data: { category: string; rating: number; message: string }) => Promise<boolean>, locale: 'en' | 'hi' = 'en') {
  let root!: ReactTestRenderer;
  act(() => {
    root = create(
      <I18nProvider initialLocale={locale}>
        <UserFeedbackMainView onSubmit={onSubmit} />
      </I18nProvider>,
    );
  });
  return root;
}

async function enterMessage(root: ReactTestRenderer, message: string) {
  const input = root.root.findByProps({ testID: 'mobile:user_settings:feedback:message_input' });
  await act(async () => { input.props.onChangeText(message); });
  return root.root.findByProps({ testID: 'mobile:user_settings:feedback:message_input' });
}

async function submit(root: ReactTestRenderer) {
  const button = root.root.findByProps({ testID: 'mobile:user_settings:feedback:submit_button' });
  await act(async () => { await button.props.onPress(); });
}

describe('UserFeedbackMainView', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows localized inline validation and does not submit an invalid message', async () => {
    const onSubmit = jest.fn(async () => true);
    const root = renderFeedback(onSubmit);
    await submit(root);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(root.root.findAllByType(Text).some(({ props }) =>
      props.children === 'Feedback must be at least 5 characters.',
    )).toBe(true);
    expect(root.root.findAllByType(Text).some(({ props }) => props.accessibilityRole === 'alert')).toBe(true);
    act(() => root.unmount());
  });

  it.each([
    { result: 'returns false', callback: async () => false },
    { result: 'throws', callback: async () => { throw new Error('submission failed'); } },
  ])('preserves entered feedback when the callback $result', async ({ callback }) => {
    const onSubmit = jest.fn(callback);
    const root = renderFeedback(onSubmit);
    await enterMessage(root, 'Please improve this');
    await submit(root);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(root.root.findByType(TextInput).props.value).toBe('Please improve this');
    expect(triggerSuccessNotification).not.toHaveBeenCalled();
    act(() => root.unmount());
  });

  it('prevents duplicate pending submissions and resets only after confirmed success', async () => {
    let resolveSubmit!: (result: boolean) => void;
    let notifySubmitStarted!: () => void;
    const submitStarted = new Promise<void>((resolve) => { notifySubmitStarted = resolve; });
    const onSubmit = jest.fn(() => {
      notifySubmitStarted();
      return new Promise<boolean>((resolve) => { resolveSubmit = resolve; });
    });
    const root = renderFeedback(onSubmit);
    await enterMessage(root, 'Please improve this');
    const button = root.root.findByProps({ testID: 'mobile:user_settings:feedback:submit_button' });

    await act(async () => {
      const first = button.props.onPress();
      const second = button.props.onPress();
      await submitStarted;
      expect(onSubmit).toHaveBeenCalledTimes(1);
      resolveSubmit(true);
      await Promise.all([first, second]);
    });

    expect(root.root.findByType(TextInput).props.value).toBe('');
    expect(triggerSuccessNotification).toHaveBeenCalledTimes(1);
    act(() => root.unmount());
  });

  it('localizes category labels and exposes selected state and minimum touch size', () => {
    const root = renderFeedback(jest.fn(async () => true), 'hi');
    const selected = root.root.findByProps({ testID: 'mobile:user_settings:feedback:category_feature' });
    const categoryLabel = selected.findByType(Text);

    expect(categoryLabel.props.children).toBe('नई सुविधा');
    expect(selected.props.accessibilityState.selected).toBe(true);
    expect(selected.props.style[0].minHeight).toBeGreaterThanOrEqual(getMinTouchTarget());
    act(() => root.unmount());
  });
});
