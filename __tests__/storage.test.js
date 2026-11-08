import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getItem,
  setItem,
  removeItem,
  clearStorage,
} from "../src/core/storage/jsonStorage";

describe('Storage Service', () => {
  beforeEach(async () => {
    await clearStorage();
  });

  it('stores and retrieves string values', async () => {
    await setItem('test_key', 'hello_world');
    const result = await getItem('test_key', null);
    expect(result).toBe('hello_world');
  });

  it('stores and retrieves complex JSON objects', async () => {
    const data = {id: '123', title: 'Test Todo', completed: false, count: 5};
    await setItem('test_obj', data);
    const result = await getItem('test_obj', null);
    expect(result).toEqual(data);
  });

  it('surfaces strict write failures to its owner', async () => {
    AsyncStorage.setItem.mockRejectedValueOnce(new Error('write failed'));
    await expect(setItem('tasks', [], true)).rejects.toThrow('write failed');
  });

  it('surfaces strict read failures instead of silently returning an empty value', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('read failed'));
    await expect(getItem('tasks', [], true)).rejects.toThrow('read failed');
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('read failed'));
    await expect(getItem('tasks', [])).resolves.toEqual([]);
  });

  it('returns defaultValue when key is not present', async () => {
    const result = await getItem('non_existent', 'fallback');
    expect(result).toBe('fallback');
  });

  it('removes item properly', async () => {
    await setItem('to_remove', 'value');
    await removeItem('to_remove');
    const result = await getItem('to_remove', null);
    expect(result).toBeNull();
  });

  it('clears storage properly', async () => {
    await setItem('key1', 'val1');
    await setItem('key2', 'val2');
    await clearStorage();
    const res1 = await getItem('key1', null);
    const res2 = await getItem('key2', null);
    expect(res1).toBeNull();
    expect(res2).toBeNull();
  });
});
