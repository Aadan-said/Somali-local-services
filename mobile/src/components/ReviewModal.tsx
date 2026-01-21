import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, Alert, Dimensions } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import { clientApi } from '../api/client.api';

const { width } = Dimensions.get('window');

interface ReviewModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    requestId: string;
    providerId: string;
    providerName: string;
}

export const ReviewModal = ({ visible, onClose, onSuccess, requestId, providerId, providerName }: ReviewModalProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert('Fadlan dooro qiimeyn', 'Waa inaad doorataa xidigaha qiimeynta.');
            return;
        }

        setLoading(true);
        try {
            await clientApi.submitReview({
                requestId,
                providerId,
                rating,
                comment
            });
            Alert.alert('Mahadsanid!', 'Qiimeyntaada waa la gudbiyay.');
            onSuccess();
            onClose();
        } catch (error) {
            Alert.alert('Cilad', 'Ma suurtagalin in la gudbiyo qiimeynta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <BlurView intensity={20} tint="dark" style={styles.overlay}>
                {/* Blur Background if possible, using standard view with opacity fallback */}
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <FontAwesome name="star" size={32} color="#f59e0b" />
                    </View>

                    <Text style={styles.title}>Qiimee Adeegga</Text>
                    <Text style={styles.subtitle}>
                        Sidee u aragtaa shaqada uu qabtay <Text style={styles.providerName}>{providerName}</Text>?
                    </Text>

                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <FontAwesome
                                    name={rating >= star ? "star" : "star-o"}
                                    size={36}
                                    color={rating >= star ? "#f59e0b" : "#cbd5e1"}
                                    style={styles.star}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Qor faallo gaaban (ikhtiyaari)..."
                        placeholderTextColor="#94a3b8"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={comment}
                        onChangeText={setComment}
                    />

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={loading}>
                            <Text style={styles.cancelText}>Iska daa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]}
                            onPress={handleSubmit}
                            disabled={loading || rating === 0}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitText}>Gudbi Qiimeynta</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    container: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fef3c7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: '#f59e0b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 10,
        letterSpacing: -0.5
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
        paddingHorizontal: 10
    },
    providerName: {
        fontWeight: '900',
        color: '#5c6bf0'
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 25,
        gap: 8
    },
    star: {
        marginHorizontal: 2
    },
    input: {
        width: '100%',
        minHeight: 100,
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        padding: 15,
        fontSize: 15,
        color: '#1e293b',
        marginBottom: 25,
        textAlignVertical: 'top'
    },
    footer: {
        flexDirection: 'row',
        gap: 15,
        width: '100%'
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        alignItems: 'center'
    },
    cancelText: {
        fontWeight: '800',
        color: '#64748b',
        fontSize: 15
    },
    submitBtn: {
        flex: 2,
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: '#10b981',
        alignItems: 'center',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4
    },
    submitBtnDisabled: {
        backgroundColor: '#cbd5e1',
        shadowOpacity: 0,
        elevation: 0
    },
    submitText: {
        fontWeight: '900',
        color: '#fff',
        fontSize: 15
    }
});
