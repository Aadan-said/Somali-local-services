import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { adminApi } from '../../src/api/admin.api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

export default function AdminReports() {
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchReports = async () => {
        try {
            const data = await adminApi.getReports();
            setReports(data);
        } catch (error) {
            console.error('Failed to fetch reports', error);
            Alert.alert('Error', 'Waan ku guuldareysanay inaan soo rarno warbixinada');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleUpdateStatus = async (reportId: string, status: string) => {
        try {
            await adminApi.updateReportStatus(reportId, status);
            Alert.alert('Success', 'Warbixinta waa la xaliyey');
            fetchReports();
        } catch (error) {
            Alert.alert('Error', 'Cillad ayaa dhacday');
        }
    };

    const getPriorityDetails = (priority: string) => {
        switch (priority) {
            case 'HIGH': return { color: '#ef4444', label: 'URGENT', bg: '#fef2f2' };
            case 'MEDIUM': return { color: '#f59e0b', label: 'MEDIUM', bg: '#fffbeb' };
            case 'LOW': return { color: '#3b82f6', label: 'LOW', bg: '#eff6ff' };
            default: return { color: '#94a3b8', label: priority, bg: '#f8fafc' };
        }
    };

    const renderReport = ({ item, index }: { item: any, index: number }) => {
        const priority = getPriorityDetails(item.priority);
        return (
            <Animatable.View
                animation="fadeInUp"
                delay={index * 100}
                style={styles.cardWrapper}
            >
                <View style={styles.reportCard}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.priorityTag, { backgroundColor: priority.bg }]}>
                            <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />
                            <Text style={[styles.priorityText, { color: priority.color }]}>{priority.label}</Text>
                        </View>
                        <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>

                    <Text style={styles.reportTitle}>{item.title}</Text>
                    <Text style={styles.reportDescription}>{item.description}</Text>

                    <View style={styles.cardFooter}>
                        <View style={styles.reportedBy}>
                            <View style={styles.userCircle}>
                                <Text style={styles.userInitial}>{item.user?.name?.charAt(0).toUpperCase()}</Text>
                            </View>
                            <Text style={styles.userName}>{item.user?.name}</Text>
                        </View>

                        {item.status !== 'LA_XALIDAY' ? (
                            <TouchableOpacity
                                style={styles.resolveButton}
                                onPress={() => handleUpdateStatus(item.id, 'LA_XALIDAY')}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#6366f1', '#4f46e5']}
                                    style={styles.resolveGradient}
                                >
                                    <FontAwesome name="check" size={12} color="#fff" />
                                    <Text style={styles.resolveBtnText}>RESOLVE</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.resolvedBadge}>
                                <FontAwesome name="check-circle" size={14} color="#10b981" />
                                <Text style={styles.resolvedText}>RESOLVED</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Animatable.View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.header}>
                <LinearGradient
                    colors={['#1e293b', '#0f172a']}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>System Reports</Text>
                    <Text style={styles.headerSubtitle}>Monitor and resolve user complaints</Text>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.centerSection}>
                    <ActivityIndicator size="large" color="#4f46e5" />
                </View>
            ) : (
                <FlatList
                    data={reports}
                    renderItem={renderReport}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listArea}
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        fetchReports();
                    }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyWrap}>
                            <View style={styles.emptyIconCircle}>
                                <FontAwesome name="clipboard" size={44} color="#cbd5e1" />
                            </View>
                            <Text style={styles.emptyTitle}>Clear Sky</Text>
                            <Text style={styles.emptySubtitle}>No reports require attention at this time</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        overflow: 'hidden',
    },
    headerContent: {
        zIndex: 5,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '600',
        marginTop: 6,
    },
    listArea: {
        padding: 20,
        paddingBottom: 100,
    },
    cardWrapper: {
        marginBottom: 16,
    },
    reportCard: {
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.05,
                shadowRadius: 15,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    priorityTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    priorityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    priorityText: {
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    dateText: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: '700',
    },
    reportTitle: {
        fontSize: 17,
        fontWeight: '900',
        color: '#1e293b',
        letterSpacing: -0.3,
        marginBottom: 8,
    },
    reportDescription: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 20,
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 18,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    reportedBy: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    userCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInitial: {
        fontSize: 12,
        fontWeight: '900',
        color: '#4f46e5',
    },
    userName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#475569',
    },
    resolveButton: {
        overflow: 'hidden',
        borderRadius: 12,
    },
    resolveGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 6,
    },
    resolveBtnText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    resolvedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    resolvedText: {
        color: '#10b981',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    centerSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyWrap: {
        paddingTop: 100,
        alignItems: 'center',
    },
    emptyIconCircle: {
        width: 84,
        height: 84,
        borderRadius: 32,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1e293b',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '600',
        marginTop: 6,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});
