import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
	TextInput,
	Alert,
	Modal,
	SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const PrescriptionProcessing = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('All');
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [selectedPrescription, setSelectedPrescription] = useState(null);

	const [prescriptions, setPrescriptions] = useState([
		{
			id: 'RX001',
			patientName: 'Priya Sharma',
			patientId: 'P12345',
			doctorName: 'Dr. Sharma',
			department: 'Cardiology',
			prescribedDate: '2024-01-15',
			status: 'Pending',
			priority: 'Normal',
			medications: [
				{ name: 'Atorvastatin 20mg', quantity: 30, frequency: 'Once daily', duration: '30 days', available: true },
				{ name: 'Metoprolol 50mg', quantity: 60, frequency: 'Twice daily', duration: '30 days', available: true },
				{ name: 'Aspirin 75mg', quantity: 30, frequency: 'Once daily', duration: '30 days', available: false }
			],
			instructions: 'Take medications with food. Monitor blood pressure daily.',
			totalAmount: 450.00,
			insuranceApplicable: true,
			insuranceType: 'CGHS'
		},
		{
			id: 'RX002',
			patientName: 'Amit Singh',
			patientId: 'P12346',
			doctorName: 'Dr. Verma',
			department: 'Diabetes',
			prescribedDate: '2024-01-15',
			status: 'Processing',
			priority: 'High',
			medications: [
				{ name: 'Insulin Glargine', quantity: 3, frequency: 'Once daily', duration: '30 days', available: true },
				{ name: 'Metformin 1000mg', quantity: 60, frequency: 'Twice daily', duration: '30 days', available: true }
			],
			instructions: 'Inject insulin at bedtime. Check blood sugar before meals.',
			totalAmount: 890.00,
			insuranceApplicable: false,
			insuranceType: null
		},
		{
			id: 'RX003',
			patientName: 'Sunita Devi',
			patientId: 'P12347',
			doctorName: 'Dr. Gupta',
			department: 'General Medicine',
			prescribedDate: '2024-01-14',
			status: 'Ready',
			priority: 'Normal',
			medications: [
				{ name: 'Paracetamol 500mg', quantity: 20, frequency: 'As needed', duration: '5 days', available: true },
				{ name: 'Cetirizine 10mg', quantity: 10, frequency: 'Once daily', duration: '10 days', available: false }
			],
			instructions: 'Take paracetamol only when fever exceeds 100°F.',
			totalAmount: 85.00,
			insuranceApplicable: true,
			insuranceType: 'ECHS'
		},
		{
			id: 'RX004',
			patientName: 'Ravi Kumar',
			patientId: 'P12348',
			doctorName: 'Dr. Singh',
			department: 'Orthopedics',
			prescribedDate: '2024-01-14',
			status: 'Dispensed',
			priority: 'Normal',
			medications: [
				{ name: 'Ibuprofen 400mg', quantity: 30, frequency: 'Three times daily', duration: '10 days', available: true },
				{ name: 'Calcium + Vitamin D', quantity: 30, frequency: 'Once daily', duration: '30 days', available: true }
			],
			instructions: 'Take ibuprofen with food to avoid stomach irritation.',
			totalAmount: 245.00,
			insuranceApplicable: false,
			insuranceType: null
		}
	]);

	const statusOptions = ['All', 'Pending', 'Processing', 'Ready', 'Dispensed', 'Cancelled'];

	const getStatusColor = (status) => {
		switch (status) {
			case 'Pending': return '#f59e0b';
			case 'Processing': return '#3b82f6';
			case 'Ready': return '#10b981';
			case 'Dispensed': return '#6b7280';
			case 'Cancelled': return '#ef4444';
			default: return '#6b7280';
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'High': return '#ef4444';
			case 'Medium': return '#f59e0b';
			case 'Normal': return '#10b981';
			default: return '#6b7280';
		}
	};

	const filteredPrescriptions = prescriptions.filter(prescription =>
		(selectedStatus === 'All' || prescription.status === selectedStatus) &&
		(prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
		prescription.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
		prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const handleStatusUpdate = (prescriptionId, newStatus) => {
		setPrescriptions(prev => prev.map(prescription =>
			prescription.id === prescriptionId
				? { ...prescription, status: newStatus }
				: prescription
		));
		Alert.alert('Success', `Prescription ${prescriptionId} status updated to ${newStatus}`);
	};

	const handleDispense = (prescriptionId) => {
		Alert.alert(
			'Confirm Dispensing',
			'Are you sure you want to dispense this prescription?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Dispense',
					onPress: () => handleStatusUpdate(prescriptionId, 'Dispensed')
				}
			]
		);
	};

	const calculateInsuranceCoverage = (amount, insuranceType) => {
		if (!insuranceType) return 0;
		switch (insuranceType) {
			case 'CGHS': return amount * 0.9;
			case 'ECHS': return amount * 0.85;
			case 'Railways': return amount * 0.8;
			default: return amount * 0.7;
		}
	};

	const renderPrescriptionItem = ({ item }) => {
		const availableMeds = item.medications.filter(med => med.available).length;
		const totalMeds = item.medications.length;
		const isComplete = availableMeds === totalMeds;

		return (
			<TouchableOpacity
				style={styles.prescriptionItem}
				onPress={() => {
					setSelectedPrescription(item);
					setShowDetailsModal(true);
				}}
			>
				<View style={styles.prescriptionHeader}>
					<View style={styles.prescriptionInfo}>
						<Text style={styles.prescriptionId}>{item.id}</Text>
						<Text style={styles.patientName}>{item.patientName}</Text>
						<Text style={styles.doctorName}>Dr: {item.doctorName}</Text>
						<Text style={styles.department}>{item.department}</Text>
					</View>
					<View style={styles.statusContainer}>
						<View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
							<Text style={styles.statusText}>{item.status}</Text>
						</View>
						<View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
							<Text style={styles.priorityText}>{item.priority}</Text>
						</View>
					</View>
				</View>

				<View style={styles.prescriptionDetails}>
					<View style={styles.detailRow}>
						<FontAwesome5 name="calendar" size={12} color="#6b7280" />
						<Text style={styles.detailText}>Prescribed: {item.prescribedDate}</Text>
					</View>
					<View style={styles.detailRow}>
						<FontAwesome5 name="pills" size={12} color="#6b7280" />
						<Text style={styles.detailText}>Medications: {availableMeds}/{totalMeds} available</Text>
					</View>
					<View style={styles.detailRow}>
						<FontAwesome5 name="rupee-sign" size={12} color="#6b7280" />
						<Text style={styles.detailText}>Amount: ₹{item.totalAmount.toFixed(2)}</Text>
					</View>
					{item.insuranceApplicable && (
						<View style={styles.detailRow}>
							<FontAwesome5 name="shield-alt" size={12} color="#10b981" />
							<Text style={styles.detailText}>Insurance: {item.insuranceType}</Text>
						</View>
					)}
				</View>

				{!isComplete && (
					<View style={styles.warningBanner}>
						<FontAwesome5 name="exclamation-triangle" size={14} color="#f59e0b" />
						<Text style={styles.warningText}>Some medications are not available</Text>
					</View>
				)}

				<View style={styles.actionButtons}>
					{item.status === 'Pending' && (
						<TouchableOpacity
							style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
							onPress={() => handleStatusUpdate(item.id, 'Processing')}
						>
							<Text style={styles.actionButtonText}>Start Processing</Text>
						</TouchableOpacity>
					)}
					{item.status === 'Processing' && isComplete && (
						<TouchableOpacity
							style={[styles.actionButton, { backgroundColor: '#10b981' }]}
							onPress={() => handleStatusUpdate(item.id, 'Ready')}
						>
							<Text style={styles.actionButtonText}>Mark Ready</Text>
						</TouchableOpacity>
					)}
					{item.status === 'Ready' && (
						<TouchableOpacity
							style={[styles.actionButton, { backgroundColor: '#84cc16' }]}
							onPress={() => handleDispense(item.id)}
						>
							<Text style={styles.actionButtonText}>Dispense</Text>
						</TouchableOpacity>
					)}
				</View>
			</TouchableOpacity>
		);
	};

	const renderStatusFilter = () => (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilter}>
			{statusOptions.map(status => (
				<TouchableOpacity
					key={status}
					style={[
						styles.statusButton,
						selectedStatus === status && styles.activeStatusButton
					]}
					onPress={() => setSelectedStatus(status)}
				>
					<Text style={[
						styles.statusButtonText,
						selectedStatus === status && styles.activeStatusButtonText
					]}>
						{status}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);

	const renderPrescriptionDetails = () => {
		if (!selectedPrescription) return null;

		const insuranceCoverage = selectedPrescription.insuranceApplicable
			? calculateInsuranceCoverage(selectedPrescription.totalAmount, selectedPrescription.insuranceType)
			: 0;
		const patientPayable = selectedPrescription.totalAmount - insuranceCoverage;

		return (
			<Modal
				visible={showDetailsModal}
				animationType="slide"
				presentationStyle="pageSheet"
			>
				<SafeAreaView style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<TouchableOpacity onPress={() => setShowDetailsModal(false)}>
							<MaterialIcons name="close" size={24} color="#374151" />
						</TouchableOpacity>
						<Text style={styles.modalTitle}>Prescription Details</Text>
						<View style={{ width: 24 }} />
					</View>

					<ScrollView style={styles.modalContent}>
						<View style={styles.patientSection}>
							<Text style={styles.sectionTitle}>Patient Information</Text>
							<Text style={styles.patientDetail}>Name: {selectedPrescription.patientName}</Text>
							<Text style={styles.patientDetail}>ID: {selectedPrescription.patientId}</Text>
							<Text style={styles.patientDetail}>Prescription ID: {selectedPrescription.id}</Text>
						</View>

						<View style={styles.doctorSection}>
							<Text style={styles.sectionTitle}>Prescribing Doctor</Text>
							<Text style={styles.doctorDetail}>{selectedPrescription.doctorName}</Text>
							<Text style={styles.doctorDetail}>{selectedPrescription.department}</Text>
							<Text style={styles.doctorDetail}>Date: {selectedPrescription.prescribedDate}</Text>
						</View>

						<View style={styles.medicationsSection}>
							<Text style={styles.sectionTitle}>Medications</Text>
							{selectedPrescription.medications.map((med, index) => (
								<View key={index} style={styles.medicationItem}>
									<View style={styles.medicationHeader}>
										<Text style={styles.medicationName}>{med.name}</Text>
										<View style={[
											styles.availabilityBadge,
											{ backgroundColor: med.available ? '#10b981' : '#ef4444' }
										]}>
											<Text style={styles.availabilityText}>
												{med.available ? 'Available' : 'Not Available'}
											</Text>
										</View>
									</View>
									<Text style={styles.medicationDetail}>Quantity: {med.quantity}</Text>
									<Text style={styles.medicationDetail}>Frequency: {med.frequency}</Text>
									<Text style={styles.medicationDetail}>Duration: {med.duration}</Text>
								</View>
							))}
						</View>

						<View style={styles.instructionsSection}>
							<Text style={styles.sectionTitle}>Instructions</Text>
							<Text style={styles.instructionsText}>{selectedPrescription.instructions}</Text>
						</View>

						<View style={styles.billingSection}>
							<Text style={styles.sectionTitle}>Billing Information</Text>
							<View style={styles.billingRow}>
								<Text style={styles.billingLabel}>Total Amount:</Text>
								<Text style={styles.billingValue}>₹{selectedPrescription.totalAmount.toFixed(2)}</Text>
							</View>
							{selectedPrescription.insuranceApplicable && (
								<>
									<View style={styles.billingRow}>
										<Text style={styles.billingLabel}>Insurance ({selectedPrescription.insuranceType}):</Text>
										<Text style={styles.billingValue}>-₹{insuranceCoverage.toFixed(2)}</Text>
									</View>
									<View style={styles.billingRow}>
										<Text style={styles.billingLabelBold}>Patient Payable:</Text>
										<Text style={styles.billingValueBold}>₹{patientPayable.toFixed(2)}</Text>
									</View>
								</>
							)}
						</View>
					</ScrollView>
				</SafeAreaView>
			</Modal>
		);
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
				<Text style={styles.headerTitle}>Prescription Processing</Text>
				<TouchableOpacity style={styles.scanButton}>
					<MaterialIcons name="qr-code-scanner" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<View style={styles.searchContainer}>
				<View style={styles.searchBox}>
					<MaterialIcons name="search" size={20} color="#6b7280" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search prescriptions, patients, doctors..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
			</View>

			{renderStatusFilter()}

			<View style={styles.statsRow}>
				<View style={[styles.statCard, { backgroundColor: '#f59e0b' }]}>
					<Text style={styles.statNumber}>{prescriptions.filter(p => p.status === 'Pending').length}</Text>
					<Text style={styles.statLabel}>Pending</Text>
				</View>
				<View style={[styles.statCard, { backgroundColor: '#3b82f6' }]}>
					<Text style={styles.statNumber}>{prescriptions.filter(p => p.status === 'Processing').length}</Text>
					<Text style={styles.statLabel}>Processing</Text>
				</View>
				<View style={[styles.statCard, { backgroundColor: '#10b981' }]}>
					<Text style={styles.statNumber}>{prescriptions.filter(p => p.status === 'Ready').length}</Text>
					<Text style={styles.statLabel}>Ready</Text>
				</View>
			</View>

			<FlatList
				data={filteredPrescriptions}
				renderItem={renderPrescriptionItem}
				keyExtractor={item => item.id}
				style={styles.prescriptionsList}
				showsVerticalScrollIndicator={false}
			/>

			{renderPrescriptionDetails()}
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
		paddingVertical: 15,
		paddingHorizontal: 20,
		backgroundColor: '#84cc16',
	},
	backButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: 'white',
		flex: 1,
		textAlign: 'center',
		marginHorizontal: 15,
	},
	scanButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	searchContainer: {
		paddingHorizontal: 20,
		paddingVertical: 15,
	},
	searchBox: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 12,
		paddingHorizontal: 15,
		paddingVertical: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	searchInput: {
		flex: 1,
		marginLeft: 10,
		fontSize: 16,
		color: '#374151',
	},
	statusFilter: {
		paddingHorizontal: 20,
		paddingBottom: 15,
	},
	statusButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginRight: 10,
		backgroundColor: 'white',
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	activeStatusButton: {
		backgroundColor: '#84cc16',
		borderColor: '#84cc16',
	},
	statusButtonText: {
		fontSize: 14,
		color: '#374151',
		fontWeight: '500',
	},
	activeStatusButtonText: {
		color: 'white',
	},
	statsRow: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		paddingBottom: 15,
		justifyContent: 'space-between',
	},
	statCard: {
		flex: 1,
		padding: 15,
		borderRadius: 12,
		alignItems: 'center',
		marginHorizontal: 5,
	},
	statNumber: {
		fontSize: 24,
		fontWeight: '700',
		color: 'white',
	},
	statLabel: {
		fontSize: 12,
		color: 'rgba(255,255,255,0.9)',
		marginTop: 2,
	},
	prescriptionsList: {
		flex: 1,
		paddingHorizontal: 20,
	},
	prescriptionItem: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	prescriptionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	prescriptionInfo: {
		flex: 1,
	},
	prescriptionId: {
		fontSize: 16,
		fontWeight: '700',
		color: '#1f2937',
		marginBottom: 2,
	},
	patientName: {
		fontSize: 15,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 2,
	},
	doctorName: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 2,
	},
	department: {
		fontSize: 12,
		color: '#84cc16',
		fontWeight: '500',
	},
	statusContainer: {
		alignItems: 'flex-end',
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginBottom: 5,
	},
	statusText: {
		color: 'white',
		fontSize: 11,
		fontWeight: '600',
	},
	priorityBadge: {
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 6,
	},
	priorityText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '600',
	},
	prescriptionDetails: {
		marginBottom: 10,
	},
	detailRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 5,
	},
	detailText: {
		fontSize: 12,
		color: '#6b7280',
		marginLeft: 8,
	},
	warningBanner: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fef3c7',
		padding: 10,
		borderRadius: 8,
		marginBottom: 10,
	},
	warningText: {
		fontSize: 12,
		color: '#92400e',
		marginLeft: 8,
		fontWeight: '500',
	},
	actionButtons: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 10,
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
		paddingTop: 10,
	},
	actionButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
	},
	actionButtonText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '600',
	},
	modalContainer: {
		flex: 1,
		backgroundColor: 'white',
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
	},
	modalContent: {
		flex: 1,
		padding: 20,
	},
	patientSection: {
		marginBottom: 20,
		padding: 15,
		backgroundColor: '#f9fafb',
		borderRadius: 12,
	},
	doctorSection: {
		marginBottom: 20,
		padding: 15,
		backgroundColor: '#f0f9ff',
		borderRadius: 12,
	},
	medicationsSection: {
		marginBottom: 20,
	},
	instructionsSection: {
		marginBottom: 20,
		padding: 15,
		backgroundColor: '#f0fdf4',
		borderRadius: 12,
	},
	billingSection: {
		padding: 15,
		backgroundColor: '#fef3c7',
		borderRadius: 12,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 10,
	},
	patientDetail: {
		fontSize: 14,
		color: '#374151',
		marginBottom: 5,
	},
	doctorDetail: {
		fontSize: 14,
		color: '#374151',
		marginBottom: 5,
	},
	medicationItem: {
		backgroundColor: 'white',
		padding: 12,
		borderRadius: 8,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	medicationHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	medicationName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
		flex: 1,
	},
	availabilityBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	availabilityText: {
		fontSize: 10,
		color: 'white',
		fontWeight: '600',
	},
	medicationDetail: {
		fontSize: 12,
		color: '#6b7280',
		marginBottom: 2,
	},
	instructionsText: {
		fontSize: 14,
		color: '#374151',
		lineHeight: 20,
	},
	billingRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	billingLabel: {
		fontSize: 14,
		color: '#374151',
	},
	billingLabelBold: {
		fontSize: 14,
		color: '#1f2937',
		fontWeight: '600',
	},
	billingValue: {
		fontSize: 14,
		color: '#374151',
	},
	billingValueBold: {
		fontSize: 14,
		color: '#1f2937',
		fontWeight: '600',
	},
});

export default PrescriptionProcessing;