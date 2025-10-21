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
			const response = await fetch(`https://healthplus-2b9b0.firebaseio.com/nursing/assignments.json`);
			if (!response.ok) {
				throw new Error("Failed to fetch patient assignments");
			}

			const resData = await response.json();
			const loadedAssignments = [];

			for (const key in resData) {
				if (resData[key].nurseId === userId) {
					loadedAssignments.push({
						id: key,
						patientId: resData[key].patientId,
						patientName: resData[key].patientName,
						roomNumber: resData[key].roomNumber,
						bedNumber: resData[key].bedNumber,
						admissionDate: resData[key].admissionDate,
						condition: resData[key].condition,
						priority: resData[key].priority || 'Normal',
						status: resData[key].status || 'Active',
						nurseId: resData[key].nurseId,
						shiftType: resData[key].shiftType,
						assignmentDate: resData[key].assignmentDate,
						specialInstructions: resData[key].specialInstructions
					});
				}
			}

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
		const token = getState().auth.token;
		const userId = getState().auth.userId;

		try {
			const response = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/nursing/vitalSigns.json?auth=${token}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						patientId: patientId,
						recordedBy: userId,
						recordedDate: new Date().toISOString(),
						temperature: vitalSigns.temperature,
						bloodPressure: vitalSigns.bloodPressure,
						heartRate: vitalSigns.heartRate,
						respiratoryRate: vitalSigns.respiratoryRate,
						oxygenSaturation: vitalSigns.oxygenSaturation,
						bloodSugar: vitalSigns.bloodSugar,
						weight: vitalSigns.weight,
						height: vitalSigns.height,
						notes: vitalSigns.notes
					})
				}
			);

			if (!response.ok) {
				throw new Error("Failed to record vital signs");
			}

			const resData = await response.json();

			dispatch({
				type: RECORD_VITAL_SIGNS,
				vitalRecord: {
					id: resData.name,
					patientId,
					recordedBy: userId,
					recordedDate: new Date().toISOString(),
					...vitalSigns
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
			const response = await fetch(`https://healthplus-2b9b0.firebaseio.com/nursing/vitalSigns.json`);
			if (!response.ok) {
				throw new Error("Failed to fetch vital signs");
			}

			const resData = await response.json();
			const loadedVitalSigns = [];

			for (const key in resData) {
				if (!patientId || resData[key].patientId === patientId) {
					loadedVitalSigns.push({
						id: key,
						patientId: resData[key].patientId,
						recordedBy: resData[key].recordedBy,
						recordedDate: resData[key].recordedDate,
						temperature: resData[key].temperature,
						bloodPressure: resData[key].bloodPressure,
						heartRate: resData[key].heartRate,
						respiratoryRate: resData[key].respiratoryRate,
						oxygenSaturation: resData[key].oxygenSaturation,
						bloodSugar: resData[key].bloodSugar,
						weight: resData[key].weight,
						height: resData[key].height,
						notes: resData[key].notes
					});
				}
			}

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
		const token = getState().auth.token;
		const userId = getState().auth.userId;

		try {
			const response = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/nursing/medicationAdministration.json?auth=${token}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...medicationData,
						administeredBy: userId,
						administeredDate: new Date().toISOString(),
						status: 'Administered'
					})
				}
			);

			if (!response.ok) {
				throw new Error("Failed to record medication administration");
			}

			const resData = await response.json();

			dispatch({
				type: ADMINISTER_MEDICATION,
				medicationRecord: {
					id: resData.name,
					...medicationData,
					administeredBy: userId,
					administeredDate: new Date().toISOString(),
					status: 'Administered'
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
			const response = await fetch(`https://healthplus-2b9b0.firebaseio.com/nursing/medicationSchedule.json`);
			if (!response.ok) {
				throw new Error("Failed to fetch medication schedule");
			}

			const resData = await response.json();
			const loadedSchedule = [];

			for (const key in resData) {
				if (!patientId || resData[key].patientId === patientId) {
					loadedSchedule.push({
						id: key,
						patientId: resData[key].patientId,
						patientName: resData[key].patientName,
						medicationName: resData[key].medicationName,
						dosage: resData[key].dosage,
						frequency: resData[key].frequency,
						route: resData[key].route,
						startDate: resData[key].startDate,
						endDate: resData[key].endDate,
						scheduledTimes: resData[key].scheduledTimes,
						prescribedBy: resData[key].prescribedBy,
						instructions: resData[key].instructions,
						status: resData[key].status || 'Active'
					});
				}
			}

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
		const token = getState().auth.token;
		const userId = getState().auth.userId;

		try {
			const response = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/nursing/nursingNotes.json?auth=${token}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...noteData,
						createdBy: userId,
						createdDate: new Date().toISOString(),
						shift: noteData.shift || 'Day'
					})
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create nursing note");
			}

			const resData = await response.json();

			dispatch({
				type: CREATE_NURSING_NOTE,
				nursingNote: {
					id: resData.name,
					...noteData,
					createdBy: userId,
					createdDate: new Date().toISOString(),
					shift: noteData.shift || 'Day'
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
			const response = await fetch(`https://healthplus-2b9b0.firebaseio.com/nursing/nursingNotes.json`);
			if (!response.ok) {
				throw new Error("Failed to fetch nursing notes");
			}

			const resData = await response.json();
			const loadedNotes = [];

			for (const key in resData) {
				if (!patientId || resData[key].patientId === patientId) {
					loadedNotes.push({
						id: key,
						patientId: resData[key].patientId,
						patientName: resData[key].patientName,
						noteType: resData[key].noteType,
						content: resData[key].content,
						shift: resData[key].shift,
						createdBy: resData[key].createdBy,
						createdDate: resData[key].createdDate,
						priority: resData[key].priority || 'Normal'
					});
				}
			}

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
		const token = getState().auth.token;
		const userId = getState().auth.userId;

		try {
			const response = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/nursing/carePlans/${patientId}.json?auth=${token}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...carePlanData,
						lastUpdated: new Date().toISOString(),
						updatedBy: userId
					})
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update care plan");
			}

			dispatch({
				type: UPDATE_CARE_PLAN,
				patientId,
				carePlanData: {
					...carePlanData,
					lastUpdated: new Date().toISOString(),
					updatedBy: userId
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
			const response = await fetch(`https://healthplus-2b9b0.firebaseio.com/nursing/carePlans.json`);
			if (!response.ok) {
				throw new Error("Failed to fetch care plans");
			}

			const resData = await response.json();
			const loadedCarePlans = [];

			for (const key in resData) {
				loadedCarePlans.push({
					patientId: key,
					patientName: resData[key].patientName,
					diagnosis: resData[key].diagnosis,
					goals: resData[key].goals,
					interventions: resData[key].interventions,
					evaluations: resData[key].evaluations,
					lastUpdated: resData[key].lastUpdated,
					updatedBy: resData[key].updatedBy,
					status: resData[key].status || 'Active'
				});
			}

			dispatch({
				type: FETCH_CARE_PLANS,
				carePlans: loadedCarePlans
			});
		} catch (err) {
			throw err;
		}
	};
};