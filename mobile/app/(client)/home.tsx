import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth.store';
import { clientApi, ClientDashboardData } from '../../src/api/client.api';
import { notificationsApi } from '../../src/api/notifications.api';
import { notificationStorage } from '../../src/services/notification-storage.service';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function ClientHome() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [data, setData] = useState<ClientDashboardData | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchData = async () => {
        if (!useAuthStore.getState().isAuthenticated) return;
        try {
            const dashboardData = await clientApi.getDashboard();
            setData(dashboardData);

            // Fetch unread notifications count from local storage
            const count = await notificationStorage.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch dashboard', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return '#10b981';
            case 'ACCEPTED': return '#f59e0b';
            case 'IN_PROGRESS': return '#3b82f6';
            default: return '#94a3b8';
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'COMPLETED': return '#ecfdf5';
            case 'ACCEPTED': return '#fffbeb';
            case 'IN_PROGRESS': return '#eff6ff';
            default: return '#f8fafc';
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Fixed Header Section - Only Header and Stats */}
            <View style={styles.fixedHeader}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <View style={styles.eliteBadge}>
                            <FontAwesome name="bolt" size={10} color="#5c6bf0" />
                            <Text style={styles.eliteText}>ELITE ACCESS</Text>
                        </View>
                        <Text style={styles.welcomeText}>Soo Dhawoow</Text>
                        <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Aadan'}</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => router.push('/(client)/notifications')}
                        >
                            <FontAwesome name="bell-o" size={20} color="#1e293b" />
                            {unreadCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.codsiBtn} onPress={() => router.push('/(client)/create-request')}>
                            <FontAwesome name="plus" size={12} color="#fff" />
                            <Text style={styles.codsiBtnText}>Codsi</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Task Stats Row */}
                <View style={styles.statsRow}>
                    <TouchableOpacity
                        style={styles.statMiniCard}
                        onPress={() => router.push({ pathname: '/(client)/jobs', params: { filter: 'in_progress' } })}
                    >
                        <View style={[styles.statIconWrap, { backgroundColor: '#eff6ff' }]}>
                            <FontAwesome name="clock-o" size={16} color="#3b82f6" />
                        </View>
                        <View style={styles.statInfo}>
                            <Text style={styles.statCount}>{data?.activeTasksCount?.toString().padStart(2, '0') || '00'}</Text>
                            <Text style={styles.statLabel}>SH. SOCDA</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.statMiniCard}
                        onPress={() => router.push({ pathname: '/(client)/jobs', params: { filter: 'completed' } })}
                    >
                        <View style={[styles.statIconWrap, { backgroundColor: '#f0fdf4' }]}>
                            <FontAwesome name="check-circle-o" size={16} color="#10b981" />
                        </View>
                        <View style={styles.statInfo}>
                            <Text style={styles.statCount}>{data?.completedTasksCount?.toString().padStart(2, '0') || '00'}</Text>
                            <Text style={styles.statLabel}>SH. DHAMAADAY</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Scrollable Section - Balance Card + Requests */}
            <ScrollView
                style={styles.scrollableSection}
                contentContainerStyle={styles.scrollableContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Active Balance Card */}
                <TouchableOpacity
                    style={styles.balanceCard}
                    onPress={() => router.push('/(client)/wallet')}
                    activeOpacity={0.9}
                >
                    <View style={styles.balanceHeader}>
                        <View style={styles.walletIconWrap}>
                            <FontAwesome name="briefcase" size={20} color="#fff" />
                        </View>
                        <View style={styles.activeBalanceBadge}>
                            <Text style={styles.activeBalanceBadgeText}>ACTIVE BALANCE</Text>
                        </View>
                    </View>

                    <Text style={styles.balanceAmount}>${data?.walletBalance?.toFixed(2) || '0.00'}</Text>

                    <View style={styles.balanceFooter}>
                        <View>
                            <Text style={styles.balanceDesc}>Haraagaagu waa ammaan</Text>
                            <Text style={styles.balanceSub}>LAGU KALSOON YAHAY</Text>
                            <Text style={styles.balanceSmall}>${data?.totalSpent?.toFixed(2) || '0.00'}</Text>
                        </View>
                        <View style={styles.maamulBtn}>
                            <Text style={styles.maamulBtnText}>Maamul</Text>
                            <FontAwesome name="chevron-right" size={10} color="#fff" style={{ marginLeft: 5 }} />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* My Requests Section Header */}
                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>Codsiyadaada</Text>
                        <Text style={styles.sectionSubtitle}>La soco xaaladda shaqooyinkaaga</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/(client)/jobs')}>
                        <Text style={styles.seeAllText}>Arag Dhamaan</Text>
                    </TouchableOpacity>
                </View>

                {/* Requests List */}
                <View style={styles.requestsList}>
                    {data?.recentRequests && data.recentRequests.length > 0 ? (
                        data.recentRequests.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.requestItem}>
                                <View style={[styles.reqIconWrap, { backgroundColor: getStatusBg(item.status) }]}>
                                    <FontAwesome
                                        name={item.status === 'COMPLETED' ? 'check-circle' : 'bolt'}
                                        size={18}
                                        color={getStatusColor(item.status)}
                                    />
                                </View>
                                <View style={styles.reqContent}>
                                    <Text style={styles.reqTitle}>{item.category || ''}</Text>
                                    <View style={styles.reqMeta}>
                                        <Text style={styles.reqDate}>{item.createdAt}</Text>
                                        <View style={styles.dot} />
                                        <View style={[styles.statusBadge, { backgroundColor: getStatusBg(item.status) }]}>
                                            <Text style={[styles.statusBadgeText, { color: getStatusColor(item.status) }]}>
                                                {item.status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.reqRight}>
                                    <Text style={styles.reqPrice}>${item.price || '10'}</Text>
                                    <FontAwesome name="chevron-right" size={12} color="#cbd5e1" style={{ marginLeft: 10 }} />
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <FontAwesome name="inbox" size={48} color="#cbd5e1" />
                            <Text style={styles.emptyStateText}>Codsiyo hore oo shaqo maadan samayan</Text>
                        </View>
                    )}
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc', // Light off-white background
    },
    fixedHeader: {
        backgroundColor: '#f8fafc',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    scrollableSection: {
        flex: 1,
    },
    scrollableContent: {
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    requestsScrollView: {
        flex: 1,
    },
    requestsScrollContent: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 25,
    },
    eliteBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    eliteText: {
        color: '#5c6bf0',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginLeft: 5,
    },
    welcomeText: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1e293b',
        lineHeight: 32,
    },
    userName: {
        fontSize: 26,
        fontWeight: '800',
        color: '#5c6bf0',
        lineHeight: 32,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        position: 'relative'
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#ef4444',
        borderWidth: 2,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4
    },
    notificationBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#fff'
    },
    codsiBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    codsiBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 8,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    statMiniCard: {
        width: (width - 55) / 2,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    statIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statInfo: {
        flex: 1,
    },
    statCount: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1e293b',
    },
    statLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: '#94a3b8',
        letterSpacing: 0.5,
    },
    balanceCard: {
        backgroundColor: '#1e293b',
        borderRadius: 30,
        padding: 25,
        marginBottom: 30,
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    walletIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeBalanceBadge: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    activeBalanceBadgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
    balanceAmount: {
        fontSize: 40,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 10,
    },
    balanceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    balanceDesc: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '500',
    },
    balanceSub: {
        color: '#cbd5e1',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginTop: 2,
    },
    balanceSmall: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        marginTop: 2,
    },
    maamulBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
    },
    maamulBtnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1e293b',
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '500',
    },
    seeAllText: {
        color: '#5c6bf0',
        fontWeight: '700',
        fontSize: 14,
    },
    requestsList: {
        gap: 12,
    },
    requestItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
        elevation: 1,
    },
    reqIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    reqContent: {
        flex: 1,
    },
    reqTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 4,
    },
    reqMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reqDate: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '600',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: '#cbd5e1',
        marginHorizontal: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    statusBadgeText: {
        fontSize: 9,
        fontWeight: '900',
    },
    reqRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reqPrice: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1e293b',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 15,
        color: '#94a3b8',
        fontWeight: '600',
        marginTop: 15,
        textAlign: 'center',
    },
});
