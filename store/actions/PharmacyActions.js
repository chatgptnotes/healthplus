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
			const response = await fetch(`https://healthplus-2b9b0.firebaseio.com/pharmacy/inventory.json`);
			if (!response.ok) {
				throw new Error("Failed to fetch inventory");
			}

			const resData = await response.json();
			const loadedInventory = [];

			for (const key in resData) {
				loadedInventory.push({
					id: key,
					name: resData[key].name,
					category: resData[key].category,
					manufacturer: resData[key].manufacturer,
					batchNumber: resData[key].batchNumber,
					expiryDate: resData[key].expiryDate,
					quantity: resData[key].quantity,
					unitPrice: resData[key].unitPrice,
					reorderLevel: resData[key].reorderLevel,
					status: resData[key].status || 'Active'
				});
			}

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
		const token = getState().auth.token;

		try {
			const response = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/pharmacy/inventory.json?auth=${token}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...medicationData,
						createdAt: new Date().toISOString(),
						status: 'Active'
					})
				}
			);

			if (!response.ok) {
				throw new Error("Failed to add medication");
			}

			const resData = await response.json();

			dispatch({
				type: ADD_MEDICATION,
				medication: {
					id: resData.name,
					...medicationData,
					createdAt: new Date().toISOString(),
					status: 'Active'
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
		const token = getState().auth.token;

		try {
			const response = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/pharmacy/inventory/${medicationId}.json?auth=${token}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						quantity: newQuantity,
						lastUpdated: new Date().toISOString()
					})
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update stock");
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
			const response = await fetch(`https://healthplus-2b9b0.firebaseio.com/pharmacy/prescriptions.json`);
			if (!response.ok) {
				throw new Error("Failed to fetch prescriptions");
			}

			const resData = await response.json();
			const loadedPrescriptions = [];

			for (const key in resData) {
				loadedPrescriptions.push({
					id: key,
					patientName: resData[key].patientName,
					doctorName: resData[key].doctorName,
					medications: resData[key].medications,
					status: resData[key].status || 'Pending',
					prescriptionDate: resData[key].prescriptionDate,
					dispensedDate: resData[key].dispensedDate,
					totalAmount: resData[key].totalAmount
				});
			}

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
		const token = getState().auth.token;
		const userId = getState().auth.userId;

		try {
			const response = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/pharmacy/prescriptions/${prescriptionId}.json?auth=${token}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						status: 'Dispensed',
						dispensedDate: new Date().toISOString(),
						dispensedBy: userId,
						dispensedMedications,
						totalAmount
					})
				}
			);

			if (!response.ok) {
				throw new Error("Failed to process prescription");
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