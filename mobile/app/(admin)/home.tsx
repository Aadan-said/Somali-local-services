import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth.store';
import { adminApi, AdminDashboardData } from '../../src/api/admin.api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

export default function AdminHome() {
    const router = useRouter();
    const { logout, user } = useAuthStore();
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const dashboardData = await adminApi.getStats();
            setData(dashboardData);
        } catch (error) {
            console.error('Failed to fetch admin stats', error);
        } finally {
            setIsLoading(false);
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

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5c6bf0" />
            </View>
        );
    }

    const stats = [
        { title: 'USERS', value: data?.stats.totalUsers || 0, icon: 'users', color: '#6366f1', gradient: ['#6366f1', '#4f46e5'] },
        { title: 'PROVIDERS', value: data?.stats.verifiedProviders || 0, icon: 'shield', color: '#10b981', gradient: ['#10b981', '#059669'] },
        { title: 'ACTIVE JOBS', value: data?.stats.ongoingJobs || 0, icon: 'bolt', color: '#f59e0b', gradient: ['#f59e0b', '#d97706'] },
        { title: 'EARNINGS', value: `$${data?.stats.totalEarnings?.toFixed(0) || 0}`, icon: 'money', color: '#8b5cf6', gradient: ['#8b5cf6', '#7c3aed'] },
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <ScrollView
                style={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Header Section */}
                <View style={styles.heroSection}>
                    <LinearGradient
                        colors={['#1e293b', '#0f172a', '#020617']}
                        style={styles.heroGradient}
                    />

                    {/* Floating Decorative Orbs */}
                    <View style={[styles.orb, { top: -20, left: -20, backgroundColor: 'rgba(99, 102, 241, 0.15)' }]} />
                    <View style={[styles.orb, { bottom: 40, right: -30, backgroundColor: 'rgba(139, 92, 246, 0.1)' }]} />

                    <View style={styles.headerTop}>
                        <Animatable.View animation="fadeInLeft" duration={800}>
                            <View style={styles.eliteBadge}>
                                <FontAwesome name="diamond" size={10} color="#6366f1" />
                                <Text style={styles.eliteText}>ADMIN ELITE</Text>
                            </View>
                            <Text style={styles.greeting}>Ku soo dhowow,</Text>
                            <Text style={styles.adminName}>{user?.name?.split(' ')[0] || 'Maamule'}</Text>
                        </Animatable.View>

                        <Animatable.View animation="fadeInRight" duration={800}>
                            <TouchableOpacity style={styles.logoutCircle} onPress={logout}>
                                <FontAwesome name="power-off" size={18} color="#fff" />
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>

                    {/* Stats Grid - Overlapping the Header */}
                    <View style={styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <Animatable.View
                                key={index}
                                animation="zoomIn"
                                delay={200 + index * 100}
                                style={styles.statCardWrapper}
                            >
                                <TouchableOpacity style={styles.statCard}>
                                    <LinearGradient
                                        colors={stat.gradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.statGradientIcon}
                                    >
                                        <FontAwesome name={stat.icon as any} size={14} color="#fff" />
                                    </LinearGradient>
                                    <View>
                                        <Text style={styles.statValueText}>{stat.value}</Text>
                                        <Text style={styles.statLabelText}>{stat.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Animatable.View>
                        ))}
                    </View>
                </View>

                <View style={styles.body}>
                    {/* Verification Queue Section */}
                    <View style={styles.sectionTitleRow}>
                        <Text style={styles.sectionHeading}>Verification Queue</Text>
                        <TouchableOpacity onPress={() => router.push('/(admin)/providers')}>
                            <Text style={styles.actionLink}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.queueContainer}>
                        {data?.pendingProviders && data.pendingProviders.length > 0 ? (
                            data.pendingProviders.map((provider, index) => (
                                <Animatable.View
                                    key={provider.id}
                                    animation="fadeInUp"
                                    delay={400 + index * 100}
                                >
                                    <TouchableOpacity
                                        style={styles.queueCard}
                                        onPress={() => router.push('/(admin)/providers')}
                                    >
                                        <View style={styles.providerAvatar}>
                                            <LinearGradient
                                                colors={['#f1f5f9', '#e2e8f0']}
                                                style={StyleSheet.absoluteFill}
                                            />
                                            <Text style={styles.avatarInitial}>{provider.user?.name?.charAt(0)}</Text>
                                        </View>
                                        <View style={styles.providerInfo}>
                                            <Text style={styles.nameText}>{provider.user?.name}</Text>
                                            <Text style={styles.metaText}>{provider.category} • {provider.city}</Text>
                                        </View>
                                        <View style={styles.statusPill}>
                                            <View style={styles.pulseDot} />
                                            <Text style={styles.statusPillText}>PENDING</Text>
                                        </View>
                                    </TouchableOpacity>
                                </Animatable.View>
                            ))
                        ) : (
                            <View style={styles.emptyCard}>
                                <FontAwesome name="check-circle" size={40} color="#e2e8f0" />
                                <Text style={styles.noDataText}>All providers verified.</Text>
                            </View>
                        )}
                    </View>

                    {/* Quick Access Grid */}
                    <Text style={[styles.sectionHeading, { marginTop: 10, marginBottom: 15 }]}>System Management</Text>
                    <View style={styles.quickGrid}>
                        <TouchableOpacity
                            style={styles.quickBtn}
                            onPress={() => router.push('/(admin)/users')}
                        >
                            <View style={[styles.quickIconBg, { backgroundColor: '#eff6ff' }]}>
                                <FontAwesome name="user-circle" size={20} color="#3b82f6" />
                            </View>
                            <Text style={styles.quickBtnLabel}>Users</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickBtn}
                            onPress={() => router.push('/(admin)/reports')}
                        >
                            <View style={[styles.quickIconBg, { backgroundColor: '#fef2f2' }]}>
                                <FontAwesome name="warning" size={20} color="#ef4444" />
                            </View>
                            <Text style={styles.quickBtnLabel}>Reports</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.quickBtn}>
                            <View style={[styles.quickIconBg, { backgroundColor: '#f5f3ff' }]}>
                                <FontAwesome name="gears" size={20} color="#8b5cf6" />
                            </View>
                            <Text style={styles.quickBtnLabel}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a',
    },
    content: {
        flex: 1,
    },
    heroSection: {
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 20,
        position: 'relative',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    orb: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 35,
    },
    eliteBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    eliteText: {
        color: '#6366f1',
        fontSize: 9,
        fontWeight: '900',
        marginLeft: 6,
        letterSpacing: 2,
    },
    greeting: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '600',
    },
    adminName: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    logoutCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCardWrapper: {
        width: '48%',
        marginBottom: 15,
    },
    statCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)', // For web, but keep for consistency in thought
    },
    statGradientIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statValueText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
    },
    statLabelText: {
        color: '#94a3b8',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    body: {
        paddingHorizontal: 20,
        paddingTop: 25,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1e293b',
        letterSpacing: -0.5,
    },
    actionLink: {
        color: '#4f46e5',
        fontWeight: '700',
        fontSize: 13,
    },
    queueContainer: {
        marginBottom: 25,
    },
    queueCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.04,
                shadowRadius: 12,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    providerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarInitial: {
        fontSize: 18,
        fontWeight: '900',
        color: '#4f46e5',
    },
    providerInfo: {
        flex: 1,
        marginLeft: 15,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1e293b',
    },
    metaText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
        marginTop: 2,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fffbeb',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    pulseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#f59e0b',
        marginRight: 6,
    },
    statusPillText: {
        fontSize: 9,
        fontWeight: '900',
        color: '#b45309',
    },
    emptyCard: {
        padding: 40,
        backgroundColor: '#fff',
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
    },
    noDataText: {
        marginTop: 10,
        color: '#94a3b8',
        fontWeight: '600',
        fontSize: 14,
    },
    quickGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickBtn: {
        width: (width - 60) / 3,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.04,
                shadowRadius: 10,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    quickIconBg: {
        width: 44,
        height: 44,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickBtnLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: '#475569',
    },
});
