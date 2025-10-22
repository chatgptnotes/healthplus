import React, { useState, useEffect, useCallback } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
	SafeAreaView,
	Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const PatientSearch = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	// Search states
	const [searchQuery, setSearchQuery] = useState('');
	const [searchType, setSearchType] = useState('name'); // name, phone, id, insurance
	const [searchResults, setSearchResults] = useState([]);
	const [selectedFilter, setSelectedFilter] = useState('all'); // all, admitted, outpatient, emergency

	// Mock patient data - in real app this would come from Redux store
	const [patients, setPatients] = useState([
		{
			id: 'P001',
			firstName: 'Rajesh',
			lastName: 'Kumar',
			phoneNumber: '9876543210',
			age: 35,
			gender: 'Male',
			bloodGroup: 'B+',
			status: 'Outpatient',
			lastVisit: '2024-01-15',
			insuranceType: 'CGHS',
			roomNumber: null,
			department: 'Cardiology',
			assignedDoctor: 'Dr. Sharma',
			emergencyContact: '9876543211',
		},
		{
			id: 'P002',
			firstName: 'Priya',
			lastName: 'Patel',
			phoneNumber: '9876543212',
			age: 28,
			gender: 'Female',
			bloodGroup: 'A+',
			status: 'Admitted',
			lastVisit: '2024-01-20',
			insuranceType: 'ECHS',
			roomNumber: 'A-101',
			department: 'Obstetrics',
			assignedDoctor: 'Dr. Verma',
			emergencyContact: '9876543213',
		},
		{
			id: 'P003',
			firstName: 'Amit',
			lastName: 'Singh',
			phoneNumber: '9876543214',
			age: 45,
			gender: 'Male',
			bloodGroup: 'O-',
			status: 'Emergency',
			lastVisit: '2024-01-21',
			insuranceType: 'Cash',
			roomNumber: 'ER-5',
			department: 'Emergency',
			assignedDoctor: 'Dr. Gupta',
			emergencyContact: '9876543215',
		},
	]);

	useEffect(() => {
		performSearch();
	}, [searchQuery, searchType, selectedFilter]);

	const performSearch = useCallback(() => {
		let filtered = patients;

		// Apply status filter
		if (selectedFilter !== 'all') {
			filtered = filtered.filter(patient =>
				patient.status.toLowerCase() === selectedFilter.toLowerCase()
			);
		}

		// Apply search query
		if (searchQuery.trim()) {
			filtered = filtered.filter(patient => {
				switch (searchType) {
					case 'name':
						return `${patient.firstName} ${patient.lastName}`
							.toLowerCase()
							.includes(searchQuery.toLowerCase());
					case 'phone':
						return patient.phoneNumber.includes(searchQuery);
					case 'id':
						return patient.id.toLowerCase().includes(searchQuery.toLowerCase());
					case 'insurance':
						return patient.insuranceType
							.toLowerCase()
							.includes(searchQuery.toLowerCase());
					default:
						return true;
				}
			});
		}

		setSearchResults(filtered);
	}, [searchQuery, searchType, selectedFilter, patients]);

	const handlePatientSelect = (patient) => {
		Alert.alert(
			'Patient Selected',
			`Selected: ${patient.firstName} ${patient.lastName}`,
			[
				{ text: 'View Details', onPress: () => navigateToPatientDetails(patient) },
				{ text: 'Schedule Appointment', onPress: () => navigateToAppointment(patient) },
				{ text: 'Cancel', style: 'cancel' }
			]
		);
	};

	const navigateToPatientDetails = (patient) => {
		// Navigate to patient details screen
		// props.navigation.navigate('PatientDetails', { patient });
		console.log('Navigate to patient details:', patient.id);
	};

	const navigateToAppointment = (patient) => {
		// Navigate to appointment booking screen
		// props.navigation.navigate('BookAppointment', { patient });
		console.log('Navigate to appointment booking:', patient.id);
	};

	const navigateToRegistration = () => {
		props.navigation.navigate('PatientRegistration');
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		// In real app, fetch latest patient data from server
		await new Promise(resolve => setTimeout(resolve, 1000));
		setRefreshing(false);
	}, []);

	const renderFilterButton = (filter, label) => (
		<TouchableOpacity
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
				{label}
			</Text>
		</TouchableOpacity>
	);

	const renderSearchTypeButton = (type, label, icon) => (
		<TouchableOpacity
			style={[
				styles.searchTypeButton,
				searchType === type && styles.activeSearchTypeButton
			]}
			onPress={() => setSearchType(type)}
		>
			<MaterialIcons
				name={icon}
				size={20}
				color={searchType === type ? '#10b981' : '#6b7280'}
			/>
			<Text style={[
				styles.searchTypeButtonText,
				searchType === type && styles.activeSearchTypeButtonText
			]}>
				{label}
			</Text>
		</TouchableOpacity>
	);

	const renderPatientCard = ({ item }) => (
		<TouchableOpacity style={styles.patientCard} onPress={() => handlePatientSelect(item)}>
			<View style={styles.patientCardHeader}>
				<View style={styles.patientInfo}>
					<Text style={styles.patientName}>
						{item.firstName} {item.lastName}
					</Text>
					<Text style={styles.patientId}>ID: {item.id}</Text>
				</View>
				<View style={styles.patientStatus}>
					<View style={[
						styles.statusBadge,
						{
							backgroundColor:
								item.status === 'Emergency' ? '#dc2626' :
								item.status === 'Admitted' ? '#f59e0b' : '#10b981'
						}
					]}>
						<Text style={styles.statusText}>{item.status}</Text>
					</View>
					<Text style={styles.bloodGroup}>{item.bloodGroup}</Text>
				</View>
			</View>

			<View style={styles.patientDetails}>
				<View style={styles.detailRow}>
					<MaterialIcons name="phone" size={16} color="#6b7280" />
					<Text style={styles.detailText}>{item.phoneNumber}</Text>
				</View>

				<View style={styles.detailRow}>
					<MaterialIcons name="person" size={16} color="#6b7280" />
					<Text style={styles.detailText}>{item.age} years, {item.gender}</Text>
				</View>

				<View style={styles.detailRow}>
					<MaterialCommunityIcons name="hospital-building" size={16} color="#6b7280" />
					<Text style={styles.detailText}>{item.department}</Text>
				</View>

				{item.roomNumber && (
					<View style={styles.detailRow}>
						<MaterialIcons name="hotel" size={16} color="#6b7280" />
						<Text style={styles.detailText}>Room: {item.roomNumber}</Text>
					</View>
				)}

				<View style={styles.detailRow}>
					<MaterialCommunityIcons name="doctor" size={16} color="#6b7280" />
					<Text style={styles.detailText}>{item.assignedDoctor}</Text>
				</View>

				<View style={styles.detailRow}>
					<MaterialIcons name="local-hospital" size={16} color="#6b7280" />
					<Text style={styles.detailText}>Insurance: {item.insuranceType}</Text>
				</View>
			</View>

			<View style={styles.patientCardFooter}>
				<Text style={styles.lastVisit}>Last Visit: {item.lastVisit}</Text>
				<MaterialIcons name="chevron-right" size={24} color="#6b7280" />
			</View>
		</TouchableOpacity>
	);

	const renderEmptyState = () => (
		<View style={styles.emptyState}>
			<MaterialIcons name="search-off" size={64} color="#9ca3af" />
			<Text style={styles.emptyStateText}>No patients found</Text>
			<Text style={styles.emptyStateSubtext}>
				{searchQuery ? 'Try adjusting your search criteria' : 'Start typing to search for patients'}
			</Text>
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
				<Text style={styles.headerTitle}>Patient Search</Text>
				<TouchableOpacity
					style={styles.addButton}
					onPress={navigateToRegistration}
				>
					<MaterialIcons name="person-add" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<View style={styles.content}>
				{/* Search Input */}
				<View style={styles.searchContainer}>
					<View style={styles.searchInputContainer}>
						<MaterialIcons name="search" size={24} color="#6b7280" />
						<TextInput
							style={styles.searchInput}
							placeholder={`Search by ${searchType}...`}
							value={searchQuery}
							onChangeText={setSearchQuery}
							autoCapitalize="none"
						/>
						{searchQuery.length > 0 && (
							<TouchableOpacity onPress={() => setSearchQuery('')}>
								<MaterialIcons name="clear" size={24} color="#6b7280" />
							</TouchableOpacity>
						)}
					</View>
				</View>

				{/* Search Type Buttons */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.searchTypeContainer}
				>
					{renderSearchTypeButton('name', 'Name', 'person')}
					{renderSearchTypeButton('phone', 'Phone', 'phone')}
					{renderSearchTypeButton('id', 'ID', 'badge')}
					{renderSearchTypeButton('insurance', 'Insurance', 'local-hospital')}
				</ScrollView>

				{/* Filter Buttons */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.filterContainer}
				>
					{renderFilterButton('all', 'All Patients')}
					{renderFilterButton('outpatient', 'Outpatient')}
					{renderFilterButton('admitted', 'Admitted')}
					{renderFilterButton('emergency', 'Emergency')}
				</ScrollView>

				{/* Results Count */}
				<View style={styles.resultsHeader}>
					<Text style={styles.resultsCount}>
						{searchResults.length} patient{searchResults.length !== 1 ? 's' : ''} found
					</Text>
					{isLoading && <ActivityIndicator size="small" color="#10b981" />}
				</View>

				{/* Patient List */}
				<FlatList
					data={searchResults}
					renderItem={renderPatientCard}
					keyExtractor={item => item.id}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.listContent}
					ListEmptyComponent={renderEmptyState}
					refreshing={refreshing}
					onRefresh={onRefresh}
				/>
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
		backgroundColor: '#10b981',
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
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	searchContainer: {
		marginBottom: 15,
	},
	searchInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 12,
		paddingHorizontal: 15,
		paddingVertical: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		marginLeft: 10,
		color: '#374151',
	},
	searchTypeContainer: {
		marginBottom: 15,
	},
	searchTypeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginRight: 10,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	activeSearchTypeButton: {
		borderColor: '#10b981',
		backgroundColor: '#f0fdf4',
	},
	searchTypeButtonText: {
		fontSize: 14,
		color: '#6b7280',
		marginLeft: 5,
	},
	activeSearchTypeButtonText: {
		color: '#10b981',
		fontWeight: '500',
	},
	filterContainer: {
		marginBottom: 15,
	},
	filterButton: {
		backgroundColor: 'white',
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 10,
		marginRight: 10,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	activeFilterButton: {
		backgroundColor: '#10b981',
		borderColor: '#10b981',
	},
	filterButtonText: {
		fontSize: 14,
		color: '#6b7280',
		fontWeight: '500',
	},
	activeFilterButtonText: {
		color: 'white',
	},
	resultsHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	resultsCount: {
		fontSize: 16,
		fontWeight: '600',
		color: '#374151',
	},
	listContent: {
		paddingBottom: 20,
	},
	patientCard: {
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
	patientCardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	patientInfo: {
		flex: 1,
	},
	patientName: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	patientId: {
		fontSize: 14,
		color: '#6b7280',
	},
	patientStatus: {
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
	bloodGroup: {
		fontSize: 14,
		fontWeight: '600',
		color: '#dc2626',
	},
	patientDetails: {
		marginBottom: 12,
	},
	detailRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 6,
	},
	detailText: {
		fontSize: 14,
		color: '#6b7280',
		marginLeft: 8,
		flex: 1,
	},
	patientCardFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
	},
	lastVisit: {
		fontSize: 12,
		color: '#9ca3af',
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 60,
	},
	emptyStateText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#6b7280',
		marginTop: 15,
		marginBottom: 5,
	},
	emptyStateSubtext: {
		fontSize: 14,
		color: '#9ca3af',
		textAlign: 'center',
		paddingHorizontal: 40,
	},
});

export default PatientSearch;