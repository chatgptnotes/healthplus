import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
    ActivityIndicator,
    Modal,
    FlatList,
    Platform
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import * as DocumentActions from '../store/actions/DocumentActions';

const PatientDocuments = ({ navigation }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadCategory, setUploadCategory] = useState('');
    const [documents, setDocuments] = useState([]);
    const [transcriptionInProgress, setTranscriptionInProgress] = useState(false);

    const patientDocuments = useSelector(state => state.documents?.patientDocuments || []);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        setIsLoading(true);
        try {
            await dispatch(DocumentActions.fetchPatientDocuments());
            setDocuments(patientDocuments);
        } catch (error) {
            Alert.alert('Error', 'Failed to load documents');
        }
        setIsLoading(false);
    };

    const documentCategories = [
        {
            id: 'consultations',
            title: 'Previous Consultations',
            icon: 'stethoscope',
            color: '#6366f1',
            description: 'Upload consultation records from previous doctors'
        },
        {
            id: 'investigations',
            title: 'Lab Investigations',
            icon: 'flask',
            color: '#10b981',
            description: 'Upload lab test results and investigation reports'
        },
        {
            id: 'radiology',
            title: 'Radiology/Imaging',
            icon: 'x-ray',
            color: '#f59e0b',
            description: 'Upload X-rays, MRI, CT scan, and other imaging'
        },
        {
            id: 'prescriptions',
            title: 'Prescriptions',
            icon: 'pills',
            color: '#ef4444',
            description: 'Upload prescription documents'
        },
        {
            id: 'insurance',
            title: 'Insurance Documents',
            icon: 'shield-check',
            color: '#8b5cf6',
            description: 'Upload insurance cards and policy documents'
        },
        {
            id: 'other',
            title: 'Other Documents',
            icon: 'folder-plus',
            color: '#64748b',
            description: 'Upload any other medical documents'
        }
    ];

    const handleCategorySelect = (category) => {
        setUploadCategory(category.id);
        setShowUploadModal(true);
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*', 'text/*'],
                copyToCacheDirectory: true
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                await uploadDocument(result.assets[0]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick document');
        }
    };

    const pickImage = async (useCamera = false) => {
        const { status } = useCamera
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please grant camera/gallery permissions to upload documents.');
            return;
        }

        const result = useCamera
            ? await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                base64: false
            })
            : await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsMultipleSelection: true,
                base64: false
            });

        if (!result.canceled && result.assets) {
            for (const asset of result.assets) {
                await uploadDocument(asset);
            }
        }
    };

    const uploadDocument = async (file) => {
        setIsLoading(true);
        setShowUploadModal(false);

        try {
            const fileInfo = await FileSystem.getInfoAsync(file.uri);

            const documentData = {
                uri: file.uri,
                name: file.name || `document_${Date.now()}`,
                type: file.mimeType || 'application/octet-stream',
                size: fileInfo.size,
                category: uploadCategory,
                uploadDate: new Date().toISOString(),
                transcribed: false,
                extractedText: null
            };

            await dispatch(DocumentActions.uploadDocument(documentData));

            // Automatically trigger transcription for PDFs and images
            if (file.mimeType?.includes('pdf') || file.mimeType?.includes('image')) {
                await transcribeDocument(documentData);
            }

            Alert.alert('Success', 'Document uploaded successfully');
            loadDocuments();
        } catch (error) {
            Alert.alert('Upload Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const transcribeDocument = async (document) => {
        setTranscriptionInProgress(true);

        try {
            // Here you would integrate with an OCR service like:
            // - Google Cloud Vision API
            // - AWS Textract
            // - Azure Computer Vision
            // - Tesseract.js for local processing

            const extractedText = await dispatch(DocumentActions.transcribeDocument(document));

            if (extractedText) {
                // Save extracted text to database
                await dispatch(DocumentActions.saveExtractedText({
                    documentId: document.id,
                    text: extractedText,
                    metadata: {
                        category: document.category,
                        dateExtracted: new Date().toISOString()
                    }
                }));

                Alert.alert('Transcription Complete', 'Document text has been extracted and saved.');
            }
        } catch (error) {
            Alert.alert('Transcription Failed', 'Unable to extract text from document.');
        } finally {
            setTranscriptionInProgress(false);
        }
    };

    const viewDocument = (document) => {
        navigation.navigate('DocumentViewer', { document });
    };

    const deleteDocument = (documentId) => {
        Alert.alert(
            'Delete Document',
            'Are you sure you want to delete this document?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await dispatch(DocumentActions.deleteDocument(documentId));
                        loadDocuments();
                    }
                }
            ]
        );
    };

    const filterDocuments = () => {
        if (selectedCategory === 'all') {
            return documents;
        }
        return documents.filter(doc => doc.category === selectedCategory);
    };

    const renderDocumentItem = ({ item }) => (
        <TouchableOpacity
            style={styles.documentCard}
            onPress={() => viewDocument(item)}
        >
            <View style={styles.documentIcon}>
                {item.type?.includes('image') ? (
                    <FontAwesome5 name="image" size={24} color="#6366f1" />
                ) : item.type?.includes('pdf') ? (
                    <FontAwesome5 name="file-pdf" size={24} color="#ef4444" />
                ) : (
                    <FontAwesome5 name="file-alt" size={24} color="#64748b" />
                )}
            </View>

            <View style={styles.documentInfo}>
                <Text style={styles.documentName} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.documentMeta}>
                    {item.category} • {new Date(item.uploadDate).toLocaleDateString()}
                </Text>
                {item.transcribed && (
                    <View style={styles.transcribedBadge}>
                        <Ionicons name="checkmark-circle" size={12} color="#10b981" />
                        <Text style={styles.transcribedText}>Transcribed</Text>
                    </View>
                )}
            </View>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteDocument(item.id)}
            >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const UploadOptionsModal = () => (
        <Modal
            visible={showUploadModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowUploadModal(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Upload Document</Text>

                    <TouchableOpacity
                        style={styles.uploadOption}
                        onPress={() => pickImage(true)}
                    >
                        <Ionicons name="camera" size={24} color="#6366f1" />
                        <Text style={styles.uploadOptionText}>Take Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.uploadOption}
                        onPress={() => pickImage(false)}
                    >
                        <Ionicons name="images" size={24} color="#10b981" />
                        <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.uploadOption}
                        onPress={pickDocument}
                    >
                        <Ionicons name="document" size={24} color="#f59e0b" />
                        <Text style={styles.uploadOptionText}>Browse Files</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setShowUploadModal(false)}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Medical Documents</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Upload Documents</Text>
                <Text style={styles.sectionDescription}>
                    Upload and manage all your medical documents in one place
                </Text>

                <View style={styles.categoriesGrid}>
                    {documentCategories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[styles.categoryCard, { borderColor: category.color }]}
                            onPress={() => handleCategorySelect(category)}
                        >
                            <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                                <FontAwesome5 name={category.icon} size={24} color={category.color} />
                            </View>
                            <Text style={styles.categoryTitle}>{category.title}</Text>
                            <Text style={styles.categoryDescription} numberOfLines={2}>
                                {category.description}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.documentsSection}>
                    <Text style={styles.sectionTitle}>My Documents</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.filterContainer}
                    >
                        <TouchableOpacity
                            style={[styles.filterChip, selectedCategory === 'all' && styles.filterChipActive]}
                            onPress={() => setSelectedCategory('all')}
                        >
                            <Text style={[styles.filterChipText, selectedCategory === 'all' && styles.filterChipTextActive]}>
                                All
                            </Text>
                        </TouchableOpacity>

                        {documentCategories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[styles.filterChip, selectedCategory === category.id && styles.filterChipActive]}
                                onPress={() => setSelectedCategory(category.id)}
                            >
                                <Text style={[styles.filterChipText, selectedCategory === category.id && styles.filterChipTextActive]}>
                                    {category.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#6366f1" style={styles.loader} />
                    ) : filterDocuments().length > 0 ? (
                        <FlatList
                            data={filterDocuments()}
                            renderItem={renderDocumentItem}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="document-text-outline" size={64} color="#cbd5e1" />
                            <Text style={styles.emptyStateText}>No documents uploaded yet</Text>
                            <Text style={styles.emptyStateSubtext}>
                                Tap on any category above to upload documents
                            </Text>
                        </View>
                    )}
                </View>

                {transcriptionInProgress && (
                    <View style={styles.transcriptionBanner}>
                        <ActivityIndicator size="small" color="white" />
                        <Text style={styles.transcriptionText}>Extracting text from document...</Text>
                    </View>
                )}
            </ScrollView>

            <UploadOptionsModal />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#6366f1',
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },
    headerRight: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 8,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 20,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    categoryCard: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    categoryDescription: {
        fontSize: 12,
        color: '#64748b',
        lineHeight: 16,
    },
    documentsSection: {
        marginBottom: 30,
    },
    filterContainer: {
        marginBottom: 20,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'white',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    filterChipActive: {
        backgroundColor: '#6366f1',
        borderColor: '#6366f1',
    },
    filterChipText: {
        fontSize: 14,
        color: '#64748b',
    },
    filterChipTextActive: {
        color: 'white',
    },
    documentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    documentIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    documentInfo: {
        flex: 1,
    },
    documentName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1e293b',
        marginBottom: 4,
    },
    documentMeta: {
        fontSize: 12,
        color: '#64748b',
    },
    transcribedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    transcribedText: {
        fontSize: 11,
        color: '#10b981',
        marginLeft: 4,
    },
    deleteButton: {
        padding: 8,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#64748b',
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 8,
        textAlign: 'center',
    },
    loader: {
        marginTop: 40,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 20,
        textAlign: 'center',
    },
    uploadOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        marginBottom: 12,
    },
    uploadOptionText: {
        fontSize: 16,
        color: '#1e293b',
        marginLeft: 16,
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: 16,
        marginTop: 8,
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#64748b',
    },
    transcriptionBanner: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#6366f1',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    transcriptionText: {
        color: 'white',
        marginLeft: 12,
        fontSize: 14,
    },
});

export default PatientDocuments;