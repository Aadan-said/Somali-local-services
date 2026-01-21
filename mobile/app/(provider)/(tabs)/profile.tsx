import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../../src/store/auth.store';
import { providerApi } from '../../../src/api/provider.api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';

export default function ProviderProfile() {
    const { user, logout } = useAuthStore();
    const [isOnline, setIsOnline] = useState(true);
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        location: '',
        bio: '',
        skills: ''
    });
    const [saving, setSaving] = useState(false);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

    const fetchProfile = async () => {
        try {
            const data = await providerApi.getProfile();
            setProfileData(data);
            setEditForm({
                name: data.name || user?.name || '',
                phone: data.phone || user?.phone || '',
                location: data.location || '',
                bio: data.bio || '',
                skills: data.skills || ''
            });
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleLogout = () => {
        Alert.alert(
            'Ka bax',
            'Ma hubtaa inaad rabto inaad ka baxdo?',
            [
                { text: 'Maya', style: 'cancel' },
                { text: 'Haa', onPress: () => logout() }
            ]
        );
    };

    const handleEditProfile = () => {
        setEditModalVisible(true);
    };

    const handleSaveProfile = async () => {
        if (!editForm.name.trim()) {
            Alert.alert('Cilad', 'Fadlan geli magacaaga.');
            return;
        }
        setSaving(true);
        try {
            await providerApi.updateProfile(editForm);
            Alert.alert('Guul', 'Profile-kaaga waa la cusboonaysiiyay!');
            setEditModalVisible(false);
            fetchProfile();
        } catch (error) {
            Alert.alert('Cilad', 'Ma suurtagalin in la cusboonaysiiyo profile-ka.');
        } finally {
            setSaving(false);
        }
    };

    const MenuItem = ({ icon, label, onPress, color = '#1e293b' }: any) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuLeft}>
                <View style={[styles.menuIconWrap, { backgroundColor: color + '10' }]}>
                    <FontAwesome name={icon} size={18} color={color} />
                </View>
                <Text style={styles.menuLabel}>{label}</Text>
            </View>
            <FontAwesome name="chevron-right" size={12} color="#cbd5e1" />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5c6bf0" />
                <Text style={styles.loadingText}>Soo rarida profile-kaaga...</Text>
            </View>
        );
    }

    const stats = profileData?.stats || {};
    const displayName = profileData?.name || user?.name || 'Provider';
    const displayLocation = profileData?.location || 'Mogadishu, SO';
    const memberSince = profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024';

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <View style={styles.glowEffect} />
                <Text style={styles.headerTitle}>Profile-kaaga</Text>
                <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile}>
                    <FontAwesome name="pencil-square-o" size={16} color="#fff" />
                    <Text style={styles.editBtnText}>Wax ka badal</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Identity */}
                <View style={styles.profileIdentity}>
                    <View style={styles.avatarWrap}>
                        <View style={styles.avatar}>
                            {user?.image ? (
                                <Image source={{ uri: user.image }} style={styles.avatarImage} />
                            ) : (
                                <Text style={styles.avatarInitial}>{displayName.charAt(0)}</Text>
                            )}
                        </View>
                        <View style={styles.onlineStatusDot} />
                    </View>
                    <View style={styles.verifiedRow}>
                        <FontAwesome name="check-circle" size={14} color="#5c6bf0" />
                        <Text style={styles.verifiedLabelText}>VERIFIED PRO</Text>
                    </View>
                    <Text style={styles.userNameText}>{displayName}</Text>
                    {profileData?.skills && (
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>{profileData.skills}</Text>
                        </View>
                    )}

                    <View style={styles.ratingRow}>
                        <FontAwesome name="star" size={14} color="#f59e0b" />
                        <Text style={styles.ratingText}>{stats.averageRating?.toFixed(1) || '0.0'}/5.0</Text>
                        <View style={styles.dot} />
                        <Text style={styles.jobCountText}>{stats.totalJobs || 0} Shaqo</Text>
                    </View>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Shaqooyinka</Text>
                        <Text style={styles.statValue}>{stats.totalJobs || 0}</Text>
                    </View>
                    <View style={[styles.statBox, styles.statBoxBorder]}>
                        <Text style={styles.statLabel}>Qiimayn</Text>
                        <Text style={styles.statValue}>{stats.averageRating?.toFixed(1) || '0.0'}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Gudbiye</Text>
                        <Text style={styles.statValue}>{stats.completionRate || 0}%</Text>
                    </View>
                </View>

                {/* Additional Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoItem}>
                            <FontAwesome name="calendar" size={14} color="#64748b" />
                            <Text style={styles.infoLabel}>Xubinnimada:</Text>
                            <Text style={styles.infoValue}>{memberSince}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <FontAwesome name="map-marker" size={14} color="#64748b" />
                            <Text style={styles.infoLabel}>Goobta:</Text>
                            <Text style={styles.infoValue}>{displayLocation}</Text>
                        </View>
                    </View>
                </View>

                {/* Status Toggle */}
                <View style={styles.statusSection}>
                    <View style={styles.statusCard}>
                        <View style={styles.statusLeft}>
                            <View style={styles.statusIconWrap}>
                                <FontAwesome name="bolt" size={18} color="#10b981" />
                            </View>
                            <View>
                                <Text style={styles.statusTitle}>Hadda diyaar (Online)</Text>
                                <Text style={styles.statusSub}>Hel codsiyo cusub</Text>
                            </View>
                        </View>
                        <Switch
                            value={isOnline}
                            onValueChange={setIsOnline}
                            trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Menu Section */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Xisaabtaada</Text>
                    <View style={styles.menuGroup}>
                        <MenuItem icon="user-o" label="Macluumaadkaaga" color="#6366f1" onPress={() => setEditModalVisible(true)} />
                        <MenuItem icon="shield" label="Amniga & Xogta" color="#3b82f6" onPress={() => setShowSecurityModal(true)} />
                        <MenuItem icon="bell-o" label="Ogeysiisyada" color="#f59e0b" />
                        <MenuItem icon="question-circle-o" label="Caawinaad" color="#64748b" />
                        <MenuItem icon="sign-out" label="Ka bax" color="#ef4444" onPress={handleLogout} />
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Wax ka badal Profile-kaaga</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <FontAwesome name="times" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Magaca</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editForm.name}
                                    onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                                    placeholder="Geli magacaaga"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Telefoon</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editForm.phone}
                                    onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                                    placeholder="Geli lambarka telefoonka"
                                    placeholderTextColor="#94a3b8"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Goobta</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editForm.location}
                                    onChangeText={(text) => setEditForm({ ...editForm, location: text })}
                                    placeholder="Geli goobta aad ku nool tahay"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Xirfadaha</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editForm.skills}
                                    onChangeText={(text) => setEditForm({ ...editForm, skills: text })}
                                    placeholder="Tusaale: Farsama Yaqaan, Dhisme, Korontada"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Sharaxaad (Bio)</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={editForm.bio}
                                    onChangeText={(text) => setEditForm({ ...editForm, bio: text })}
                                    placeholder="Qor wax yar oo ku saabsan adiga iyo shaqadaada"
                                    placeholderTextColor="#94a3b8"
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => setEditModalVisible(false)}
                                disabled={saving}
                            >
                                <Text style={styles.cancelBtnText}>Ka noqo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.saveBtn]}
                                onPress={handleSaveProfile}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.saveBtnText}>Kaydi</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Security Modal */}
            <Modal
                visible={showSecurityModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowSecurityModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Badal Password-ka</Text>
                            <TouchableOpacity onPress={() => setShowSecurityModal(false)}>
                                <FontAwesome name="times" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Password-ka Hore</Text>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry
                                    value={passwordForm.current}
                                    onChangeText={(text) => setPasswordForm({ ...passwordForm, current: text })}
                                    placeholder="Geli password-ka hadda"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Password-ka Cusub</Text>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry
                                    value={passwordForm.new}
                                    onChangeText={(text) => setPasswordForm({ ...passwordForm, new: text })}
                                    placeholder="Geli password cusub"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Xaqiiji Password-ka</Text>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry
                                    value={passwordForm.confirm}
                                    onChangeText={(text) => setPasswordForm({ ...passwordForm, confirm: text })}
                                    placeholder="Ku celi password-ka cusub"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.modalBtn, styles.saveBtn, { marginTop: 10 }]}
                                onPress={async () => {
                                    if (!passwordForm.current || !passwordForm.new) {
                                        Alert.alert('Cilad', 'Fadlan buuxi meelaha banaan');
                                        return;
                                    }
                                    if (passwordForm.new !== passwordForm.confirm) {
                                        Alert.alert('Cilad', 'Password-yada isma laha');
                                        return;
                                    }
                                    setSaving(true);
                                    try {
                                        await providerApi.changePassword({ current: passwordForm.current, new: passwordForm.new });
                                        Alert.alert('Guul', 'Password-ka waa la badalay');
                                        setShowSecurityModal(false);
                                        setPasswordForm({ current: '', new: '', confirm: '' });
                                    } catch (err: any) {
                                        Alert.alert('Cilad', err.response?.data?.error || 'Khalad ayaa dhacay');
                                    } finally {
                                        setSaving(false);
                                    }
                                }}
                                disabled={saving}
                            >
                                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Badal Password</Text>}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 25,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1e293b',
    },
    glowEffect: {
        position: 'absolute',
        top: -120,
        right: -120,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(92, 107, 240, 0.05)',
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6366f1',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    editBtnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '800',
    },
    scrollContent: {
        paddingTop: 20,
    },
    profileIdentity: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarWrap: {
        position: 'relative',
        marginBottom: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 45,
        backgroundColor: '#eef2ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 6,
        borderColor: '#fff',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarInitial: {
        fontSize: 42,
        fontWeight: '900',
        color: '#6366f1',
    },
    onlineStatusDot: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#10b981',
        borderWidth: 4,
        borderColor: '#fff',
    },
    verifiedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    verifiedLabelText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#5c6bf0',
        letterSpacing: 1,
    },
    userNameText: {
        fontSize: 26,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 8,
    },
    roleBadge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 15,
    },
    roleText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#64748b',
        letterSpacing: 1,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1e293b',
        marginLeft: 6,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#cbd5e1',
        marginHorizontal: 10,
    },
    jobCountText: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '700',
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 25,
        borderRadius: 25,
        paddingVertical: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statBoxBorder: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#f1f5f9',
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94a3b8',
        marginBottom: 6,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1e293b',
    },
    infoSection: {
        paddingHorizontal: 25,
        marginBottom: 30,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    infoItem: {
        alignItems: 'center',
        gap: 6,
    },
    infoLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 13,
        fontWeight: '900',
        color: '#1e293b',
    },
    statusSection: {
        marginHorizontal: 25,
        marginBottom: 35,
    },
    statusCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    statusLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#ecfdf5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1e293b',
    },
    statusSub: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '700',
    },
    menuSection: {
        paddingHorizontal: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 15,
        marginLeft: 5,
    },
    menuGroup: {
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 1,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuLabel: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1e293b',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        maxHeight: '85%',
        paddingBottom: 40
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1e293b'
    },
    modalBody: {
        padding: 25
    },
    inputGroup: {
        marginBottom: 20
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#64748b',
        marginBottom: 10,
        textTransform: 'uppercase'
    },
    input: {
        backgroundColor: '#f8faff',
        borderRadius: 15,
        padding: 15,
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top'
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 15,
        paddingHorizontal: 25,
        paddingTop: 20
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cancelBtn: {
        backgroundColor: '#f1f5f9'
    },
    cancelBtnText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#64748b'
    },
    saveBtn: {
        backgroundColor: '#5c6bf0'
    },
    saveBtnText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#fff'
    }
});
