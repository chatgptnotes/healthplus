import { supabase } from '../../lib/supabase';

// Nursing Action Types
export const FETCH_PATIENT_ASSIGNMENTS = "FETCH_PATIENT_ASSIGNMENTS";
export const ASSIGN_PATIENT = "ASSIGN_PATIENT";
export const UPDATE_PATIENT_STATUS = "UPDATE_PATIENT_STATUS";
export const RECORD_VITAL_SIGNS = "RECORD_VITAL_SIGNS";
export const FETCH_VITAL_SIGNS = "FETCH_VITAL_SIGNS";
export const ADMINISTER_MEDICATION = "ADMINISTER_MEDICATION";
export const FETCH_MEDICATION_SCHEDULE = "FETCH_MEDICATION_SCHEDULE";
export const UPDATE_MEDICATION_STATUS = "UPDATE_MEDICATION_STATUS";
export const CREATE_NURSING_NOTE = "CREATE_NURSING_NOTE";
export const FETCH_NURSING_NOTES = "FETCH_NURSING_NOTES";
export const UPDATE_CARE_PLAN = "UPDATE_CARE_PLAN";
export const FETCH_CARE_PLANS = "FETCH_CARE_PLANS";

// Fetch Patient Assignments
export const FetchPatientAssignments = () => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;

		try {
			const { data, error } = await supabase
				.from('nursing_assignments')
				.select('*')
				.eq('nurse_id', userId);

			if (error) {
				throw new Error(`Failed to fetch patient assignments: ${error.message}`);
			}

			const loadedAssignments = data.map(item => ({
				id: item.id,
				patientId: item.patient_id,
				patientName: item.patient_name,
				roomNumber: item.room_number,
				bedNumber: item.bed_number,
				admissionDate: item.admission_date,
				condition: item.condition,
				priority: item.priority || 'Normal',
				status: item.status || 'Active',
				nurseId: item.nurse_id,
				shiftType: item.shift_type,
				assignmentDate: item.assignment_date,
				specialInstructions: item.special_instructions
			}));

			dispatch({
				type: FETCH_PATIENT_ASSIGNMENTS,
				assignments: loadedAssignments
			});
		} catch (err) {
			throw err;
		}
	};
};

// Record Vital Signs
export const RecordVitalSigns = (patientId, vitalSigns) => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;

		try {
			const { data, error } = await supabase
				.from('nursing_vital_signs')
				.insert({
					patient_id: patientId,
					recorded_by: userId,
					recorded_date: new Date().toISOString(),
					temperature: vitalSigns.temperature,
					blood_pressure: vitalSigns.bloodPressure,
					heart_rate: vitalSigns.heartRate,
					respiratory_rate: vitalSigns.respiratoryRate,
					oxygen_saturation: vitalSigns.oxygenSaturation,
					blood_sugar: vitalSigns.bloodSugar,
					weight: vitalSigns.weight,
					height: vitalSigns.height,
					notes: vitalSigns.notes,
					created_at: new Date().toISOString()
				})
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to record vital signs: ${error.message}`);
			}

			dispatch({
				type: RECORD_VITAL_SIGNS,
				vitalRecord: {
					id: data.id,
					patientId: data.patient_id,
					recordedBy: data.recorded_by,
					recordedDate: data.recorded_date,
					temperature: data.temperature,
					bloodPressure: data.blood_pressure,
					heartRate: data.heart_rate,
					respiratoryRate: data.respiratory_rate,
					oxygenSaturation: data.oxygen_saturation,
					bloodSugar: data.blood_sugar,
					weight: data.weight,
					height: data.height,
					notes: data.notes
				}
			});
		} catch (err) {
			throw err;
		}
	};
};

// Fetch Vital Signs
export const FetchVitalSigns = (patientId) => {
	return async (dispatch, getState) => {
		try {
			let query = supabase.from('nursing_vital_signs').select('*');

			if (patientId) {
				query = query.eq('patient_id', patientId);
			}

			const { data, error } = await query;

			if (error) {
				throw new Error(`Failed to fetch vital signs: ${error.message}`);
			}

			const loadedVitalSigns = data.map(item => ({
				id: item.id,
				patientId: item.patient_id,
				recordedBy: item.recorded_by,
				recordedDate: item.recorded_date,
				temperature: item.temperature,
				bloodPressure: item.blood_pressure,
				heartRate: item.heart_rate,
				respiratoryRate: item.respiratory_rate,
				oxygenSaturation: item.oxygen_saturation,
				bloodSugar: item.blood_sugar,
				weight: item.weight,
				height: item.height,
				notes: item.notes
			}));

			dispatch({
				type: FETCH_VITAL_SIGNS,
				vitalSigns: loadedVitalSigns
			});
		} catch (err) {
			throw err;
		}
	};
};

// Administer Medication
export const AdministerMedication = (medicationData) => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;

		try {
			const { data, error } = await supabase
				.from('nursing_medication_administration')
				.insert({
					patient_id: medicationData.patientId,
					medication_name: medicationData.medicationName,
					dosage: medicationData.dosage,
					route: medicationData.route,
					scheduled_time: medicationData.scheduledTime,
					notes: medicationData.notes,
					administered_by: userId,
					administered_date: new Date().toISOString(),
					status: 'Administered',
					created_at: new Date().toISOString()
				})
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to record medication administration: ${error.message}`);
			}

			dispatch({
				type: ADMINISTER_MEDICATION,
				medicationRecord: {
					id: data.id,
					patientId: data.patient_id,
					medicationName: data.medication_name,
					dosage: data.dosage,
					route: data.route,
					scheduledTime: data.scheduled_time,
					notes: data.notes,
					administeredBy: data.administered_by,
					administeredDate: data.administered_date,
					status: data.status
				}
			});
		} catch (err) {
			throw err;
		}
	};
};

