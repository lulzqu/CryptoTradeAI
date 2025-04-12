import axios from 'axios';
import { API_URL } from '../config/constants';

export interface Notification {
  id: string;
  type: 'system' | 'trading' | 'signal' | 'security' | 'alert';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: any;
  priority: 'low' | 'medium' | 'high';
  userId: string;
  link?: string;
}

export interface NotificationFilter {
  type?: string;
  read?: boolean;
  startDate?: string;
  endDate?: string;
  priority?: string;
}

export interface NotificationSettings {
  enableEmail: boolean;
  enablePush: boolean;
  enableSMS: boolean;
  tradingNotifications: boolean;
  signalNotifications: boolean;
  securityNotifications: boolean;
  alertNotifications: boolean;
  systemNotifications: boolean;
  marketingNotifications: boolean;
  frequency: 'immediately' | 'hourly' | 'daily';
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

class NotificationService {
  private baseUrl = `${API_URL}/notifications`;

  // CRUD operations
  async getNotifications(filter?: NotificationFilter): Promise<Notification[]> {
    try {
      const response = await axios.get(this.baseUrl, { params: filter });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching notifications:', error.response?.data || error.message);
      throw error;
    }
  }

  async getNotification(id: string): Promise<Notification> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching notification:', error.response?.data || error.message);
      throw error;
    }
  }

  async markAsRead(id: string): Promise<Notification> {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}/read`, {});
      return response.data;
    } catch (error: any) {
      console.error('Error marking notification as read:', error.response?.data || error.message);
      throw error;
    }
  }

  async markAllAsRead(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await axios.patch(`${this.baseUrl}/read-all`, {});
      return response.data;
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error.response?.data || error.message);
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting notification:', error.response?.data || error.message);
      throw error;
    }
  }

  async clearAllNotifications(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await axios.delete(`${this.baseUrl}/clear-all`);
      return response.data;
    } catch (error: any) {
      console.error('Error clearing notifications:', error.response?.data || error.message);
      throw error;
    }
  }

  // Notification settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await axios.get(`${this.baseUrl}/settings`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching notification settings:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    try {
      const response = await axios.patch(`${this.baseUrl}/settings`, settings);
      return response.data;
    } catch (error: any) {
      console.error('Error updating notification settings:', error.response?.data || error.message);
      throw error;
    }
  }

  // SSE/WebSocket notification subscription
  subscribeToNotifications(callback: (notification: Notification) => void): () => void {
    // In a real implementation, this would set up an EventSource or WebSocket
    console.log('Subscribing to real-time notifications...');
    
    // Mock implementation that simulates new notifications every 30 seconds
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance of new notification
        callback(this.generateMockNotification());
      }
    }, 30000);
    
    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from real-time notifications...');
      clearInterval(interval);
    };
  }

  // Mock data for development
  getMockNotifications(): Notification[] {
    const notifications: Notification[] = [];
    const types: Notification['type'][] = ['system', 'trading', 'signal', 'security', 'alert'];
    const priorities: Notification['priority'][] = ['low', 'medium', 'high'];
    
    // Generate 15 mock notifications
    for (let i = 0; i < 15; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const read = Math.random() > 0.4; // 60% chance of being read
      const createdAt = new Date(Date.now() - Math.random() * 604800000).toISOString(); // Random time in the last week
      
      notifications.push(this.createMockNotification(i.toString(), type, priority, read, createdAt));
    }
    
    // Sort by created date (newest first)
    return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getMockNotificationSettings(): NotificationSettings {
    return {
      enableEmail: true,
      enablePush: true,
      enableSMS: false,
      tradingNotifications: true,
      signalNotifications: true,
      securityNotifications: true,
      alertNotifications: true,
      systemNotifications: true,
      marketingNotifications: false,
      frequency: 'immediately',
      quiet_hours_start: '22:00',
      quiet_hours_end: '08:00',
    };
  }

  private generateMockNotification(): Notification {
    const types: Notification['type'][] = ['system', 'trading', 'signal', 'security', 'alert'];
    const priorities: Notification['priority'][] = ['low', 'medium', 'high'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    return this.createMockNotification(
      `new-${Date.now()}`,
      type,
      priority,
      false,
      new Date().toISOString()
    );
  }

  private createMockNotification(
    id: string,
    type: Notification['type'],
    priority: Notification['priority'],
    read: boolean,
    createdAt: string
  ): Notification {
    let title = '';
    let message = '';
    let data: any = null;
    let link: string | undefined = undefined;
    
    switch (type) {
      case 'system':
        title = 'Cập nhật hệ thống';
        message = 'Hệ thống sẽ được bảo trì trong 2 giờ tới để cải thiện hiệu suất.';
        break;
      case 'trading':
        title = 'Lệnh giao dịch đã được thực hiện';
        message = 'Lệnh mua 0.1 BTC ở mức $49,850 đã được hoàn tất.';
        data = {
          orderId: `order-${Math.floor(Math.random() * 1000)}`,
          symbol: 'BTC/USDT',
          type: 'market',
          side: 'buy',
          quantity: 0.1,
          price: 49850,
        };
        link = '/trading/orders';
        break;
      case 'signal':
        title = 'Tín hiệu giao dịch mới';
        message = 'Tín hiệu mua ETH được tạo dựa trên chiến lược MA Crossover.';
        data = {
          signalId: `signal-${Math.floor(Math.random() * 1000)}`,
          symbol: 'ETH/USDT',
          type: 'buy',
          strategy: 'MA Crossover',
          entryPrice: 3010,
        };
        link = '/signals';
        break;
      case 'security':
        title = 'Đăng nhập mới';
        message = 'Phát hiện đăng nhập mới vào tài khoản của bạn từ Ho Chi Minh City, Vietnam.';
        data = {
          ip: '1.2.3.4',
          location: 'Ho Chi Minh City, Vietnam',
          device: 'Chrome on Windows',
          time: new Date().toISOString(),
        };
        link = '/settings/security';
        break;
      case 'alert':
        title = 'Cảnh báo giá';
        message = 'BTC đã vượt mức $50,000 theo cảnh báo giá của bạn.';
        data = {
          alertId: `alert-${Math.floor(Math.random() * 1000)}`,
          symbol: 'BTC/USDT',
          price: 50000,
          condition: 'above',
        };
        link = '/trading';
        break;
    }
    
    return {
      id,
      type,
      title,
      message,
      read,
      createdAt,
      priority,
      userId: 'user123',
      data,
      link,
    };
  }
}

export default new NotificationService(); 