

export enum NotificationType {
  ALERT = 'ALERT',
  TASK = 'TASK',
  INFO = 'INFO'
}

export enum Priority {
  URGENT = 'URGENT',
  NORMAL = 'NORMAL',
  LOW = 'LOW'
}

export enum NotificationStatus {
  READ = 'READ',
  UNREAD = 'UNREAD'
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: Priority;
  message: string;
  status: NotificationStatus;
  createdAt: Date;
  readAt?: Date;
  sentBySystem: boolean;
  creatorName: string;
  createdById?: string;
}

export interface CreateNotificationDTO {
  type: NotificationType;
  priority: Priority;
  message: string;
  recipientIds: string[];
  sentBySystem?: boolean;
}

export interface NotificationFilter {
  status?: NotificationStatus;
  type?: NotificationType;
  priority?: Priority;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface NotificationStats {
  totalNotifications: number;
  unreadCount: number;
  readCount: number;
  urgentUnreadCount: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}