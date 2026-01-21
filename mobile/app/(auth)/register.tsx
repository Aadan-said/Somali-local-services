import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth.store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
    const router = useRouter();
    const { register, isLoading } = useAuthStore();

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    // State
    const [role, setRole] = useState<'client' | 'provider'>('client');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !phone) {
            Alert.alert('Error', 'Fadlan buuxi dhamaan xogtaada');
            return;
        }

        // --- STRICT VALIDATION START ---

        // 1. Gmail Validation
        if (email && !email.toLowerCase().endsWith("@gmail.com")) {
            Alert.alert('Error', 'Fadlan isticmaal Gmail sax ah (example@gmail.com).');
            return;
        }

        // 2. Phone Validation (Simple Length Check for demo, more strict can be added)
        // If phone doesn't match a reasonable length (e.g., > 8 digits)
        const cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.length < 7) {
            Alert.alert('Error', 'Fadlan gali lambar sax ah (e.g. 615xxxxxx).');
            return;
        }
        // --- STRICT VALIDATION END ---

        try {
            // Prepend +252 if missing
            let finalPhone = phone.trim();
            if (!finalPhone.startsWith('+')) {
                finalPhone = '+252 ' + finalPhone.replace(/^0+/, ''); // Remove leading zeros
            }

            await register(name, email, password, role.toUpperCase(), finalPhone);
            // Explicitly navigate to root to trigger redirection logic in index.tsx
            router.replace('/');
        } catch (error: any) {
            console.error('DEBUG_REGISTER_ERROR:', error);
            let errorMessage = 'Is-diiwaangelintu way khaldantay ';

            if (error.message === 'Network Error') {
                errorMessage = 'Cilad dhanka internetka ah (Network Error).';
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            Alert.alert('Cilad', errorMessage);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="light" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#1a2138', '#0f172a']} // Deep premium blue
                style={styles.background}
            />

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Animated.View style={{
                    flex: 1,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }}>
                    {/* Top Section: Logo & Branding */}
                    <View style={styles.topSection}>
                        <View style={styles.headerGlow} />
                        <Text style={styles.appTitlePrimary}>SOMALI LOCAL</Text>
                        <Text style={styles.appTitleSecondary}>SERVICES</Text>
                        <View style={styles.taglineWrapper}>
                            <View style={styles.taglineLine} />
                            <Text style={styles.tagline}>YOUR TRUSTED PARTNER</Text>
                            <View style={styles.taglineLine} />
                        </View>
                    </View>

                    {/* Bottom Section: White Card Form */}
                    <View style={styles.bottomCardContainer}>
                        <Text style={styles.headerTitle}>Is-diiwaangelin</Text>
                        <Text style={styles.headerSubtitle}>Fadlan buuxi xogtaada hoos ku qoran</Text>

                        {/* Role Toggle */}
                        <View style={styles.toggleWrapper}>
                            <View style={styles.toggleContainer}>
                                <TouchableOpacity
                                    style={[styles.toggleButton, role === 'client' && styles.toggleActive]}
                                    onPress={() => setRole('client')}
                                >
                                    <FontAwesome name="user" size={16} color={role === 'client' ? '#fff' : '#5c6bf0'} />
                                    <Text style={[styles.toggleText, role === 'client' && styles.textActive]}>Macmiil</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.toggleButton, role === 'provider' && styles.toggleActive]}
                                    onPress={() => setRole('provider')}
                                >
                                    <FontAwesome name="briefcase" size={16} color={role === 'provider' ? '#fff' : '#5c6bf0'} />
                                    <Text style={[styles.toggleText, role === 'provider' && styles.textActive]}>Adeeg-bixiye</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Full Name Input */}
                        <Text style={styles.label}>MAGACA DHAMAYSTIRAN</Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="user" size={16} color="#5c6bf0" />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Maxamed Cali"
                                placeholderTextColor="#94a3b8"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        {/* Email Input */}
                        <Text style={styles.label}>GMAIL-KAAGA</Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="envelope" size={14} color="#5c6bf0" />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="aadan@gmail.com"
                                placeholderTextColor="#94a3b8"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        {/* Phone Input */}
                        <Text style={styles.label}>LAMBARKA TELEEFANKA</Text>
                        <View style={styles.inputContainer}>
                            <View style={[styles.iconWrapper, { width: 70, paddingHorizontal: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', borderRightWidth: 1, borderRightColor: '#e2e8f0', borderTopLeftRadius: 12, borderBottomLeftRadius: 12, marginRight: 0 }]}>
                                <Text style={{ fontSize: 16 }}>🇸🇴 +252</Text>
                            </View>
                            <TextInput
                                style={[styles.input, { paddingLeft: 12 }]}
                                placeholder="61 5XXXXXX"
                                placeholderTextColor="#94a3b8"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>

                        {/* Password Input */}
                        <Text style={styles.label}>PASSWORD SIRTA AH</Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <FontAwesome name="lock" size={16} color="#5c6bf0" />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#94a3b8"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.eyeIconContainer,
                                    showPassword && { backgroundColor: 'rgba(92, 107, 240, 0.15)' }
                                ]}>
                                    <FontAwesome
                                        name={showPassword ? "eye" : "eye-slash"}
                                        size={16}
                                        color={showPassword ? "#5c6bf0" : "#94a3b8"}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Register Button */}
                        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.registerButtonText}>Is-diiwaangeli</Text>
                            )}
                        </TouchableOpacity>

                        {/* Footer for Login */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Horey ma isuku diiwaangalisay? </Text>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Text style={styles.linkText}>Soo Gal</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a2138',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    topSection: {
        height: height * 0.25, // Compact top section for register
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        overflow: 'hidden',
    },
    headerGlow: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(92, 107, 240, 0.2)',
        top: '15%',
        left: '30%',
        shadowColor: '#5c6bf0',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 15,
    },
    appTitlePrimary: {
        fontSize: 16,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.85)',
        letterSpacing: 5,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    appTitleSecondary: {
        fontSize: 36,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 1.5,
        textAlign: 'center',
        marginTop: -2,
    },
    taglineWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    taglineLine: {
        width: 12,
        height: 1.5,
        backgroundColor: 'rgba(92, 107, 240, 0.5)',
        marginHorizontal: 8,
        borderRadius: 2,
    },
    tagline: {
        color: '#94a3b8',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 2.2,
        textTransform: 'uppercase',
        opacity: 0.9,
    },
    bottomCardContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 28,
        paddingTop: 30,
        paddingBottom: 40,
        minHeight: height * 0.82, // More space for register fields
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 20,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '800',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: 6,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500',
    },
    toggleWrapper: {
        marginBottom: 25,
        alignItems: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        borderRadius: 14,
        padding: 4,
        width: '100%',
    },
    toggleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    toggleActive: {
        backgroundColor: '#5c6bf0',
        shadowColor: "#5c6bf0",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    toggleText: {
        marginLeft: 8,
        fontWeight: '700',
        color: '#64748b',
        fontSize: 14,
    },
    textActive: {
        color: '#fff',
    },
    label: {
        fontSize: 11,
        fontWeight: '800',
        color: '#334155',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
        backgroundColor: '#f8fafc',
    },
    iconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(92, 107, 240, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '600',
    },
    eyeIcon: {
        marginLeft: 8,
    },
    eyeIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    registerButton: {
        backgroundColor: '#5c6bf0',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        shadowColor: "#5c6bf0",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    footerText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '500',
    },
    linkText: {
        color: '#5c6bf0',
        fontWeight: '800',
        fontSize: 14,
    },
});
