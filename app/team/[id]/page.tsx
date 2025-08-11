'use client';

import { useState, useEffect, Suspense, useOptimistic, startTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/app/_components/Layout';
import TaskBoard from '@/app/_components/TaskBoard';
import TaskStats from '@/app/_components/TaskStats';
import Notifications from '@/app/_components/Notifications';
import { useTeam } from '@/hooks/useTeam';
import { useTasks } from '@/hooks/useTasks';
import { useNotifications } from '@/hooks/useNotifications';
import { TeamMember, TaskStatus } from '@/types/index';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit3,
  Save,
  X,
  Loader2,
  UserCheck,
  UserX,
} from 'lucide-react';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => Promise<void>;
  type?: 'text' | 'tel';
  placeholder?: string;
  name?: string;
}

function EditableField({
  label,
  value,
  onSave,
  type = 'text',
  placeholder,
  name,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      setEditValue(value); // Revert on error
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className='flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors'>
        <div>
          <div className='text-sm font-medium text-gray-700'>{label}</div>
          <div className='text-gray-900'>{value || 'Не вказано'}</div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className='p-1 text-gray-400 hover:text-gray-600 transition-colors'>
          <Edit3 className='h-4 w-4' />
        </button>
      </div>
    );
  }

  return (
    <div className='p-3 rounded-lg border border-blue-300 bg-blue-50'>
      <div className='text-sm font-medium text-gray-700 mb-2'>{label}</div>
      <div className='flex items-center space-x-2'>
        <input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={placeholder}
          name={name}
          className='flex-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          autoFocus
          autoComplete={name}
        />
        <div className='flex flex-col gap-2 md:flex-row'>
          <button
            onClick={handleSave}
            disabled={saving}
            className='p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors'>
            {saving ? <Loader2 className='h-4 w-4 animate-spin' /> : <Save className='h-4 w-4' />}
          </button>
          <button
            onClick={handleCancel}
            className='p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors'>
            <X className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}

