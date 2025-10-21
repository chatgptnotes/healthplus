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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const NurseDashboard = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	const [dashboardData, setDashboardData] = useState({
		assignedPatients: 15,
		pendingMedications: 8,
		vitalsOverdue: 5,
		emergencyAlerts: 2,
		patientQueue: [
			{ id: '1', name: 'Alice Johnson', room: '301A', status: 'Medication Due', time: '10:30 AM', priority: 'High' },
			{ id: '2', name: 'Bob Smith', room: '302B', status: 'Vitals Check', time: '11:00 AM', priority: 'Normal' },
			{ id: '3', name: 'Carol Davis', room: '303A', status: 'Dressing Change', time: '11:30 AM', priority: 'Normal' },
		],
		recentVitals: [
			{ id: '1', patient: 'Alice Johnson', bp: '120/80', temp: '98.6°F', pulse: '72', time: '9:45 AM' },
			{ id: '2', patient: 'Bob Smith', bp: '130/85', temp: '99.1°F', pulse: '78', time: '9:30 AM' },
		]
	});

	const renderStatCard = (title, value, icon, color) => (
		<TouchableOpacity style={[styles.statCard, { backgroundColor: color }]}>
			<View style={styles.statIconContainer}>
				<MaterialIcons name={icon} size={24} color="white" />
			</View>
			<Text style={styles.statValue}>{value}</Text>
			<Text style={styles.statTitle}>{title}</Text>
		</TouchableOpacity>
	);

	const renderPatientItem = ({ item }) => (
		<View style={styles.listItem}>
			<View style={styles.listItemHeader}>
				<View>
					<Text style={styles.patientName}>{item.name}</Text>
					<Text style={styles.roomNumber}>Room: {item.room}</Text>
				</View>
				<View style={[styles.priorityBadge, {
					backgroundColor: item.priority === 'High' ? '#ef4444' : '#10b981'
				}]}>
					<Text style={styles.priorityText}>{item.priority}</Text>
				</View>
			</View>
			<View style={styles.taskInfo}>
				<Text style={styles.taskStatus}>{item.status}</Text>
				<Text style={styles.taskTime}>{item.time}</Text>
			</View>
		</View>
	);

	const renderVitalItem = ({ item }) => (
		<View style={styles.vitalItem}>
			<Text style={styles.vitalPatient}>{item.patient}</Text>
			<View style={styles.vitalGrid}>
				<View style={styles.vitalBox}>
					<Text style={styles.vitalLabel}>BP</Text>
					<Text style={styles.vitalValue}>{item.bp}</Text>
				</View>
				<View style={styles.vitalBox}>
					<Text style={styles.vitalLabel}>Temp</Text>
					<Text style={styles.vitalValue}>{item.temp}</Text>
				</View>
				<View style={styles.vitalBox}>
					<Text style={styles.vitalLabel}>Pulse</Text>
					<Text style={styles.vitalValue}>{item.pulse}</Text>
				</View>
			</View>
			<Text style={styles.vitalTime}>{item.time}</Text>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Nursing Station</Text>
				<TouchableOpacity style={styles.emergencyButton}>
					<MaterialIcons name="emergency" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Statistics Cards */}
				<View style={styles.statsContainer}>
					{renderStatCard('Assigned Patients', dashboardData.assignedPatients, 'people', '#f59e0b')}
					{renderStatCard('Pending Medications', dashboardData.pendingMedications, 'medication', '#ef4444')}
					{renderStatCard('Vitals Overdue', dashboardData.vitalsOverdue, 'monitor-heart', '#f59e0b')}
					{renderStatCard('Emergency Alerts', dashboardData.emergencyAlerts, 'warning', '#dc2626')}
				</View>

				{/* Patient Care Queue */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Patient Care Queue</Text>
						<TouchableOpacity style={styles.viewAllButton}>
							<Text style={styles.viewAllText}>View All</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={dashboardData.patientQueue}
						renderItem={renderPatientItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
					/>
				</View>

				{/* Recent Vitals */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Recent Vital Signs</Text>
					<FlatList
						data={dashboardData.recentVitals}
						renderItem={renderVitalItem}
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
							onPress={() => props.navigation.navigate('NursingManagement')}
						>
							<MaterialIcons name="medical-services" size={30} color="#f59e0b" />
							<Text style={styles.actionText}>Medication Round</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => alert('Record Vitals feature coming soon!')}
						>
							<MaterialIcons name="monitor-heart" size={30} color="#f59e0b" />
							<Text style={styles.actionText}>Record Vitals</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => props.navigation.navigate('NursingManagement')}
						>
							<MaterialIcons name="note-add" size={30} color="#f59e0b" />
							<Text style={styles.actionText}>Nursing Notes</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => alert('Emergency Alert sent!')}
						>
							<MaterialIcons name="emergency" size={30} color="#f59e0b" />
							<Text style={styles.actionText}>Emergency Call</Text>
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
		backgroundColor: '#f59e0b',
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
	emergencyButton: {
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
		backgroundColor: '#f59e0b',
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
	roomNumber: {
		fontSize: 14,
		color: '#6b7280',
		marginTop: 2,
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
	taskInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	taskStatus: {
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
	},
	taskTime: {
		fontSize: 14,
		color: '#6b7280',
	},
	vitalItem: {
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
	vitalPatient: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 10,
	},
	vitalGrid: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	vitalBox: {
		alignItems: 'center',
		flex: 1,
	},
	vitalLabel: {
		fontSize: 12,
		color: '#6b7280',
		marginBottom: 4,
	},
	vitalValue: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	vitalTime: {
		fontSize: 12,
		color: '#6b7280',
		textAlign: 'right',
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

export default NurseDashboard;