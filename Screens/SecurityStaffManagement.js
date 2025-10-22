import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
	Alert,
	SafeAreaView,
	Switch,
	Image,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const SecurityStaffManagement = (props) => {
	const [activeTab, setActiveTab] = useState('checklist');
	const [currentTime, setCurrentTime] = useState(new Date());

	// Security checklist items based on SOP
	const [securityChecklist, setSecurityChecklist] = useState([
		{
			id: 'SEC001',
			title: 'Mobile Number Exchange',
			description: 'Exchange mobile numbers with leadership team and security agency',
			category: 'Induction',
			priority: 'critical',
			completed: false,
			hospital: 'All',
			subtasks: [
				'Exchange numbers with leadership team',
				'Save security agency owner number',
				'Update emergency contact list',
				'Test all contact numbers'
			]
		},
		{
			id: 'SEC002',
			title: 'Employee Bag Check - Entry',
			description: 'Check all employee bags when entering premises',
			category: 'Daily Operations',
			priority: 'high',
			completed: false,
			hospital: 'All',
			prohibitedItems: ['Tobacco', 'Alcohol', 'Inflammable items', 'Stove', 'Lighter', 'Matches', 'Outside food']
		},
		{
			id: 'SEC003',
			title: 'Employee Bag Check - Exit',
			description: 'Check all employee bags and pockets when leaving',
			category: 'Daily Operations',
			priority: 'high',
			completed: false,
			hospital: 'All',
			subtasks: [
				'Check for unauthorized hospital property',
				'Verify no medicines being taken',
				'Check for IV bottles or OT equipment',
				'Document any violations'
			]
		},
		{
			id: 'SEC004',
			title: 'Patient Bag & Pocket Check',
			description: 'Check all patients and family members upon entry',
			category: 'Daily Operations',
			priority: 'high',
			completed: false,
			hospital: 'All',
			subtasks: [
				'Check all bags thoroughly',
				'Check pockets for prohibited items',
				'Confiscate prohibited items',
				'Maintain confiscated items register'
			]
		},
		{
			id: 'SEC005',
			title: 'Inward & Outward Register',
			description: 'Maintain detailed record of all items entering/leaving',
			category: 'Documentation',
			priority: 'medium',
			completed: false,
			hospital: 'All',
			subtasks: [
				'Take photographs of all items',
				'Share photos in WhatsApp group',
				'Maintain detailed register',
				'Update during shift changes'
			]
		},
		{
			id: 'SEC006',
			title: 'Fire Safety Knowledge',
			description: 'Know how to operate fire pump and safety equipment',
			category: 'Emergency Preparedness',
			priority: 'critical',
			completed: false,
			hospital: 'All',
			subtasks: [
				'Know fire pump operation',
				'Generator start/stop procedures',
				'Fire extinguisher usage',
				'Emergency evacuation procedures'
			]
		},
		{
			id: 'SEC007',
			title: 'Lift Management',
			description: 'Ensure lifts used only for patients, always at ground floor',
			category: 'Daily Operations',
			priority: 'medium',
			completed: false,
			hospital: 'All',
			subtasks: [
				'Restrict staff use of lifts',
				'Keep lift available at ground floor',
				'Monitor lift usage',
				'Report any misuse'
			]
		},
		{
			id: 'SEC008',
			title: 'Night Guard Duties',
			description: '24/7 services and special night responsibilities',
			category: 'Night Operations',
			priority: 'high',
			completed: false,
			hospital: 'Ayushman',
			subtasks: [
				'Ensure 24/7 coverage',
				'Open back entry gate after 5 AM',
				'Guard fire pump area',
				'Monitor premises throughout night'
			]
		}
	]);

	// Equipment and key register
	const [equipmentRegister, setEquipmentRegister] = useState([
		{
			id: 'EQ001',
			item: 'Fire Extinguisher - Ground Floor',
			status: 'Working',
			lastChecked: '2024-01-20',
			location: 'Reception Area',
			responsible: 'Day Shift Guard'
		},
		{
			id: 'EQ002',
			item: 'Fire Pump Control',
			status: 'Working',
			lastChecked: '2024-01-20',
			location: 'Ground Floor Pump Room',
			responsible: 'Night Guard'
		},
		{
			id: 'EQ003',
			item: 'Generator Control Panel',
			status: 'Working',
			lastChecked: '2024-01-19',
			location: 'Generator Room',
			responsible: 'Senior Guard'
		},
		{
			id: 'EQ004',
			item: 'Main Gate Keys',
			status: 'Assigned',
			lastChecked: '2024-01-20',
			location: 'Security Desk',
			responsible: 'Shift Leader'
		},
		{
			id: 'EQ005',
			item: 'Back Gate Keys',
			status: 'Assigned',
			lastChecked: '2024-01-20',
			location: 'Security Desk',
			responsible: 'Night Guard'
		}
	]);

	// Violation logs
	const [violationLogs, setViolationLogs] = useState([
		{
			id: 'VIO001',
			type: 'Mobile Phone Violation',
			person: 'Staff Member - Cleaning Dept.',
			violation: 'Using mobile phone during duty hours',
			action: 'Phone confiscated for day',
			time: '2024-01-20 14:30',
			status: 'Resolved'
		},
		{
			id: 'VIO002',
			type: 'Prohibited Item',
			person: 'Visitor - Patient Family',
			violation: 'Carrying outside food',
			action: 'Food items stored at reception',
			time: '2024-01-20 11:15',
			status: 'Resolved'
		},
		{
			id: 'VIO003',
			type: 'Unauthorized Access',
			person: 'Unknown Individual',
			violation: 'Attempted entry without visitor pass',
			action: 'Denied entry, reported to leadership',
			time: '2024-01-19 16:45',
			status: 'Reported'
		}
	]);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000);
		return () => clearInterval(timer);
	}, []);

	const toggleChecklistItem = (itemId) => {
		setSecurityChecklist(prevList =>
			prevList.map(item =>
				item.id === itemId
					? { ...item, completed: !item.completed }
					: item
			)
		);
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'critical': return '#dc2626';
			case 'high': return '#f59e0b';
			case 'medium': return '#10b981';
			case 'low': return '#6b7280';
			default: return '#6b7280';
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'Working': return '#10b981';
			case 'Assigned': return '#10b981';
			case 'Maintenance': return '#f59e0b';
			case 'Issue': return '#dc2626';
			default: return '#6b7280';
		}
	};

	const renderChecklistItem = ({ item }) => (
		<TouchableOpacity
			style={[styles.checklistCard, item.completed && styles.completedTask]}
			onPress={() => showTaskDetails(item)}
		>
			<View style={styles.taskHeader}>
				<View style={styles.taskInfo}>
					<Text style={[styles.taskTitle, item.completed && styles.completedText]}>
						{item.title}
					</Text>
					<Text style={styles.taskDescription}>{item.description}</Text>
					<Text style={styles.taskCategory}>{item.category} - {item.hospital}</Text>
				</View>
				<View style={styles.taskActions}>
					<View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
						<Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
					</View>
					<TouchableOpacity
						style={[styles.checkButton, item.completed && styles.checkedButton]}
						onPress={() => toggleChecklistItem(item.id)}
					>
						<MaterialIcons
							name={item.completed ? "check-circle" : "radio-button-unchecked"}
							size={24}
							color={item.completed ? "white" : "#6b7280"}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</TouchableOpacity>
	);

	const renderEquipmentItem = ({ item }) => (
		<TouchableOpacity style={styles.equipmentCard}>
			<View style={styles.equipmentHeader}>
				<View style={styles.equipmentInfo}>
					<Text style={styles.equipmentName}>{item.item}</Text>
					<Text style={styles.equipmentLocation}>{item.location}</Text>
					<Text style={styles.equipmentResponsible}>Responsible: {item.responsible}</Text>
				</View>
				<View style={styles.equipmentStatus}>
					<View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
						<Text style={styles.statusText}>{item.status}</Text>
					</View>
					<Text style={styles.lastChecked}>Last: {item.lastChecked}</Text>
				</View>
			</View>
			<TouchableOpacity
				style={styles.updateButton}
				onPress={() => updateEquipmentStatus(item.id)}
			>
				<MaterialIcons name="update" size={16} color="#10b981" />
				<Text style={styles.updateButtonText}>Update Status</Text>
			</TouchableOpacity>
		</TouchableOpacity>
	);

	const renderViolationItem = ({ item }) => (
		<View style={styles.violationCard}>
			<View style={styles.violationHeader}>
				<Text style={styles.violationType}>{item.type}</Text>
				<View style={[styles.violationStatus, {
					backgroundColor: item.status === 'Resolved' ? '#10b981' : '#f59e0b'
				}]}>
					<Text style={styles.violationStatusText}>{item.status}</Text>
				</View>
			</View>
			<Text style={styles.violationPerson}>{item.person}</Text>
			<Text style={styles.violationDescription}>{item.violation}</Text>
			<Text style={styles.violationAction}>Action: {item.action}</Text>
			<Text style={styles.violationTime}>{item.time}</Text>
		</View>
	);

	const showTaskDetails = (task) => {
		let details = `${task.description}\n\nCategory: ${task.category}\nPriority: ${task.priority.toUpperCase()}\nHospital: ${task.hospital}`;

		if (task.subtasks) {
			details += '\n\nSubtasks:\n' + task.subtasks.map((subtask, index) => `${index + 1}. ${subtask}`).join('\n');
		}

		if (task.prohibitedItems) {
			details += '\n\nProhibited Items:\n' + task.prohibitedItems.map(item => `• ${item}`).join('\n');
		}

		Alert.alert(task.title, details, [
			{ text: 'Mark Complete', onPress: () => toggleChecklistItem(task.id) },
			{ text: 'OK' }
		]);
	};

	const updateEquipmentStatus = (equipmentId) => {
		Alert.alert(
			'Update Equipment Status',
			'Choose the current status of this equipment:',
			[
				{ text: 'Working', onPress: () => updateEquipment(equipmentId, 'Working') },
				{ text: 'Needs Maintenance', onPress: () => updateEquipment(equipmentId, 'Maintenance') },
				{ text: 'Issue/Problem', onPress: () => updateEquipment(equipmentId, 'Issue') },
				{ text: 'Cancel', style: 'cancel' }
			]
		);
	};

	const updateEquipment = (equipmentId, newStatus) => {
		setEquipmentRegister(prevRegister =>
			prevRegister.map(item =>
				item.id === equipmentId
					? { ...item, status: newStatus, lastChecked: new Date().toISOString().split('T')[0] }
					: item
			)
		);
		Alert.alert('Status Updated', `Equipment status has been updated to: ${newStatus}`);
	};

	const addViolationLog = () => {
		Alert.alert(
			'Report Security Violation',
			'Choose violation type:',
			[
				{ text: 'Mobile Phone Violation', onPress: () => reportViolation('Mobile Phone Violation') },
				{ text: 'Prohibited Item', onPress: () => reportViolation('Prohibited Item') },
				{ text: 'Unauthorized Access', onPress: () => reportViolation('Unauthorized Access') },
				{ text: 'Cancel', style: 'cancel' }
			]
		);
	};

	const reportViolation = (violationType) => {
		const newViolation = {
			id: `VIO${Date.now()}`,
			type: violationType,
			person: 'To be filled',
			violation: 'Details to be added',
			action: 'Action taken',
			time: new Date().toLocaleString(),
			status: 'Reported'
		};
		setViolationLogs(prev => [newViolation, ...prev]);
		Alert.alert('Violation Reported', 'Security violation has been logged. Please add details.');
	};

	const completedCount = securityChecklist.filter(item => item.completed).length;
	const completionPercentage = (completedCount / securityChecklist.length) * 100;

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => props.navigation.goBack()}
				>
					<MaterialIcons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Security Staff Management</Text>
				<TouchableOpacity
					style={styles.alertButton}
					onPress={addViolationLog}
				>
					<MaterialIcons name="report-problem" size={24} color="white" />
				</TouchableOpacity>
			</View>

			{/* Tab Navigation */}
			<View style={styles.tabContainer}>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'checklist' && styles.activeTab]}
					onPress={() => setActiveTab('checklist')}
				>
					<MaterialIcons name="checklist" size={20} color={activeTab === 'checklist' ? '#dc2626' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'checklist' && styles.activeTabText
					]}>
						Daily Checklist
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'equipment' && styles.activeTab]}
					onPress={() => setActiveTab('equipment')}
				>
					<MaterialCommunityIcons name="tools" size={20} color={activeTab === 'equipment' ? '#dc2626' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'equipment' && styles.activeTabText
					]}>
						Equipment
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'violations' && styles.activeTab]}
					onPress={() => setActiveTab('violations')}
				>
					<MaterialIcons name="report" size={20} color={activeTab === 'violations' ? '#dc2626' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'violations' && styles.activeTabText
					]}>
						Violations
					</Text>
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content}>
				{activeTab === 'checklist' && (
					<View>
						{/* Progress Overview */}
						<View style={styles.progressContainer}>
							<Text style={styles.progressTitle}>Security Checklist Progress</Text>
							<View style={styles.progressBar}>
								<View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
							</View>
							<Text style={styles.progressText}>
								{completedCount}/{securityChecklist.length} tasks completed ({Math.round(completionPercentage)}%)
							</Text>
							<Text style={styles.timeText}>
								Current Time: {currentTime.toLocaleTimeString()}
							</Text>
						</View>

						{/* Security Checklist */}
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>🛡️ Daily Security Operations</Text>
							<FlatList
								data={securityChecklist}
								renderItem={renderChecklistItem}
								keyExtractor={item => item.id}
								scrollEnabled={false}
								showsVerticalScrollIndicator={false}
							/>
						</View>

						{/* Important Guidelines */}
						<View style={styles.notesContainer}>
							<Text style={styles.notesTitle}>📋 Key Security Guidelines</Text>
							<Text style={styles.noteText}>
								• Mobile numbers must be exchanged on induction day
							</Text>
							<Text style={styles.noteText}>
								• Check all bags thoroughly - no exceptions
							</Text>
							<Text style={styles.noteText}>
								• Take photos of all items and share in WhatsApp group
							</Text>
							<Text style={styles.noteText}>
								• Never leave position when visitor wants to meet leadership
							</Text>
							<Text style={styles.noteText}>
								• Ensure 24/7 coverage - no shift gaps allowed
							</Text>
						</View>
					</View>
				)}

				{activeTab === 'equipment' && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>🔧 Equipment & Key Register</Text>
						<FlatList
							data={equipmentRegister}
							renderItem={renderEquipmentItem}
							keyExtractor={item => item.id}
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
						/>
					</View>
				)}

				{activeTab === 'violations' && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>⚠️ Security Violation Logs</Text>
						<TouchableOpacity
							style={styles.addViolationButton}
							onPress={addViolationLog}
						>
							<MaterialIcons name="add-circle" size={20} color="white" />
							<Text style={styles.addViolationText}>Report New Violation</Text>
						</TouchableOpacity>
						<FlatList
							data={violationLogs}
							renderItem={renderViolationItem}
							keyExtractor={item => item.id}
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
						/>
					</View>
				)}
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
		backgroundColor: '#dc2626',
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
	alertButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	tabContainer: {
		flexDirection: 'row',
		backgroundColor: 'white',
		marginHorizontal: 20,
		marginTop: 20,
		borderRadius: 12,
		padding: 4,
	},
	tab: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		borderRadius: 8,
	},
	activeTab: {
		backgroundColor: '#fee2e2',
	},
	tabText: {
		fontSize: 12,
		color: '#6b7280',
		marginLeft: 5,
		fontWeight: '500',
	},
	activeTabText: {
		color: '#dc2626',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	progressContainer: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 12,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	progressTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 10,
	},
	progressBar: {
		height: 8,
		backgroundColor: '#e5e7eb',
		borderRadius: 4,
		marginBottom: 10,
	},
	progressFill: {
		height: '100%',
		backgroundColor: '#dc2626',
		borderRadius: 4,
	},
	progressText: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 5,
	},
	timeText: {
		fontSize: 14,
		color: '#dc2626',
		fontWeight: '500',
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
	checklistCard: {
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
	completedTask: {
		backgroundColor: '#f0fdf4',
		borderLeftWidth: 4,
		borderLeftColor: '#10b981',
	},
	taskHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	taskInfo: {
		flex: 1,
		marginRight: 10,
	},
	taskTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 5,
	},
	completedText: {
		textDecorationLine: 'line-through',
		color: '#6b7280',
	},
	taskDescription: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 5,
	},
	taskCategory: {
		fontSize: 12,
		color: '#10b981',
		fontWeight: '500',
	},
	taskActions: {
		alignItems: 'flex-end',
	},
	priorityBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginBottom: 8,
	},
	priorityText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
	},
	checkButton: {
		padding: 4,
	},
	checkedButton: {
		backgroundColor: '#10b981',
		borderRadius: 12,
	},
	equipmentCard: {
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
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	equipmentInfo: {
		flex: 1,
	},
	equipmentName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	equipmentLocation: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 2,
	},
	equipmentResponsible: {
		fontSize: 12,
		color: '#10b981',
	},
	equipmentStatus: {
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
		fontSize: 12,
		fontWeight: '500',
	},
	lastChecked: {
		fontSize: 10,
		color: '#6b7280',
	},
	updateButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f0fdf4',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		alignSelf: 'flex-start',
	},
	updateButtonText: {
		fontSize: 12,
		color: '#10b981',
		marginLeft: 5,
		fontWeight: '500',
	},
	violationCard: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
		borderLeftWidth: 4,
		borderLeftColor: '#f59e0b',
	},
	violationHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	violationType: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	violationStatus: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	violationStatusText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	violationPerson: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 4,
	},
	violationDescription: {
		fontSize: 14,
		color: '#1f2937',
		marginBottom: 4,
	},
	violationAction: {
		fontSize: 14,
		color: '#10b981',
		marginBottom: 4,
		fontWeight: '500',
	},
	violationTime: {
		fontSize: 12,
		color: '#6b7280',
	},
	addViolationButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#dc2626',
		paddingHorizontal: 15,
		paddingVertical: 12,
		borderRadius: 8,
		marginBottom: 15,
		alignSelf: 'flex-start',
	},
	addViolationText: {
		color: 'white',
		fontSize: 14,
		fontWeight: '500',
		marginLeft: 8,
	},
	notesContainer: {
		backgroundColor: '#fef3c7',
		padding: 15,
		borderRadius: 12,
		marginBottom: 20,
	},
	notesTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#92400e',
		marginBottom: 10,
	},
	noteText: {
		fontSize: 14,
		color: '#92400e',
		marginBottom: 5,
		lineHeight: 20,
	},
});

export default SecurityStaffManagement;