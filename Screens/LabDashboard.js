import React, { useState, useEffect, useCallback } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
	SafeAreaView,
	Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const LabDashboard = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	const [dashboardData, setDashboardData] = useState({
		pendingTests: 24,
		samplesCollected: 18,
		resultsReady: 12,
		urgentTests: 6,
		testQueue: [
			{ id: '1', patient: 'Rajesh Kumar', testType: 'Complete Blood Count', status: 'Sample Collected', priority: 'Urgent', doctor: 'Dr. Johnson' },
			{ id: '2', patient: 'Priya Sharma', testType: 'Lipid Profile', status: 'Processing', priority: 'Normal', doctor: 'Dr. Williams' },
			{ id: '3', patient: 'Sanjay Patel', testType: 'Thyroid Function', status: 'Pending Collection', priority: 'Normal', doctor: 'Dr. Brown' },
		],
		recentResults: [
			{ id: '1', patient: 'Neha Gupta', test: 'Blood Sugar', result: '95 mg/dL', status: 'Normal', time: '2 hours ago' },
			{ id: '2', patient: 'Ankit Singh', test: 'Hemoglobin', result: '14.2 g/dL', status: 'Normal', time: '3 hours ago' },
		],
		equipmentStatus: [
			{ id: '1', name: 'Hematology Analyzer', status: 'Online', lastMaintenance: '2 days ago' },
			{ id: '2', name: 'Chemistry Analyzer', status: 'Maintenance', lastMaintenance: 'Today' },
			{ id: '3', name: 'Microscope Station 1', status: 'Online', lastMaintenance: '1 week ago' },
		]
	});

	const renderStatCard = (title, value, icon, color, onPress) => (
		<TouchableOpacity style={[styles.statCard, { backgroundColor: color }]} onPress={onPress}>
			<View style={styles.statIconContainer}>
				<MaterialIcons name={icon} size={24} color="white" />
			</View>
			<Text style={styles.statValue}>{value}</Text>
			<Text style={styles.statTitle}>{title}</Text>
		</TouchableOpacity>
	);

	const renderTestItem = ({ item }) => (
		<View style={styles.listItem}>
			<View style={styles.listItemHeader}>
				<View>
					<Text style={styles.patientName}>{item.patient}</Text>
					<Text style={styles.testType}>{item.testType}</Text>
					<Text style={styles.doctorName}>Ordered by: {item.doctor}</Text>
				</View>
				<View style={[styles.priorityBadge, {
					backgroundColor: item.priority === 'Urgent' ? '#dc2626' : '#10b981'
				}]}>
					<Text style={styles.priorityText}>{item.priority}</Text>
				</View>
			</View>
			<View style={styles.statusContainer}>
				<Text style={[styles.status, {
					color: item.status === 'Sample Collected' ? '#10b981' :
						  item.status === 'Processing' ? '#f59e0b' : '#6b7280'
				}]}>
					{item.status}
				</Text>
			</View>
		</View>
	);

	const renderResultItem = ({ item }) => (
		<View style={styles.resultItem}>
			<View style={styles.resultHeader}>
				<Text style={styles.resultPatient}>{item.patient}</Text>
				<Text style={styles.resultTime}>{item.time}</Text>
			</View>
			<Text style={styles.resultTest}>{item.test}</Text>
			<View style={styles.resultValueContainer}>
				<Text style={styles.resultValue}>{item.result}</Text>
				<View style={[styles.resultStatusBadge, {
					backgroundColor: item.status === 'Normal' ? '#10b981' : '#ef4444'
				}]}>
					<Text style={styles.resultStatusText}>{item.status}</Text>
				</View>
			</View>
		</View>
	);

	const renderEquipmentItem = ({ item }) => (
		<View style={styles.equipmentItem}>
			<View style={styles.equipmentHeader}>
				<Text style={styles.equipmentName}>{item.name}</Text>
				<View style={[styles.equipmentStatusBadge, {
					backgroundColor: item.status === 'Online' ? '#10b981' : '#f59e0b'
				}]}>
					<Text style={styles.equipmentStatusText}>{item.status}</Text>
				</View>
			</View>
			<Text style={styles.maintenanceInfo}>Last maintenance: {item.lastMaintenance}</Text>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Laboratory</Text>
				<TouchableOpacity style={styles.qrButton}>
					<MaterialIcons name="qr-code-scanner" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Statistics Cards */}
				<View style={styles.statsContainer}>
					{renderStatCard('Pending Tests', dashboardData.pendingTests, 'science', '#8b5cf6', () => props.navigation.navigate('PathologyTestManagement'))}
					{renderStatCard('Samples Collected', dashboardData.samplesCollected, 'local-hospital', '#10b981', () => Alert.alert(
						'Samples Collected Today',
						'Detailed breakdown:\n\n• Blood samples: 12\n• Urine samples: 4\n• Tissue samples: 2\n\nStatus:\n✓ 15 samples pending processing\n✓ 3 samples in analysis\n\nNext collection: Room 302B - 2:30 PM',
						[
							{ text: 'View Collection Schedule', onPress: () => Alert.alert('Schedule', 'Upcoming collections:\n• 2:30 PM - Room 302B (Blood)\n• 3:00 PM - Room 305A (Urine)\n• 4:15 PM - Emergency (Stat)') },
							{ text: 'Track Sample', onPress: () => Alert.alert('Sample Tracking', 'Enter sample barcode to track status\n\nRecent samples:\nBC001234 - Processing\nUC001235 - Complete\nTC001236 - Pending') },
							{ text: 'OK' }
						]
					))}
					{renderStatCard('Results Ready', dashboardData.resultsReady, 'assignment-turned-in', '#06b6d4', () => props.navigation.navigate('LabResults'))}
					{renderStatCard('Urgent Tests', dashboardData.urgentTests, 'priority-high', '#dc2626', () => Alert.alert(
						'Urgent Tests - Priority Queue',
						'STAT orders requiring immediate attention:\n\n🔴 CRITICAL:\n• Patient: John Doe - Room 301\n• Test: Cardiac Enzymes\n• Ordered: 45 min ago\n• Status: Sample received\n\n🟠 HIGH:\n• Patient: Mary Smith - ER\n• Test: Blood Gas Analysis\n• Ordered: 20 min ago\n• Status: In progress\n\n⚡ All urgent tests < 1 hour turnaround',
						[
							{ text: 'Process Next Urgent', onPress: () => Alert.alert('Processing', 'Starting next urgent test:\nPatient: John Doe\nTest: Cardiac Enzymes\nEstimated completion: 15 minutes') },
							{ text: 'View Full Queue', onPress: () => Alert.alert('Urgent Queue', 'Total urgent tests: 6\n\n1. Cardiac Enzymes - 45 min\n2. Blood Gas - 20 min\n3. Troponin - 30 min\n4. CBC STAT - 15 min\n5. Glucose - 10 min\n6. Electrolytes - 5 min') },
							{ text: 'OK' }
						]
					))}
				</View>

				{/* Test Queue */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Test Queue</Text>
						<TouchableOpacity
							style={styles.viewAllButton}
							onPress={() => props.navigation.navigate('PathologyTestManagement')}
						>
							<Text style={styles.viewAllText}>View All</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={dashboardData.testQueue}
						renderItem={renderTestItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
					/>
				</View>

				{/* Recent Results */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Recent Results</Text>
						<TouchableOpacity
							style={styles.viewAllButton}
							onPress={() => props.navigation.navigate('LabResults')}
						>
							<Text style={styles.viewAllText}>View All</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={dashboardData.recentResults}
						renderItem={renderResultItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
					/>
				</View>

				{/* Equipment Status */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Equipment Status</Text>
					<FlatList
						data={dashboardData.equipmentStatus}
						renderItem={renderEquipmentItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
					/>
				</View>

				{/* Quick Actions */}
				<View style={styles.quickActions}>
					<Text style={styles.sectionTitle}>Quick Actions</Text>
					<View style={styles.actionGrid}>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => props.navigation.navigate('PathologyTestManagement')}
						>
							<MaterialIcons name="assignment" size={30} color="#8b5cf6" />
							<Text style={styles.actionText}>Manage Tests</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => Alert.alert(
								'Sample Collection',
								'Choose collection action:',
								[
									{ text: 'Collect Blood Sample', onPress: () => Alert.alert('Success', 'Blood sample collection initiated. Barcode: BC001234') },
									{ text: 'Collect Urine Sample', onPress: () => Alert.alert('Success', 'Urine sample collection initiated. Barcode: UC001235') },
									{ text: 'Collect Tissue Sample', onPress: () => Alert.alert('Success', 'Tissue sample collection initiated. Barcode: TC001236') },
									{ text: 'View Collection Schedule', onPress: () => Alert.alert('Schedule', 'Today: 15 pending collections\nNext: Room 301A - Blood work') },
									{ text: 'Cancel', style: 'cancel' }
								]
							)}
						>
							<MaterialIcons name="science" size={30} color="#8b5cf6" />
							<Text style={styles.actionText}>Sample Collection</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => props.navigation.navigate('LabResults')}
						>
							<MaterialIcons name="assignment-turned-in" size={30} color="#8b5cf6" />
							<Text style={styles.actionText}>View Results</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => Alert.alert(
								'Quality Control',
								'Select QC action:',
								[
									{ text: 'Run Daily Calibration', onPress: () => Alert.alert('Calibration', 'Equipment calibration started.\nEstimated time: 15 minutes\nStatus: In Progress') },
									{ text: 'Check Control Samples', onPress: () => Alert.alert('Control Samples', 'All control samples within range:\n✓ Normal Control: PASS\n✓ High Control: PASS\n✓ Low Control: PASS') },
									{ text: 'Equipment Maintenance', onPress: () => Alert.alert('Maintenance', 'Next scheduled maintenance:\n• Hematology Analyzer: 3 days\n• Chemistry Analyzer: Today\n• Microscope: 1 week') },
									{ text: 'QC Report', onPress: () => Alert.alert('QC Report', 'Quality metrics for today:\n• Accuracy: 99.2%\n• Precision: 98.8%\n• Turn-around time: 45 min avg') },
									{ text: 'Cancel', style: 'cancel' }
								]
							)}
						>
							<MaterialIcons name="biotech" size={30} color="#8b5cf6" />
							<Text style={styles.actionText}>Quality Control</Text>
						</TouchableOpacity>
					</View>
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
		backgroundColor: '#8b5cf6',
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: '700',
		color: 'white',
	},
	qrButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	content: {
		flex: 1,
		paddingHorizontal: 15,
	},
	statsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginTop: 20,
		marginBottom: 20,
	},
	statCard: {
		width: '48%',
		padding: 20,
		borderRadius: 15,
		alignItems: 'center',
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
	},
	statIconContainer: {
		marginBottom: 10,
	},
	statValue: {
		fontSize: 24,
		fontWeight: '700',
		color: 'white',
		marginBottom: 5,
	},
	statTitle: {
		fontSize: 12,
		color: 'rgba(255,255,255,0.9)',
		textAlign: 'center',
		fontWeight: '500',
	},
	section: {
		marginBottom: 25,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
	},
	viewAllButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: '#8b5cf6',
		borderRadius: 12,
	},
	viewAllText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	listItem: {
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
	listItemHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 8,
	},
	patientName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	testType: {
		fontSize: 14,
		color: '#374151',
		marginTop: 2,
	},
	doctorName: {
		fontSize: 12,
		color: '#6b7280',
		marginTop: 4,
	},
	priorityBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	priorityText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	statusContainer: {
		alignItems: 'flex-start',
	},
	status: {
		fontSize: 14,
		fontWeight: '500',
	},
	resultItem: {
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
	resultHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	resultPatient: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	resultTime: {
		fontSize: 12,
		color: '#6b7280',
	},
	resultTest: {
		fontSize: 14,
		color: '#374151',
		marginBottom: 8,
	},
	resultValueContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	resultValue: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	resultStatusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	resultStatusText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	equipmentItem: {
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
	equipmentHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	equipmentName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	equipmentStatusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	equipmentStatusText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	maintenanceInfo: {
		fontSize: 14,
		color: '#6b7280',
	},
	quickActions: {
		marginBottom: 20,
	},
	actionGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginTop: 15,
	},
	actionButton: {
		width: '48%',
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 12,
		alignItems: 'center',
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	actionText: {
		marginTop: 8,
		fontSize: 12,
		fontWeight: '500',
		color: '#374151',
		textAlign: 'center',
	},
});

export default LabDashboard;