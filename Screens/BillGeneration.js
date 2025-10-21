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
	FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const BillGeneration = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	// Bill data state
	const [billData, setBillData] = useState({
		patientId: '',
		patientName: '',
		patientPhone: '',
		insuranceType: 'Cash',
		insuranceProvider: '',
		policyNumber: '',
		doctorId: '',
		doctorName: '',
		department: '',
		visitType: 'OPD', // OPD, IPD, Emergency
		admissionDate: null,
		dischargeDate: null,
		roomNumber: '',
		roomType: '',
		dayCount: 0,
	});

	const [services, setServices] = useState([]);
	const [selectedService, setSelectedService] = useState({
		category: '',
		service: '',
		quantity: 1,
		unitPrice: 0,
		discount: 0,
	});

	// Mock service data
	const serviceCategories = {
		'Consultation': [
			{ name: 'General Consultation', price: 500 },
			{ name: 'Specialist Consultation', price: 800 },
			{ name: 'Emergency Consultation', price: 1200 },
			{ name: 'Follow-up Consultation', price: 300 },
		],
		'Diagnostics': [
			{ name: 'X-Ray Chest', price: 400 },
			{ name: 'ECG', price: 200 },
			{ name: 'Blood Test - Complete', price: 600 },
			{ name: 'Urine Test', price: 150 },
			{ name: 'CT Scan', price: 3000 },
			{ name: 'MRI', price: 8000 },
			{ name: 'Ultrasound', price: 800 },
		],
		'Procedures': [
			{ name: 'Minor Surgery', price: 5000 },
			{ name: 'Endoscopy', price: 3500 },
			{ name: 'Biopsy', price: 2500 },
			{ name: 'Injection Administration', price: 100 },
			{ name: 'Dressing', price: 200 },
		],
		'Pharmacy': [
			{ name: 'Medicines', price: 0 }, // Variable pricing
			{ name: 'Surgical Items', price: 0 },
			{ name: 'Medical Devices', price: 0 },
		],
		'Room Charges': [
			{ name: 'General Ward (per day)', price: 800 },
			{ name: 'Semi-Private Room (per day)', price: 1500 },
			{ name: 'Private Room (per day)', price: 2500 },
			{ name: 'ICU (per day)', price: 5000 },
			{ name: 'Emergency Observation', price: 1000 },
		],
		'Other Charges': [
			{ name: 'Registration Fee', price: 50 },
			{ name: 'Medical Record Fee', price: 100 },
			{ name: 'Ambulance Service', price: 500 },
			{ name: 'Nursing Care', price: 300 },
		],
	};

	const insuranceTypes = ['Cash', 'CGHS', 'ECHS', 'Railways', 'TPA Health', 'Star Health', 'ICICI Lombard', 'Cashless'];

	const addService = () => {
		if (!selectedService.category || !selectedService.service) {
			Alert.alert('Error', 'Please select both category and service');
			return;
		}

		const serviceInfo = serviceCategories[selectedService.category]?.find(
			s => s.name === selectedService.service
		);

		if (!serviceInfo) {
			Alert.alert('Error', 'Service not found');
			return;
		}

		const newService = {
			id: Date.now().toString(),
			category: selectedService.category,
			service: selectedService.service,
			quantity: selectedService.quantity,
			unitPrice: selectedService.unitPrice || serviceInfo.price,
			discount: selectedService.discount,
			totalPrice: (selectedService.quantity * (selectedService.unitPrice || serviceInfo.price)) - selectedService.discount,
		};

		setServices([...services, newService]);
		setSelectedService({
			category: '',
			service: '',
			quantity: 1,
			unitPrice: 0,
			discount: 0,
		});
	};

	const removeService = (serviceId) => {
		setServices(services.filter(s => s.id !== serviceId));
	};

	const calculateTotal = () => {
		const subtotal = services.reduce((sum, service) => sum + service.totalPrice, 0);
		const tax = subtotal * 0.18; // 18% GST
		const total = subtotal + tax;
		return { subtotal, tax, total };
	};

	const getInsuranceCoverage = () => {
		const { total } = calculateTotal();

		switch (billData.insuranceType) {
			case 'CGHS':
				return total * 0.95; // 95% coverage
			case 'ECHS':
				return total * 0.90; // 90% coverage
			case 'Railways':
				return total * 0.85; // 85% coverage
			case 'TPA Health':
			case 'Star Health':
			case 'ICICI Lombard':
				return total * 0.80; // 80% coverage
			case 'Cashless':
				return total; // 100% coverage
			default:
				return 0; // Cash payment
		}
	};

	const generateBill = () => {
		if (services.length === 0) {
			Alert.alert('Error', 'Please add at least one service');
			return;
		}

		if (!billData.patientName || !billData.patientPhone) {
			Alert.alert('Error', 'Please enter patient details');
			return;
		}

		setIsLoading(true);

		// Simulate bill generation
		setTimeout(() => {
			setIsLoading(false);
			const { total } = calculateTotal();
			const coverage = getInsuranceCoverage();
			const patientAmount = total - coverage;

			Alert.alert(
				'Bill Generated Successfully',
				`Total Amount: ₹${total.toFixed(2)}\nInsurance Coverage: ₹${coverage.toFixed(2)}\nPatient Amount: ₹${patientAmount.toFixed(2)}`,
				[
					{
						text: 'Print Bill',
						onPress: () => {
							Alert.alert('Print', 'Bill sent to printer');
						}
					},
					{
						text: 'Save & Process Payment',
						onPress: () => {
							props.navigation.navigate('PaymentProcessing', {
								billData,
								services,
								total,
								coverage,
								patientAmount
							});
						}
					}
				]
			);
		}, 2000);
	};

	const renderServiceItem = ({ item }) => (
		<View style={styles.serviceItem}>
			<View style={styles.serviceHeader}>
				<View style={styles.serviceInfo}>
					<Text style={styles.serviceName}>{item.service}</Text>
					<Text style={styles.serviceCategory}>{item.category}</Text>
				</View>
				<TouchableOpacity
					style={styles.removeButton}
					onPress={() => removeService(item.id)}
				>
					<MaterialIcons name="delete" size={20} color="#dc2626" />
				</TouchableOpacity>
			</View>
			<View style={styles.serviceDetails}>
				<Text style={styles.serviceDetail}>Qty: {item.quantity}</Text>
				<Text style={styles.serviceDetail}>Unit: ₹{item.unitPrice}</Text>
				<Text style={styles.serviceDetail}>Discount: ₹{item.discount}</Text>
				<Text style={styles.serviceTotal}>Total: ₹{item.totalPrice}</Text>
			</View>
		</View>
	);

	const { subtotal, tax, total } = calculateTotal();
	const coverage = getInsuranceCoverage();
	const patientAmount = total - coverage;

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => props.navigation.goBack()}
				>
					<MaterialIcons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Generate Bill</Text>
				<View style={styles.placeholder} />
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Patient Information */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Patient Information</Text>
					<View style={styles.card}>
						<TextInput
							style={styles.input}
							placeholder="Patient ID"
							value={billData.patientId}
							onChangeText={(text) => setBillData({ ...billData, patientId: text })}
						/>
						<TextInput
							style={styles.input}
							placeholder="Patient Name *"
							value={billData.patientName}
							onChangeText={(text) => setBillData({ ...billData, patientName: text })}
						/>
						<TextInput
							style={styles.input}
							placeholder="Phone Number *"
							value={billData.patientPhone}
							onChangeText={(text) => setBillData({ ...billData, patientPhone: text })}
							keyboardType="numeric"
						/>
					</View>
				</View>

				{/* Insurance Information */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Insurance Details</Text>
					<View style={styles.card}>
						<Text style={styles.label}>Insurance Type</Text>
						<View style={styles.pickerContainer}>
							<Picker
								selectedValue={billData.insuranceType}
								style={styles.picker}
								onValueChange={(value) => setBillData({ ...billData, insuranceType: value })}
							>
								{insuranceTypes.map((type, index) => (
									<Picker.Item key={index} label={type} value={type} />
								))}
							</Picker>
						</View>

						{billData.insuranceType !== 'Cash' && (
							<>
								<TextInput
									style={styles.input}
									placeholder="Insurance Provider"
									value={billData.insuranceProvider}
									onChangeText={(text) => setBillData({ ...billData, insuranceProvider: text })}
								/>
								<TextInput
									style={styles.input}
									placeholder="Policy Number"
									value={billData.policyNumber}
									onChangeText={(text) => setBillData({ ...billData, policyNumber: text })}
								/>
							</>
						)}
					</View>
				</View>

				{/* Doctor & Department */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Visit Details</Text>
					<View style={styles.card}>
						<TextInput
							style={styles.input}
							placeholder="Doctor Name"
							value={billData.doctorName}
							onChangeText={(text) => setBillData({ ...billData, doctorName: text })}
						/>
						<TextInput
							style={styles.input}
							placeholder="Department"
							value={billData.department}
							onChangeText={(text) => setBillData({ ...billData, department: text })}
						/>
						<Text style={styles.label}>Visit Type</Text>
						<View style={styles.pickerContainer}>
							<Picker
								selectedValue={billData.visitType}
								style={styles.picker}
								onValueChange={(value) => setBillData({ ...billData, visitType: value })}
							>
								<Picker.Item label="OPD (Outpatient)" value="OPD" />
								<Picker.Item label="IPD (Inpatient)" value="IPD" />
								<Picker.Item label="Emergency" value="Emergency" />
							</Picker>
						</View>
					</View>
				</View>

				{/* Add Services */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Add Services</Text>
					<View style={styles.card}>
						<Text style={styles.label}>Service Category</Text>
						<View style={styles.pickerContainer}>
							<Picker
								selectedValue={selectedService.category}
								style={styles.picker}
								onValueChange={(value) => setSelectedService({ ...selectedService, category: value, service: '' })}
							>
								<Picker.Item label="Select Category" value="" />
								{Object.keys(serviceCategories).map((category, index) => (
									<Picker.Item key={index} label={category} value={category} />
								))}
							</Picker>
						</View>

						{selectedService.category && (
							<>
								<Text style={styles.label}>Service</Text>
								<View style={styles.pickerContainer}>
									<Picker
										selectedValue={selectedService.service}
										style={styles.picker}
										onValueChange={(value) => {
											const serviceInfo = serviceCategories[selectedService.category]?.find(s => s.name === value);
											setSelectedService({
												...selectedService,
												service: value,
												unitPrice: serviceInfo?.price || 0
											});
										}}
									>
										<Picker.Item label="Select Service" value="" />
										{serviceCategories[selectedService.category]?.map((service, index) => (
											<Picker.Item key={index} label={`${service.name} - ₹${service.price}`} value={service.name} />
										))}
									</Picker>
								</View>

								<View style={styles.serviceInputRow}>
									<TextInput
										style={[styles.input, { flex: 1, marginRight: 10 }]}
										placeholder="Quantity"
										value={selectedService.quantity.toString()}
										onChangeText={(text) => setSelectedService({ ...selectedService, quantity: parseInt(text) || 1 })}
										keyboardType="numeric"
									/>
									<TextInput
										style={[styles.input, { flex: 1, marginRight: 10 }]}
										placeholder="Unit Price"
										value={selectedService.unitPrice.toString()}
										onChangeText={(text) => setSelectedService({ ...selectedService, unitPrice: parseFloat(text) || 0 })}
										keyboardType="numeric"
									/>
									<TextInput
										style={[styles.input, { flex: 1 }]}
										placeholder="Discount"
										value={selectedService.discount.toString()}
										onChangeText={(text) => setSelectedService({ ...selectedService, discount: parseFloat(text) || 0 })}
										keyboardType="numeric"
									/>
								</View>

								<TouchableOpacity style={styles.addServiceButton} onPress={addService}>
									<MaterialIcons name="add" size={20} color="white" />
									<Text style={styles.addServiceText}>Add Service</Text>
								</TouchableOpacity>
							</>
						)}
					</View>
				</View>

				{/* Services List */}
				{services.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Added Services ({services.length})</Text>
						<FlatList
							data={services}
							renderItem={renderServiceItem}
							keyExtractor={item => item.id}
							scrollEnabled={false}
						/>
					</View>
				)}

				{/* Bill Summary */}
				{services.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Bill Summary</Text>
						<View style={styles.card}>
							<View style={styles.summaryRow}>
								<Text style={styles.summaryLabel}>Subtotal</Text>
								<Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
							</View>
							<View style={styles.summaryRow}>
								<Text style={styles.summaryLabel}>Tax (18% GST)</Text>
								<Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
							</View>
							<View style={[styles.summaryRow, styles.totalRow]}>
								<Text style={styles.totalLabel}>Total Amount</Text>
								<Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
							</View>

							{billData.insuranceType !== 'Cash' && (
								<>
									<View style={styles.divider} />
									<View style={styles.summaryRow}>
										<Text style={styles.summaryLabel}>Insurance Coverage ({billData.insuranceType})</Text>
										<Text style={[styles.summaryValue, { color: '#10b981' }]}>₹{coverage.toFixed(2)}</Text>
									</View>
									<View style={[styles.summaryRow, styles.patientAmountRow]}>
										<Text style={styles.patientAmountLabel}>Patient Amount</Text>
										<Text style={styles.patientAmountValue}>₹{patientAmount.toFixed(2)}</Text>
									</View>
								</>
							)}
						</View>
					</View>
				)}

				{/* Generate Bill Button */}
				<TouchableOpacity
					style={[styles.generateButton, (!services.length || isLoading) && styles.disabledButton]}
					onPress={generateBill}
					disabled={!services.length || isLoading}
				>
					{isLoading ? (
						<ActivityIndicator size="small" color="white" />
					) : (
						<>
							<MaterialIcons name="receipt" size={24} color="white" />
							<Text style={styles.generateButtonText}>Generate Bill</Text>
						</>
					)}
				</TouchableOpacity>

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
	serviceInputRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	addServiceButton: {
		flexDirection: 'row',
		backgroundColor: '#06b6d4',
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 15,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10,
	},
	addServiceText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
	},
	serviceItem: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	serviceHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 8,
	},
	serviceInfo: {
		flex: 1,
	},
	serviceName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	serviceCategory: {
		fontSize: 14,
		color: '#6b7280',
		marginTop: 2,
	},
	removeButton: {
		padding: 5,
	},
	serviceDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
	},
	serviceDetail: {
		fontSize: 12,
		color: '#6b7280',
	},
	serviceTotal: {
		fontSize: 14,
		fontWeight: '600',
		color: '#059669',
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
		fontSize: 16,
		fontWeight: '700',
		color: '#1f2937',
	},
	divider: {
		height: 1,
		backgroundColor: '#e5e7eb',
		marginVertical: 10,
	},
	patientAmountRow: {
		backgroundColor: '#fee2e2',
		marginHorizontal: -15,
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 8,
	},
	patientAmountLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#dc2626',
	},
	patientAmountValue: {
		fontSize: 18,
		fontWeight: '700',
		color: '#dc2626',
	},
	generateButton: {
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
		marginTop: 20,
	},
	disabledButton: {
		backgroundColor: '#9ca3af',
		shadowOpacity: 0.1,
	},
	generateButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
		marginLeft: 10,
	},
	bottomSpacing: {
		height: 30,
	},
});

export default BillGeneration;