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

const PathologyTestManagement = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('All');
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [selectedTest, setSelectedTest] = useState(null);

	const [testOrders, setTestOrders] = useState([
		{
			id: 'LAB001',
			patientName: 'Sarah Johnson',
			patientId: 'P12345',
			doctorName: 'Dr. Smith',
			department: 'Cardiology',
			orderDate: '2024-01-15',
			status: 'Sample Collected',
			priority: 'Normal',
			tests: [
				{ name: 'Complete Blood Count (CBC)', price: 300, status: 'In Progress' },
				{ name: 'Lipid Profile', price: 450, status: 'Completed' },
				{ name: 'Liver Function Test', price: 400, status: 'Pending' }
			],
			sampleType: 'Blood',
			expectedTime: '2-4 hours',
			totalAmount: 1150.00,
			insuranceApplicable: true,
			insuranceType: 'CGHS',
			reportGeneratedBy: null,
			reportDate: null
		},
		{
			id: 'LAB002',
			patientName: 'Mike Davis',
			patientId: 'P12346',
			doctorName: 'Dr. Williams',
			department: 'Endocrinology',
			orderDate: '2024-01-15',
			status: 'Report Ready',
			priority: 'High',
			tests: [
				{ name: 'HbA1c', price: 350, status: 'Completed' },
				{ name: 'Fasting Blood Sugar', price: 150, status: 'Completed' },
				{ name: 'Post Prandial Sugar', price: 150, status: 'Completed' }
			],
			sampleType: 'Blood',
			expectedTime: '1-2 hours',
			totalAmount: 650.00,
			insuranceApplicable: false,
			insuranceType: null,
			reportGeneratedBy: 'Dr. Lab Tech',
			reportDate: '2024-01-15'
		},
		{
			id: 'LAB003',
			patientName: 'Emily Brown',
			patientId: 'P12347',
			doctorName: 'Dr. Johnson',
			department: 'General Medicine',
			orderDate: '2024-01-14',
			status: 'Sample Required',
			priority: 'Normal',
			tests: [
				{ name: 'Urine Routine', price: 200, status: 'Pending' },
				{ name: 'Thyroid Function Test', price: 500, status: 'Pending' }
			],
			sampleType: 'Urine, Blood',
			expectedTime: '3-5 hours',
			totalAmount: 700.00,
			insuranceApplicable: true,
			insuranceType: 'ECHS',
			reportGeneratedBy: null,
			reportDate: null
		},
		{
			id: 'LAB004',
			patientName: 'Alex Wilson',
			patientId: 'P12348',
			doctorName: 'Dr. Martinez',
			department: 'Nephrology',
			orderDate: '2024-01-14',
			status: 'Report Delivered',
			priority: 'High',
			tests: [
				{ name: 'Kidney Function Test', price: 600, status: 'Completed' },
				{ name: 'Electrolyte Panel', price: 400, status: 'Completed' }
			],
			sampleType: 'Blood',
			expectedTime: '2-3 hours',
			totalAmount: 1000.00,
			insuranceApplicable: true,
			insuranceType: 'Railways',
			reportGeneratedBy: 'Dr. Lab Tech',
			reportDate: '2024-01-14'
		}
	]);

	const statusOptions = ['All', 'Sample Required', 'Sample Collected', 'In Progress', 'Report Ready', 'Report Delivered'];

	const getStatusColor = (status) => {
		switch (status) {
			case 'Sample Required': return '#f59e0b';
			case 'Sample Collected': return '#3b82f6';
			case 'In Progress': return '#8b5cf6';
			case 'Report Ready': return '#10b981';
			case 'Report Delivered': return '#6b7280';
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

	const filteredTests = testOrders.filter(test =>
		(selectedStatus === 'All' || test.status === selectedStatus) &&
		(test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
		test.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
		test.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
		test.tests.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())))
	);

	const handleStatusUpdate = (testId, newStatus) => {
		setTestOrders(prev => prev.map(test =>
			test.id === testId
				? { ...test, status: newStatus, reportDate: newStatus === 'Report Ready' ? new Date().toISOString().split('T')[0] : test.reportDate }
				: test
		));
		Alert.alert('Success', `Test ${testId} status updated to ${newStatus}`);
	};

	const handleGenerateReport = (testId) => {
		Alert.alert(
			'Generate Report',
			'Are you sure you want to generate the test report?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Generate',
					onPress: () => handleStatusUpdate(testId, 'Report Ready')
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

	const renderTestItem = ({ item }) => {
		const completedTests = item.tests.filter(test => test.status === 'Completed').length;
		const totalTests = item.tests.length;
		const isComplete = completedTests === totalTests;

		return (
			<TouchableOpacity
				style={styles.testItem}
				onPress={() => {
					setSelectedTest(item);
					setShowDetailsModal(true);
				}}
			>
				<View style={styles.testHeader}>
					<View style={styles.testInfo}>
						<Text style={styles.testId}>{item.id}</Text>
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

				<View style={styles.testDetails}>
					<View style={styles.detailRow}>
						<FontAwesome5 name="calendar" size={12} color="#6b7280" />
						<Text style={styles.detailText}>Ordered: {item.orderDate}</Text>
					</View>
					<View style={styles.detailRow}>
						<FontAwesome5 name="vial" size={12} color="#6b7280" />
						<Text style={styles.detailText}>Sample: {item.sampleType}</Text>
					</View>
					<View style={styles.detailRow}>
						<FontAwesome5 name="clock" size={12} color="#6b7280" />
						<Text style={styles.detailText}>Expected: {item.expectedTime}</Text>
					</View>
					<View style={styles.detailRow}>
						<FontAwesome5 name="list" size={12} color="#6b7280" />
						<Text style={styles.detailText}>Tests: {completedTests}/{totalTests} completed</Text>
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

				<View style={styles.progressContainer}>
					<View style={styles.progressBar}>
						<View style={[styles.progressFill, { width: `${(completedTests / totalTests) * 100}%` }]} />
					</View>
					<Text style={styles.progressText}>{completedTests}/{totalTests} tests</Text>
				</View>

				<View style={styles.actionButtons}>
					{item.status === 'Sample Required' && (
						<TouchableOpacity
							style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
							onPress={() => handleStatusUpdate(item.id, 'Sample Collected')}
						>
							<Text style={styles.actionButtonText}>Mark Collected</Text>
						</TouchableOpacity>
					)}
					{item.status === 'Sample Collected' && (
						<TouchableOpacity
							style={[styles.actionButton, { backgroundColor: '#8b5cf6' }]}
							onPress={() => handleStatusUpdate(item.id, 'In Progress')}
						>
							<Text style={styles.actionButtonText}>Start Processing</Text>
						</TouchableOpacity>
					)}
					{item.status === 'In Progress' && isComplete && (
						<TouchableOpacity
							style={[styles.actionButton, { backgroundColor: '#10b981' }]}
							onPress={() => handleGenerateReport(item.id)}
						>
							<Text style={styles.actionButtonText}>Generate Report</Text>
						</TouchableOpacity>
					)}
					{item.status === 'Report Ready' && (
						<TouchableOpacity
							style={[styles.actionButton, { backgroundColor: '#84cc16' }]}
							onPress={() => handleStatusUpdate(item.id, 'Report Delivered')}
						>
							<Text style={styles.actionButtonText}>Mark Delivered</Text>
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

	const renderTestDetails = () => {
		if (!selectedTest) return null;

		const insuranceCoverage = selectedTest.insuranceApplicable
			? calculateInsuranceCoverage(selectedTest.totalAmount, selectedTest.insuranceType)
			: 0;
		const patientPayable = selectedTest.totalAmount - insuranceCoverage;

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
						<Text style={styles.modalTitle}>Test Order Details</Text>
						<TouchableOpacity>
							<FontAwesome5 name="print" size={20} color="#84cc16" />
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.modalContent}>
						<View style={styles.patientSection}>
							<Text style={styles.sectionTitle}>Patient Information</Text>
							<Text style={styles.patientDetail}>Name: {selectedTest.patientName}</Text>
							<Text style={styles.patientDetail}>ID: {selectedTest.patientId}</Text>
							<Text style={styles.patientDetail}>Order ID: {selectedTest.id}</Text>
						</View>

						<View style={styles.doctorSection}>
							<Text style={styles.sectionTitle}>Ordering Doctor</Text>
							<Text style={styles.doctorDetail}>{selectedTest.doctorName}</Text>
							<Text style={styles.doctorDetail}>{selectedTest.department}</Text>
							<Text style={styles.doctorDetail}>Date: {selectedTest.orderDate}</Text>
						</View>

						<View style={styles.testsSection}>
							<Text style={styles.sectionTitle}>Tests Ordered</Text>
							{selectedTest.tests.map((test, index) => (
								<View key={index} style={styles.testDetailItem}>
									<View style={styles.testDetailHeader}>
										<Text style={styles.testName}>{test.name}</Text>
										<View style={[
											styles.testStatusBadge,
											{ backgroundColor: test.status === 'Completed' ? '#10b981' : test.status === 'In Progress' ? '#8b5cf6' : '#f59e0b' }
										]}>
											<Text style={styles.testStatusText}>{test.status}</Text>
										</View>
									</View>
									<Text style={styles.testPrice}>Price: ₹{test.price}</Text>
								</View>
							))}
						</View>

						<View style={styles.sampleSection}>
							<Text style={styles.sectionTitle}>Sample Information</Text>
							<View style={styles.sampleRow}>
								<Text style={styles.sampleLabel}>Sample Type:</Text>
								<Text style={styles.sampleValue}>{selectedTest.sampleType}</Text>
							</View>
							<View style={styles.sampleRow}>
								<Text style={styles.sampleLabel}>Expected Time:</Text>
								<Text style={styles.sampleValue}>{selectedTest.expectedTime}</Text>
							</View>
							<View style={styles.sampleRow}>
								<Text style={styles.sampleLabel}>Priority:</Text>
								<Text style={[styles.sampleValue, { color: getPriorityColor(selectedTest.priority) }]}>
									{selectedTest.priority}
								</Text>
							</View>
						</View>

						<View style={styles.billingSection}>
							<Text style={styles.sectionTitle}>Billing Information</Text>
							<View style={styles.billingRow}>
								<Text style={styles.billingLabel}>Total Amount:</Text>
								<Text style={styles.billingValue}>₹{selectedTest.totalAmount.toFixed(2)}</Text>
							</View>
							{selectedTest.insuranceApplicable && (
								<>
									<View style={styles.billingRow}>
										<Text style={styles.billingLabel}>Insurance ({selectedTest.insuranceType}):</Text>
										<Text style={styles.billingValue}>-₹{insuranceCoverage.toFixed(2)}</Text>
									</View>
									<View style={styles.billingRow}>
										<Text style={styles.billingLabelBold}>Patient Payable:</Text>
										<Text style={styles.billingValueBold}>₹{patientPayable.toFixed(2)}</Text>
									</View>
								</>
							)}
						</View>

						{selectedTest.reportDate && (
							<View style={styles.reportSection}>
								<Text style={styles.sectionTitle}>Report Information</Text>
								<View style={styles.reportRow}>
									<Text style={styles.reportLabel}>Generated By:</Text>
									<Text style={styles.reportValue}>{selectedTest.reportGeneratedBy}</Text>
								</View>
								<View style={styles.reportRow}>
									<Text style={styles.reportLabel}>Report Date:</Text>
									<Text style={styles.reportValue}>{selectedTest.reportDate}</Text>
								</View>
							</View>
						)}
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
				<Text style={styles.headerTitle}>Pathology Tests</Text>
				<TouchableOpacity style={styles.addButton}>
					<MaterialIcons name="add" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<View style={styles.searchContainer}>
				<View style={styles.searchBox}>
					<MaterialIcons name="search" size={20} color="#6b7280" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search tests, patients, doctors..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
			</View>

			{renderStatusFilter()}

			<View style={styles.statsRow}>
				<View style={[styles.statCard, { backgroundColor: '#f59e0b' }]}>
					<Text style={styles.statNumber}>{testOrders.filter(t => t.status === 'Sample Required').length}</Text>
					<Text style={styles.statLabel}>Sample Required</Text>
				</View>
				<View style={[styles.statCard, { backgroundColor: '#8b5cf6' }]}>
					<Text style={styles.statNumber}>{testOrders.filter(t => t.status === 'In Progress').length}</Text>
					<Text style={styles.statLabel}>In Progress</Text>
				</View>
				<View style={[styles.statCard, { backgroundColor: '#10b981' }]}>
					<Text style={styles.statNumber}>{testOrders.filter(t => t.status === 'Report Ready').length}</Text>
					<Text style={styles.statLabel}>Report Ready</Text>
				</View>
			</View>

			<FlatList
				data={filteredTests}
				renderItem={renderTestItem}
				keyExtractor={item => item.id}
				style={styles.testsList}
				showsVerticalScrollIndicator={false}
			/>

			{renderTestDetails()}
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
		backgroundColor: '#8b5cf6',
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
	addButton: {
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
		backgroundColor: '#8b5cf6',
		borderColor: '#8b5cf6',
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
		textAlign: 'center',
	},
	testsList: {
		flex: 1,
		paddingHorizontal: 20,
	},
	testItem: {
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
	testHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	testInfo: {
		flex: 1,
	},
	testId: {
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
		color: '#8b5cf6',
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
	testDetails: {
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
	progressContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	progressBar: {
		flex: 1,
		height: 6,
		backgroundColor: '#e5e7eb',
		borderRadius: 3,
		overflow: 'hidden',
		marginRight: 10,
	},
	progressFill: {
		height: '100%',
		backgroundColor: '#8b5cf6',
	},
	progressText: {
		fontSize: 12,
		color: '#6b7280',
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
	testsSection: {
		marginBottom: 20,
	},
	sampleSection: {
		marginBottom: 20,
		padding: 15,
		backgroundColor: '#f0fdf4',
		borderRadius: 12,
	},
	billingSection: {
		marginBottom: 20,
		padding: 15,
		backgroundColor: '#fef3c7',
		borderRadius: 12,
	},
	reportSection: {
		padding: 15,
		backgroundColor: '#ede9fe',
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
	testDetailItem: {
		backgroundColor: 'white',
		padding: 12,
		borderRadius: 8,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	testDetailHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 5,
	},
	testName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
		flex: 1,
	},
	testStatusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	testStatusText: {
		fontSize: 10,
		color: 'white',
		fontWeight: '600',
	},
	testPrice: {
		fontSize: 12,
		color: '#6b7280',
	},
	sampleRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	sampleLabel: {
		fontSize: 14,
		color: '#374151',
	},
	sampleValue: {
		fontSize: 14,
		color: '#1f2937',
		fontWeight: '500',
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
	reportRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	reportLabel: {
		fontSize: 14,
		color: '#374151',
	},
	reportValue: {
		fontSize: 14,
		color: '#1f2937',
		fontWeight: '500',
	},
});

export default PathologyTestManagement;