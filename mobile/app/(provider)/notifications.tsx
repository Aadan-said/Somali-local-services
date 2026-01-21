import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { notificationsApi, Notification } from '../../src/api/notifications.api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';

export default function ProviderNotifications() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            const data = await notificationsApi.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsApi.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleNotificationPress = async (notification: Notification) => {
        // Mark as read
        if (!notification.read) {
            try {
                await notificationsApi.markAsRead(notification.id);
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
                );
            } catch (error) {
                console.error('Failed to mark as read', error);
            }
        }

        // Helper to normalize paths
        const getMobilePath = (link: string | null | undefined, type: string) => {
            if (!link) {
                // Default based on type
                if (type.includes('RATING')) return '/(provider)/(tabs)/profile';
                if (type.includes('PAYMENT')) return '/(provider)/(tabs)/wallet';
                return '/(provider)/(tabs)/jobs';
            }

            // Map Web Paths to Mobile Paths
            if (link.includes('/provider/jobs')) return '/(provider)/(tabs)/jobs';
            if (link.includes('/provider/job-details')) {
                const id = link.split('id=')[1];
                return { pathname: '/(provider)/job-details', params: { id } };
            }
            if (link.includes('/client/jobs') || link.includes('/client/requests')) return '/(client)/jobs';

            // Web Path Fallbacks
            if (link.startsWith('/provider')) return '/(provider)/(tabs)/jobs';

            return link as any;
        };

        const target = getMobilePath(notification.link, notification.type);

        try {
            if (typeof target === 'object') {
                router.push(target);
            } else {
                router.push(target);
            }
        } catch (error) {
            console.error('Navigation error', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'JOB_ACCEPTED': return { name: 'check-circle', color: '#10b981' };
            case 'RATING_RECEIVED': return { name: 'star', color: '#f59e0b' };
            case 'PAYMENT_RECEIVED': return { name: 'money', color: '#5c6bf0' };
            case 'JOB_CANCELLED': return { name: 'times-circle', color: '#ef4444' };
            case 'REQUEST_UPDATE': return { name: 'info-circle', color: '#3b82f6' };
            default: return { name: 'bell', color: '#94a3b8' };
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5c6bf0" />
                <Text style={styles.loadingText}>Soo rarida ogeysiisyada...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.headerGradient}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <FontAwesome name="chevron-left" size={20} color="#1e293b" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Ogeysiisyada</Text>
                        {notifications.length > 0 && (
                            <Text style={styles.headerSubtitle}>
                                {notifications.filter(n => !n.read).length} cusub
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.checkAllBtn}>
                        <FontAwesome name="check-square-o" size={20} color="#5c6bf0" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                {notifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconWrap}>
                            <FontAwesome name="bell-slash" size={50} color="#cbd5e1" />
                        </View>
                        <Text style={styles.emptyTitle}>Ogeysiis maleh</Text>
                        <Text style={styles.emptySub}>Weli wax ogeysiis ah ma haysid</Text>
                    </View>
                ) : (
                    <View style={styles.notificationsList}>
                        {notifications.map((notification) => {
                            const icon = getIcon(notification.type);
                            return (
                                <TouchableOpacity
                                    key={notification.id}
                                    style={[
                                        styles.notificationCard,
                                        !notification.read && styles.unreadCard
                                    ]}
                                    onPress={() => handleNotificationPress(notification)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.iconWrap, { backgroundColor: icon.color + '15' }]}>
                                        <FontAwesome name={icon.name as any} size={20} color={icon.color} />
                                    </View>
                                    <View style={styles.notificationContent}>
                                        <View style={styles.notificationHeader}>
                                            <Text style={[
                                                styles.notificationTitle,
                                                !notification.read && styles.unreadTitle
                                            ]}>
                                                {notification.title}
                                            </Text>
                                            {!notification.read && <View style={styles.unreadDot} />}
                                        </View>
                                        <Text style={styles.notificationMessage} numberOfLines={2}>
                                            {notification.message}
                                        </Text>
                                        <View style={styles.notificationFooter}>
                                            <Text style={styles.notificationTime}>
                                                {formatDate(notification.createdAt)}
                                            </Text>
                                            {notification.link && (
                                                <View style={styles.linkBadge}>
                                                    <Text style={styles.linkText}>Eeg</Text>
                                                    <FontAwesome name="chevron-right" size={10} color="#5c6bf0" />
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8faff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8faff'
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '700',
        color: '#64748b'
    },
    headerGradient: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 25,
        paddingBottom: 20
    },
    headerCenter: {
        alignItems: 'center',
        flex: 1
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1e293b'
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#5c6bf0',
        marginTop: 2
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f8faff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1
    },
    checkAllBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#eef2ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#c7d2fe',
    },
    scrollContent: {
        paddingHorizontal: 25,
        paddingTop: 10
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 100
    },
    emptyIconWrap: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 10
    },
    emptySub: {
        fontSize: 15,
        color: '#94a3b8',
        fontWeight: '600'
    },
    notificationsList: {
        gap: 15
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        gap: 15,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 5,
        elevation: 1
    },
    unreadCard: {
        backgroundColor: '#eef2ff',
        borderColor: '#c7d2fe',
        borderWidth: 2,
        shadowColor: '#5c6bf0',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    notificationContent: {
        flex: 1,
        gap: 8
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    notificationTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#64748b',
        flex: 1
    },
    unreadTitle: {
        color: '#1e293b'
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#5c6bf0'
    },
    notificationMessage: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
        lineHeight: 20
    },
    notificationFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4
    },
    notificationTime: {
        fontSize: 12,
        fontWeight: '700',
        color: '#94a3b8'
    },
    linkBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#5c6bf015',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8
    },
    linkText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#5c6bf0'
    }
});
