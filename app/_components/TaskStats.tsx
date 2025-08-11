'use client';

import { CheckCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react';

interface TaskStatsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    completionRate: number;
  };
}

export default function TaskStats({ stats }: TaskStatsProps) {
  return (
    <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6'>
      <div className='flex items-center space-x-2 mb-4'>
        <BarChart3 className='h-5 w-5 text-gray-600' />
        <h3 className='text-lg font-semibold text-gray-900'>Статистика задач</h3>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
        {/* Total Tasks */}
        <div className='text-center'>
          <div className='bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2'>
            <AlertCircle className='h-6 w-6 text-blue-600' />
          </div>
          <div className='text-2xl font-bold text-gray-900'>{stats.total}</div>
          <div className='text-sm text-gray-600'>Всього</div>
        </div>

        {/* Todo Tasks */}
        <div className='text-center'>
          <div className='bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2'>
            <AlertCircle className='h-6 w-6 text-red-600' />
          </div>
          <div className='text-2xl font-bold text-gray-900'>{stats.todo}</div>
          <div className='text-sm text-gray-600'>До виконання</div>
        </div>

        {/* In Progress Tasks */}
        <div className='text-center'>
          <div className='bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2'>
            <Clock className='h-6 w-6 text-yellow-600' />
          </div>
          <div className='text-2xl font-bold text-gray-900'>{stats.inProgress}</div>
          <div className='text-sm text-gray-600'>В роботі</div>
        </div>

        {/* Completed Tasks */}
        <div className='text-center'>
          <div className='bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2'>
            <CheckCircle className='h-6 w-6 text-green-600' />
          </div>
          <div className='text-2xl font-bold text-gray-900'>{stats.completed}</div>
          <div className='text-sm text-gray-600'>Виконано</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium text-gray-600'>Прогрес виконання</span>
          <span className='text-sm font-bold text-gray-900'>{stats.completionRate}%</span>
        </div>

        <div className='w-full bg-gray-200 rounded-full h-3'>
          <div
            className='bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out'
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>

        {/* Breakdown */}
        <div className='flex justify-between text-xs text-gray-500'>
          <span>{stats.todo} нових</span>
          <span>{stats.inProgress} в роботі</span>
          <span>{stats.completed} завершено</span>
        </div>
      </div>

      {/* Performance indicator */}
      {stats.total > 0 && (
        <div className='mt-4 p-3 rounded-lg bg-gray-50'>
          <div className='flex items-center space-x-2'>
            {stats.completionRate >= 80 ? (
              <>
                <CheckCircle className='h-4 w-4 text-green-500' />
                <span className='text-sm text-green-700 font-medium'>Відмінний прогрес!</span>
              </>
            ) : stats.completionRate >= 50 ? (
              <>
                <Clock className='h-4 w-4 text-yellow-500' />
                <span className='text-sm text-yellow-700 font-medium'>Добре працюєте</span>
              </>
            ) : (
              <>
                <AlertCircle className='h-4 w-4 text-red-500' />
                <span className='text-sm text-red-700 font-medium'>Потрібно більше зусиль</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