// Fetch Medication Schedule
export const FetchMedicationSchedule = (patientId) => {
	return async (dispatch, getState) => {
		try {
			let query = supabase.from('nursing_medication_schedule').select('*');

			if (patientId) {
				query = query.eq('patient_id', patientId);
			}

			const { data, error } = await query;

			if (error) {
				throw new Error(`Failed to fetch medication schedule: ${error.message}`);
			}

			const loadedSchedule = data.map(item => ({
				id: item.id,
				patientId: item.patient_id,
				patientName: item.patient_name,
				medicationName: item.medication_name,
				dosage: item.dosage,
				frequency: item.frequency,
				route: item.route,
				startDate: item.start_date,
				endDate: item.end_date,
				scheduledTimes: item.scheduled_times,
				prescribedBy: item.prescribed_by,
				instructions: item.instructions,
				status: item.status || 'Active'
			}));

			dispatch({
				type: FETCH_MEDICATION_SCHEDULE,
				medicationSchedule: loadedSchedule
			});
		} catch (err) {
			throw err;
		}
	};
};

// Create Nursing Note
export const CreateNursingNote = (noteData) => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;

		try {
			const { data, error } = await supabase
				.from('nursing_notes')
				.insert({
					patient_id: noteData.patientId,
					patient_name: noteData.patientName,
					note_type: noteData.noteType,
					content: noteData.content,
					priority: noteData.priority || 'Normal',
					created_by: userId,
					created_date: new Date().toISOString(),
					shift: noteData.shift || 'Day',
					created_at: new Date().toISOString()
				})
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to create nursing note: ${error.message}`);
			}

			dispatch({
				type: CREATE_NURSING_NOTE,
				nursingNote: {
					id: data.id,
					patientId: data.patient_id,
					patientName: data.patient_name,
					noteType: data.note_type,
					content: data.content,
					priority: data.priority,
					createdBy: data.created_by,
					createdDate: data.created_date,
					shift: data.shift
				}
			});
		} catch (err) {
			throw err;
		}
	};
};

// Fetch Nursing Notes
export const FetchNursingNotes = (patientId) => {
	return async (dispatch, getState) => {
		try {
			let query = supabase.from('nursing_notes').select('*');

			if (patientId) {
				query = query.eq('patient_id', patientId);
			}

			const { data, error } = await query;

			if (error) {
				throw new Error(`Failed to fetch nursing notes: ${error.message}`);
			}

			const loadedNotes = data.map(item => ({
				id: item.id,
				patientId: item.patient_id,
				patientName: item.patient_name,
				noteType: item.note_type,
				content: item.content,
				shift: item.shift,
				createdBy: item.created_by,
				createdDate: item.created_date,
				priority: item.priority || 'Normal'
			}));

			dispatch({
				type: FETCH_NURSING_NOTES,
				nursingNotes: loadedNotes
			});
		} catch (err) {
			throw err;
		}
	};
};

// Update Care Plan
export const UpdateCarePlan = (patientId, carePlanData) => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;

		try {
			const updateData = {
				patient_name: carePlanData.patientName,
				diagnosis: carePlanData.diagnosis,
				goals: carePlanData.goals,
				interventions: carePlanData.interventions,
				evaluations: carePlanData.evaluations,
				status: carePlanData.status || 'Active',
				updated_at: new Date().toISOString(),
				updated_by: userId
			};

			const { data, error } = await supabase
				.from('nursing_care_plans')
				.upsert({
					patient_id: patientId,
					...updateData
				})
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to update care plan: ${error.message}`);
			}

			dispatch({
				type: UPDATE_CARE_PLAN,
				patientId,
				carePlanData: {
					patientName: data.patient_name,
					diagnosis: data.diagnosis,
					goals: data.goals,
					interventions: data.interventions,
					evaluations: data.evaluations,
					status: data.status,
					lastUpdated: data.updated_at,
					updatedBy: data.updated_by
				}
			});
		} catch (err) {
			throw err;
		}
	};
};

// Fetch Care Plans
export const FetchCarePlans = () => {
	return async (dispatch, getState) => {
		try {
			const { data, error } = await supabase
				.from('nursing_care_plans')
				.select('*');

			if (error) {
				throw new Error(`Failed to fetch care plans: ${error.message}`);
			}

			const loadedCarePlans = data.map(item => ({
				patientId: item.patient_id,
				patientName: item.patient_name,
				diagnosis: item.diagnosis,
				goals: item.goals,
				interventions: item.interventions,
				evaluations: item.evaluations,
				lastUpdated: item.updated_at,
				updatedBy: item.updated_by,
				status: item.status || 'Active'
			}));

			dispatch({
				type: FETCH_CARE_PLANS,
				carePlans: loadedCarePlans
			});
		} catch (err) {
			throw err;
		}
	};
};