import { supabase } from '../../lib/supabase';

// Pharmacy Action Types
export const FETCH_INVENTORY = "FETCH_INVENTORY";
export const ADD_MEDICATION = "ADD_MEDICATION";
export const UPDATE_STOCK = "UPDATE_STOCK";
export const PROCESS_PRESCRIPTION = "PROCESS_PRESCRIPTION";
export const FETCH_PRESCRIPTIONS = "FETCH_PRESCRIPTIONS";
export const FETCH_LOW_STOCK_ALERTS = "FETCH_LOW_STOCK_ALERTS";
export const ADD_SUPPLIER = "ADD_SUPPLIER";
export const FETCH_SUPPLIERS = "FETCH_SUPPLIERS";

// Fetch Inventory
export const FetchInventory = () => {
	return async (dispatch, getState) => {
		try {
			const { data, error } = await supabase
				.from('pharmacy_inventory')
				.select('*');

			if (error) {
				throw new Error(`Failed to fetch inventory: ${error.message}`);
			}

			const loadedInventory = data.map(item => ({
				id: item.id,
				name: item.name,
				category: item.category,
				manufacturer: item.manufacturer,
				batchNumber: item.batch_number,
				expiryDate: item.expiry_date,
				quantity: item.quantity,
				unitPrice: item.unit_price,
				reorderLevel: item.reorder_level,
				status: item.status || 'Active'
			}));

			dispatch({
				type: FETCH_INVENTORY,
				inventory: loadedInventory
			});
		} catch (err) {
			throw err;
		}
	};
};

// Add New Medication
export const AddMedication = (medicationData) => {
	return async (dispatch, getState) => {
		try {
			const { data, error } = await supabase
				.from('pharmacy_inventory')
				.insert({
					name: medicationData.name,
					category: medicationData.category,
					manufacturer: medicationData.manufacturer,
					batch_number: medicationData.batchNumber,
					expiry_date: medicationData.expiryDate,
					quantity: medicationData.quantity,
					unit_price: medicationData.unitPrice,
					reorder_level: medicationData.reorderLevel,
					status: 'Active',
					created_at: new Date().toISOString()
				})
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to add medication: ${error.message}`);
			}

			dispatch({
				type: ADD_MEDICATION,
				medication: {
					id: data.id,
					name: data.name,
					category: data.category,
					manufacturer: data.manufacturer,
					batchNumber: data.batch_number,
					expiryDate: data.expiry_date,
					quantity: data.quantity,
					unitPrice: data.unit_price,
					reorderLevel: data.reorder_level,
					status: data.status,
					createdAt: data.created_at
				}
			});
		} catch (err) {
			throw err;
		}
	};
};

// Update Stock
export const UpdateStock = (medicationId, newQuantity, transactionType) => {
	return async (dispatch, getState) => {
		try {
			const { data, error } = await supabase
				.from('pharmacy_inventory')
				.update({
					quantity: newQuantity,
					updated_at: new Date().toISOString()
				})
				.eq('id', medicationId)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to update stock: ${error.message}`);
			}

			dispatch({
				type: UPDATE_STOCK,
				medicationId,
				newQuantity,
				transactionType,
				timestamp: new Date().toISOString()
			});
		} catch (err) {
			throw err;
		}
	};
};

// Fetch Prescriptions
export const FetchPrescriptions = () => {
	return async (dispatch, getState) => {
		try {
			const { data, error } = await supabase
				.from('pharmacy_prescriptions')
				.select('*');

			if (error) {
				throw new Error(`Failed to fetch prescriptions: ${error.message}`);
			}

			const loadedPrescriptions = data.map(item => ({
				id: item.id,
				patientName: item.patient_name,
				doctorName: item.doctor_name,
				medications: item.medications,
				status: item.status || 'Pending',
				prescriptionDate: item.prescription_date,
				dispensedDate: item.dispensed_date,
				totalAmount: item.total_amount
			}));

			dispatch({
				type: FETCH_PRESCRIPTIONS,
				prescriptions: loadedPrescriptions
			});
		} catch (err) {
			throw err;
		}
	};
};

// Process Prescription
export const ProcessPrescription = (prescriptionId, dispensedMedications, totalAmount) => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;

		try {
			const { data, error } = await supabase
				.from('pharmacy_prescriptions')
				.update({
					status: 'Dispensed',
					dispensed_date: new Date().toISOString(),
					dispensed_by: userId,
					dispensed_medications: dispensedMedications,
					total_amount: totalAmount,
					updated_at: new Date().toISOString()
				})
				.eq('id', prescriptionId)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to process prescription: ${error.message}`);
			}

			dispatch({
				type: PROCESS_PRESCRIPTION,
				prescriptionId,
				dispensedMedications,
				totalAmount,
				dispensedBy: userId,
				dispensedDate: new Date().toISOString()
			});
		} catch (err) {
			throw err;
		}
	};
};