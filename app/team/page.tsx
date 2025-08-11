'use client';

import { Suspense } from 'react';
import Layout from '@/app/_components/Layout';
import TeamMemberCard from '@/app/_components/TeamMemberCard';
import TeamFilters from '@/app/_components/TeamFilters';
import Notifications from '@/app/_components/Notifications';
import { useTeam, useTeamFilters } from '@/hooks/useTeam';
import { useNotifications } from '@/hooks/useNotifications';
import { Loader2, Users, AlertCircle } from 'lucide-react';

function TeamListContent() {
  const { members, loading, error } = useTeam();
  const { filters, filteredMembers, departments, updateSearch, updateDepartment, clearFilters } =
    useTeamFilters(members);

  const { notifications, removeNotification, showError } = useNotifications();

  // Handle errors
  if (error) {
    showError(error);
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-500 mx-auto mb-4' />
          <p className='text-gray-600'>Завантаження команди...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>Помилка завантаження</h3>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'>
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <TeamFilters
        filters={filters}
        departments={departments}
        onSearchChange={updateSearch}
        onDepartmentChange={updateDepartment}
        onClearFilters={clearFilters}
        totalCount={members.length}
        filteredCount={filteredMembers.length}
      />

      {/* Team Grid */}
      {filteredMembers.length === 0 ? (
        <div className='text-center py-12'>
          <Users className='h-12 w-12 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>Співробітників не знайдено</h3>
          <p className='text-gray-600 mb-4'>
            Спробуйте змінити критерії пошуку або очистити фільтри
          </p>
          {(filters.search || filters.department !== 'all') && (
            <button
              onClick={clearFilters}
              className='text-blue-600 hover:text-blue-700 font-medium'>
              Очистити всі фільтри
            </button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {filteredMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {filteredMembers.length > 0 && (
        <div className='mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Підсумок</h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
            <div>
              <div className='text-2xl font-bold text-blue-600'>{filteredMembers.length}</div>
              <div className='text-sm text-gray-600'>Всього</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-green-600'>
                {filteredMembers.filter((m) => m.status === 'активний').length}
              </div>
              <div className='text-sm text-gray-600'>Активних</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-red-600'>
                {filteredMembers.filter((m) => m.status === 'неактивний').length}
              </div>
              <div className='text-sm text-gray-600'>Неактивних</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-purple-600'>{departments.length}</div>
              <div className='text-sm text-gray-600'>Департаментів</div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <Notifications notifications={notifications} onRemove={removeNotification} />
    </>
  );
}

export default function TeamPage() {
  return (
    <Layout title='Команда'>
      <Suspense
        fallback={
          <div className='flex items-center justify-center min-h-[400px]'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
          </div>
        }>
        <TeamListContent />
      </Suspense>
    </Layout>
  );
}
