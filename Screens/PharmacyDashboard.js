import React, { useState, useEffect, useCallback } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
	SafeAreaView,
	Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const PharmacyDashboard = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// Sample data - this would come from Redux store in real implementation
	const [dashboardData, setDashboardData] = useState({
		pendingPrescriptions: 12,
		lowStockItems: 8,
		todaysDispensing: 45,
		monthlyRevenue: 85000,
		recentPrescriptions: [
			{ id: '1', patientName: 'John Doe', doctor: 'Dr. Smith', status: 'Pending', priority: 'High' },
			{ id: '2', patientName: 'Jane Wilson', doctor: 'Dr. Johnson', status: 'Ready', priority: 'Normal' },
			{ id: '3', patientName: 'Mike Brown', doctor: 'Dr. Davis', status: 'Processing', priority: 'Normal' },
		],
		lowStockMedicines: [
			{ id: '1', name: 'Paracetamol 500mg', currentStock: 50, minStock: 100, supplier: 'MedCorp' },
			{ id: '2', name: 'Amoxicillin 250mg', currentStock: 25, minStock: 75, supplier: 'PharmaCo' },
			{ id: '3', name: 'Cough Syrup', currentStock: 15, minStock: 50, supplier: 'Hope Pharmacy' },
		]
	});

	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = useCallback(async () => {
		setIsLoading(true);
		try {
			// Here you would dispatch actions to fetch pharmacy data
			// await dispatch(PharmacyActions.fetchDashboardData());
			setIsLoading(false);
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
		}
	}, [dispatch]);

	const renderStatCard = (title, value, icon, color, onPress) => (
		<TouchableOpacity style={[styles.statCard, { backgroundColor: color }]} onPress={onPress}>
			<View style={styles.statIconContainer}>
				<FontAwesome5 name={icon} size={24} color="white" />
			</View>
			<Text style={styles.statValue}>{value}</Text>
			<Text style={styles.statTitle}>{title}</Text>
		</TouchableOpacity>
	);

	const renderPrescriptionItem = ({ item }) => (
		<View style={styles.listItem}>
			<View style={styles.listItemHeader}>
				<Text style={styles.patientName}>{item.patientName}</Text>
				<View style={[styles.statusBadge, {
					backgroundColor: item.status === 'Ready' ? '#10b981' :
									item.status === 'Processing' ? '#f59e0b' : '#ef4444'
				}]}>
					<Text style={styles.statusText}>{item.status}</Text>
				</View>
			</View>
			<Text style={styles.doctorName}>Prescribed by: {item.doctor}</Text>
			<Text style={styles.priority}>Priority: {item.priority}</Text>
		</View>
	);

	const renderLowStockItem = ({ item }) => (
		<View style={styles.listItem}>
			<View style={styles.listItemHeader}>
				<Text style={styles.medicineName}>{item.name}</Text>
				<View style={styles.stockInfo}>
					<Text style={styles.stockCurrent}>{item.currentStock}</Text>
					<Text style={styles.stockMin}>/{item.minStock}</Text>
				</View>
			</View>
			<Text style={styles.supplierInfo}>Supplier: {item.supplier}</Text>
			<View style={styles.stockBar}>
				<View style={[styles.stockFill, { width: `${(item.currentStock / item.minStock) * 100}%` }]} />
			</View>
		</View>
	);

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={Colors.BackgroundBlue} />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Pharmacy Dashboard</Text>
				<TouchableOpacity
					style={styles.refreshButton}
					onPress={loadDashboardData}
				>
					<FontAwesome5 name="sync-alt" size={20} color="white" />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Statistics Cards */}
				<View style={styles.statsContainer}>
					{renderStatCard('Pending Prescriptions', dashboardData.pendingPrescriptions, 'prescription-bottle-alt', '#ef4444', () => props.navigation.navigate('PrescriptionProcessing'))}
					{renderStatCard('Low Stock Items', dashboardData.lowStockItems, 'exclamation-triangle', '#f59e0b', () => props.navigation.navigate('PharmacyInventory'))}
					{renderStatCard('Today\'s Dispensing', dashboardData.todaysDispensing, 'pills', '#10b981')}
					{renderStatCard('Monthly Revenue', `₹${dashboardData.monthlyRevenue.toLocaleString()}`, 'rupee-sign', '#6366f1')}
				</View>

				{/* Recent Prescriptions */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Recent Prescriptions</Text>
						<TouchableOpacity
							style={styles.viewAllButton}
							onPress={() => props.navigation.navigate('PrescriptionProcessing')}
						>
							<Text style={styles.viewAllText}>View All</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={dashboardData.recentPrescriptions}
						renderItem={renderPrescriptionItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
					/>
				</View>

				{/* Low Stock Medicines */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Low Stock Alert</Text>
						<TouchableOpacity
							style={styles.viewAllButton}
							onPress={() => props.navigation.navigate('PharmacyInventory')}
						>
							<Text style={styles.viewAllText}>Manage Inventory</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={dashboardData.lowStockMedicines}
						renderItem={renderLowStockItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
					/>
				</View>

				{/* Quick Actions */}
				<View style={styles.quickActions}>
					<Text style={styles.sectionTitle}>Quick Actions</Text>
					<View style={styles.actionGrid}>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => props.navigation.navigate('PrescriptionProcessing')}
						>
							<MaterialCommunityIcons name="prescription" size={30} color={Colors.BackgroundBlue} />
							<Text style={styles.actionText}>Process Prescription</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => props.navigation.navigate('PharmacyInventory')}
						>
							<FontAwesome5 name="pills" size={30} color={Colors.BackgroundBlue} />
							<Text style={styles.actionText}>Manage Inventory</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => props.navigation.navigate('SupplierManagement')}
						>
							<MaterialCommunityIcons name="truck-delivery" size={30} color={Colors.BackgroundBlue} />
							<Text style={styles.actionText}>Manage Suppliers</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => alert('Pharmacy Reports feature coming soon!')}
						>
							<FontAwesome5 name="chart-line" size={30} color={Colors.BackgroundBlue} />
							<Text style={styles.actionText}>View Reports</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 20,
		paddingHorizontal: 20,
		backgroundColor: '#ef4444',
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: '700',
		color: 'white',
	},
	refreshButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	content: {
		flex: 1,
		paddingHorizontal: 15,
	},
	statsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginTop: 20,
		marginBottom: 20,
	},
	statCard: {
		width: '48%',
		padding: 20,
		borderRadius: 15,
		alignItems: 'center',
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
	},
	statIconContainer: {
		marginBottom: 10,
	},
	statValue: {
		fontSize: 24,
		fontWeight: '700',
		color: 'white',
		marginBottom: 5,
	},
	statTitle: {
		fontSize: 12,
		color: 'rgba(255,255,255,0.9)',
		textAlign: 'center',
		fontWeight: '500',
	},
	section: {
		marginBottom: 25,
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
	viewAllButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: Colors.BackgroundBlue,
		borderRadius: 12,
	},
	viewAllText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	listItem: {
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
	listItemHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	patientName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	medicineName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
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
	doctorName: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 4,
	},
	priority: {
		fontSize: 14,
		color: '#6b7280',
	},
	stockInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	stockCurrent: {
		fontSize: 16,
		fontWeight: '600',
		color: '#ef4444',
	},
	stockMin: {
		fontSize: 14,
		color: '#6b7280',
	},
	supplierInfo: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 8,
	},
	stockBar: {
		height: 4,
		backgroundColor: '#e5e7eb',
		borderRadius: 2,
		overflow: 'hidden',
	},
	stockFill: {
		height: '100%',
		backgroundColor: '#ef4444',
	},
	quickActions: {
		marginBottom: 20,
	},
	actionGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginTop: 15,
	},
	actionButton: {
		width: '48%',
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 12,
		alignItems: 'center',
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	actionText: {
		marginTop: 8,
		fontSize: 12,
		fontWeight: '500',
		color: '#374151',
		textAlign: 'center',
	},
});

export default PharmacyDashboard;