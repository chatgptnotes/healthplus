import {
	FETCH_BILLS,
	CREATE_BILL,
	UPDATE_BILL_STATUS,
	PROCESS_PAYMENT,
	FETCH_INSURANCE_CLAIMS,
	SUBMIT_INSURANCE_CLAIM,
	UPDATE_CLAIM_STATUS,
	FETCH_PAYMENT_HISTORY,
	GENERATE_INVOICE,
	FETCH_INSURANCE_PROVIDERS,
	ADD_INSURANCE_PROVIDER
} from '../actions/BillingActions';

const initialState = {
	bills: [],
	insuranceClaims: [],
	paymentHistory: [],
	insuranceProviders: [],
	isLoading: false,
	error: null
};

const BillingReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_BILLS:
			return {
				...state,
				bills: action.bills,
				isLoading: false
			};

		case CREATE_BILL:
			return {
				...state,
				bills: state.bills.concat(action.bill)
			};

		case UPDATE_BILL_STATUS:
			const updatedBills = state.bills.map(bill =>
				bill.id === action.billId
					? { ...bill, status: action.newStatus, ...action.updateData }
					: bill
			);
			return {
				...state,
				bills: updatedBills
			};

		case PROCESS_PAYMENT:
			const billsAfterPayment = state.bills.map(bill =>
				bill.id === action.billId
					? { ...bill, ...action.paymentData }
					: bill
			);
			return {
				...state,
				bills: billsAfterPayment
			};

		case FETCH_INSURANCE_CLAIMS:
			return {
				...state,
				insuranceClaims: action.claims,
				isLoading: false
			};

		case SUBMIT_INSURANCE_CLAIM:
			return {
				...state,
				insuranceClaims: state.insuranceClaims.concat(action.claim)
			};

		case UPDATE_CLAIM_STATUS:
			const updatedClaims = state.insuranceClaims.map(claim =>
				claim.id === action.claimId
					? { ...claim, status: action.newStatus, ...action.updateData }
					: claim
			);
			return {
				...state,
				insuranceClaims: updatedClaims
			};

		case FETCH_PAYMENT_HISTORY:
			return {
				...state,
				paymentHistory: action.paymentHistory,
				isLoading: false
			};

		case FETCH_INSURANCE_PROVIDERS:
			return {
				...state,
				insuranceProviders: action.insuranceProviders,
				isLoading: false
			};

		case ADD_INSURANCE_PROVIDER:
			return {
				...state,
				insuranceProviders: state.insuranceProviders.concat(action.provider)
			};

		default:
			return state;
	}
};

export default BillingReducer;