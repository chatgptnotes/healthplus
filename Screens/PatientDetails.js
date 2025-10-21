import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
	SafeAreaView,
	Alert,
	Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const PatientDetails = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState('overview');

	// Mock patient data - in real app this would come from route params or Redux store
	const [patient, setPatient] = useState({
		id: 'P001',
		firstName: 'John',
		lastName: 'Doe',
		middleName: 'William',
		dateOfBirth: '1989-05-15',
		age: 35,
		gender: 'Male',
		bloodGroup: 'B+',
		maritalStatus: 'Married',
		phoneNumber: '9876543210',
		alternatePhone: '9876543211',
		email: 'john.doe@email.com',
		address: '123 Main Street, Apartment 4B, Downtown Area',
		city: 'Mumbai',
		state: 'Maharashtra',
		pincode: '400001',
		emergencyContactName: 'Jane Doe',
		emergencyContactPhone: '9876543211',
		emergencyContactRelation: 'Spouse',
		insuranceType: 'CGHS',
		insuranceProvider: 'Central Government Health Scheme',
		policyNumber: 'CGHS123456789',
		occupation: 'Software Engineer',
		employer: 'Tech Solutions Ltd.',
		status: 'Outpatient',
		lastVisit: '2024-01-15',
		nextAppointment: '2024-01-25',
		department: 'Cardiology',
		assignedDoctor: 'Dr. Smith',
		roomNumber: null,
		allergies: 'Penicillin, Shellfish',
		chronicConditions: 'Hypertension, Diabetes Type 2',
		currentMedications: 'Metformin 500mg BD, Lisinopril 10mg OD',
		previousSurgeries: 'Appendectomy (2015)',
		registrationDate: '2020-03-10',
		totalVisits: 15,
		outstandingBills: 2500,
		lastBillingDate: '2024-01-15'
	});

	const [medicalHistory, setMedicalHistory] = useState([
		{
			id: '1',
			date: '2024-01-15',
			type: 'Consultation',
			doctor: 'Dr. Smith',
			department: 'Cardiology',
			diagnosis: 'Hypertension follow-up',
			prescription: 'Continue current medications',
			nextVisit: '2024-02-15'
		},
		{
			id: '2',
			date: '2023-12-10',
			type: 'Lab Test',
			doctor: 'Dr. Smith',
			department: 'Pathology',
			diagnosis: 'Blood sugar monitoring',
			prescription: 'HbA1c: 7.2%, Blood glucose: 140 mg/dL',
			nextVisit: null
		},
		{
			id: '3',
			date: '2023-11-05',
			type: 'Emergency',
			doctor: 'Dr. Johnson',
			department: 'Emergency',
			diagnosis: 'Chest pain evaluation',
			prescription: 'ECG normal, discharged with follow-up',
			nextVisit: '2023-11-12'
		}
	]);

	const [appointments, setAppointments] = useState([
		{
			id: '1',
			date: '2024-01-25',
			time: '10:00 AM',
			doctor: 'Dr. Smith',
			department: 'Cardiology',
			type: 'Follow-up',
			status: 'Scheduled'
		},
		{
			id: '2',
			date: '2024-02-15',
			time: '2:30 PM',
			doctor: 'Dr. Smith',
			department: 'Cardiology',
			type: 'Routine Check-up',
			status: 'Scheduled'
		}
	]);

	const [billingHistory, setBillingHistory] = useState([
		{
			id: '1',
			date: '2024-01-15',
			amount: 1500,
			description: 'Consultation + Medications',
			status: 'Paid',
			paymentMethod: 'Insurance'
		},
		{
			id: '2',
			date: '2024-01-10',
			amount: 2500,
			description: 'Lab Tests + Consultation',
			status: 'Pending',
			paymentMethod: 'Cash'
		}
	]);

	const callPatient = () => {
		const phoneUrl = `tel:${patient.phoneNumber}`;
		Linking.openURL(phoneUrl);
	};

	const callEmergencyContact = () => {
		const phoneUrl = `tel:${patient.emergencyContactPhone}`;
		Linking.openURL(phoneUrl);
	};

	const sendEmail = () => {
		const emailUrl = `mailto:${patient.email}`;
		Linking.openURL(emailUrl);
	};

	const editPatient = () => {
		// Navigate to edit patient screen
		// props.navigation.navigate('EditPatient', { patient });
		Alert.alert('Edit Patient', 'Navigate to edit patient screen');
	};

	const scheduleAppointment = () => {
		// Navigate to appointment scheduling
		// props.navigation.navigate('BookAppointment', { patient });
		Alert.alert('Schedule Appointment', 'Navigate to appointment booking screen');
	};

	const viewMedicalRecords = () => {
		// Navigate to medical records
		Alert.alert('Medical Records', 'Navigate to detailed medical records screen');
	};

	const processPayment = () => {
		// Navigate to payment processing
		Alert.alert('Process Payment', 'Navigate to billing and payment screen');
	};

	const renderTabButton = (tab, label, icon) => (
		<TouchableOpacity
			style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
			onPress={() => setActiveTab(tab)}
		>
			<MaterialIcons
				name={icon}
				size={20}
				color={activeTab === tab ? '#10b981' : '#6b7280'}
			/>
			<Text style={[
				styles.tabButtonText,
				activeTab === tab && styles.activeTabButtonText
			]}>
				{label}
			</Text>
		</TouchableOpacity>
	);

	const renderInfoRow = (label, value, icon = null, action = null) => (
		<View style={styles.infoRow}>
			<View style={styles.infoLabel}>
				{icon && <MaterialIcons name={icon} size={18} color="#6b7280" />}
				<Text style={styles.infoLabelText}>{label}</Text>
			</View>
			<View style={styles.infoValueContainer}>
				<Text style={styles.infoValue}>{value || 'Not provided'}</Text>
				{action && (
					<TouchableOpacity onPress={action} style={styles.actionButton}>
						<MaterialIcons name="open-in-new" size={16} color="#10b981" />
					</TouchableOpacity>
				)}
			</View>
		</View>
	);

	const renderOverviewTab = () => (
		<ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
			{/* Patient Summary */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Patient Summary</Text>
				<View style={styles.summaryCard}>
					<View style={styles.summaryHeader}>
						<View>
							<Text style={styles.patientName}>
								{patient.firstName} {patient.middleName} {patient.lastName}
							</Text>
							<Text style={styles.patientId}>ID: {patient.id}</Text>
						</View>
						<View style={styles.patientBadges}>
							<View style={[styles.statusBadge, { backgroundColor: '#10b981' }]}>
								<Text style={styles.statusText}>{patient.status}</Text>
							</View>
							<Text style={styles.bloodGroup}>{patient.bloodGroup}</Text>
						</View>
					</View>

					<View style={styles.summaryDetails}>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Age</Text>
							<Text style={styles.summaryValue}>{patient.age} years</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Gender</Text>
							<Text style={styles.summaryValue}>{patient.gender}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Department</Text>
							<Text style={styles.summaryValue}>{patient.department}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Doctor</Text>
							<Text style={styles.summaryValue}>{patient.assignedDoctor}</Text>
						</View>
						{patient.roomNumber && (
							<View style={styles.summaryRow}>
								<Text style={styles.summaryLabel}>Room</Text>
								<Text style={styles.summaryValue}>{patient.roomNumber}</Text>
							</View>
						)}
					</View>
				</View>
			</View>

			{/* Quick Actions */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Quick Actions</Text>
				<View style={styles.quickActions}>
					<TouchableOpacity style={styles.quickActionButton} onPress={callPatient}>
						<MaterialIcons name="phone" size={24} color="#10b981" />
						<Text style={styles.quickActionText}>Call Patient</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.quickActionButton} onPress={scheduleAppointment}>
						<MaterialIcons name="event" size={24} color="#10b981" />
						<Text style={styles.quickActionText}>Schedule</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.quickActionButton} onPress={viewMedicalRecords}>
						<MaterialIcons name="folder" size={24} color="#10b981" />
						<Text style={styles.quickActionText}>Records</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.quickActionButton} onPress={editPatient}>
						<MaterialIcons name="edit" size={24} color="#10b981" />
						<Text style={styles.quickActionText}>Edit</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Contact Information */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Contact Information</Text>
				<View style={styles.infoCard}>
					{renderInfoRow('Phone', patient.phoneNumber, 'phone', callPatient)}
					{renderInfoRow('Alternate Phone', patient.alternatePhone, 'phone')}
					{renderInfoRow('Email', patient.email, 'email', sendEmail)}
					{renderInfoRow('Address', `${patient.address}, ${patient.city}, ${patient.state} - ${patient.pincode}`, 'location-on')}
				</View>
			</View>

			{/* Emergency Contact */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Emergency Contact</Text>
				<View style={styles.infoCard}>
					{renderInfoRow('Name', patient.emergencyContactName, 'person')}
					{renderInfoRow('Phone', patient.emergencyContactPhone, 'phone', callEmergencyContact)}
					{renderInfoRow('Relationship', patient.emergencyContactRelation, 'group')}
				</View>
			</View>

			{/* Medical Summary */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Medical Summary</Text>
				<View style={styles.infoCard}>
					{renderInfoRow('Allergies', patient.allergies, 'warning')}
					{renderInfoRow('Chronic Conditions', patient.chronicConditions, 'local-hospital')}
					{renderInfoRow('Current Medications', patient.currentMedications, 'medication')}
				</View>
			</View>
		</ScrollView>
	);

	const renderMedicalTab = () => (
		<ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
			<Text style={styles.sectionTitle}>Medical History</Text>
			{medicalHistory.map((record) => (
				<View key={record.id} style={styles.recordCard}>
					<View style={styles.recordHeader}>
						<Text style={styles.recordDate}>{record.date}</Text>
						<View style={styles.recordTypeBadge}>
							<Text style={styles.recordTypeText}>{record.type}</Text>
						</View>
					</View>
					<Text style={styles.recordDoctor}>{record.doctor} - {record.department}</Text>
					<Text style={styles.recordDiagnosis}>{record.diagnosis}</Text>
					<Text style={styles.recordPrescription}>{record.prescription}</Text>
					{record.nextVisit && (
						<Text style={styles.recordNextVisit}>Next Visit: {record.nextVisit}</Text>
					)}
				</View>
			))}
		</ScrollView>
	);

	const renderAppointmentsTab = () => (
		<ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
			<Text style={styles.sectionTitle}>Upcoming Appointments</Text>
			{appointments.map((appointment) => (
				<View key={appointment.id} style={styles.appointmentCard}>
					<View style={styles.appointmentHeader}>
						<Text style={styles.appointmentDate}>{appointment.date}</Text>
						<Text style={styles.appointmentTime}>{appointment.time}</Text>
					</View>
					<Text style={styles.appointmentDoctor}>{appointment.doctor}</Text>
					<Text style={styles.appointmentDepartment}>{appointment.department}</Text>
					<View style={styles.appointmentFooter}>
						<Text style={styles.appointmentType}>{appointment.type}</Text>
						<View style={styles.appointmentStatusBadge}>
							<Text style={styles.appointmentStatusText}>{appointment.status}</Text>
						</View>
					</View>
				</View>
			))}
		</ScrollView>
	);

	const renderBillingTab = () => (
		<ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Billing Summary</Text>
				<View style={styles.billingSummary}>
					<View style={styles.billingSummaryItem}>
						<Text style={styles.billingSummaryLabel}>Outstanding Amount</Text>
						<Text style={styles.billingSummaryAmount}>₹{patient.outstandingBills}</Text>
					</View>
					<TouchableOpacity style={styles.payNowButton} onPress={processPayment}>
						<Text style={styles.payNowButtonText}>Process Payment</Text>
					</TouchableOpacity>
				</View>
			</View>

			<Text style={styles.sectionTitle}>Billing History</Text>
			{billingHistory.map((bill) => (
				<View key={bill.id} style={styles.billingCard}>
					<View style={styles.billingHeader}>
						<Text style={styles.billingDate}>{bill.date}</Text>
						<Text style={styles.billingAmount}>₹{bill.amount}</Text>
					</View>
					<Text style={styles.billingDescription}>{bill.description}</Text>
					<View style={styles.billingFooter}>
						<Text style={styles.billingMethod}>{bill.paymentMethod}</Text>
						<View style={[
							styles.billingStatusBadge,
							{ backgroundColor: bill.status === 'Paid' ? '#10b981' : '#f59e0b' }
						]}>
							<Text style={styles.billingStatusText}>{bill.status}</Text>
						</View>
					</View>
				</View>
			))}
		</ScrollView>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => props.navigation.goBack()}
				>
					<MaterialIcons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Patient Details</Text>
				<TouchableOpacity style={styles.editButton} onPress={editPatient}>
					<MaterialIcons name="edit" size={24} color="white" />
				</TouchableOpacity>
			</View>

			{/* Tab Navigation */}
			<View style={styles.tabContainer}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{renderTabButton('overview', 'Overview', 'person')}
					{renderTabButton('medical', 'Medical', 'local-hospital')}
					{renderTabButton('appointments', 'Appointments', 'event')}
					{renderTabButton('billing', 'Billing', 'payment')}
				</ScrollView>
			</View>

			{/* Tab Content */}
			<View style={styles.content}>
				{activeTab === 'overview' && renderOverviewTab()}
				{activeTab === 'medical' && renderMedicalTab()}
				{activeTab === 'appointments' && renderAppointmentsTab()}
				{activeTab === 'billing' && renderBillingTab()}
			</View>
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
		backgroundColor: '#10b981',
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
	editButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	tabContainer: {
		backgroundColor: 'white',
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#f3f4f6',
	},
	tabButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 10,
		marginRight: 15,
		borderRadius: 8,
		backgroundColor: '#f9fafb',
	},
	activeTabButton: {
		backgroundColor: '#f0fdf4',
	},
	tabButtonText: {
		fontSize: 14,
		color: '#6b7280',
		marginLeft: 8,
		fontWeight: '500',
	},
	activeTabButtonText: {
		color: '#10b981',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	tabContent: {
		flex: 1,
	},
	section: {
		marginBottom: 25,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 15,
	},
	summaryCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	summaryHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 15,
	},
	patientName: {
		fontSize: 20,
		fontWeight: '700',
		color: '#1f2937',
		marginBottom: 2,
	},
	patientId: {
		fontSize: 14,
		color: '#6b7280',
	},
	patientBadges: {
		alignItems: 'flex-end',
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginBottom: 8,
	},
	statusText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	bloodGroup: {
		fontSize: 16,
		fontWeight: '700',
		color: '#dc2626',
	},
	summaryDetails: {
		paddingTop: 15,
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
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
	quickActions: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: 'white',
		borderRadius: 12,
		paddingVertical: 20,
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
		marginTop: 8,
		fontWeight: '500',
	},
	infoCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#f9fafb',
	},
	infoLabel: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 0.4,
	},
	infoLabelText: {
		fontSize: 14,
		color: '#6b7280',
		marginLeft: 8,
	},
	infoValueContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 0.6,
	},
	infoValue: {
		fontSize: 14,
		color: '#374151',
		flex: 1,
		textAlign: 'right',
	},
	actionButton: {
		marginLeft: 8,
	},
	recordCard: {
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
	recordHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	recordDate: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
	},
	recordTypeBadge: {
		backgroundColor: '#f3f4f6',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	recordTypeText: {
		fontSize: 12,
		color: '#6b7280',
		fontWeight: '500',
	},
	recordDoctor: {
		fontSize: 14,
		color: '#10b981',
		fontWeight: '500',
		marginBottom: 4,
	},
	recordDiagnosis: {
		fontSize: 14,
		color: '#374151',
		fontWeight: '500',
		marginBottom: 4,
	},
	recordPrescription: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 4,
	},
	recordNextVisit: {
		fontSize: 12,
		color: '#f59e0b',
		fontWeight: '500',
	},
	appointmentCard: {
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
	appointmentHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	appointmentDate: {
		fontSize: 16,
		fontWeight: '600',
		color: '#374151',
	},
	appointmentTime: {
		fontSize: 14,
		color: '#10b981',
		fontWeight: '500',
	},
	appointmentDoctor: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 2,
	},
	appointmentDepartment: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 8,
	},
	appointmentFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	appointmentType: {
		fontSize: 14,
		color: '#374151',
		fontWeight: '500',
	},
	appointmentStatusBadge: {
		backgroundColor: '#10b981',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	appointmentStatusText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	billingSummary: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
		marginBottom: 15,
	},
	billingSummaryItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	billingSummaryLabel: {
		fontSize: 16,
		color: '#374151',
	},
	billingSummaryAmount: {
		fontSize: 20,
		fontWeight: '700',
		color: '#dc2626',
	},
	payNowButton: {
		backgroundColor: '#10b981',
		borderRadius: 8,
		paddingVertical: 12,
		alignItems: 'center',
	},
	payNowButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
	billingCard: {
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
	billingHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	billingDate: {
		fontSize: 14,
		color: '#6b7280',
	},
	billingAmount: {
		fontSize: 16,
		fontWeight: '600',
		color: '#374151',
	},
	billingDescription: {
		fontSize: 14,
		color: '#374151',
		marginBottom: 8,
	},
	billingFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	billingMethod: {
		fontSize: 14,
		color: '#6b7280',
	},
	billingStatusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	billingStatusText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
});

export default PatientDetails;