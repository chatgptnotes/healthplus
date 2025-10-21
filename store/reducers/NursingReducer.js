import {
	FETCH_PATIENT_ASSIGNMENTS,
	ASSIGN_PATIENT,
	UPDATE_PATIENT_STATUS,
	RECORD_VITAL_SIGNS,
	FETCH_VITAL_SIGNS,
	ADMINISTER_MEDICATION,
	FETCH_MEDICATION_SCHEDULE,
	UPDATE_MEDICATION_STATUS,
	CREATE_NURSING_NOTE,
	FETCH_NURSING_NOTES,
	UPDATE_CARE_PLAN,
	FETCH_CARE_PLANS
} from '../actions/NursingActions';

const initialState = {
	patientAssignments: [],
	vitalSigns: [],
	medicationSchedule: [],
	medicationRecords: [],
	nursingNotes: [],
	carePlans: [],
	isLoading: false,
	error: null
};

const NursingReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_PATIENT_ASSIGNMENTS:
			return {
				...state,
				patientAssignments: action.assignments,
				isLoading: false
			};

		case ASSIGN_PATIENT:
			return {
				...state,
				patientAssignments: state.patientAssignments.concat(action.assignment)
			};

		case UPDATE_PATIENT_STATUS:
			const updatedAssignments = state.patientAssignments.map(assignment =>
				assignment.id === action.assignmentId
					? { ...assignment, status: action.newStatus, ...action.updateData }
					: assignment
			);
			return {
				...state,
				patientAssignments: updatedAssignments
			};

		case RECORD_VITAL_SIGNS:
			return {
				...state,
				vitalSigns: state.vitalSigns.concat(action.vitalRecord)
			};

		case FETCH_VITAL_SIGNS:
			return {
				...state,
				vitalSigns: action.vitalSigns,
				isLoading: false
			};

		case ADMINISTER_MEDICATION:
			return {
				...state,
				medicationRecords: state.medicationRecords.concat(action.medicationRecord)
			};

		case FETCH_MEDICATION_SCHEDULE:
			return {
				...state,
				medicationSchedule: action.medicationSchedule,
				isLoading: false
			};

		case UPDATE_MEDICATION_STATUS:
			const updatedMedicationSchedule = state.medicationSchedule.map(medication =>
				medication.id === action.medicationId
					? { ...medication, status: action.newStatus, ...action.updateData }
					: medication
			);
			return {
				...state,
				medicationSchedule: updatedMedicationSchedule
			};

		case CREATE_NURSING_NOTE:
			return {
				...state,
				nursingNotes: state.nursingNotes.concat(action.nursingNote)
			};

		case FETCH_NURSING_NOTES:
			return {
				...state,
				nursingNotes: action.nursingNotes,
				isLoading: false
			};

		case UPDATE_CARE_PLAN:
			const updatedCarePlans = state.carePlans.map(carePlan =>
				carePlan.patientId === action.patientId
					? { ...carePlan, ...action.carePlanData }
					: carePlan
			);
			return {
				...state,
				carePlans: updatedCarePlans
			};

		case FETCH_CARE_PLANS:
			return {
				...state,
				carePlans: action.carePlans,
				isLoading: false
			};

		default:
			return state;
	}
};

export default NursingReducer;