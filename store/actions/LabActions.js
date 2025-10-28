import { supabase } from '../../lib/supabase';

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
			const { data, error } = await supabase
				.from('lab_test_orders')
				.select('*');

			if (error) {
				throw new Error(`Failed to fetch test orders: ${error.message}`);
			}

			const loadedTestOrders = data.map(item => ({
				id: item.id,
				patientId: item.patient_id,
				patientName: item.patient_name,
				doctorId: item.doctor_id,
				doctorName: item.doctor_name,
				tests: item.tests,
				status: item.status || 'Pending',
				orderDate: item.order_date,
				sampleCollectedDate: item.sample_collected_date,
				resultsDate: item.results_date,
				priority: item.priority || 'Normal',
				department: item.department,
				totalAmount: item.total_amount
			}));

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
		const userId = getState().auth.userId;

		try {
			const { data, error } = await supabase
				.from('lab_test_orders')
				.insert({
					patient_id: orderData.patientId,
					patient_name: orderData.patientName,
					doctor_id: orderData.doctorId,
					doctor_name: orderData.doctorName,
					tests: orderData.tests,
					department: orderData.department,
					total_amount: orderData.totalAmount,
					priority: orderData.priority || 'Normal',
					order_date: new Date().toISOString(),
					status: 'Pending',
					ordered_by: userId,
					created_at: new Date().toISOString()
				})
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to create test order: ${error.message}`);
			}

			dispatch({
				type: CREATE_TEST_ORDER,
				testOrder: {
					id: data.id,
					patientId: data.patient_id,
					patientName: data.patient_name,
					doctorId: data.doctor_id,
					doctorName: data.doctor_name,
					tests: data.tests,
					department: data.department,
					totalAmount: data.total_amount,
					priority: data.priority,
					orderDate: data.order_date,
					status: data.status,
					orderedBy: data.ordered_by
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
		const userId = getState().auth.userId;

		try {
			// Convert camelCase to snake_case for additional data
			const convertedAdditionalData = {};
			for (const [key, value] of Object.entries(additionalData)) {
				const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
				convertedAdditionalData[snakeKey] = value;
			}

			const updateData = {
				status: newStatus,
				updated_at: new Date().toISOString(),
				updated_by: userId,
				...convertedAdditionalData
			};

			const { data, error } = await supabase
				.from('lab_test_orders')
				.update(updateData)
				.eq('id', testOrderId)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to update test status: ${error.message}`);
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
		const userId = getState().auth.userId;

		try {
			const updateData = {
				status: 'Completed',
				results: results,
				results_date: new Date().toISOString(),
				completed_by: userId,
				report_file: reportFile,
				updated_at: new Date().toISOString()
			};

			const { data, error } = await supabase
				.from('lab_test_orders')
				.update(updateData)
				.eq('id', testOrderId)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to submit test results: ${error.message}`);
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
			const { data, error } = await supabase
				.from('lab_test_templates')
				.select('*');

			if (error) {
				throw new Error(`Failed to fetch test templates: ${error.message}`);
			}

			const loadedTemplates = data.map(item => ({
				id: item.id,
				name: item.name,
				category: item.category,
				parameters: item.parameters,
				normalRanges: item.normal_ranges,
				units: item.units,
				preparationInstructions: item.preparation_instructions,
				cost: item.cost,
				duration: item.duration,
				department: item.department
			}));

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
			const { data, error } = await supabase
				.from('lab_equipment')
				.select('*');

			if (error) {
				throw new Error(`Failed to fetch equipment status: ${error.message}`);
			}

			const loadedEquipment = data.map(item => ({
				id: item.id,
				name: item.name,
				type: item.type,
				status: item.status,
				lastMaintenance: item.last_maintenance,
				nextMaintenance: item.next_maintenance,
				calibrationDate: item.calibration_date,
				location: item.location,
				assignedTechnician: item.assigned_technician
			}));

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
		const userId = getState().auth.userId;

		try {
			const updateData = {
				status: newStatus,
				updated_at: new Date().toISOString(),
				updated_by: userId
			};

			if (location) {
				updateData.current_location = location;
			}

			const { data, error } = await supabase
				.from('lab_samples')
				.update(updateData)
				.eq('id', sampleId)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to update sample status: ${error.message}`);
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