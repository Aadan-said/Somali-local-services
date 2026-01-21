import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoredNotification {
    id: string;
    type: string;
    title: string;
    body: string;
    data?: any;
    timestamp: number;
    read: boolean;
}

const NOTIFICATIONS_STORAGE_KEY = '@notifications';

class NotificationStorageService {
    /**
     * Save notification to local storage
     */
    async saveNotification(notification: Omit<StoredNotification, 'id' | 'timestamp' | 'read'>): Promise<void> {
        try {
            const notifications = await this.getNotifications();
            const newNotification: StoredNotification = {
                ...notification,
                id: Date.now().toString(),
                timestamp: Date.now(),
                read: false,
            };

            notifications.unshift(newNotification); // Add to beginning

            // Keep only last 50 notifications
            const trimmed = notifications.slice(0, 50);

            await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(trimmed));
        } catch (error) {
            console.error('Error saving notification:', error);
        }
    }

    /**
     * Get all notifications
     */
    async getNotifications(): Promise<StoredNotification[]> {
        try {
            const data = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting notifications:', error);
            return [];
        }
    }

    /**
     * Get unread count
     */
    async getUnreadCount(): Promise<number> {
        try {
            const notifications = await this.getNotifications();
            return notifications.filter(n => !n.read).length;
        } catch (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }
    }

    /**
     * Mark notification as read
     */
    async markAsRead(id: string): Promise<void> {
        try {
            const notifications = await this.getNotifications();
            const updated = notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            );
            await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    /**
     * Mark all as read
     */
    async markAllAsRead(): Promise<void> {
        try {
            const notifications = await this.getNotifications();
            const updated = notifications.map(n => ({ ...n, read: true }));
            await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    }

    /**
     * Clear all notifications
     */
    async clearAll(): Promise<void> {
        try {
            await AsyncStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    }
}

export const notificationStorage = new NotificationStorageService();
