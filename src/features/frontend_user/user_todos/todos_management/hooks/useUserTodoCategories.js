/**
 * RESPONSIBILITY: Own the useUserTodoCategories portion of the migrated runtime.
 * FLOW: Direct consumers call this module; state and side effects retain their existing owners.
 */
import {useCallback, useEffect, useState} from 'react';

import {getItem, setItem} from "@/core/storage/jsonStorage";
import {
  normalizeCategoryList,
  normalizeCategoryName,
} from "@/features/frontend_user/user_todos/todos_management/utils/userTodosCategories";

const CUSTOM_CATEGORIES_KEY = '@todomaster/custom_categories';

export function useUserTodoCategories({tasks, setTasks}) {
  const [customCategories, setCustomCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getItem(CUSTOM_CATEGORIES_KEY, [])
      .then(saved => {
        if (active) setCustomCategories(normalizeCategoryList(saved));
      })
      .catch(error => {
        console.warn('[TodoContext] could not load categories:', error);
      })
      .finally(() => {
        if (active) setCategoriesLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (categoriesLoaded) {
      setItem(CUSTOM_CATEGORIES_KEY, normalizeCategoryList(customCategories)).catch(
        error => console.warn('[TodoContext] could not save categories:', error),
      );
    }
  }, [customCategories, categoriesLoaded]);

  const addCategory = useCallback(input => {
    const name = normalizeCategoryName(input);
    if (!name) return false;
    const taken = new Set(
      [
        ...customCategories,
        ...(tasks || [])
          .filter(task => task && !task.deleted)
          .map(task => task.category || 'General'),
      ].map(value => String(value).trim().toLowerCase()),
    );
    if (taken.has(name.toLowerCase())) return false;
    setCustomCategories(current => normalizeCategoryList([...current, name]));
    return true;
  }, [customCategories, tasks]);

  const renameCategory = useCallback((oldInput, newInput) => {
    const oldName = normalizeCategoryName(oldInput);
    const newName = normalizeCategoryName(newInput);
    if (!oldName || !newName) return false;
    if (oldName === newName) return true;

    setCustomCategories(current => {
      const exists = current.some(name => name === oldName);
      const updated = current.map(name => name === oldName ? newName : name);
      if (!exists) updated.push(newName);
      return normalizeCategoryList(updated);
    });
    setTasks(current =>
      current.map(task =>
        task && task.category === oldName
          ? {...task, category: newName}
          : task,
      ),
    );
    return true;
  }, [setTasks]);

  const deleteCategory = useCallback(input => {
    const name = normalizeCategoryName(input);
    if (!name) return false;
    setCustomCategories(current => current.filter(category => category !== name));
    setTasks(current =>
      current.map(task =>
        task && task.category === name
          ? {...task, category: 'General'}
          : task,
      ),
    );
    return true;
  }, [setTasks]);

  return {customCategories, addCategory, renameCategory, deleteCategory};
}
