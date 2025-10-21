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

const PharmacyInventory = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [showAddModal, setShowAddModal] = useState(false);
	const [sortBy, setSortBy] = useState('name');

	const [inventoryData, setInventoryData] = useState([
		{
			id: '1',
			name: 'Paracetamol 500mg',
			category: 'Analgesics',
			brand: 'Crocin',
			stock: 150,
			minStock: 20,
			maxStock: 500,
			price: 2.50,
			expiryDate: '2025-12-31',
			supplier: 'MedSupply Inc',
			batchNo: 'PCM001',
			status: 'In Stock'
		},
		{
			id: '2',
			name: 'Amoxicillin 250mg',
			category: 'Antibiotics',
			brand: 'Amoxil',
			stock: 5,
			minStock: 15,
			maxStock: 200,
			price: 8.75,
			expiryDate: '2024-06-30',
			supplier: 'PharmaCorp',
			batchNo: 'AMX002',
			status: 'Low Stock'
		},
		{
			id: '3',
			name: 'Insulin Glargine',
			category: 'Diabetes',
			brand: 'Lantus',
			stock: 25,
			minStock: 10,
			maxStock: 100,
			price: 125.00,
			expiryDate: '2024-08-15',
			supplier: 'BioMed Solutions',
			batchNo: 'INS003',
			status: 'In Stock'
		},
		{
			id: '4',
			name: 'Cetirizine 10mg',
			category: 'Antihistamines',
			brand: 'Zyrtec',
			stock: 0,
			minStock: 25,
			maxStock: 300,
			price: 1.20,
			expiryDate: '2025-03-20',
			supplier: 'MedSupply Inc',
			batchNo: 'CET004',
			status: 'Out of Stock'
		},
		{
			id: '5',
			name: 'Omeprazole 20mg',
			category: 'Gastroenterology',
			brand: 'Prilosec',
			stock: 3,
			minStock: 20,
			maxStock: 250,
			price: 3.80,
			expiryDate: '2024-04-10',
			supplier: 'PharmaCorp',
			batchNo: 'OME005',
			status: 'Critical'
		}
	]);

	const [newMedicine, setNewMedicine] = useState({
		name: '',
		category: '',
		brand: '',
		stock: '',
		minStock: '',
		maxStock: '',
		price: '',
		expiryDate: '',
		supplier: '',
		batchNo: ''
	});

	const categories = ['All', 'Analgesics', 'Antibiotics', 'Diabetes', 'Antihistamines', 'Gastroenterology', 'Cardiovascular', 'Respiratory'];

	const getStatusColor = (status) => {
		switch (status) {
			case 'In Stock': return '#10b981';
			case 'Low Stock': return '#f59e0b';
			case 'Out of Stock': return '#ef4444';
			case 'Critical': return '#dc2626';
			default: return '#6b7280';
		}
	};

	const getStockStatus = (stock, minStock) => {
		if (stock === 0) return 'Out of Stock';
		if (stock <= minStock * 0.2) return 'Critical';
		if (stock <= minStock) return 'Low Stock';
		return 'In Stock';
	};

	const filteredInventory = inventoryData
		.filter(item =>
			(selectedCategory === 'All' || item.category === selectedCategory) &&
			(item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.batchNo.toLowerCase().includes(searchQuery.toLowerCase()))
		)
		.sort((a, b) => {
			switch (sortBy) {
				case 'name': return a.name.localeCompare(b.name);
				case 'stock': return a.stock - b.stock;
				case 'expiry': return new Date(a.expiryDate) - new Date(b.expiryDate);
				case 'price': return a.price - b.price;
				default: return 0;
			}
		});

	const handleAddMedicine = () => {
		if (!newMedicine.name || !newMedicine.category || !newMedicine.stock) {
			Alert.alert('Error', 'Please fill in all required fields');
			return;
		}

		const id = (inventoryData.length + 1).toString();
		const stock = parseInt(newMedicine.stock);
		const minStock = parseInt(newMedicine.minStock) || 10;
		const status = getStockStatus(stock, minStock);

		const medicine = {
			...newMedicine,
			id,
			stock,
			minStock,
			maxStock: parseInt(newMedicine.maxStock) || 100,
			price: parseFloat(newMedicine.price) || 0,
			status
		};

		setInventoryData([...inventoryData, medicine]);
		setNewMedicine({
			name: '',
			category: '',
			brand: '',
			stock: '',
			minStock: '',
			maxStock: '',
			price: '',
			expiryDate: '',
			supplier: '',
			batchNo: ''
		});
		setShowAddModal(false);
		Alert.alert('Success', 'Medicine added to inventory');
	};

	const handleStockUpdate = (id, newStock) => {
		setInventoryData(prev => prev.map(item => {
			if (item.id === id) {
				const status = getStockStatus(newStock, item.minStock);
				return { ...item, stock: newStock, status };
			}
			return item;
		}));
	};

	const renderInventoryItem = ({ item }) => (
		<View style={styles.inventoryItem}>
			<View style={styles.itemHeader}>
				<View style={styles.itemInfo}>
					<Text style={styles.medicineName}>{item.name}</Text>
					<Text style={styles.brandName}>{item.brand}</Text>
					<Text style={styles.category}>{item.category}</Text>
				</View>
				<View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
					<Text style={styles.statusText}>{item.status}</Text>
				</View>
			</View>

			<View style={styles.itemDetails}>
				<View style={styles.detailRow}>
					<View style={styles.detailItem}>
						<FontAwesome5 name="boxes" size={14} color="#6b7280" />
						<Text style={styles.detailLabel}>Stock: {item.stock}</Text>
					</View>
					<View style={styles.detailItem}>
						<FontAwesome5 name="rupee-sign" size={14} color="#6b7280" />
						<Text style={styles.detailLabel}>₹{item.price}</Text>
					</View>
				</View>

				<View style={styles.detailRow}>
					<View style={styles.detailItem}>
						<FontAwesome5 name="calendar" size={14} color="#6b7280" />
						<Text style={styles.detailLabel}>Exp: {item.expiryDate}</Text>
					</View>
					<View style={styles.detailItem}>
						<FontAwesome5 name="industry" size={14} color="#6b7280" />
						<Text style={styles.detailLabel}>{item.supplier}</Text>
					</View>
				</View>

				<Text style={styles.batchNumber}>Batch: {item.batchNo}</Text>
			</View>

			<View style={styles.stockActions}>
				<TouchableOpacity
					style={styles.stockButton}
					onPress={() => handleStockUpdate(item.id, Math.max(0, item.stock - 1))}
				>
					<MaterialIcons name="remove" size={20} color="#ef4444" />
				</TouchableOpacity>
				<Text style={styles.stockText}>{item.stock}</Text>
				<TouchableOpacity
					style={styles.stockButton}
					onPress={() => handleStockUpdate(item.id, item.stock + 1)}
				>
					<MaterialIcons name="add" size={20} color="#10b981" />
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderCategoryFilter = () => (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
			{categories.map(category => (
				<TouchableOpacity
					key={category}
					style={[
						styles.categoryButton,
						selectedCategory === category && styles.activeCategoryButton
					]}
					onPress={() => setSelectedCategory(category)}
				>
					<Text style={[
						styles.categoryButtonText,
						selectedCategory === category && styles.activeCategoryButtonText
					]}>
						{category}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
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
				<Text style={styles.headerTitle}>Pharmacy Inventory</Text>
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
						placeholder="Search medicines, brands, batch numbers..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
				<TouchableOpacity style={styles.sortButton}>
					<MaterialIcons name="sort" size={20} color="#84cc16" />
				</TouchableOpacity>
			</View>

			{renderCategoryFilter()}

			<View style={styles.statsRow}>
				<View style={[styles.statCard, { backgroundColor: '#10b981' }]}>
					<Text style={styles.statNumber}>{inventoryData.filter(item => item.status === 'In Stock').length}</Text>
					<Text style={styles.statLabel}>In Stock</Text>
				</View>
				<View style={[styles.statCard, { backgroundColor: '#f59e0b' }]}>
					<Text style={styles.statNumber}>{inventoryData.filter(item => item.status === 'Low Stock').length}</Text>
					<Text style={styles.statLabel}>Low Stock</Text>
				</View>
				<View style={[styles.statCard, { backgroundColor: '#ef4444' }]}>
					<Text style={styles.statNumber}>{inventoryData.filter(item => item.status === 'Out of Stock').length}</Text>
					<Text style={styles.statLabel}>Out of Stock</Text>
				</View>
			</View>

			<FlatList
				data={filteredInventory}
				renderItem={renderInventoryItem}
				keyExtractor={item => item.id}
				style={styles.inventoryList}
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
						<Text style={styles.modalTitle}>Add New Medicine</Text>
						<TouchableOpacity onPress={handleAddMedicine}>
							<Text style={styles.saveButton}>Save</Text>
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.modalContent}>
						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Medicine Name *</Text>
							<TextInput
								style={styles.input}
								value={newMedicine.name}
								onChangeText={(text) => setNewMedicine({...newMedicine, name: text})}
								placeholder="Enter medicine name"
							/>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Brand</Text>
							<TextInput
								style={styles.input}
								value={newMedicine.brand}
								onChangeText={(text) => setNewMedicine({...newMedicine, brand: text})}
								placeholder="Enter brand name"
							/>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Category *</Text>
							<TextInput
								style={styles.input}
								value={newMedicine.category}
								onChangeText={(text) => setNewMedicine({...newMedicine, category: text})}
								placeholder="Enter category"
							/>
						</View>

						<View style={styles.inputRow}>
							<View style={styles.halfInput}>
								<Text style={styles.inputLabel}>Current Stock *</Text>
								<TextInput
									style={styles.input}
									value={newMedicine.stock}
									onChangeText={(text) => setNewMedicine({...newMedicine, stock: text})}
									placeholder="0"
									keyboardType="numeric"
								/>
							</View>
							<View style={styles.halfInput}>
								<Text style={styles.inputLabel}>Min Stock</Text>
								<TextInput
									style={styles.input}
									value={newMedicine.minStock}
									onChangeText={(text) => setNewMedicine({...newMedicine, minStock: text})}
									placeholder="10"
									keyboardType="numeric"
								/>
							</View>
						</View>

						<View style={styles.inputRow}>
							<View style={styles.halfInput}>
								<Text style={styles.inputLabel}>Max Stock</Text>
								<TextInput
									style={styles.input}
									value={newMedicine.maxStock}
									onChangeText={(text) => setNewMedicine({...newMedicine, maxStock: text})}
									placeholder="100"
									keyboardType="numeric"
								/>
							</View>
							<View style={styles.halfInput}>
								<Text style={styles.inputLabel}>Price (₹)</Text>
								<TextInput
									style={styles.input}
									value={newMedicine.price}
									onChangeText={(text) => setNewMedicine({...newMedicine, price: text})}
									placeholder="0.00"
									keyboardType="numeric"
								/>
							</View>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Expiry Date</Text>
							<TextInput
								style={styles.input}
								value={newMedicine.expiryDate}
								onChangeText={(text) => setNewMedicine({...newMedicine, expiryDate: text})}
								placeholder="YYYY-MM-DD"
							/>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Supplier</Text>
							<TextInput
								style={styles.input}
								value={newMedicine.supplier}
								onChangeText={(text) => setNewMedicine({...newMedicine, supplier: text})}
								placeholder="Enter supplier name"
							/>
						</View>

						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Batch Number</Text>
							<TextInput
								style={styles.input}
								value={newMedicine.batchNo}
								onChangeText={(text) => setNewMedicine({...newMedicine, batchNo: text})}
								placeholder="Enter batch number"
							/>
						</View>
					</ScrollView>
				</SafeAreaView>
			</Modal>
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
		flexDirection: 'row',
		paddingHorizontal: 20,
		paddingVertical: 15,
		alignItems: 'center',
	},
	searchBox: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 12,
		paddingHorizontal: 15,
		paddingVertical: 10,
		marginRight: 10,
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
	sortButton: {
		padding: 10,
		backgroundColor: 'white',
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	categoryFilter: {
		paddingHorizontal: 20,
		paddingBottom: 15,
	},
	categoryButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginRight: 10,
		backgroundColor: 'white',
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	activeCategoryButton: {
		backgroundColor: '#84cc16',
		borderColor: '#84cc16',
	},
	categoryButtonText: {
		fontSize: 14,
		color: '#374151',
		fontWeight: '500',
	},
	activeCategoryButtonText: {
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
	inventoryList: {
		flex: 1,
		paddingHorizontal: 20,
	},
	inventoryItem: {
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
	itemHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	itemInfo: {
		flex: 1,
	},
	medicineName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	brandName: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 2,
	},
	category: {
		fontSize: 12,
		color: '#84cc16',
		fontWeight: '500',
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	statusText: {
		color: 'white',
		fontSize: 11,
		fontWeight: '600',
	},
	itemDetails: {
		marginBottom: 10,
	},
	detailRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 5,
	},
	detailItem: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	detailLabel: {
		fontSize: 12,
		color: '#6b7280',
		marginLeft: 5,
	},
	batchNumber: {
		fontSize: 12,
		color: '#374151',
		fontWeight: '500',
	},
	stockActions: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderTopWidth: 1,
		borderTopColor: '#f3f4f6',
		paddingTop: 10,
	},
	stockButton: {
		padding: 8,
		borderRadius: 8,
		backgroundColor: '#f9fafb',
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	stockText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginHorizontal: 20,
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
});

export default PharmacyInventory;