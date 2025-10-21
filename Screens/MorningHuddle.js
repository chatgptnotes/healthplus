import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	TextInput,
	SafeAreaView,
	Alert,
	FlatList,
	Switch,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const MorningHuddle = (props) => {
	const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
	const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
	const [isCreateMode, setIsCreateMode] = useState(false);

	// Leadership team structure
	const [leadershipTeam] = useState([
		{ id: '1', role: 'Technical Leader', name: 'Dr. Rajesh Sharma', department: 'Chief Medical Officer', present: true },
		{ id: '2', role: 'Operations Leader', name: 'Mrs. Priya Patel', department: 'Hospital Operations', present: true },
		{ id: '3', role: 'Statistics & Analytics Leader', name: 'Mr. Amit Kumar', department: 'Data Analytics', present: true },
		{ id: '4', role: 'Marketing Leader', name: 'Ms. Neha Singh', department: 'Marketing & Communications', present: false },
	]);

	// Morning huddle template and data
	const [huddleData, setHuddleData] = useState({
		date: currentDate,
		time: '09:00 AM',
		duration: '15 minutes',
		chairperson: 'Dr. Rajesh Sharma',
		attendees: leadershipTeam.filter(member => member.present),
		previousDayMetrics: {
			totalPatients: 142,
			emergencyCases: 8,
			admissions: 23,
			discharges: 19,
			occupancyRate: 78.5,
			avgWaitTime: '18 minutes',
		},
		qualityMetrics: {
			patientSatisfaction: 4.3,
			handHygiene: 94.2,
			medicationErrors: 1,
			fallIncidents: 0,
			infectionRate: 0.8,
		},
		departmentUpdates: [
			{ dept: 'Emergency', status: 'Normal', issues: 'None', action: 'Continue monitoring' },
			{ dept: 'ICU', status: 'High Census', issues: '2 pending discharges', action: 'Social worker follow-up' },
			{ dept: 'Surgery', status: 'Normal', issues: 'Equipment maintenance scheduled', action: 'Backup OR ready' },
			{ dept: 'Pharmacy', status: 'Stock Alert', issues: 'Low insulin stock', action: 'Emergency order placed' },
		],
		safetyAlerts: [
			{ type: 'Equipment', message: 'MRI machine scheduled for maintenance at 2 PM', priority: 'Medium' },
			{ type: 'Staffing', message: 'Nursing shortage in night shift', priority: 'High' },
		],
		actionItems: [
			{ item: 'Review discharge process delays', owner: 'Mrs. Priya Patel', deadline: '2024-10-22', status: 'Open' },
			{ item: 'Install hand sanitizer stations in lobby', owner: 'Dr. Rajesh Sharma', deadline: '2024-10-23', status: 'In Progress' },
		],
		keyFocus: [
			'Reduce patient wait times in OPD',
			'Improve hand hygiene compliance to 95%',
			'Complete pending discharge documentation',
		],
		notes: '',
	});

	// Previous huddle meetings for history
	const [previousHuddles] = useState([
		{
			id: '1',
			date: '2024-10-20',
			time: '09:00 AM',
			chairperson: 'Dr. Rajesh Sharma',
			attendeesCount: 4,
			keyTopics: ['Patient Safety Review', 'Occupancy Planning', 'Staff Training'],
			actionItemsCount: 3,
			status: 'Completed'
		},
		{
			id: '2',
			date: '2024-10-19',
			time: '09:00 AM',
			chairperson: 'Dr. Rajesh Sharma',
			attendeesCount: 3,
			keyTopics: ['Emergency Protocols', 'Quality Metrics', 'Budget Review'],
			actionItemsCount: 5,
			status: 'Completed'
		},
		{
			id: '3',
			date: '2024-10-18',
			time: '09:00 AM',
			chairperson: 'Mrs. Priya Patel',
			attendeesCount: 4,
			keyTopics: ['Technology Upgrade', 'Patient Feedback', 'Marketing Campaign'],
			actionItemsCount: 2,
			status: 'Completed'
		},
	]);

	const [newHuddle, setNewHuddle] = useState({
		notes: '',
		actionItems: [],
		keyFocus: [],
		safetyAlerts: [],
	});

	const renderMetricCard = (title, value, subtitle, icon, color) => (
		<View style={[styles.metricCard, { borderLeftColor: color }]}>
			<View style={styles.metricContent}>
				<View style={styles.metricText}>
					<Text style={styles.metricValue}>{value}</Text>
					<Text style={styles.metricTitle}>{title}</Text>
					{subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
				</View>
				<View style={[styles.metricIcon, { backgroundColor: color }]}>
					<MaterialIcons name={icon} size={20} color="white" />
				</View>
			</View>
		</View>
	);

	const renderLeadershipMember = (member) => (
		<View key={member.id} style={styles.leaderCard}>
			<View style={styles.leaderInfo}>
				<View style={[styles.presenceIndicator, {
					backgroundColor: member.present ? '#10b981' : '#ef4444'
				}]} />
				<View style={styles.leaderDetails}>
					<Text style={styles.leaderName}>{member.name}</Text>
					<Text style={styles.leaderRole}>{member.role}</Text>
					<Text style={styles.leaderDept}>{member.department}</Text>
				</View>
			</View>
			<View style={styles.presenceStatus}>
				<Text style={[styles.presenceText, {
					color: member.present ? '#10b981' : '#ef4444'
				}]}>
					{member.present ? 'Present' : 'Absent'}
				</Text>
			</View>
		</View>
	);

	const renderDepartmentUpdate = (update, index) => (
		<View key={index} style={styles.deptUpdateCard}>
			<View style={styles.deptHeader}>
				<Text style={styles.deptName}>{update.dept}</Text>
				<View style={[styles.statusBadge, {
					backgroundColor: update.status === 'Normal' ? '#10b981' :
									update.status === 'High Census' ? '#f59e0b' : '#ef4444'
				}]}>
					<Text style={styles.statusText}>{update.status}</Text>
				</View>
			</View>
			<Text style={styles.deptIssues}>Issues: {update.issues}</Text>
			<Text style={styles.deptAction}>Action: {update.action}</Text>
		</View>
	);

	const renderSafetyAlert = (alert, index) => (
		<View key={index} style={styles.alertCard}>
			<View style={styles.alertHeader}>
				<MaterialIcons
					name={alert.type === 'Equipment' ? 'build' : 'people'}
					size={20}
					color={alert.priority === 'High' ? '#ef4444' : '#f59e0b'}
				/>
				<Text style={styles.alertType}>{alert.type}</Text>
				<View style={[styles.priorityBadge, {
					backgroundColor: alert.priority === 'High' ? '#ef4444' : '#f59e0b'
				}]}>
					<Text style={styles.priorityText}>{alert.priority}</Text>
				</View>
			</View>
			<Text style={styles.alertMessage}>{alert.message}</Text>
		</View>
	);

	const renderActionItem = (item, index) => (
		<View key={index} style={styles.actionCard}>
			<View style={styles.actionHeader}>
				<Text style={styles.actionItem}>{item.item}</Text>
				<View style={[styles.actionStatus, {
					backgroundColor: item.status === 'Completed' ? '#10b981' :
									item.status === 'In Progress' ? '#f59e0b' : '#6b7280'
				}]}>
					<Text style={styles.actionStatusText}>{item.status}</Text>
				</View>
			</View>
			<View style={styles.actionDetails}>
				<Text style={styles.actionOwner}>Owner: {item.owner}</Text>
				<Text style={styles.actionDeadline}>Due: {item.deadline}</Text>
			</View>
		</View>
	);

	const renderPreviousHuddle = ({ item }) => (
		<TouchableOpacity
			style={styles.previousHuddleCard}
			onPress={() => Alert.alert('Huddle Details', `Date: ${item.date}\nChairperson: ${item.chairperson}\nAttendees: ${item.attendeesCount}\nAction Items: ${item.actionItemsCount}\n\nKey Topics:\n${item.keyTopics.join('\n• ')}`)}
		>
			<View style={styles.huddleHeader}>
				<Text style={styles.huddleDate}>{item.date}</Text>
				<View style={styles.huddleStatus}>
					<MaterialIcons name="check-circle" size={16} color="#10b981" />
					<Text style={styles.huddleStatusText}>{item.status}</Text>
				</View>
			</View>
			<Text style={styles.huddleChair}>Chair: {item.chairperson}</Text>
			<Text style={styles.huddleAttendees}>{item.attendeesCount} attendees • {item.actionItemsCount} action items</Text>
			<View style={styles.huddleTopics}>
				{item.keyTopics.slice(0, 2).map((topic, index) => (
					<Text key={index} style={styles.topicTag}>#{topic}</Text>
				))}
				{item.keyTopics.length > 2 && (
					<Text style={styles.topicTag}>+{item.keyTopics.length - 2} more</Text>
				)}
			</View>
		</TouchableOpacity>
	);

	const createNewHuddle = () => {
		Alert.alert(
			'Morning Huddle Created',
			`New morning huddle for ${selectedDate} has been created successfully.\n\nScheduled Time: 9:00 AM\nChairperson: Dr. Rajesh Sharma\nExpected Attendees: ${leadershipTeam.filter(m => m.present).length}\n\nReminders sent to all leadership team members.`,
			[
				{ text: 'Add to Calendar', onPress: () => Alert.alert('Calendar', 'Meeting added to calendar successfully.') },
				{ text: 'Send Notifications', onPress: () => Alert.alert('Notifications', 'Meeting reminders sent to all attendees.') },
				{ text: 'OK' }
			]
		);
		setIsCreateMode(false);
	};

	const exportMinutes = () => {
		Alert.alert(
			'Export Meeting Minutes',
			'Select export format:',
			[
				{ text: 'PDF Report', onPress: () => Alert.alert('Export', 'Meeting minutes exported as PDF successfully.') },
				{ text: 'Email Summary', onPress: () => Alert.alert('Email', 'Meeting summary emailed to leadership team.') },
				{ text: 'Share Link', onPress: () => Alert.alert('Share', 'Shareable link generated for meeting minutes.') },
				{ text: 'Cancel', style: 'cancel' }
			]
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
				<Text style={styles.headerTitle}>Morning Huddle</Text>
				<TouchableOpacity style={styles.exportButton} onPress={exportMinutes}>
					<MaterialIcons name="share" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Date Selector and Current Status */}
				<View style={styles.dateSection}>
					<View style={styles.dateHeader}>
						<MaterialIcons name="today" size={24} color="#06b6d4" />
						<Text style={styles.dateTitle}>Today's Huddle - {currentDate}</Text>
					</View>
					<View style={styles.huddleInfo}>
						<Text style={styles.huddleTime}>📅 Scheduled: 9:00 AM Daily</Text>
						<Text style={styles.huddleDuration}>⏱️ Duration: ~15 minutes</Text>
						<Text style={styles.huddleChairman}>👨‍⚕️ Chair: Dr. Rajesh Sharma</Text>
					</View>
				</View>

				{/* Leadership Team */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Leadership Team</Text>
					{leadershipTeam.map(renderLeadershipMember)}
				</View>

				{/* Previous Day Metrics */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Previous Day Metrics</Text>
					<View style={styles.metricsGrid}>
						{renderMetricCard('Total Patients', huddleData.previousDayMetrics.totalPatients, 'Yesterday', 'people', '#06b6d4')}
						{renderMetricCard('Emergency Cases', huddleData.previousDayMetrics.emergencyCases, 'Critical cases', 'local-hospital', '#ef4444')}
						{renderMetricCard('Occupancy Rate', `${huddleData.previousDayMetrics.occupancyRate}%`, 'Bed utilization', 'hotel', '#10b981')}
						{renderMetricCard('Avg Wait Time', huddleData.previousDayMetrics.avgWaitTime, 'OPD average', 'schedule', '#f59e0b')}
					</View>
				</View>

				{/* Quality Metrics */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Quality Metrics</Text>
					<View style={styles.metricsGrid}>
						{renderMetricCard('Patient Satisfaction', `${huddleData.qualityMetrics.patientSatisfaction}/5`, 'Average rating', 'star', '#10b981')}
						{renderMetricCard('Hand Hygiene', `${huddleData.qualityMetrics.handHygiene}%`, 'Compliance rate', 'wash', '#06b6d4')}
						{renderMetricCard('Medication Errors', huddleData.qualityMetrics.medicationErrors, 'Yesterday', 'medication', '#ef4444')}
						{renderMetricCard('Fall Incidents', huddleData.qualityMetrics.fallIncidents, 'Patient safety', 'security', '#10b981')}
					</View>
				</View>

				{/* Department Updates */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Department Updates</Text>
					{huddleData.departmentUpdates.map(renderDepartmentUpdate)}
				</View>

				{/* Safety Alerts */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Safety Alerts</Text>
					{huddleData.safetyAlerts.map(renderSafetyAlert)}
				</View>

				{/* Action Items */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Action Items</Text>
					{huddleData.actionItems.map(renderActionItem)}
				</View>

				{/* Key Focus Areas */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Today's Key Focus</Text>
					<View style={styles.focusContainer}>
						{huddleData.keyFocus.map((focus, index) => (
							<View key={index} style={styles.focusItem}>
								<MaterialIcons name="flag" size={16} color="#06b6d4" />
								<Text style={styles.focusText}>{focus}</Text>
							</View>
						))}
					</View>
				</View>

				{/* Previous Huddles */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Previous Huddles</Text>
						<TouchableOpacity
							style={styles.viewAllButton}
							onPress={() => Alert.alert('Huddle History', 'Complete meeting history available in archives.')}
						>
							<Text style={styles.viewAllText}>View All</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={previousHuddles}
						renderItem={renderPreviousHuddle}
						keyExtractor={item => item.id}
						scrollEnabled={false}
					/>
				</View>

				{/* Action Buttons */}
				<View style={styles.actionButtons}>
					<TouchableOpacity
						style={styles.primaryButton}
						onPress={createNewHuddle}
					>
						<MaterialIcons name="add" size={20} color="white" />
						<Text style={styles.primaryButtonText}>Schedule Today's Huddle</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.secondaryButton}
						onPress={() => Alert.alert('Template', 'Huddle agenda template available for customization.')}
					>
						<MaterialIcons name="edit" size={20} color="#06b6d4" />
						<Text style={styles.secondaryButtonText}>Edit Template</Text>
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
		paddingVertical: 16,
		paddingHorizontal: 20,
		backgroundColor: '#06b6d4',
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
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
	},
	exportButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	content: {
		flex: 1,
		paddingHorizontal: 15,
	},
	dateSection: {
		backgroundColor: 'white',
		marginTop: 15,
		borderRadius: 12,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	dateHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
	},
	dateTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
		marginLeft: 10,
	},
	huddleInfo: {
		paddingLeft: 10,
	},
	huddleTime: {
		fontSize: 14,
		color: '#374151',
		marginBottom: 5,
	},
	huddleDuration: {
		fontSize: 14,
		color: '#374151',
		marginBottom: 5,
	},
	huddleChairman: {
		fontSize: 14,
		color: '#374151',
	},
	section: {
		marginTop: 20,
		marginBottom: 10,
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
		marginBottom: 15,
	},
	viewAllButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: '#06b6d4',
		borderRadius: 12,
	},
	viewAllText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	leaderCard: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	leaderInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	presenceIndicator: {
		width: 8,
		height: 40,
		borderRadius: 4,
		marginRight: 12,
	},
	leaderDetails: {
		flex: 1,
	},
	leaderName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	leaderRole: {
		fontSize: 14,
		color: '#06b6d4',
		fontWeight: '500',
		marginTop: 2,
	},
	leaderDept: {
		fontSize: 12,
		color: '#6b7280',
		marginTop: 1,
	},
	presenceStatus: {
		alignItems: 'flex-end',
	},
	presenceText: {
		fontSize: 12,
		fontWeight: '500',
	},
	metricsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	metricCard: {
		width: '48%',
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		marginBottom: 12,
		borderLeftWidth: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	metricContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	metricText: {
		flex: 1,
	},
	metricValue: {
		fontSize: 18,
		fontWeight: '700',
		color: '#1f2937',
		marginBottom: 4,
	},
	metricTitle: {
		fontSize: 12,
		color: '#6b7280',
		fontWeight: '500',
	},
	metricSubtitle: {
		fontSize: 10,
		color: '#9ca3af',
		marginTop: 2,
	},
	metricIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	deptUpdateCard: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	deptHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	deptName: {
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
	deptIssues: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 5,
	},
	deptAction: {
		fontSize: 14,
		color: '#374151',
		fontWeight: '500',
	},
	alertCard: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	alertHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	alertType: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
		marginLeft: 8,
		flex: 1,
	},
	priorityBadge: {
		paddingHorizontal: 6,
		paddingVertical: 3,
		borderRadius: 6,
	},
	priorityText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
	},
	alertMessage: {
		fontSize: 14,
		color: '#374151',
		lineHeight: 20,
	},
	actionCard: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	actionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	actionItem: {
		fontSize: 14,
		fontWeight: '500',
		color: '#1f2937',
		flex: 1,
		marginRight: 10,
	},
	actionStatus: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	actionStatusText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
	},
	actionDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	actionOwner: {
		fontSize: 12,
		color: '#6b7280',
	},
	actionDeadline: {
		fontSize: 12,
		color: '#6b7280',
	},
	focusContainer: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	focusItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	focusText: {
		fontSize: 14,
		color: '#374151',
		marginLeft: 10,
	},
	previousHuddleCard: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	huddleHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	huddleDate: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	huddleStatus: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	huddleStatusText: {
		fontSize: 12,
		color: '#10b981',
		marginLeft: 4,
		fontWeight: '500',
	},
	huddleChair: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 4,
	},
	huddleAttendees: {
		fontSize: 12,
		color: '#9ca3af',
		marginBottom: 10,
	},
	huddleTopics: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	topicTag: {
		fontSize: 10,
		color: '#06b6d4',
		backgroundColor: '#f0f9ff',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
		marginRight: 6,
		marginBottom: 4,
	},
	actionButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
		gap: 12,
	},
	primaryButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#06b6d4',
		padding: 16,
		borderRadius: 12,
	},
	primaryButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
	},
	secondaryButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
		padding: 16,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: '#06b6d4',
	},
	secondaryButtonText: {
		color: '#06b6d4',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
	},
	bottomSpacing: {
		height: 40,
	},
});

export default MorningHuddle;