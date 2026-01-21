
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../../src/store/auth.store';
import { providerApi, ProviderWalletData } from '../../../src/api/provider.api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const SERVICES = [
    { id: 'evc', name: 'EVC Plus', color: '#10b981', icon: 'mobile' },
    { id: 'sahal', name: 'Sahal', color: '#ef4444', icon: 'tablet' },
    { id: 'zaad', name: 'Zaad', color: '#7c3aed', icon: 'bank' },
    { id: 'edahab', name: 'e-Dahab', color: '#f59e0b', icon: 'credit-card' },
];

export default function ProviderWallet() {
    const { user } = useAuthStore();
    const [data, setData] = useState<ProviderWalletData | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Withdrawal States
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawPhone, setWithdrawPhone] = useState(user?.phone || '');
    const [selectedService, setSelectedService] = useState('EVC Plus');
    const [withdrawing, setWithdrawing] = useState(false);

    const fetchData = async () => {
        if (!useAuthStore.getState().isAuthenticated) return;
        try {
            const walletData = await providerApi.getWallet();
            setData(walletData);
        } catch (error) {
            console.error('Failed to fetch provider wallet data', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const handleWithdraw = async () => {
        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Cillad', 'Fadlan geli lacag sax ah.');
            return;
        }

        if (!data || amount > data.balance) {
            Alert.alert('Cillad', 'Haraagaagu kuguma filna.');
            return;
        }

        if (withdrawPhone.length < 7) {
            Alert.alert('Cillad', 'Fadlan geli nambar taleefan oo sax ah.');
            return;
        }

        setWithdrawing(true);
        try {
            await providerApi.withdraw(amount, selectedService, withdrawPhone);
            Alert.alert('Guul', `Codsigaaga bixitaanka ee $${amount} waa la diray.`);
            setShowWithdrawModal(false);
            setWithdrawAmount('');
            fetchData();
        } catch (error: any) {
            console.error('Withdrawal error:', error);
            const msg = error.response?.data?.error || 'Ma suurtagalin in lacagta la bixiyo.';
            Alert.alert('Cillad', msg);
        } finally {
            setWithdrawing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dakhligaaga</Text>
                <Text style={styles.headerSubtitle}>La soco dakhliga iyo lacag bixintaada</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Income Card */}
                <View style={styles.incomeCard}>
                    <View style={styles.incomeCardTop}>
                        <View>
                            <Text style={styles.incomeLabel}>HARAAGA JEEBKA</Text>
                            <Text style={styles.incomeAmount}>${data?.balance?.toFixed(2) || '0.00'}</Text>
                        </View>
                    </View>

                    <View style={styles.incomeCardBottom}>
                        <View>
                            <Text style={styles.totalLabel}>WADARTA DAKHLIGA</Text>
                            <Text style={styles.totalAmount}>${data?.totalEarned?.toFixed(2) || '0.00'}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.laBaxBtn}
                            onPress={() => setShowWithdrawModal(true)}
                        >
                            <Text style={styles.laBaxBtnText}>La bax</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardCircle} />
                    <View style={styles.cardCircleSmall} />
                </View>

                {/* Periodic Stats */}
                <View style={styles.periodicStatsRow}>
                    <View style={styles.periodicCard}>
                        <Text style={styles.periodicLabel}>Todobaadkan</Text>
                        <Text style={styles.periodicValue}>${data?.thisWeekEarned?.toFixed(2) || '0'}</Text>
                        <View style={styles.periodicTrend}>
                            <FontAwesome name="line-chart" size={12} color="#10b981" />
                            <Text style={styles.trendText}>+12.5%</Text>
                        </View>
                    </View>
                    <View style={styles.periodicCard}>
                        <Text style={styles.periodicLabel}>Bishan</Text>
                        <Text style={styles.periodicValue}>${data?.thisMonthEarned?.toFixed(2) || '0'}</Text>
                        <View style={styles.periodicTrend}>
                            <FontAwesome name="line-chart" size={12} color="#10b981" />
                            <Text style={styles.trendText}>+8.2%</Text>
                        </View>
                    </View>
                </View>

                {/* Activity List */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Dhaqdhaqaaqa dakhliga iyo bixitaanka</Text>
                </View>

                <View style={styles.activityList}>
                    {data?.transactions && data.transactions.length > 0 ? (
                        data.transactions.map((t) => (
                            <View key={t.id} style={styles.activityItem}>
                                <View style={[
                                    styles.activityIconWrap,
                                    { backgroundColor: t.type === 'EARNING' ? '#f0fdf4' : '#fef2f2' }
                                ]}>
                                    <FontAwesome
                                        name={t.type === 'EARNING' ? "arrow-down" : "arrow-up"}
                                        size={12}
                                        color={t.type === 'EARNING' ? "#10b981" : "#ef4444"}
                                    />
                                </View>
                                <View style={styles.activityContent}>
                                    <Text style={styles.activityTitle}>{t.description}</Text>
                                    <Text style={styles.activityDate}>{new Date(t.createdAt).toLocaleDateString()}</Text>
                                </View>
                                <Text style={[
                                    styles.activityAmount,
                                    { color: t.type === 'EARNING' ? '#10b981' : '#ef4444' }
                                ]}>
                                    {t.type === 'EARNING' ? '+' : '-'}${t.amount.toFixed(2)}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <FontAwesome name="history" size={40} color="#e2e8f0" />
                            <Text style={styles.emptyText}>Weli ma diwaangalinin wax lacag ah</Text>
                        </View>
                    )}
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* WITHDRAW MODAL */}
            <Modal
                visible={showWithdrawModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowWithdrawModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>LA BAX LACAG</Text>
                            <TouchableOpacity onPress={() => setShowWithdrawModal(false)}>
                                <FontAwesome name="close" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.modalSub}>Dooro adeegga aad rabto inaad lacagta ku baxsato</Text>

                        {/* Service Selection */}
                        <View style={styles.serviceRow}>
                            {SERVICES.map((s) => (
                                <TouchableOpacity
                                    key={s.id}
                                    style={[
                                        styles.serviceItem,
                                        selectedService === s.name && { borderColor: s.color, backgroundColor: s.color + '05' }
                                    ]}
                                    onPress={() => setSelectedService(s.name)}
                                >
                                    <View style={[styles.serviceIconWrap, { backgroundColor: s.color + '15' }]}>
                                        <FontAwesome name={s.icon as any} size={18} color={s.color} />
                                    </View>
                                    <Text style={[styles.serviceName, selectedService === s.name && { color: s.color }]}>
                                        {s.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>TEL. NUMBER</Text>
                            <View style={styles.inputWrap}>
                                <FontAwesome name="phone" size={16} color="#94a3b8" style={{ marginRight: 15 }} />
                                <TextInput
                                    style={styles.textInput}
                                    value={withdrawPhone}
                                    onChangeText={setWithdrawPhone}
                                    keyboardType="phone-pad"
                                    placeholder="Nambarkaaga"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>AMOUNT ($)</Text>
                            <View style={[styles.inputWrap, { height: 60 }]}>
                                <Text style={styles.currencyPrefix}>$</Text>
                                <TextInput
                                    style={[styles.textInput, { fontSize: 24, fontWeight: '800' }]}
                                    value={withdrawAmount}
                                    onChangeText={setWithdrawAmount}
                                    keyboardType="numeric"
                                    placeholder="0.00"
                                />
                            </View>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => setShowWithdrawModal(false)}
                            >
                                <Text style={styles.cancelBtnText}>Ka laabo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: SERVICES.find(s => s.name === selectedService)?.color || '#5c6bf0' }]}
                                onPress={handleWithdraw}
                                disabled={withdrawing}
                            >
                                {withdrawing ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.confirmBtnText}>Xaqiiji</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        color: '#1e2d3b',
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#64748b',
        fontWeight: '600',
        marginTop: 5,
    },
    scrollContent: {
        paddingHorizontal: 25,
    },
    incomeCard: {
        backgroundColor: '#1e2d3b',
        borderRadius: 35,
        padding: 30,
        height: 220,
        marginBottom: 35,
        overflow: 'hidden',
        shadowColor: '#1e2d3b',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
        justifyContent: 'space-between',
    },
    incomeCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    incomeLabel: {
        color: '#94a3b8',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 10,
    },
    incomeAmount: {
        color: '#fff',
        fontSize: 48,
        fontWeight: '900',
    },
    incomeCardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    totalLabel: {
        color: '#94a3b8',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
        marginBottom: 6,
    },
    totalAmount: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
    },
    laBaxBtn: {
        backgroundColor: '#444c5a',
        paddingHorizontal: 25,
        paddingVertical: 14,
        borderRadius: 18,
    },
    laBaxBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '900',
    },
    cardCircle: {
        position: 'absolute',
        right: -40,
        top: -40,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    cardCircleSmall: {
        position: 'absolute',
        right: 40,
        bottom: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    periodicStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 35,
    },
    periodicCard: {
        width: (width - 65) / 2,
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 25,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    periodicLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748b',
        marginBottom: 12,
    },
    periodicValue: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1e2d3b',
        marginBottom: 10,
    },
    periodicTrend: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    trendText: {
        fontSize: 13,
        fontWeight: '900',
        color: '#10b981',
    },
    sectionHeader: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1e2d3b',
    },
    activityList: {
        gap: 15,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 5,
        elevation: 1,
    },
    activityIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 18,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 17,
        fontWeight: '900',
        color: '#1e2d3b',
        marginBottom: 4,
    },
    activityDate: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '700',
    },
    activityAmount: {
        fontSize: 17,
        fontWeight: '900',
        color: '#10b981',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 50,
        gap: 10,
    },
    emptyText: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '700',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 30,
        paddingBottom: 50,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1e293b',
    },
    modalSub: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 25,
    },
    serviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    serviceItem: {
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#f1f5f9',
        width: (width - 80) / 4,
    },
    serviceIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 10,
        fontWeight: '900',
        color: '#64748b',
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 11,
        fontWeight: '900',
        color: '#94a3b8',
        letterSpacing: 1,
        marginBottom: 10,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        paddingHorizontal: 20,
        height: 55,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
    },
    currencyPrefix: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1e293b',
        marginRight: 10,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 10,
    },
    modalBtn: {
        flex: 1,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#f1f5f9',
    },
    cancelBtnText: {
        color: '#64748b',
        fontSize: 16,
        fontWeight: '800',
    },
    confirmBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
});
