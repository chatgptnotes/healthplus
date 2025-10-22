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
	SafeAreaView,
	RefreshControl,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const PatientWiseReconciliation = (props) => {
	const [refreshing, setRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedPriority, setSelectedPriority] = useState('all');

	// Patient reconciliation data based on SOP priorities
	const [reconciliationData, setReconciliationData] = useState([
		{
			id: 'REC001',
			patientName: 'राजेश कुमार',
			patientId: 'HPE2024001',
			admissionDate: '2024-01-15',
			department: 'Cardiology',
			roomNumber: 'A-101',
			priority: 'mandatory',
			status: 'pending',
			totalBill: 45000,
			receivedAmount: 40000,
			pendingAmount: 5000,
			insuranceType: 'CGHS',
			claimStatus: 'approved',
			lastUpdated: '2024-01-20',
			reconciliationItems: [
				{ service: 'Room Charges', billed: 15000, received: 15000, status: 'cleared' },
				{ service: 'Surgery Charges', billed: 25000, received: 25000, status: 'cleared' },
				{ service: 'Medication', billed: 5000, received: 0, status: 'pending' },
			]
		},
		{
			id: 'REC002',
			patientName: 'प्रिया शर्मा',
			patientId: 'HPE2024002',
			admissionDate: '2024-01-18',
			department: 'Obstetrics',
			roomNumber: 'B-205',
			priority: 'high',
			status: 'in-progress',
			totalBill: 32000,
			receivedAmount: 30000,
			pendingAmount: 2000,
			insuranceType: 'ECHS',
			claimStatus: 'processing',
			lastUpdated: '2024-01-21',
			reconciliationItems: [
				{ service: 'Room Charges', billed: 12000, received: 12000, status: 'cleared' },
				{ service: 'Delivery Charges', billed: 18000, received: 18000, status: 'cleared' },
				{ service: 'Lab Tests', billed: 2000, received: 0, status: 'pending' },
			]
		},
		{
			id: 'REC003',
			patientName: 'अमित सिंह',
			patientId: 'HPE2024003',
			admissionDate: '2024-01-20',
			department: 'Emergency',
			roomNumber: 'ER-5',
			priority: 'medium',
			status: 'completed',
			totalBill: 18500,
			receivedAmount: 18500,
			pendingAmount: 0,
			insuranceType: 'Cash',
			claimStatus: 'n/a',
			lastUpdated: '2024-01-21',
			reconciliationItems: [
				{ service: 'Emergency Consultation', billed: 3500, received: 3500, status: 'cleared' },
				{ service: 'Diagnostic Tests', billed: 8000, received: 8000, status: 'cleared' },
				{ service: 'Treatment', billed: 7000, received: 7000, status: 'cleared' },
			]
		},
		{
			id: 'REC004',
			patientName: 'सुनीता देवी',
			patientId: 'HPE2024004',
			admissionDate: '2024-01-19',
			department: 'Surgery',
			roomNumber: 'C-301',
			priority: 'mandatory',
			status: 'pending',
			totalBill: 65000,
			receivedAmount: 50000,
			pendingAmount: 15000,
			insuranceType: 'Railways',
			claimStatus: 'submitted',
			lastUpdated: '2024-01-21',
			reconciliationItems: [
				{ service: 'Surgery Charges', billed: 45000, received: 45000, status: 'cleared' },
				{ service: 'Post-op Care', billed: 12000, received: 5000, status: 'partial' },
				{ service: 'Medications', billed: 8000, received: 0, status: 'pending' },
			]
		}
	]);

	// Priority levels based on SOP
	const priorityLevels = {
		mandatory: {
			color: '#dc2626',
			label: '🔴 Mandatory Patient-Wise Reconciliation (Top Priority)',
			description: 'Critical reconciliation requiring immediate attention'
		},
		high: {
			color: '#f59e0b',
			label: '🔶 Integrated Ledger Maintenance (High Priority)',
			description: 'High priority reconciliation tasks'
		},
		medium: {
			color: '#10b981',
			label: '🟡 Recovery and Claim Management (Medium Priority)',
			description: 'Medium priority reconciliation items'
		},
		low: {
			color: '#6b7280',
			label: '🔵 Efficiency and Delay Tracking (Strategic Planning)',
			description: 'Low priority tracking items'
		}
	};

	useEffect(() => {
		// Auto-refresh every 5 minutes for real-time data
		const interval = setInterval(() => {
			onRefresh();
		}, 300000);
		return () => clearInterval(interval);
	}, []);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		// Simulate API call to fetch latest reconciliation data
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}, []);

	const filteredData = reconciliationData.filter(item => {
		const matchesSearch = item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.department.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;

		return matchesSearch && matchesPriority;
	});

	const getPriorityColor = (priority) => {
		return priorityLevels[priority]?.color || '#6b7280';
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'completed': return '#10b981';
			case 'in-progress': return '#f59e0b';
			case 'pending': return '#dc2626';
			default: return '#6b7280';
		}
	};

	const renderReconciliationCard = ({ item }) => (
		<TouchableOpacity
			style={[styles.reconciliationCard, {
				borderLeftColor: getPriorityColor(item.priority),
				borderLeftWidth: 4
			}]}
			onPress={() => showReconciliationDetails(item)}
		>
			<View style={styles.cardHeader}>
				<View style={styles.patientInfo}>
					<Text style={styles.patientName}>{item.patientName}</Text>
					<Text style={styles.patientId}>ID: {item.patientId}</Text>
					<Text style={styles.department}>{item.department} - {item.roomNumber}</Text>
				</View>
				<View style={styles.statusContainer}>
					<View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
						<Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
					</View>
					<View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
						<Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
					</View>
				</View>
			</View>

			<View style={styles.financialInfo}>
				<View style={styles.amountRow}>
					<Text style={styles.label}>Total Bill:</Text>
					<Text style={styles.amount}>₹{item.totalBill.toLocaleString()}</Text>
				</View>
				<View style={styles.amountRow}>
					<Text style={styles.label}>Received:</Text>
					<Text style={[styles.amount, { color: '#10b981' }]}>₹{item.receivedAmount.toLocaleString()}</Text>
				</View>
				<View style={styles.amountRow}>
					<Text style={styles.label}>Pending:</Text>
					<Text style={[styles.amount, {
						color: item.pendingAmount > 0 ? '#dc2626' : '#10b981'
					}]}>₹{item.pendingAmount.toLocaleString()}</Text>
				</View>
			</View>

			<View style={styles.cardFooter}>
				<View style={styles.insuranceInfo}>
					<MaterialIcons name="local-hospital" size={16} color="#6b7280" />
					<Text style={styles.insuranceText}>{item.insuranceType}</Text>
					<Text style={styles.claimStatus}>({item.claimStatus})</Text>
				</View>
				<Text style={styles.lastUpdated}>Updated: {item.lastUpdated}</Text>
			</View>
		</TouchableOpacity>
	);

	const showReconciliationDetails = (item) => {
		const itemsDetails = item.reconciliationItems.map((service, index) =>
			`${index + 1}. ${service.service}\n   Billed: ₹${service.billed.toLocaleString()}\n   Received: ₹${service.received.toLocaleString()}\n   Status: ${service.status.toUpperCase()}`
		).join('\n\n');

		Alert.alert(
			`${item.patientName} - Reconciliation Details`,
			`Patient ID: ${item.patientId}\nDepartment: ${item.department}\nRoom: ${item.roomNumber}\n\nFinancial Summary:\nTotal Bill: ₹${item.totalBill.toLocaleString()}\nReceived: ₹${item.receivedAmount.toLocaleString()}\nPending: ₹${item.pendingAmount.toLocaleString()}\n\nInsurance: ${item.insuranceType} (${item.claimStatus})\n\nService Breakdown:\n${itemsDetails}`,
			[
				{ text: 'Update Reconciliation', onPress: () => updateReconciliation(item.id) },
				{ text: 'Generate Report', onPress: () => generateReconciliationReport(item.id) },
				{ text: 'OK' }
			]
		);
	};

	const updateReconciliation = (itemId) => {
		Alert.alert(
			'Update Reconciliation',
			'Choose action to update reconciliation status:',
			[
				{ text: 'Mark Payment Received', onPress: () => markPaymentReceived(itemId) },
				{ text: 'Update Insurance Claim', onPress: () => updateInsuranceClaim(itemId) },
				{ text: 'Add Adjustment', onPress: () => addAdjustment(itemId) },
				{ text: 'Cancel', style: 'cancel' }
			]
		);
	};

	const markPaymentReceived = (itemId) => {
		setReconciliationData(prevData =>
			prevData.map(item =>
				item.id === itemId
					? {
						...item,
						status: 'completed',
						receivedAmount: item.totalBill,
						pendingAmount: 0,
						lastUpdated: new Date().toISOString().split('T')[0]
					}
					: item
			)
		);
		Alert.alert('Success', 'Payment marked as received and reconciliation completed.');
	};

	const updateInsuranceClaim = (itemId) => {
		Alert.alert('Insurance Claim Update', 'Insurance claim status has been updated.');
	};

	const addAdjustment = (itemId) => {
		Alert.alert('Add Adjustment', 'Adjustment has been added to the reconciliation.');
	};

	const generateReconciliationReport = (itemId) => {
		Alert.alert('Report Generated', 'Patient-wise reconciliation report has been generated and saved.');
	};

	const renderPriorityFilter = (priority, data) => (
		<TouchableOpacity
			key={priority}
			style={[
				styles.priorityButton,
				selectedPriority === priority && styles.activePriorityButton,
				{ borderColor: priorityLevels[priority]?.color || '#6b7280' }
			]}
			onPress={() => setSelectedPriority(priority)}
		>
			<Text style={[
				styles.priorityButtonText,
				selectedPriority === priority && styles.activePriorityButtonText,
				{ color: priorityLevels[priority]?.color || '#6b7280' }
			]}>
				{priority.toUpperCase()}
			</Text>
			<Text style={styles.priorityCount}>
				{data.filter(item => item.priority === priority).length}
			</Text>
		</TouchableOpacity>
	);

	const totalPending = reconciliationData.reduce((sum, item) => sum + item.pendingAmount, 0);
	const completedCount = reconciliationData.filter(item => item.status === 'completed').length;
	const pendingCount = reconciliationData.filter(item => item.status === 'pending').length;

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => props.navigation.goBack()}
				>
					<MaterialIcons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Patient-wise Reconciliation</Text>
				<TouchableOpacity
					style={styles.reportButton}
					onPress={() => Alert.alert('Report', 'Generating comprehensive reconciliation report...')}
				>
					<MaterialIcons name="assessment" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<ScrollView
				style={styles.content}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				{/* Summary Cards */}
				<View style={styles.summaryContainer}>
					<View style={styles.summaryCard}>
						<Text style={styles.summaryLabel}>Total Pending</Text>
						<Text style={styles.summaryValue}>₹{totalPending.toLocaleString()}</Text>
					</View>
					<View style={styles.summaryCard}>
						<Text style={styles.summaryLabel}>Completed</Text>
						<Text style={[styles.summaryValue, { color: '#10b981' }]}>{completedCount}</Text>
					</View>
					<View style={styles.summaryCard}>
						<Text style={styles.summaryLabel}>Pending</Text>
						<Text style={[styles.summaryValue, { color: '#dc2626' }]}>{pendingCount}</Text>
					</View>
				</View>

				{/* Search Bar */}
				<View style={styles.searchContainer}>
					<MaterialIcons name="search" size={24} color="#6b7280" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search by patient name, ID, or department..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
					{searchQuery.length > 0 && (
						<TouchableOpacity onPress={() => setSearchQuery('')}>
							<MaterialIcons name="clear" size={24} color="#6b7280" />
						</TouchableOpacity>
					)}
				</View>

				{/* Priority Filters */}
				<View style={styles.filtersContainer}>
					<Text style={styles.filtersTitle}>Filter by Priority:</Text>
					<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priorityFilters}>
						<TouchableOpacity
							style={[
								styles.priorityButton,
								selectedPriority === 'all' && styles.activePriorityButton
							]}
							onPress={() => setSelectedPriority('all')}
						>
							<Text style={[
								styles.priorityButtonText,
								selectedPriority === 'all' && styles.activePriorityButtonText
							]}>
								ALL
							</Text>
							<Text style={styles.priorityCount}>{reconciliationData.length}</Text>
						</TouchableOpacity>
						{Object.keys(priorityLevels).map(priority =>
							renderPriorityFilter(priority, reconciliationData)
						)}
					</ScrollView>
				</View>

				{/* Priority Information */}
				<View style={styles.priorityInfo}>
					<Text style={styles.priorityInfoTitle}>📌 Priority-Based Reconciliation System</Text>
					{Object.entries(priorityLevels).map(([key, value]) => (
						<View key={key} style={styles.priorityInfoItem}>
							<Text style={[styles.priorityInfoLabel, { color: value.color }]}>
								{value.label}
							</Text>
							<Text style={styles.priorityInfoDesc}>{value.description}</Text>
						</View>
					))}
				</View>

				{/* Reconciliation List */}
				<View style={styles.listSection}>
					<Text style={styles.sectionTitle}>
						Reconciliation Items ({filteredData.length})
					</Text>
					<FlatList
						data={filteredData}
						renderItem={renderReconciliationCard}
						keyExtractor={item => item.id}
						scrollEnabled={false}
						showsVerticalScrollIndicator={false}
						ListEmptyComponent={
							<View style={styles.emptyState}>
								<MaterialIcons name="assignment" size={64} color="#9ca3af" />
								<Text style={styles.emptyStateText}>No reconciliation items found</Text>
								<Text style={styles.emptyStateSubtext}>
									Try adjusting your search criteria or priority filter
								</Text>
							</View>
						}
					/>
				</View>
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
		backgroundColor: '#10b981',
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
	},
	backButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: 'white',
		textAlign: 'center',
		flex: 1,
	},
	reportButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	summaryContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	summaryCard: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		flex: 0.32,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	summaryLabel: {
		fontSize: 12,
		color: '#6b7280',
		marginBottom: 5,
	},
	summaryValue: {
		fontSize: 18,
		fontWeight: '700',
		color: '#1f2937',
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 12,
		paddingHorizontal: 15,
		paddingVertical: 12,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		marginLeft: 10,
		color: '#374151',
	},
	filtersContainer: {
		marginBottom: 20,
	},
	filtersTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 10,
	},
	priorityFilters: {
		flexDirection: 'row',
	},
	priorityButton: {
		backgroundColor: 'white',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginRight: 10,
		borderWidth: 1,
		borderColor: '#e5e7eb',
		alignItems: 'center',
	},
	activePriorityButton: {
		backgroundColor: '#f0fdf4',
		borderColor: '#10b981',
	},
	priorityButtonText: {
		fontSize: 12,
		fontWeight: '500',
	},
	activePriorityButtonText: {
		color: '#10b981',
	},
	priorityCount: {
		fontSize: 10,
		color: '#6b7280',
		marginTop: 2,
	},
	priorityInfo: {
		backgroundColor: '#fef3c7',
		padding: 15,
		borderRadius: 12,
		marginBottom: 20,
	},
	priorityInfoTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#92400e',
		marginBottom: 10,
	},
	priorityInfoItem: {
		marginBottom: 8,
	},
	priorityInfoLabel: {
		fontSize: 14,
		fontWeight: '500',
		marginBottom: 2,
	},
	priorityInfoDesc: {
		fontSize: 12,
		color: '#92400e',
	},
	listSection: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 15,
	},
	reconciliationCard: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	patientInfo: {
		flex: 1,
	},
	patientName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	patientId: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 2,
	},
	department: {
		fontSize: 12,
		color: '#10b981',
	},
	statusContainer: {
		alignItems: 'flex-end',
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginBottom: 4,
	},
	statusText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
	},
	priorityBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	priorityText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
	},
	financialInfo: {
		marginBottom: 10,
	},
	amountRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 3,
	},
	label: {
		fontSize: 14,
		color: '#6b7280',
	},
	amount: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
	},
	cardFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 10,
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
	},
	insuranceInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	insuranceText: {
		fontSize: 12,
		color: '#6b7280',
		marginLeft: 4,
	},
	claimStatus: {
		fontSize: 12,
		color: '#10b981',
		marginLeft: 4,
	},
	lastUpdated: {
		fontSize: 10,
		color: '#9ca3af',
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 60,
	},
	emptyStateText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#6b7280',
		marginTop: 15,
		marginBottom: 5,
	},
	emptyStateSubtext: {
		fontSize: 14,
		color: '#9ca3af',
		textAlign: 'center',
		paddingHorizontal: 40,
	},
});

export default PatientWiseReconciliation;