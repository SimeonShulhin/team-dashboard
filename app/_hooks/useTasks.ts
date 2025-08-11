import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, TaskStatus } from '@/types/index';
import { getFromStorage, setInStorage } from '@/utils/api';

export function useTasks(memberId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize tasks from localStorage or API
  useEffect(() => {
    const initializeTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get data from localStorage first
        const stored = await getFromStorage<Task[]>('team-dashboard-tasks');
        if (stored) {
          setTasks(stored);
          setLoading(false);
          return;
        }

        // If no localStorage data, fetch from API
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();

        // Save to localStorage and state
        await setInStorage('team-dashboard-tasks', data);
        setTasks(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error loading tasks';
        setError(message);
        console.error('Error loading tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeTasks();
  }, []);

  // Get tasks for specific member
  const memberTasks = useMemo(() => {
    if (!memberId) return tasks;
    return tasks.filter((task) => task.assignedTo === memberId);
  }, [tasks, memberId]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped = {
      'To Do': [] as Task[],
      'In Progress': [] as Task[],
      Done: [] as Task[],
    };

    memberTasks.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });

    return grouped;
  }, [memberTasks]);

  const updateTaskStatus = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      const originalTasks = [...tasks];
      try {
        // Create updated task data
        const updatedTasks = tasks.map((task) =>
          task.id === taskId
            ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
            : task
        );

        setTasks(updatedTasks);
        await setInStorage('team-dashboard-tasks', updatedTasks);

        // Make API request
        const response = await fetch('/api/tasks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: taskId,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }),
        });

        if (!response.ok) throw new Error('Failed to update task');

        // Get the response data
        const updatedTask = await response.json();

        // Validate the response
        if (!updatedTask || !updatedTask.id) {
          throw new Error('Invalid response from server');
        }

        return true;
      } catch (err) {
        // Revert both state and localStorage on error
        setTasks(originalTasks);

        const message = err instanceof Error ? err.message : 'Error updating task';
        setError(message);
        setInStorage('team-dashboard-tasks', originalTasks);
        throw err;
      }
    },
    [tasks]
  );

  // Move task between columns (drag and drop)
  const moveTask = useCallback(
    async (taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus) => {
      console.log(`Moving task ${taskId} from ${fromStatus} to ${toStatus}`);

      if (fromStatus === toStatus) return;

      try {
        await updateTaskStatus(taskId, toStatus);
        return { success: true, message: `Задачу переміщено до "${toStatus}"` };
      } catch (err) {
        return { success: false, message: 'Помилка при переміщенні задачі' };
      }
    },
    [updateTaskStatus]
  );

  // Get task statistics
  const taskStats = useMemo(() => {
    const total = memberTasks.length;
    const completed = memberTasks.filter((task) => task.status === 'Done').length;
    const inProgress = memberTasks.filter((task) => task.status === 'In Progress').length;
    const todo = memberTasks.filter((task) => task.status === 'To Do').length;

    return {
      total,
      completed,
      inProgress,
      todo,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [memberTasks]);

  return {
    tasks: memberTasks,
    tasksByStatus,
    taskStats,
    loading,
    error,
    updateTaskStatus,
    moveTask,
    setError,
  };
}