function MemberProfileContent() {
  const params = useParams();
  const router = useRouter();
  const memberId = params?.id as string;

  const [activeTab, setActiveTab] = useState<'info' | 'tasks'>('info');

  const { getMemberById, updateMember, loading: memberLoading, error: memberError } = useTeam();
  const { tasksByStatus, taskStats, loading: tasksLoading, moveTask } = useTasks(memberId);
  const { notifications, removeNotification, showSuccess, showError } = useNotifications();

  const member = getMemberById(memberId);

  const [optimisticMember, setOptimisticMember] = useOptimistic(
    member,
    (state, newValue: Partial<TeamMember>) => {
      if (!state) return undefined;
      return {
        ...state,
        ...newValue,
      } as TeamMember;
    }
  );

  useEffect(() => {
    if (!memberLoading && !member) {
      showError('Співробітника не знайдено');
      setTimeout(() => router.push('/team'), 2000);
    }
  }, [member, memberLoading, showError, router]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleFieldUpdate = async (field: keyof TeamMember, value: string) => {
    try {
      startTransition(() => {
        setOptimisticMember({ [field]: value, [`${field}Updating`]: true });
      });
      startTransition(async () => {
        await updateMember(memberId, { [field]: value });
      });
      showSuccess(`${field === 'phone' ? 'Телефон' : 'Telegram нікнейм'} оновлено`);
    } catch (error) {
      showError('Помилка при оновленні даних');
      throw error;
    }
  };

  const handleTaskMove = async (taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus) => {
    try {
      const result = await moveTask(taskId, fromStatus, toStatus);
      if (result?.success) {
        showSuccess(result.message);
      } else {
        showError(result?.message || 'Невідома помилка при переміщенні задачі');
      }
      return result || { success: false, message: 'Невідома помилка при переміщенні задачі' };
    } catch (error) {
      showError('Помилка при переміщенні задачі');
      return { success: false, message: 'Помилка при переміщенні задачі' };
    }
  };

  if (memberLoading || tasksLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-500 mx-auto mb-4' />
          <p className='text-gray-600'>Завантаження профілю...</p>
        </div>
      </div>
    );
  }

  if (!member || !optimisticMember) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <User className='h-12 w-12 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>Співробітника не знайдено</h3>
          <p className='text-gray-600 mb-4'>Можливо, він був видалений або ID некоректний</p>
          <button
            onClick={() => router.push('/team')}
            className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'>
            Повернутися до списку команди
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Back Button */}
      <div className='mb-6'>
        <button
          onClick={() => router.back()}
          className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors'>
          <ArrowLeft className='h-4 w-4' />
          <span>Повернутися до команди</span>
        </button>
      </div>

      {/* Member Header */}
      <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6'>
        <div className='flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6'>
          {/* Avatar */}
          <div className='flex-shrink-0'>
            <div className='h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl'>
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className='h-24 w-24 rounded-full object-cover'
                />
              ) : (
                getInitials(member.name)
              )}
            </div>
          </div>

          {/* Member Info */}
          <div className='flex-1'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4'>
              <div>
                <h1 className='text-2xl font-bold text-gray-900 mb-1'>{member.name}</h1>
                <p className='text-lg text-gray-600'>{member.role}</p>
              </div>

              <div className='flex items-center space-x-2 mt-2 md:mt-0'>
                <span
                  className={`
                  inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  ${
                    member.status === 'активний'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }
                `}>
                  {member.status === 'активний' ? (
                    <UserCheck className='h-4 w-4 mr-1' />
                  ) : (
                    <UserX className='h-4 w-4 mr-1' />
                  )}
                  {member.status}
                </span>
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
              <div className='flex items-center space-x-2'>
                <Mail className='h-4 w-4 text-gray-400' />
                <span className='text-gray-600'>Email:</span>
                <span className='text-gray-900 font-medium'>{member.email}</span>
              </div>

              <div className='flex items-center space-x-2'>
                <MapPin className='h-4 w-4 text-gray-400' />
                <span className='text-gray-600'>Департамент:</span>
                <span className='text-gray-900 font-medium'>{member.department}</span>
              </div>

              <div className='flex items-center space-x-2'>
                <Calendar className='h-4 w-4 text-gray-400' />
                <span className='text-gray-600'>Приєднався:</span>
                <span className='text-gray-900 font-medium'>{formatDate(member.joinDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='bg-white rounded-lg border border-gray-200 shadow-sm mb-6'>
        <div className='border-b border-gray-200'>
          <nav className='flex space-x-8 px-6'>
            <button
              onClick={() => setActiveTab('info')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === 'info'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}>
              Особиста інформація
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === 'tasks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}>
              Задачі ({taskStats.total})
            </button>
          </nav>
        </div>

        <div className='p-6'>
          {activeTab === 'info' && (
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Контактна інформація</h3>

              <EditableField
                label='Телефон'
                value={
                  optimisticMember.phoneUpdating
                    ? `${optimisticMember.phone} updating...`
                    : optimisticMember.phone || ''
                }
                type='tel'
                placeholder='+380671234567'
                onSave={(value) => handleFieldUpdate('phone', value)}
                name='phone'
              />

              <EditableField
                label='Telegram нікнейм'
                value={
                  optimisticMember.telegramNicknameUpdating
                    ? `${optimisticMember.telegramNickname} updating...`
                    : optimisticMember.telegramNickname || ''
                }
                placeholder='@username'
                onSave={(value) => handleFieldUpdate('telegramNickname', value)}
              />

              <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                <h4 className='font-medium text-blue-900 mb-2'>Інформація для адміністраторів</h4>
                <p className='text-sm text-blue-700'>
                  Ці поля можна редагувати безпосередньо. Зміни зберігаються автоматично.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className='space-y-6'>
              <TaskStats stats={taskStats} />
              <TaskBoard tasksByStatus={tasksByStatus} onTaskMove={handleTaskMove} />
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <Notifications notifications={notifications} onRemove={removeNotification} />
    </>
  );
}

export default function MemberProfilePage() {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className='flex items-center justify-center min-h-[400px]'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
          </div>
        }>
        <MemberProfileContent />
      </Suspense>
    </Layout>
  );
}
