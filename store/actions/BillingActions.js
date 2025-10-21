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
			const response = await fetch(`https://healthplus-2b9b0.firebaseio.com/billing/bills.json`);
			if (!response.ok) {
				throw new Error("Failed to fetch bills");
			}

			const resData = await response.json();
			const loadedBills = [];

			for (const key in resData) {
				loadedBills.push({
					id: key,
					patientId: resData[key].patientId,
					patientName: resData[key].patientName,
					services: resData[key].services,
					totalAmount: resData[key].totalAmount,
					paidAmount: resData[key].paidAmount || 0,
					pendingAmount: resData[key].pendingAmount || resData[key].totalAmount,
					status: resData[key].status || 'Pending',
					billDate: resData[key].billDate,
					dueDate: resData[key].dueDate,
					paymentMethod: resData[key].paymentMethod,
					insuranceDetails: resData[key].insuranceDetails,
					department: resData[key].department,
					doctorId: resData[key].doctorId,
					discountApplied: resData[key].discountApplied || 0
				});
			}

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
		const token = getState().auth.token;
		const userId = getState().auth.userId;

		try {
			const response = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/billing/bills.json?auth=${token}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...billData,
						billDate: new Date().toISOString(),
						status: 'Pending',
						createdBy: userId,
						pendingAmount: billData.totalAmount
					})
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create bill");
			}

			const resData = await response.json();

			dispatch({
				type: CREATE_BILL,
				bill: {
					id: resData.name,
					...billData,
					billDate: new Date().toISOString(),
					status: 'Pending',
					createdBy: userId,
					pendingAmount: billData.totalAmount,
					paidAmount: 0
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
		const token = getState().auth.token;
		const userId = getState().auth.userId;

		try {
			const { amount, paymentMethod, transactionId, insuranceClaimId } = paymentData;

			const updateData = {
				paidAmount: paymentData.paidAmount,
				pendingAmount: paymentData.pendingAmount,
				status: paymentData.pendingAmount <= 0 ? 'Paid' : 'Partially Paid',
				lastPaymentDate: new Date().toISOString(),
				paymentMethod: paymentMethod,
				transactionId: transactionId,
				processedBy: userId
			};

			const response = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/billing/bills/${billId}.json?auth=${token}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updateData)
				}
			);

			if (!response.ok) {
				throw new Error("Failed to process payment");
			}

			// Also create payment history record
			const paymentHistoryResponse = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/billing/paymentHistory.json?auth=${token}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						billId: billId,
						amount: amount,
						paymentMethod: paymentMethod,
						transactionId: transactionId,
						paymentDate: new Date().toISOString(),
						processedBy: userId,
						insuranceClaimId: insuranceClaimId
					})
				}
			);

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
		const token = getState().auth.token;
		const userId = getState().auth.userId;

		try {
			const response = await fetch(
				`https://healthplus-2b9b0.firebaseio.com/billing/insuranceClaims.json?auth=${token}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...claimData,
						submissionDate: new Date().toISOString(),
						status: 'Submitted',
						submittedBy: userId
					})
				}
			);

			if (!response.ok) {
				throw new Error("Failed to submit insurance claim");
			}

			const resData = await response.json();

			dispatch({
				type: SUBMIT_INSURANCE_CLAIM,
				claim: {
					id: resData.name,
					...claimData,
					submissionDate: new Date().toISOString(),
					status: 'Submitted',
					submittedBy: userId
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
			const response = await fetch(`https://healthplus-2b9b0.firebaseio.com/billing/insuranceClaims.json`);
			if (!response.ok) {
				throw new Error("Failed to fetch insurance claims");
			}

			const resData = await response.json();
			const loadedClaims = [];

			for (const key in resData) {
				loadedClaims.push({
					id: key,
					patientId: resData[key].patientId,
					patientName: resData[key].patientName,
					billId: resData[key].billId,
					insuranceProvider: resData[key].insuranceProvider,
					policyNumber: resData[key].policyNumber,
					claimAmount: resData[key].claimAmount,
					approvedAmount: resData[key].approvedAmount || 0,
					status: resData[key].status,
					submissionDate: resData[key].submissionDate,
					processingDate: resData[key].processingDate,
					approvalDate: resData[key].approvalDate,
					rejectionReason: resData[key].rejectionReason,
					submittedBy: resData[key].submittedBy
				});
			}

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
				`https://healthplus-2b9b0.firebaseio.com/billing/insuranceClaims/${claimId}.json?auth=${token}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updateData)
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update claim status");
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
			const response = await fetch(`https://healthplus-2b9b0.firebaseio.com/billing/paymentHistory.json`);
			if (!response.ok) {
				throw new Error("Failed to fetch payment history");
			}

			const resData = await response.json();
			const loadedPayments = [];

			for (const key in resData) {
				loadedPayments.push({
					id: key,
					billId: resData[key].billId,
					amount: resData[key].amount,
					paymentMethod: resData[key].paymentMethod,
					transactionId: resData[key].transactionId,
					paymentDate: resData[key].paymentDate,
					processedBy: resData[key].processedBy,
					insuranceClaimId: resData[key].insuranceClaimId
				});
			}

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
			const response = await fetch(`https://healthplus-2b9b0.firebaseio.com/billing/insuranceProviders.json`);
			if (!response.ok) {
				throw new Error("Failed to fetch insurance providers");
			}

			const resData = await response.json();
			const loadedProviders = [];

			for (const key in resData) {
				loadedProviders.push({
					id: key,
					name: resData[key].name,
					type: resData[key].type, // CGHS, ECHS, Railways, TPA, etc.
					contactPerson: resData[key].contactPerson,
					contactPhone: resData[key].contactPhone,
					contactEmail: resData[key].contactEmail,
					address: resData[key].address,
					panelHospital: resData[key].panelHospital || true,
					cashlessEnabled: resData[key].cashlessEnabled || true,
					claimProcessingTime: resData[key].claimProcessingTime,
					maxCashlessLimit: resData[key].maxCashlessLimit,
					status: resData[key].status || 'Active'
				});
			}

			dispatch({
				type: FETCH_INSURANCE_PROVIDERS,
				insuranceProviders: loadedProviders
			});
		} catch (err) {
			throw err;
		}
	};
};