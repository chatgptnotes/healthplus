import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    Platform,
    Share
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Sharing from 'expo-sharing';
import { useDispatch, useSelector } from 'react-redux';
import * as DocumentActions from '../store/actions/DocumentActions';

const DocumentViewer = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { document } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [showTranscription, setShowTranscription] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [analyzedData, setAnalyzedData] = useState(null);

    useEffect(() => {
        if (document.transcribed && document.extractedText) {
            setExtractedText(document.extractedText);
            analyzeDocumentContent(document.extractedText);
        }
    }, [document]);

    const analyzeDocumentContent = (text) => {
        // Parse the extracted text to identify key medical information
        const analysis = {
            medications: extractMedications(text),
            diagnoses: extractDiagnoses(text),
            testResults: extractTestResults(text),
            vitals: extractVitals(text),
            dates: extractDates(text),
            doctorNames: extractDoctorNames(text)
        };
        setAnalyzedData(analysis);
    };

    const extractMedications = (text) => {
        // Simple regex patterns for common medication formats
        const medPatterns = [
            /(?:prescribed|medication|medicine|drug):\s*([^\n,]+)/gi,
            /\b(?:mg|ml|tablet|capsule|syrup)\b.*?([A-Za-z]+)/gi
        ];
        const medications = [];
        medPatterns.forEach(pattern => {
            const matches = text.matchAll(pattern);
            for (const match of matches) {
                if (match[1]) medications.push(match[1].trim());
            }
        });
        return [...new Set(medications)];
    };

    const extractDiagnoses = (text) => {
        const diagnosisPatterns = [
            /(?:diagnosis|diagnosed with|impression|assessment):\s*([^\n]+)/gi,
            /(?:condition|disease|disorder):\s*([^\n]+)/gi
        ];
        const diagnoses = [];
        diagnosisPatterns.forEach(pattern => {
            const matches = text.matchAll(pattern);
            for (const match of matches) {
                if (match[1]) diagnoses.push(match[1].trim());
            }
        });
        return [...new Set(diagnoses)];
    };

    const extractTestResults = (text) => {
        const testPatterns = [
            /(?:test result|lab result|investigation):\s*([^\n]+)/gi,
            /([A-Za-z\s]+):\s*(\d+\.?\d*)\s*(mg\/dl|mmol\/l|g\/dl|%|IU\/ml)/gi
        ];
        const results = [];
        testPatterns.forEach(pattern => {
            const matches = text.matchAll(pattern);
            for (const match of matches) {
                if (match[0]) results.push(match[0].trim());
            }
        });
        return results;
    };

    const extractVitals = (text) => {
        const vitalPatterns = {
            bloodPressure: /(?:bp|blood pressure):\s*(\d+\/\d+)/gi,
            heartRate: /(?:pulse|heart rate|hr):\s*(\d+)/gi,
            temperature: /(?:temp|temperature):\s*(\d+\.?\d*)/gi,
            weight: /(?:weight|wt):\s*(\d+\.?\d*)\s*(?:kg|lbs)/gi,
            height: /(?:height|ht):\s*(\d+\.?\d*)\s*(?:cm|ft)/gi
        };

        const vitals = {};
        Object.entries(vitalPatterns).forEach(([key, pattern]) => {
            const match = text.match(pattern);
            if (match && match[1]) {
                vitals[key] = match[1];
            }
        });
        return vitals;
    };

    const extractDates = (text) => {
        const datePattern = /\b\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}\b/g;
        const dates = text.match(datePattern) || [];
        return [...new Set(dates)];
    };

    const extractDoctorNames = (text) => {
        const doctorPatterns = [
            /(?:Dr\.|Doctor)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/g,
            /(?:Consultant|Physician|Specialist):\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/g
        ];
        const doctors = [];
        doctorPatterns.forEach(pattern => {
            const matches = text.matchAll(pattern);
            for (const match of matches) {
                if (match[1]) doctors.push(match[1].trim());
            }
        });
        return [...new Set(doctors)];
    };

    const transcribeDocument = async () => {
        setIsLoading(true);
        try {
            const extractedText = await dispatch(DocumentActions.transcribeDocument(document));
            if (extractedText) {
                setExtractedText(extractedText);
                analyzeDocumentContent(extractedText);
                await dispatch(DocumentActions.saveExtractedText({
                    documentId: document.id,
                    text: extractedText,
                    analyzedData: analyzedData
                }));
                Alert.alert('Success', 'Document has been transcribed and analyzed');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to transcribe document');
        } finally {
            setIsLoading(false);
        }
    };

    const shareDocument = async () => {
        try {
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(document.uri);
            } else {
                Alert.alert('Sharing not available', 'Sharing is not available on this device');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to share document');
        }
    };

    const saveToMedicalRecord = async () => {
        if (!extractedText || !analyzedData) {
            Alert.alert('No Data', 'Please transcribe the document first');
            return;
        }

        try {
            await dispatch(DocumentActions.saveToMedicalRecord({
                documentId: document.id,
                category: document.category,
                extractedText: extractedText,
                analyzedData: analyzedData,
                originalDocument: document
            }));
            Alert.alert('Success', 'Document data has been saved to your medical record');
        } catch (error) {
            Alert.alert('Error', 'Failed to save to medical record');
        }
    };

    const renderAnalyzedData = () => {
        if (!analyzedData) return null;

        return (
            <View style={styles.analysisContainer}>
                <Text style={styles.analysisTitle}>Extracted Information</Text>

                {analyzedData.diagnoses.length > 0 && (
                    <View style={styles.analysisSection}>
                        <Text style={styles.analysisSectionTitle}>Diagnoses</Text>
                        {analyzedData.diagnoses.map((diagnosis, index) => (
                            <View key={index} style={styles.analysisItem}>
                                <FontAwesome5 name="stethoscope" size={14} color="#6366f1" />
                                <Text style={styles.analysisItemText}>{diagnosis}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {analyzedData.medications.length > 0 && (
                    <View style={styles.analysisSection}>
                        <Text style={styles.analysisSectionTitle}>Medications</Text>
                        {analyzedData.medications.map((med, index) => (
                            <View key={index} style={styles.analysisItem}>
                                <FontAwesome5 name="pills" size={14} color="#10b981" />
                                <Text style={styles.analysisItemText}>{med}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {analyzedData.testResults.length > 0 && (
                    <View style={styles.analysisSection}>
                        <Text style={styles.analysisSectionTitle}>Test Results</Text>
                        {analyzedData.testResults.map((result, index) => (
                            <View key={index} style={styles.analysisItem}>
                                <FontAwesome5 name="flask" size={14} color="#f59e0b" />
                                <Text style={styles.analysisItemText}>{result}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {Object.keys(analyzedData.vitals).length > 0 && (
                    <View style={styles.analysisSection}>
                        <Text style={styles.analysisSectionTitle}>Vital Signs</Text>
                        {Object.entries(analyzedData.vitals).map(([key, value], index) => (
                            <View key={index} style={styles.analysisItem}>
                                <FontAwesome5 name="heartbeat" size={14} color="#ef4444" />
                                <Text style={styles.analysisItemText}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {analyzedData.doctorNames.length > 0 && (
                    <View style={styles.analysisSection}>
                        <Text style={styles.analysisSectionTitle}>Healthcare Providers</Text>
                        {analyzedData.doctorNames.map((doctor, index) => (
                            <View key={index} style={styles.analysisItem}>
                                <FontAwesome5 name="user-md" size={14} color="#8b5cf6" />
                                <Text style={styles.analysisItemText}>Dr. {doctor}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {analyzedData.dates.length > 0 && (
                    <View style={styles.analysisSection}>
                        <Text style={styles.analysisSectionTitle}>Important Dates</Text>
                        {analyzedData.dates.map((date, index) => (
                            <View key={index} style={styles.analysisItem}>
                                <FontAwesome5 name="calendar" size={14} color="#64748b" />
                                <Text style={styles.analysisItemText}>{date}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Document Viewer</Text>
                <TouchableOpacity
                    style={styles.shareButton}
                    onPress={shareDocument}
                >
                    <Ionicons name="share-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.documentInfo}>
                    <View style={styles.documentIconLarge}>
                        {document.type?.includes('image') ? (
                            <FontAwesome5 name="image" size={32} color="#6366f1" />
                        ) : document.type?.includes('pdf') ? (
                            <FontAwesome5 name="file-pdf" size={32} color="#ef4444" />
                        ) : (
                            <FontAwesome5 name="file-alt" size={32} color="#64748b" />
                        )}
                    </View>
                    <Text style={styles.documentName}>{document.name}</Text>
                    <Text style={styles.documentMeta}>
                        {document.category} • Uploaded {new Date(document.uploadDate).toLocaleDateString()}
                    </Text>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.transcribeButton]}
                        onPress={transcribeDocument}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <>
                                <MaterialCommunityIcons name="text-recognition" size={20} color="white" />
                                <Text style={styles.actionButtonText}>
                                    {document.transcribed ? 'Re-transcribe' : 'Transcribe'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.saveButton]}
                        onPress={saveToMedicalRecord}
                        disabled={!extractedText}
                    >
                        <Ionicons name="save-outline" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Save to Record</Text>
                    </TouchableOpacity>
                </View>

                {document.type?.includes('image') && (
                    <View style={styles.imagePreview}>
                        <Image
                            source={{ uri: document.uri }}
                            style={styles.previewImage}
                            resizeMode="contain"
                        />
                    </View>
                )}

                {extractedText && (
                    <View style={styles.transcriptionContainer}>
                        <View style={styles.transcriptionHeader}>
                            <Text style={styles.transcriptionTitle}>Transcribed Text</Text>
                            <TouchableOpacity
                                onPress={() => setShowTranscription(!showTranscription)}
                            >
                                <Ionicons
                                    name={showTranscription ? "chevron-up" : "chevron-down"}
                                    size={24}
                                    color="#6366f1"
                                />
                            </TouchableOpacity>
                        </View>

                        {showTranscription && (
                            <View style={styles.transcriptionContent}>
                                <Text style={styles.transcriptionText}>{extractedText}</Text>
                            </View>
                        )}
                    </View>
                )}

                {analyzedData && renderAnalyzedData()}
            </ScrollView>
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
    shareButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    documentInfo: {
        alignItems: 'center',
        marginBottom: 30,
    },
    documentIconLarge: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    documentName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 8,
        textAlign: 'center',
    },
    documentMeta: {
        fontSize: 14,
        color: '#64748b',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        flex: 0.45,
        justifyContent: 'center',
    },
    transcribeButton: {
        backgroundColor: '#6366f1',
    },
    saveButton: {
        backgroundColor: '#10b981',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    imagePreview: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    previewImage: {
        width: '100%',
        height: 300,
    },
    transcriptionContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    transcriptionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    transcriptionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    transcriptionContent: {
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    transcriptionText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    analysisContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    analysisTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 16,
    },
    analysisSection: {
        marginBottom: 16,
    },
    analysisSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
    },
    analysisItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        marginBottom: 6,
    },
    analysisItemText: {
        fontSize: 13,
        color: '#1e293b',
        marginLeft: 10,
        flex: 1,
    },
});

export default DocumentViewer;