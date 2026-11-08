import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { usePreventRemove } from '@react-navigation/native';
import { useUnsavedChangesGuard } from './useUnsavedChangesGuard';

type PreventRemoveCallback = Parameters<typeof usePreventRemove>[1];
type PreventRemoveEvent = Parameters<PreventRemoveCallback>[0];

const mockDispatch = jest.fn();
let mockPreventRemoveCallback: PreventRemoveCallback | undefined;
let mockPreventRemoveEnabled = false;

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ dispatch: mockDispatch }),
  usePreventRemove: (enabled: boolean, callback: PreventRemoveCallback) => {
    mockPreventRemoveEnabled = enabled;
    mockPreventRemoveCallback = callback;
  },
}));

let guardState: ReturnType<typeof useUnsavedChangesGuard> | undefined;

function GuardHarness({ isDirty }: { isDirty: boolean }) {
  guardState = useUnsavedChangesGuard(isDirty, {
    title: 'Discard changes?',
    description: 'Unsaved task changes will be lost.',
    confirmLabel: 'Discard',
    cancelLabel: 'Keep editing',
    isDestructive: true,
  });
  return null;
}

function removalEvent(): PreventRemoveEvent {
  return { data: { action: { type: 'GO_BACK' } } } as PreventRemoveEvent;
}

describe('useUnsavedChangesGuard', () => {
  let root: ReactTestRenderer;

  beforeEach(() => {
    mockDispatch.mockClear();
    mockPreventRemoveCallback = undefined;
    mockPreventRemoveEnabled = false;
    guardState = undefined;
  });

  afterEach(() => {
    if (root) act(() => root.unmount());
  });

  it('confirms removal and dispatches the original navigation action', async () => {
    act(() => { root = create(<GuardHarness isDirty />); });
    const action = removalEvent().data.action;

    act(() => { mockPreventRemoveCallback?.(removalEvent()); });
    expect(guardState?.isOpen).toBe(true);
    expect(mockDispatch).not.toHaveBeenCalled();

    await act(async () => {
      guardState?.handleConfirm();
      await Promise.resolve();
    });
    expect(mockDispatch).toHaveBeenCalledWith(action);
  });

  it('keeps dirty state and does not navigate when confirmation is canceled', async () => {
    act(() => { root = create(<GuardHarness isDirty />); });
    act(() => { mockPreventRemoveCallback?.(removalEvent()); });

    await act(async () => {
      guardState?.handleCancel();
      await Promise.resolve();
    });
    expect(mockPreventRemoveEnabled).toBe(true);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(guardState?.isOpen).toBe(false);
  });

  it('allows successful-submit navigation without opening the discard dialog', () => {
    act(() => { root = create(<GuardHarness isDirty />); });
    const event = removalEvent();
    guardState?.allowNavigationAfterSubmit();

    act(() => { mockPreventRemoveCallback?.(event); });
    expect(mockDispatch).toHaveBeenCalledWith(event.data.action);
    expect(guardState?.isOpen).toBe(false);
  });

  it('keeps the discard prompt active when persistence fails before navigation is allowed', async () => {
    act(() => { root = create(<GuardHarness isDirty />); });
    const persist = jest.fn().mockRejectedValue(new Error('save failed'));
    try {
      await persist();
      guardState?.allowNavigationAfterSubmit();
    } catch {
      // Failed persistence must not arm the navigation bypass.
    }

    act(() => { mockPreventRemoveCallback?.(removalEvent()); });
    expect(guardState?.isOpen).toBe(true);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it('ignores duplicate removal attempts while a decision is pending', () => {
    act(() => { root = create(<GuardHarness isDirty />); });
    act(() => {
      mockPreventRemoveCallback?.(removalEvent());
      mockPreventRemoveCallback?.(removalEvent());
    });

    expect(guardState?.isOpen).toBe(true);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
