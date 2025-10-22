import {
	UPDATE_OCCUPANCY_METRICS,
	UPDATE_SURGERY_METRICS,
	UPDATE_ICU_METRICS,
	UPDATE_CRITICAL_PATIENTS,
	FETCH_HOSPITAL_METRICS_START,
	FETCH_HOSPITAL_METRICS_SUCCESS,
	FETCH_HOSPITAL_METRICS_FAIL
} from '../actions/HospitalMetricsActions';

const initialState = {
	loading: false,
	error: null,
	occupancy: {
		totalBeds: 0,
		occupiedBeds: 0,
		availableBeds: 0,
		occupancyRate: 0,
		monthlyOccupancyRate: 0,
		dailyOccupancyTrend: [],
		departmentOccupancy: []
	},
	surgeries: {
		today: {
			scheduled: 0,
			completed: 0,
			ongoing: 0,
			cancelled: 0,
			pending: 0
		},
		yesterday: {
			scheduled: 0,
			completed: 0,
			cancelled: 0
		},
		monthly: {
			total: 0,
			completed: 0,
			cancelled: 0,
			successRate: 0,
			avgDuration: 0
		},
		surgeryTypes: []
	},
	icuMetrics: {
		totalICUBeds: 0,
		occupiedICUBeds: 0,
		availableICUBeds: 0,
		icuOccupancyRate: 0,
		ventilatorUsage: {
			total: 0,
			inUse: 0,
			available: 0
		},
		icuPatients: []
	},
	criticalPatients: {
		total: 0,
		newToday: 0,
		improved: 0,
		deteriorated: 0,
		criticalConditions: [],
		alertLevels: {
			red: 0,
			orange: 0,
			yellow: 0
		}
	}
};

const HospitalMetricsReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_HOSPITAL_METRICS_START:
			return {
				...state,
				loading: true,
				error: null
			};

		case FETCH_HOSPITAL_METRICS_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				occupancy: action.payload.occupancy,
				surgeries: action.payload.surgeries,
				icuMetrics: action.payload.icuMetrics,
				criticalPatients: action.payload.criticalPatients
			};

		case FETCH_HOSPITAL_METRICS_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload
			};

		case UPDATE_OCCUPANCY_METRICS:
			return {
				...state,
				occupancy: {
					...state.occupancy,
					...action.payload
				}
			};

		case UPDATE_SURGERY_METRICS:
			return {
				...state,
				surgeries: {
					...state.surgeries,
					...action.payload
				}
			};

		case UPDATE_ICU_METRICS:
			return {
				...state,
				icuMetrics: {
					...state.icuMetrics,
					...action.payload
				}
			};

		case UPDATE_CRITICAL_PATIENTS:
			return {
				...state,
				criticalPatients: {
					...state.criticalPatients,
					...action.payload
				}
			};

		default:
			return state;
	}
};

export default HospitalMetricsReducer;