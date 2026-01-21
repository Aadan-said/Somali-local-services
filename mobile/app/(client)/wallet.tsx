import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { clientApi } from '../../src/api/client.api';
import { useAuthStore } from '../../src/store/auth.store';
import { notificationService } from '../../src/services/notification.service';

export default function WalletScreen() {
    const { user } = useAuthStore();
    const [balance, setBalance] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Deposit States
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [depositing, setDepositing] = useState(false);

    // Payment States
    const [showPayModal, setShowPayModal] = useState(false);
    const [payAmount, setPayAmount] = useState('');
    const [payPhone, setPayPhone] = useState(user?.phone || '');
    const [selectedService, setSelectedService] = useState('EVC Plus');
    const [paying, setPaying] = useState(false);

    // Transfer States
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferAmount, setTransferAmount] = useState('');
    const [recipientId, setRecipientId] = useState('');
    const [transferring, setTransferring] = useState(false);

    const SERVICES = [
        { id: 'evc', name: 'EVC Plus', color: '#10b981', icon: 'mobile' },
        { id: 'sahal', name: 'Sahal', color: '#ef4444', icon: 'tablet' },
        { id: 'zaad', name: 'Zaad', color: '#7c3aed', icon: 'bank' },
        { id: 'edahab', name: 'e-Dahab', color: '#f59e0b', icon: 'credit-card' },
    ];

    const fetchData = async () => {
        if (!useAuthStore.getState().isAuthenticated) return;
        try {
            const data = await clientApi.getTransactions();
            setBalance(data.balance);
            setTotalSpent(data.totalSpent || 0);
            setTransactions(data.transactions);
        } catch (error) {
            console.error('Failed to fetch wallet data', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const handleDeposit = async () => {
        const amount = parseFloat(depositAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Cillad', 'Fadlan geli lacag sax ah.');
            return;
        }

        setDepositing(true);
        try {
            await clientApi.deposit(amount);
            Alert.alert('Guul', `Mahadsanid! $${amount} ayaa lagugu daray jeebkaaga.`);
            setShowDepositModal(false);
            setDepositAmount('');
            fetchData();
        } catch (error) {
            console.error('Deposit error:', error);
            Alert.alert('Cillad', 'Ma suurtagalin in lacagta la dhigo.');
        } finally {
            setDepositing(false);
        }
    };

    const handlePayment = async () => {
        const amount = parseFloat(payAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Cillad', 'Fadlan geli lacag sax ah.');
            return;
        }

        if (amount > balance) {
            Alert.alert('Cillad', 'Haraagaagu kuguma filna. Fadlan lacag dhigo marka hore.');
            return;
        }

        if (payPhone.length < 7) {
            Alert.alert('Cillad', 'Fadlan geli nambar taleefan oo sax ah.');
            return;
        }

        setPaying(true);
        try {
            await clientApi.pay(amount, selectedService, payPhone);
            Alert.alert('Guul', `Lacag bixinta ${selectedService} oo dhan $${amount} waa lagu guuleystay.`);
            setShowPayModal(false);
            setPayAmount('');
            fetchData();
        } catch (error: any) {
            console.error('Payment error:', error);
            const msg = error.response?.data?.error || 'Ma suurtagalin in lacagta la bixiyo.';
            Alert.alert('Cillad', msg);
        } finally {
            setPaying(false);
        }
    };

    const handleTransfer = async () => {
        const amount = parseFloat(transferAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Cillad', 'Fadlan geli lacag sax ah.');
            return;
        }

        if (amount > balance) {
            Alert.alert('Cillad', 'Haraagaagu kuguma filna.');
            return;
        }

        if (!recipientId.trim()) {
            Alert.alert('Cillad', 'Fadlan geli Provider ID-ga qofka aad lacagta u dirayso.');
            return;
        }

        setTransferring(true);
        try {
            await clientApi.transfer(amount, recipientId, `Transfer to Provider (${recipientId})`);
            Alert.alert('Guul', `$${amount} waa loo diray provider-ka.`);
            setShowTransferModal(false);
            setTransferAmount('');
            setRecipientId('');
            fetchData();
        } catch (error: any) {
            console.error('Transfer error:', error);
            const msg = error.response?.data?.error || 'Ma suurtagalin in lacagta la wareejiyo.';
            Alert.alert('Cillad', msg);
        } finally {
            setTransferring(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const TransactionItem = ({ item }: { item: any }) => (
        <View style={styles.transactionItem}>
            <View style={[styles.transactionIcon, { backgroundColor: item.type === 'DEPOSIT' || item.type === 'EARNING' ? '#f0fdf4' : '#fef2f2' }]}>
                <FontAwesome
                    name={item.type === 'DEPOSIT' || item.type === 'EARNING' ? 'arrow-down' : 'arrow-up'}
                    size={14}
                    color={item.type === 'DEPOSIT' || item.type === 'EARNING' ? '#10b981' : '#ef4444'}
                />
            </View>
            <View style={styles.transactionInfo}>
                <Text style={styles.transactionDesc}>{item.description}</Text>
                <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.transactionAmount, { color: item.type === 'DEPOSIT' || item.type === 'EARNING' ? '#10b981' : '#ef4444' }]}>
                {item.type === 'DEPOSIT' || item.type === 'EARNING' ? '+' : '-'}${item.amount.toFixed(2)}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#5c6bf0" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <Text style={styles.title}>Jeebkaaga</Text>
                <Text style={styles.subtitle}>Maamul lacagtaada iyo dhaqdhaqaaqa jeebka</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Balance Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.summaryLabel}>TOTAL BALANCE</Text>
                        <View style={styles.statusDotWrap}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>Active</Text>
                        </View>
                    </View>
                    <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
                    <View style={styles.summaryFooter}>
                        <View style={styles.summaryStat}>
                            <Text style={styles.statLabel}>Lacagta Baxday</Text>
                            <Text style={styles.statValue}>${totalSpent.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryStat}>
                            <Text style={styles.statLabel}>Hadhaaga</Text>
                            <Text style={styles.statValue}>${balance.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionItem} onPress={() => setShowDepositModal(true)}>
                        <View style={[styles.actionIcon, { backgroundColor: '#f0fdf4' }]}>
                            <FontAwesome name="plus" size={18} color="#10b981" />
                        </View>
                        <Text style={styles.actionLabel}>Dhiglacag</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem} onPress={() => setShowPayModal(true)}>
                        <View style={[styles.actionIcon, { backgroundColor: '#fef2f2' }]}>
                            <FontAwesome name="arrow-up" size={18} color="#ef4444" />
                        </View>
                        <Text style={styles.actionLabel}>Lacag bixi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem} onPress={() => setShowTransferModal(true)}>
                        <View style={[styles.actionIcon, { backgroundColor: '#f5f3ff' }]}>
                            <FontAwesome name="send" size={18} color="#7c3aed" />
                        </View>
                        <Text style={styles.actionLabel}>U dir Provider</Text>
                    </TouchableOpacity>
                </View>

                {/* Transactions Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Dhaqdhaqaaqii u danbeeyay</Text>
                    <TouchableOpacity onPress={onRefresh}>
                        <Text style={styles.seeAllText}>Cusboonaysii</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.transactionsList}>
                    {transactions.length > 0 ? (
                        transactions.map((item) => <TransactionItem key={item.id} item={item} />)
                    ) : (
                        <View style={styles.emptyState}>
                            <FontAwesome name="exchange" size={40} color="#e2e8f0" />
                            <Text style={styles.emptyText}>Ma jirto lacag dhaqdhaqaaq ah</Text>
                        </View>
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* DEPOSIT MODAL */}
            <Modal
                visible={showDepositModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDepositModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>DHIG LACAG</Text>
                        <Text style={styles.modalSub}>Geli cadadka aad rabto inaad dhigato</Text>

                        <View style={styles.amountInputWrap}>
                            <Text style={styles.currencySymbol}>$</Text>
                            <TextInput
                                style={styles.amountInput}
                                value={depositAmount}
                                onChangeText={setDepositAmount}
                                keyboardType="numeric"
                                placeholder="0.00"
                                autoFocus
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => setShowDepositModal(false)}
                            >
                                <Text style={styles.cancelBtnText}>Ka laabo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.confirmBtn]}
                                onPress={handleDeposit}
                                disabled={depositing}
                            >
                                {depositing ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.confirmBtnText}>Xaqiiji</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* LACAG BIXI MODAL (Somali Services) */}
            <Modal
                visible={showPayModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPayModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>LACAG BIXI</Text>
                        <Text style={styles.modalSub}>Dooro adeegga aad rabto inaad ku bixiso</Text>

                        {/* Service Selection */}
                        <View style={styles.serviceRow}>
                            {SERVICES.map((s) => (
                                <TouchableOpacity
                                    key={s.id}
                                    style={[
                                        styles.serviceItem,
                                        selectedService === s.name && { borderColor: s.color, backgroundColor: s.color + '08' }
                                    ]}
                                    onPress={() => setSelectedService(s.name)}
                                >
                                    <View style={[styles.serviceIcon, { backgroundColor: s.color + '15' }]}>
                                        <FontAwesome name={s.icon as any} size={20} color={s.color} />
                                    </View>
                                    <Text style={[styles.serviceName, selectedService === s.name && { color: s.color }]}>
                                        {s.name}
                                    </Text>
                                    {selectedService === s.name && (
                                        <View style={[styles.selectedDot, { backgroundColor: s.color }]} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>TEL. NUMBER</Text>
                            <View style={styles.payInputWrap}>
                                <FontAwesome name="phone" size={16} color="#94a3b8" style={{ marginRight: 15 }} />
                                <TextInput
                                    style={styles.payInput}
                                    value={payPhone}
                                    onChangeText={setPayPhone}
                                    keyboardType="phone-pad"
                                    placeholder="Nambarkaaga"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>AMOUNT ($)</Text>
                            <View style={[styles.payInputWrap, { height: 60 }]}>
                                <Text style={styles.currencyPrefix}>$</Text>
                                <TextInput
                                    style={[styles.payInput, { fontSize: 24, fontWeight: '800' }]}
                                    value={payAmount}
                                    onChangeText={setPayAmount}
                                    keyboardType="numeric"
                                    placeholder="0.00"
                                />
                            </View>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => setShowPayModal(false)}
                            >
                                <Text style={styles.cancelBtnText}>Ka laabo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: SERVICES.find(s => s.name === selectedService)?.color || '#5c6bf0' }]}
                                onPress={handlePayment}
                                disabled={paying}
                            >
                                {paying ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.confirmBtnText}>Bixi Hadda</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* TRANSFER MODAL */}
            <Modal
                visible={showTransferModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowTransferModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>LACAG WAREEJIN</Text>
                        <Text style={styles.modalSub}>U dir lacag Provider-ka (Wallet Transfer)</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>RECIPIENT PROVIDER ID</Text>
                            <View style={styles.payInputWrap}>
                                <FontAwesome name="user" size={16} color="#94a3b8" style={{ marginRight: 15 }} />
                                <TextInput
                                    style={styles.payInput}
                                    value={recipientId}
                                    onChangeText={setRecipientId}
                                    placeholder="Geli ID-ga qofka qaadanaya"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>AMOUNT ($)</Text>
                            <View style={[styles.payInputWrap, { height: 60 }]}>
                                <Text style={styles.currencyPrefix}>$</Text>
                                <TextInput
                                    style={[styles.payInput, { fontSize: 24, fontWeight: '800' }]}
                                    value={transferAmount}
                                    onChangeText={setTransferAmount}
                                    keyboardType="numeric"
                                    placeholder="0.00"
                                />
                            </View>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => setShowTransferModal(false)}
                            >
                                <Text style={styles.cancelBtnText}>Ka laabo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: '#7c3aed' }]}
                                onPress={handleTransfer}
                                disabled={transferring}
                            >
                                {transferring ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.confirmBtnText}>Dirac Hadda</Text>
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
        backgroundColor: '#f8fafc',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1e293b',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
        marginTop: 5,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    summaryCard: {
        backgroundColor: '#1e293b',
        borderRadius: 30,
        padding: 25,
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
        marginBottom: 30,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    summaryLabel: {
        color: '#94a3b8',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    statusDotWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10b981',
        marginRight: 6,
    },
    statusText: {
        color: '#10b981',
        fontSize: 10,
        fontWeight: '800',
    },
    balanceAmount: {
        fontSize: 48,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 20,
    },
    summaryFooter: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        paddingTop: 20,
        gap: 30,
    },
    summaryStat: {
    },
    statLabel: {
        color: '#94a3b8',
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 4,
    },
    statValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    summaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 35,
    },
    actionItem: {
        alignItems: 'center',
        gap: 10,
    },
    actionIcon: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: '#1e293b',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    seeAllText: {
        color: '#5c6bf0',
        fontWeight: '700',
        fontSize: 14,
    },
    transactionsList: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 10,
        minHeight: 150,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc',
    },
    transactionIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionDesc: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 2,
    },
    transactionDate: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: '600',
    },
    transactionAmount: {
        fontSize: 15,
        fontWeight: '800',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        paddingVertical: 40,
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        paddingBottom: 50,
    },
    modalTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: '#94a3b8',
        letterSpacing: 2,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalSub: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 30,
    },
    amountInputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        paddingHorizontal: 20,
        marginBottom: 30,
        height: 70,
    },
    currencySymbol: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1e293b',
        marginRight: 10,
    },
    amountInput: {
        flex: 1,
        fontSize: 32,
        fontWeight: '800',
        color: '#1e293b',
    },
    modalActions: {
        flexDirection: 'row',
        gap: 15,
    },
    modalBtn: {
        flex: 1,
        height: 55,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#f1f5f9',
    },
    confirmBtn: {
        backgroundColor: '#5c6bf0',
    },
    cancelBtnText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#64748b',
    },
    confirmBtnText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#fff',
    },
    serviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    serviceItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'transparent',
        marginHorizontal: 5,
        position: 'relative',
    },
    serviceIcon: {
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 12,
        fontWeight: '900',
        color: '#64748b',
    },
    selectedDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#94a3b8',
        letterSpacing: 1,
        marginBottom: 10,
        marginLeft: 5,
    },
    payInputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 55,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    payInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
    },
    currencyPrefix: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1e293b',
        marginRight: 10,
    },
});
