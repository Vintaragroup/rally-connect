import { Controller, Get, Post, Put, Delete, Param, Body, Query, BadRequestException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * GET /notifications?userId=xxx
   * Get all notifications for a user
   * 
   * @param userId - User ID
   * @returns { notifications: Notification[], unreadCount: number, success: boolean }
   */
  @Get()
  async getUserNotifications(@Query('userId') userId?: string) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    return this.notificationsService.getUserNotifications(userId);
  }

  /**
   * GET /notifications/unread-count?userId=xxx
   * Get unread notification count for user
   * 
   * @param userId - User ID
   * @returns { unreadCount: number, success: boolean }
   */
  @Get('unread-count')
  async getUnreadCount(@Query('userId') userId?: string) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    return this.notificationsService.getUnreadCount(userId);
  }

  /**
   * PUT /notifications/:id/read
   * Mark a specific notification as read
   * 
   * @param id - Notification ID
   * @param userId - User ID
   * @returns { notification: Notification, success: boolean }
   */
  @Put(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Body() body: { userId: string }
  ) {
    if (!body.userId) {
      throw new BadRequestException('userId is required');
    }
    return this.notificationsService.markAsRead(id, body.userId);
  }

  /**
   * POST /notifications/mark-all-read
   * Mark all notifications as read for user
   * 
   * @param userId - User ID
   * @returns { count: number, success: boolean }
   */
  @Post('mark-all-read')
  async markAllAsRead(@Body() body: { userId: string }) {
    if (!body.userId) {
      throw new BadRequestException('userId is required');
    }
    return this.notificationsService.markAllAsRead(body.userId);
  }

  /**
   * DELETE /notifications/:id
   * Delete a notification
   * 
   * @param id - Notification ID
   * @param userId - User ID
   * @returns { success: boolean }
   */
  @Delete(':id')
  async deleteNotification(
    @Param('id') id: string,
    @Body() body: { userId: string }
  ) {
    if (!body.userId) {
      throw new BadRequestException('userId is required');
    }
    return this.notificationsService.deleteNotification(id, body.userId);
  }
}
