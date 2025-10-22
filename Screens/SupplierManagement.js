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

const SupplierManagement = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [showAddModal, setShowAddModal] = useState(false);
	const [selectedSupplier, setSelectedSupplier] = useState(null);
	const [showDetailsModal, setShowDetailsModal] = useState(false);

	const [suppliers, setSuppliers] = useState([
		{
			id: 'SUP001',
			name: 'MedSupply Inc',
			contactPerson: 'Rajesh Kumar',
			phone: '+91 98765 43210',
			email: 'rajesh@medsupply.com',
			address: '123 Medical Street, Mumbai, Maharashtra 400001',
			gstNumber: '27AAACM2548J1Z1',
			category: 'Pharmaceuticals',
			status: 'Active',
			rating: 4.5,
			totalOrders: 45,
			lastOrderDate: '2024-01-10',
			products: ['Paracetamol', 'Aspirin', 'Antibiotics', 'Vitamins'],
			paymentTerms: '30 days',
			creditLimit: 500000,
			outstandingAmount: 125000
		},
		{
			id: 'SUP002',
			name: 'PharmaCorp',
			contactPerson: 'Priya Sharma',
			phone: '+91 87654 32109',
			email: 'priya@pharmacorp.com',
			address: '456 Health Avenue, Delhi, Delhi 110001',
			gstNumber: '07BBBCM3658K2Y2',
			category: 'Specialized Medicines',
			status: 'Active',
			rating: 4.8,
			totalOrders: 62,
			lastOrderDate: '2024-01-12',
			products: ['Insulin', 'Cardiac Medicines', 'Oncology Drugs'],
			paymentTerms: '45 days',
			creditLimit: 750000,
			outstandingAmount: 89000
		},
		{
			id: 'SUP003',
			name: 'BioMed Solutions',
			contactPerson: 'Amit Singh',
			phone: '+91 76543 21098',
			email: 'amit@biomed.com',
			address: '789 Science Park, Bangalore, Karnataka 560001',
			gstNumber: '29CCCCP4769L3Z3',
			category: 'Biotechnology',
			status: 'Active',
			rating: 4.2,
			totalOrders: 28,
			lastOrderDate: '2024-01-08',
			products: ['Vaccines', 'Blood Products', 'Diagnostic Kits'],
			paymentTerms: '60 days',
			creditLimit: 300000,
			outstandingAmount: 45000
		},
		{
			id: 'SUP004',
			name: 'Generic Plus',
			contactPerson: 'Sunita Devi',
			phone: '+91 65432 10987',
			email: 'emily@genericplus.com',
			address: '321 Generic Road, Hyderabad, Telangana 500001',
			gstNumber: '36DDDDR5870M4A4',
			category: 'Generic Medicines',
			status: 'Inactive',
			rating: 3.9,
			totalOrders: 15,
			lastOrderDate: '2023-12-20',
			products: ['Generic Antibiotics', 'Pain Relievers', 'Antacids'],
			paymentTerms: '30 days',
			creditLimit: 200000,
			outstandingAmount: 0
		}
	]);

	const [newSupplier, setNewSupplier] = useState({
		name: '',
		contactPerson: '',
		phone: '',
		email: '',
		address: '',
		gstNumber: '',
		category: '',
		paymentTerms: '',
		creditLimit: ''
	});

	const categories = ['Pharmaceuticals', 'Specialized Medicines', 'Biotechnology', 'Generic Medicines', 'Medical Devices', 'Surgical Supplies'];

	const getStatusColor = (status) => {
		switch (status) {
			case 'Active': return '#10b981';
			case 'Inactive': return '#6b7280';
			case 'Suspended': return '#ef4444';
			default: return '#6b7280';
		}
	};

	const getRatingColor = (rating) => {
		if (rating >= 4.5) return '#10b981';
		if (rating >= 4.0) return '#84cc16';
		if (rating >= 3.5) return '#f59e0b';
		return '#ef4444';
	};

	const filteredSuppliers = suppliers.filter(supplier =>
		supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
		supplier.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
		supplier.id.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleAddSupplier = () => {
		if (!newSupplier.name || !newSupplier.contactPerson || !newSupplier.phone) {
			Alert.alert('Error', 'Please fill in all required fields');
			return;
		}

		const id = `SUP${(suppliers.length + 1).toString().padStart(3, '0')}`;
		const supplier = {
			...newSupplier,
			id,
			status: 'Active',
			rating: 0,
			totalOrders: 0,
			lastOrderDate: null,
			products: [],
			outstandingAmount: 0,
			creditLimit: parseInt(newSupplier.creditLimit) || 100000
		};

		setSuppliers([...suppliers, supplier]);
		setNewSupplier({
			name: '',
			contactPerson: '',
			phone: '',
			email: '',
			address: '',
			gstNumber: '',
			category: '',
			paymentTerms: '',
			creditLimit: ''
		});
		setShowAddModal(false);
		Alert.alert('Success', 'Supplier added successfully');
	};

	const handleStatusToggle = (supplierId) => {
		setSuppliers(prev => prev.map(supplier => {
			if (supplier.id === supplierId) {
				const newStatus = supplier.status === 'Active' ? 'Inactive' : 'Active';
				return { ...supplier, status: newStatus };
			}
			return supplier;
		}));
	};

	const handleCreateOrder = (supplierId) => {
		Alert.alert(
			'Create Purchase Order',
			'This will redirect to the purchase order creation screen.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Create Order', onPress: () => console.log('Creating order for', supplierId) }
			]
		);
	};

	const renderSupplierItem = ({ item }) => (
		<TouchableOpacity
			style={styles.supplierItem}
			onPress={() => {
				setSelectedSupplier(item);
				setShowDetailsModal(true);
			}}
		>
			<View style={styles.supplierHeader}>
				<View style={styles.supplierInfo}>
					<Text style={styles.supplierName}>{item.name}</Text>
					<Text style={styles.supplierCode}>{item.id}</Text>
					<Text style={styles.contactPerson}>{item.contactPerson}</Text>
					<Text style={styles.category}>{item.category}</Text>
				</View>
				<View style={styles.statusContainer}>
					<View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
						<Text style={styles.statusText}>{item.status}</Text>
					</View>
					<View style={styles.ratingContainer}>
						<FontAwesome5 name="star" size={12} color={getRatingColor(item.rating)} solid />
						<Text style={[styles.ratingText, { color: getRatingColor(item.rating) }]}>
							{item.rating.toFixed(1)}
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.supplierDetails}>
				<View style={styles.detailRow}>
					<FontAwesome5 name="phone" size={12} color="#6b7280" />
					<Text style={styles.detailText}>{item.phone}</Text>
				</View>
				<View style={styles.detailRow}>
					<FontAwesome5 name="envelope" size={12} color="#6b7280" />
					<Text style={styles.detailText}>{item.email}</Text>
				</View>
				<View style={styles.detailRow}>
					<FontAwesome5 name="shopping-cart" size={12} color="#6b7280" />
					<Text style={styles.detailText}>Total Orders: {item.totalOrders}</Text>
				</View>
				<View style={styles.detailRow}>
					<FontAwesome5 name="rupee-sign" size={12} color="#6b7280" />
					<Text style={styles.detailText}>Outstanding: ₹{item.outstandingAmount.toLocaleString()}</Text>
				</View>
			</View>

			<View style={styles.actionButtons}>
				<TouchableOpacity
					style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
					onPress={() => handleCreateOrder(item.id)}
				>
					<FontAwesome5 name="plus" size={12} color="white" />
					<Text style={styles.actionButtonText}>Order</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.actionButton, { backgroundColor: item.status === 'Active' ? '#ef4444' : '#10b981' }]}
					onPress={() => handleStatusToggle(item.id)}
				>
					<FontAwesome5 name={item.status === 'Active' ? 'pause' : 'play'} size={12} color="white" />
					<Text style={styles.actionButtonText}>
						{item.status === 'Active' ? 'Deactivate' : 'Activate'}
					</Text>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);

	const renderSupplierDetails = () => {
		if (!selectedSupplier) return null;

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
						<Text style={styles.modalTitle}>{selectedSupplier.name}</Text>
						<TouchableOpacity
							onPress={() => handleCreateOrder(selectedSupplier.id)}
						>
							<FontAwesome5 name="plus" size={20} color="#84cc16" />
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.modalContent}>
						<View style={styles.detailSection}>
							<Text style={styles.sectionTitle}>Contact Information</Text>
							<View style={styles.detailItem}>
								<Text style={styles.detailLabel}>Contact Person:</Text>
								<Text style={styles.detailValue}>{selectedSupplier.contactPerson}</Text>
							</View>
							<View style={styles.detailItem}>
								<Text style={styles.detailLabel}>Phone:</Text>
								<Text style={styles.detailValue}>{selectedSupplier.phone}</Text>
							</View>
							<View style={styles.detailItem}>
								<Text style={styles.detailLabel}>Email:</Text>
								<Text style={styles.detailValue}>{selectedSupplier.email}</Text>
							</View>
							<View style={styles.detailItem}>
								<Text style={styles.detailLabel}>Address:</Text>
								<Text style={styles.detailValue}>{selectedSupplier.address}</Text>
							</View>
						</View>

						<View style={styles.detailSection}>
							<Text style={styles.sectionTitle}>Business Information</Text>
							<View style={styles.detailItem}>
								<Text style={styles.detailLabel}>GST Number:</Text>
								<Text style={styles.detailValue}>{selectedSupplier.gstNumber}</Text>
							</View>
							<View style={styles.detailItem}>
								<Text style={styles.detailLabel}>Category:</Text>
								<Text style={styles.detailValue}>{selectedSupplier.category}</Text>
							</View>
							<View style={styles.detailItem}>
								<Text style={styles.detailLabel}>Payment Terms:</Text>
								<Text style={styles.detailValue}>{selectedSupplier.paymentTerms}</Text>
							</View>
							<View style={styles.detailItem}>
								<Text style={styles.detailLabel}>Credit Limit:</Text>
								<Text style={styles.detailValue}>₹{selectedSupplier.creditLimit.toLocaleString()}</Text>
							</View>
						</View>

						<View style={styles.detailSection}>
							<Text style={styles.sectionTitle}>Performance Metrics</Text>
							<View style={styles.metricsRow}>
								<View style={styles.metricCard}>
									<Text style={styles.metricValue}>{selectedSupplier.totalOrders}</Text>
									<Text style={styles.metricLabel}>Total Orders</Text>
								</View>
								<View style={styles.metricCard}>
									<Text style={styles.metricValue}>{selectedSupplier.rating.toFixed(1)}</Text>
									<Text style={styles.metricLabel}>Rating</Text>
								</View>
								<View style={styles.metricCard}>
									<Text style={styles.metricValue}>₹{(selectedSupplier.outstandingAmount / 1000).toFixed(0)}K</Text>
									<Text style={styles.metricLabel}>Outstanding</Text>
								</View>
							</View>
						</View>

						<View style={styles.detailSection}>
							<Text style={styles.sectionTitle}>Products Supplied</Text>
							<View style={styles.productsContainer}>
								{selectedSupplier.products.map((product, index) => (
									<View key={index} style={styles.productTag}>
										<Text style={styles.productText}>{product}</Text>
									</View>
								))}
							</View>
						</View>

						<View style={styles.detailSection}>
							<Text style={styles.sectionTitle}>Recent Activity</Text>
							<View style={styles.activityItem}>
								<FontAwesome5 name="calendar" size={14} color="#6b7280" />
								<Text style={styles.activityText}>
									Last Order: {selectedSupplier.lastOrderDate || 'No recent orders'}
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
				<Text style={styles.headerTitle}>Supplier Management</Text>
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => setShowAddModal(true)}
				>
					<MaterialIcons name="add" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<View style={styles.searchContainer}>
				<View style={styles.searchBox}>
					<MaterialIcons name="search" size={20} color="#6b7280" />
					<TextInput
						style={styles.searchInput}
						placeholder="Search suppliers, contacts, categories..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
			</View>

			<View style={styles.statsRow}>
				<View style={[styles.statCard, { backgroundColor: '#10b981' }]}>
					<Text style={styles.statNumber}>{suppliers.filter(s => s.status === 'Active').length}</Text>
					<Text style={styles.statLabel}>Active</Text>
				</View>
				<View style={[styles.statCard, { backgroundColor: '#6b7280' }]}>
					<Text style={styles.statNumber}>{suppliers.filter(s => s.status === 'Inactive').length}</Text>
					<Text style={styles.statLabel}>Inactive</Text>
				</View>
				<View style={[styles.statCard, { backgroundColor: '#f59e0b' }]}>
					<Text style={styles.statNumber}>
						₹{(suppliers.reduce((sum, s) => sum + s.outstandingAmount, 0) / 1000).toFixed(0)}K
					</Text>
					<Text style={styles.statLabel}>Outstanding</Text>
				</View>
			</View>

			<FlatList
				data={filteredSuppliers}
				renderItem={renderSupplierItem}
				keyExtractor={item => item.id}
				style={styles.suppliersList}
				showsVerticalScrollIndicator={false}
			/>

			<Modal
				visible={showAddModal}
				animationType="slide"
				presentationStyle="pageSheet"
			>
				<SafeAreaView style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<TouchableOpacity onPress={() => setShowAddModal(false)}>
							<MaterialIcons name="close" size={24} color="#374151" />
						</TouchableOpacity>
						<Text style={styles.modalTitle}>Add New Supplier</Text>
						<TouchableOpacity onPress={handleAddSupplier}>
							<Text style={styles.saveButton}>Save</Text>
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.modalContent}>
						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Company Name *</Text>
							<TextInput
								style={styles.input}
								value={newSupplier.name}
								onChangeText={(text) => setNewSupplier({...newSupplier, name: text})}
								placeholder="Enter company name"
							/>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Contact Person *</Text>
							<TextInput
								style={styles.input}
								value={newSupplier.contactPerson}
								onChangeText={(text) => setNewSupplier({...newSupplier, contactPerson: text})}
								placeholder="Enter contact person name"
							/>
						</View>

						<View style={styles.inputRow}>
							<View style={styles.halfInput}>
								<Text style={styles.inputLabel}>Phone *</Text>
								<TextInput
									style={styles.input}
									value={newSupplier.phone}
									onChangeText={(text) => setNewSupplier({...newSupplier, phone: text})}
									placeholder="+91 98765 43210"
									keyboardType="phone-pad"
								/>
							</View>
							<View style={styles.halfInput}>
								<Text style={styles.inputLabel}>Email</Text>
								<TextInput
									style={styles.input}
									value={newSupplier.email}
									onChangeText={(text) => setNewSupplier({...newSupplier, email: text})}
									placeholder="email@company.com"
									keyboardType="email-address"
								/>
							</View>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Address</Text>
							<TextInput
								style={[styles.input, styles.textArea]}
								value={newSupplier.address}
								onChangeText={(text) => setNewSupplier({...newSupplier, address: text})}
								placeholder="Enter complete address"
								multiline
								numberOfLines={3}
							/>
						</View>

						<View style={styles.inputRow}>
							<View style={styles.halfInput}>
								<Text style={styles.inputLabel}>GST Number</Text>
								<TextInput
									style={styles.input}
									value={newSupplier.gstNumber}
									onChangeText={(text) => setNewSupplier({...newSupplier, gstNumber: text})}
									placeholder="27AAACM2548J1Z1"
								/>
							</View>
							<View style={styles.halfInput}>
								<Text style={styles.inputLabel}>Category</Text>
								<TextInput
									style={styles.input}
									value={newSupplier.category}
									onChangeText={(text) => setNewSupplier({...newSupplier, category: text})}
									placeholder="Select category"
								/>
							</View>
						</View>

						<View style={styles.inputRow}>
							<View style={styles.halfInput}>
								<Text style={styles.inputLabel}>Payment Terms</Text>
								<TextInput
									style={styles.input}
									value={newSupplier.paymentTerms}
									onChangeText={(text) => setNewSupplier({...newSupplier, paymentTerms: text})}
									placeholder="30 days"
								/>
							</View>
							<View style={styles.halfInput}>
								<Text style={styles.inputLabel}>Credit Limit (₹)</Text>
								<TextInput
									style={styles.input}
									value={newSupplier.creditLimit}
									onChangeText={(text) => setNewSupplier({...newSupplier, creditLimit: text})}
									placeholder="100000"
									keyboardType="numeric"
								/>
							</View>
						</View>
					</ScrollView>
				</SafeAreaView>
			</Modal>

			{renderSupplierDetails()}
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
		backgroundColor: '#84cc16',
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
		fontSize: 20,
		fontWeight: '700',
		color: 'white',
	},
	statLabel: {
		fontSize: 12,
		color: 'rgba(255,255,255,0.9)',
		marginTop: 2,
	},
	suppliersList: {
		flex: 1,
		paddingHorizontal: 20,
	},
	supplierItem: {
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
	supplierHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	supplierInfo: {
		flex: 1,
	},
	supplierName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	supplierCode: {
		fontSize: 12,
		color: '#6b7280',
		marginBottom: 2,
	},
	contactPerson: {
		fontSize: 14,
		color: '#374151',
		marginBottom: 2,
	},
	category: {
		fontSize: 12,
		color: '#84cc16',
		fontWeight: '500',
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
	ratingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	ratingText: {
		fontSize: 12,
		fontWeight: '600',
		marginLeft: 4,
	},
	supplierDetails: {
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
		flex: 1,
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
	saveButton: {
		fontSize: 16,
		fontWeight: '600',
		color: '#84cc16',
	},
	modalContent: {
		flex: 1,
		padding: 20,
	},
	detailSection: {
		marginBottom: 25,
		padding: 15,
		backgroundColor: '#f9fafb',
		borderRadius: 12,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 15,
	},
	detailItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	detailLabel: {
		fontSize: 14,
		color: '#6b7280',
		flex: 1,
	},
	detailValue: {
		fontSize: 14,
		color: '#1f2937',
		fontWeight: '500',
		flex: 2,
		textAlign: 'right',
	},
	metricsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	metricCard: {
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 8,
		flex: 1,
		marginHorizontal: 5,
	},
	metricValue: {
		fontSize: 18,
		fontWeight: '700',
		color: '#1f2937',
	},
	metricLabel: {
		fontSize: 12,
		color: '#6b7280',
		marginTop: 2,
	},
	productsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	productTag: {
		backgroundColor: '#84cc16',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginRight: 8,
		marginBottom: 8,
	},
	productText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	activityItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 10,
		borderRadius: 8,
	},
	activityText: {
		fontSize: 14,
		color: '#374151',
		marginLeft: 8,
	},
	inputGroup: {
		marginBottom: 20,
	},
	inputRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	halfInput: {
		flex: 1,
		marginHorizontal: 5,
	},
	inputLabel: {
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		color: '#374151',
		backgroundColor: 'white',
	},
	textArea: {
		height: 80,
		textAlignVertical: 'top',
	},
});

export default SupplierManagement;