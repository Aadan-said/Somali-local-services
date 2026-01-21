import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { adminApi } from '../../src/api/admin.api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const fetchUsers = async () => {
        try {
            const data = await adminApi.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
            Alert.alert('Error', 'Waan ku guuldareysanay inaan soo rarno users-ka');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
        try {
            await adminApi.updateUserStatus(userId, newStatus);
            Alert.alert('Success', `User-ka waa la ${newStatus === 'ACTIVE' ? 'firfircoonaysiiyey' : 'xanibay'}`);
            fetchUsers();
        } catch (error) {
            Alert.alert('Error', 'Waan ku guuldareysanay inaan bedelno status-ka');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderUser = ({ item, index }: { item: any, index: number }) => (
        <Animatable.View
            animation="fadeInUp"
            delay={index * 50}
            duration={600}
            style={styles.cardContainer}
        >
            <View style={styles.userCard}>
                <View style={styles.avatarWrapper}>
                    <LinearGradient
                        colors={['#6366f1', '#4f46e5']}
                        style={styles.avatarGradient}
                    >
                        <Text style={styles.avatarInitial}>{item.name?.charAt(0).toUpperCase()}</Text>
                    </LinearGradient>
                    <View style={[styles.miniStatus, { backgroundColor: item.accountStatus === 'ACTIVE' ? '#10b981' : '#ef4444' }]} />
                </View>

                <View style={styles.contentArea}>
                    <Text style={styles.userNameText}>{item.name}</Text>
                    <Text style={styles.userEmailText}>{item.email}</Text>

                    <View style={styles.badgeRow}>
                        <View style={styles.roleTag}>
                            <Text style={styles.roleTagText}>{item.role}</Text>
                        </View>
                        <View style={[styles.statusTag, { backgroundColor: item.accountStatus === 'ACTIVE' ? '#f0fdf4' : '#fef2f2' }]}>
                            <Text style={[styles.statusTagText, { color: item.accountStatus === 'ACTIVE' ? '#10b981' : '#ef4444' }]}>
                                {item.accountStatus}
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: item.accountStatus === 'ACTIVE' ? '#fef2f2' : '#f0fdf4' }]}
                    onPress={() => handleToggleStatus(item.id, item.accountStatus)}
                    activeOpacity={0.7}
                >
                    <FontAwesome
                        name={item.accountStatus === 'ACTIVE' ? 'user-times' : 'user-plus'}
                        size={18}
                        color={item.accountStatus === 'ACTIVE' ? '#ef4444' : '#10b981'}
                    />
                </TouchableOpacity>
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
                    <Text style={styles.headerTitle}>User Management</Text>
                    <Text style={styles.headerSubtitle}>Manage all accounts in the system</Text>

                    <View style={styles.searchWrapper}>
                        <FontAwesome name="search" size={16} color="#94a3b8" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by name or email..."
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <FontAwesome name="times-circle" size={16} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.centerSection}>
                    <ActivityIndicator size="large" color="#4f46e5" />
                </View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    renderItem={renderUser}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        fetchUsers();
                    }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyStateContainer}>
                            <View style={styles.emptyIconBg}>
                                <FontAwesome name="users" size={40} color="#cbd5e1" />
                            </View>
                            <Text style={styles.emptyStateTitle}>No Users Found</Text>
                            <Text style={styles.emptyStateText}>Try adjusting your search criteria</Text>
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
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
    },
    headerContent: {
        zIndex: 10,
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
        marginTop: 4,
        marginBottom: 20,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 16,
        borderRadius: 16,
        height: 54,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    listContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    cardContainer: {
        marginBottom: 12,
    },
    userCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 16,
        flexDirection: 'row',
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
    avatarWrapper: {
        position: 'relative',
    },
    avatarGradient: {
        width: 54,
        height: 54,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        fontSize: 22,
        fontWeight: '900',
        color: '#fff',
    },
    miniStatus: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#fff',
    },
    contentArea: {
        flex: 1,
        marginLeft: 15,
    },
    userNameText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1e293b',
        letterSpacing: -0.2,
    },
    userEmailText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
        marginTop: 2,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    roleTag: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    roleTagText: {
        fontSize: 9,
        fontWeight: '900',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusTag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    statusTagText: {
        fontSize: 9,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateContainer: {
        paddingTop: 80,
        alignItems: 'center',
    },
    emptyIconBg: {
        width: 80,
        height: 80,
        borderRadius: 30,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1e293b',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '600',
        marginTop: 6,
    },
});
