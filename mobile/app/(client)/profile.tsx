import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuthStore } from '../../src/store/auth.store';
import { clientApi } from '../../src/api/client.api';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const { logout, user, setUser } = useAuthStore();
    const [isEditingName, setIsEditingName] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);
    const [showAccountInfo, setShowAccountInfo] = useState(false);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            setLoading(true);
            try {
                const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
                const response = await clientApi.updateImage(base64Image);
                if (user) {
                    setUser({ ...user, image: response.image });
                }
                Alert.alert('Guul', 'Sawirkaaga waa la bedelay!');
            } catch (error) {
                console.error('Image upload error:', error);
                Alert.alert('Cillad', 'Ma suurtagalin in sawirka la bedelo.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleUpdateName = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            await clientApi.updateProfile({ name });
            if (user) {
                setUser({ ...user, name });
            }
            setIsEditingName(false);
            Alert.alert('Guul', 'Magacaaga waa la bedelay!');
        } catch (error) {
            console.error('Profile update error:', error);
            Alert.alert('Cillad', 'Ma suurtagalin in magaca la bedelo.');
        } finally {
            setLoading(false);
        }
    };

    const MenuItem = ({ icon, label, color = '#1e293b', showArrow = true, onPress }: any) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuIconLabel}>
                <View style={[styles.menuIconWrap, { backgroundColor: color + '10' }]}>
                    <FontAwesome name={icon} size={18} color={color} />
                </View>
                <Text style={[styles.menuLabel, { color: color === '#ef4444' ? color : '#1e293b' }]}>{label}</Text>
            </View>
            {showArrow && <FontAwesome name="chevron-right" size={12} color="#cbd5e1" />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.profileHeader}>
                <View style={styles.avatarWrap}>
                    <View style={styles.avatar}>
                        {user?.image ? (
                            <Image source={{ uri: user.image }} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarInitial}>{user?.name?.charAt(0) || 'A'}</Text>
                        )}
                        {loading && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator color="#fff" />
                            </View>
                        )}
                    </View>
                    <TouchableOpacity style={styles.editAvatarBtn} onPress={handlePickImage} disabled={loading}>
                        <FontAwesome name="camera" size={12} color="#fff" />
                    </TouchableOpacity>
                </View>

                {isEditingName ? (
                    <View style={styles.editNameRow}>
                        <TextInput
                            style={styles.nameInput}
                            value={name}
                            onChangeText={setName}
                            autoFocus
                        />
                        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateName} disabled={loading}>
                            {loading ? <ActivityIndicator size="small" color="#fff" /> : <FontAwesome name="check" size={14} color="#fff" />}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditingName(false)} disabled={loading}>
                            <FontAwesome name="times" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.userNameRow} onPress={() => setIsEditingName(true)}>
                        <Text style={styles.userName}>{user?.name || 'Aadan Saciid'}</Text>
                        <FontAwesome name="pencil" size={14} color="#5c6bf0" style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                )}
                <Text style={styles.userEmail}>{user?.email || 'aadan@example.com'}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {showAccountInfo && (
                    <View style={styles.accountCard}>
                        <View style={styles.accountCardHeader}>
                            <Text style={styles.accountCardTitle}>MACLUUMAADKA AKOONKA</Text>
                            <TouchableOpacity onPress={() => setShowAccountInfo(false)}>
                                <FontAwesome name="times-circle" size={20} color="#cbd5e1" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>User ID:</Text>
                            <Text style={styles.infoValue}>{user?.id?.substring(0, 12)}...</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Role:</Text>
                            <View style={styles.roleBadge}>
                                <Text style={styles.roleText}>{user?.role}</Text>
                            </View>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email:</Text>
                            <Text style={styles.infoValue}>{user?.email}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Status:</Text>
                            <Text style={[styles.infoValue, { color: '#10b981' }]}>Active Verified</Text>
                        </View>
                    </View>
                )}

                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>AKOONKA</Text>
                    <View style={styles.menuGroup}>
                        <MenuItem
                            icon="user-o"
                            label="Macluumaadka Akoonka"
                            onPress={() => setShowAccountInfo(!showAccountInfo)}
                        />
                        <MenuItem icon="map-marker" label="Cinwaanada" onPress={() => Alert.alert('Cinwaanada', 'Dhowaan ayuu shaqo bilaabayaa!')} />
                        <MenuItem icon="bell-o" label="Ogeysiisyada" onPress={() => Alert.alert('Ogeysiisyada', 'Dhowaan ayuu shaqo bilaabayaa!')} />
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>SETTINGS</Text>
                    <View style={styles.menuGroup}>
                        <MenuItem icon="globe" label="Luuqadda (Language)" />
                        <MenuItem icon="lock" label="Amniga (Security)" onPress={() => setShowSecurityModal(true)} />
                        <MenuItem icon="question-circle-o" label="Caawinaad & Support" />
                        <MenuItem icon="shield" label="Privacy Policy" />
                    </View>
                </View>

                <View style={[styles.menuSection, { marginBottom: 40 }]}>
                    <View style={styles.menuGroup}>
                        <MenuItem icon="sign-out" label="Ka bax (Log Out)" color="#ef4444" showArrow={false} onPress={logout} />
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.versionText}>Version 2.0.1 (Elite)</Text>
                    <Text style={styles.copyrightText}>© 2026 Somali Local Services</Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
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
                                <FontAwesome name="times" size={20} color="#64748b" />
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
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.saveBtnFull}
                                onPress={async () => {
                                    if (!passwordForm.current || !passwordForm.new) {
                                        Alert.alert('Cilad', 'Fadlan buuxi meelaha banaan');
                                        return;
                                    }
                                    if (passwordForm.new !== passwordForm.confirm) {
                                        Alert.alert('Cilad', 'Password-yada isma laha');
                                        return;
                                    }
                                    setLoading(true);
                                    try {
                                        await clientApi.changePassword({ current: passwordForm.current, new: passwordForm.new });
                                        Alert.alert('Guul', 'Password-ka waa la badalay');
                                        setShowSecurityModal(false);
                                        setPasswordForm({ current: '', new: '', confirm: '' });
                                    } catch (err: any) {
                                        Alert.alert('Cilad', err.response?.data?.error || 'Khalad ayaa dhacay');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Badal Password</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    // ... existing styles ...
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingBottom: 40,
        minHeight: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1e293b',
    },
    modalBody: {
        padding: 25,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: '#64748b',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 15,
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '600',
    },
    saveBtnFull: {
        backgroundColor: '#5c6bf0',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#5c6bf0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    profileHeader: {
        paddingTop: 40,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingBottom: 30,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.01,
        shadowRadius: 5,
        elevation: 2,
    },
    avatarWrap: {
        position: 'relative',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#5c6bf0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#f1f5f9',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarInitial: {
        fontSize: 40,
        fontWeight: '900',
        color: '#fff',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1e293b',
        borderWidth: 3,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1e293b',
    },
    editNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    nameInput: {
        flex: 1,
        fontSize: 20,
        fontWeight: '800',
        color: '#1e293b',
        borderBottomWidth: 2,
        borderBottomColor: '#5c6bf0',
        paddingVertical: 5,
        marginRight: 10,
    },
    saveBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
    },
    cancelBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userEmail: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '600',
        marginTop: 4,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    menuSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: '#94a3b8',
        letterSpacing: 1.5,
        marginBottom: 15,
        marginLeft: 10,
    },
    menuGroup: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    menuIconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuLabel: {
        fontSize: 15,
        fontWeight: '800',
    },
    footer: {
        alignItems: 'center',
        gap: 5,
    },
    versionText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#cbd5e1',
    },
    copyrightText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#cbd5e1',
    },
    accountCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    accountCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    accountCardTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: '#94a3b8',
        letterSpacing: 1,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc',
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1e293b',
    },
    roleBadge: {
        backgroundColor: '#f5f3ff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    roleText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#7c3aed',
        textTransform: 'uppercase',
    },
});
