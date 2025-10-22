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

const NurseDashboard = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	const [dashboardData, setDashboardData] = useState({
		assignedPatients: 15,
		pendingMedications: 8,
		vitalsOverdue: 5,
		emergencyAlerts: 2,
		patientQueue: [
			{ id: '1', name: 'Sunita Devi', room: '301A', status: 'Medication Due', time: '10:30 AM', priority: 'High' },
			{ id: '2', name: 'Ramesh Gupta', room: '302B', status: 'Vitals Check', time: '11:00 AM', priority: 'Normal' },
			{ id: '3', name: 'Kavita Sharma', room: '303A', status: 'Dressing Change', time: '11:30 AM', priority: 'Normal' },
		],
		recentVitals: [
			{ id: '1', patient: 'Sunita Devi', bp: '120/80', temp: '98.6°F', pulse: '72', time: '9:45 AM' },
			{ id: '2', patient: 'Ramesh Gupta', bp: '130/85', temp: '99.1°F', pulse: '78', time: '9:30 AM' },
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
					{renderStatCard('Assigned Patients', dashboardData.assignedPatients, 'people', '#f59e0b', () => Alert.alert(
						'Assigned Patients Overview',
						'Patient assignment details for today:\n\n👥 TOTAL ASSIGNED: 15 patients\n\n🏥 BY ROOM:\n• Room 301A - Sunita Devi (High Priority)\n• Room 302B - Ramesh Gupta (Medication Due)\n• Room 303A - Kavita Sharma (Dressing Change)\n• Room 304B - Sunil Kumar (Post-Op)\n• Room 305A - Geeta Singh (Vitals Due)\n\n📊 PATIENT STATUS:\n• Stable: 12 patients\n• Requires Monitoring: 2 patients\n• Critical: 1 patient\n\n⏰ UPCOMING TASKS:\n• Medication rounds: 8 patients\n• Vital checks: 5 patients\n• Procedures: 2 patients',
						[
							{ text: 'View Patient List', onPress: () => Alert.alert('Patient List', 'Detailed patient assignments:\n\n1. Sunita Devi - Room 301A\n   - Medications due: 2:00 PM\n   - Last vitals: 1 hour ago\n   - Notes: Monitor BP\n\n2. Ramesh Gupta - Room 302B\n   - Medications due: Now\n   - Last vitals: 3 hours ago\n   - Notes: Diabetes management\n\n3. Kavita Sharma - Room 303A\n   - Dressing change due: 3:00 PM\n   - Last vitals: 2 hours ago\n   - Notes: Post-surgical care') },
							{ text: 'Reassign Patients', onPress: () => Alert.alert('Patient Reassignment', 'Requesting supervisor for patient reassignment.\n\nCurrent load: 15 patients\nRecommended load: 12 patients\n\nSupervisor will be notified to balance assignments.') },
							{ text: 'OK' }
						]
					))}
					{renderStatCard('Pending Medications', dashboardData.pendingMedications, 'medication', '#ef4444', () => Alert.alert(
						'Pending Medications - Action Required',
						'🔴 URGENT MEDICATIONS DUE:\n\n💊 NOW OVERDUE:\n• Ramesh Gupta (Room 302B) - Metformin 500mg\n• Sunil Kumar (Room 304B) - Pain medication\n\n⏰ DUE WITHIN 30 MINUTES:\n• Sunita Devi (Room 301A) - Lisinopril 10mg\n• Geeta Singh (Room 305A) - Insulin injection\n• Kavita Sharma (Room 303A) - Antibiotic\n\n🟡 DUE THIS HOUR:\n• Patient in Room 306A - Vitamin supplements\n• Patient in Room 307B - Blood thinner\n• Patient in Room 308A - Heart medication',
						[
							{ text: 'Start Medication Round', onPress: () => Alert.alert('Medication Round Started', 'Starting systematic medication distribution:\n\n✓ Overdue medications prioritized\n✓ Patient identity verification required\n✓ Medication scanner ready\n✓ Documentation system active\n\nFirst stop: Room 302B - Ramesh Gupta\nMedication: Metformin 500mg') },
							{ text: 'Mark as Administered', onPress: () => Alert.alert('Medication Administration', 'Select patient to mark medication as given:\n\n• Ramesh Gupta - Metformin\n• Sunil Kumar - Pain med\n• Sunita Devi - Lisinopril\n• Geeta Singh - Insulin\n\nRequires electronic signature and timestamp.') },
							{ text: 'Request Pharmacy', onPress: () => Alert.alert('Pharmacy Request', 'Requesting pharmacy for missing medications:\n\n• 2 medications out of stock\n• 1 medication needs preparation\n• Estimated delivery: 15 minutes\n\nPharmacy has been notified.') },
							{ text: 'OK' }
						]
					))}
					{renderStatCard('Vitals Overdue', dashboardData.vitalsOverdue, 'monitor-heart', '#f59e0b', () => Alert.alert(
						'Overdue Vital Signs - Priority List',
						'🔴 CRITICALLY OVERDUE (>6 hours):\n• Room 304B - Last check: 8 hours ago\n• Room 306A - Last check: 10 hours ago\n\n🟡 OVERDUE (4-6 hours):\n• Room 301A - Last check: 5 hours ago\n• Room 302B - Last check: 4.5 hours ago\n• Room 308A - Last check: 4 hours ago\n\n📊 REQUIRED VITALS:\n• Blood Pressure\n• Temperature\n• Pulse Rate\n• Oxygen Saturation\n• Respiratory Rate',
						[
							{ text: 'Start Vital Checks', onPress: () => Alert.alert('Vital Signs Round', 'Beginning systematic vital signs collection:\n\n🎯 Priority Order:\n1. Room 304B (Critical - 8 hrs overdue)\n2. Room 306A (Critical - 10 hrs overdue)\n3. Room 301A (Overdue - 5 hrs)\n4. Room 302B (Overdue - 4.5 hrs)\n\nVital signs equipment ready.\nDocumentation system active.') },
							{ text: 'View Last Readings', onPress: () => Alert.alert('Recent Vital Signs', 'Last recorded vital signs:\n\nRoom 304B (8 hrs ago):\n• BP: 128/82\n• Temp: 98.9°F\n• Pulse: 76\n• O2 Sat: 97%\n\nRoom 301A (5 hrs ago):\n• BP: 135/88\n• Temp: 99.2°F\n• Pulse: 82\n• O2 Sat: 96%') },
							{ text: 'Set Reminders', onPress: () => Alert.alert('Vital Signs Reminders', 'Setting up automated reminders:\n\n⏰ Every 4 hours for stable patients\n⏰ Every 2 hours for monitoring patients\n⏰ Every hour for critical patients\n\nReminder system activated.') },
							{ text: 'OK' }
						]
					))}
					{renderStatCard('Emergency Alerts', dashboardData.emergencyAlerts, 'warning', '#dc2626', () => Alert.alert(
						'Active Emergency Alerts',
						'🚨 CURRENT EMERGENCY SITUATIONS:\n\n🔴 CODE YELLOW (Room 305A):\n• Patient: Geeta Singh\n• Alert: Blood sugar critically low\n• Time: 15 minutes ago\n• Status: Response team en route\n\n🟡 FALL RISK ALERT (Room 307B):\n• Patient: Ashok Yadav\n• Alert: High fall risk patient unattended\n• Time: 8 minutes ago\n• Status: Monitoring required\n\n📊 ALERT SUMMARY:\n• Total active alerts: 2\n• Average response time: 3.2 minutes\n• Resolved today: 4 alerts',
						[
							{ text: 'Respond to Code Yellow', onPress: () => Alert.alert('Code Yellow Response', '🚨 RESPONDING TO MEDICAL EMERGENCY\n\nPatient: Geeta Singh (Room 305A)\nCondition: Hypoglycemia\n\n✅ ACTIONS TAKEN:\n• Nurse dispatched immediately\n• Blood glucose kit prepared\n• Physician notified\n• IV dextrose ready\n\n⏱️ Response Time: 2 minutes\nStatus: Emergency team on scene') },
							{ text: 'Address Fall Risk', onPress: () => Alert.alert('Fall Risk Management', '⚠️ FALL RISK INTERVENTION\n\nPatient: Ashok Yadav (Room 307B)\n\n✅ IMMEDIATE ACTIONS:\n• Bed alarm activated\n• Call bell within reach\n• Side rails raised\n• Non-slip socks provided\n• Frequent check schedule: Every 30 min\n\nFamily notified of safety measures.') },
							{ text: 'View Alert History', onPress: () => Alert.alert('Emergency Alert Log', 'Recent emergency alerts resolved:\n\n✅ 10:30 AM - Medication allergy (Room 309)\n✅ 11:45 AM - Vitals abnormal (Room 302)\n✅ 1:20 PM - Patient disorientation (Room 310)\n✅ 2:10 PM - Equipment malfunction (Room 304)\n\nAverage resolution time: 4.5 minutes') },
							{ text: 'OK' }
						]
					))}
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
							onPress={() => Alert.alert(
								'Record Patient Vitals',
								'Select patient and vital signs to record:',
								[
									{ text: 'Sunita Devi - Room 301A', onPress: () => Alert.alert('Vitals Entry', 'Patient: Sunita Devi\nRoom: 301A\n\nEnter vital signs:\n• Blood Pressure: ___/___\n• Temperature: ___°F\n• Pulse: ___ BPM\n• Oxygen Saturation: ___%\n• Respiratory Rate: ___\n\n[Save] [Cancel]') },
									{ text: 'Ramesh Gupta - Room 302B', onPress: () => Alert.alert('Vitals Entry', 'Patient: Ramesh Gupta\nRoom: 302B\n\nEnter vital signs:\n• Blood Pressure: ___/___\n• Temperature: ___°F\n• Pulse: ___ BPM\n• Oxygen Saturation: ___%\n• Respiratory Rate: ___\n\n[Save] [Cancel]') },
									{ text: 'Kavita Sharma - Room 303A', onPress: () => Alert.alert('Vitals Entry', 'Patient: Kavita Sharma\nRoom: 303A\n\nEnter vital signs:\n• Blood Pressure: ___/___\n• Temperature: ___°F\n• Pulse: ___ BPM\n• Oxygen Saturation: ___%\n• Respiratory Rate: ___\n\n[Save] [Cancel]') },
									{ text: 'View Overdue Vitals', onPress: () => Alert.alert('Overdue Vitals', 'Patients requiring vital signs check:\n\n🔴 OVERDUE (>6 hours):\n• Room 304B - Last: 8 hours ago\n• Room 306A - Last: 10 hours ago\n\n🟡 DUE SOON:\n• Room 301A - Due in 30 min\n• Room 302B - Due in 1 hour') },
									{ text: 'Cancel', style: 'cancel' }
								]
							)}
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
							onPress={() => Alert.alert(
								'Emergency Response System',
								'Select emergency type and location:',
								[
									{ text: 'Code Blue - Cardiac Arrest', onPress: () => Alert.alert('Code Blue Activated', '🚨 EMERGENCY ALERT 🚨\n\nCode Blue - Room 301A\nCardiac Arrest Protocol\n\nResponse team dispatched:\n✓ Emergency physician\n✓ Critical care nurse\n✓ Respiratory therapist\n✓ Crash cart activated\n\nETA: 2 minutes\nTime: ' + new Date().toLocaleTimeString()) },
									{ text: 'Code Red - Fire Emergency', onPress: () => Alert.alert('Code Red Activated', '🔥 FIRE EMERGENCY 🔥\n\nCode Red - Building Alert\nEvacuation Protocol Active\n\n✓ Fire department notified\n✓ Security alerted\n✓ Evacuation routes activated\n✓ Emergency lighting on\n\nTime: ' + new Date().toLocaleTimeString()) },
									{ text: 'Rapid Response - Patient Deterioration', onPress: () => Alert.alert('Rapid Response Called', '⚡ RAPID RESPONSE ⚡\n\nPatient: Room 302B\nClinical deterioration\n\nResponse team:\n✓ ICU physician\n✓ Critical care nurse\n✓ Respiratory therapist\n\nAssessing patient status...\nTime: ' + new Date().toLocaleTimeString()) },
									{ text: 'Security Alert', onPress: () => Alert.alert('Security Alert', '🛡️ SECURITY ALERT 🛡️\n\nSecurity team dispatched\nLocation: Nursing Station 3A\n\n✓ Security officers notified\n✓ Area supervisor alerted\n✓ Management informed\n\nResponse time: 3 minutes\nTime: ' + new Date().toLocaleTimeString()) },
									{ text: 'Cancel', style: 'cancel' }
								]
							)}
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