import { supabase } from '../../lib/supabase';

export const UPLOAD_DOCUMENT = 'UPLOAD_DOCUMENT';
export const DELETE_DOCUMENT = 'DELETE_DOCUMENT';
export const FETCH_DOCUMENTS = 'FETCH_DOCUMENTS';
export const SET_DOCUMENTS = 'SET_DOCUMENTS';
export const TRANSCRIBE_DOCUMENT = 'TRANSCRIBE_DOCUMENT';
export const SAVE_EXTRACTED_TEXT = 'SAVE_EXTRACTED_TEXT';
export const SAVE_TO_MEDICAL_RECORD = 'SAVE_TO_MEDICAL_RECORD';

// Mock OCR service - In production, integrate with real OCR service
const mockOCRService = async (documentUri, documentType) => {
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock extracted text based on document type
    const mockTexts = {
        consultations: `
            Patient Name: John Doe
            Date: 15/03/2024

            Chief Complaint: Persistent headache for 3 days

            Diagnosis: Migraine headache

            Prescribed Medication:
            1. Sumatriptan 50mg - Take 1 tablet at onset of migraine
            2. Paracetamol 500mg - Take 2 tablets every 6 hours as needed

            Follow-up: After 2 weeks

            Dr. Sarah Johnson
            MD, Neurology
        `,
        investigations: `
            Lab Report
            Date: 10/03/2024

            Complete Blood Count (CBC):
            Hemoglobin: 14.5 g/dl (Normal: 13.5-17.5)
            WBC Count: 7,500/mm³ (Normal: 4,500-11,000)
            Platelet Count: 250,000/mm³ (Normal: 150,000-450,000)

            Blood Sugar:
            Fasting: 95 mg/dl (Normal: 70-100)

            Lipid Profile:
            Total Cholesterol: 180 mg/dl
            LDL: 110 mg/dl
            HDL: 50 mg/dl
            Triglycerides: 140 mg/dl

            All results within normal range.
        `,
        radiology: `
            X-Ray Report
            Date: 12/03/2024

            Chest X-Ray PA View

            Findings:
            - Lungs are clear bilaterally
            - No evidence of consolidation or effusion
            - Heart size normal
            - No bony abnormalities seen

            Impression: Normal chest X-ray

            Reported by: Dr. Michael Chen
            Radiologist
        `
    };

    return mockTexts[documentType] || mockTexts.consultations;
};

export const uploadDocument = (documentData) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;

        try {
            const { data, error } = await supabase
                .from('patient_documents')
                .insert({
                    patient_id: documentData.patientId,
                    name: documentData.name,
                    category: documentData.category,
                    type: documentData.type,
                    file_url: documentData.uri,
                    upload_date: new Date().toISOString(),
                    uploaded_by: userId,
                    status: 'uploaded',
                    transcribed: false,
                    extracted_text: null,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to upload document: ${error.message}`);
            }

            const uploadedDocument = {
                id: data.id,
                patientId: data.patient_id,
                name: data.name,
                category: data.category,
                type: data.type,
                uri: data.file_url,
                uploadDate: data.upload_date,
                uploadedBy: data.uploaded_by,
                status: data.status,
                transcribed: data.transcribed,
                extractedText: data.extracted_text
            };

            dispatch({
                type: UPLOAD_DOCUMENT,
                payload: uploadedDocument
            });

            return uploadedDocument;
        } catch (error) {
            throw new Error('Failed to upload document: ' + error.message);
        }
    };
};

export const deleteDocument = (documentId) => {
    return async (dispatch) => {
        try {
            const { error } = await supabase
                .from('patient_documents')
                .delete()
                .eq('id', documentId);

            if (error) {
                throw new Error(`Failed to delete document: ${error.message}`);
            }

            dispatch({
                type: DELETE_DOCUMENT,
                payload: documentId
            });
        } catch (error) {
            throw new Error('Failed to delete document: ' + error.message);
        }
    };
};

export const fetchPatientDocuments = (patientId = null) => {
    return async (dispatch, getState) => {
        try {
            let query = supabase.from('patient_documents').select('*');

            if (patientId) {
                query = query.eq('patient_id', patientId);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) {
                throw new Error(`Failed to fetch documents: ${error.message}`);
            }

            const documents = data.map(item => ({
                id: item.id,
                patientId: item.patient_id,
                name: item.name,
                category: item.category,
                type: item.type,
                uri: item.file_url,
                uploadDate: item.upload_date,
                uploadedBy: item.uploaded_by,
                transcribed: item.transcribed,
                extractedText: item.extracted_text,
                status: item.status
            }));

            dispatch({
                type: SET_DOCUMENTS,
                payload: documents
            });

            return documents;
        } catch (error) {
            throw new Error('Failed to fetch documents: ' + error.message);
        }
    };
};

export const transcribeDocument = (document) => {
    return async (dispatch) => {
        try {
            // Call OCR service based on document type
            const extractedText = await mockOCRService(document.uri, document.category);

            // Update document in Supabase with extracted text
            const { data, error } = await supabase
                .from('patient_documents')
                .update({
                    transcribed: true,
                    extracted_text: extractedText,
                    updated_at: new Date().toISOString()
                })
                .eq('id', document.id)
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to save transcription: ${error.message}`);
            }

            dispatch({
                type: TRANSCRIBE_DOCUMENT,
                payload: {
                    documentId: document.id,
                    extractedText: extractedText
                }
            });

            return extractedText;
        } catch (error) {
            throw new Error('Failed to transcribe document: ' + error.message);
        }
    };
};

