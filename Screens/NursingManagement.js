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

const NursingManagement = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTab, setSelectedTab] = useState('assignments');
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [selectedPatient, setSelectedPatient] = useState(null);

	const [nursingData, setNursingData] = useState({
		assignments: [
			{
				id: 'PA001',
				patientName: 'Sarah Johnson',
				patientId: 'P12345',
				roomNumber: '201A',
				bedNumber: 'B1',
				ward: 'Medical Ward',
				assignedNurse: 'Nurse Mary',
				condition: 'Stable',
				priority: 'Normal',
				admissionDate: '2024-01-10',
				diagnosis: 'Pneumonia',
				lastVitals: {
					temperature: '98.6°F',
					bloodPressure: '120/80',
					heartRate: '72 bpm',
					respiration: '16/min',
					oxygenSaturation: '98%',
					recordedAt: '10:30 AM'
				},
				medications: [
					{ name: 'Amoxicillin 500mg', time: '8:00 AM', status: 'Given' },
					{ name: 'Paracetamol 500mg', time: '2:00 PM', status: 'Pending' }
				],
				careNotes: 'Patient responding well to treatment. Appetite improving.'
			},
			{
				id: 'PA002',
				patientName: 'Mike Davis',
				patientId: 'P12346',
				roomNumber: '203B',
				bedNumber: 'B2',
				ward: 'Surgical Ward',
				assignedNurse: 'Nurse Emily',
				condition: 'Post-Operative',
				priority: 'High',
				admissionDate: '2024-01-14',
				diagnosis: 'Appendectomy',
				lastVitals: {
					temperature: '99.2°F',
					bloodPressure: '130/85',
					heartRate: '85 bpm',
					respiration: '18/min',
					oxygenSaturation: '97%',
					recordedAt: '9:45 AM'
				},
				medications: [
					{ name: 'Morphine 10mg', time: '6:00 AM', status: 'Given' },
					{ name: 'Cephalexin 500mg', time: '12:00 PM', status: 'Pending' }
				],
				careNotes: 'Post-surgical recovery. Monitor for signs of infection.'
			}
		],
		tasks: [
			{
				id: 'T001',
				patientId: 'P12345',
				patientName: 'Sarah Johnson',
				task: 'Administer medication',
				medication: 'Paracetamol 500mg',
				scheduledTime: '2:00 PM',
				status: 'Pending',
				priority: 'Normal',
				instructions: 'Give with food if patient experiences nausea'
			},
			{
				id: 'T002',
				patientId: 'P12346',
				patientName: 'Mike Davis',
				task: 'Check vital signs',
				scheduledTime: '3:00 PM',
				status: 'Pending',
				priority: 'High',
				instructions: 'Monitor blood pressure closely'
			},
			{
				id: 'T003',
				patientId: 'P12345',
				patientName: 'Sarah Johnson',
				task: 'Wound dressing change',
				scheduledTime: '4:00 PM',
				status: 'Pending',
				priority: 'Normal',
				instructions: 'Use sterile technique'
			}
		],
		vitals: [
			{
				id: 'V001',
				patientId: 'P12345',
				patientName: 'Sarah Johnson',
				time: '10:30 AM',
				temperature: '98.6',
				bloodPressure: '120/80',
				heartRate: '72',
				respiration: '16',
				oxygenSaturation: '98',
				weight: '65',
				height: '165',
				notes: 'Patient feeling better'
			}
		]
	});

	const tabOptions = [
		{ key: 'assignments', label: 'Patient Assignments', icon: 'assignment-ind' },
		{ key: 'tasks', label: 'Tasks', icon: 'task-alt' },
		{ key: 'vitals', label: 'Vital Signs', icon: 'favorite' },
		{ key: 'medications', label: 'Medications', icon: 'medication' }
	];

	const getConditionColor = (condition) => {
		switch (condition) {
			case 'Stable': return '#10b981';
			case 'Critical': return '#ef4444';
			case 'Post-Operative': return '#f59e0b';
			case 'Recovering': return '#3b82f6';
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

	const getTaskStatusColor = (status) => {
		switch (status) {
			case 'Completed': return '#10b981';
			case 'Pending': return '#f59e0b';
			case 'Overdue': return '#ef4444';
			case 'Given': return '#10b981';
			default: return '#6b7280';
		}
	};

	const handleTaskComplete = (taskId) => {
		setNursingData(prev => ({
			...prev,
			tasks: prev.tasks.map(task =>
				task.id === taskId ? { ...task, status: 'Completed' } : task
			)
		}));
		Alert.alert('Success', 'Task marked as completed');
	};

	const handleMedicationGiven = (patientId, medicationName) => {
		setNursingData(prev => ({
			...prev,
			assignments: prev.assignments.map(assignment =>
				assignment.patientId === patientId
					? {
						...assignment,
						medications: assignment.medications.map(med =>
							med.name === medicationName ? { ...med, status: 'Given' } : med
						)
					}
					: assignment
			)
		}));
		Alert.alert('Success', 'Medication administration recorded');
	};

	const renderPatientAssignment = ({ item }) => (
		<TouchableOpacity
			style={styles.assignmentItem}
			onPress={() => {
				setSelectedPatient(item);
				setShowDetailsModal(true);
			}}
		>
			<View style={styles.assignmentHeader}>
				<View style={styles.patientInfo}>
					<Text style={styles.patientName}>{item.patientName}</Text>
					<Text style={styles.patientId}>ID: {item.patientId}</Text>
					<Text style={styles.roomInfo}>Room {item.roomNumber} - Bed {item.bedNumber}</Text>
					<Text style={styles.ward}>{item.ward}</Text>
				</View>
				<View style={styles.statusContainer}>
					<View style={[styles.conditionBadge, { backgroundColor: getConditionColor(item.condition) }]}>
						<Text style={styles.conditionText}>{item.condition}</Text>
					</View>
					<View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
						<Text style={styles.priorityText}>{item.priority}</Text>
					</View>
				</View>
			</View>

			<View style={styles.assignmentDetails}>
				<View style={styles.detailRow}>
					<FontAwesome5 name="user-md" size={12} color="#6b7280" />
					<Text style={styles.detailText}>Nurse: {item.assignedNurse}</Text>
				</View>
				<View style={styles.detailRow}>
					<FontAwesome5 name="calendar" size={12} color="#6b7280" />
					<Text style={styles.detailText}>Admitted: {item.admissionDate}</Text>
				</View>
				<View style={styles.detailRow}>
					<FontAwesome5 name="notes-medical" size={12} color="#6b7280" />
					<Text style={styles.detailText}>Diagnosis: {item.diagnosis}</Text>
				</View>
			</View>

			<View style={styles.vitalsPreview}>
				<Text style={styles.vitalsTitle}>Last Vitals ({item.lastVitals.recordedAt})</Text>
				<View style={styles.vitalsRow}>
					<Text style={styles.vitalItem}>Temp: {item.lastVitals.temperature}</Text>
					<Text style={styles.vitalItem}>BP: {item.lastVitals.bloodPressure}</Text>
					<Text style={styles.vitalItem}>HR: {item.lastVitals.heartRate}</Text>
					<Text style={styles.vitalItem}>SpO2: {item.lastVitals.oxygenSaturation}</Text>
				</View>
			</View>

			<View style={styles.medicationsPreview}>
				<Text style={styles.medicationsTitle}>Medications Due</Text>
				{item.medications.filter(med => med.status === 'Pending').map((med, index) => (
					<View key={index} style={styles.medicationItem}>
						<Text style={styles.medicationName}>{med.name}</Text>
						<Text style={styles.medicationTime}>{med.time}</Text>
						<TouchableOpacity
							style={styles.giveButton}
							onPress={() => handleMedicationGiven(item.patientId, med.name)}
						>
							<Text style={styles.giveButtonText}>Give</Text>
						</TouchableOpacity>
					</View>
				))}
			</View>
		</TouchableOpacity>
	);

	const renderTask = ({ item }) => (
		<View style={styles.taskItem}>
			<View style={styles.taskHeader}>
				<View style={styles.taskInfo}>
					<Text style={styles.taskTitle}>{item.task}</Text>
					<Text style={styles.taskPatient}>{item.patientName}</Text>
					{item.medication && (
						<Text style={styles.taskMedication}>{item.medication}</Text>
					)}
				</View>
				<View style={styles.taskStatus}>
					<Text style={styles.taskTime}>{item.scheduledTime}</Text>
					<View style={[styles.taskStatusBadge, { backgroundColor: getTaskStatusColor(item.status) }]}>
						<Text style={styles.taskStatusText}>{item.status}</Text>
					</View>
				</View>
			</View>

			{item.instructions && (
				<View style={styles.instructionsContainer}>
					<Text style={styles.instructionsText}>{item.instructions}</Text>
				</View>
			)}

			{item.status === 'Pending' && (
				<TouchableOpacity
					style={styles.completeButton}
					onPress={() => handleTaskComplete(item.id)}
				>
					<FontAwesome5 name="check" size={16} color="white" />
					<Text style={styles.completeButtonText}>Complete Task</Text>
				</TouchableOpacity>
			)}
		</View>
	);

	const renderVitalSigns = ({ item }) => (
		<View style={styles.vitalsItem}>
			<View style={styles.vitalsHeader}>
				<Text style={styles.vitalsPatient}>{item.patientName}</Text>
				<Text style={styles.vitalsTime}>{item.time}</Text>
			</View>

			<View style={styles.vitalsGrid}>
				<View style={styles.vitalSignItem}>
					<FontAwesome5 name="thermometer-half" size={16} color="#ef4444" />
					<Text style={styles.vitalSignLabel}>Temperature</Text>
					<Text style={styles.vitalSignValue}>{item.temperature}°F</Text>
				</View>
				<View style={styles.vitalSignItem}>
					<FontAwesome5 name="heartbeat" size={16} color="#ef4444" />
					<Text style={styles.vitalSignLabel}>Blood Pressure</Text>
					<Text style={styles.vitalSignValue}>{item.bloodPressure}</Text>
				</View>
				<View style={styles.vitalSignItem}>
					<FontAwesome5 name="heart" size={16} color="#ef4444" />
					<Text style={styles.vitalSignLabel}>Heart Rate</Text>
					<Text style={styles.vitalSignValue}>{item.heartRate} bpm</Text>
				</View>
				<View style={styles.vitalSignItem}>
					<FontAwesome5 name="lungs" size={16} color="#3b82f6" />
					<Text style={styles.vitalSignLabel}>Respiration</Text>
					<Text style={styles.vitalSignValue}>{item.respiration}/min</Text>
				</View>
				<View style={styles.vitalSignItem}>
					<FontAwesome5 name="percentage" size={16} color="#10b981" />
					<Text style={styles.vitalSignLabel}>SpO2</Text>
					<Text style={styles.vitalSignValue}>{item.oxygenSaturation}%</Text>
				</View>
				<View style={styles.vitalSignItem}>
					<FontAwesome5 name="weight" size={16} color="#f59e0b" />
					<Text style={styles.vitalSignLabel}>Weight</Text>
					<Text style={styles.vitalSignValue}>{item.weight} kg</Text>
				</View>
			</View>

			{item.notes && (
				<View style={styles.vitalsNotes}>
					<Text style={styles.vitalsNotesText}>{item.notes}</Text>
				</View>
			)}
		</View>
	);

	const renderTabContent = () => {
		switch (selectedTab) {
			case 'assignments':
				return (
					<FlatList
						data={nursingData.assignments}
						renderItem={renderPatientAssignment}
						keyExtractor={item => item.id}
						showsVerticalScrollIndicator={false}
					/>
				);
			case 'tasks':
				return (
					<FlatList
						data={nursingData.tasks}
						renderItem={renderTask}
						keyExtractor={item => item.id}
						showsVerticalScrollIndicator={false}
					/>
				);
			case 'vitals':
				return (
					<FlatList
						data={nursingData.vitals}
						renderItem={renderVitalSigns}
						keyExtractor={item => item.id}
						showsVerticalScrollIndicator={false}
					/>
				);
			case 'medications':
				return (
					<View style={styles.comingSoon}>
						<FontAwesome5 name="pills" size={50} color="#d1d5db" />
						<Text style={styles.comingSoonText}>Medications view coming soon</Text>
					</View>
				);
			default:
				return null;
		}
	};

	const renderPatientDetails = () => {
		if (!selectedPatient) return null;

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
						<Text style={styles.modalTitle}>Patient Care Details</Text>
						<TouchableOpacity>
							<FontAwesome5 name="edit" size={20} color="#dc2626" />
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.modalContent}>
						<View style={styles.patientSection}>
							<Text style={styles.sectionTitle}>Patient Information</Text>
							<Text style={styles.patientDetail}>Name: {selectedPatient.patientName}</Text>
							<Text style={styles.patientDetail}>ID: {selectedPatient.patientId}</Text>
							<Text style={styles.patientDetail}>Room: {selectedPatient.roomNumber}</Text>
							<Text style={styles.patientDetail}>Bed: {selectedPatient.bedNumber}</Text>
							<Text style={styles.patientDetail}>Ward: {selectedPatient.ward}</Text>
							<Text style={styles.patientDetail}>Condition: {selectedPatient.condition}</Text>
							<Text style={styles.patientDetail}>Assigned Nurse: {selectedPatient.assignedNurse}</Text>
						</View>

						<View style={styles.vitalsSection}>
							<Text style={styles.sectionTitle}>Current Vital Signs</Text>
							<View style={styles.vitalsDetailGrid}>
								{Object.entries(selectedPatient.lastVitals).map(([key, value]) => (
									key !== 'recordedAt' && (
										<View key={key} style={styles.vitalDetailItem}>
											<Text style={styles.vitalDetailLabel}>
												{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
											</Text>
											<Text style={styles.vitalDetailValue}>{value}</Text>
										</View>
									)
								))}
							</View>
							<Text style={styles.recordedTime}>Recorded at: {selectedPatient.lastVitals.recordedAt}</Text>
						</View>

						<View style={styles.medicationsSection}>
							<Text style={styles.sectionTitle}>Medications</Text>
							{selectedPatient.medications.map((med, index) => (
								<View key={index} style={styles.medicationDetailItem}>
									<Text style={styles.medicationDetailName}>{med.name}</Text>
									<Text style={styles.medicationDetailTime}>Scheduled: {med.time}</Text>
									<View style={[
										styles.medicationStatusBadge,
										{ backgroundColor: getTaskStatusColor(med.status) }
									]}>
										<Text style={styles.medicationStatusText}>{med.status}</Text>
									</View>
								</View>
							))}
						</View>

						<View style={styles.notesSection}>
							<Text style={styles.sectionTitle}>Care Notes</Text>
							<Text style={styles.careNotesText}>{selectedPatient.careNotes}</Text>
						</View>
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
				<Text style={styles.headerTitle}>Nursing Management</Text>
				<TouchableOpacity style={styles.addButton}>
					<MaterialIcons name="add" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<View style={styles.searchContainer}>
				<View style={styles.searchBox}>
					<MaterialIcons name="search" size={20} color="#6b7280" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search patients, tasks, nurses..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
			</View>

			<View style={styles.tabsContainer}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{tabOptions.map(tab => (
						<TouchableOpacity
							key={tab.key}
							style={[
								styles.tabButton,
								selectedTab === tab.key && styles.activeTabButton
							]}
							onPress={() => setSelectedTab(tab.key)}
						>
							<MaterialIcons
								name={tab.icon}
								size={20}
								color={selectedTab === tab.key ? 'white' : '#6b7280'}
							/>
							<Text style={[
								styles.tabButtonText,
								selectedTab === tab.key && styles.activeTabButtonText
							]}>
								{tab.label}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			<View style={styles.content}>
				{renderTabContent()}
			</View>

			{renderPatientDetails()}
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
		backgroundColor: '#dc2626',
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
	tabsContainer: {
		paddingHorizontal: 20,
		paddingBottom: 15,
	},
	tabButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 10,
		marginRight: 10,
		backgroundColor: 'white',
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	activeTabButton: {
		backgroundColor: '#dc2626',
		borderColor: '#dc2626',
	},
	tabButtonText: {
		fontSize: 14,
		color: '#374151',
		fontWeight: '500',
		marginLeft: 5,
	},
	activeTabButtonText: {
		color: 'white',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	assignmentItem: {
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
	assignmentHeader: {
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
		fontSize: 12,
		color: '#6b7280',
		marginBottom: 2,
	},
	roomInfo: {
		fontSize: 14,
		color: '#374151',
		marginBottom: 2,
	},
	ward: {
		fontSize: 12,
		color: '#dc2626',
		fontWeight: '500',
	},
	statusContainer: {
		alignItems: 'flex-end',
	},
	conditionBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginBottom: 5,
	},
	conditionText: {
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
	assignmentDetails: {
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
	vitalsPreview: {
		backgroundColor: '#f9fafb',
		padding: 10,
		borderRadius: 8,
		marginBottom: 10,
	},
	vitalsTitle: {
		fontSize: 12,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 5,
	},
	vitalsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	vitalItem: {
		fontSize: 11,
		color: '#6b7280',
	},
	medicationsPreview: {
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
		paddingTop: 10,
	},
	medicationsTitle: {
		fontSize: 12,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 8,
	},
	medicationItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 5,
	},
	medicationName: {
		fontSize: 12,
		color: '#374151',
		flex: 1,
	},
	medicationTime: {
		fontSize: 11,
		color: '#6b7280',
		marginHorizontal: 10,
	},
	giveButton: {
		backgroundColor: '#10b981',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	giveButtonText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '600',
	},
	taskItem: {
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
	taskHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	taskInfo: {
		flex: 1,
	},
	taskTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	taskPatient: {
		fontSize: 14,
		color: '#374151',
		marginBottom: 2,
	},
	taskMedication: {
		fontSize: 12,
		color: '#6b7280',
	},
	taskStatus: {
		alignItems: 'flex-end',
	},
	taskTime: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 5,
	},
	taskStatusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	taskStatusText: {
		color: 'white',
		fontSize: 11,
		fontWeight: '600',
	},
	instructionsContainer: {
		backgroundColor: '#f0fdf4',
		padding: 10,
		borderRadius: 8,
		marginBottom: 10,
	},
	instructionsText: {
		fontSize: 12,
		color: '#374151',
		lineHeight: 16,
	},
	completeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#10b981',
		padding: 10,
		borderRadius: 8,
	},
	completeButtonText: {
		color: 'white',
		fontSize: 14,
		fontWeight: '600',
		marginLeft: 8,
	},
	vitalsItem: {
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
	vitalsHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	vitalsPatient: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	vitalsTime: {
		fontSize: 14,
		color: '#6b7280',
	},
	vitalsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	vitalSignItem: {
		width: '48%',
		alignItems: 'center',
		marginBottom: 15,
		padding: 10,
		backgroundColor: '#f9fafb',
		borderRadius: 8,
	},
	vitalSignLabel: {
		fontSize: 11,
		color: '#6b7280',
		marginTop: 5,
		textAlign: 'center',
	},
	vitalSignValue: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
		marginTop: 2,
	},
	vitalsNotes: {
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
		paddingTop: 10,
		marginTop: 10,
	},
	vitalsNotesText: {
		fontSize: 12,
		color: '#374151',
		fontStyle: 'italic',
	},
	comingSoon: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	comingSoonText: {
		fontSize: 16,
		color: '#6b7280',
		marginTop: 10,
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
	vitalsSection: {
		marginBottom: 20,
		padding: 15,
		backgroundColor: '#fef2f2',
		borderRadius: 12,
	},
	medicationsSection: {
		marginBottom: 20,
		padding: 15,
		backgroundColor: '#f0f9ff',
		borderRadius: 12,
	},
	notesSection: {
		padding: 15,
		backgroundColor: '#f0fdf4',
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
	vitalsDetailGrid: {
		marginBottom: 10,
	},
	vitalDetailItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	vitalDetailLabel: {
		fontSize: 14,
		color: '#6b7280',
	},
	vitalDetailValue: {
		fontSize: 14,
		color: '#1f2937',
		fontWeight: '500',
	},
	recordedTime: {
		fontSize: 12,
		color: '#6b7280',
		fontStyle: 'italic',
	},
	medicationDetailItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 10,
		borderRadius: 8,
		marginBottom: 8,
	},
	medicationDetailName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
		flex: 1,
	},
	medicationDetailTime: {
		fontSize: 12,
		color: '#6b7280',
		marginRight: 10,
	},
	medicationStatusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	medicationStatusText: {
		fontSize: 10,
		color: 'white',
		fontWeight: '600',
	},
	careNotesText: {
		fontSize: 14,
		color: '#374151',
		lineHeight: 20,
	},
});

export default NursingManagement;