'use client';

import Link from 'next/link';
import { Mail, Calendar } from 'lucide-react';
import { TeamMember } from '@/types/index';

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const getStatusColor = (status: TeamMember['status']) => {
    return status === 'активний'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getDepartmentColor = (department: TeamMember['department']) => {
    switch (department) {
      case 'Технічний':
        return 'bg-blue-100 text-blue-800';
      case 'Продажі':
        return 'bg-purple-100 text-purple-800';
      case 'Фінанси':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <Link href={`/team/${member.id}`}>
      <div className='bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer p-4'>
        {/* Avatar and Status */}
        <div className='flex items-start justify-between mb-4 gap-2'>
          <div className='flex items-center space-x-3'>
            <div className='h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm'>
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className='h-12 w-12 rounded-full object-cover'
                />
              ) : (
                getInitials(member.name)
              )}
            </div>
            <div className='flex-1'>
              <h3 className='font-semibold text-gray-900 text-lg'>{member.name}</h3>
              <p className='text-sm text-gray-600'>{member.role}</p>
            </div>
          </div>

          <span
            className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
            ${getStatusColor(member.status)}
          `}>
            {member.status}
          </span>
        </div>

        {/* Department */}
        <div className='mb-4'>
          <span
            className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${getDepartmentColor(member.department)}
          `}>
            {member.department}
          </span>
        </div>

        {/* Contact Info */}
        <div className='space-y-2 text-sm text-gray-600'>
          <div className='flex items-center space-x-2'>
            <Mail className='h-4 w-4' />
            <span className='truncate'>{member.email}</span>
          </div>

          <div className='flex items-center space-x-2'>
            <Calendar className='h-4 w-4' />
            <span>Приєднався: {formatJoinDate(member.joinDate)}</span>
          </div>
        </div>

        {/* Hover indicator */}
        <div className='mt-4 pt-4 border-t border-gray-100'>
          <div className='flex items-center justify-between text-sm text-gray-500'>
            <span>Переглянути профіль</span>
            <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
