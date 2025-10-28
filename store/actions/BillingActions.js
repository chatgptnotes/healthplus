import { supabase } from '../../lib/supabase';

// Billing Action Types
export const FETCH_BILLS = "FETCH_BILLS";
export const CREATE_BILL = "CREATE_BILL";
export const UPDATE_BILL_STATUS = "UPDATE_BILL_STATUS";
export const PROCESS_PAYMENT = "PROCESS_PAYMENT";
export const FETCH_INSURANCE_CLAIMS = "FETCH_INSURANCE_CLAIMS";
export const SUBMIT_INSURANCE_CLAIM = "SUBMIT_INSURANCE_CLAIM";
export const UPDATE_CLAIM_STATUS = "UPDATE_CLAIM_STATUS";
export const FETCH_PAYMENT_HISTORY = "FETCH_PAYMENT_HISTORY";
export const GENERATE_INVOICE = "GENERATE_INVOICE";
export const FETCH_INSURANCE_PROVIDERS = "FETCH_INSURANCE_PROVIDERS";
export const ADD_INSURANCE_PROVIDER = "ADD_INSURANCE_PROVIDER";

// Fetch Bills
export const FetchBills = () => {
	return async (dispatch, getState) => {
		try {
			const { data, error } = await supabase
				.from('billing_bills')
				.select('*');

			if (error) {
				throw new Error(`Failed to fetch bills: ${error.message}`);
			}

			const loadedBills = data.map(item => ({
				id: item.id,
				patientId: item.patient_id,
				patientName: item.patient_name,
				services: item.services,
				totalAmount: item.total_amount,
				paidAmount: item.paid_amount || 0,
				pendingAmount: item.pending_amount || item.total_amount,
				status: item.status || 'Pending',
				billDate: item.bill_date,
				dueDate: item.due_date,
				paymentMethod: item.payment_method,
				insuranceDetails: item.insurance_details,
				department: item.department,
				doctorId: item.doctor_id,
				discountApplied: item.discount_applied || 0
			}));

			dispatch({
				type: FETCH_BILLS,
				bills: loadedBills
			});
		} catch (err) {
			throw err;
		}
	};
};

// Create Bill
export const CreateBill = (billData) => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;

		try {
			const { data, error } = await supabase
				.from('billing_bills')
				.insert({
					patient_id: billData.patientId,
					patient_name: billData.patientName,
					services: billData.services,
					total_amount: billData.totalAmount,
					due_date: billData.dueDate,
					insurance_details: billData.insuranceDetails,
					department: billData.department,
					doctor_id: billData.doctorId,
					discount_applied: billData.discountApplied || 0,
					bill_date: new Date().toISOString(),
					status: 'Pending',
					created_by: userId,
					pending_amount: billData.totalAmount,
					paid_amount: 0,
					created_at: new Date().toISOString()
				})
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to create bill: ${error.message}`);
			}

			dispatch({
				type: CREATE_BILL,
				bill: {
					id: data.id,
					patientId: data.patient_id,
					patientName: data.patient_name,
					services: data.services,
					totalAmount: data.total_amount,
					dueDate: data.due_date,
					insuranceDetails: data.insurance_details,
					department: data.department,
					doctorId: data.doctor_id,
					discountApplied: data.discount_applied,
					billDate: data.bill_date,
					status: data.status,
					createdBy: data.created_by,
					pendingAmount: data.pending_amount,
					paidAmount: data.paid_amount
				}
			});
		} catch (err) {
			throw err;
		}
	};
};

// Process Payment
export const ProcessPayment = (billId, paymentData) => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;

		try {
			const { amount, paymentMethod, transactionId, insuranceClaimId } = paymentData;

			const updateData = {
				paid_amount: paymentData.paidAmount,
				pending_amount: paymentData.pendingAmount,
				status: paymentData.pendingAmount <= 0 ? 'Paid' : 'Partially Paid',
				last_payment_date: new Date().toISOString(),
				payment_method: paymentMethod,
				transaction_id: transactionId,
				processed_by: userId,
				updated_at: new Date().toISOString()
			};

			const { data: billData, error: billError } = await supabase
				.from('billing_bills')
				.update(updateData)
				.eq('id', billId)
				.select()
				.single();

			if (billError) {
				throw new Error(`Failed to process payment: ${billError.message}`);
			}

			// Also create payment history record
			const { data: historyData, error: historyError } = await supabase
				.from('billing_payment_history')
				.insert({
					bill_id: billId,
					amount: amount,
					payment_method: paymentMethod,
					transaction_id: transactionId,
					payment_date: new Date().toISOString(),
					processed_by: userId,
					insurance_claim_id: insuranceClaimId,
					created_at: new Date().toISOString()
				})
				.select()
				.single();

			if (historyError) {
				console.warn('Failed to create payment history record:', historyError.message);
			}

			dispatch({
				type: PROCESS_PAYMENT,
				billId,
				paymentData: updateData,
				timestamp: new Date().toISOString()
			});
		} catch (err) {
			throw err;
		}
	};
};

// Submit Insurance Claim
export const SubmitInsuranceClaim = (claimData) => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;

		try {
			const { data, error } = await supabase
				.from('billing_insurance_claims')
				.insert({
					patient_id: claimData.patientId,
					patient_name: claimData.patientName,
					bill_id: claimData.billId,
					insurance_provider: claimData.insuranceProvider,
					policy_number: claimData.policyNumber,
					claim_amount: claimData.claimAmount,
					submission_date: new Date().toISOString(),
					status: 'Submitted',
					submitted_by: userId,
					created_at: new Date().toISOString()
				})
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to submit insurance claim: ${error.message}`);
			}

			dispatch({
				type: SUBMIT_INSURANCE_CLAIM,
				claim: {
					id: data.id,
					patientId: data.patient_id,
					patientName: data.patient_name,
					billId: data.bill_id,
					insuranceProvider: data.insurance_provider,
					policyNumber: data.policy_number,
					claimAmount: data.claim_amount,
					submissionDate: data.submission_date,
					status: data.status,
					submittedBy: data.submitted_by
				}
			});
		} catch (err) {
			throw err;
		}
	};
};

