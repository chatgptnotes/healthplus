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
	Modal,
	TextInput,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const StaffTrainingModule = (props) => {
	const [activeTab, setActiveTab] = useState('training');
	const [showAddModal, setShowAddModal] = useState(false);
	const [selectedProgram, setSelectedProgram] = useState(null);

	// Training programs based on SOP content
	const [trainingPrograms, setTrainingPrograms] = useState([
		{
			id: 'TRN001',
			title: 'Annual Training and Development Meeting',
			description: 'Comprehensive training for long-term employees and induction for new inductees',
			date: '2025-04-22',
			type: 'mandatory',
			duration: '8 hours',
			trainer: 'Leadership Team',
			department: 'All Departments',
			capacity: 100,
			enrolled: 87,
			status: 'scheduled',
			modules: [
				'Culture of Hope, Goal setting and achieving',
				'Structure of Hope Group Management',
				'The 24/7/30 Follow Up System',
				'Speak Up Policy Implementation',
				'Reporting Systems and Protocols'
			],
			attendees: [
				{ name: 'डॉ. राजेश शर्मा', department: 'Cardiology', status: 'confirmed' },
				{ name: 'नर्स प्रिया', department: 'ICU', status: 'confirmed' },
				{ name: 'अमित सिंह', department: 'Lab', status: 'pending' }
			]
		},
		{
			id: 'TRN002',
			title: 'Monthly Zoom Meeting Protocol',
			description: 'Revised monthly meeting protocols for remote coordination',
			date: '2024-03-23',
			type: 'recurring',
			duration: '2 hours',
			trainer: 'Department Heads',
			department: 'Leadership',
			capacity: 25,
			enrolled: 23,
			status: 'completed',
			modules: [
				'Virtual Meeting Best Practices',
				'Technology Platform Usage',
				'Documentation Requirements',
				'Follow-up Protocols'
			]
		},
		{
			id: 'TRN003',
			title: 'Housekeeping Staff Induction Training',
			description: 'Comprehensive induction training for housekeeping staff',
			date: '2024-02-15',
			type: 'induction',
			duration: '4 hours',
			trainer: 'Trainer Sakshi',
			department: 'Housekeeping',
			capacity: 15,
			enrolled: 12,
			status: 'ongoing',
			modules: [
				'Hospital Hygiene Standards',
				'Infection Control Protocols',
				'Equipment Usage and Safety',
				'Emergency Procedures'
			]
		},
		{
			id: 'TRN004',
			title: 'Morning Huddle Script Training',
			description: 'Training on effective morning huddle conduct',
			date: '2024-01-20',
			type: 'operational',
			duration: '1 hour',
			trainer: 'Operations Manager',
			department: 'All Departments',
			capacity: 50,
			enrolled: 45,
			status: 'completed',
			modules: [
				'Huddle Structure and Timing',
				'Key Discussion Points',
				'Documentation Requirements',
				'Follow-up Actions'
			]
		}
	]);

	// Performance assessment data based on "Go Green" system
	const [performanceData, setPerformanceData] = useState([
		{
			id: 'PERF001',
			employeeName: 'डॉ. राजेश शर्मा',
			department: 'Cardiology',
			role: 'Senior Consultant',
			lastAssessment: '2024-01-15',
			overallScore: 85,
			metrics: {
				attendance: 90,
				professionalism: 88,
				teamwork: 82,
				patientCare: 87,
				innovation: 85
			},
			trainingCompleted: 8,
			trainingRequired: 10,
			certifications: ['BLS Certified', 'Advanced Cardiac Care']
		},
		{
			id: 'PERF002',
			employeeName: 'नर्स प्रिया',
			department: 'ICU',
			role: 'Staff Nurse',
			lastAssessment: '2024-01-10',
			overallScore: 92,
			metrics: {
				attendance: 95,
				professionalism: 90,
				teamwork: 94,
				patientCare: 93,
				innovation: 88
			},
			trainingCompleted: 12,
			trainingRequired: 12,
			certifications: ['Critical Care Nursing', 'Infection Control']
		},
		{
			id: 'PERF003',
			employeeName: 'अमित सिंह',
			department: 'Laboratory',
			role: 'Lab Technician',
			lastAssessment: '2024-01-05',
			overallScore: 78,
			metrics: {
				attendance: 85,
				professionalism: 75,
				teamwork: 80,
				patientCare: 82,
				innovation: 70
			},
			trainingCompleted: 5,
			trainingRequired: 8,
			certifications: ['Lab Safety', 'Quality Control']
		}
	]);

	// Department-specific training requirements based on SOP
	const departmentTraining = {
		'All Departments': [
			'Culture of Hope orientation',
			'Goal setting and achievement',
			'24/7/30 Follow Up System',
			'Speak Up Policy',
			'Emergency Procedures'
		],
		'Billing': [
			'Standard Operating Procedure for Documentation',
			'TPA Billing Protocols',
			'Arthroscopy Billing',
			'Surgeon and Physician Visit Charges',
			'Software Bug Reporting'
		],
		'Nursing': [
			'New ICU protocols',
			'Daily bed making and linen reporting',
			'Medication administration',
			'Patient care documentation',
			'Team building activities'
		],
		'Housekeeping': [
			'Hospital hygiene standards',
			'Infection control protocols',
			'Equipment usage and safety',
			'Emergency cleaning procedures'
		],
		'Security': [
			'Night guard responsibilities',
			'Personal belongings security checks',
			'Hospital premises protocols',
			'Emergency response procedures'
		],
		'Laboratory': [
			'Equipment maintenance protocols',
			'Quality control procedures',
			'Sample handling and processing',
			'Result reporting standards'
		]
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'scheduled': return '#f59e0b';
			case 'ongoing': return '#10b981';
			case 'completed': return '#6b7280';
			case 'cancelled': return '#dc2626';
			default: return '#6b7280';
		}
	};

	const getTypeColor = (type) => {
		switch (type) {
			case 'mandatory': return '#dc2626';
			case 'induction': return '#10b981';
			case 'recurring': return '#f59e0b';
			case 'operational': return '#6366f1';
			default: return '#6b7280';
		}
	};

	const getPerformanceColor = (score) => {
		if (score >= 90) return '#10b981';
		if (score >= 80) return '#f59e0b';
		if (score >= 70) return '#f97316';
		return '#dc2626';
	};

	const renderTrainingCard = ({ item }) => (
		<TouchableOpacity
			style={styles.trainingCard}
			onPress={() => showTrainingDetails(item)}
		>
			<View style={styles.cardHeader}>
				<View style={styles.trainingInfo}>
					<Text style={styles.trainingTitle}>{item.title}</Text>
					<Text style={styles.trainingDescription}>{item.description}</Text>
					<Text style={styles.trainingTrainer}>Trainer: {item.trainer}</Text>
				</View>
				<View style={styles.badgeContainer}>
					<View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
						<Text style={styles.badgeText}>{item.type.toUpperCase()}</Text>
					</View>
					<View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
						<Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
					</View>
				</View>
			</View>

			<View style={styles.trainingDetails}>
				<View style={styles.detailRow}>
					<MaterialIcons name="calendar-today" size={16} color="#6b7280" />
					<Text style={styles.detailText}>{item.date}</Text>
				</View>
				<View style={styles.detailRow}>
					<MaterialIcons name="access-time" size={16} color="#6b7280" />
					<Text style={styles.detailText}>{item.duration}</Text>
				</View>
				<View style={styles.detailRow}>
					<MaterialCommunityIcons name="office-building" size={16} color="#6b7280" />
					<Text style={styles.detailText}>{item.department}</Text>
				</View>
				<View style={styles.detailRow}>
					<MaterialIcons name="group" size={16} color="#6b7280" />
					<Text style={styles.detailText}>{item.enrolled}/{item.capacity} enrolled</Text>
				</View>
			</View>

			<View style={styles.progressContainer}>
				<View style={styles.progressBar}>
					<View style={[
						styles.progressFill,
						{ width: `${(item.enrolled / item.capacity) * 100}%` }
					]} />
				</View>
				<Text style={styles.progressText}>
					{Math.round((item.enrolled / item.capacity) * 100)}% enrolled
				</Text>
			</View>
		</TouchableOpacity>
	);

	const renderPerformanceCard = ({ item }) => (
		<TouchableOpacity
			style={styles.performanceCard}
			onPress={() => showPerformanceDetails(item)}
		>
			<View style={styles.performanceHeader}>
				<View style={styles.employeeInfo}>
					<Text style={styles.employeeName}>{item.employeeName}</Text>
					<Text style={styles.employeeRole}>{item.role}</Text>
					<Text style={styles.employeeDepartment}>{item.department}</Text>
				</View>
				<View style={styles.scoreContainer}>
					<Text style={[
						styles.overallScore,
						{ color: getPerformanceColor(item.overallScore) }
					]}>
						{item.overallScore}
					</Text>
					<Text style={styles.scoreLabel}>Overall Score</Text>
				</View>
			</View>

			<View style={styles.metricsContainer}>
				{Object.entries(item.metrics).map(([key, value]) => (
					<View key={key} style={styles.metricItem}>
						<Text style={styles.metricLabel}>{key}</Text>
						<View style={styles.metricBar}>
							<View style={[
								styles.metricFill,
								{
									width: `${value}%`,
									backgroundColor: getPerformanceColor(value)
								}
							]} />
						</View>
						<Text style={styles.metricValue}>{value}</Text>
					</View>
				))}
			</View>

			<View style={styles.trainingProgress}>
				<Text style={styles.trainingProgressText}>
					Training Progress: {item.trainingCompleted}/{item.trainingRequired}
				</Text>
				<View style={styles.certificationsContainer}>
					{item.certifications.map((cert, index) => (
						<View key={index} style={styles.certificationBadge}>
							<Text style={styles.certificationText}>{cert}</Text>
						</View>
					))}
				</View>
			</View>
		</TouchableOpacity>
	);

	const showTrainingDetails = (training) => {
		const modulesList = training.modules.map((module, index) => `${index + 1}. ${module}`).join('\n');
		Alert.alert(
			training.title,
			`Description: ${training.description}\n\nTrainer: ${training.trainer}\nDate: ${training.date}\nDuration: ${training.duration}\nDepartment: ${training.department}\n\nModules:\n${modulesList}\n\nEnrollment: ${training.enrolled}/${training.capacity}`,
			[
				{ text: 'Enroll Staff', onPress: () => enrollStaff(training.id) },
				{ text: 'View Attendance', onPress: () => viewAttendance(training.id) },
				{ text: 'OK' }
			]
		);
	};

	const showPerformanceDetails = (performance) => {
		const metricsDetails = Object.entries(performance.metrics)
			.map(([key, value]) => `${key}: ${value}%`)
			.join('\n');

		Alert.alert(
			`${performance.employeeName} - Performance Review`,
			`Department: ${performance.department}\nRole: ${performance.role}\nLast Assessment: ${performance.lastAssessment}\n\nPerformance Metrics:\n${metricsDetails}\n\nOverall Score: ${performance.overallScore}%\n\nTraining Status: ${performance.trainingCompleted}/${performance.trainingRequired} completed\n\nCertifications:\n${performance.certifications.join('\n')}`,
			[
				{ text: 'Schedule Training', onPress: () => scheduleTraining(performance.id) },
				{ text: 'Update Assessment', onPress: () => updateAssessment(performance.id) },
				{ text: 'OK' }
			]
		);
	};

	const enrollStaff = (trainingId) => {
		Alert.alert('Enroll Staff', 'Staff enrollment feature will be implemented.');
	};

	const viewAttendance = (trainingId) => {
		Alert.alert('View Attendance', 'Attendance tracking feature will be implemented.');
	};

	const scheduleTraining = (performanceId) => {
		Alert.alert('Schedule Training', 'Training scheduling feature will be implemented.');
	};

	const updateAssessment = (performanceId) => {
		Alert.alert('Update Assessment', 'Performance assessment update feature will be implemented.');
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
				<Text style={styles.headerTitle}>Staff Training & Development</Text>
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => setShowAddModal(true)}
				>
					<MaterialIcons name="add" size={24} color="white" />
				</TouchableOpacity>
			</View>

			{/* Tab Navigation */}
			<View style={styles.tabContainer}>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'training' && styles.activeTab]}
					onPress={() => setActiveTab('training')}
				>
					<MaterialIcons name="school" size={20} color={activeTab === 'training' ? '#10b981' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'training' && styles.activeTabText
					]}>
						Training Programs
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'performance' && styles.activeTab]}
					onPress={() => setActiveTab('performance')}
				>
					<MaterialIcons name="assessment" size={20} color={activeTab === 'performance' ? '#10b981' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'performance' && styles.activeTabText
					]}>
						Performance
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'requirements' && styles.activeTab]}
					onPress={() => setActiveTab('requirements')}
				>
					<MaterialIcons name="assignment" size={20} color={activeTab === 'requirements' ? '#10b981' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'requirements' && styles.activeTabText
					]}>
						Requirements
					</Text>
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content}>
				{activeTab === 'training' && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Training Programs</Text>
						<FlatList
							data={trainingPrograms}
							renderItem={renderTrainingCard}
							keyExtractor={item => item.id}
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
						/>
					</View>
				)}

				{activeTab === 'performance' && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Go Green Performance Assessment</Text>
						<Text style={styles.sectionSubtitle}>
							Performance evaluation based on attendance, professionalism, and teamwork
						</Text>
						<FlatList
							data={performanceData}
							renderItem={renderPerformanceCard}
							keyExtractor={item => item.id}
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
						/>
					</View>
				)}

				{activeTab === 'requirements' && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Department Training Requirements</Text>
						{Object.entries(departmentTraining).map(([department, requirements]) => (
							<View key={department} style={styles.requirementCard}>
								<Text style={styles.departmentTitle}>{department}</Text>
								{requirements.map((req, index) => (
									<Text key={index} style={styles.requirementItem}>
										• {req}
									</Text>
								))}
							</View>
						))}
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
	addButton: {
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
		backgroundColor: '#f0fdf4',
	},
	tabText: {
		fontSize: 12,
		color: '#6b7280',
		marginLeft: 5,
		fontWeight: '500',
	},
	activeTabText: {
		color: '#10b981',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	section: {
		marginBottom: 25,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 5,
	},
	sectionSubtitle: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 15,
	},
	trainingCard: {
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
	trainingInfo: {
		flex: 1,
		marginRight: 10,
	},
	trainingTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 5,
	},
	trainingDescription: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 5,
	},
	trainingTrainer: {
		fontSize: 12,
		color: '#10b981',
		fontWeight: '500',
	},
	badgeContainer: {
		alignItems: 'flex-end',
	},
	typeBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginBottom: 4,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	badgeText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
	},
	trainingDetails: {
		marginBottom: 10,
	},
	detailRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 5,
	},
	detailText: {
		fontSize: 14,
		color: '#6b7280',
		marginLeft: 8,
	},
	progressContainer: {
		marginTop: 10,
	},
	progressBar: {
		height: 6,
		backgroundColor: '#e5e7eb',
		borderRadius: 3,
		marginBottom: 5,
	},
	progressFill: {
		height: '100%',
		backgroundColor: '#10b981',
		borderRadius: 3,
	},
	progressText: {
		fontSize: 12,
		color: '#6b7280',
		textAlign: 'right',
	},
	performanceCard: {
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
	performanceHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 15,
	},
	employeeInfo: {
		flex: 1,
	},
	employeeName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	employeeRole: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 2,
	},
	employeeDepartment: {
		fontSize: 12,
		color: '#10b981',
	},
	scoreContainer: {
		alignItems: 'center',
	},
	overallScore: {
		fontSize: 24,
		fontWeight: '700',
	},
	scoreLabel: {
		fontSize: 12,
		color: '#6b7280',
	},
	metricsContainer: {
		marginBottom: 15,
	},
	metricItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	metricLabel: {
		fontSize: 12,
		color: '#6b7280',
		width: 80,
		textTransform: 'capitalize',
	},
	metricBar: {
		flex: 1,
		height: 6,
		backgroundColor: '#e5e7eb',
		borderRadius: 3,
		marginHorizontal: 10,
	},
	metricFill: {
		height: '100%',
		borderRadius: 3,
	},
	metricValue: {
		fontSize: 12,
		color: '#1f2937',
		fontWeight: '500',
		width: 30,
		textAlign: 'right',
	},
	trainingProgress: {
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
		paddingTop: 10,
	},
	trainingProgressText: {
		fontSize: 14,
		color: '#1f2937',
		marginBottom: 10,
	},
	certificationsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	certificationBadge: {
		backgroundColor: '#f0fdf4',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginRight: 5,
		marginBottom: 5,
	},
	certificationText: {
		fontSize: 10,
		color: '#10b981',
		fontWeight: '500',
	},
	requirementCard: {
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
	departmentTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 10,
	},
	requirementItem: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 5,
		lineHeight: 20,
	},
});

export default StaffTrainingModule;