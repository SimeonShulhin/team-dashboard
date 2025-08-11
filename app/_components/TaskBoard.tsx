'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/types/index';
import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';

const TASK_STATUSES: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

function isTaskStatus(value: unknown): value is TaskStatus {
  return TASK_STATUSES.includes(value as TaskStatus);
}

interface TaskBoardProps {
  tasksByStatus: Record<TaskStatus, Task[]>;
  onTaskMove: (
    taskId: string,
    fromStatus: TaskStatus,
    toStatus: TaskStatus
  ) => Promise<{ success: boolean; message: string }>;
  onTaskStatusChange?: (taskId: string, status: TaskStatus) => void;
}

export default function TaskBoard({
  tasksByStatus,
  onTaskMove,
  onTaskStatusChange,
}: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<TaskStatus | null>(null);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'To Do', title: 'До виконання', color: 'bg-red-100 border-red-200' },
    { id: 'In Progress', title: 'В роботі', color: 'bg-yellow-100 border-yellow-200' },
    { id: 'Done', title: 'Виконано', color: 'bg-green-100 border-green-200' },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Find the task being dragged
    const task = Object.values(tasksByStatus)
      .flat()
      .find((t) => t.id === active.id);

    if (task) {
      setActiveTask(task);
      setDraggedFromColumn(task.status);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);
    setDraggedFromColumn(null);

    if (!over || !draggedFromColumn) return;

    const taskId = active.id as string;
    const newStatus = (over.data.current?.sortable.containerId ?? over.id) as TaskStatus;

    console.log({ active, over, draggedFromColumn });

    // If dropped in the same column, do nothing
    if (!TASK_STATUSES.includes(newStatus) || draggedFromColumn === newStatus) return;

    try {
      const result = await onTaskMove(taskId, draggedFromColumn, newStatus);

      if (!result.success) {
        console.error('Failed to move task:', result.message);
      }
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
    setDraggedFromColumn(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            tasks={tasksByStatus[column.id]}
            onTaskStatusChange={onTaskStatusChange}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className='transform rotate-3 opacity-80'>
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
