import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '../../../src/store/auth.store';
import { providerApi, ProviderJob } from '../../../src/api/provider.api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function ProviderJobs() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [activeFilter, setActiveFilter] = useState((params.filter as string) || 'in_progress'); // 'in_progress' or 'completed'
    const [jobs, setJobs] = useState<ProviderJob[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        if (!useAuthStore.getState().isAuthenticated) return;
        try {
            const status = activeFilter === 'in_progress' ? 'ACCEPTED,IN_PROGRESS,WAITING_APPROVAL' : 'COMPLETED';
            const data = await providerApi.getJobs(status);
            setJobs(data);
        } catch (error) {
            console.error('Failed to fetch provider jobs', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchData();
    }, [activeFilter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return '#10b981';
            case 'WAITING_APPROVAL': return '#f59e0b';
            case 'ACCEPTED': return '#5c6bf0';
            case 'IN_PROGRESS': return '#3b82f6';
            default: return '#94a3b8';
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'COMPLETED': return '#ecfdf5';
            case 'WAITING_APPROVAL': return '#fffbeb';
            default: return '#f8fafc';
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Shaqooyinkayga</Text>
                <Text style={styles.headerSubtitle}>Maamul shaqooyinka lagu igmaday</Text>
            </View>

            {/* Filter Toggle */}
            <View style={styles.filterRow}>
                <TouchableOpacity
                    style={[styles.filterBtn, activeFilter === 'in_progress' && styles.filterBtnActive]}
                    onPress={() => setActiveFilter('in_progress')}
                >
                    <Text style={[styles.filterBtnText, activeFilter === 'in_progress' && styles.filterBtnTextActive]}>
                        Socda
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterBtn, activeFilter === 'completed' && styles.filterBtnActive]}
                    onPress={() => setActiveFilter('completed')}
                >
                    <Text style={[styles.filterBtnText, activeFilter === 'completed' && styles.filterBtnTextActive]}>
                        Dhamaaday
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.jobList}>
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <TouchableOpacity
                                key={job.id}
                                style={styles.jobCard}
                                onPress={() => router.push({ pathname: '/(provider)/job-details', params: { id: job.id } })}
                                activeOpacity={0.7}
                            >
                                <View style={styles.jobCardTop}>
                                    <View style={styles.categoryBadge}>
                                        <Text style={styles.categoryText}>{job.category}</Text>
                                    </View>
                                    <Text style={styles.priceText}>${job.price}</Text>
                                </View>

                                <Text style={styles.clientName}>{job.clientName}</Text>

                                <View style={styles.jobInfoRow}>
                                    <View style={styles.jobInfoItem}>
                                        <FontAwesome name="map-marker" size={14} color="#94a3b8" />
                                        <Text style={styles.jobInfoText}>{job.location || 'Mogadishu'}</Text>
                                    </View>
                                    <View style={styles.jobInfoItem}>
                                        <FontAwesome name="calendar-o" size={12} color="#94a3b8" />
                                        <Text style={styles.jobInfoText}>
                                            {new Date(job.createdAt).toLocaleDateString('so-SO', { month: 'short', day: 'numeric' })}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.jobCardFooter}>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusBg(job.status) }]}>
                                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(job.status) }]} />
                                        <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
                                            {job.status === 'WAITING_APPROVAL' ? 'INTERVIEW' : job.status}
                                        </Text>
                                    </View>
                                    <View style={styles.detailLink}>
                                        <Text style={styles.detailLinkText}>Maamul Shaqada</Text>
                                        <FontAwesome name="chevron-right" size={10} color="#5c6bf0" style={{ marginLeft: 5 }} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconWrap}>
                                <FontAwesome name="briefcase" size={40} color="#cbd5e1" />
                            </View>
                            <Text style={styles.emptyTitle}>Shaqooyin maleh</Text>
                            <Text style={styles.emptySub}>Weli wax shaqo ah ma aadan haysan.</Text>
                        </View>
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
        paddingTop: 60,
        paddingHorizontal: 25,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1e293b',
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#64748b',
        fontWeight: '600',
        marginTop: 5,
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 25,
        gap: 12,
        marginBottom: 20,
    },
    filterBtn: {
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    filterBtnActive: {
        backgroundColor: '#6366f1',
        borderColor: '#6366f1',
    },
    filterBtnText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#64748b',
    },
    filterBtnTextActive: {
        color: '#fff',
    },
    scrollContent: {
        paddingHorizontal: 25,
    },
    jobList: {
        gap: 20,
    },
    jobCard: {
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
    jobCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    categoryBadge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#64748b',
        textTransform: 'uppercase',
    },
    priceText: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1e293b',
    },
    clientName: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 15,
    },
    jobInfoRow: {
        gap: 12,
        marginBottom: 20,
    },
    jobInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    jobInfoText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
    },
    jobCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#f8fafc',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 8,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailLink: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailLinkText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#5c6bf0',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIconWrap: {
        width: 80,
        height: 80,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 8,
    },
    emptySub: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '600',
    },
});
