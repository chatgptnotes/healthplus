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

const LabResults = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedFilter, setSelectedFilter] = useState('All');
	const [showResultModal, setShowResultModal] = useState(false);
	const [selectedResult, setSelectedResult] = useState(null);

	const [testResults, setTestResults] = useState([
		{
			id: 'LAB001',
			patientName: 'Sita Sharma',
			patientId: 'P12345',
			testName: 'Complete Blood Count (CBC)',
			testDate: '2024-01-15',
			reportDate: '2024-01-15',
			status: 'Completed',
			normalRange: true,
			critical: false,
			technicianName: 'Dr. Lab Tech',
			results: [
				{ parameter: 'Hemoglobin', value: '12.5', unit: 'g/dL', normalRange: '12.0-15.5', status: 'Normal' },
				{ parameter: 'WBC Count', value: '7200', unit: '/μL', normalRange: '4000-11000', status: 'Normal' },
				{ parameter: 'RBC Count', value: '4.8', unit: 'million/μL', normalRange: '4.2-5.4', status: 'Normal' },
				{ parameter: 'Platelet Count', value: '350000', unit: '/μL', normalRange: '150000-450000', status: 'Normal' }
			],
			notes: 'All parameters within normal limits. Continue current medication.'
		},
		{
			id: 'LAB002',
			patientName: 'Vikash Patel',
			patientId: 'P12346',
			testName: 'HbA1c',
			testDate: '2024-01-15',
			reportDate: '2024-01-15',
			status: 'Completed',
			normalRange: false,
			critical: false,
			technicianName: 'Dr. Lab Tech',
			results: [
				{ parameter: 'HbA1c', value: '7.2', unit: '%', normalRange: '<7.0', status: 'High' }
			],
			notes: 'HbA1c elevated. Recommend consultation with endocrinologist for diabetes management.'
		},
		{
			id: 'LAB003',
			patientName: 'Meera Singh',
			patientId: 'P12347',
			testName: 'Thyroid Function Test',
			testDate: '2024-01-14',
			reportDate: '2024-01-14',
			status: 'Completed',
			normalRange: true,
			critical: false,
			technicianName: 'Dr. Lab Tech',
			results: [
				{ parameter: 'TSH', value: '2.1', unit: 'mIU/L', normalRange: '0.4-4.0', status: 'Normal' },
				{ parameter: 'Free T4', value: '1.3', unit: 'ng/dL', normalRange: '0.8-1.8', status: 'Normal' },
				{ parameter: 'Free T3', value: '3.2', unit: 'pg/mL', normalRange: '2.3-4.2', status: 'Normal' }
			],
			notes: 'Thyroid function normal. No intervention required.'
		},
		{
			id: 'LAB004',
			patientName: 'Arjun Kumar',
			patientId: 'P12348',
			testName: 'Kidney Function Test',
			testDate: '2024-01-14',
			reportDate: '2024-01-14',
			status: 'Completed',
			normalRange: false,
			critical: true,
			technicianName: 'Dr. Lab Tech',
			results: [
				{ parameter: 'Creatinine', value: '2.8', unit: 'mg/dL', normalRange: '0.6-1.2', status: 'High' },
				{ parameter: 'BUN', value: '45', unit: 'mg/dL', normalRange: '7-20', status: 'High' },
				{ parameter: 'eGFR', value: '35', unit: 'mL/min/1.73m²', normalRange: '>60', status: 'Low' }
			],
			notes: 'CRITICAL: Kidney function significantly impaired. Immediate nephrology consultation required.'
		},
		{
			id: 'LAB005',
			patientName: 'Priya Reddy',
			patientId: 'P12349',
			testName: 'Lipid Profile',
			testDate: '2024-01-13',
			reportDate: '2024-01-13',
			status: 'Completed',
			normalRange: false,
			critical: false,
			technicianName: 'Dr. Lab Tech',
			results: [
				{ parameter: 'Total Cholesterol', value: '245', unit: 'mg/dL', normalRange: '<200', status: 'High' },
				{ parameter: 'LDL Cholesterol', value: '165', unit: 'mg/dL', normalRange: '<100', status: 'High' },
				{ parameter: 'HDL Cholesterol', value: '38', unit: 'mg/dL', normalRange: '>40', status: 'Low' },
				{ parameter: 'Triglycerides', value: '280', unit: 'mg/dL', normalRange: '<150', status: 'High' }
			],
			notes: 'Dyslipidemia present. Recommend lifestyle modifications and possible statin therapy.'
		}
	]);

	const filterOptions = ['All', 'Normal', 'Abnormal', 'Critical'];

	const getStatusColor = (status) => {
		switch (status) {
			case 'Normal': return '#10b981';
			case 'High': return '#f59e0b';
			case 'Low': return '#3b82f6';
			case 'Critical': return '#ef4444';
			default: return '#6b7280';
		}
	};

	const getResultTypeColor = (normalRange, critical) => {
		if (critical) return '#ef4444';
		if (!normalRange) return '#f59e0b';
		return '#10b981';
	};

	const filteredResults = testResults.filter(result => {
		const matchesSearch = result.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			result.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			result.id.toLowerCase().includes(searchQuery.toLowerCase());

		if (selectedFilter === 'All') return matchesSearch;
		if (selectedFilter === 'Normal') return matchesSearch && result.normalRange && !result.critical;
		if (selectedFilter === 'Abnormal') return matchesSearch && !result.normalRange && !result.critical;
		if (selectedFilter === 'Critical') return matchesSearch && result.critical;
		return matchesSearch;
	});

	const renderResultItem = ({ item }) => (
		<TouchableOpacity
			style={styles.resultItem}
			onPress={() => {
				setSelectedResult(item);
				setShowResultModal(true);
			}}
		>
			<View style={styles.resultHeader}>
				<View style={styles.resultInfo}>
					<Text style={styles.resultId}>{item.id}</Text>
					<Text style={styles.patientName}>{item.patientName}</Text>
					<Text style={styles.testName}>{item.testName}</Text>
					<Text style={styles.testDate}>Report Date: {item.reportDate}</Text>
				</View>
				<View style={styles.statusContainer}>
					<View style={[
						styles.resultStatusBadge,
						{ backgroundColor: getResultTypeColor(item.normalRange, item.critical) }
					]}>
						<Text style={styles.resultStatusText}>
							{item.critical ? 'Critical' : item.normalRange ? 'Normal' : 'Abnormal'}
						</Text>
					</View>
					{item.critical && (
						<View style={styles.criticalIndicator}>
							<FontAwesome5 name="exclamation-triangle" size={12} color="#ef4444" />
							<Text style={styles.criticalText}>URGENT</Text>
						</View>
					)}
				</View>
			</View>

			<View style={styles.resultSummary}>
				<Text style={styles.technicianName}>Technician: {item.technicianName}</Text>
				<Text style={styles.parameterCount}>
					{item.results.length} parameter{item.results.length > 1 ? 's' : ''} tested
				</Text>
			</View>

			<View style={styles.quickResults}>
				{item.results.slice(0, 2).map((result, index) => (
					<View key={index} style={styles.quickResultItem}>
						<Text style={styles.parameterName}>{result.parameter}:</Text>
						<Text style={[
							styles.parameterValue,
							{ color: getStatusColor(result.status) }
						]}>
							{result.value} {result.unit}
						</Text>
						<Text style={styles.parameterStatus}>({result.status})</Text>
					</View>
				))}
				{item.results.length > 2 && (
					<Text style={styles.moreResults}>
						+{item.results.length - 2} more parameter{item.results.length - 2 > 1 ? 's' : ''}
					</Text>
				)}
			</View>

			{item.notes && (
				<View style={styles.notesContainer}>
					<Text style={styles.notesText} numberOfLines={2}>
						Note: {item.notes}
					</Text>
				</View>
			)}

			<View style={styles.actionButtons}>
				<TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}>
					<FontAwesome5 name="print" size={12} color="white" />
					<Text style={styles.actionButtonText}>Print</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10b981' }]}>
					<FontAwesome5 name="share" size={12} color="white" />
					<Text style={styles.actionButtonText}>Share</Text>
				</TouchableOpacity>
				{item.critical && (
					<TouchableOpacity style={[styles.actionButton, { backgroundColor: '#ef4444' }]}>
						<FontAwesome5 name="phone" size={12} color="white" />
						<Text style={styles.actionButtonText}>Alert Doctor</Text>
					</TouchableOpacity>
				)}
			</View>
		</TouchableOpacity>
	);

	const renderFilterButtons = () => (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
			{filterOptions.map(filter => (
				<TouchableOpacity
					key={filter}
					style={[
						styles.filterButton,
						selectedFilter === filter && styles.activeFilterButton
					]}
					onPress={() => setSelectedFilter(filter)}
				>
					<Text style={[
						styles.filterButtonText,
						selectedFilter === filter && styles.activeFilterButtonText
					]}>
						{filter}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);

	const renderResultDetails = () => {
		if (!selectedResult) return null;

		return (
			<Modal
				visible={showResultModal}
				animationType="slide"
				presentationStyle="pageSheet"
			>
				<SafeAreaView style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<TouchableOpacity onPress={() => setShowResultModal(false)}>
							<MaterialIcons name="close" size={24} color="#374151" />
						</TouchableOpacity>
						<Text style={styles.modalTitle}>Lab Result Details</Text>
						<TouchableOpacity>
							<FontAwesome5 name="print" size={20} color="#8b5cf6" />
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.modalContent}>
						<View style={styles.patientInfoSection}>
							<Text style={styles.sectionTitle}>Patient Information</Text>
							<Text style={styles.patientDetail}>Name: {selectedResult.patientName}</Text>
							<Text style={styles.patientDetail}>Patient ID: {selectedResult.patientId}</Text>
							<Text style={styles.patientDetail}>Test ID: {selectedResult.id}</Text>
							<Text style={styles.patientDetail}>Test: {selectedResult.testName}</Text>
							<Text style={styles.patientDetail}>Test Date: {selectedResult.testDate}</Text>
							<Text style={styles.patientDetail}>Report Date: {selectedResult.reportDate}</Text>
							<Text style={styles.patientDetail}>Technician: {selectedResult.technicianName}</Text>
						</View>

						<View style={styles.resultsSection}>
							<Text style={styles.sectionTitle}>Test Results</Text>
							{selectedResult.results.map((result, index) => (
								<View key={index} style={styles.resultDetailItem}>
									<View style={styles.resultDetailHeader}>
										<Text style={styles.resultParameterName}>{result.parameter}</Text>
										<View style={[
											styles.parameterStatusBadge,
											{ backgroundColor: getStatusColor(result.status) }
										]}>
											<Text style={styles.parameterStatusBadgeText}>{result.status}</Text>
										</View>
									</View>
									<View style={styles.resultDetailInfo}>
										<View style={styles.resultDetailRow}>
											<Text style={styles.resultDetailLabel}>Value:</Text>
											<Text style={[
												styles.resultDetailValue,
												{ color: getStatusColor(result.status) }
											]}>
												{result.value} {result.unit}
											</Text>
										</View>
										<View style={styles.resultDetailRow}>
											<Text style={styles.resultDetailLabel}>Normal Range:</Text>
											<Text style={styles.resultDetailNormalRange}>{result.normalRange}</Text>
										</View>
									</View>
								</View>
							))}
						</View>

						{selectedResult.notes && (
							<View style={styles.notesSection}>
								<Text style={styles.sectionTitle}>Clinical Notes</Text>
								<Text style={styles.detailedNotes}>{selectedResult.notes}</Text>
							</View>
						)}

						<View style={styles.summarySection}>
							<Text style={styles.sectionTitle}>Result Summary</Text>
							<View style={styles.summaryRow}>
								<Text style={styles.summaryLabel}>Overall Status:</Text>
								<Text style={[
									styles.summaryValue,
									{ color: getResultTypeColor(selectedResult.normalRange, selectedResult.critical) }
								]}>
									{selectedResult.critical ? 'Critical' : selectedResult.normalRange ? 'Normal' : 'Abnormal'}
								</Text>
							</View>
							<View style={styles.summaryRow}>
								<Text style={styles.summaryLabel}>Parameters Tested:</Text>
								<Text style={styles.summaryValue}>{selectedResult.results.length}</Text>
							</View>
							<View style={styles.summaryRow}>
								<Text style={styles.summaryLabel}>Normal Parameters:</Text>
								<Text style={styles.summaryValue}>
									{selectedResult.results.filter(r => r.status === 'Normal').length}
								</Text>
							</View>
							<View style={styles.summaryRow}>
								<Text style={styles.summaryLabel}>Abnormal Parameters:</Text>
								<Text style={styles.summaryValue}>
									{selectedResult.results.filter(r => r.status !== 'Normal').length}
								</Text>
							</View>
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
				<Text style={styles.headerTitle}>Lab Results</Text>
				<TouchableOpacity style={styles.refreshButton}>
					<MaterialIcons name="refresh" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<View style={styles.searchContainer}>
				<View style={styles.searchBox}>
					<MaterialIcons name="search" size={20} color="#6b7280" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search results, patients, tests..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
			</View>

			{renderFilterButtons()}

			<View style={styles.statsRow}>
				<View style={[styles.statCard, { backgroundColor: '#10b981' }]}>
					<Text style={styles.statNumber}>
						{testResults.filter(r => r.normalRange && !r.critical).length}
					</Text>
					<Text style={styles.statLabel}>Normal</Text>
				</View>
				<View style={[styles.statCard, { backgroundColor: '#f59e0b' }]}>
					<Text style={styles.statNumber}>
						{testResults.filter(r => !r.normalRange && !r.critical).length}
					</Text>
					<Text style={styles.statLabel}>Abnormal</Text>
				</View>
				<View style={[styles.statCard, { backgroundColor: '#ef4444' }]}>
					<Text style={styles.statNumber}>
						{testResults.filter(r => r.critical).length}
					</Text>
					<Text style={styles.statLabel}>Critical</Text>
				</View>
			</View>

			<FlatList
				data={filteredResults}
				renderItem={renderResultItem}
				keyExtractor={item => item.id}
				style={styles.resultsList}
				showsVerticalScrollIndicator={false}
			/>

			{renderResultDetails()}
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
		backgroundColor: '#8b5cf6',
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
	refreshButton: {
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
	filterContainer: {
		paddingHorizontal: 20,
		paddingBottom: 15,
	},
	filterButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginRight: 10,
		backgroundColor: 'white',
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	activeFilterButton: {
		backgroundColor: '#8b5cf6',
		borderColor: '#8b5cf6',
	},
	filterButtonText: {
		fontSize: 14,
		color: '#374151',
		fontWeight: '500',
	},
	activeFilterButtonText: {
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
	},
	resultsList: {
		flex: 1,
		paddingHorizontal: 20,
	},
	resultItem: {
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
	resultHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	resultInfo: {
		flex: 1,
	},
	resultId: {
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
	testName: {
		fontSize: 14,
		color: '#8b5cf6',
		fontWeight: '500',
		marginBottom: 2,
	},
	testDate: {
		fontSize: 12,
		color: '#6b7280',
	},
	statusContainer: {
		alignItems: 'flex-end',
	},
	resultStatusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginBottom: 5,
	},
	resultStatusText: {
		color: 'white',
		fontSize: 11,
		fontWeight: '600',
	},
	criticalIndicator: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fef2f2',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 6,
	},
	criticalText: {
		fontSize: 10,
		color: '#ef4444',
		fontWeight: '600',
		marginLeft: 3,
	},
	resultSummary: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	technicianName: {
		fontSize: 12,
		color: '#6b7280',
	},
	parameterCount: {
		fontSize: 12,
		color: '#6b7280',
	},
	quickResults: {
		marginBottom: 10,
	},
	quickResultItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 3,
	},
	parameterName: {
		fontSize: 13,
		color: '#374151',
		fontWeight: '500',
		marginRight: 8,
	},
	parameterValue: {
		fontSize: 13,
		fontWeight: '600',
		marginRight: 5,
	},
	parameterStatus: {
		fontSize: 12,
		color: '#6b7280',
	},
	moreResults: {
		fontSize: 12,
		color: '#8b5cf6',
		fontStyle: 'italic',
		marginTop: 3,
	},
	notesContainer: {
		backgroundColor: '#f9fafb',
		padding: 10,
		borderRadius: 8,
		marginBottom: 10,
	},
	notesText: {
		fontSize: 12,
		color: '#374151',
		lineHeight: 16,
	},
	actionButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
		paddingTop: 10,
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		flex: 1,
		marginHorizontal: 2,
		justifyContent: 'center',
	},
	actionButtonText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '600',
		marginLeft: 5,
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
	patientInfoSection: {
		marginBottom: 25,
		padding: 15,
		backgroundColor: '#f9fafb',
		borderRadius: 12,
	},
	resultsSection: {
		marginBottom: 25,
	},
	notesSection: {
		marginBottom: 25,
		padding: 15,
		backgroundColor: '#f0fdf4',
		borderRadius: 12,
	},
	summarySection: {
		padding: 15,
		backgroundColor: '#ede9fe',
		borderRadius: 12,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 15,
	},
	patientDetail: {
		fontSize: 14,
		color: '#374151',
		marginBottom: 5,
	},
	resultDetailItem: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 8,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	resultDetailHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	resultParameterName: {
		fontSize: 15,
		fontWeight: '600',
		color: '#1f2937',
		flex: 1,
	},
	parameterStatusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	parameterStatusBadgeText: {
		fontSize: 10,
		color: 'white',
		fontWeight: '600',
	},
	resultDetailInfo: {
		gap: 5,
	},
	resultDetailRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	resultDetailLabel: {
		fontSize: 14,
		color: '#6b7280',
	},
	resultDetailValue: {
		fontSize: 14,
		fontWeight: '600',
	},
	resultDetailNormalRange: {
		fontSize: 14,
		color: '#374151',
	},
	detailedNotes: {
		fontSize: 14,
		color: '#374151',
		lineHeight: 20,
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	summaryLabel: {
		fontSize: 14,
		color: '#6b7280',
	},
	summaryValue: {
		fontSize: 14,
		color: '#1f2937',
		fontWeight: '500',
	},
});

export default LabResults;