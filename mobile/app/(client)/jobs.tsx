import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal, Dimensions, TextInput, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { clientApi } from '../../src/api/client.api';
import { useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../src/store/auth.store';

import { ReviewModal } from '../../src/components/ReviewModal';
import { VerifiedBadge } from '../../src/components/VerifiedBadge';

const { width } = Dimensions.get('window');

const FILTERS = [
    { id: 'all', label: 'Dhamaan' },
    { id: 'pending', label: 'Sugitaan' },
    { id: 'accepted', label: 'La aqbalay' },
    { id: 'in_progress', label: 'Socda' },
    { id: 'completed', label: 'Dhamaaday' },
];

export default function JobsScreen() {
    const params = useLocalSearchParams();
    const activeFilterParam = Array.isArray(params.filter) ? params.filter[0] : params.filter;
    const [activeFilter, setActiveFilter] = useState((activeFilterParam as string) || 'all');
    const [requests, setRequests] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const fetchData = async () => {
        if (!useAuthStore.getState().isAuthenticated) return;
        try {
            const data = await clientApi.getRequests();
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
        }
    };

    const handleOpenDetails = (job: any) => {
        setSelectedJob(job);
        setShowModal(true);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    useEffect(() => {
        if (params.filter) {
            setActiveFilter(params.filter as string);
        }
        fetchData();
    }, [params.filter]);

    const filteredRequests = requests.filter(req => {
        if (activeFilter === 'all') return true;
        return req.status.toLowerCase() === activeFilter.toLowerCase();
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return '#10b981';
            case 'ACCEPTED': return '#f59e0b';
            case 'IN_PROGRESS': return '#3b82f6';
            case 'PENDING': return '#94a3b8';
            default: return '#64748b';
        }
    };

    const StatusBadge = ({ status }: { status: string }) => (
        <View style={styles.statusBadgeWrap}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
            <Text style={[styles.statusBadgeText, { color: getStatusColor(status) }]}>
                {status === 'COMPLETED' ? 'Dhamaad' : status === 'ACCEPTED' ? 'La ogolaaday' : status === 'IN_PROGRESS' ? 'Socda' : 'Sugaya'}
            </Text>
        </View>
    );

    const JobDetailsModal = () => {
        if (!selectedJob) return null;

        const tasks = selectedJob.tasks ? JSON.parse(selectedJob.tasks) : [];
        const progress = selectedJob.progressPercentage || 0;
        const [rejectReason, setRejectReason] = useState("");
        const [showRejectInput, setShowRejectInput] = useState(false);
        const [processing, setProcessing] = useState(false);

        const handleApprove = async () => {
            setProcessing(true);
            try {
                await clientApi.approveRequest(selectedJob.id);
                // Refresh and close
                await fetchData();
                setShowModal(false);
            } catch (error) {
                console.error("Failed to approve", error);
                alert("Failed to approve request");
            } finally {
                setProcessing(false);
            }
        };

        const handleReject = async () => {
            if (!rejectReason.trim()) {
                alert("Fadlan qor sababta aad u diidayso");
                return;
            }
            setProcessing(true);
            try {
                await clientApi.rejectRequest(selectedJob.id, rejectReason);
                await fetchData();
                setShowModal(false);
            } catch (error) {
                console.error("Failed to reject", error);
            } finally {
                setProcessing(false);
            }
        };

        return (
            <Modal
                visible={showModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHandle} />
                            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
                                <FontAwesome name="times-circle" size={24} color="#cbd5e1" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>

                            {/* Applicant Section - Only for WAITING_APPROVAL */}
                            {selectedJob.status === 'WAITING_APPROVAL' && selectedJob.provider && (
                                <View style={styles.applicantSection}>
                                    <View style={styles.applicantHeader}>
                                        <Text style={styles.applicantTitle}>Codsi Cusub (New Applicant)</Text>
                                        <View style={styles.newBadge}>
                                            <Text style={styles.newBadgeText}>NEW</Text>
                                        </View>
                                    </View>

                                    <View style={styles.applicantCard}>
                                        <View style={styles.applicantInfoRow}>
                                            <View style={styles.applicantAvatar}>
                                                <Text style={styles.avatarText}>
                                                    {selectedJob.provider.user?.name?.charAt(0) || 'P'}
                                                </Text>
                                            </View>
                                            <View style={styles.applicantDetails}>
                                                <Text style={styles.applicantName}>{selectedJob.provider.user?.name}</Text>
                                                <Text style={styles.applicantRole}>Verified Provider</Text>
                                                <View style={styles.ratingRow}>
                                                    <FontAwesome name="star" size={12} color="#f59e0b" />
                                                    <Text style={styles.ratingText}>5.0 (20 shaqo)</Text>
                                                </View>
                                            </View>
                                        </View>

                                        {!showRejectInput ? (
                                            <View style={styles.applicantActions}>
                                                <TouchableOpacity
                                                    style={[styles.actionBtnSmall, styles.rejectBtn]}
                                                    onPress={() => setShowRejectInput(true)}
                                                >
                                                    <Text style={styles.rejectBtnText}>Diid (Decline)</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[styles.actionBtnSmall, styles.acceptBtn]}
                                                    onPress={handleApprove}
                                                    disabled={processing}
                                                >
                                                    <Text style={styles.acceptBtnText}>{processing ? "Processing..." : "Aqbal (Accept)"}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <View style={styles.rejectInputContainer}>
                                                <Text style={styles.rejectLabel}>Sababta diidmada:</Text>
                                                <View style={styles.inputWrapper}>
                                                    <TextInput
                                                        style={styles.rejectInput}
                                                        placeholder="Qor sababta..."
                                                        value={rejectReason}
                                                        onChangeText={setRejectReason}
                                                        autoFocus
                                                    />
                                                </View>
                                                <View style={styles.applicantActions}>
                                                    <TouchableOpacity
                                                        style={[styles.actionBtnSmall, { backgroundColor: '#f1f5f9' }]}
                                                        onPress={() => setShowRejectInput(false)}
                                                    >
                                                        <Text style={{ color: '#64748b', fontWeight: '700' }}>Cancel</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.actionBtnSmall, styles.rejectBtn]}
                                                        onPress={handleReject}
                                                        disabled={processing}
                                                    >
                                                        <Text style={styles.rejectBtnText}>Confirm Reject</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}

                            <View style={styles.jobTypeTag}>
                                <View style={styles.categoryTag}>
                                    <Text style={styles.categoryTagText}>{selectedJob.category?.toUpperCase() || 'GENERAL'}</Text>
                                </View>
                                <StatusBadge status={selectedJob.status} />
                            </View>

                            <Text style={styles.modalJobDesc}>{selectedJob.description}</Text>

                            <View style={styles.priceLocRow}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>QIIMAHA</Text>
                                    <Text style={styles.detailValue}>${selectedJob.price || '0'}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>GOOBTA</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <FontAwesome name="map-marker" size={12} color="#5c6bf0" style={{ marginRight: 5 }} />
                                        <Text style={styles.detailValue}>{selectedJob.location || 'Mogadishu'}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Original Provider Info - Hide if handling acceptance */}
                            {selectedJob.provider && selectedJob.status !== 'WAITING_APPROVAL' && (
                                <View style={styles.providerCard}>
                                    <View style={styles.providerAvatar}>
                                        <FontAwesome name="user-circle" size={40} color="#5c6bf0" />
                                    </View>
                                    <View style={styles.providerInfo}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <Text style={styles.providerName}>{selectedJob.provider.user?.name || 'Farsama Yaqaan'}</Text>
                                            {selectedJob.provider.verified && <VerifiedBadge size={14} />}
                                        </View>
                                        <Text style={styles.providerRole}>PROFESSIONAL PROVIDER</Text>
                                    </View>
                                    <TouchableOpacity style={styles.callBtn}>
                                        <FontAwesome name="phone" size={18} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Workflow / Progress Section */}
                            {(selectedJob.status === 'IN_PROGRESS' || selectedJob.status === 'COMPLETED') && (
                                <View style={styles.workflowContainer}>
                                    <View style={styles.workflowHeader}>
                                        <Text style={styles.workflowTitle}>Workflow & Progress</Text>
                                        <Text style={styles.progressText}>{progress}% complete</Text>
                                    </View>

                                    {/* Progress Bar */}
                                    <View style={styles.progressBarBg}>
                                        <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: getStatusColor(selectedJob.status) }]} />
                                    </View>

                                    {/* Task Checklist */}
                                    <View style={styles.taskList}>
                                        {tasks.length > 0 ? (
                                            tasks.map((task: any, index: number) => (
                                                <View key={index} style={styles.taskItem}>
                                                    <View style={[styles.taskCheck, task.completed && { backgroundColor: getStatusColor(selectedJob.status), borderColor: getStatusColor(selectedJob.status) }]}>
                                                        {task.completed && <FontAwesome name="check" size={10} color="#fff" />}
                                                    </View>
                                                    <Text style={[styles.taskDesc, task.completed && styles.taskDescCompleted]}>{task.text}</Text>
                                                </View>
                                            ))
                                        ) : (
                                            <View style={styles.noTasks}>
                                                <FontAwesome name="info-circle" size={16} color="#94a3b8" />
                                                <Text style={styles.noTasksText}>Work-flow weli lama soo dhamayn...</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}

                            {selectedJob.notes && (
                                <View style={styles.notesBox}>
                                    <Text style={styles.notesLabel}>PROVIDER NOTES</Text>
                                    <Text style={styles.notesText}>{selectedJob.notes}</Text>
                                </View>
                            )}

                            {/* Review Action */}
                            {selectedJob.status === 'COMPLETED' && !selectedJob.review && (
                                <TouchableOpacity
                                    style={[styles.actionBtn, { backgroundColor: '#f59e0b', marginBottom: 15 }]}
                                    onPress={() => setShowReviewModal(true)}
                                >
                                    <FontAwesome name="star" size={16} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.actionBtnText}>Qiimayn kabixi shaqada Adeeg-bixiyaha</Text>
                                </TouchableOpacity>
                            )}

                            {selectedJob.status === 'COMPLETED' && selectedJob.review && (
                                <View style={[styles.actionBtn, { backgroundColor: '#ecfdf5', marginBottom: 15, borderWidth: 1, borderColor: '#10b981' }]}>
                                    <FontAwesome name="check-circle" size={16} color="#10b981" style={{ marginRight: 8 }} />
                                    <Text style={[styles.actionBtnText, { color: '#10b981' }]}>Qiimeyntadii waa la diray</Text>
                                </View>
                            )}

                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: getStatusColor(selectedJob.status) }]}
                                onPress={() => setShowModal(false)}
                            >
                                <Text style={styles.actionBtnText}>Xir Faahfaahinta</Text>
                            </TouchableOpacity>
                            <View style={{ height: 40 }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <JobDetailsModal />
            {selectedJob && (
                <ReviewModal
                    visible={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                    onSuccess={() => {
                        fetchData(); // Refresh list to update review status
                    }}
                    requestId={selectedJob.id}
                    providerId={selectedJob.providerId}
                    providerName={selectedJob.provider?.user?.name || "Provider"}
                />
            )}

            <View style={styles.header}>
                <Text style={styles.title}>Codsiyadayda</Text>
                <Text style={styles.subtitle}>Maamul oo la soco shaqooyinka lagu qabanayo</Text>
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {FILTERS.map((filter) => (
                        <TouchableOpacity
                            key={filter.id}
                            style={[styles.filterBtn, activeFilter === filter.id && styles.filterBtnActive]}
                            onPress={() => setActiveFilter(filter.id)}
                        >
                            <Text style={[styles.filterText, activeFilter === filter.id && styles.filterTextActive]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                        <TouchableOpacity key={req.id} style={styles.jobCard} onPress={() => handleOpenDetails(req)}>
                            <View style={styles.jobHeader}>
                                <View style={styles.categoryTag}>
                                    <Text style={styles.categoryTagText}>{req.category?.toUpperCase() || 'GENERAL'}</Text>
                                </View>
                                <StatusBadge status={req.status} />
                            </View>

                            <Text style={styles.jobDesc} numberOfLines={2}>
                                {req.description || 'Farsama yaqaan loo baahan yahay...'}
                            </Text>

                            <View style={styles.jobFooter}>
                                <View style={styles.metaRow}>
                                    <View style={styles.metaItem}>
                                        <FontAwesome name="map-marker" size={14} color="#5c6bf0" />
                                        <Text style={styles.metaText}>{req.location || 'Mogadishu'}</Text>
                                    </View>
                                    <View style={styles.metaItem}>
                                        <FontAwesome name="money" size={14} color="#10b981" />
                                        <Text style={styles.metaText}>${req.price || '0'}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.actionRow}>
                                <View style={styles.timeWrap}>
                                    <FontAwesome name="clock-o" size={12} color="#94a3b8" />
                                    <Text style={styles.timeText}>{new Date(req.createdAt).toLocaleDateString()}</Text>
                                </View>
                                <TouchableOpacity style={styles.detailBtn} onPress={() => handleOpenDetails(req)}>
                                    <Text style={styles.detailBtnText}>Eeg Faahfaahinta</Text>
                                    <View style={styles.chevronWrap}>
                                        <FontAwesome name="chevron-right" size={10} color="#fff" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <FontAwesome name="file-text-o" size={50} color="#e2e8f0" />
                        <Text style={styles.emptyStateText}>Ma jiraan codsiyo yala suuqa</Text>
                    </View>
                )}
                <View style={{ height: 100 }} />
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
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1e293b',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
        marginTop: 5,
    },
    filterContainer: {
        marginBottom: 10,
    },
    filterScroll: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    filterBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: '#fff',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    filterBtnActive: {
        backgroundColor: '#5c6bf0',
        borderColor: '#5c6bf0',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
    },
    filterTextActive: {
        color: '#fff',
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 20,
    },
    jobCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    categoryTag: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    categoryTagText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#64748b',
        letterSpacing: 0.5,
    },
    statusBadgeWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusBadgeText: {
        fontSize: 11,
        fontWeight: '800',
    },
    jobDesc: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
        lineHeight: 24,
        marginBottom: 15,
    },
    jobFooter: {
        marginBottom: 15,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 8,
    },
    metaText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginBottom: 15,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    timeText: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '600',
    },
    detailBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        paddingVertical: 10,
        paddingLeft: 16,
        paddingRight: 8,
        borderRadius: 14,
    },
    detailBtnText: {
        color: '#5c6bf0',
        fontWeight: '800',
        fontSize: 14,
        marginRight: 8,
    },
    chevronWrap: {
        width: 24,
        height: 24,
        borderRadius: 8,
        backgroundColor: '#5c6bf0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 15,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#94a3b8',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        height: '90%',
        paddingTop: 15,
    },
    modalHeader: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    modalHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
        marginBottom: 10,
    },
    closeBtn: {
        position: 'absolute',
        right: 20,
        top: 0,
    },
    modalScroll: {
        paddingHorizontal: 25,
    },
    jobTypeTag: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalJobDesc: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1e293b',
        lineHeight: 32,
        marginBottom: 25,
    },
    priceLocRow: {
        flexDirection: 'row',
        marginBottom: 30,
        gap: 40,
    },
    detailItem: {
        gap: 5,
    },
    detailLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#94a3b8',
        letterSpacing: 1,
    },
    detailValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    providerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 20,
        borderRadius: 24,
        marginBottom: 30,
    },
    providerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    providerInfo: {
        flex: 1,
    },
    providerName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1e293b',
    },
    providerRole: {
        fontSize: 10,
        fontWeight: '800',
        color: '#64748b',
        letterSpacing: 0.5,
    },
    callBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
    },
    workflowContainer: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginBottom: 30,
    },
    workflowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    workflowTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1e293b',
    },
    progressText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#5c6bf0',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        marginBottom: 25,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    taskList: {
        gap: 15,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    taskCheck: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    taskDesc: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    taskDescCompleted: {
        color: '#1e293b',
        textDecorationLine: 'line-through',
        opacity: 0.6,
    },
    noTasks: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
    },
    noTasksText: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '500',
    },
    notesBox: {
        backgroundColor: '#fffbeb',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fef3c7',
        marginBottom: 30,
    },
    notesLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#d97706',
        letterSpacing: 1,
        marginBottom: 8,
    },
    notesText: {
        fontSize: 14,
        color: '#b45309',
        fontWeight: '600',
        lineHeight: 20,
    },
    proofSection: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#10b981',
        marginBottom: 30,
        overflow: 'hidden',
    },
    proofImageWrap: {
        height: 200,
        backgroundColor: '#f0fdf4',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ecfdf5',
    },
    proofImage: {
        width: '100%',
        height: '100%',
    },
    proofNoteBox: {
        backgroundColor: '#f0fdf4',
        padding: 15,
        borderRadius: 12,
    },
    proofNoteLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#10b981',
        marginBottom: 4,
    },
    proofNote: {
        fontSize: 13,
        color: '#047857',
        fontWeight: '600',

        letterSpacing: 1,
        marginBottom: 8,
    },

    actionBtn: {
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    actionBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    applicantSection: {
        marginBottom: 25,
    },
    applicantHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    applicantTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1e293b',
    },
    newBadge: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    newBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
    },
    applicantCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    applicantInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    applicantAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#5c6bf0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
    },
    applicantDetails: {
        flex: 1,
    },
    applicantName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 4,
    },
    applicantRole: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#f59e0b',
    },
    applicantActions: {
        flexDirection: 'row',
        gap: 15,
    },
    actionBtnSmall: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptBtn: {
        backgroundColor: '#10b981',
    },
    acceptBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14,
    },
    rejectBtn: {
        backgroundColor: '#ef4444',
    },
    rejectBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14,
    },
    rejectInputContainer: {
        marginTop: 10,
    },
    rejectLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 10,
    },
    inputWrapper: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 15,
    },
    rejectInput: {
        fontSize: 14,
        color: '#1e293b',
        minHeight: 40,
    },
});
