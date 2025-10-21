// Lab Action Types
export const FETCH_TEST_ORDERS = "FETCH_TEST_ORDERS";
export const CREATE_TEST_ORDER = "CREATE_TEST_ORDER";
export const UPDATE_TEST_STATUS = "UPDATE_TEST_STATUS";
export const SUBMIT_TEST_RESULTS = "SUBMIT_TEST_RESULTS";
export const FETCH_TEST_TEMPLATES = "FETCH_TEST_TEMPLATES";
export const ADD_TEST_TEMPLATE = "ADD_TEST_TEMPLATE";
export const FETCH_EQUIPMENT_STATUS = "FETCH_EQUIPMENT_STATUS";
export const UPDATE_EQUIPMENT_STATUS = "UPDATE_EQUIPMENT_STATUS";
export const FETCH_SAMPLE_TRACKING = "FETCH_SAMPLE_TRACKING";
export const UPDATE_SAMPLE_STATUS = "UPDATE_SAMPLE_STATUS";

// Fetch Test Orders
export const FetchTestOrders = () => {
	return async (dispatch, getState) => {
		try {
			const response = await fetch(`https://healthplus-2b9b0.firebaseio.com/lab/testOrders.json`);
			if (!response.ok) {
				throw new Error("Failed to fetch test orders");
			}

			const resData = await response.json();
			const loadedTestOrders = [];

			for (const key in resData) {
				loadedTestOrders.push({
					id: key,
					patientId: resData[key].patientId,
					patientName: resData[key].patientName,
					doctorId: resData[key].doctorId,
					doctorName: resData[key].doctorName,
					tests: resData[key].tests,
					status: resData[key].status || 'Pending',
					orderDate: resData[key].orderDate,
					sampleCollectedDate: resData[key].sampleCollectedDate,
					resultsDate: resData[key].resultsDate,
					priority: resData[key].priority || 'Normal',
					department: resData[key].department,
					totalAmount: resData[key].totalAmount
				});
			}

			dispatch({
				type: FETCH_TEST_ORDERS,
				testOrders: loadedTestOrders
			});
		} catch (err) {
			throw err;
		}
	};
};

// Create Test Order
export const CreateTestOrder = (orderData) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const userId = getState().auth.userId;

		try {
			const response = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/lab/testOrders.json?auth=${token}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...orderData,
						orderDate: new Date().toISOString(),
						status: 'Pending',
						orderedBy: userId
					})
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create test order");
			}

			const resData = await response.json();

			dispatch({
				type: CREATE_TEST_ORDER,
				testOrder: {
					id: resData.name,
					...orderData,
					orderDate: new Date().toISOString(),
					status: 'Pending',
					orderedBy: userId
				}
			});
		} catch (err) {
			throw err;
		}
	};
};

// Update Test Status
export const UpdateTestStatus = (testOrderId, newStatus, additionalData = {}) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const userId = getState().auth.userId;

		try {
			const updateData = {
				status: newStatus,
				lastUpdated: new Date().toISOString(),
				updatedBy: userId,
				...additionalData
			};

			const response = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/lab/testOrders/${testOrderId}.json?auth=${token}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updateData)
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update test status");
			}

			dispatch({
				type: UPDATE_TEST_STATUS,
				testOrderId,
				newStatus,
				updateData,
				timestamp: new Date().toISOString()
			});
		} catch (err) {
			throw err;
		}
	};
};

// Submit Test Results
export const SubmitTestResults = (testOrderId, results, reportFile = null) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const userId = getState().auth.userId;

		try {
			const updateData = {
				status: 'Completed',
				results: results,
				resultsDate: new Date().toISOString(),
				completedBy: userId,
				reportFile: reportFile
			};

			const response = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/lab/testOrders/${testOrderId}.json?auth=${token}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updateData)
				}
			);

			if (!response.ok) {
				throw new Error("Failed to submit test results");
			}

			dispatch({
				type: SUBMIT_TEST_RESULTS,
				testOrderId,
				results,
				reportFile,
				completedBy: userId,
				resultsDate: new Date().toISOString()
			});
		} catch (err) {
			throw err;
		}
	};
};

// Fetch Test Templates
export const FetchTestTemplates = () => {
	return async (dispatch, getState) => {
		try {
			const response = await fetch(`https://healthplus-2b9b0.firebaseio.com/lab/testTemplates.json`);
			if (!response.ok) {
				throw new Error("Failed to fetch test templates");
			}

			const resData = await response.json();
			const loadedTemplates = [];

			for (const key in resData) {
				loadedTemplates.push({
					id: key,
					name: resData[key].name,
					category: resData[key].category,
					parameters: resData[key].parameters,
					normalRanges: resData[key].normalRanges,
					units: resData[key].units,
					preparationInstructions: resData[key].preparationInstructions,
					cost: resData[key].cost,
					duration: resData[key].duration,
					department: resData[key].department
				});
			}

			dispatch({
				type: FETCH_TEST_TEMPLATES,
				testTemplates: loadedTemplates
			});
		} catch (err) {
			throw err;
		}
	};
};

// Fetch Equipment Status
export const FetchEquipmentStatus = () => {
	return async (dispatch, getState) => {
		try {
			const response = await fetch(`https://healthplus-2b9b0.firebaseio.com/lab/equipment.json`);
			if (!response.ok) {
				throw new Error("Failed to fetch equipment status");
			}

			const resData = await response.json();
			const loadedEquipment = [];

			for (const key in resData) {
				loadedEquipment.push({
					id: key,
					name: resData[key].name,
					type: resData[key].type,
					status: resData[key].status,
					lastMaintenance: resData[key].lastMaintenance,
					nextMaintenance: resData[key].nextMaintenance,
					calibrationDate: resData[key].calibrationDate,
					location: resData[key].location,
					assignedTechnician: resData[key].assignedTechnician
				});
			}

			dispatch({
				type: FETCH_EQUIPMENT_STATUS,
				equipment: loadedEquipment
			});
		} catch (err) {
			throw err;
		}
	};
};

// Update Sample Status
export const UpdateSampleStatus = (sampleId, newStatus, location = null) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const userId = getState().auth.userId;

		try {
			const updateData = {
				status: newStatus,
				lastUpdated: new Date().toISOString(),
				updatedBy: userId
			};

			if (location) {
				updateData.currentLocation = location;
			}

			const response = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/lab/samples/${sampleId}.json?auth=${token}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updateData)
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update sample status");
			}

			dispatch({
				type: UPDATE_SAMPLE_STATUS,
				sampleId,
				newStatus,
				location,
				timestamp: new Date().toISOString(),
				updatedBy: userId
			});
		} catch (err) {
			throw err;
		}
	};
};