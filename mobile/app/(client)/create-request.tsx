import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { clientApi } from '../../src/api/client.api';

const { width } = Dimensions.get('window');

const CATEGORIES = [
    { id: '1', name: 'Korontayste', icon: 'bolt', color: '#f59e0b', bg: '#fffbeb' },
    { id: '2', name: 'Tuubayste', icon: 'tint', color: '#3b82f6', bg: '#eff6ff' },
    { id: '3', name: 'Nadaafad', icon: 'magic', color: '#10b981', bg: '#ecfdf5' },
    { id: '4', name: 'AC Repair', icon: 'snowflake-o', color: '#0ea5e9', bg: '#f0f9ff' },
    { id: '5', name: 'Makaanik', icon: 'wrench', color: '#ef4444', bg: '#fef2f2' },
    { id: '6', name: 'Macalin', icon: 'book', color: '#ec4899', bg: '#fdf2f8' },
    { id: '7', name: 'Dhismaha', icon: 'gavel', color: '#92400e', bg: '#fff7ed' },
    { id: '8', name: 'Rinjiga', icon: 'paint-brush', color: '#6366f1', bg: '#eef2ff' },
    { id: '9', name: 'Internet-ka', icon: 'wifi', color: '#06b6d4', bg: '#ecfeff' },
];

export default function CreateRequestScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = async () => {
        if (!selectedCategory) {
            Alert.alert('Fadlan dooro qeybta', 'Waa inaad doorataa qeybta uu kaga tirsan yahay adeegu.');
            return;
        }
        if (!description || description.length < 10) {
            Alert.alert('Sharaxaad kooban', 'Fadlan ku qor sharaxaad ka badan 10 xaraf.');
            return;
        }

        setLoading(true);
        try {
            await clientApi.createRequest({
                category: selectedCategory,
                description,
                location,
                price: price || undefined
            });
            Alert.alert('Guul!', 'Codsigaagii waa la diray.');
            router.back();
        } catch (error) {
            console.error('Create request error:', error);
            Alert.alert('Cillad', 'Ma suurtagalin in la diro codsigaaga. Fadlan isku day markale.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <FontAwesome name="chevron-left" size={16} color="#1e293b" />
                </TouchableOpacity>
                <View style={styles.headerTitleWrap}>
                    <Text style={styles.title}>Codsi Cusub</Text>
                    <Text style={styles.subtitle}>Waa maxay adeega aad rabto</Text>
                </View>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.mainQuestion}>Maxaad u baahantahay?</Text>
                <Text style={styles.mainSubtitle}>Dooro farsamada iyo adeega aad rabtid </Text>

                <View style={styles.grid}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.gridItem,
                                selectedCategory === cat.name && { borderColor: cat.color, borderWidth: 2 }
                            ]}
                            onPress={() => setSelectedCategory(cat.name)}
                        >
                            <View style={[styles.iconWrap, { backgroundColor: cat.bg }]}>
                                <FontAwesome name={cat.icon as any} size={24} color={cat.color} />
                            </View>
                            <Text style={styles.catName}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.inputLabel}>SHARAXAADDA CODSIGA</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Tusaale: Waxaan u baahnahay layarka guriga in la iga badalo ..."
                        placeholderTextColor="#cbd5e1"
                        multiline
                        numberOfLines={4}
                        value={description}
                        onChangeText={setDescription}
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={styles.inputLabel}>GOOBTA (LOCATION)</Text>
                        <View style={styles.inputWithIcon}>
                            <FontAwesome name="map-marker" size={16} color="#5c6bf0" style={styles.inputIcon} />
                            <TextInput
                                style={styles.smallInput}
                                placeholder="Magaalada"
                                placeholderTextColor="#cbd5e1"
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.inputLabel}>MIISAANIYADDA</Text>
                        <View style={styles.inputWithIcon}>
                            <FontAwesome name="money" size={16} color="#10b981" style={styles.inputIcon} />
                            <TextInput
                                style={styles.smallInput}
                                placeholder="$0.00"
                                placeholderTextColor="#cbd5e1"
                                keyboardType="numeric"
                                value={price}
                                onChangeText={setPrice}
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.submitBtnText}>DIR CODSIGAAGA</Text>
                            <View style={styles.submitIconWrap}>
                                <FontAwesome name="paper-plane" size={14} color="#1e293b" />
                            </View>
                        </>
                    )}
                </TouchableOpacity>

                <View style={{ height: 120 }} />
            </ScrollView>
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
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    headerTitleWrap: {
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1e293b',
    },
    subtitle: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    mainQuestion: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1e293b',
    },
    mainSubtitle: {
        fontSize: 16,
        color: '#64748b',
        fontWeight: '600',
        marginTop: 5,
        marginBottom: 30,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 15,
        marginBottom: 40,
    },
    gridItem: {
        width: (width - 70) / 3,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    iconWrap: {
        width: 50,
        height: 50,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    catName: {
        fontSize: 11,
        fontWeight: '900',
        color: '#1e293b',
        textAlign: 'center',
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: '#94a3b8',
        letterSpacing: 1,
        marginBottom: 12,
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 15,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    textArea: {
        height: 120,
        color: '#1e293b',
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 22,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        height: 56,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    inputIcon: {
        marginRight: 10,
    },
    smallInput: {
        flex: 1,
        color: '#1e293b',
        fontSize: 15,
        fontWeight: '700',
    },
    submitBtn: {
        backgroundColor: '#1e293b',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
        borderRadius: 24,
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    submitBtnDisabled: {
        opacity: 0.7,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 1,
    },
    submitIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    }
});
