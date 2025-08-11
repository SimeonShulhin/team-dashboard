'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/types/index';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
  onTaskStatusChange?: (taskId: string, status: TaskStatus) => void;
}

export default function TaskColumn({
  id,
  title,
  color,
  tasks,
  onTaskStatusChange,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div className='flex flex-col'>
      {/* Column Header */}
      <div className={`rounded-t-lg border-2 border-b-0 p-4 ${color}`}>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold text-gray-900'>{title}</h3>
          <span className='bg-white rounded-full px-2 py-1 text-xs font-medium text-gray-600'>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 bg-white rounded-b-lg border-2 border-t-0 p-4 min-h-[400px] transition-colors
          ${color.replace('bg-', 'border-')}
          ${isOver ? 'bg-gray-50' : ''}
        `}>
        <SortableContext id={id} items={taskIds} strategy={verticalListSortingStrategy}>
          <div className='space-y-3'>
            {tasks.length === 0 ? (
              <div className='flex items-center justify-center h-32 text-gray-400 text-sm'>
                <div className='text-center'>
                  <div className='text-2xl mb-2'>📋</div>
                  <p>Перетягніть задачі сюди</p>
                </div>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard key={task.id} task={task} onStatusChange={onTaskStatusChange} />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
