import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	SafeAreaView,
	Picker,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const PaymentProcessing = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	// Get bill data from navigation params
	const { billData, services, total, coverage, patientAmount } = props.route?.params || {
		total: 5000,
		coverage: 4000,
		patientAmount: 1000
	};

	const [paymentData, setPaymentData] = useState({
		paymentMethod: 'Cash',
		cardNumber: '',
		cardHolderName: '',
		expiryMonth: '',
		expiryYear: '',
		cvv: '',
		upiId: '',
		bankName: '',
		transactionId: '',
		chequeNumber: '',
		chequeDate: '',
		receivedAmount: patientAmount || 0,
		changeAmount: 0,
		installmentPlan: 'Full Payment',
		installmentAmount: 0,
		installmentMonths: 1,
	});

	const [insuranceProcessing, setInsuranceProcessing] = useState({
		approvalStatus: 'Pending',
		approvalNumber: '',
		rejectionReason: '',
		cashlessStatus: 'Not Applicable',
		preAuthAmount: 0,
		finalApprovedAmount: coverage || 0,
	});

	const paymentMethods = [
		'Cash',
		'Credit Card',
		'Debit Card',
		'UPI',
		'Net Banking',
		'Cheque',
		'Insurance Direct Settlement',
		'Installment'
	];

	const installmentPlans = [
		'Full Payment',
		'2 Installments',
		'3 Installments',
		'6 Installments',
		'12 Installments'
	];

	const insuranceTypes = ['CGHS', 'ECHS', 'Railways', 'TPA Health', 'Star Health', 'ICICI Lombard'];

	useEffect(() => {
		if (paymentData.receivedAmount > 0) {
			const change = paymentData.receivedAmount - (patientAmount || 0);
			setPaymentData(prev => ({ ...prev, changeAmount: Math.max(0, change) }));
		}
	}, [paymentData.receivedAmount, patientAmount]);

	const processInsuranceClaim = async () => {
		setIsLoading(true);
		try {
			// Simulate insurance processing
			await new Promise(resolve => setTimeout(resolve, 3000));

			// Mock approval process
			const isApproved = Math.random() > 0.3; // 70% approval rate

			if (isApproved) {
				setInsuranceProcessing({
					...insuranceProcessing,
					approvalStatus: 'Approved',
					approvalNumber: `INS${Date.now()}`,
					finalApprovedAmount: coverage || 0,
					cashlessStatus: 'Approved'
				});

				Alert.alert(
					'Insurance Approved',
					`Claim approved for ₹${(coverage || 0).toFixed(2)}\nApproval Number: INS${Date.now()}`,
					[{ text: 'Continue Payment' }]
				);
			} else {
				setInsuranceProcessing({
					...insuranceProcessing,
					approvalStatus: 'Rejected',
					rejectionReason: 'Policy limit exceeded',
					finalApprovedAmount: 0,
				});

				Alert.alert(
					'Insurance Rejected',
					'Claim rejected: Policy limit exceeded\nPatient will need to pay full amount',
					[{ text: 'Continue' }]
				);
			}
		} catch (error) {
			Alert.alert('Error', 'Failed to process insurance claim');
		} finally {
			setIsLoading(false);
		}
	};

	const processPayment = async () => {
		if (paymentData.paymentMethod === 'Cash' && paymentData.receivedAmount < (patientAmount || 0)) {
			Alert.alert('Error', 'Insufficient amount received');
			return;
		}

		if (paymentData.paymentMethod === 'Credit Card' || paymentData.paymentMethod === 'Debit Card') {
			if (!paymentData.cardNumber || !paymentData.cardHolderName || !paymentData.cvv) {
				Alert.alert('Error', 'Please fill all card details');
				return;
			}
		}

		if (paymentData.paymentMethod === 'UPI' && !paymentData.upiId) {
			Alert.alert('Error', 'Please enter UPI ID');
			return;
		}

		setIsLoading(true);

		try {
			// Simulate payment processing
			await new Promise(resolve => setTimeout(resolve, 2000));

			const transactionId = `TXN${Date.now()}`;

			Alert.alert(
				'Payment Successful',
				`Payment of ₹${(patientAmount || 0).toFixed(2)} processed successfully\nTransaction ID: ${transactionId}`,
				[
					{
						text: 'Print Receipt',
						onPress: () => {
							Alert.alert('Receipt', 'Receipt sent to printer');
						}
					},
					{
						text: 'Send SMS',
						onPress: () => {
							Alert.alert('SMS', 'Payment confirmation sent via SMS');
						}
					},
					{
						text: 'Complete',
						onPress: () => {
							props.navigation.navigate('BillingDashboard');
						}
					}
				]
			);
		} catch (error) {
			Alert.alert('Error', 'Payment processing failed');
		} finally {
			setIsLoading(false);
		}
	};

	const renderPaymentMethodForm = () => {
		switch (paymentData.paymentMethod) {
			case 'Cash':
				return (
					<View>
						<TextInput
							style={styles.input}
							placeholder="Amount Received"
							value={paymentData.receivedAmount.toString()}
							onChangeText={(text) => setPaymentData({ ...paymentData, receivedAmount: parseFloat(text) || 0 })}
							keyboardType="numeric"
						/>
						{paymentData.changeAmount > 0 && (
							<View style={styles.changeContainer}>
								<Text style={styles.changeText}>Change to Return: ₹{paymentData.changeAmount.toFixed(2)}</Text>
							</View>
						)}
					</View>
				);

			case 'Credit Card':
			case 'Debit Card':
				return (
					<View>
						<TextInput
							style={styles.input}
							placeholder="Card Number"
							value={paymentData.cardNumber}
							onChangeText={(text) => setPaymentData({ ...paymentData, cardNumber: text })}
							keyboardType="numeric"
							maxLength={16}
						/>
						<TextInput
							style={styles.input}
							placeholder="Card Holder Name"
							value={paymentData.cardHolderName}
							onChangeText={(text) => setPaymentData({ ...paymentData, cardHolderName: text })}
						/>
						<View style={styles.row}>
							<TextInput
								style={[styles.input, { flex: 1, marginRight: 10 }]}
								placeholder="MM"
								value={paymentData.expiryMonth}
								onChangeText={(text) => setPaymentData({ ...paymentData, expiryMonth: text })}
								keyboardType="numeric"
								maxLength={2}
							/>
							<TextInput
								style={[styles.input, { flex: 1, marginRight: 10 }]}
								placeholder="YY"
								value={paymentData.expiryYear}
								onChangeText={(text) => setPaymentData({ ...paymentData, expiryYear: text })}
								keyboardType="numeric"
								maxLength={2}
							/>
							<TextInput
								style={[styles.input, { flex: 1 }]}
								placeholder="CVV"
								value={paymentData.cvv}
								onChangeText={(text) => setPaymentData({ ...paymentData, cvv: text })}
								keyboardType="numeric"
								maxLength={3}
								secureTextEntry
							/>
						</View>
					</View>
				);

			case 'UPI':
				return (
					<View>
						<TextInput
							style={styles.input}
							placeholder="UPI ID (e.g., user@paytm)"
							value={paymentData.upiId}
							onChangeText={(text) => setPaymentData({ ...paymentData, upiId: text })}
							autoCapitalize="none"
						/>
						<View style={styles.qrContainer}>
							<MaterialIcons name="qr-code" size={100} color="#6b7280" />
							<Text style={styles.qrText}>Show QR Code to Patient</Text>
						</View>
					</View>
				);

			case 'Net Banking':
				return (
					<View>
						<TextInput
							style={styles.input}
							placeholder="Bank Name"
							value={paymentData.bankName}
							onChangeText={(text) => setPaymentData({ ...paymentData, bankName: text })}
						/>
						<TextInput
							style={styles.input}
							placeholder="Transaction ID"
							value={paymentData.transactionId}
							onChangeText={(text) => setPaymentData({ ...paymentData, transactionId: text })}
						/>
					</View>
				);

			case 'Cheque':
				return (
					<View>
						<TextInput
							style={styles.input}
							placeholder="Cheque Number"
							value={paymentData.chequeNumber}
							onChangeText={(text) => setPaymentData({ ...paymentData, chequeNumber: text })}
						/>
						<TextInput
							style={styles.input}
							placeholder="Cheque Date (DD/MM/YYYY)"
							value={paymentData.chequeDate}
							onChangeText={(text) => setPaymentData({ ...paymentData, chequeDate: text })}
						/>
						<TextInput
							style={styles.input}
							placeholder="Bank Name"
							value={paymentData.bankName}
							onChangeText={(text) => setPaymentData({ ...paymentData, bankName: text })}
						/>
					</View>
				);

			case 'Installment':
				return (
					<View>
						<Text style={styles.label}>Installment Plan</Text>
						<View style={styles.pickerContainer}>
							<Picker
								selectedValue={paymentData.installmentPlan}
								style={styles.picker}
								onValueChange={(value) => {
									const months = parseInt(value.split(' ')[0]) || 1;
									const amount = (patientAmount || 0) / months;
									setPaymentData({
										...paymentData,
										installmentPlan: value,
										installmentMonths: months,
										installmentAmount: amount
									});
								}}
							>
								{installmentPlans.map((plan, index) => (
									<Picker.Item key={index} label={plan} value={plan} />
								))}
							</Picker>
						</View>
						{paymentData.installmentPlan !== 'Full Payment' && (
							<View style={styles.installmentInfo}>
								<Text style={styles.installmentText}>
									Monthly Amount: ₹{paymentData.installmentAmount.toFixed(2)}
								</Text>
								<Text style={styles.installmentText}>
									Number of Months: {paymentData.installmentMonths}
								</Text>
							</View>
						)}
					</View>
				);

			default:
				return null;
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => props.navigation.goBack()}
				>
					<MaterialIcons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Payment Processing</Text>
				<View style={styles.placeholder} />
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Payment Summary */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Payment Summary</Text>
					<View style={styles.card}>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Total Bill Amount</Text>
							<Text style={styles.summaryValue}>₹{(total || 0).toFixed(2)}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Insurance Coverage</Text>
							<Text style={[styles.summaryValue, { color: '#10b981' }]}>₹{(coverage || 0).toFixed(2)}</Text>
						</View>
						<View style={[styles.summaryRow, styles.totalRow]}>
							<Text style={styles.totalLabel}>Patient Amount</Text>
							<Text style={styles.totalValue}>₹{(patientAmount || 0).toFixed(2)}</Text>
						</View>
					</View>
				</View>

				{/* Insurance Processing */}
				{(billData?.insuranceType && billData.insuranceType !== 'Cash') && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Insurance Processing</Text>
						<View style={styles.card}>
							<View style={styles.insuranceHeader}>
								<Text style={styles.insuranceType}>{billData.insuranceType}</Text>
								<View style={[
									styles.statusBadge,
									{
										backgroundColor:
											insuranceProcessing.approvalStatus === 'Approved' ? '#10b981' :
											insuranceProcessing.approvalStatus === 'Rejected' ? '#dc2626' : '#f59e0b'
									}
								]}>
									<Text style={styles.statusText}>{insuranceProcessing.approvalStatus}</Text>
								</View>
							</View>

							{insuranceProcessing.approvalStatus === 'Pending' && (
								<TouchableOpacity
									style={styles.processButton}
									onPress={processInsuranceClaim}
									disabled={isLoading}
								>
									{isLoading ? (
										<ActivityIndicator size="small" color="white" />
									) : (
										<>
											<MaterialIcons name="verified-user" size={20} color="white" />
											<Text style={styles.processButtonText}>Process Insurance Claim</Text>
										</>
									)}
								</TouchableOpacity>
							)}

							{insuranceProcessing.approvalNumber && (
								<View style={styles.approvalInfo}>
									<Text style={styles.approvalText}>
										Approval Number: {insuranceProcessing.approvalNumber}
									</Text>
									<Text style={styles.approvalText}>
										Approved Amount: ₹{insuranceProcessing.finalApprovedAmount.toFixed(2)}
									</Text>
								</View>
							)}

							{insuranceProcessing.rejectionReason && (
								<View style={styles.rejectionInfo}>
									<Text style={styles.rejectionText}>
										Rejection Reason: {insuranceProcessing.rejectionReason}
									</Text>
								</View>
							)}
						</View>
					</View>
				)}

				{/* Payment Method Selection */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Payment Method</Text>
					<View style={styles.card}>
						<Text style={styles.label}>Select Payment Method</Text>
						<View style={styles.pickerContainer}>
							<Picker
								selectedValue={paymentData.paymentMethod}
								style={styles.picker}
								onValueChange={(value) => setPaymentData({ ...paymentData, paymentMethod: value })}
							>
								{paymentMethods.map((method, index) => (
									<Picker.Item key={index} label={method} value={method} />
								))}
							</Picker>
						</View>

						{renderPaymentMethodForm()}
					</View>
				</View>

				{/* Process Payment Button */}
				<TouchableOpacity
					style={[styles.paymentButton, isLoading && styles.disabledButton]}
					onPress={processPayment}
					disabled={isLoading}
				>
					{isLoading ? (
						<ActivityIndicator size="small" color="white" />
					) : (
						<>
							<MaterialIcons name="payment" size={24} color="white" />
							<Text style={styles.paymentButtonText}>
								Process Payment - ₹{(patientAmount || 0).toFixed(2)}
							</Text>
						</>
					)}
				</TouchableOpacity>

				{/* Quick Actions */}
				<View style={styles.quickActions}>
					<TouchableOpacity style={styles.quickActionButton}>
						<MaterialIcons name="print" size={20} color="#06b6d4" />
						<Text style={styles.quickActionText}>Print Bill</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.quickActionButton}>
						<MaterialIcons name="email" size={20} color="#06b6d4" />
						<Text style={styles.quickActionText}>Email Receipt</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.quickActionButton}>
						<MaterialIcons name="sms" size={20} color="#06b6d4" />
						<Text style={styles.quickActionText}>Send SMS</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.bottomSpacing} />
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 20,
		paddingHorizontal: 20,
		backgroundColor: '#06b6d4',
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
	},
	backButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: 'white',
		textAlign: 'center',
		flex: 1,
	},
	placeholder: {
		width: 40,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 10,
	},
	card: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 8,
	},
	summaryLabel: {
		fontSize: 14,
		color: '#6b7280',
	},
	summaryValue: {
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
	},
	totalRow: {
		borderTopWidth: 1,
		borderTopColor: '#e5e7eb',
		marginTop: 5,
		paddingTop: 10,
	},
	totalLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	totalValue: {
		fontSize: 18,
		fontWeight: '700',
		color: '#dc2626',
	},
	insuranceHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	insuranceType: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	statusText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	processButton: {
		flexDirection: 'row',
		backgroundColor: '#10b981',
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 15,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
	},
	processButtonText: {
		color: 'white',
		fontSize: 14,
		fontWeight: '600',
		marginLeft: 8,
	},
	approvalInfo: {
		backgroundColor: '#f0fdf4',
		padding: 10,
		borderRadius: 8,
		marginTop: 10,
	},
	approvalText: {
		fontSize: 14,
		color: '#15803d',
		marginBottom: 4,
	},
	rejectionInfo: {
		backgroundColor: '#fef2f2',
		padding: 10,
		borderRadius: 8,
		marginTop: 10,
	},
	rejectionText: {
		fontSize: 14,
		color: '#dc2626',
	},
	label: {
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
		marginBottom: 5,
		marginTop: 5,
	},
	pickerContainer: {
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 8,
		backgroundColor: '#fff',
		marginBottom: 10,
	},
	picker: {
		height: 50,
	},
	input: {
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		backgroundColor: '#fff',
		marginBottom: 10,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	changeContainer: {
		backgroundColor: '#f0fdf4',
		padding: 10,
		borderRadius: 8,
		marginTop: 5,
	},
	changeText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#15803d',
		textAlign: 'center',
	},
	qrContainer: {
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#f9fafb',
		borderRadius: 8,
		marginTop: 10,
	},
	qrText: {
		fontSize: 14,
		color: '#6b7280',
		marginTop: 10,
	},
	installmentInfo: {
		backgroundColor: '#fef3c7',
		padding: 10,
		borderRadius: 8,
		marginTop: 10,
	},
	installmentText: {
		fontSize: 14,
		color: '#92400e',
		marginBottom: 4,
	},
	paymentButton: {
		flexDirection: 'row',
		backgroundColor: '#06b6d4',
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#06b6d4',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
		marginBottom: 20,
	},
	disabledButton: {
		backgroundColor: '#9ca3af',
		shadowOpacity: 0.1,
	},
	paymentButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
		marginLeft: 10,
	},
	quickActions: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: 'white',
		borderRadius: 12,
		paddingVertical: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	quickActionButton: {
		alignItems: 'center',
	},
	quickActionText: {
		fontSize: 12,
		color: '#374151',
		marginTop: 5,
		fontWeight: '500',
	},
	bottomSpacing: {
		height: 30,
	},
});

export default PaymentProcessing;