// Fetch Insurance Claims
export const FetchInsuranceClaims = () => {
	return async (dispatch, getState) => {
		try {
			const { data, error } = await supabase
				.from('billing_insurance_claims')
				.select('*');

			if (error) {
				throw new Error(`Failed to fetch insurance claims: ${error.message}`);
			}

			const loadedClaims = data.map(item => ({
				id: item.id,
				patientId: item.patient_id,
				patientName: item.patient_name,
				billId: item.bill_id,
				insuranceProvider: item.insurance_provider,
				policyNumber: item.policy_number,
				claimAmount: item.claim_amount,
				approvedAmount: item.approved_amount || 0,
				status: item.status,
				submissionDate: item.submission_date,
				processingDate: item.processing_date,
				approvalDate: item.approval_date,
				rejectionReason: item.rejection_reason,
				submittedBy: item.submitted_by
			}));

			dispatch({
				type: FETCH_INSURANCE_CLAIMS,
				claims: loadedClaims
			});
		} catch (err) {
			throw err;
		}
	};
};

// Update Claim Status
export const UpdateClaimStatus = (claimId, newStatus, additionalData = {}) => {
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
				.from('billing_insurance_claims')
				.update(updateData)
				.eq('id', claimId)
				.select()
				.single();

			if (error) {
				throw new Error(`Failed to update claim status: ${error.message}`);
			}

			dispatch({
				type: UPDATE_CLAIM_STATUS,
				claimId,
				newStatus,
				updateData,
				timestamp: new Date().toISOString()
			});
		} catch (err) {
			throw err;
		}
	};
};

// Fetch Payment History
export const FetchPaymentHistory = () => {
	return async (dispatch, getState) => {
		try {
			const { data, error } = await supabase
				.from('billing_payment_history')
				.select('*');

			if (error) {
				throw new Error(`Failed to fetch payment history: ${error.message}`);
			}

			const loadedPayments = data.map(item => ({
				id: item.id,
				billId: item.bill_id,
				amount: item.amount,
				paymentMethod: item.payment_method,
				transactionId: item.transaction_id,
				paymentDate: item.payment_date,
				processedBy: item.processed_by,
				insuranceClaimId: item.insurance_claim_id
			}));

			dispatch({
				type: FETCH_PAYMENT_HISTORY,
				paymentHistory: loadedPayments
			});
		} catch (err) {
			throw err;
		}
	};
};

// Fetch Insurance Providers
export const FetchInsuranceProviders = () => {
	return async (dispatch, getState) => {
		try {
			const { data, error } = await supabase
				.from('billing_insurance_providers')
				.select('*');

			if (error) {
				throw new Error(`Failed to fetch insurance providers: ${error.message}`);
			}

			const loadedProviders = data.map(item => ({
				id: item.id,
				name: item.name,
				type: item.type, // CGHS, ECHS, Railways, TPA, etc.
				contactPerson: item.contact_person,
				contactPhone: item.contact_phone,
				contactEmail: item.contact_email,
				address: item.address,
				panelHospital: item.panel_hospital || true,
				cashlessEnabled: item.cashless_enabled || true,
				claimProcessingTime: item.claim_processing_time,
				maxCashlessLimit: item.max_cashless_limit,
				status: item.status || 'Active'
			}));

			dispatch({
				type: FETCH_INSURANCE_PROVIDERS,
				insuranceProviders: loadedProviders
			});
		} catch (err) {
			throw err;
		}
	};
};