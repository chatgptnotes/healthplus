export const UPDATE_OCCUPANCY_METRICS = 'UPDATE_OCCUPANCY_METRICS';
export const UPDATE_SURGERY_METRICS = 'UPDATE_SURGERY_METRICS';
export const UPDATE_ICU_METRICS = 'UPDATE_ICU_METRICS';
export const UPDATE_CRITICAL_PATIENTS = 'UPDATE_CRITICAL_PATIENTS';
export const FETCH_HOSPITAL_METRICS_START = 'FETCH_HOSPITAL_METRICS_START';
export const FETCH_HOSPITAL_METRICS_SUCCESS = 'FETCH_HOSPITAL_METRICS_SUCCESS';
export const FETCH_HOSPITAL_METRICS_FAIL = 'FETCH_HOSPITAL_METRICS_FAIL';

export const updateOccupancyMetrics = (occupancyData) => {
	return {
		type: UPDATE_OCCUPANCY_METRICS,
		payload: occupancyData
	};
};

export const updateSurgeryMetrics = (surgeryData) => {
	return {
		type: UPDATE_SURGERY_METRICS,
		payload: surgeryData
	};
};

export const updateICUMetrics = (icuData) => {
	return {
		type: UPDATE_ICU_METRICS,
		payload: icuData
	};
};

export const updateCriticalPatients = (criticalData) => {
	return {
		type: UPDATE_CRITICAL_PATIENTS,
		payload: criticalData
	};
};

export const fetchHospitalMetrics = () => {
	return async (dispatch) => {
		dispatch({ type: FETCH_HOSPITAL_METRICS_START });

		try {
			const currentDate = new Date();
			const yesterday = new Date(currentDate);
			yesterday.setDate(yesterday.getDate() - 1);

			const today = currentDate.toDateString();
			const yesterdayStr = yesterday.toDateString();

			const mockData = {
				occupancy: {
					totalBeds: 250,
					occupiedBeds: 197,
					availableBeds: 53,
					occupancyRate: 78.8,
					monthlyOccupancyRate: 82.1,
					dailyOccupancyTrend: [
						{ date: '2024-10-15', rate: 76.2 },
						{ date: '2024-10-16', rate: 78.1 },
						{ date: '2024-10-17', rate: 80.4 },
						{ date: '2024-10-18', rate: 82.1 },
						{ date: '2024-10-19', rate: 79.8 },
						{ date: '2024-10-20', rate: 77.6 },
						{ date: '2024-10-21', rate: 78.8 }
					],
					departmentOccupancy: [
						{ department: 'General Ward', totalBeds: 80, occupied: 67, rate: 83.8 },
						{ department: 'ICU', totalBeds: 24, occupied: 19, rate: 79.2 },
						{ department: 'Emergency', totalBeds: 20, occupied: 18, rate: 90.0 },
						{ department: 'Cardiology', totalBeds: 30, occupied: 24, rate: 80.0 },
						{ department: 'Orthopedics', totalBeds: 25, occupied: 20, rate: 80.0 },
						{ department: 'Neurology', totalBeds: 20, occupied: 15, rate: 75.0 },
						{ department: 'Pediatrics', totalBeds: 25, occupied: 18, rate: 72.0 },
						{ department: 'Maternity', totalBeds: 26, occupied: 16, rate: 61.5 }
					]
				},
				surgeries: {
					today: {
						scheduled: 12,
						completed: 8,
						ongoing: 2,
						cancelled: 1,
						pending: 1
					},
					yesterday: {
						scheduled: 14,
						completed: 13,
						cancelled: 1
					},
					monthly: {
						total: 287,
						completed: 268,
						cancelled: 12,
						successRate: 94.1,
						avgDuration: 142
					},
					surgeryTypes: [
						{ type: 'Cardiac', today: 2, monthly: 45 },
						{ type: 'Orthopedic', today: 3, monthly: 78 },
						{ type: 'Neurological', today: 1, monthly: 32 },
						{ type: 'General', today: 4, monthly: 98 },
						{ type: 'Emergency', today: 2, monthly: 34 }
					]
				},
				icuMetrics: {
					totalICUBeds: 24,
					occupiedICUBeds: 19,
					availableICUBeds: 5,
					icuOccupancyRate: 79.2,
					ventilatorUsage: {
						total: 12,
						inUse: 8,
						available: 4
					},
					icuPatients: [
						{ id: '1', name: 'अरुण शर्मा', condition: 'Post-surgery monitoring', severity: 'Stable', days: 2 },
						{ id: '2', name: 'प्रिया गुप्ता', condition: 'Cardiac arrest recovery', severity: 'Critical', days: 5 },
						{ id: '3', name: 'राज पटेल', condition: 'Stroke rehabilitation', severity: 'Improving', days: 8 },
						{ id: '4', name: 'सुनीता वर्मा', condition: 'Respiratory failure', severity: 'Critical', days: 3 }
					]
				},
				criticalPatients: {
					total: 15,
					newToday: 3,
					improved: 2,
					deteriorated: 1,
					criticalConditions: [
						{ condition: 'Cardiac Emergency', count: 4, color: '#dc2626' },
						{ condition: 'Respiratory Failure', count: 3, color: '#ea580c' },
						{ condition: 'Neurological Crisis', count: 2, color: '#7c3aed' },
						{ condition: 'Multi-organ Failure', count: 2, color: '#be123c' },
						{ condition: 'Severe Trauma', count: 2, color: '#0369a1' },
						{ condition: 'Post-surgical Complications', count: 2, color: '#059669' }
					],
					alertLevels: {
						red: 6,
						orange: 5,
						yellow: 4
					}
				}
			};

			dispatch({
				type: FETCH_HOSPITAL_METRICS_SUCCESS,
				payload: mockData
			});

		} catch (error) {
			dispatch({
				type: FETCH_HOSPITAL_METRICS_FAIL,
				payload: error.message
			});
		}
	};
};