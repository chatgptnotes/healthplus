import {
	FETCH_INVENTORY,
	ADD_MEDICATION,
	UPDATE_STOCK,
	PROCESS_PRESCRIPTION,
	FETCH_PRESCRIPTIONS,
	FETCH_LOW_STOCK_ALERTS,
	ADD_SUPPLIER,
	FETCH_SUPPLIERS
} from '../actions/PharmacyActions';

const initialState = {
	inventory: [],
	prescriptions: [],
	lowStockAlerts: [],
	suppliers: [],
	isLoading: false,
	error: null
};

const PharmacyReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_INVENTORY:
			return {
				...state,
				inventory: action.inventory,
				isLoading: false
			};

		case ADD_MEDICATION:
			return {
				...state,
				inventory: state.inventory.concat(action.medication)
			};

		case UPDATE_STOCK:
			const updatedInventory = state.inventory.map(item =>
				item.id === action.medicationId
					? { ...item, quantity: action.newQuantity, lastUpdated: action.timestamp }
					: item
			);
			return {
				...state,
				inventory: updatedInventory
			};

		case FETCH_PRESCRIPTIONS:
			return {
				...state,
				prescriptions: action.prescriptions,
				isLoading: false
			};

		case PROCESS_PRESCRIPTION:
			const updatedPrescriptions = state.prescriptions.map(prescription =>
				prescription.id === action.prescriptionId
					? {
						...prescription,
						status: 'Dispensed',
						dispensedDate: action.dispensedDate,
						dispensedBy: action.dispensedBy,
						totalAmount: action.totalAmount
					}
					: prescription
			);
			return {
				...state,
				prescriptions: updatedPrescriptions
			};

		case FETCH_LOW_STOCK_ALERTS:
			return {
				...state,
				lowStockAlerts: action.alerts
			};

		case FETCH_SUPPLIERS:
			return {
				...state,
				suppliers: action.suppliers
			};

		case ADD_SUPPLIER:
			return {
				...state,
				suppliers: state.suppliers.concat(action.supplier)
			};

		default:
			return state;
	}
};

export default PharmacyReducer;