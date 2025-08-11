'use client';

const MIN_DELAY = 100; // 0.1 second
const MAX_DELAY = 1000; // 1 second

export const STORAGE_KEYS = {
  TEAM: 'team-dashboard-members',
  TASKS: 'team-dashboard-tasks',
} as const;

async function simulateDelay() {
  const delay = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export async function getFromStorage<T>(key: string): Promise<T | null> {
  await simulateDelay();
  const stored = localStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored) as T;
  }
  return null;
}

export async function setInStorage<T>(key: string, data: T): Promise<T> {
  await simulateDelay();
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

export async function updateInStorage<T extends { id: string }>(
  key: string,
  id: string,
  updates: Partial<T>
): Promise<T> {
  await simulateDelay();

  try {
    // Get current items
    const stored = localStorage.getItem(key);
    const items = stored ? (JSON.parse(stored) as T[]) : [];

    // Update the specific item
    const updatedItems = items.map((item) => (item.id === id ? { ...item, ...updates } : item));

    // Save back to storage
    localStorage.setItem(key, JSON.stringify(updatedItems));

    // Return the updated item
    const updatedItem = updatedItems.find((item) => item.id === id);
    if (!updatedItem) {
      throw new Error(`Item with id ${id} not found`);
    }

    return updatedItem;
  } catch (error) {
    console.error('Error updating storage:', error);
    throw error;
  }
}
