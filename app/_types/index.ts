export type Department = 'Продажі' | 'Технічний' | 'Фінанси';

export type Role =
  | 'Team Lead'
  | 'Senior Developer'
  | 'Developer'
  | 'Junior Developer'
  | 'Manager'
  | 'Analyst'
  | 'Designer';

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface TeamMember {
  id: string;
  name: string;
  role: Role;
  department: Department;
  status: 'активний' | 'неактивний';
  avatar?: string;
  phone?: string;
  telegramNickname?: string;
  email: string;
  joinDate: string;
  phoneUpdating?: boolean;
  telegramNicknameUpdating?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo: string; // TeamMember id
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface FilterState {
  search: string;
  department: Department | 'all';
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: number;
}
