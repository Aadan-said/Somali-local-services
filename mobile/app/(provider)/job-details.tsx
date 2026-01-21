import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image, Dimensions, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { providerApi, ProviderJob } from '../../src/api/provider.api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { VerifiedBadge } from '../../src/components/VerifiedBadge';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const JobDetails = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [job, setJob] = useState<ProviderJob | null>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [proofNote, setProofNote] = useState('');
    const [proofImage, setProofImage] = useState<string | null>(null);

    const fetchDetails = async () => {
        try {
            const data = await providerApi.getJobDetails(id as string);
            setJob(data);
            if (data.status === 'IN_PROGRESS' || data.status === 'COMPLETED') {
                const taskData = await providerApi.getJobTasks(id as string);
                setTasks(taskData);
            }
        } catch (error) {
            console.error('Failed to fetch job details', error);
            Alert.alert('Cilad', 'Ma suurtagalin in la soo raro faahfaahinta shaqada.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleAccept = async () => {
        setActionLoading(true);
        try {
            await providerApi.acceptRequest(id as string);
            Alert.alert('Guul', 'Codsigii waad aqbashay.');
            fetchDetails();
        } catch (error) {
            Alert.alert('Cilad', 'Ma suurtagalin in la aqbalo.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleStart = async () => {
        Alert.alert(
            'Bilow Shaqada',
            'Ma hubtaa inaad rabto inaad bilowdo shaqadan?',
            [
                { text: 'Maya', style: 'cancel' },
                {
                    text: 'Haa, Bilow',
                    onPress: async () => {
                        setActionLoading(true);
                        try {
                            await providerApi.updateRequestStatus(id as string, 'IN_PROGRESS');
                            Alert.alert('Guul', 'Shaqada waa la bilaabay!');
                            fetchDetails();
                        } catch (error) {
                            Alert.alert('Cilad', 'Ma suurtagalin in la bilaabo.');
                        } finally {
                            setActionLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const toggleTask = async (taskId: string) => {
        const updatedTasks = tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        setTasks(updatedTasks);
        try {
            await providerApi.updateJobTasks(id as string, updatedTasks);
        } catch (error) {
            console.error('Failed to update task', error);
        }
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            setProofImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const handleComplete = async () => {
        if (!proofImage) {
            Alert.alert('Sawir loo baahan yahay', 'Fadlan soo geli sawir caddeyn ah.');
            return;
        }
        if (!proofNote.trim()) {
            Alert.alert('Sharaxaad loo baahan yahay', 'Fadlan geli sharaxaad ku saabsan shaqada aad qabatay.');
            return;
        }

        Alert.alert(
            'Dhammaystir Shaqada',
            'Ma hubtaa inaad dhamaysay shaqadan? Macmiilku wuxuu arki doonaa sawirka iyo sharaxaadda aad soo gudbisay.',
            [
                { text: 'Maya', style: 'cancel' },
                {
                    text: 'Haa, Soo gudbi',
                    onPress: async () => {
                        setActionLoading(true);
                        try {
                            await providerApi.submitProof(id as string, proofImage, proofNote);
                            Alert.alert('Hambalyo!', 'Shaqadii waad dhamaysay. Macmiilku hadda wuu arki karaa shaqadii aad qabatay.');
                            fetchDetails();
                            setProofImage(null);
                            setProofNote('');
                        } catch (error) {
                            Alert.alert('Cilad', 'Ma suurtagalin in shaqada la dhameeyo. Fadlan isku day mar kale.');
                        } finally {
                            setActionLoading(false);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#5c6bf0" />
                <Text style={styles.loadingText}>Soo rarida...</Text>
            </View>
        );
    }

    if (!job) return null;

    const statusMap: any = {
        'PENDING': { label: 'Suuqa', color: '#f59e0b', bg: '#fef3c7', icon: 'shopping-cart' },
        'WAITING_APPROVAL': { label: 'Sugitaanka', color: '#6366f1', bg: '#eef2ff', icon: 'clock-o' },
        'ACCEPTED': { label: 'Lagoo xushay', color: '#5c6bf0', bg: '#ede9fe', icon: 'check-circle' },
        'IN_PROGRESS': { label: 'Socda', color: '#3b82f6', bg: '#eff6ff', icon: 'refresh' },
        'COMPLETED': { label: 'Dhamaaday', color: '#10b981', bg: '#ecfdf5', icon: 'check-circle' },
    };

    const s = statusMap[job.status] || { label: job.status, color: '#94a3b8', bg: '#f8fafc', icon: 'info-circle' };

    const completedTasks = tasks.filter(t => t.completed).length;
    const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <FontAwesome name="chevron-left" size={20} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Faahfaahinta Shaqada</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                    <FontAwesome name={s.icon} size={14} color={s.color} />
                    <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
                </View>

                {/* Job Info Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{job.category}</Text>
                        </View>
                        <Text style={styles.priceText}>${job.price}</Text>
                    </View>
                    <View style={styles.clientRow}>
                        <Text style={styles.clientName}>{job.clientName || job.user?.name || 'Macmiil'}</Text>
                        {job.provider?.verified && <VerifiedBadge size={18} />}
                    </View>
                    {job.description && <Text style={styles.desc}>{job.description}</Text>}

                    {/* Client Contact Info */}
                    {job.user && (
                        <View style={styles.contactSection}>
                            <View style={styles.contactItem}>
                                <FontAwesome name="phone" size={14} color="#64748b" />
                                <Text style={styles.contactText}>{job.user.phone || 'Ma jiro'}</Text>
                            </View>
                            <View style={styles.contactItem}>
                                <FontAwesome name="map-marker" size={14} color="#64748b" />
                                <Text style={styles.contactText}>{job.location || 'Mogadishu'}</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Workflow Timeline */}
                <View style={styles.workflowSection}>
                    <Text style={styles.sectionTitle}>Socodka Shaqada</Text>
                    <View style={styles.timeline}>
                        <TimelineItem
                            icon="shopping-cart"
                            label="Suuqa"
                            completed={true}
                            active={job.status === 'PENDING'}
                        />
                        <TimelineItem
                            icon="check-circle"
                            label="Aqbalay"
                            completed={['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(job.status)}
                            active={job.status === 'ACCEPTED'}
                        />
                        <TimelineItem
                            icon="refresh"
                            label="Socda"
                            completed={['IN_PROGRESS', 'COMPLETED'].includes(job.status)}
                            active={job.status === 'IN_PROGRESS'}
                        />
                        <TimelineItem
                            icon="star"
                            label="Dhamaaday"
                            completed={job.status === 'COMPLETED'}
                            active={job.status === 'COMPLETED'}
                            isLast={true}
                        />
                    </View>
                </View>

                {/* Tasks Section (only show when IN_PROGRESS) */}
                {job.status === 'IN_PROGRESS' && tasks.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Hawlaha ({progressPercent}%)</Text>
                            <Text style={styles.taskCount}>{completedTasks}/{tasks.length}</Text>
                        </View>
                        <View style={styles.taskList}>
                            {tasks.map(t => (
                                <TouchableOpacity key={t.id} style={styles.task} onPress={() => toggleTask(t.id)}>
                                    <FontAwesome
                                        name={t.completed ? "check-square" : "square-o"}
                                        size={22}
                                        color={t.completed ? "#5c6bf0" : "#cbd5e1"}
                                    />
                                    <Text style={[styles.taskText, t.completed && styles.taskTextCompleted]}>
                                        {t.text}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Proof of Work Section (only show when IN_PROGRESS) */}
                {job.status === 'IN_PROGRESS' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Caddeynta Shaqada</Text>
                        <Text style={styles.sectionSubtitle}>Soo geli sawir iyo sharaxaad ku saabsan shaqada aad qabatay</Text>

                        <TouchableOpacity style={styles.uploadBtn} onPress={handlePickImage}>
                            {proofImage ? (
                                <View style={styles.imagePreview}>
                                    <Image source={{ uri: proofImage }} style={styles.previewImage} />
                                    <TouchableOpacity style={styles.changeImageBtn} onPress={handlePickImage}>
                                        <FontAwesome name="camera" size={16} color="#fff" />
                                        <Text style={styles.changeImageText}>Badal Sawirka</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.uploadPlaceholder}>
                                    <FontAwesome name="camera" size={40} color="#cbd5e1" />
                                    <Text style={styles.uploadText}>Riix si aad u soo geliso sawir</Text>
                                    <Text style={styles.uploadSubtext}>Sawir caddeyn ah oo muujinaya shaqada aad qabatay</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TextInput
                            style={styles.noteInput}
                            placeholder="Sharaxaad ku saabsan shaqada aad qabatay..."
                            placeholderTextColor="#94a3b8"
                            value={proofNote}
                            onChangeText={setProofNote}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                )}

                {/* Completed Proof Display (Always show work history) */}
                {(job.status === 'COMPLETED' || job.proofOfWork) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Taariikhda Shaqada (Work History)</Text>
                        {job.proofOfWork && <Image source={{ uri: job.proofOfWork }} style={styles.completedProofImage} />}
                        {job.proofOfWorkNote && (
                            <View style={styles.noteCard}>
                                <Text style={styles.noteLabel}>Sharaxaad:</Text>
                                <Text style={styles.noteText}>{job.proofOfWorkNote}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Ratings Section (When completed) */}
                {job.status === 'COMPLETED' && job.review && (
                    <Animatable.View animation="fadeInUp" style={styles.section}>
                        <Text style={styles.sectionTitle}>Qiimaynta Macmiilka</Text>
                        <View style={styles.ratingCard}>
                            <View style={styles.ratingHeader}>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FontAwesome
                                            key={star}
                                            name={job.review!.rating >= star ? "star" : "star-o"}
                                            size={18}
                                            color="#f59e0b"
                                            style={{ marginRight: 4 }}
                                        />
                                    ))}
                                </View>
                                <Text style={styles.ratingDate}>
                                    {new Date(job.review.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                            {job.review.comment && (
                                <Text style={styles.ratingComment}>"{job.review.comment}"</Text>
                            )}
                        </View>
                    </Animatable.View>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Action Footer */}
            <View style={styles.footer}>
                {job.status === 'PENDING' && (
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#5c6bf0' }]}
                        onPress={handleAccept}
                        disabled={actionLoading}
                    >
                        {actionLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <FontAwesome name="check" size={18} color="#fff" />
                                <Text style={styles.actionBtnText}>AQBAL CODSIGA</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
                {job.status === 'ACCEPTED' && (
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#3b82f6' }]}
                        onPress={handleStart}
                        disabled={actionLoading}
                    >
                        {actionLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <FontAwesome name="play" size={18} color="#fff" />
                                <Text style={styles.actionBtnText}>BILOW SHAQADA</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
                {job.status === 'IN_PROGRESS' && (
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#10b981' }]}
                        onPress={handleComplete}
                        disabled={actionLoading || !proofImage || !proofNote.trim()}
                    >
                        {actionLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <FontAwesome name="check-circle" size={18} color="#fff" />
                                <Text style={styles.actionBtnText}>DHAMAYSTIR SHAQADA</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// Timeline Item Component
const TimelineItem = ({ icon, label, completed, active, isLast }: any) => (
    <View style={styles.timelineItem}>
        <View style={styles.timelineIconContainer}>
            <View style={[
                styles.timelineIcon,
                completed && styles.timelineIconCompleted,
                active && styles.timelineIconActive
            ]}>
                <FontAwesome
                    name={icon}
                    size={14}
                    color={completed || active ? '#fff' : '#cbd5e1'}
                />
            </View>
            {!isLast && <View style={[styles.timelineLine, completed && styles.timelineLineCompleted]} />}
        </View>
        <Text style={[
            styles.timelineLabel,
            completed && styles.timelineLabelCompleted,
            active && styles.timelineLabelActive
        ]}>{label}</Text>
    </View>
);

export default JobDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8faff'
    },
    loading: {
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 25,
        paddingBottom: 20,
        backgroundColor: '#f8faff'
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1e293b'
    },
    scroll: {
        paddingHorizontal: 25,
        paddingTop: 10
    },
    statusBadge: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 20
    },
    statusText: {
        fontWeight: '900',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    card: {
        padding: 25,
        backgroundColor: '#fff',
        borderRadius: 25,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    categoryBadge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#64748b',
        textTransform: 'uppercase'
    },
    priceText: {
        fontSize: 28,
        fontWeight: '900',
        color: '#10b981'
    },
    clientName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 10
    },
    desc: {
        marginTop: 5,
        fontSize: 15,
        lineHeight: 24,
        color: '#64748b',
        fontWeight: '600'
    },
    contactSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        gap: 12
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    contactText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b'
    },
    workflowSection: {
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 25,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    timeline: {
        marginTop: 15
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 15
    },
    timelineIconContainer: {
        alignItems: 'center'
    },
    timelineIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center'
    },
    timelineIconCompleted: {
        backgroundColor: '#5c6bf0'
    },
    timelineIconActive: {
        backgroundColor: '#3b82f6'
    },
    timelineLine: {
        width: 2,
        height: 30,
        backgroundColor: '#f1f5f9',
        marginTop: 5
    },
    timelineLineCompleted: {
        backgroundColor: '#5c6bf0'
    },
    timelineLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#94a3b8',
        paddingTop: 8
    },
    timelineLabelCompleted: {
        color: '#1e293b'
    },
    timelineLabelActive: {
        color: '#3b82f6',
        fontWeight: '900'
    },
    section: {
        marginBottom: 25
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1e293b'
    },
    sectionSubtitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#94a3b8',
        marginTop: 5,
        marginBottom: 15
    },
    taskCount: {
        fontSize: 14,
        fontWeight: '900',
        color: '#5c6bf0'
    },
    taskList: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        gap: 5,
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    task: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#f8faff'
    },
    taskText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b'
    },
    taskTextCompleted: {
        textDecorationLine: 'line-through',
        color: '#94a3b8'
    },
    uploadBtn: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 15
    },
    uploadPlaceholder: {
        height: 220,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#e2e8f0',
        borderRadius: 20
    },
    uploadText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '800',
        color: '#1e293b'
    },
    uploadSubtext: {
        marginTop: 5,
        fontSize: 13,
        fontWeight: '600',
        color: '#94a3b8',
        textAlign: 'center',
        paddingHorizontal: 40
    },
    imagePreview: {
        position: 'relative',
        height: 250,
        borderRadius: 20,
        overflow: 'hidden'
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    changeImageBtn: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12
    },
    changeImageText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '800'
    },
    noteInput: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        minHeight: 120
    },
    completedProofImage: {
        width: '100%',
        height: 250,
        borderRadius: 20,
        marginBottom: 15,
        resizeMode: 'cover'
    },
    noteCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    noteLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: 8
    },
    noteText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
        lineHeight: 24
    },
    footer: {
        padding: 25,
        paddingBottom: 35,
        backgroundColor: '#f8faff',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9'
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 18,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5
    },
    actionBtnText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 15,
        letterSpacing: 0.5
    },
    clientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10
    },
    ratingCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginTop: 10
    },
    ratingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    starsRow: {
        flexDirection: 'row'
    },
    ratingDate: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '700'
    },
    ratingComment: {
        fontSize: 15,
        color: '#475569',
        fontWeight: '600',
        lineHeight: 22,
        fontStyle: 'italic'
    }
});
