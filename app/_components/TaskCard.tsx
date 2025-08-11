'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Task, TaskStatus } from '@/types/index';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

export default function TaskCard({ task, isDragging = false, onStatusChange }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className='h-4 w-4 text-red-500' />;
      case 'medium':
        return <Clock className='h-4 w-4 text-yellow-500' />;
      case 'low':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'Високий';
      case 'medium':
        return 'Середній';
      case 'low':
        return 'Низький';
      default:
        return priority;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        touch-action-none bg-white rounded-lg border border-gray-200 shadow-sm p-4 cursor-grab active:cursor-grabbing
        hover:shadow-md transition-all duration-200 border-l-4
        ${getPriorityColor(task.priority)}
        ${isDragging ? 'shadow-lg rotate-3 scale-105' : ''}
      `}>
      {/* Task Header */}
      <div className='flex items-start justify-between mb-3'>
        <h4 className='font-medium text-gray-900 text-sm leading-tight flex-1'>{task.title}</h4>
        <div className='flex items-center space-x-1 ml-2'>{getPriorityIcon(task.priority)}</div>
      </div>

      {/* Task Description */}
      {task.description && (
        <p className='text-xs text-gray-600 mb-3 line-clamp-2'>{task.description}</p>
      )}

      {/* Task Footer */}
      <div className='flex items-center justify-between text-xs text-gray-500'>
        <div className='flex items-center space-x-1'>
          <Calendar className='h-3 w-3' />
          <span>{formatDate(task.updatedAt)}</span>
        </div>

        <span
          className={`
          px-2 py-1 rounded-full font-medium
          ${task.priority === 'high' ? 'bg-red-100 text-red-700' : ''}
          ${task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
          ${task.priority === 'low' ? 'bg-green-100 text-green-700' : ''}
        `}>
          {getPriorityLabel(task.priority)}
        </span>
      </div>

      {/* Status indicator for current column */}
      <div className='mt-2 pt-2 border-t border-gray-100'>
        <div className='flex items-center justify-between'>
          <span className='text-xs text-gray-400'>ID: {task.id}</span>

          {/* Quick status change buttons (if callback provided) */}
          {onStatusChange && (
            <div className='flex space-x-1'>
              {(['To Do', 'In Progress', 'Done'] as TaskStatus[])
                .filter((status) => status !== task.status)
                .map((status) => (
                  <button
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(task.id, status);
                    }}
                    className='text-xs px-1 py-0.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                    title={`Перемістити до "${status}"`}>
                    {status === 'To Do' ? '📋' : status === 'In Progress' ? '⚠️' : '✅'}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
