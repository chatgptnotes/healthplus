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
	Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const RadiologyManagement = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('All');
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [selectedStudy, setSelectedStudy] = useState(null);

	const [radiologyStudies, setRadiologyStudies] = useState([
		{
			id: 'RAD001',
			patientName: 'Sarah Johnson',
			patientId: 'P12345',
			doctorName: 'Dr. Smith',
			department: 'Cardiology',
			studyDate: '2024-01-15',
			status: 'Completed',
			priority: 'Normal',
			studyType: 'Chest X-Ray',
			bodyPart: 'Chest',
			modality: 'X-Ray',
			indication: 'Chest pain, rule out pneumonia',
			findings: 'Clear lung fields. Normal cardiac silhouette. No acute findings.',
			impression: 'Normal chest X-ray.',
			radiologistName: 'Dr. Radiologist',
			reportDate: '2024-01-15',
			images: [
				{ id: '1', name: 'PA View', url: 'chest_xray_pa.jpg' },
				{ id: '2', name: 'Lateral View', url: 'chest_xray_lateral.jpg' }
			],
			contrast: false,
			radiation: '0.1 mGy',
			technique: 'PA and Lateral views',
			totalAmount: 800.00,
			insuranceApplicable: true,
			insuranceType: 'CGHS'
		},
		{
			id: 'RAD002',
			patientName: 'Mike Davis',
			patientId: 'P12346',
			doctorName: 'Dr. Williams',
			department: 'Orthopedics',
			studyDate: '2024-01-15',
			status: 'Pending Report',
			priority: 'High',
			studyType: 'Knee MRI',
			bodyPart: 'Left Knee',
			modality: 'MRI',
			indication: 'Knee pain after sports injury, rule out meniscal tear',
			findings: 'Images acquired, pending radiologist review',
			impression: 'Pending',
			radiologistName: null,
			reportDate: null,
			images: [
				{ id: '1', name: 'Axial T1', url: 'knee_mri_t1.jpg' },
				{ id: '2', name: 'Sagittal T2', url: 'knee_mri_t2.jpg' },
				{ id: '3', name: 'Coronal PD', url: 'knee_mri_pd.jpg' }
			],
			contrast: false,
			radiation: 'None (MRI)',
			technique: 'Multi-planar multi-sequence imaging',
			totalAmount: 4500.00,
			insuranceApplicable: false,
			insuranceType: null
		},
		{
			id: 'RAD003',
			patientName: 'Emily Brown',
			patientId: 'P12347',
			doctorName: 'Dr. Johnson',
			department: 'Emergency',
			studyDate: '2024-01-14',
			status: 'In Progress',
			priority: 'Urgent',
			studyType: 'CT Head',
			bodyPart: 'Head',
			modality: 'CT',
			indication: 'Head trauma after MVA, rule out intracranial hemorrhage',
			findings: 'Scanning in progress',
			impression: 'Pending',
			radiologistName: null,
			reportDate: null,
			images: [],
			contrast: false,
			radiation: '2.0 mGy',
			technique: 'Non-contrast axial sections',
			totalAmount: 3200.00,
			insuranceApplicable: true,
			insuranceType: 'ECHS'
		},
		{
			id: 'RAD004',
			patientName: 'Alex Wilson',
			patientId: 'P12348',
			doctorName: 'Dr. Martinez',
			department: 'Gastroenterology',
			studyDate: '2024-01-14',
			status: 'Scheduled',
			priority: 'Normal',
			studyType: 'Abdominal Ultrasound',
			bodyPart: 'Abdomen',
			modality: 'Ultrasound',
			indication: 'Abdominal pain, evaluate liver and gallbladder',
			findings: 'Study not yet performed',
			impression: 'Pending',
			radiologistName: null,
			reportDate: null,
			images: [],
			contrast: false,
			radiation: 'None (Ultrasound)',
			technique: 'Real-time imaging',
			totalAmount: 1200.00,
			insuranceApplicable: true,
			insuranceType: 'Railways'
		}
	]);

	const statusOptions = ['All', 'Scheduled', 'In Progress', 'Pending Report', 'Completed', 'Cancelled'];
	const modalityOptions = ['X-Ray', 'CT', 'MRI', 'Ultrasound', 'Mammography', 'Fluoroscopy'];

	const getStatusColor = (status) => {
		switch (status) {
			case 'Scheduled': return '#f59e0b';
			case 'In Progress': return '#3b82f6';
			case 'Pending Report': return '#8b5cf6';
			case 'Completed': return '#10b981';
			case 'Cancelled': return '#ef4444';
			default: return '#6b7280';
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'Urgent': return '#ef4444';
			case 'High': return '#f59e0b';
			case 'Normal': return '#10b981';
			default: return '#6b7280';
		}
	};

	const getModalityIcon = (modality) => {
		switch (modality) {
			case 'X-Ray': return 'local-hospital';
			case 'CT': return 'scanner';
			case 'MRI': return 'biotech';
			case 'Ultrasound': return 'healing';
			case 'Mammography': return 'favorite';
			default: return 'medical-services';
		}
	};

	const filteredStudies = radiologyStudies.filter(study =>
		(selectedStatus === 'All' || study.status === selectedStatus) &&
		(study.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
		study.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
		study.studyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
		study.doctorName.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const handleStatusUpdate = (studyId, newStatus) => {
		setRadiologyStudies(prev => prev.map(study =>
			study.id === studyId
				? { ...study, status: newStatus, reportDate: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : study.reportDate }
				: study
		));
		Alert.alert('Success', `Study ${studyId} status updated to ${newStatus}`);
	};

	const calculateInsuranceCoverage = (amount, insuranceType) => {
		if (!insuranceType) return 0;
		switch (insuranceType) {
			case 'CGHS': return amount * 0.9;
			case 'ECHS': return amount * 0.85;
			case 'Railways': return amount * 0.8;
			default: return amount * 0.7;
		}
	};

	const renderStudyItem = ({ item }) => (
		<TouchableOpacity
			style={styles.studyItem}
			onPress={() => {
				setSelectedStudy(item);
				setShowDetailsModal(true);
			}}
		>
			<View style={styles.studyHeader}>
				<View style={styles.studyInfo}>
					<Text style={styles.studyId}>{item.id}</Text>
					<Text style={styles.patientName}>{item.patientName}</Text>
					<Text style={styles.studyType}>{item.studyType}</Text>
					<Text style={styles.doctorName}>Dr: {item.doctorName}</Text>
				</View>
				<View style={styles.statusContainer}>
					<View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
						<Text style={styles.statusText}>{item.status}</Text>
					</View>
					<View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
						<Text style={styles.priorityText}>{item.priority}</Text>
					</View>
					<View style={styles.modalityContainer}>
						<MaterialIcons name={getModalityIcon(item.modality)} size={16} color="#6b7280" />
						<Text style={styles.modalityText}>{item.modality}</Text>
					</View>
				</View>
			</View>

			<View style={styles.studyDetails}>
				<View style={styles.detailRow}>
					<FontAwesome5 name="calendar" size={12} color="#6b7280" />
					<Text style={styles.detailText}>Study Date: {item.studyDate}</Text>
				</View>
				<View style={styles.detailRow}>
					<FontAwesome5 name="user-md" size={12} color="#6b7280" />
					<Text style={styles.detailText}>Body Part: {item.bodyPart}</Text>
				</View>
				<View style={styles.detailRow}>
					<FontAwesome5 name="radiation-alt" size={12} color="#6b7280" />
					<Text style={styles.detailText}>Radiation: {item.radiation}</Text>
				</View>
				<View style={styles.detailRow}>
					<FontAwesome5 name="rupee-sign" size={12} color="#6b7280" />
					<Text style={styles.detailText}>Amount: ₹{item.totalAmount.toFixed(2)}</Text>
				</View>
				{item.insuranceApplicable && (
					<View style={styles.detailRow}>
						<FontAwesome5 name="shield-alt" size={12} color="#10b981" />
						<Text style={styles.detailText}>Insurance: {item.insuranceType}</Text>
					</View>
				)}
			</View>

			<View style={styles.indicationContainer}>
				<Text style={styles.indicationLabel}>Indication:</Text>
				<Text style={styles.indicationText} numberOfLines={2}>{item.indication}</Text>
			</View>

			{item.images.length > 0 && (
				<View style={styles.imagesContainer}>
					<Text style={styles.imagesLabel}>Images: {item.images.length} view(s)</Text>
					<View style={styles.imagesPreview}>
						{item.images.slice(0, 3).map((image, index) => (
							<View key={image.id} style={styles.imagePreview}>
								<MaterialIcons name="image" size={20} color="#8b5cf6" />
								<Text style={styles.imageLabel}>{image.name}</Text>
							</View>
						))}
						{item.images.length > 3 && (
							<Text style={styles.moreImages}>+{item.images.length - 3} more</Text>
						)}
					</View>
				</View>
			)}

			<View style={styles.actionButtons}>
				{item.status === 'Scheduled' && (
					<TouchableOpacity
						style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
						onPress={() => handleStatusUpdate(item.id, 'In Progress')}
					>
						<Text style={styles.actionButtonText}>Start Study</Text>
					</TouchableOpacity>
				)}
				{item.status === 'In Progress' && (
					<TouchableOpacity
						style={[styles.actionButton, { backgroundColor: '#8b5cf6' }]}
						onPress={() => handleStatusUpdate(item.id, 'Pending Report')}
					>
						<Text style={styles.actionButtonText}>Images Complete</Text>
					</TouchableOpacity>
				)}
				{item.status === 'Pending Report' && (
					<TouchableOpacity
						style={[styles.actionButton, { backgroundColor: '#10b981' }]}
						onPress={() => handleStatusUpdate(item.id, 'Completed')}
					>
						<Text style={styles.actionButtonText}>Complete Report</Text>
					</TouchableOpacity>
				)}
				{item.status === 'Completed' && (
					<View style={styles.completedActions}>
						<TouchableOpacity style={[styles.actionButton, { backgroundColor: '#6366f1' }]}>
							<FontAwesome5 name="print" size={12} color="white" />
							<Text style={styles.actionButtonText}>Print</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.actionButton, { backgroundColor: '#059669' }]}>
							<FontAwesome5 name="share" size={12} color="white" />
							<Text style={styles.actionButtonText}>Share</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);

	const renderStatusFilter = () => (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilter}>
			{statusOptions.map(status => (
				<TouchableOpacity
					key={status}
					style={[
						styles.statusButton,
						selectedStatus === status && styles.activeStatusButton
					]}
					onPress={() => setSelectedStatus(status)}
				>
					<Text style={[
						styles.statusButtonText,
						selectedStatus === status && styles.activeStatusButtonText
					]}>
						{status}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);

	const renderStudyDetails = () => {
		if (!selectedStudy) return null;

		const insuranceCoverage = selectedStudy.insuranceApplicable
			? calculateInsuranceCoverage(selectedStudy.totalAmount, selectedStudy.insuranceType)
			: 0;
		const patientPayable = selectedStudy.totalAmount - insuranceCoverage;

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
						<Text style={styles.modalTitle}>Radiology Study Details</Text>
						<TouchableOpacity>
							<FontAwesome5 name="print" size={20} color="#8b5cf6" />
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.modalContent}>
						<View style={styles.patientSection}>
							<Text style={styles.sectionTitle}>Patient Information</Text>
							<Text style={styles.patientDetail}>Name: {selectedStudy.patientName}</Text>
							<Text style={styles.patientDetail}>ID: {selectedStudy.patientId}</Text>
							<Text style={styles.patientDetail}>Study ID: {selectedStudy.id}</Text>
						</View>

						<View style={styles.studyInfoSection}>
							<Text style={styles.sectionTitle}>Study Information</Text>
							<Text style={styles.studyDetail}>Study Type: {selectedStudy.studyType}</Text>
							<Text style={styles.studyDetail}>Body Part: {selectedStudy.bodyPart}</Text>
							<Text style={styles.studyDetail}>Modality: {selectedStudy.modality}</Text>
							<Text style={styles.studyDetail}>Study Date: {selectedStudy.studyDate}</Text>
							<Text style={styles.studyDetail}>Priority: {selectedStudy.priority}</Text>
							<Text style={styles.studyDetail}>Technique: {selectedStudy.technique}</Text>
							<Text style={styles.studyDetail}>Contrast: {selectedStudy.contrast ? 'Yes' : 'No'}</Text>
							<Text style={styles.studyDetail}>Radiation Dose: {selectedStudy.radiation}</Text>
						</View>

						<View style={styles.clinicalSection}>
							<Text style={styles.sectionTitle}>Clinical Information</Text>
							<Text style={styles.clinicalDetail}>Indication: {selectedStudy.indication}</Text>
							<Text style={styles.clinicalDetail}>Ordering Doctor: {selectedStudy.doctorName}</Text>
							<Text style={styles.clinicalDetail}>Department: {selectedStudy.department}</Text>
						</View>

						{selectedStudy.images.length > 0 && (
							<View style={styles.imagesSection}>
								<Text style={styles.sectionTitle}>Images ({selectedStudy.images.length})</Text>
								{selectedStudy.images.map((image, index) => (
									<View key={image.id} style={styles.imageDetailItem}>
										<MaterialIcons name="image" size={24} color="#8b5cf6" />
										<View style={styles.imageDetailInfo}>
											<Text style={styles.imageDetailName}>{image.name}</Text>
											<Text style={styles.imageDetailFile}>{image.url}</Text>
										</View>
										<TouchableOpacity style={styles.viewImageButton}>
											<FontAwesome5 name="eye" size={16} color="#8b5cf6" />
										</TouchableOpacity>
									</View>
								))}
							</View>
						)}

						<View style={styles.reportSection}>
							<Text style={styles.sectionTitle}>Radiology Report</Text>
							<View style={styles.reportRow}>
								<Text style={styles.reportLabel}>Radiologist:</Text>
								<Text style={styles.reportValue}>{selectedStudy.radiologistName || 'Pending'}</Text>
							</View>
							<View style={styles.reportRow}>
								<Text style={styles.reportLabel}>Report Date:</Text>
								<Text style={styles.reportValue}>{selectedStudy.reportDate || 'Pending'}</Text>
							</View>
							<View style={styles.reportRow}>
								<Text style={styles.reportLabel}>Status:</Text>
								<Text style={[styles.reportValue, { color: getStatusColor(selectedStudy.status) }]}>
									{selectedStudy.status}
								</Text>
							</View>
							<View style={styles.findingsContainer}>
								<Text style={styles.findingsLabel}>Findings:</Text>
								<Text style={styles.findingsText}>{selectedStudy.findings}</Text>
							</View>
							<View style={styles.impressionContainer}>
								<Text style={styles.impressionLabel}>Impression:</Text>
								<Text style={styles.impressionText}>{selectedStudy.impression}</Text>
							</View>
						</View>

						<View style={styles.billingSection}>
							<Text style={styles.sectionTitle}>Billing Information</Text>
							<View style={styles.billingRow}>
								<Text style={styles.billingLabel}>Study Cost:</Text>
								<Text style={styles.billingValue}>₹{selectedStudy.totalAmount.toFixed(2)}</Text>
							</View>
							{selectedStudy.insuranceApplicable && (
								<>
									<View style={styles.billingRow}>
										<Text style={styles.billingLabel}>Insurance ({selectedStudy.insuranceType}):</Text>
										<Text style={styles.billingValue}>-₹{insuranceCoverage.toFixed(2)}</Text>
									</View>
									<View style={styles.billingRow}>
										<Text style={styles.billingLabelBold}>Patient Payable:</Text>
										<Text style={styles.billingValueBold}>₹{patientPayable.toFixed(2)}</Text>
									</View>
								</>
							)}
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
				<Text style={styles.headerTitle}>Radiology Management</Text>
				<TouchableOpacity style={styles.addButton}>
					<MaterialIcons name="add" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<View style={styles.searchContainer}>
				<View style={styles.searchBox}>
					<MaterialIcons name="search" size={20} color="#6b7280" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search studies, patients, doctors..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
			</View>

			{renderStatusFilter()}

			<View style={styles.statsRow}>
				<View style={[styles.statCard, { backgroundColor: '#f59e0b' }]}>
					<Text style={styles.statNumber}>{radiologyStudies.filter(s => s.status === 'Scheduled').length}</Text>
					<Text style={styles.statLabel}>Scheduled</Text>
				</View>
				<View style={[styles.statCard, { backgroundColor: '#3b82f6' }]}>
					<Text style={styles.statNumber}>{radiologyStudies.filter(s => s.status === 'In Progress').length}</Text>
					<Text style={styles.statLabel}>In Progress</Text>
				</View>
				<View style={[styles.statCard, { backgroundColor: '#10b981' }]}>
					<Text style={styles.statNumber}>{radiologyStudies.filter(s => s.status === 'Completed').length}</Text>
					<Text style={styles.statLabel}>Completed</Text>
				</View>
			</View>

			<FlatList
				data={filteredStudies}
				renderItem={renderStudyItem}
				keyExtractor={item => item.id}
				style={styles.studiesList}
				showsVerticalScrollIndicator={false}
			/>

			{renderStudyDetails()}
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
		backgroundColor: '#0ea5e9',
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
	statusFilter: {
		paddingHorizontal: 20,
		paddingBottom: 15,
	},
	statusButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginRight: 10,
		backgroundColor: 'white',
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	activeStatusButton: {
		backgroundColor: '#0ea5e9',
		borderColor: '#0ea5e9',
	},
	statusButtonText: {
		fontSize: 14,
		color: '#374151',
		fontWeight: '500',
	},
	activeStatusButtonText: {
		color: 'white',
	},
	statsRow: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		paddingBottom: 15,
		justifyContent: 'space-between',
	},
	statCard: {
		flex: 1,
		padding: 15,
		borderRadius: 12,
		alignItems: 'center',
		marginHorizontal: 5,
	},
	statNumber: {
		fontSize: 24,
		fontWeight: '700',
		color: 'white',
	},
	statLabel: {
		fontSize: 12,
		color: 'rgba(255,255,255,0.9)',
		marginTop: 2,
		textAlign: 'center',
	},
	studiesList: {
		flex: 1,
		paddingHorizontal: 20,
	},
	studyItem: {
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
	studyHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	studyInfo: {
		flex: 1,
	},
	studyId: {
		fontSize: 16,
		fontWeight: '700',
		color: '#1f2937',
		marginBottom: 2,
	},
	patientName: {
		fontSize: 15,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 2,
	},
	studyType: {
		fontSize: 14,
		color: '#0ea5e9',
		fontWeight: '500',
		marginBottom: 2,
	},
	doctorName: {
		fontSize: 12,
		color: '#6b7280',
	},
	statusContainer: {
		alignItems: 'flex-end',
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginBottom: 5,
	},
	statusText: {
		color: 'white',
		fontSize: 11,
		fontWeight: '600',
	},
	priorityBadge: {
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 6,
		marginBottom: 5,
	},
	priorityText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '600',
	},
	modalityContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	modalityText: {
		fontSize: 12,
		color: '#6b7280',
		marginLeft: 4,
	},
	studyDetails: {
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
	indicationContainer: {
		backgroundColor: '#f9fafb',
		padding: 10,
		borderRadius: 8,
		marginBottom: 10,
	},
	indicationLabel: {
		fontSize: 12,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 5,
	},
	indicationText: {
		fontSize: 12,
		color: '#6b7280',
		lineHeight: 16,
	},
	imagesContainer: {
		marginBottom: 10,
	},
	imagesLabel: {
		fontSize: 12,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 8,
	},
	imagesPreview: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	imagePreview: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f3f4f6',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		marginRight: 8,
		marginBottom: 5,
	},
	imageLabel: {
		fontSize: 10,
		color: '#6b7280',
		marginLeft: 4,
	},
	moreImages: {
		fontSize: 10,
		color: '#8b5cf6',
		fontStyle: 'italic',
		alignSelf: 'center',
	},
	actionButtons: {
		marginTop: 10,
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
		paddingTop: 10,
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
		marginBottom: 5,
	},
	actionButtonText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '600',
		marginLeft: 5,
	},
	completedActions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
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
	studyInfoSection: {
		marginBottom: 20,
		padding: 15,
		backgroundColor: '#f0f9ff',
		borderRadius: 12,
	},
	clinicalSection: {
		marginBottom: 20,
		padding: 15,
		backgroundColor: '#f0fdf4',
		borderRadius: 12,
	},
	imagesSection: {
		marginBottom: 20,
	},
	reportSection: {
		marginBottom: 20,
		padding: 15,
		backgroundColor: '#ede9fe',
		borderRadius: 12,
	},
	billingSection: {
		padding: 15,
		backgroundColor: '#fef3c7',
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
	studyDetail: {
		fontSize: 14,
		color: '#374151',
		marginBottom: 5,
	},
	clinicalDetail: {
		fontSize: 14,
		color: '#374151',
		marginBottom: 5,
	},
	imageDetailItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	imageDetailInfo: {
		flex: 1,
		marginLeft: 10,
	},
	imageDetailName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
	},
	imageDetailFile: {
		fontSize: 12,
		color: '#6b7280',
	},
	viewImageButton: {
		padding: 8,
		borderRadius: 8,
		backgroundColor: '#f3f4f6',
	},
	reportRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	reportLabel: {
		fontSize: 14,
		color: '#374151',
	},
	reportValue: {
		fontSize: 14,
		color: '#1f2937',
		fontWeight: '500',
	},
	findingsContainer: {
		marginTop: 10,
	},
	findingsLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 5,
	},
	findingsText: {
		fontSize: 14,
		color: '#374151',
		lineHeight: 20,
	},
	impressionContainer: {
		marginTop: 10,
	},
	impressionLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 5,
	},
	impressionText: {
		fontSize: 14,
		color: '#1f2937',
		fontWeight: '500',
		lineHeight: 20,
	},
	billingRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	billingLabel: {
		fontSize: 14,
		color: '#374151',
	},
	billingLabelBold: {
		fontSize: 14,
		color: '#1f2937',
		fontWeight: '600',
	},
	billingValue: {
		fontSize: 14,
		color: '#374151',
	},
	billingValueBold: {
		fontSize: 14,
		color: '#1f2937',
		fontWeight: '600',
	},
});

export default RadiologyManagement;