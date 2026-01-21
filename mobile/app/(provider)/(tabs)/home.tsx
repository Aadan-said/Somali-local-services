import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../src/store/auth.store';
import { providerApi, ProviderDashboardData, ProviderJob } from '../../../src/api/provider.api';
import { notificationsApi } from '../../../src/api/notifications.api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function ProviderHome() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [data, setData] = useState<ProviderDashboardData | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('jobs'); // 'market' or 'jobs'
    const [marketJobs, setMarketJobs] = useState<ProviderJob[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchData = async () => {
        if (!useAuthStore.getState().isAuthenticated) return;
        try {
            const dashboardData = await providerApi.getDashboard();
            setData(dashboardData);

            // Also fetch market jobs for the "Suuqa" tab
            const marketData = await providerApi.getMarket();
            setMarketJobs(marketData);

            // Fetch unread notifications count
            const notifications = await notificationsApi.getNotifications();
            const unread = notifications.filter(n => !n.read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Failed to fetch provider dashboard', error);
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

    const StatCard = ({ label, value, icon, color, onPress }: any) => (
        <TouchableOpacity style={styles.statCard} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.statIconWrap, { backgroundColor: color + '15' }]}>
                <FontAwesome name={icon} size={18} color={color} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </TouchableOpacity>
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return '#10b981';
            case 'WAITING_APPROVAL': return '#f59e0b';
            case 'ACCEPTED': return '#5c6bf0';
            case 'IN_PROGRESS': return '#3b82f6';
            default: return '#94a3b8';
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Ku soo dhawaaw,</Text>
                    <Text style={styles.userName}>{user?.name || 'Abdifitaah Said'}</Text>
                </View>
                <TouchableOpacity
                    style={styles.notificationBtn}
                    onPress={() => router.push('/(provider)/notifications')}
                >
                    <FontAwesome name="bell-o" size={20} color="#1e293b" />
                    {unreadCount > 0 && (
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Wallet Balance Card */}
                <TouchableOpacity
                    style={styles.walletCard}
                    onPress={() => router.push('/(provider)/(tabs)/wallet')}
                    activeOpacity={0.9}
                >
                    <View style={styles.walletGrid} />
                    <View style={styles.walletHeader}>
                        <Text style={styles.walletLabel}>HARAAGA JEEBKA</Text>
                        <FontAwesome name="shield" size={14} color="rgba(255,255,255,0.4)" />
                    </View>
                    <Text style={styles.walletAmount}>${data?.walletBalance?.toFixed(2) || '0.00'}</Text>
                    <View style={styles.walletFooter}>
                        <View style={styles.walletLink}>
                            <Text style={styles.walletLinkText}>Eeg dakhligaada</Text>
                            <FontAwesome name="arrow-right" size={10} color="#fff" />
                        </View>
                        <View style={styles.walletCircles}>
                            <View style={styles.walletCircle} />
                            <View style={[styles.walletCircle, { opacity: 0.3, marginLeft: -15 }]} />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <StatCard
                        label="Codsiyo Cusub"
                        value={data?.newLeadsCount || 0}
                        icon="bolt"
                        color="#f59e0b"
                        onPress={() => {
                            setActiveTab('market');
                        }}
                    />
                    <StatCard
                        label="Shaqooyin Socda"
                        value={data?.activeJobsCount || 0}
                        icon="briefcase"
                        color="#5c6bf0"
                        onPress={() => {
                            router.push({ pathname: '/(provider)/(tabs)/jobs', params: { filter: 'in_progress' } });
                        }}
                    />
                </View>

                {/* Tab Switcher */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'jobs' && styles.activeTab]}
                        onPress={() => setActiveTab('jobs')}
                    >
                        <Text style={[styles.tabText, activeTab === 'jobs' && styles.activeTabText]}>Shaqooyinkayga</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'market' && styles.activeTab]}
                        onPress={() => setActiveTab('market')}
                    >
                        <Text style={[styles.tabText, activeTab === 'market' && styles.activeTabText]}>Suuqa (Market)</Text>
                        {marketJobs.length > 0 && <View style={styles.tabBadge}><Text style={styles.tabBadgeText}>{marketJobs.length}</Text></View>}
                    </TouchableOpacity>
                </View>

                {/* List Content */}
                <View style={styles.jobList}>
                    {activeTab === 'jobs' ? (
                        data?.recentJobs && data.recentJobs.length > 0 ? (
                            data.recentJobs.map((job) => (
                                <TouchableOpacity
                                    key={job.id}
                                    style={styles.jobCard}
                                    onPress={() => router.push({ pathname: '/(provider)/job-details', params: { id: job.id } })}
                                >
                                    <View style={styles.jobCardTop}>
                                        <View style={styles.jobCategory}>
                                            <Text style={styles.categoryText}>{job.category}</Text>
                                        </View>
                                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(job.status) }]} />
                                    </View>
                                    <Text style={styles.jobTitle}>{job.clientName}</Text>
                                    <View style={styles.jobInfo}>
                                        <View style={styles.infoItem}>
                                            <FontAwesome name="map-marker" size={12} color="#94a3b8" />
                                            <Text style={styles.infoText}>{job.location || 'Mogadishu'}</Text>
                                        </View>
                                        <View style={styles.infoItem}>
                                            <FontAwesome name="clock-o" size={12} color="#94a3b8" />
                                            <Text style={styles.infoText}>Hadda</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <FontAwesome name="briefcase" size={40} color="#e2e8f0" />
                                <Text style={styles.emptyText}>Weli ma haysid wax shaqo ah.</Text>
                            </View>
                        )
                    ) : (
                        marketJobs.length > 0 ? (
                            marketJobs.map((job) => (
                                <TouchableOpacity
                                    key={job.id}
                                    style={styles.marketCard}
                                    onPress={() => router.push({ pathname: '/(provider)/job-details', params: { id: job.id } })}
                                >
                                    <View style={styles.marketPrice}>
                                        {job.user?.image ? (
                                            <Image source={{ uri: job.user.image }} style={styles.clientImage} />
                                        ) : (
                                            <Text style={styles.clientInitial}>{job.user?.name?.charAt(0) || 'C'}</Text>
                                        )}
                                    </View>
                                    <View style={styles.marketContent}>
                                        <Text style={styles.marketCategory}>{job.category}</Text>
                                        <Text style={styles.marketDesc} numberOfLines={1}>{job.description || 'Ma jiro wax sharaxaad ah'}</Text>
                                        <View style={styles.marketFooter}>
                                            <Text style={styles.marketLoc}><FontAwesome name="map-marker" /> {job.location || 'Mogadishu'}</Text>
                                            <View style={styles.applyBtn}>
                                                <Text style={styles.applyBtnText}>EEG CODSIGA</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <FontAwesome name="search" size={40} color="#e2e8f0" />
                                <Text style={styles.emptyText}>Ma jiraan codsiyo cusub hadda.</Text>
                            </View>
                        )
                    )}
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8faff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 25,
        paddingBottom: 20,
    },
    welcomeText: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '700',
    },
    userName: {
        fontSize: 26,
        fontWeight: '900',
        color: '#1e293b',
        marginTop: 2,
    },
    notificationBtn: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
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
    scrollContent: {
        paddingHorizontal: 25,
        paddingTop: 10,
    },
    walletCard: {
        height: 200,
        backgroundColor: '#1e293b',
        borderRadius: 35,
        padding: 28,
        marginBottom: 25,
        overflow: 'hidden',
        justifyContent: 'space-between',
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    walletGrid: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        backgroundColor: 'transparent',
    },
    walletHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    walletLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    walletAmount: {
        color: '#fff',
        fontSize: 42,
        fontWeight: '900',
    },
    walletFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    walletLink: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 8,
    },
    walletLinkText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '800',
    },
    walletCircles: {
        flexDirection: 'row',
    },
    walletCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 30,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    statIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 6,
        borderRadius: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 14,
        gap: 10,
    },
    activeTab: {
        backgroundColor: '#6366f1',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#64748b',
    },
    activeTabText: {
        color: '#fff',
    },
    tabBadge: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    tabBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
    },
    jobList: {
        gap: 15,
    },
    jobCard: {
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 5,
        elevation: 1,
    },
    jobCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    jobCategory: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#64748b',
        textTransform: 'uppercase',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 8,
    },
    jobInfo: {
        flexDirection: 'row',
        gap: 15,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '700',
    },
    marketCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 15,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        gap: 15,
    },
    marketPrice: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    clientImage: {
        width: '100%',
        height: '100%',
    },
    clientInitial: {
        fontSize: 24,
        fontWeight: '900',
        color: '#10b981',
    },
    marketContent: {
        flex: 1,
        justifyContent: 'center',
    },
    marketCategory: {
        fontSize: 12,
        fontWeight: '900',
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    marketDesc: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 10,
    },
    marketFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    marketLoc: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: '700',
    },
    applyBtn: {
        backgroundColor: '#5c6bf010',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    applyBtnText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#5c6bf0',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        gap: 10,
    },
    emptyText: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '700',
    },
});
