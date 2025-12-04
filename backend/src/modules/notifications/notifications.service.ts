import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all notifications for a user
   */
  async getUserNotifications(userId: string) {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return {
        notifications,
        unreadCount: notifications.filter((n: { read: boolean }) => !n.read).length,
        success: true,
      };
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string) {
    try {
      const unreadCount = await this.prisma.notification.count({
        where: {
          userId,
          read: false,
        },
      });

      return { unreadCount, success: true };
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    try {
      const notification = await this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          read: true,
          readAt: new Date(),
        },
      });

      // Verify ownership
      if (notification.userId !== userId) {
        throw new Error('Unauthorized: Notification does not belong to user');
      }

      return { notification, success: true };
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    try {
      const result = await this.prisma.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
          readAt: new Date(),
        },
      });

      return { count: result.count, success: true };
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string, userId: string) {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id: notificationId },
      });

      // Verify ownership
      if (notification?.userId !== userId) {
        throw new Error('Unauthorized: Notification does not belong to user');
      }

      await this.prisma.notification.delete({
        where: { id: notificationId },
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Create a notification (internal use)
   */
  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
    relatedTeamId?: string;
    relatedMatchId?: string;
    relatedUserId?: string;
  }) {
    try {
      const notification = await this.prisma.notification.create({
        data,
      });

      console.log(`✓ Notification created for user ${data.userId}`);
      return { notification, success: true };
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      throw error;
    }
  }
}
