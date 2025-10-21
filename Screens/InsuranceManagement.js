import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	SafeAreaView,
	Picker,
	FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const InsuranceManagement = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState('claims');

	// Mock insurance claims data
	const [claims, setClaims] = useState([
		{
			id: 'CLM001',
			patientName: 'John Doe',
			policyNumber: 'CGHS123456789',
			insuranceType: 'CGHS',
			claimAmount: 15000,
			approvedAmount: 14250,
			status: 'Approved',
			submissionDate: '2024-01-15',
			approvalDate: '2024-01-18',
			approvalNumber: 'APP001',
			rejectionReason: null,
			documents: ['prescription.pdf', 'medical_reports.pdf'],
		},
		{
			id: 'CLM002',
			patientName: 'Sarah Johnson',
			policyNumber: 'ECHS987654321',
			insuranceType: 'ECHS',
			claimAmount: 25000,
			approvedAmount: 0,
			status: 'Rejected',
			submissionDate: '2024-01-20',
			approvalDate: null,
			approvalNumber: null,
			rejectionReason: 'Pre-existing condition not covered',
			documents: ['discharge_summary.pdf'],
		},
		{
			id: 'CLM003',
			patientName: 'Michael Brown',
			policyNumber: 'RLY456789123',
			insuranceType: 'Railways',
			claimAmount: 8500,
			approvedAmount: 0,
			status: 'Pending',
			submissionDate: '2024-01-22',
			approvalDate: null,
			approvalNumber: null,
			rejectionReason: null,
			documents: ['bills.pdf', 'lab_reports.pdf'],
		},
	]);

	// Mock cashless requests
	const [cashlessRequests, setCashlessRequests] = useState([
		{
			id: 'CSH001',
			patientName: 'Alice Wilson',
			policyNumber: 'TPA789123456',
			insuranceType: 'TPA Health',
			estimatedAmount: 50000,
			preAuthAmount: 45000,
			status: 'Pre-Auth Approved',
			admissionDate: '2024-01-25',
			dischargeDate: null,
			approvalNumber: 'PA001',
			department: 'Cardiology',
			procedure: 'Angioplasty',
		},
		{
			id: 'CSH002',
			patientName: 'David Lee',
			policyNumber: 'STR654321987',
			insuranceType: 'Star Health',
			estimatedAmount: 30000,
			preAuthAmount: 0,
			status: 'Pre-Auth Rejected',
			admissionDate: '2024-01-26',
			dischargeDate: null,
			approvalNumber: null,
			department: 'Orthopedics',
			procedure: 'Knee Replacement',
		},
	]);

	// Mock insurance providers
	const [providers, setProviders] = useState([
		{
			id: 'PROV001',
			name: 'CGHS',
			type: 'Government',
			contactPerson: 'Dr. Rajesh Kumar',
			contactPhone: '011-26862530',
			contactEmail: 'cghs@nic.in',
			cashlessEnabled: true,
			maxCashlessLimit: 100000,
			claimProcessingTime: '7-10 days',
			documents: ['Prescription', 'Medical Reports', 'Bills'],
			status: 'Active',
		},
		{
			id: 'PROV002',
			name: 'ECHS',
			type: 'Defense',
			contactPerson: 'Col. Sharma',
			contactPhone: '011-26715274',
			contactEmail: 'echs@mod.nic.in',
			cashlessEnabled: true,
			maxCashlessLimit: 75000,
			claimProcessingTime: '5-7 days',
			documents: ['Prescription', 'Discharge Summary', 'Identity Card'],
			status: 'Active',
		},
		{
			id: 'PROV003',
			name: 'TPA Health',
			type: 'Private',
			contactPerson: 'Mr. Amit Singh',
			contactPhone: '1800-123-4567',
			contactEmail: 'claims@tpahealth.com',
			cashlessEnabled: true,
			maxCashlessLimit: 200000,
			claimProcessingTime: '3-5 days',
			documents: ['All Medical Documents', 'Pre-Auth Form'],
			status: 'Active',
		},
	]);

	const submitClaim = () => {
		Alert.alert(
			'Submit New Claim',
			'Navigate to claim submission form',
			[{ text: 'OK' }]
		);
	};

	const requestCashless = () => {
		Alert.alert(
			'Request Cashless Service',
			'Navigate to cashless request form',
			[{ text: 'OK' }]
		);
	};

	const viewClaimDetails = (claim) => {
		Alert.alert(
			'Claim Details',
			`Claim ID: ${claim.id}\nPatient: ${claim.patientName}\nAmount: ₹${claim.claimAmount}\nStatus: ${claim.status}`,
			[
				{ text: 'Track Status', onPress: () => trackClaim(claim.id) },
				{ text: 'View Documents', onPress: () => viewDocuments(claim.id) },
				{ text: 'Close' }
			]
		);
	};

	const trackClaim = (claimId) => {
		Alert.alert('Claim Tracking', `Tracking claim ${claimId}\n\n1. Submitted\n2. Under Review\n3. Approved\n4. Payment Processed`);
	};

	const viewDocuments = (claimId) => {
		Alert.alert('Documents', 'View uploaded documents for this claim');
	};

	const renderTabButton = (tab, label, icon) => (
		<TouchableOpacity
			style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
			onPress={() => setActiveTab(tab)}
		>
			<MaterialIcons
				name={icon}
				size={20}
				color={activeTab === tab ? '#06b6d4' : '#6b7280'}
			/>
			<Text style={[
				styles.tabButtonText,
				activeTab === tab && styles.activeTabButtonText
			]}>
				{label}
			</Text>
		</TouchableOpacity>
	);

	const renderClaimItem = ({ item }) => (
		<TouchableOpacity style={styles.claimCard} onPress={() => viewClaimDetails(item)}>
			<View style={styles.claimHeader}>
				<View style={styles.claimInfo}>
					<Text style={styles.claimId}>{item.id}</Text>
					<Text style={styles.patientName}>{item.patientName}</Text>
				</View>
				<View style={[
					styles.statusBadge,
					{
						backgroundColor:
							item.status === 'Approved' ? '#10b981' :
							item.status === 'Rejected' ? '#dc2626' : '#f59e0b'
					}
				]}>
					<Text style={styles.statusText}>{item.status}</Text>
				</View>
			</View>

			<View style={styles.claimDetails}>
				<View style={styles.claimRow}>
					<Text style={styles.claimLabel}>Insurance:</Text>
					<Text style={styles.claimValue}>{item.insuranceType}</Text>
				</View>
				<View style={styles.claimRow}>
					<Text style={styles.claimLabel}>Policy:</Text>
					<Text style={styles.claimValue}>{item.policyNumber}</Text>
				</View>
				<View style={styles.claimRow}>
					<Text style={styles.claimLabel}>Claim Amount:</Text>
					<Text style={styles.claimValue}>₹{item.claimAmount.toLocaleString()}</Text>
				</View>
				{item.approvedAmount > 0 && (
					<View style={styles.claimRow}>
						<Text style={styles.claimLabel}>Approved:</Text>
						<Text style={[styles.claimValue, { color: '#10b981' }]}>
							₹{item.approvedAmount.toLocaleString()}
						</Text>
					</View>
				)}
				<View style={styles.claimRow}>
					<Text style={styles.claimLabel}>Submitted:</Text>
					<Text style={styles.claimValue}>{item.submissionDate}</Text>
				</View>
				{item.rejectionReason && (
					<View style={styles.rejectionContainer}>
						<Text style={styles.rejectionReason}>{item.rejectionReason}</Text>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);

	const renderCashlessItem = ({ item }) => (
		<TouchableOpacity style={styles.cashlessCard}>
			<View style={styles.cashlessHeader}>
				<View style={styles.cashlessInfo}>
					<Text style={styles.cashlessId}>{item.id}</Text>
					<Text style={styles.patientName}>{item.patientName}</Text>
				</View>
				<View style={[
					styles.statusBadge,
					{
						backgroundColor:
							item.status === 'Pre-Auth Approved' ? '#10b981' :
							item.status === 'Pre-Auth Rejected' ? '#dc2626' : '#f59e0b'
					}
				]}>
					<Text style={styles.statusText}>{item.status}</Text>
				</View>
			</View>

			<View style={styles.cashlessDetails}>
				<View style={styles.claimRow}>
					<Text style={styles.claimLabel}>Department:</Text>
					<Text style={styles.claimValue}>{item.department}</Text>
				</View>
				<View style={styles.claimRow}>
					<Text style={styles.claimLabel}>Procedure:</Text>
					<Text style={styles.claimValue}>{item.procedure}</Text>
				</View>
				<View style={styles.claimRow}>
					<Text style={styles.claimLabel}>Estimated Amount:</Text>
					<Text style={styles.claimValue}>₹{item.estimatedAmount.toLocaleString()}</Text>
				</View>
				{item.preAuthAmount > 0 && (
					<View style={styles.claimRow}>
						<Text style={styles.claimLabel}>Pre-Auth Amount:</Text>
						<Text style={[styles.claimValue, { color: '#10b981' }]}>
							₹{item.preAuthAmount.toLocaleString()}
						</Text>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);

	const renderProviderItem = ({ item }) => (
		<View style={styles.providerCard}>
			<View style={styles.providerHeader}>
				<View style={styles.providerInfo}>
					<Text style={styles.providerName}>{item.name}</Text>
					<Text style={styles.providerType}>{item.type}</Text>
				</View>
				<View style={[
					styles.statusBadge,
					{ backgroundColor: item.status === 'Active' ? '#10b981' : '#6b7280' }
				]}>
					<Text style={styles.statusText}>{item.status}</Text>
				</View>
			</View>

			<View style={styles.providerDetails}>
				<View style={styles.claimRow}>
					<Text style={styles.claimLabel}>Contact Person:</Text>
					<Text style={styles.claimValue}>{item.contactPerson}</Text>
				</View>
				<View style={styles.claimRow}>
					<Text style={styles.claimLabel}>Phone:</Text>
					<Text style={styles.claimValue}>{item.contactPhone}</Text>
				</View>
				<View style={styles.claimRow}>
					<Text style={styles.claimLabel}>Email:</Text>
					<Text style={styles.claimValue}>{item.contactEmail}</Text>
				</View>
				<View style={styles.claimRow}>
					<Text style={styles.claimLabel}>Cashless Limit:</Text>
					<Text style={styles.claimValue}>₹{item.maxCashlessLimit.toLocaleString()}</Text>
				</View>
				<View style={styles.claimRow}>
					<Text style={styles.claimLabel}>Processing Time:</Text>
					<Text style={styles.claimValue}>{item.claimProcessingTime}</Text>
				</View>
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => props.navigation.goBack()}
				>
					<MaterialIcons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Insurance Management</Text>
				<TouchableOpacity style={styles.addButton} onPress={submitClaim}>
					<MaterialIcons name="add" size={24} color="white" />
				</TouchableOpacity>
			</View>

			{/* Tab Navigation */}
			<View style={styles.tabContainer}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{renderTabButton('claims', 'Claims', 'assignment')}
					{renderTabButton('cashless', 'Cashless', 'credit-card')}
					{renderTabButton('providers', 'Providers', 'business')}
				</ScrollView>
			</View>

			{/* Quick Actions */}
			<View style={styles.quickActions}>
				<TouchableOpacity style={styles.quickActionButton} onPress={submitClaim}>
					<MaterialIcons name="assignment-add" size={24} color="#06b6d4" />
					<Text style={styles.quickActionText}>Submit Claim</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.quickActionButton} onPress={requestCashless}>
					<MaterialIcons name="card-membership" size={24} color="#06b6d4" />
					<Text style={styles.quickActionText}>Request Cashless</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.quickActionButton}>
					<MaterialIcons name="track-changes" size={24} color="#06b6d4" />
					<Text style={styles.quickActionText}>Track Status</Text>
				</TouchableOpacity>
			</View>

			{/* Tab Content */}
			<View style={styles.content}>
				{activeTab === 'claims' && (
					<>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Insurance Claims ({claims.length})</Text>
							<TouchableOpacity style={styles.filterButton}>
								<MaterialIcons name="filter-list" size={20} color="#06b6d4" />
							</TouchableOpacity>
						</View>
						<FlatList
							data={claims}
							renderItem={renderClaimItem}
							keyExtractor={item => item.id}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.listContent}
						/>
					</>
				)}

				{activeTab === 'cashless' && (
					<>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Cashless Requests ({cashlessRequests.length})</Text>
							<TouchableOpacity style={styles.filterButton}>
								<MaterialIcons name="filter-list" size={20} color="#06b6d4" />
							</TouchableOpacity>
						</View>
						<FlatList
							data={cashlessRequests}
							renderItem={renderCashlessItem}
							keyExtractor={item => item.id}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.listContent}
						/>
					</>
				)}

				{activeTab === 'providers' && (
					<>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Insurance Providers ({providers.length})</Text>
							<TouchableOpacity style={styles.filterButton}>
								<MaterialIcons name="filter-list" size={20} color="#06b6d4" />
							</TouchableOpacity>
						</View>
						<FlatList
							data={providers}
							renderItem={renderProviderItem}
							keyExtractor={item => item.id}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.listContent}
						/>
					</>
				)}
			</View>
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
		backgroundColor: '#06b6d4',
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
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
	addButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	tabContainer: {
		backgroundColor: 'white',
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#f3f4f6',
	},
	tabButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 10,
		marginRight: 15,
		borderRadius: 8,
		backgroundColor: '#f9fafb',
	},
	activeTabButton: {
		backgroundColor: '#eff6ff',
	},
	tabButtonText: {
		fontSize: 14,
		color: '#6b7280',
		marginLeft: 8,
		fontWeight: '500',
	},
	activeTabButtonText: {
		color: '#06b6d4',
	},
	quickActions: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: 'white',
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#f3f4f6',
	},
	quickActionButton: {
		alignItems: 'center',
	},
	quickActionText: {
		fontSize: 12,
		color: '#374151',
		marginTop: 5,
		fontWeight: '500',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 15,
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
	},
	filterButton: {
		padding: 8,
	},
	listContent: {
		paddingBottom: 20,
	},
	claimCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	claimHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	claimInfo: {
		flex: 1,
	},
	claimId: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	patientName: {
		fontSize: 14,
		color: '#6b7280',
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
	claimDetails: {
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
		paddingTop: 12,
	},
	claimRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 6,
	},
	claimLabel: {
		fontSize: 14,
		color: '#6b7280',
	},
	claimValue: {
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
	},
	rejectionContainer: {
		backgroundColor: '#fef2f2',
		padding: 8,
		borderRadius: 6,
		marginTop: 8,
	},
	rejectionReason: {
		fontSize: 12,
		color: '#dc2626',
		fontStyle: 'italic',
	},
	cashlessCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	cashlessHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	cashlessInfo: {
		flex: 1,
	},
	cashlessId: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	cashlessDetails: {
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
		paddingTop: 12,
	},
	providerCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	providerHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	providerInfo: {
		flex: 1,
	},
	providerName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	providerType: {
		fontSize: 14,
		color: '#6b7280',
	},
	providerDetails: {
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
		paddingTop: 12,
	},
});

export default InsuranceManagement;