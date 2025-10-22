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
	Image,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const OTTechnicianModule = (props) => {
	const [activeTab, setActiveTab] = useState('checklist');
	const [showImageModal, setShowImageModal] = useState(false);
	const [selectedImageType, setSelectedImageType] = useState('');

	// Daily OT checklist based on SOP
	const [otChecklist, setOtChecklist] = useState([
		{
			id: 'OT001',
			title: 'Attend Zoom Meeting',
			description: 'Join daily 9 AM zoom meeting',
			priority: 'critical',
			completed: false,
			time: '9:00 AM',
			category: 'Daily Operations',
			subtasks: [
				'Know how to join zoom meetings',
				'Have stable internet connection',
				'Keep camera and audio ready',
				'Take notes during meeting'
			]
		},
		{
			id: 'OT002',
			title: 'Pre-Operative Preparation',
			description: 'Prepare OT before surgery with sterilized instruments',
			priority: 'critical',
			completed: false,
			time: 'Before each surgery',
			category: 'Surgery Preparation',
			subtasks: [
				'Sterilize all instruments',
				'Set up required surgical equipment',
				'Ensure sterile environment',
				'Verify patient details and surgical procedure',
				'Check consent forms are signed'
			]
		},
		{
			id: 'OT003',
			title: 'Surgical Assistance',
			description: 'Assist surgeons during operations',
			priority: 'critical',
			completed: false,
			time: 'During surgery',
			category: 'Surgery Support',
			subtasks: [
				'Hand over surgical instruments',
				'Provide suction as needed',
				'Prepare sutures',
				'Anticipate surgeon needs',
				'Maintain sterile field'
			]
		},
		{
			id: 'OT004',
			title: 'Post-Surgery Documentation',
			description: 'Document surgery details and share in WhatsApp group',
			priority: 'high',
			completed: false,
			time: 'After surgery',
			category: 'Documentation',
			subtasks: [
				'Note surgery name in file',
				'Record implant details',
				'Document anaesthesia type',
				'Share in WhatsApp group',
				'Complete OT notes and consents'
			]
		},
		{
			id: 'OT005',
			title: 'Equipment Documentation',
			description: 'Take snaps of instruments and equipment for training',
			priority: 'medium',
			completed: false,
			time: 'Daily',
			category: 'Training & Documentation',
			subtasks: [
				'Photograph all instrument sets',
				'Document patient positions for surgeries',
				'Take pictures of plasters and thomas splint',
				'Document tourniquet usage',
				'Photograph table accessories'
			]
		},
		{
			id: 'OT006',
			title: 'Equipment Status Update',
			description: 'Post images of working equipment with status notes',
			priority: 'medium',
			completed: false,
			time: 'Daily',
			category: 'Equipment Management',
			subtasks: [
				'Take photos of all equipment',
				'Add working status notes',
				'Report any malfunctions',
				'Update equipment inventory',
				'Coordinate repairs if needed'
			]
		},
		{
			id: 'OT007',
			title: 'Sterilization Records',
			description: 'Maintain fumigation and autoclave registers',
			priority: 'high',
			completed: false,
			time: 'Daily',
			category: 'Infection Control',
			subtasks: [
				'Update fumigation register',
				'Maintain autoclave records',
				'Post registers in WhatsApp group',
				'Ensure sterilization protocols',
				'Monitor infection control measures'
			]
		},
		{
			id: 'OT008',
			title: 'Patient Safety Monitoring',
			description: 'Monitor patient vitals and ensure safety during surgery',
			priority: 'critical',
			completed: false,
			time: 'During surgery',
			category: 'Patient Safety',
			subtasks: [
				'Monitor temperature, heart rate, BP',
				'Ensure proper patient positioning',
				'Assist with anesthesia preparation',
				'Secure patients on operating table',
				'Minimize injury risk'
			]
		}
	]);

	// Equipment inventory with images
	const [equipmentInventory, setEquipmentInventory] = useState([
		{
			id: 'EQ001',
			name: 'Surgical Instrument Set A',
			category: 'Instruments',
			status: 'Working',
			lastSterilized: '2024-01-20',
			nextSterilization: '2024-01-21',
			imageRequired: true,
			hasImage: false
		},
		{
			id: 'EQ002',
			name: 'Autoclave Machine',
			category: 'Sterilization',
			status: 'Working',
			lastMaintenance: '2024-01-15',
			nextMaintenance: '2024-02-15',
			imageRequired: true,
			hasImage: false
		},
		{
			id: 'EQ003',
			name: 'Operating Table',
			category: 'Furniture',
			status: 'Working',
			lastChecked: '2024-01-20',
			accessories: ['Table pads', 'Positioning aids', 'Straps'],
			imageRequired: true,
			hasImage: false
		},
		{
			id: 'EQ004',
			name: 'Tourniquet Machine',
			category: 'Equipment',
			status: 'Working',
			lastCalibration: '2024-01-10',
			nextCalibration: '2024-04-10',
			imageRequired: true,
			hasImage: false
		},
		{
			id: 'EQ005',
			name: 'Suction Machine',
			category: 'Equipment',
			status: 'Working',
			lastMaintenance: '2024-01-18',
			nextMaintenance: '2024-02-18',
			imageRequired: true,
			hasImage: false
		}
	]);

	// Surgery types and patient positions
	const [surgeryPositions, setSurgeryPositions] = useState([
		{
			id: 'POS001',
			surgeryType: 'Orthopedic - Hip Replacement',
			position: 'Lateral Position',
			equipment: ['Hip positioning device', 'Table pads', 'Straps'],
			imageRequired: true,
			hasImage: false
		},
		{
			id: 'POS002',
			surgeryType: 'Cardiac Surgery',
			position: 'Supine Position',
			equipment: ['Cardiac positioning aids', 'Arm boards', 'Head rest'],
			imageRequired: true,
			hasImage: false
		},
		{
			id: 'POS003',
			surgeryType: 'Neurosurgery',
			position: 'Prone Position',
			equipment: ['Head clamp', 'Chest supports', 'Arm rests'],
			imageRequired: true,
			hasImage: false
		}
	]);

	// Training documentation
	const [trainingDocuments, setTrainingDocuments] = useState([
		{
			id: 'TRN001',
			title: 'Sterilization Protocols',
			type: 'SOP Document',
			lastUpdated: '2024-01-15',
			status: 'Current',
			mandatory: true
		},
		{
			id: 'TRN002',
			title: 'Surgical Instrument Handling',
			type: 'Training Video',
			lastUpdated: '2024-01-10',
			status: 'Current',
			mandatory: true
		},
		{
			id: 'TRN003',
			title: 'Patient Positioning Guidelines',
			type: 'Photo Documentation',
			lastUpdated: '2024-01-18',
			status: 'Current',
			mandatory: false
		}
	]);

	const toggleChecklistItem = (itemId) => {
		setOtChecklist(prevList =>
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
					<Text style={styles.taskTime}>⏰ {item.time}</Text>
					<Text style={styles.taskCategory}>{item.category}</Text>
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
					<Text style={styles.equipmentName}>{item.name}</Text>
					<Text style={styles.equipmentCategory}>{item.category}</Text>
				</View>
				<View style={styles.equipmentStatus}>
					<View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
						<Text style={styles.statusText}>{item.status}</Text>
					</View>
					{!item.hasImage && (
						<TouchableOpacity
							style={styles.photoButton}
							onPress={() => takeEquipmentPhoto(item.id)}
						>
							<MaterialIcons name="camera-alt" size={20} color="#f59e0b" />
						</TouchableOpacity>
					)}
				</View>
			</View>
			<View style={styles.equipmentDetails}>
				{item.lastSterilized && (
					<Text style={styles.equipmentDetail}>Last Sterilized: {item.lastSterilized}</Text>
				)}
				{item.lastMaintenance && (
					<Text style={styles.equipmentDetail}>Last Maintenance: {item.lastMaintenance}</Text>
				)}
				{item.accessories && (
					<Text style={styles.equipmentDetail}>
						Accessories: {item.accessories.join(', ')}
					</Text>
				)}
			</View>
		</TouchableOpacity>
	);

	const renderPositionItem = ({ item }) => (
		<TouchableOpacity style={styles.positionCard}>
			<View style={styles.positionHeader}>
				<Text style={styles.surgeryType}>{item.surgeryType}</Text>
				{!item.hasImage && (
					<TouchableOpacity
						style={styles.photoButton}
						onPress={() => takePositionPhoto(item.id)}
					>
						<MaterialIcons name="camera-alt" size={20} color="#8b5cf6" />
					</TouchableOpacity>
				)}
			</View>
			<Text style={styles.positionName}>Position: {item.position}</Text>
			<Text style={styles.positionEquipment}>
				Equipment: {item.equipment.join(', ')}
			</Text>
			{item.hasImage && (
				<View style={styles.imageStatus}>
					<MaterialIcons name="check-circle" size={16} color="#10b981" />
					<Text style={styles.imageStatusText}>Photo documented</Text>
				</View>
			)}
		</TouchableOpacity>
	);

	const renderTrainingItem = ({ item }) => (
		<TouchableOpacity style={styles.trainingCard}>
			<View style={styles.trainingHeader}>
				<View style={styles.trainingInfo}>
					<Text style={styles.trainingTitle}>{item.title}</Text>
					<Text style={styles.trainingType}>{item.type}</Text>
				</View>
				<View style={styles.trainingStatus}>
					{item.mandatory && (
						<View style={styles.mandatoryBadge}>
							<Text style={styles.mandatoryText}>MANDATORY</Text>
						</View>
					)}
					<Text style={styles.trainingDate}>Updated: {item.lastUpdated}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);

	const showTaskDetails = (task) => {
		let details = `${task.description}\n\nTime: ${task.time}\nCategory: ${task.category}\nPriority: ${task.priority.toUpperCase()}`;

		if (task.subtasks) {
			details += '\n\nSubtasks:\n' + task.subtasks.map((subtask, index) => `${index + 1}. ${subtask}`).join('\n');
		}

		Alert.alert(task.title, details, [
			{ text: 'Mark Complete', onPress: () => toggleChecklistItem(task.id) },
			{ text: 'OK' }
		]);
	};

	const takeEquipmentPhoto = (equipmentId) => {
		Alert.alert(
			'Equipment Photo',
			'Take a photo of this equipment with working status note',
			[
				{ text: 'Take Photo', onPress: () => captureEquipmentImage(equipmentId) },
				{ text: 'Cancel', style: 'cancel' }
			]
		);
	};

	const takePositionPhoto = (positionId) => {
		Alert.alert(
			'Position Documentation',
			'Take a photo showing proper patient positioning for this surgery type',
			[
				{ text: 'Take Photo', onPress: () => capturePositionImage(positionId) },
				{ text: 'Cancel', style: 'cancel' }
			]
		);
	};

	const captureEquipmentImage = (equipmentId) => {
		setEquipmentInventory(prev =>
			prev.map(item =>
				item.id === equipmentId
					? { ...item, hasImage: true }
					: item
			)
		);
		Alert.alert('Photo Captured', 'Equipment photo has been taken and will be shared in WhatsApp group.');
	};

	const capturePositionImage = (positionId) => {
		setSurgeryPositions(prev =>
			prev.map(item =>
				item.id === positionId
					? { ...item, hasImage: true }
					: item
			)
		);
		Alert.alert('Photo Captured', 'Position documentation photo has been taken for training purposes.');
	};

	const completedCount = otChecklist.filter(item => item.completed).length;
	const completionPercentage = (completedCount / otChecklist.length) * 100;

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => props.navigation.goBack()}
				>
					<MaterialIcons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>OT Technician Module</Text>
				<TouchableOpacity
					style={styles.zoomButton}
					onPress={() => Alert.alert('Zoom Meeting', 'Join daily 9 AM zoom meeting')}
				>
					<MaterialCommunityIcons name="video" size={24} color="white" />
				</TouchableOpacity>
			</View>

			{/* Tab Navigation */}
			<View style={styles.tabContainer}>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'checklist' && styles.activeTab]}
					onPress={() => setActiveTab('checklist')}
				>
					<MaterialIcons name="checklist" size={16} color={activeTab === 'checklist' ? '#8b5cf6' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'checklist' && styles.activeTabText
					]}>
						Daily Tasks
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'equipment' && styles.activeTab]}
					onPress={() => setActiveTab('equipment')}
				>
					<MaterialCommunityIcons name="tools" size={16} color={activeTab === 'equipment' ? '#8b5cf6' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'equipment' && styles.activeTabText
					]}>
						Equipment
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'positions' && styles.activeTab]}
					onPress={() => setActiveTab('positions')}
				>
					<MaterialCommunityIcons name="human-handsup" size={16} color={activeTab === 'positions' ? '#8b5cf6' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'positions' && styles.activeTabText
					]}>
						Positions
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'training' && styles.activeTab]}
					onPress={() => setActiveTab('training')}
				>
					<MaterialIcons name="school" size={16} color={activeTab === 'training' ? '#8b5cf6' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'training' && styles.activeTabText
					]}>
						Training
					</Text>
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content}>
				{activeTab === 'checklist' && (
					<View>
						{/* Progress Overview */}
						<View style={styles.progressContainer}>
							<Text style={styles.progressTitle}>Daily OT Tasks Progress</Text>
							<View style={styles.progressBar}>
								<View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
							</View>
							<Text style={styles.progressText}>
								{completedCount}/{otChecklist.length} tasks completed ({Math.round(completionPercentage)}%)
							</Text>
						</View>

						{/* OT Checklist */}
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>🏥 OT Technician Daily Checklist</Text>
							<FlatList
								data={otChecklist}
								renderItem={renderChecklistItem}
								keyExtractor={item => item.id}
								scrollEnabled={false}
								showsVerticalScrollIndicator={false}
							/>
						</View>

						{/* Important Guidelines */}
						<View style={styles.notesContainer}>
							<Text style={styles.notesTitle}>📋 OT Guidelines & Protocols</Text>
							<Text style={styles.noteText}>
								• Join daily 9 AM zoom meetings - know how to use zoom
							</Text>
							<Text style={styles.noteText}>
								• All OT notes and consents must be shared in WhatsApp group
							</Text>
							<Text style={styles.noteText}>
								• Fumigation and autoclave registers posted daily
							</Text>
							<Text style={styles.noteText}>
								• Take photos for training: instruments, positions, equipment
							</Text>
							<Text style={styles.noteText}>
								• Ensure NABH compliance for all documentation
							</Text>
						</View>
					</View>
				)}

				{activeTab === 'equipment' && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>🔧 Equipment Management & Documentation</Text>
						<Text style={styles.sectionSubtitle}>
							Take photos of all equipment with working status notes
						</Text>
						<FlatList
							data={equipmentInventory}
							renderItem={renderEquipmentItem}
							keyExtractor={item => item.id}
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
						/>
					</View>
				)}

				{activeTab === 'positions' && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>👤 Patient Positions for Surgery Types</Text>
						<Text style={styles.sectionSubtitle}>
							Document patient positioning for training purposes
						</Text>
						<FlatList
							data={surgeryPositions}
							renderItem={renderPositionItem}
							keyExtractor={item => item.id}
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
						/>
					</View>
				)}

				{activeTab === 'training' && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>📚 Training & Documentation</Text>
						<FlatList
							data={trainingDocuments}
							renderItem={renderTrainingItem}
							keyExtractor={item => item.id}
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
						/>

						{/* Compliance Requirements */}
						<View style={styles.complianceContainer}>
							<Text style={styles.complianceTitle}>✅ NABH Compliance Requirements</Text>
							<Text style={styles.complianceText}>
								• All OT notes and anesthesia notes must be complete
							</Text>
							<Text style={styles.complianceText}>
								• Documentation as per NABH norms is mandatory
							</Text>
							<Text style={styles.complianceText}>
								• Equipment calibration records must be maintained
							</Text>
							<Text style={styles.complianceText}>
								• Infection control protocols must be followed
							</Text>
						</View>
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
		backgroundColor: '#8b5cf6',
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
	zoomButton: {
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
		paddingVertical: 10,
		borderRadius: 8,
	},
	activeTab: {
		backgroundColor: '#f3f4f6',
	},
	tabText: {
		fontSize: 10,
		color: '#6b7280',
		marginLeft: 3,
		fontWeight: '500',
	},
	activeTabText: {
		color: '#8b5cf6',
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
		backgroundColor: '#8b5cf6',
		borderRadius: 4,
	},
	progressText: {
		fontSize: 14,
		color: '#6b7280',
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
		backgroundColor: '#f3f4f6',
		borderLeftWidth: 4,
		borderLeftColor: '#8b5cf6',
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
	taskTime: {
		fontSize: 12,
		color: '#8b5cf6',
		marginBottom: 2,
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
		backgroundColor: '#8b5cf6',
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
	equipmentCategory: {
		fontSize: 14,
		color: '#6b7280',
	},
	equipmentStatus: {
		alignItems: 'flex-end',
		flexDirection: 'row',
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginRight: 8,
	},
	statusText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	photoButton: {
		padding: 4,
		borderRadius: 8,
		backgroundColor: '#fef3c7',
	},
	equipmentDetails: {
		marginTop: 8,
	},
	equipmentDetail: {
		fontSize: 12,
		color: '#6b7280',
		marginBottom: 2,
	},
	positionCard: {
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
	positionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	surgeryType: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		flex: 1,
	},
	positionName: {
		fontSize: 14,
		color: '#8b5cf6',
		marginBottom: 4,
		fontWeight: '500',
	},
	positionEquipment: {
		fontSize: 12,
		color: '#6b7280',
		marginBottom: 8,
	},
	imageStatus: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	imageStatusText: {
		fontSize: 12,
		color: '#10b981',
		marginLeft: 4,
		fontWeight: '500',
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
	trainingHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	trainingInfo: {
		flex: 1,
	},
	trainingTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	trainingType: {
		fontSize: 14,
		color: '#6b7280',
	},
	trainingStatus: {
		alignItems: 'flex-end',
	},
	mandatoryBadge: {
		backgroundColor: '#dc2626',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 6,
		marginBottom: 4,
	},
	mandatoryText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
	},
	trainingDate: {
		fontSize: 10,
		color: '#6b7280',
	},
	notesContainer: {
		backgroundColor: '#f3f4f6',
		padding: 15,
		borderRadius: 12,
		marginBottom: 20,
	},
	notesTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 10,
	},
	noteText: {
		fontSize: 14,
		color: '#374151',
		marginBottom: 5,
		lineHeight: 20,
	},
	complianceContainer: {
		backgroundColor: '#f0fdf4',
		padding: 15,
		borderRadius: 12,
		marginTop: 20,
	},
	complianceTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#065f46',
		marginBottom: 10,
	},
	complianceText: {
		fontSize: 14,
		color: '#065f46',
		marginBottom: 5,
		lineHeight: 20,
	},
});

export default OTTechnicianModule;