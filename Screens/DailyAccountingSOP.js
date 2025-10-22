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
	RefreshControl,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const DailyAccountingSOP = (props) => {
	const [refreshing, setRefreshing] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());

	// Daily Accounting Tasks based on Hope & Ayushman Hospitals SOP
	const [dailyTasks, setDailyTasks] = useState([
		{
			id: '1',
			title: 'Payment Protocol',
			description: 'No cash payments - UPI/Bank Transfer/Cheque only',
			status: 'pending',
			priority: 'critical',
			deadline: '10:00 AM',
			responsible: 'Account Team',
			completed: false,
			subtasks: [
				'No payments should be made in cash',
				'All transactions via UPI, bank transfer or cheque',
				'Maintain cashbook and daybook entries daily',
				'Track petty cash transactions'
			]
		},
		{
			id: '2',
			title: 'Approval System for Payments',
			description: 'Three-tier approval: Gaurav + Accountant + Receiver',
			status: 'pending',
			priority: 'critical',
			deadline: '11:00 AM',
			responsible: 'Gaurav Agrawal',
			completed: false,
			subtasks: [
				'Gaurav Agrawal approval required',
				'Accountant who is paying approval',
				'Receiving person confirmation',
				'Document voucher approval trail digitally',
				'Send all vouchers in 1 PDF by mail'
			]
		},
		{
			id: '3',
			title: 'Daily Bank Reconciliation',
			description: 'Complete bank reconciliation before 5 PM deadline',
			status: 'pending',
			priority: 'critical',
			deadline: '5:00 PM',
			responsible: 'Accounts Officer',
			completed: false,
			subtasks: [
				'Download bank statements',
				'Match transactions with ledger entries',
				'Identify discrepancies',
				'Prepare reconciliation report',
				'Submit before 5 PM deadline'
			]
		},
		{
			id: '4',
			title: 'Cash Balance Verification',
			description: 'Verify cash balance across all collection points',
			status: 'pending',
			priority: 'high',
			deadline: '6:00 PM',
			responsible: 'Cashier Team',
			completed: false,
			subtasks: [
				'Count cash at OPD counter',
				'Verify emergency counter cash',
				'Check pharmacy cash balance',
				'Update cash position report'
			]
		},
		{
			id: '5',
			title: 'Patient Ledger & Admission Records',
			description: 'Update patient accounts and admission details',
			status: 'pending',
			priority: 'medium',
			deadline: '7:00 PM',
			responsible: 'Billing Team',
			completed: false,
			subtasks: [
				'Update patient admission records',
				'Verify patient ledger entries',
				'Check discharge summaries',
				'Update insurance claim records'
			]
		},
		{
			id: '6',
			title: 'Journal Vouchers (JV)',
			description: 'Process and approve journal vouchers',
			status: 'pending',
			priority: 'medium',
			deadline: '8:00 PM',
			responsible: 'Accounts Team',
			completed: false,
			subtasks: [
				'Review pending journal vouchers',
				'Verify supporting documents',
				'Process approved vouchers',
				'Update general ledger'
			]
		},
		{
			id: '7',
			title: 'Reporting & Expertise',
			description: 'Generate daily financial reports',
			status: 'pending',
			priority: 'medium',
			deadline: '9:00 PM',
			responsible: 'Finance Manager',
			completed: false,
			subtasks: [
				'Generate daily collection report',
				'Prepare department-wise revenue',
				'Create expense summary',
				'Compile management dashboard'
			]
		},
		{
			id: '8',
			title: 'Communication & Documentation',
			description: 'Share reports and maintain documentation',
			status: 'pending',
			priority: 'low',
			deadline: '10:00 PM',
			responsible: 'Admin Team',
			completed: false,
			subtasks: [
				'Email reports to management',
				'Update documentation files',
				'Backup daily records',
				'Prepare next day schedule'
			]
		}
	]);

	// Emergency contacts from the SOP
	const [emergencyContacts, setEmergencyContacts] = useState([
		{
			id: '1',
			name: 'Dr. Murali',
			role: 'Director',
			phone: '+91 98765 43210',
			email: 'dr.murali@ayushmanhospital.in',
			department: 'Administration'
		},
		{
			id: '2',
			name: 'Shrikant',
			role: 'Financial Operations Head',
			phone: '+91 98765 43211',
			email: 'shrikant@hopehospital.in',
			department: 'Finance'
		},
		{
			id: '3',
			name: 'Gaurav',
			role: 'HR & Staff Management',
			phone: '+91 98765 43212',
			email: 'gaurav@hopehospital.in',
			department: 'Human Resources'
		},
		{
			id: '4',
			name: 'Ruby',
			role: 'Administration Manager',
			phone: '+91 98765 43213',
			email: 'ruby@hopehospital.in',
			department: 'Administration'
		}
	]);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000);
		return () => clearInterval(timer);
	}, []);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		// Simulate API call
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}, []);

	const toggleTaskCompletion = (taskId) => {
		setDailyTasks(prevTasks =>
			prevTasks.map(task =>
				task.id === taskId
					? { ...task, completed: !task.completed, status: !task.completed ? 'completed' : 'pending' }
					: task
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

	const getTimeStatus = (deadline) => {
		const currentHour = currentTime.getHours();
		const currentMinute = currentTime.getMinutes();
		const [deadlineHour, deadlineMinute] = deadline.split(':');
		const deadlineTime = parseInt(deadlineHour) * 60 + parseInt(deadlineMinute.split(' ')[0]);
		const currentTimeInMinutes = currentHour * 60 + currentMinute;

		if (currentTimeInMinutes > deadlineTime) {
			return 'overdue';
		} else if (deadlineTime - currentTimeInMinutes <= 60) {
			return 'due-soon';
		}
		return 'on-time';
	};

	const renderTaskCard = ({ item }) => (
		<TouchableOpacity
			style={[styles.taskCard, item.completed && styles.completedTask]}
			onPress={() => showTaskDetails(item)}
		>
			<View style={styles.taskHeader}>
				<View style={styles.taskInfo}>
					<Text style={[styles.taskTitle, item.completed && styles.completedText]}>
						{item.title}
					</Text>
					<Text style={styles.taskDescription}>{item.description}</Text>
					<Text style={styles.taskResponsible}>Responsible: {item.responsible}</Text>
				</View>
				<View style={styles.taskActions}>
					<View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
						<Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
					</View>
					<TouchableOpacity
						style={[styles.checkButton, item.completed && styles.checkedButton]}
						onPress={() => toggleTaskCompletion(item.id)}
					>
						<MaterialIcons
							name={item.completed ? "check-circle" : "radio-button-unchecked"}
							size={24}
							color={item.completed ? "white" : "#6b7280"}
						/>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.taskFooter}>
				<View style={[styles.deadlineContainer, {
					backgroundColor: getTimeStatus(item.deadline) === 'overdue' ? '#fee2e2' :
						getTimeStatus(item.deadline) === 'due-soon' ? '#fef3c7' : '#f0fdf4'
				}]}>
					<MaterialIcons name="schedule" size={16} color={
						getTimeStatus(item.deadline) === 'overdue' ? '#dc2626' :
						getTimeStatus(item.deadline) === 'due-soon' ? '#f59e0b' : '#10b981'
					} />
					<Text style={[styles.deadlineText, {
						color: getTimeStatus(item.deadline) === 'overdue' ? '#dc2626' :
							getTimeStatus(item.deadline) === 'due-soon' ? '#f59e0b' : '#10b981'
					}]}>
						Deadline: {item.deadline}
					</Text>
				</View>
				<Text style={styles.subtaskCount}>
					{item.subtasks.length} subtasks
				</Text>
			</View>
		</TouchableOpacity>
	);

	const showTaskDetails = (task) => {
		const subtaskList = task.subtasks.map((subtask, index) => `${index + 1}. ${subtask}`).join('\n');
		Alert.alert(
			`${task.title} - Details`,
			`Description: ${task.description}\n\nResponsible: ${task.responsible}\nDeadline: ${task.deadline}\nPriority: ${task.priority.toUpperCase()}\n\nSubtasks:\n${subtaskList}`,
			[
				{ text: 'Mark Complete', onPress: () => toggleTaskCompletion(task.id) },
				{ text: 'OK' }
			]
		);
	};

	const renderEmergencyContact = ({ item }) => (
		<TouchableOpacity style={styles.contactCard}>
			<View style={styles.contactHeader}>
				<MaterialIcons name="person" size={24} color="#10b981" />
				<View style={styles.contactInfo}>
					<Text style={styles.contactName}>{item.name}</Text>
					<Text style={styles.contactRole}>{item.role}</Text>
					<Text style={styles.contactDepartment}>{item.department}</Text>
				</View>
			</View>
			<View style={styles.contactActions}>
				<TouchableOpacity style={styles.contactButton}>
					<MaterialIcons name="phone" size={20} color="#10b981" />
					<Text style={styles.contactButtonText}>{item.phone}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.contactButton}>
					<MaterialIcons name="email" size={20} color="#10b981" />
					<Text style={styles.contactButtonText}>Email</Text>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);

	const completedTasksCount = dailyTasks.filter(task => task.completed).length;
	const completionPercentage = (completedTasksCount / dailyTasks.length) * 100;

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => props.navigation.goBack()}
				>
					<MaterialIcons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Daily Accounting SOP</Text>
				<TouchableOpacity style={styles.helpButton}>
					<MaterialIcons name="help-outline" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<ScrollView
				style={styles.content}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				{/* Progress Overview */}
				<View style={styles.progressContainer}>
					<Text style={styles.progressTitle}>Daily Progress</Text>
					<View style={styles.progressBar}>
						<View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
					</View>
					<Text style={styles.progressText}>
						{completedTasksCount}/{dailyTasks.length} tasks completed ({Math.round(completionPercentage)}%)
					</Text>
					<Text style={styles.timeText}>
						Current Time: {currentTime.toLocaleTimeString()}
					</Text>
				</View>

				{/* Daily Tasks */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						🏥 Daily Accounting SOP for Hope & Ayushman Hospitals
					</Text>
					<FlatList
						data={dailyTasks}
						renderItem={renderTaskCard}
						keyExtractor={item => item.id}
						scrollEnabled={false}
						showsVerticalScrollIndicator={false}
					/>
				</View>

				{/* Emergency Contacts */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>📞 Emergency Contacts</Text>
					<FlatList
						data={emergencyContacts}
						renderItem={renderEmergencyContact}
						keyExtractor={item => item.id}
						scrollEnabled={false}
						showsVerticalScrollIndicator={false}
					/>
				</View>

				{/* Important Notes */}
				<View style={styles.notesContainer}>
					<Text style={styles.notesTitle}>📌 Important Reminders</Text>
					<Text style={styles.noteText}>
						• Daily Bank Reconciliation deadline: 5 PM (Critical)
					</Text>
					<Text style={styles.noteText}>
						• Any Amazon packages for Dr. Murali should not be opened at reception
					</Text>
					<Text style={styles.noteText}>
						• "Go Green" performance assessment must evaluate attendance, professionalism, and teamwork
					</Text>
					<Text style={styles.noteText}>
						• Mandatory Patient-Wise Reconciliation is top priority
					</Text>
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
		fontSize: 20,
		fontWeight: '700',
		color: 'white',
		textAlign: 'center',
		flex: 1,
	},
	helpButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
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
		backgroundColor: '#10b981',
		borderRadius: 4,
	},
	progressText: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 5,
	},
	timeText: {
		fontSize: 14,
		color: '#10b981',
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
	taskCard: {
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
		marginBottom: 10,
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
	taskResponsible: {
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
	taskFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	deadlineContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	deadlineText: {
		fontSize: 12,
		marginLeft: 4,
		fontWeight: '500',
	},
	subtaskCount: {
		fontSize: 12,
		color: '#6b7280',
	},
	contactCard: {
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
	contactHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	contactInfo: {
		marginLeft: 10,
		flex: 1,
	},
	contactName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	contactRole: {
		fontSize: 14,
		color: '#6b7280',
	},
	contactDepartment: {
		fontSize: 12,
		color: '#10b981',
	},
	contactActions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	contactButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f0fdf4',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		flex: 0.48,
	},
	contactButtonText: {
		fontSize: 12,
		color: '#10b981',
		marginLeft: 5,
		fontWeight: '500',
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

export default DailyAccountingSOP;