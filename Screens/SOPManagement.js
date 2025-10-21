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
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SOPManagement = (props) => {
	const [currentTab, setCurrentTab] = useState('sops');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [showDocumentModal, setShowDocumentModal] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState(null);
	const [showAddModal, setShowAddModal] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	const [sopCategories] = useState([
		{ id: 'all', name: 'All Categories', icon: 'file-multiple', count: 45 },
		{ id: 'patient_care', name: 'Patient Care', icon: 'heart-pulse', count: 12 },
		{ id: 'safety', name: 'Safety Protocols', icon: 'shield-check', count: 8 },
		{ id: 'emergency', name: 'Emergency Procedures', icon: 'alarm-light', count: 6 },
		{ id: 'infection_control', name: 'Infection Control', icon: 'virus-off', count: 7 },
		{ id: 'administration', name: 'Administration', icon: 'clipboard-text', count: 5 },
		{ id: 'nursing', name: 'Nursing Procedures', icon: 'hospital-box', count: 7 }
	]);

	const [sopDocuments] = useState([
		{
			id: '1',
			title: 'Patient Admission Procedure',
			category: 'patient_care',
			type: 'SOP',
			description: 'Standard operating procedure for patient admission process',
			version: '2.1',
			lastUpdated: '2024-01-15',
			updatedBy: 'Dr. Rajesh Kumar',
			status: 'active',
			department: 'General',
			downloadCount: 45,
			tags: ['admission', 'patient care', 'registration'],
			fileSize: '2.3 MB',
			language: 'English/Hindi',
			approvedBy: 'Dr. Sanjay Mishra'
		},
		{
			id: '2',
			title: 'Hand Hygiene Protocol',
			category: 'infection_control',
			type: 'Protocol',
			description: 'Comprehensive hand hygiene guidelines for all staff',
			version: '3.0',
			lastUpdated: '2024-01-12',
			updatedBy: 'Nurse Priya Sharma',
			status: 'active',
			department: 'Nursing',
			downloadCount: 78,
			tags: ['hygiene', 'infection control', 'safety'],
			fileSize: '1.8 MB',
			language: 'English/Hindi',
			approvedBy: 'Dr. Amit Singh'
		},
		{
			id: '3',
			title: 'Emergency Code Blue Response',
			category: 'emergency',
			type: 'Emergency Protocol',
			description: 'Step-by-step guide for cardiac arrest emergency response',
			version: '1.5',
			lastUpdated: '2024-01-10',
			updatedBy: 'Dr. Suresh Patel',
			status: 'active',
			department: 'Emergency',
			downloadCount: 92,
			tags: ['emergency', 'cardiac arrest', 'code blue'],
			fileSize: '3.1 MB',
			language: 'English/Hindi',
			approvedBy: 'Dr. Rajesh Kumar'
		},
		{
			id: '4',
			title: 'Medication Administration Guidelines',
			category: 'patient_care',
			type: 'Guideline',
			description: 'Safe medication administration practices and verification procedures',
			version: '2.3',
			lastUpdated: '2024-01-08',
			updatedBy: 'Pharmacist Meera Joshi',
			status: 'active',
			department: 'Pharmacy',
			downloadCount: 67,
			tags: ['medication', 'safety', 'administration'],
			fileSize: '2.7 MB',
			language: 'English/Hindi',
			approvedBy: 'Dr. Priya Gupta'
		},
		{
			id: '5',
			title: 'PPE Usage and Disposal Protocol',
			category: 'safety',
			type: 'Safety Protocol',
			description: 'Personal protective equipment usage guidelines and disposal procedures',
			version: '2.0',
			lastUpdated: '2024-01-05',
			updatedBy: 'Safety Officer Ravi Kumar',
			status: 'active',
			department: 'Safety',
			downloadCount: 89,
			tags: ['PPE', 'safety', 'disposal'],
			fileSize: '2.1 MB',
			language: 'English/Hindi',
			approvedBy: 'Dr. Sanjay Mishra'
		}
	]);

	const [trainingVideos] = useState([
		{
			id: '1',
			title: 'Hand Hygiene Demonstration',
			category: 'infection_control',
			type: 'Training Video',
			description: 'Visual demonstration of proper hand hygiene techniques',
			duration: '8:45',
			language: 'Hindi/English',
			createdBy: 'Training Department',
			dateCreated: '2024-01-10',
			viewCount: 234,
			tags: ['hand hygiene', 'demonstration', 'training'],
			thumbnailUrl: 'video_thumbnail_1.jpg',
			mandatory: true,
			department: 'All'
		},
		{
			id: '2',
			title: 'Patient Transfer Safety',
			category: 'safety',
			type: 'Training Video',
			description: 'Safe patient transfer techniques and equipment usage',
			duration: '12:30',
			language: 'Hindi/English',
			createdBy: 'Nursing Department',
			dateCreated: '2024-01-08',
			viewCount: 189,
			tags: ['patient transfer', 'safety', 'nursing'],
			thumbnailUrl: 'video_thumbnail_2.jpg',
			mandatory: true,
			department: 'Nursing'
		},
		{
			id: '3',
			title: 'Emergency Response Training',
			category: 'emergency',
			type: 'Training Video',
			description: 'Comprehensive emergency response procedures and team coordination',
			duration: '25:15',
			language: 'Hindi/English',
			createdBy: 'Emergency Department',
			dateCreated: '2024-01-05',
			viewCount: 156,
			tags: ['emergency', 'response', 'team coordination'],
			thumbnailUrl: 'video_thumbnail_3.jpg',
			mandatory: true,
			department: 'All'
		},
		{
			id: '4',
			title: 'Medication Safety Guidelines',
			category: 'patient_care',
			type: 'Training Video',
			description: 'Medication administration safety and error prevention',
			duration: '15:20',
			language: 'Hindi/English',
			createdBy: 'Pharmacy Department',
			dateCreated: '2023-12-28',
			viewCount: 201,
			tags: ['medication', 'safety', 'pharmacy'],
			thumbnailUrl: 'video_thumbnail_4.jpg',
			mandatory: false,
			department: 'Pharmacy'
		}
	]);

	const [presentations] = useState([
		{
			id: '1',
			title: 'Quality Improvement Initiative 2024',
			category: 'administration',
			type: 'Presentation',
			description: 'Hospital-wide quality improvement goals and strategies for 2024',
			slides: 45,
			language: 'English',
			presentedBy: 'Dr. Rajesh Kumar',
			datePresented: '2024-01-15',
			audience: 'All Staff',
			tags: ['quality', 'improvement', '2024'],
			fileSize: '8.5 MB',
			downloadCount: 78
		},
		{
			id: '2',
			title: 'New NABH Standards Implementation',
			category: 'administration',
			type: 'Presentation',
			description: 'Overview of new NABH accreditation standards and implementation plan',
			slides: 32,
			language: 'English/Hindi',
			presentedBy: 'Dr. Sanjay Mishra',
			datePresented: '2024-01-12',
			audience: 'Department Heads',
			tags: ['NABH', 'standards', 'accreditation'],
			fileSize: '6.2 MB',
			downloadCount: 45
		},
		{
			id: '3',
			title: 'Patient Safety Week 2024',
			category: 'safety',
			type: 'Presentation',
			description: 'Patient safety initiatives and awareness campaign',
			slides: 28,
			language: 'Hindi/English',
			presentedBy: 'Safety Committee',
			datePresented: '2024-01-08',
			audience: 'All Staff',
			tags: ['patient safety', 'awareness', 'campaign'],
			fileSize: '5.8 MB',
			downloadCount: 92
		}
	]);

	const [staffRules] = useState([
		{
			id: '1',
			title: 'Code of Conduct',
			category: 'administration',
			type: 'Policy',
			description: 'Professional conduct guidelines for all hospital staff',
			sections: ['Professional Behavior', 'Patient Interaction', 'Confidentiality', 'Dress Code'],
			lastUpdated: '2024-01-01',
			updatedBy: 'HR Department',
			mandatory: true,
			acknowledgmentRequired: true,
			tags: ['conduct', 'behavior', 'ethics']
		},
		{
			id: '2',
			title: 'Attendance and Leave Policy',
			category: 'administration',
			type: 'Policy',
			description: 'Guidelines for attendance, punctuality, and leave applications',
			sections: ['Working Hours', 'Leave Types', 'Application Process', 'Penalties'],
			lastUpdated: '2023-12-15',
			updatedBy: 'HR Department',
			mandatory: true,
			acknowledgmentRequired: true,
			tags: ['attendance', 'leave', 'HR']
		},
		{
			id: '3',
			title: 'Information Security Policy',
			category: 'administration',
			type: 'Security Policy',
			description: 'Data protection and information security guidelines',
			sections: ['Data Access', 'Password Security', 'Device Usage', 'Confidentiality'],
			lastUpdated: '2024-01-05',
			updatedBy: 'IT Department',
			mandatory: true,
			acknowledgmentRequired: true,
			tags: ['security', 'data protection', 'IT']
		}
	]);

	const getFilteredDocuments = () => {
		let documents = [];

		if (currentTab === 'sops') {
			documents = sopDocuments;
		} else if (currentTab === 'videos') {
			documents = trainingVideos;
		} else if (currentTab === 'presentations') {
			documents = presentations;
		} else if (currentTab === 'rules') {
			documents = staffRules;
		}

		if (selectedCategory !== 'all') {
			documents = documents.filter(doc => doc.category === selectedCategory);
		}

		if (searchQuery) {
			documents = documents.filter(doc =>
				doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
			);
		}

		return documents;
	};

	const renderCategoryFilter = () => (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
			{sopCategories.map((category) => (
				<TouchableOpacity
					key={category.id}
					style={[
						styles.categoryButton,
						selectedCategory === category.id && styles.activeCategoryButton
					]}
					onPress={() => setSelectedCategory(category.id)}
				>
					<MaterialCommunityIcons
						name={category.icon}
						size={16}
						color={selectedCategory === category.id ? 'white' : '#6b7280'}
					/>
					<Text style={[
						styles.categoryButtonText,
						selectedCategory === category.id && styles.activeCategoryButtonText
					]}>
						{category.name}
					</Text>
					<View style={[
						styles.categoryCount,
						selectedCategory === category.id && styles.activeCategoryCount
					]}>
						<Text style={[
							styles.categoryCountText,
							selectedCategory === category.id && styles.activeCategoryCountText
						]}>
							{category.count}
						</Text>
					</View>
				</TouchableOpacity>
			))}
		</ScrollView>
	);

	const renderDocumentCard = (document) => (
		<TouchableOpacity
			key={document.id}
			style={styles.documentCard}
			onPress={() => {
				setSelectedDocument(document);
				setShowDocumentModal(true);
			}}
		>
			<View style={styles.documentHeader}>
				<View style={styles.documentInfo}>
					<Text style={styles.documentTitle}>{document.title}</Text>
					<Text style={styles.documentDescription}>{document.description}</Text>
					<View style={styles.documentMeta}>
						<View style={styles.documentType}>
							<MaterialCommunityIcons name="file-document" size={14} color="#6366f1" />
							<Text style={styles.documentTypeText}>{document.type}</Text>
						</View>
						{document.version && (
							<View style={styles.documentVersion}>
								<Text style={styles.documentVersionText}>v{document.version}</Text>
							</View>
						)}
						{document.mandatory && (
							<View style={styles.mandatoryBadge}>
								<Text style={styles.mandatoryText}>MANDATORY</Text>
							</View>
						)}
					</View>
				</View>
				<View style={styles.documentActions}>
					<MaterialCommunityIcons name="download" size={20} color="#6b7280" />
				</View>
			</View>
			<View style={styles.documentFooter}>
				<Text style={styles.documentDate}>
					Updated: {document.lastUpdated || document.dateCreated || document.datePresented}
				</Text>
				{document.downloadCount && (
					<Text style={styles.documentStats}>
						{document.downloadCount} downloads
					</Text>
				)}
				{document.viewCount && (
					<Text style={styles.documentStats}>
						{document.viewCount} views
					</Text>
				)}
				{document.duration && (
					<Text style={styles.documentStats}>
						{document.duration}
					</Text>
				)}
			</View>
		</TouchableOpacity>
	);

	const renderDocumentModal = () => (
		<Modal
			visible={showDocumentModal}
			animationType="slide"
			presentationStyle="pageSheet"
		>
			<SafeAreaView style={styles.modalContainer}>
				<View style={styles.modalHeader}>
					<TouchableOpacity onPress={() => setShowDocumentModal(false)}>
						<Ionicons name="close" size={24} color="#6b7280" />
					</TouchableOpacity>
					<Text style={styles.modalTitle}>Document Details</Text>
					<TouchableOpacity style={styles.downloadButton}>
						<MaterialCommunityIcons name="download" size={20} color="white" />
						<Text style={styles.downloadButtonText}>Download</Text>
					</TouchableOpacity>
				</View>

				{selectedDocument && (
					<ScrollView style={styles.modalContent}>
						<View style={styles.documentDetailCard}>
							<View style={styles.documentDetailHeader}>
								<MaterialCommunityIcons name="file-document" size={40} color="#6366f1" />
								<View style={styles.documentDetailInfo}>
									<Text style={styles.documentDetailTitle}>{selectedDocument.title}</Text>
									<Text style={styles.documentDetailType}>{selectedDocument.type}</Text>
									{selectedDocument.version && (
										<Text style={styles.documentDetailVersion}>Version {selectedDocument.version}</Text>
									)}
								</View>
							</View>

							<View style={styles.documentDetailSection}>
								<Text style={styles.detailSectionTitle}>Description</Text>
								<Text style={styles.detailText}>{selectedDocument.description}</Text>
							</View>

							<View style={styles.documentDetailSection}>
								<Text style={styles.detailSectionTitle}>Document Information</Text>
								<View style={styles.detailRow}>
									<Text style={styles.detailLabel}>Department:</Text>
									<Text style={styles.detailValue}>{selectedDocument.department}</Text>
								</View>
								{selectedDocument.fileSize && (
									<View style={styles.detailRow}>
										<Text style={styles.detailLabel}>File Size:</Text>
										<Text style={styles.detailValue}>{selectedDocument.fileSize}</Text>
									</View>
								)}
								{selectedDocument.language && (
									<View style={styles.detailRow}>
										<Text style={styles.detailLabel}>Language:</Text>
										<Text style={styles.detailValue}>{selectedDocument.language}</Text>
									</View>
								)}
								{selectedDocument.duration && (
									<View style={styles.detailRow}>
										<Text style={styles.detailLabel}>Duration:</Text>
										<Text style={styles.detailValue}>{selectedDocument.duration}</Text>
									</View>
								)}
								{selectedDocument.slides && (
									<View style={styles.detailRow}>
										<Text style={styles.detailLabel}>Slides:</Text>
										<Text style={styles.detailValue}>{selectedDocument.slides}</Text>
									</View>
								)}
							</View>

							{selectedDocument.sections && (
								<View style={styles.documentDetailSection}>
									<Text style={styles.detailSectionTitle}>Sections</Text>
									{selectedDocument.sections.map((section, index) => (
										<View key={index} style={styles.sectionItem}>
											<MaterialCommunityIcons name="check-circle" size={16} color="#10b981" />
											<Text style={styles.sectionText}>{section}</Text>
										</View>
									))}
								</View>
							)}

							{selectedDocument.tags && (
								<View style={styles.documentDetailSection}>
									<Text style={styles.detailSectionTitle}>Tags</Text>
									<View style={styles.tagsContainer}>
										{selectedDocument.tags.map((tag, index) => (
											<View key={index} style={styles.tag}>
												<Text style={styles.tagText}>{tag}</Text>
											</View>
										))}
									</View>
								</View>
							)}

							<View style={styles.documentDetailSection}>
								<Text style={styles.detailSectionTitle}>Author Information</Text>
								<View style={styles.detailRow}>
									<Text style={styles.detailLabel}>Updated By:</Text>
									<Text style={styles.detailValue}>
										{selectedDocument.updatedBy || selectedDocument.createdBy || selectedDocument.presentedBy}
									</Text>
								</View>
								{selectedDocument.approvedBy && (
									<View style={styles.detailRow}>
										<Text style={styles.detailLabel}>Approved By:</Text>
										<Text style={styles.detailValue}>{selectedDocument.approvedBy}</Text>
									</View>
								)}
								<View style={styles.detailRow}>
									<Text style={styles.detailLabel}>Last Updated:</Text>
									<Text style={styles.detailValue}>
										{selectedDocument.lastUpdated || selectedDocument.dateCreated || selectedDocument.datePresented}
									</Text>
								</View>
							</View>
						</View>
					</ScrollView>
				)}
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
				<Text style={styles.headerTitle}>SOPs & Training</Text>
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => setShowAddModal(true)}
				>
					<Ionicons name="add" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<View style={styles.searchContainer}>
				<View style={styles.searchInput}>
					<MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
					<TextInput
						style={styles.searchText}
						placeholder="Search SOPs, videos, presentations..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
			</View>

			<View style={styles.tabContainer}>
				<TouchableOpacity
					style={[styles.tab, currentTab === 'sops' && styles.activeTab]}
					onPress={() => setCurrentTab('sops')}
				>
					<MaterialCommunityIcons name="file-document" size={16} color={currentTab === 'sops' ? '#6366f1' : '#6b7280'} />
					<Text style={[styles.tabText, currentTab === 'sops' && styles.activeTabText]}>
						SOPs
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, currentTab === 'videos' && styles.activeTab]}
					onPress={() => setCurrentTab('videos')}
				>
					<MaterialCommunityIcons name="play-circle" size={16} color={currentTab === 'videos' ? '#6366f1' : '#6b7280'} />
					<Text style={[styles.tabText, currentTab === 'videos' && styles.activeTabText]}>
						Videos
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, currentTab === 'presentations' && styles.activeTab]}
					onPress={() => setCurrentTab('presentations')}
				>
					<MaterialCommunityIcons name="presentation" size={16} color={currentTab === 'presentations' ? '#6366f1' : '#6b7280'} />
					<Text style={[styles.tabText, currentTab === 'presentations' && styles.activeTabText]}>
						Presentations
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, currentTab === 'rules' && styles.activeTab]}
					onPress={() => setCurrentTab('rules')}
				>
					<MaterialCommunityIcons name="gavel" size={16} color={currentTab === 'rules' ? '#6366f1' : '#6b7280'} />
					<Text style={[styles.tabText, currentTab === 'rules' && styles.activeTabText]}>
						Rules
					</Text>
				</TouchableOpacity>
			</View>

			{renderCategoryFilter()}

			<ScrollView style={styles.content}>
				{getFilteredDocuments().map(renderDocumentCard)}
			</ScrollView>

			{renderDocumentModal()}
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
	addButton: {
		padding: 5,
	},
	searchContainer: {
		backgroundColor: 'white',
		paddingHorizontal: 20,
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	searchInput: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f3f4f6',
		borderRadius: 25,
		paddingHorizontal: 15,
		paddingVertical: 10,
	},
	searchText: {
		flex: 1,
		marginLeft: 10,
		fontSize: 16,
		color: '#1f2937',
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
		flexDirection: 'row',
		justifyContent: 'center',
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor: '#6366f1',
	},
	tabText: {
		fontSize: 14,
		color: '#6b7280',
		fontWeight: '500',
		marginLeft: 4,
	},
	activeTabText: {
		color: '#6366f1',
		fontWeight: 'bold',
	},
	categoryFilter: {
		backgroundColor: 'white',
		paddingVertical: 15,
		paddingLeft: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	categoryButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f3f4f6',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 20,
		marginRight: 10,
	},
	activeCategoryButton: {
		backgroundColor: '#6366f1',
	},
	categoryButtonText: {
		fontSize: 12,
		color: '#6b7280',
		fontWeight: '500',
		marginLeft: 4,
		marginRight: 6,
	},
	activeCategoryButtonText: {
		color: 'white',
	},
	categoryCount: {
		backgroundColor: '#e5e7eb',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 10,
	},
	activeCategoryCount: {
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	categoryCountText: {
		fontSize: 10,
		color: '#6b7280',
		fontWeight: 'bold',
	},
	activeCategoryCountText: {
		color: 'white',
	},
	content: {
		flex: 1,
		padding: 20,
	},
	documentCard: {
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
	documentHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	documentInfo: {
		flex: 1,
	},
	documentTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 4,
	},
	documentDescription: {
		fontSize: 14,
		color: '#6b7280',
		lineHeight: 20,
		marginBottom: 8,
	},
	documentMeta: {
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
	},
	documentType: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f3f4f6',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		marginRight: 8,
	},
	documentTypeText: {
		fontSize: 11,
		color: '#6366f1',
		fontWeight: '600',
		marginLeft: 4,
	},
	documentVersion: {
		backgroundColor: '#10b981',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 8,
		marginRight: 8,
	},
	documentVersionText: {
		fontSize: 10,
		color: 'white',
		fontWeight: 'bold',
	},
	mandatoryBadge: {
		backgroundColor: '#ef4444',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 8,
	},
	mandatoryText: {
		fontSize: 9,
		color: 'white',
		fontWeight: 'bold',
	},
	documentActions: {
		marginLeft: 10,
	},
	documentFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#e5e7eb',
	},
	documentDate: {
		fontSize: 12,
		color: '#6b7280',
	},
	documentStats: {
		fontSize: 12,
		color: '#6b7280',
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
	downloadButton: {
		backgroundColor: '#6366f1',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 20,
	},
	downloadButtonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 12,
		marginLeft: 4,
	},
	modalContent: {
		flex: 1,
		padding: 20,
	},
	documentDetailCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	documentDetailHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 25,
		paddingBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	documentDetailInfo: {
		marginLeft: 15,
		flex: 1,
	},
	documentDetailTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 4,
	},
	documentDetailType: {
		fontSize: 16,
		color: '#6366f1',
		fontWeight: '600',
		marginBottom: 2,
	},
	documentDetailVersion: {
		fontSize: 14,
		color: '#6b7280',
	},
	documentDetailSection: {
		marginBottom: 20,
	},
	detailSectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 10,
	},
	detailText: {
		fontSize: 15,
		color: '#4b5563',
		lineHeight: 22,
	},
	detailRow: {
		flexDirection: 'row',
		marginBottom: 8,
	},
	detailLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#6b7280',
		width: 100,
	},
	detailValue: {
		fontSize: 14,
		color: '#1f2937',
		flex: 1,
	},
	sectionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 6,
	},
	sectionText: {
		fontSize: 14,
		color: '#1f2937',
		marginLeft: 8,
	},
	tagsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	tag: {
		backgroundColor: '#e5e7eb',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		marginRight: 8,
		marginBottom: 4,
	},
	tagText: {
		fontSize: 12,
		color: '#4b5563',
		fontWeight: '500',
	},
});

export default SOPManagement;