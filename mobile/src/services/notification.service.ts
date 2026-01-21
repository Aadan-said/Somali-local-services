import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { notificationStorage } from './notification-storage.service';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export interface NotificationData {
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'JOB_ACCEPTED' | 'JOB_REJECTED' | 'JOB_COMPLETED' | 'NEW_REQUEST' | 'PAYMENT_RECEIVED';
    title: string;
    body: string;
    data?: any;
}

class NotificationService {
    private expoPushToken: string | null = null;

    /**
     * Register for push notifications and get Expo push token
     */
    async registerForPushNotifications(): Promise<string | null> {
        if (!Device.isDevice) {
            console.log('Push notifications only work on physical devices');
            return null;
        }

        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Permission not granted for push notifications');
                return null;
            }

            // Get Expo push token
            const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

            if (!projectId) {
                console.log('Project ID not found');
                return null;
            }

            const token = await Notifications.getExpoPushTokenAsync({
                projectId,
            });

            this.expoPushToken = token.data;
            console.log('Expo Push Token:', token.data);

            // Configure notification channel for Android
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'Default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#5c6bf0',
                    sound: 'default',
                });
            }

            return token.data;
        } catch (error) {
            console.error('Error registering for push notifications:', error);
            return null;
        }
    }

    /**
     * Send local notification (for testing or immediate feedback)
     */
    async sendLocalNotification(notification: NotificationData) {
        try {
            // Save to storage for in-app notifications list
            await notificationStorage.saveNotification({
                type: notification.type,
                title: notification.title,
                body: notification.body,
                data: notification.data,
            });

            // Send push notification
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: notification.title,
                    body: notification.body,
                    data: { ...notification.data, type: notification.type },
                    sound: 'default',
                    badge: 1,
                },
                trigger: null, // Show immediately
            });
        } catch (error) {
            console.error('Error sending local notification:', error);
        }
    }

    /**
     * Send notification for deposit
     */
    async notifyDeposit(amount: number) {
        await this.sendLocalNotification({
            type: 'DEPOSIT',
            title: '💰 Lacag Dhigasho',
            body: `$${amount.toFixed(2)} ayaa lagugu daray jeebkaaga.`,
            data: { amount },
        });
    }

    /**
     * Send notification for withdrawal
     */
    async notifyWithdrawal(amount: number, provider: string) {
        await this.sendLocalNotification({
            type: 'WITHDRAWAL',
            title: '📤 Lacag Bixin',
            body: `$${amount.toFixed(2)} ayaa laguugu diray ${provider}.`,
            data: { amount, provider },
        });
    }

    /**
     * Send notification for transfer
     */
    async notifyTransfer(amount: number, recipient: string) {
        await this.sendLocalNotification({
            type: 'TRANSFER',
            title: '💸 Lacag Wareejin',
            body: `$${amount.toFixed(2)} ayaa loo diray ${recipient}.`,
            data: { amount, recipient },
        });
    }

    /**
     * Send notification when job is accepted
     */
    async notifyJobAccepted(jobTitle: string) {
        await this.sendLocalNotification({
            type: 'JOB_ACCEPTED',
            title: '✅ Shaqo La Aqbalay',
            body: `Codsigaaga "${jobTitle}" waa la aqbalay!`,
            data: { jobTitle },
        });
    }

    /**
     * Send notification when job is rejected
     */
    async notifyJobRejected(jobTitle: string, reason?: string) {
        await this.sendLocalNotification({
            type: 'JOB_REJECTED',
            title: '❌ Shaqo La Diiday',
            body: reason || `Codsigaaga "${jobTitle}" waa la diiday.`,
            data: { jobTitle, reason },
        });
    }

    /**
     * Send notification when job is completed
     */
    async notifyJobCompleted(jobTitle: string) {
        await this.sendLocalNotification({
            type: 'JOB_COMPLETED',
            title: '🎉 Shaqo Dhamaaday',
            body: `Shaqadaada "${jobTitle}" waa la dhameeyay!`,
            data: { jobTitle },
        });
    }

    /**
     * Send notification for new request (Provider)
     */
    async notifyNewRequest(clientName: string, category: string) {
        await this.sendLocalNotification({
            type: 'NEW_REQUEST',
            title: '🔔 Codsi Cusub',
            body: `${clientName} ayaa codsi cusub soo diray: ${category}`,
            data: { clientName, category },
        });
    }

    /**
     * Send notification for payment received (Provider)
     */
    async notifyPaymentReceived(amount: number, clientName: string) {
        await this.sendLocalNotification({
            type: 'PAYMENT_RECEIVED',
            title: '💵 Lacag Heshay',
            body: `$${amount.toFixed(2)} ayaa ka heshay ${clientName}.`,
            data: { amount, clientName },
        });
    }

    /**
     * Get Expo push token
     */
    getExpoPushToken(): string | null {
        return this.expoPushToken;
    }

    /**
     * Clear all notifications
     */
    async clearAllNotifications() {
        await Notifications.dismissAllNotificationsAsync();
    }

    /**
     * Get notification badge count
     */
    async getBadgeCount(): Promise<number> {
        return await Notifications.getBadgeCountAsync();
    }

    /**
     * Set notification badge count
     */
    async setBadgeCount(count: number) {
        await Notifications.setBadgeCountAsync(count);
    }
}

export const notificationService = new NotificationService();
