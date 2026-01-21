import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform, Dimensions } from 'react-native';
import { adminApi } from '../../src/api/admin.api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

export default function AdminProviders() {
    const [providers, setProviders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchProviders = async () => {
        try {
            const data = await adminApi.getProviders(true); // pending only
            setProviders(data);
        } catch (error) {
            console.error('Failed to fetch providers', error);
            Alert.alert('Error', 'Waan ku guuldareysanay inaan soo rarno providers-ka');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    const handleVerification = async (providerId: string, verified: boolean) => {
        try {
            await adminApi.verifyProvider(providerId, verified);
            Alert.alert('Success', verified ? 'Xirfadlaha waa la ogolaaday' : 'Codsigii waa la diiday');
            fetchProviders();
        } catch (error) {
            Alert.alert('Error', 'Cillad ayaa dhacday');
        }
    };

    const renderProvider = ({ item, index }: { item: any, index: number }) => (
        <Animatable.View
            animation="fadeInLeft"
            delay={index * 100}
            duration={600}
            style={styles.cardContainer}
        >
            <View style={styles.providerCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={['#f8fafc', '#f1f5f9']}
                            style={styles.avatarInner}
                        >
                            <Text style={styles.avatarText}>{item.user?.name?.charAt(0).toUpperCase()}</Text>
                        </LinearGradient>
                    </View>

                    <View style={styles.headerInfo}>
                        <Text style={styles.providerName}>{item.user?.name}</Text>
                        <View style={styles.locationRow}>
                            <FontAwesome name="map-marker" size={12} color="#94a3b8" />
                            <Text style={styles.locationText}>{item.city} • {item.category}</Text>
                        </View>
                    </View>

                    <View style={styles.pendingBadge}>
                        <Text style={styles.pendingBadgeText}>PENDING</Text>
                    </View>
                </View>

                <View style={styles.bioSection}>
                    <Text style={styles.bioQuote}>"</Text>
                    <Text style={styles.bioText} numberOfLines={3}>
                        {item.bio || 'No professional bio provided for this service provider.'}
                    </Text>
                    <Text style={[styles.bioQuote, { textAlign: 'right', marginTop: -10 }]}>"</Text>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.approveBtn]}
                        onPress={() => handleVerification(item.id, true)}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#10b981', '#059669']}
                            style={styles.btnGradient}
                        >
                            <FontAwesome name="check" size={14} color="#fff" />
                            <Text style={styles.btnText}>APPROVE</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionBtn, styles.rejectBtn]}
                        onPress={() => handleVerification(item.id, false)}
                        activeOpacity={0.8}
                    >
                        <FontAwesome name="times" size={14} color="#ef4444" />
                        <Text style={[styles.btnText, { color: '#ef4444' }]}>REJECT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animatable.View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.header}>
                <LinearGradient
                    colors={['#1e293b', '#0f172a']}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.headerContent}>
                    <Animatable.Text animation="fadeInDown" style={styles.headerTitle}>Verification Queue</Animatable.Text>
                    <Animatable.Text animation="fadeInDown" delay={100} style={styles.headerSubtitle}>
                        Review and verify service providers
                    </Animatable.Text>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.loadingArea}>
                    <ActivityIndicator size="large" color="#4f46e5" />
                </View>
            ) : (
                <FlatList
                    data={providers}
                    renderItem={renderProvider}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listArea}
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        fetchProviders();
                    }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconCircle}>
                                <FontAwesome name="shield" size={44} color="#cbd5e1" />
                            </View>
                            <Text style={styles.emptyTitle}>Queue Is Empty</Text>
                            <Text style={styles.emptySubtitle}>No providers are waiting for verification</Text>
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
    cardContainer: {
        marginBottom: 16,
    },
    providerCard: {
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
        alignItems: 'center',
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    avatarInner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#4f46e5',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 16,
    },
    providerName: {
        fontSize: 17,
        fontWeight: '900',
        color: '#1e293b',
        letterSpacing: -0.3,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 6,
    },
    locationText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
    },
    pendingBadge: {
        backgroundColor: '#fffbeb',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    pendingBadgeText: {
        fontSize: 9,
        fontWeight: '900',
        color: '#d97706',
        letterSpacing: 0.5,
    },
    bioSection: {
        marginTop: 18,
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
    },
    bioQuote: {
        fontSize: 24,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#cbd5e1',
        height: 24,
    },
    bioText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
        lineHeight: 18,
        fontStyle: 'italic',
        paddingHorizontal: 10,
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    approveBtn: {
        overflow: 'hidden',
    },
    rejectBtn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    btnGradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    btnText: {
        fontSize: 13,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 0.5,
    },
    loadingArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
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
    },
});
