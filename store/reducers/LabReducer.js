import {
	FETCH_TEST_ORDERS,
	CREATE_TEST_ORDER,
	UPDATE_TEST_STATUS,
	SUBMIT_TEST_RESULTS,
	FETCH_TEST_TEMPLATES,
	ADD_TEST_TEMPLATE,
	FETCH_EQUIPMENT_STATUS,
	UPDATE_EQUIPMENT_STATUS,
	FETCH_SAMPLE_TRACKING,
	UPDATE_SAMPLE_STATUS
} from '../actions/LabActions';

const initialState = {
	testOrders: [],
	testTemplates: [],
	equipment: [],
	samples: [],
	isLoading: false,
	error: null
};

const LabReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_TEST_ORDERS:
			return {
				...state,
				testOrders: action.testOrders,
				isLoading: false
			};

		case CREATE_TEST_ORDER:
			return {
				...state,
				testOrders: state.testOrders.concat(action.testOrder)
			};

		case UPDATE_TEST_STATUS:
			const updatedTestOrders = state.testOrders.map(order =>
				order.id === action.testOrderId
					? { ...order, status: action.newStatus, ...action.updateData }
					: order
			);
			return {
				...state,
				testOrders: updatedTestOrders
			};

		case SUBMIT_TEST_RESULTS:
			const completedTestOrders = state.testOrders.map(order =>
				order.id === action.testOrderId
					? {
						...order,
						status: 'Completed',
						results: action.results,
						resultsDate: action.resultsDate,
						completedBy: action.completedBy,
						reportFile: action.reportFile
					}
					: order
			);
			return {
				...state,
				testOrders: completedTestOrders
			};

		case FETCH_TEST_TEMPLATES:
			return {
				...state,
				testTemplates: action.testTemplates,
				isLoading: false
			};

		case ADD_TEST_TEMPLATE:
			return {
				...state,
				testTemplates: state.testTemplates.concat(action.template)
			};

		case FETCH_EQUIPMENT_STATUS:
			return {
				...state,
				equipment: action.equipment,
				isLoading: false
			};

		case UPDATE_EQUIPMENT_STATUS:
			const updatedEquipment = state.equipment.map(equipment =>
				equipment.id === action.equipmentId
					? { ...equipment, status: action.newStatus, lastUpdated: action.timestamp }
					: equipment
			);
			return {
				...state,
				equipment: updatedEquipment
			};

		case FETCH_SAMPLE_TRACKING:
			return {
				...state,
				samples: action.samples,
				isLoading: false
			};

		case UPDATE_SAMPLE_STATUS:
			const updatedSamples = state.samples.map(sample =>
				sample.id === action.sampleId
					? {
						...sample,
						status: action.newStatus,
						currentLocation: action.location || sample.currentLocation,
						lastUpdated: action.timestamp,
						updatedBy: action.updatedBy
					}
					: sample
			);
			return {
				...state,
				samples: updatedSamples
			};

		default:
			return state;
	}
};

export default LabReducer;