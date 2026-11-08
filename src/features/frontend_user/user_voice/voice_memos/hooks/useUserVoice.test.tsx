/**
 * RESPONSIBILITY: Tests validated voice-transcript-to-task conversion feedback.
 * FLOW: Mount hook harness → submit transcript → assert addTodo and matching success/error result.
 */
import React from 'react';
import { Pressable } from 'react-native';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import RNFS from 'react-native-fs';
import { useUserVoice } from './useUserVoice';
import { showToast } from '../../../../../core/toast/showToast';

jest.mock('../../../../../context/TodoContext', () => {
  const context = { addTodo: jest.fn() };
  return { useTodoContext: () => context, __mockContext: context };
});
jest.mock('../../../../../core/toast/showToast', () => ({ showToast: jest.fn() }));
jest.mock('../../../../../core/i18n/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => ({
    'user_voice_memos.TASK_CREATED': 'Task created from voice memo.',
    'user_voice_memos.TASK_CREATE_ERROR': 'Task could not be created from this voice memo.',
    'user_voice_memos.TRANSCRIPT_REQUIRED': 'Add transcript or notes before creating a task.',
  }[key] ?? key) }),
}));
jest.mock('./useUserVoiceMemos', () => ({
  useUserVoiceMemos: jest.fn(),
}));
jest.mock('./useVoicePlayback', () => ({
  useVoicePlayback: () => ({
    activePlayingId: null,
    togglePlayback: jest.fn(async () => undefined),
    stopPlayback: jest.fn(async () => undefined),
  }),
}));
jest.mock('./useVoiceRecorder', () => ({
  useVoiceRecorder: () => ({
    isRecording: false, isProcessing: false, elapsedMs: 0, recordingError: false,
    startRecording: jest.fn(async () => undefined),
    stopRecording: jest.fn(async () => undefined),
  }),
}));
const mockTodoContext = jest.requireMock('../../../../../context/TodoContext').__mockContext;
const mockUseUserVoiceMemos = jest.requireMock('./useUserVoiceMemos').useUserVoiceMemos as jest.Mock;

const testMemo = {
  id: 'test-memo', title: 'Voice memo', transcript: '', audioPath: '/mock/audio.m4a', durationMs: 0, createdAt: 1,
};

function makeMemoState(memos = [testMemo]) {
  return {
    memos, isLoading: false, storageError: false,
    addMemo: jest.fn(async () => true),
    updateTranscript: jest.fn(async () => true),
    removeMemo: jest.fn(async () => true),
  };
}

function SaveTaskHarness({ transcript }: { transcript: string }) {
  const { saveAsTask } = useUserVoice();
  return <Pressable testID="user_voice-save-as-task-test" onPress={() => saveAsTask({ id: 'test-memo', title: transcript, transcript, durationMs: 0, createdAt: 1 })} />;
}

function DeleteMemoHarness({ onResult }: { onResult: (result: boolean) => void }) {
  const { deleteMemo } = useUserVoice();
  return <Pressable testID="user_voice-delete-memo-test" onPress={async () => onResult(await deleteMemo(testMemo.id))} />;
}

async function deleteMemoWithState(state: ReturnType<typeof makeMemoState>) {
  mockUseUserVoiceMemos.mockReturnValue(state);
  let root!: ReactTestRenderer;
  let result: boolean | undefined;
  act(() => { root = create(<DeleteMemoHarness onResult={(value) => { result = value; }} />); });
  await act(async () => { await root.root.findByProps({ testID: 'user_voice-delete-memo-test' }).props.onPress(); });
  act(() => root.unmount());
  return result;
}

describe('useUserVoice saveAsTask', () => {
  beforeEach(() => {
    mockTodoContext.addTodo.mockClear();
    (showToast as jest.Mock).mockClear();
    mockUseUserVoiceMemos.mockReturnValue(makeMemoState());
    (RNFS.exists as jest.Mock).mockReset().mockResolvedValue(true);
    (RNFS.unlink as jest.Mock).mockReset().mockResolvedValue(undefined);
  });

  it('creates a task from non-empty transcript and only then shows success feedback', async () => {
    let root!: ReactTestRenderer;
    act(() => { root = create(<SaveTaskHarness transcript="  Call the dentist  " />); });
    await act(async () => { await root.root.findByProps({ testID: 'user_voice-save-as-task-test' }).props.onPress(); });
    expect(mockTodoContext.addTodo).toHaveBeenCalledWith({
      title: 'Call the dentist',
      category: 'Personal',
      priority: 'medium',
    });
    expect(showToast).toHaveBeenCalledWith('Task created from voice memo.', 'success', 'user_voice:task:created:test-memo');
    act(() => root.unmount());
  });

  it('rejects an empty transcript without creating a task or showing success', async () => {
    let root!: ReactTestRenderer;
    act(() => { root = create(<SaveTaskHarness transcript="   " />); });
    await act(async () => { await root.root.findByProps({ testID: 'user_voice-save-as-task-test' }).props.onPress(); });
    expect(mockTodoContext.addTodo).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith(
      'Add transcript or notes before creating a task.',
      'error',
      'user_voice:task:empty:test-memo',
    );
    act(() => root.unmount());
  });

  it('keeps metadata and reports failure when checking the audio file fails', async () => {
    const state = makeMemoState();
    (RNFS.exists as jest.Mock).mockRejectedValue(new Error('filesystem unavailable'));

    await expect(deleteMemoWithState(state)).resolves.toBe(false);
    expect(state.removeMemo).not.toHaveBeenCalled();
    expect(RNFS.unlink).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith('user_voice_memos.MEMO_DELETE_FAILED', 'error', 'user_voice:memo:delete-failed:test-memo');
    expect(showToast).not.toHaveBeenCalledWith(expect.anything(), 'success', expect.anything());
  });

  it('keeps metadata and reports failure when unlinking the audio file fails', async () => {
    const state = makeMemoState();
    (RNFS.unlink as jest.Mock).mockRejectedValue(new Error('unlink failed'));

    await expect(deleteMemoWithState(state)).resolves.toBe(false);
    expect(RNFS.exists).toHaveBeenCalledWith(testMemo.audioPath);
    expect(RNFS.unlink).toHaveBeenCalledWith(testMemo.audioPath);
    expect(state.removeMemo).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith('user_voice_memos.MEMO_DELETE_FAILED', 'error', 'user_voice:memo:delete-failed:test-memo');
    expect(showToast).not.toHaveBeenCalledWith(expect.anything(), 'success', expect.anything());
  });

  it('removes metadata and reports success after the audio file is deleted', async () => {
    const state = makeMemoState();

    await expect(deleteMemoWithState(state)).resolves.toBe(true);
    expect(state.removeMemo).toHaveBeenCalledWith(testMemo.id);
    expect(showToast).toHaveBeenCalledWith('user_voice_memos.MEMO_DELETED', 'success', 'user_voice:memo:deleted:test-memo');
  });

  it('reports failure without success when metadata removal cannot be saved', async () => {
    const state = makeMemoState();
    state.removeMemo.mockResolvedValue(false);

    await expect(deleteMemoWithState(state)).resolves.toBe(false);
    expect(RNFS.unlink).toHaveBeenCalledWith(testMemo.audioPath);
    expect(state.removeMemo).toHaveBeenCalledWith(testMemo.id);
    expect(showToast).toHaveBeenCalledWith('user_voice_memos.MEMO_DELETE_FAILED', 'error', 'user_voice:memo:delete-failed:test-memo');
    expect(showToast).not.toHaveBeenCalledWith(expect.anything(), 'success', expect.anything());
  });
});
