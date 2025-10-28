import {
    UPLOAD_DOCUMENT,
    DELETE_DOCUMENT,
    SET_DOCUMENTS,
    TRANSCRIBE_DOCUMENT,
    SAVE_EXTRACTED_TEXT,
    SAVE_TO_MEDICAL_RECORD
} from '../actions/DocumentActions';

const initialState = {
    patientDocuments: [],
    medicalRecords: [],
    extractedData: {},
    isLoading: false,
    error: null
};

const DocumentReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPLOAD_DOCUMENT:
            return {
                ...state,
                patientDocuments: [...state.patientDocuments, action.payload]
            };

        case DELETE_DOCUMENT:
            return {
                ...state,
                patientDocuments: state.patientDocuments.filter(
                    doc => doc.id !== action.payload
                )
            };

        case SET_DOCUMENTS:
            return {
                ...state,
                patientDocuments: action.payload
            };

        case TRANSCRIBE_DOCUMENT:
            return {
                ...state,
                patientDocuments: state.patientDocuments.map(doc =>
                    doc.id === action.payload.documentId
                        ? {
                            ...doc,
                            transcribed: true,
                            extractedText: action.payload.extractedText
                        }
                        : doc
                )
            };

        case SAVE_EXTRACTED_TEXT:
            return {
                ...state,
                extractedData: {
                    ...state.extractedData,
                    [action.payload.documentId]: action.payload
                }
            };

        case SAVE_TO_MEDICAL_RECORD:
            return {
                ...state,
                medicalRecords: [...state.medicalRecords, action.payload]
            };

        default:
            return state;
    }
};

export default DocumentReducer;