export const saveExtractedText = (data) => {
    return async (dispatch) => {
        try {
            const { error } = await supabase
                .from('patient_documents')
                .update({
                    extracted_text: data.extractedText,
                    transcribed: true,
                    updated_at: new Date().toISOString()
                })
                .eq('id', data.documentId);

            if (error) {
                throw new Error(`Failed to save extracted text: ${error.message}`);
            }

            dispatch({
                type: SAVE_EXTRACTED_TEXT,
                payload: data
            });

            return data;
        } catch (error) {
            throw new Error('Failed to save extracted text: ' + error.message);
        }
    };
};

export const saveToMedicalRecord = (recordData) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;

        try {
            const { data, error } = await supabase
                .from('patient_medical_records')
                .insert({
                    patient_id: recordData.patientId,
                    document_id: recordData.documentId,
                    record_type: recordData.recordType,
                    content: recordData.content,
                    extracted_data: recordData.extractedData,
                    created_by: userId,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to save to medical record: ${error.message}`);
            }

            const medicalRecord = {
                id: data.id,
                patientId: data.patient_id,
                documentId: data.document_id,
                recordType: data.record_type,
                content: data.content,
                extractedData: data.extracted_data,
                createdBy: data.created_by,
                createdAt: data.created_at
            };

            dispatch({
                type: SAVE_TO_MEDICAL_RECORD,
                payload: medicalRecord
            });

            return medicalRecord;
        } catch (error) {
            throw new Error('Failed to save to medical record: ' + error.message);
        }
    };
};

// OCR Integration Options for Production:
//
// 1. Google Cloud Vision API:
//    - Excellent accuracy for medical documents
//    - Supports handwriting recognition
//    - Can detect medical terms
//
// 2. AWS Textract:
//    - Good for forms and tables in medical documents
//    - Can extract key-value pairs
//    - HIPAA compliant
//
// 3. Azure Computer Vision:
//    - Good OCR capabilities
//    - Can be trained for medical terminology
//    - HIPAA compliant options
//
// 4. Tesseract.js (Open Source):
//    - Can run locally on device
//    - Free but less accurate
//    - Good for basic text extraction
//
// 5. Medical-specific OCR services:
//    - ABBYY FlexiCapture for Healthcare
//    - Kofax for medical document processing
//    - Specializes in medical forms and terminology

// Example integration with Google Cloud Vision:
/*
import { GoogleCloudVision } from '@google-cloud/vision';

const performOCR = async (documentUri) => {
    const client = new GoogleCloudVision.ImageAnnotatorClient({
        keyFilename: 'path/to/service-account-key.json'
    });

    const [result] = await client.textDetection(documentUri);
    const detections = result.textAnnotations;

    if (detections && detections.length > 0) {
        return detections[0].description;
    }

    return '';
};
*/

// Example integration with AWS Textract:
/*
import AWS from 'aws-sdk';

const textract = new AWS.Textract({
    region: 'us-east-1',
    accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_KEY'
});

const performOCR = async (documentBytes) => {
    const params = {
        Document: {
            Bytes: documentBytes
        }
    };

    const result = await textract.detectDocumentText(params).promise();

    let extractedText = '';
    result.Blocks.forEach(block => {
        if (block.BlockType === 'LINE') {
            extractedText += block.Text + '\n';
        }
    });

    return extractedText;
};
*/