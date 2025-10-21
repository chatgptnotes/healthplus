import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	Modal,
	TextInput,
	Alert,
	StatusBar,
	Dimensions,
	ProgressBarAndroid,
	Platform,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const NABHAccreditation = (props) => {
	const [currentTab, setCurrentTab] = useState('overview');
	const [showStandardModal, setShowStandardModal] = useState(false);
	const [selectedStandard, setSelectedStandard] = useState(null);
	const [showEvidenceModal, setShowEvidenceModal] = useState(false);
	const [newEvidence, setNewEvidence] = useState({ title: '', description: '', type: '' });

	const [accreditationStatus] = useState({
		currentLevel: 'Full Accreditation',
		validFrom: '2023-06-15',
		validUntil: '2026-06-14',
		daysRemaining: 892,
		nextAssessment: '2025-12-15',
		overallCompliance: 94.2
	});

	const [nabhStandards] = useState([
		{
			id: '1',
			code: 'ACC.1',
			title: 'Accessibility and Continuity of Care',
			category: 'Access, Assessment and Continuity of Care Standards',
			compliance: 96,
			status: 'compliant',
			totalElements: 24,
			compliantElements: 23,
			lastAudit: '2024-01-10',
			auditor: 'Dr. Sanjay Mishra',
			nextReview: '2024-04-10'
		},
		{
			id: '2',
			code: 'COP.1',
			title: 'Patient Care Standards',
			category: 'Care of Patients',
			compliance: 92,
			status: 'compliant',
			totalElements: 18,
			compliantElements: 17,
			lastAudit: '2024-01-08',
			auditor: 'Mrs. Rita Sharma',
			nextReview: '2024-04-08'
		},
		{
			id: '3',
			code: 'MCI.1',
			title: 'Management of Communication and Information',
			category: 'Management of Communication and Information',
			compliance: 89,
			status: 'needs_improvement',
			totalElements: 16,
			compliantElements: 14,
			lastAudit: '2024-01-05',
			auditor: 'Mr. Anil Kumar',
			nextReview: '2024-04-05'
		},
		{
			id: '4',
			code: 'PFR.1',
			title: 'Patient and Family Rights',
			category: 'Patient and Family Rights',
			compliance: 98,
			status: 'excellent',
			totalElements: 20,
			compliantElements: 20,
			lastAudit: '2024-01-12',
			auditor: 'Dr. Priya Gupta',
			nextReview: '2024-04-12'
		},
		{
			id: '5',
			code: 'ASC.1',
			title: 'Assessment of Patients',
			category: 'Assessment of Patients',
			compliance: 94,
			status: 'compliant',
			totalElements: 22,
			compliantElements: 21,
			lastAudit: '2024-01-15',
			auditor: 'Mr. Rakesh Varma',
			nextReview: '2024-04-15'
		},
		{
			id: '6',
			code: 'MOI.1',
			title: 'Management of Information',
			category: 'Management of Communication and Information',
			compliance: 87,
			status: 'needs_improvement',
			totalElements: 14,
			compliantElements: 12,
			lastAudit: '2024-01-03',
			auditor: 'Mrs. Sunita Patel',
			nextReview: '2024-04-03'
		},
		{
			id: '7',
			code: 'QPS.1',
			title: 'Quality and Patient Safety',
			category: 'Quality and Patient Safety',
			compliance: 96,
			status: 'excellent',
			totalElements: 26,
			compliantElements: 25,
			lastAudit: '2024-01-18',
			auditor: 'Dr. Amit Singh',
			nextReview: '2024-04-18'
		},
		{
			id: '8',
			code: 'FMS.1',
			title: 'Facility Management and Safety',
			category: 'Facility Management and Safety',
			compliance: 91,
			status: 'compliant',
			totalElements: 32,
			compliantElements: 29,
			lastAudit: '2024-01-20',
			auditor: 'Mr. Mohan Sharma',
			nextReview: '2024-04-20'
		}
	]);

	const [evidenceLibrary] = useState([
		{
			id: '1',
			title: 'Patient Safety Protocol Manual',
			description: 'Comprehensive manual covering all patient safety protocols and procedures',
			type: 'Policy Document',
			standardId: '7',
			uploadDate: '2024-01-15',
			uploadedBy: 'Dr. Amit Singh',
			status: 'approved'
		},
		{
			id: '2',
			title: 'Infection Control Training Records',
			description: 'Training records for all staff on infection control measures',
			type: 'Training Records',
			standardId: '1',
			uploadDate: '2024-01-10',
			uploadedBy: 'Mrs. Rita Sharma',
			status: 'approved'
		},
		{
			id: '3',
			title: 'Patient Feedback System Documentation',
			description: 'Documentation of patient feedback collection and analysis system',
			type: 'Process Documentation',
			standardId: '4',
			uploadDate: '2024-01-12',
			uploadedBy: 'Dr. Priya Gupta',
			status: 'approved'
		},
		{
			id: '4',
			title: 'Emergency Response Procedure',
			description: 'Standard operating procedures for emergency response',
			type: 'SOP',
			standardId: '8',
			uploadDate: '2024-01-20',
			uploadedBy: 'Mr. Mohan Sharma',
			status: 'pending_review'
		}
	]);

	const [actionItems] = useState([
		{
			id: '1',
			title: 'Update Communication Protocol',
			description: 'Revise communication protocols to align with latest NABH guidelines',
			standardId: '3',
			priority: 'high',
			assignedTo: 'Mr. Anil Kumar',
			dueDate: '2024-02-15',
			status: 'in_progress',
			createdDate: '2024-01-05'
		},
		{
			id: '2',
			title: 'Enhance Information Management System',
			description: 'Implement digital documentation system for better information management',
			standardId: '6',
			priority: 'medium',
			assignedTo: 'Mrs. Sunita Patel',
			dueDate: '2024-03-01',
			status: 'pending',
			createdDate: '2024-01-03'
		},
		{
			id: '3',
			title: 'Staff Training on Safety Protocols',
			description: 'Conduct refresher training for all staff on updated safety protocols',
			standardId: '8',
			priority: 'high',
			assignedTo: 'Mr. Mohan Sharma',
			dueDate: '2024-02-28',
			status: 'completed',
			createdDate: '2024-01-20'
		}
	]);

	const statusColors = {
		excellent: '#10b981',
		compliant: '#3b82f6',
		needs_improvement: '#f59e0b',
		non_compliant: '#ef4444'
	};

	const statusIcons = {
		excellent: 'check-circle',
		compliant: 'check',
		needs_improvement: 'alert-triangle',
		non_compliant: 'x-circle'
	};

	const priorityColors = {
		high: '#ef4444',
		medium: '#f59e0b',
		low: '#10b981'
	};

	const getComplianceColor = (percentage) => {
		if (percentage >= 95) return '#10b981';
		if (percentage >= 90) return '#3b82f6';
		if (percentage >= 80) return '#f59e0b';
		return '#ef4444';
	};

	const renderOverviewTab = () => (
		<ScrollView>
			<View style={styles.accreditationCard}>
				<View style={styles.accreditationHeader}>
					<MaterialCommunityIcons name="certificate" size={40} color="#10b981" />
					<View style={styles.accreditationInfo}>
						<Text style={styles.accreditationTitle}>{accreditationStatus.currentLevel}</Text>
						<Text style={styles.accreditationSubtitle}>
							Valid until {accreditationStatus.validUntil}
						</Text>
						<Text style={styles.daysRemaining}>
							{accreditationStatus.daysRemaining} days remaining
						</Text>
					</View>
				</View>
				<View style={styles.complianceOverview}>
					<Text style={styles.complianceLabel}>Overall Compliance</Text>
					<Text style={styles.complianceValue}>
						{accreditationStatus.overallCompliance}%
					</Text>
					<View style={styles.progressContainer}>
						<View style={styles.progressBar}>
							<View
								style={[
									styles.progressFill,
									{
										width: `${accreditationStatus.overallCompliance}%`,
										backgroundColor: getComplianceColor(accreditationStatus.overallCompliance)
									}
								]}
							/>
						</View>
					</View>
				</View>
			</View>

			<View style={styles.statsGrid}>
				<View style={styles.statCard}>
					<MaterialCommunityIcons name="check-circle" size={24} color="#10b981" />
					<Text style={styles.statValue}>
						{nabhStandards.filter(s => s.status === 'excellent' || s.status === 'compliant').length}
					</Text>
					<Text style={styles.statLabel}>Compliant Standards</Text>
				</View>
				<View style={styles.statCard}>
					<MaterialCommunityIcons name="alert-triangle" size={24} color="#f59e0b" />
					<Text style={styles.statValue}>
						{nabhStandards.filter(s => s.status === 'needs_improvement').length}
					</Text>
					<Text style={styles.statLabel}>Need Improvement</Text>
				</View>
				<View style={styles.statCard}>
					<MaterialCommunityIcons name="calendar-clock" size={24} color="#6366f1" />
					<Text style={styles.statValue}>
						{actionItems.filter(a => a.status === 'pending' || a.status === 'in_progress').length}
					</Text>
					<Text style={styles.statLabel}>Open Actions</Text>
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Critical Standards</Text>
				{nabhStandards
					.filter(s => s.status === 'needs_improvement' || s.status === 'non_compliant')
					.map(renderStandardCard)
				}
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Upcoming Reviews</Text>
				{nabhStandards
					.sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview))
					.slice(0, 3)
					.map(renderStandardCard)
				}
			</View>
		</ScrollView>
	);

	const renderStandardsTab = () => (
		<ScrollView>
			{nabhStandards.map(renderStandardCard)}
		</ScrollView>
	);

	const renderEvidenceTab = () => (
		<ScrollView>
			<TouchableOpacity
				style={styles.addButton}
				onPress={() => setShowEvidenceModal(true)}
			>
				<MaterialCommunityIcons name="plus" size={20} color="white" />
				<Text style={styles.addButtonText}>Add Evidence</Text>
			</TouchableOpacity>

			{evidenceLibrary.map((evidence, index) => (
				<View key={evidence.id} style={styles.evidenceCard}>
					<View style={styles.evidenceHeader}>
						<MaterialCommunityIcons name="file-document" size={24} color="#6366f1" />
						<View style={styles.evidenceInfo}>
							<Text style={styles.evidenceTitle}>{evidence.title}</Text>
							<Text style={styles.evidenceType}>{evidence.type}</Text>
						</View>
						<View style={[styles.statusBadge, {
							backgroundColor: evidence.status === 'approved' ? '#10b981' : '#f59e0b'
						}]}>
							<Text style={styles.statusText}>{evidence.status}</Text>
						</View>
					</View>
					<Text style={styles.evidenceDescription}>{evidence.description}</Text>
					<View style={styles.evidenceFooter}>
						<Text style={styles.evidenceMeta}>
							Uploaded by {evidence.uploadedBy} on {evidence.uploadDate}
						</Text>
					</View>
				</View>
			))}
		</ScrollView>
	);

	const renderActionsTab = () => (
		<ScrollView>
			{actionItems.map((action, index) => (
				<View key={action.id} style={styles.actionCard}>
					<View style={styles.actionHeader}>
						<View style={styles.actionInfo}>
							<Text style={styles.actionTitle}>{action.title}</Text>
							<View style={styles.actionMeta}>
								<View style={[styles.priorityBadge, { backgroundColor: priorityColors[action.priority] }]}>
									<Text style={styles.priorityText}>{action.priority.toUpperCase()}</Text>
								</View>
								<Text style={styles.actionDueDate}>Due: {action.dueDate}</Text>
							</View>
						</View>
						<View style={[styles.actionStatusBadge, {
							backgroundColor: action.status === 'completed' ? '#10b981' :
											action.status === 'in_progress' ? '#f59e0b' : '#6b7280'
						}]}>
							<Text style={styles.actionStatusText}>{action.status}</Text>
						</View>
					</View>
					<Text style={styles.actionDescription}>{action.description}</Text>
					<Text style={styles.actionAssignee}>Assigned to: {action.assignedTo}</Text>
				</View>
			))}
		</ScrollView>
	);

	const renderStandardCard = (standard) => (
		<TouchableOpacity
			key={standard.id}
			style={styles.standardCard}
			onPress={() => {
				setSelectedStandard(standard);
				setShowStandardModal(true);
			}}
		>
			<View style={styles.standardHeader}>
				<View style={styles.standardInfo}>
					<Text style={styles.standardCode}>{standard.code}</Text>
					<Text style={styles.standardTitle}>{standard.title}</Text>
					<Text style={styles.standardCategory}>{standard.category}</Text>
				</View>
				<View style={styles.standardStatus}>
					<MaterialCommunityIcons
						name={statusIcons[standard.status]}
						size={24}
						color={statusColors[standard.status]}
					/>
				</View>
			</View>
			<View style={styles.standardMetrics}>
				<View style={styles.complianceMetric}>
					<Text style={styles.compliancePercentage}>{standard.compliance}%</Text>
					<Text style={styles.complianceElements}>
						{standard.compliantElements}/{standard.totalElements} elements
					</Text>
				</View>
				<View style={styles.standardProgress}>
					<View style={[styles.progressBar, { width: 100 }]}>
						<View
							style={[
								styles.progressFill,
								{
									width: `${standard.compliance}%`,
									backgroundColor: getComplianceColor(standard.compliance)
								}
							]}
						/>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);

	const renderStandardModal = () => (
		<Modal
			visible={showStandardModal}
			animationType="slide"
			presentationStyle="pageSheet"
		>
			<SafeAreaView style={styles.modalContainer}>
				<View style={styles.modalHeader}>
					<TouchableOpacity onPress={() => setShowStandardModal(false)}>
						<Ionicons name="close" size={24} color="#6b7280" />
					</TouchableOpacity>
					<Text style={styles.modalTitle}>NABH Standard Details</Text>
					<View style={{ width: 24 }} />
				</View>

				{selectedStandard && (
					<ScrollView style={styles.modalContent}>
						<View style={styles.standardDetailCard}>
							<View style={styles.standardDetailHeader}>
								<MaterialCommunityIcons
									name={statusIcons[selectedStandard.status]}
									size={40}
									color={statusColors[selectedStandard.status]}
								/>
								<View style={styles.standardDetailInfo}>
									<Text style={styles.standardDetailCode}>{selectedStandard.code}</Text>
									<Text style={styles.standardDetailTitle}>{selectedStandard.title}</Text>
									<Text style={styles.standardDetailCategory}>{selectedStandard.category}</Text>
								</View>
							</View>

							<View style={styles.complianceDetail}>
								<View style={styles.complianceRow}>
									<Text style={styles.complianceLabel}>Compliance Score:</Text>
									<Text style={[styles.complianceScore, { color: getComplianceColor(selectedStandard.compliance) }]}>
										{selectedStandard.compliance}%
									</Text>
								</View>
								<View style={styles.complianceRow}>
									<Text style={styles.complianceLabel}>Elements Status:</Text>
									<Text style={styles.complianceElements}>
										{selectedStandard.compliantElements} of {selectedStandard.totalElements} compliant
									</Text>
								</View>
							</View>

							<View style={styles.auditSection}>
								<Text style={styles.auditSectionTitle}>Audit Information</Text>
								<View style={styles.auditItem}>
									<Text style={styles.auditLabel}>Last Audit:</Text>
									<Text style={styles.auditValue}>{selectedStandard.lastAudit}</Text>
								</View>
								<View style={styles.auditItem}>
									<Text style={styles.auditLabel}>Auditor:</Text>
									<Text style={styles.auditValue}>{selectedStandard.auditor}</Text>
								</View>
								<View style={styles.auditItem}>
									<Text style={styles.auditLabel}>Next Review:</Text>
									<Text style={styles.auditValue}>{selectedStandard.nextReview}</Text>
								</View>
							</View>

							<View style={styles.relatedSection}>
								<Text style={styles.relatedSectionTitle}>Related Evidence</Text>
								{evidenceLibrary
									.filter(e => e.standardId === selectedStandard.id)
									.map((evidence, index) => (
										<View key={index} style={styles.relatedEvidence}>
											<MaterialCommunityIcons name="file-document" size={16} color="#6366f1" />
											<Text style={styles.relatedEvidenceTitle}>{evidence.title}</Text>
										</View>
									))}
							</View>

							<View style={styles.relatedSection}>
								<Text style={styles.relatedSectionTitle}>Related Actions</Text>
								{actionItems
									.filter(a => a.standardId === selectedStandard.id)
									.map((action, index) => (
										<View key={index} style={styles.relatedAction}>
											<MaterialCommunityIcons name="clipboard-list" size={16} color="#f59e0b" />
											<Text style={styles.relatedActionTitle}>{action.title}</Text>
											<View style={[styles.actionStatusMini, {
												backgroundColor: action.status === 'completed' ? '#10b981' : '#f59e0b'
											}]}>
												<Text style={styles.actionStatusMiniText}>{action.status}</Text>
											</View>
										</View>
									))}
							</View>
						</View>
					</ScrollView>
				)}
			</SafeAreaView>
		</Modal>
	);

	const renderEvidenceModal = () => (
		<Modal
			visible={showEvidenceModal}
			animationType="slide"
			presentationStyle="pageSheet"
		>
			<SafeAreaView style={styles.modalContainer}>
				<View style={styles.modalHeader}>
					<TouchableOpacity onPress={() => setShowEvidenceModal(false)}>
						<Ionicons name="close" size={24} color="#6b7280" />
					</TouchableOpacity>
					<Text style={styles.modalTitle}>Add Evidence</Text>
					<TouchableOpacity style={styles.saveButton}>
						<Text style={styles.saveButtonText}>Save</Text>
					</TouchableOpacity>
				</View>

				<ScrollView style={styles.modalContent}>
					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Title *</Text>
						<TextInput
							style={styles.input}
							value={newEvidence.title}
							onChangeText={(text) => setNewEvidence({...newEvidence, title: text})}
							placeholder="Enter evidence title"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Description *</Text>
						<TextInput
							style={[styles.input, styles.textArea]}
							value={newEvidence.description}
							onChangeText={(text) => setNewEvidence({...newEvidence, description: text})}
							placeholder="Enter evidence description"
							multiline
							numberOfLines={4}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Type *</Text>
						<TextInput
							style={styles.input}
							value={newEvidence.type}
							onChangeText={(text) => setNewEvidence({...newEvidence, type: text})}
							placeholder="e.g., Policy Document, Training Records"
						/>
					</View>
				</ScrollView>
			</SafeAreaView>
		</Modal>
	);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#6366f1" />

			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => props.navigation.goBack()}
					style={styles.backButton}
				>
					<Ionicons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>NABH Accreditation</Text>
				<TouchableOpacity style={styles.menuButton}>
					<Ionicons name="ellipsis-vertical" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<View style={styles.tabContainer}>
				<TouchableOpacity
					style={[styles.tab, currentTab === 'overview' && styles.activeTab]}
					onPress={() => setCurrentTab('overview')}
				>
					<Text style={[styles.tabText, currentTab === 'overview' && styles.activeTabText]}>
						Overview
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, currentTab === 'standards' && styles.activeTab]}
					onPress={() => setCurrentTab('standards')}
				>
					<Text style={[styles.tabText, currentTab === 'standards' && styles.activeTabText]}>
						Standards
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, currentTab === 'evidence' && styles.activeTab]}
					onPress={() => setCurrentTab('evidence')}
				>
					<Text style={[styles.tabText, currentTab === 'evidence' && styles.activeTabText]}>
						Evidence
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, currentTab === 'actions' && styles.activeTab]}
					onPress={() => setCurrentTab('actions')}
				>
					<Text style={[styles.tabText, currentTab === 'actions' && styles.activeTabText]}>
						Actions
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.content}>
				{currentTab === 'overview' && renderOverviewTab()}
				{currentTab === 'standards' && renderStandardsTab()}
				{currentTab === 'evidence' && renderEvidenceTab()}
				{currentTab === 'actions' && renderActionsTab()}
			</View>

			{renderStandardModal()}
			{renderEvidenceModal()}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},
	header: {
		backgroundColor: '#6366f1',
		paddingHorizontal: 20,
		paddingVertical: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	backButton: {
		padding: 5,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		flex: 1,
		textAlign: 'center',
		marginHorizontal: 20,
	},
	menuButton: {
		padding: 5,
	},
	tabContainer: {
		backgroundColor: 'white',
		flexDirection: 'row',
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	tab: {
		flex: 1,
		paddingVertical: 15,
		alignItems: 'center',
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor: '#6366f1',
	},
	tabText: {
		fontSize: 14,
		color: '#6b7280',
		fontWeight: '500',
	},
	activeTabText: {
		color: '#6366f1',
		fontWeight: 'bold',
	},
	content: {
		flex: 1,
		padding: 20,
	},
	accreditationCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	accreditationHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	accreditationInfo: {
		marginLeft: 15,
		flex: 1,
	},
	accreditationTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 4,
	},
	accreditationSubtitle: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 2,
	},
	daysRemaining: {
		fontSize: 12,
		color: '#10b981',
		fontWeight: '600',
	},
	complianceOverview: {
		alignItems: 'center',
	},
	complianceLabel: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 8,
	},
	complianceValue: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 12,
	},
	progressContainer: {
		width: '100%',
	},
	progressBar: {
		height: 8,
		backgroundColor: '#e5e7eb',
		borderRadius: 4,
		overflow: 'hidden',
	},
	progressFill: {
		height: '100%',
		borderRadius: 4,
	},
	statsGrid: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 25,
	},
	statCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		alignItems: 'center',
		flex: 1,
		marginHorizontal: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	statValue: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1f2937',
		marginTop: 8,
	},
	statLabel: {
		fontSize: 12,
		color: '#6b7280',
		marginTop: 4,
		textAlign: 'center',
	},
	section: {
		marginBottom: 25,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 15,
	},
	standardCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	standardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 15,
	},
	standardInfo: {
		flex: 1,
	},
	standardCode: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#6366f1',
		marginBottom: 4,
	},
	standardTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 4,
	},
	standardCategory: {
		fontSize: 14,
		color: '#6b7280',
	},
	standardStatus: {
		marginLeft: 10,
	},
	standardMetrics: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	complianceMetric: {
		alignItems: 'flex-start',
	},
	compliancePercentage: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1f2937',
	},
	complianceElements: {
		fontSize: 12,
		color: '#6b7280',
	},
	standardProgress: {
		alignItems: 'flex-end',
	},
	addButton: {
		backgroundColor: '#6366f1',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		borderRadius: 8,
		marginBottom: 20,
	},
	addButtonText: {
		color: 'white',
		fontWeight: 'bold',
		marginLeft: 8,
	},
	evidenceCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	evidenceHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	evidenceInfo: {
		flex: 1,
		marginLeft: 12,
	},
	evidenceTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 4,
	},
	evidenceType: {
		fontSize: 14,
		color: '#6b7280',
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 10,
		color: 'white',
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},
	evidenceDescription: {
		fontSize: 14,
		color: '#4b5563',
		lineHeight: 20,
		marginBottom: 12,
	},
	evidenceFooter: {
		borderTopWidth: 1,
		borderTopColor: '#e5e7eb',
		paddingTop: 12,
	},
	evidenceMeta: {
		fontSize: 12,
		color: '#6b7280',
	},
	actionCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	actionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	actionInfo: {
		flex: 1,
	},
	actionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 8,
	},
	actionMeta: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	priorityBadge: {
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 8,
		marginRight: 12,
	},
	priorityText: {
		fontSize: 10,
		color: 'white',
		fontWeight: 'bold',
	},
	actionDueDate: {
		fontSize: 12,
		color: '#6b7280',
	},
	actionStatusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		marginLeft: 10,
	},
	actionStatusText: {
		fontSize: 10,
		color: 'white',
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},
	actionDescription: {
		fontSize: 14,
		color: '#4b5563',
		lineHeight: 20,
		marginBottom: 8,
	},
	actionAssignee: {
		fontSize: 12,
		color: '#6b7280',
		fontWeight: '600',
	},
	modalContainer: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},
	modalHeader: {
		backgroundColor: 'white',
		paddingHorizontal: 20,
		paddingVertical: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#1f2937',
		flex: 1,
		textAlign: 'center',
		marginHorizontal: 20,
	},
	saveButton: {
		backgroundColor: '#6366f1',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
	},
	saveButtonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 14,
	},
	modalContent: {
		flex: 1,
		padding: 20,
	},
	standardDetailCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	standardDetailHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 25,
		paddingBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	standardDetailInfo: {
		marginLeft: 15,
		flex: 1,
	},
	standardDetailCode: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#6366f1',
		marginBottom: 4,
	},
	standardDetailTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 4,
	},
	standardDetailCategory: {
		fontSize: 14,
		color: '#6b7280',
	},
	complianceDetail: {
		marginBottom: 25,
	},
	complianceRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	complianceScore: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	auditSection: {
		marginBottom: 25,
	},
	auditSectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 15,
	},
	auditItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	auditLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#6b7280',
	},
	auditValue: {
		fontSize: 14,
		color: '#1f2937',
	},
	relatedSection: {
		marginBottom: 20,
	},
	relatedSectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 10,
	},
	relatedEvidence: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	relatedEvidenceTitle: {
		fontSize: 14,
		color: '#1f2937',
		marginLeft: 8,
	},
	relatedAction: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	relatedActionTitle: {
		fontSize: 14,
		color: '#1f2937',
		marginLeft: 8,
		flex: 1,
	},
	actionStatusMini: {
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 8,
	},
	actionStatusMiniText: {
		fontSize: 8,
		color: 'white',
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},
	inputGroup: {
		marginBottom: 20,
	},
	inputLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 8,
	},
	input: {
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 12,
		fontSize: 16,
		color: '#1f2937',
	},
	textArea: {
		height: 100,
		textAlignVertical: 'top',
	},
});

export default NABHAccreditation;