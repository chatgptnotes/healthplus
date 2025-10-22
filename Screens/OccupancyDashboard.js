import React, { useState, useEffect } from 'react';
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
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchHospitalMetrics } from '../store/actions/HospitalMetricsActions';
import Colors from '../constants/ThemeColors';

const OccupancyDashboard = (props) => {
	const dispatch = useDispatch();
	const { occupancy, surgeries, icuMetrics, criticalPatients, loading, error } = useSelector(
		state => state.hospitalMetrics
	);

	useEffect(() => {
		dispatch(fetchHospitalMetrics());
	}, [dispatch]);

	const renderOccupancyCard = (title, value, subtitle, icon, color, onPress) => (
		<TouchableOpacity style={[styles.kpiCard, { backgroundColor: color }]} onPress={onPress}>
			<View style={styles.kpiHeader}>
				<MaterialIcons name={icon} size={28} color="white" />
				<View style={styles.kpiContent}>
					<Text style={styles.kpiValue}>{value}</Text>
					<Text style={styles.kpiTitle}>{title}</Text>
					{subtitle && <Text style={styles.kpiSubtitle}>{subtitle}</Text>}
				</View>
			</View>
		</TouchableOpacity>
	);

	const renderDepartmentOccupancy = ({ item }) => (
		<View style={styles.departmentCard}>
			<View style={styles.departmentHeader}>
				<Text style={styles.departmentName}>{item.department}</Text>
				<Text style={[styles.occupancyRate, {
					color: item.rate >= 85 ? '#dc2626' : item.rate >= 70 ? '#f59e0b' : '#10b981'
				}]}>
					{item.rate.toFixed(1)}%
				</Text>
			</View>
			<View style={styles.departmentStats}>
				<View style={styles.bedStat}>
					<Text style={styles.bedNumber}>{item.occupied}</Text>
					<Text style={styles.bedLabel}>Occupied</Text>
				</View>
				<View style={styles.bedStat}>
					<Text style={styles.bedNumber}>{item.totalBeds - item.occupied}</Text>
					<Text style={styles.bedLabel}>Available</Text>
				</View>
				<View style={styles.bedStat}>
					<Text style={styles.bedNumber}>{item.totalBeds}</Text>
					<Text style={styles.bedLabel}>Total</Text>
				</View>
			</View>
			<View style={styles.progressBar}>
				<View
					style={[
						styles.progressFill,
						{
							width: `${item.rate}%`,
							backgroundColor: item.rate >= 85 ? '#dc2626' : item.rate >= 70 ? '#f59e0b' : '#10b981'
						}
					]}
				/>
			</View>
		</View>
	);

	const renderSurgeryMetrics = () => (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Surgery Metrics</Text>
			<View style={styles.surgeryGrid}>
				<View style={styles.surgeryCard}>
					<Text style={styles.surgeryLabel}>Today</Text>
					<View style={styles.surgeryStats}>
						<View style={styles.surgeryStat}>
							<Text style={[styles.surgeryNumber, { color: '#10b981' }]}>{surgeries.today.completed}</Text>
							<Text style={styles.surgeryDesc}>Completed</Text>
						</View>
						<View style={styles.surgeryStat}>
							<Text style={[styles.surgeryNumber, { color: '#f59e0b' }]}>{surgeries.today.ongoing}</Text>
							<Text style={styles.surgeryDesc}>Ongoing</Text>
						</View>
						<View style={styles.surgeryStat}>
							<Text style={[styles.surgeryNumber, { color: '#6b7280' }]}>{surgeries.today.pending}</Text>
							<Text style={styles.surgeryDesc}>Pending</Text>
						</View>
					</View>
				</View>

				<View style={styles.surgeryCard}>
					<Text style={styles.surgeryLabel}>Yesterday</Text>
					<View style={styles.surgeryStats}>
						<View style={styles.surgeryStat}>
							<Text style={[styles.surgeryNumber, { color: '#10b981' }]}>{surgeries.yesterday.completed}</Text>
							<Text style={styles.surgeryDesc}>Completed</Text>
						</View>
						<View style={styles.surgeryStat}>
							<Text style={[styles.surgeryNumber, { color: '#dc2626' }]}>{surgeries.yesterday.cancelled}</Text>
							<Text style={styles.surgeryDesc}>Cancelled</Text>
						</View>
					</View>
				</View>

				<View style={styles.surgeryCard}>
					<Text style={styles.surgeryLabel}>This Month</Text>
					<View style={styles.surgeryStats}>
						<View style={styles.surgeryStat}>
							<Text style={[styles.surgeryNumber, { color: '#1f2937' }]}>{surgeries.monthly.total}</Text>
							<Text style={styles.surgeryDesc}>Total</Text>
						</View>
						<View style={styles.surgeryStat}>
							<Text style={[styles.surgeryNumber, { color: '#10b981' }]}>{surgeries.monthly.successRate}%</Text>
							<Text style={styles.surgeryDesc}>Success Rate</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);

	const renderICUMetrics = () => (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>ICU & Critical Care</Text>
			<View style={styles.icuGrid}>
				<View style={styles.icuCard}>
					<View style={styles.icuHeader}>
						<MaterialCommunityIcons name="hospital-box" size={24} color="#dc2626" />
						<Text style={styles.icuTitle}>ICU Occupancy</Text>
					</View>
					<Text style={styles.icuRate}>{icuMetrics.icuOccupancyRate}%</Text>
					<Text style={styles.icuSubtext}>{icuMetrics.occupiedICUBeds}/{icuMetrics.totalICUBeds} beds occupied</Text>
				</View>

				<View style={styles.icuCard}>
					<View style={styles.icuHeader}>
						<MaterialCommunityIcons name="lung" size={24} color="#7c3aed" />
						<Text style={styles.icuTitle}>Ventilators</Text>
					</View>
					<Text style={styles.icuRate}>{icuMetrics.ventilatorUsage.inUse}/{icuMetrics.ventilatorUsage.total}</Text>
					<Text style={styles.icuSubtext}>In Use</Text>
				</View>

				<View style={styles.icuCard}>
					<View style={styles.icuHeader}>
						<MaterialCommunityIcons name="alert" size={24} color="#ea580c" />
						<Text style={styles.icuTitle}>Critical Patients</Text>
					</View>
					<Text style={styles.icuRate}>{criticalPatients.total}</Text>
					<Text style={styles.icuSubtext}>{criticalPatients.newToday} new today</Text>
				</View>
			</View>
		</View>
	);

	const renderCriticalPatientsBreakdown = () => (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Critical Conditions Breakdown</Text>
			<FlatList
				data={criticalPatients.criticalConditions}
				renderItem={({ item }) => (
					<View style={styles.conditionCard}>
						<View style={[styles.conditionIndicator, { backgroundColor: item.color }]} />
						<View style={styles.conditionContent}>
							<Text style={styles.conditionName}>{item.condition}</Text>
							<Text style={styles.conditionCount}>{item.count} patients</Text>
						</View>
					</View>
				)}
				keyExtractor={(item, index) => index.toString()}
				scrollEnabled={false}
			/>
		</View>
	);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#1f2937" />
				<Text style={styles.loadingText}>Loading Hospital Metrics...</Text>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Hospital Occupancy & KPIs</Text>
				<TouchableOpacity
					style={styles.refreshButton}
					onPress={() => dispatch(fetchHospitalMetrics())}
				>
					<MaterialIcons name="refresh" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Main KPI Cards */}
				<View style={styles.kpiContainer}>
					{renderOccupancyCard(
						'Overall Occupancy',
						`${occupancy.occupancyRate}%`,
						`${occupancy.occupiedBeds}/${occupancy.totalBeds} beds`,
						'hotel',
						'#1f2937',
						() => Alert.alert(
							'Occupancy Details',
							`Current Status:\n• Total Beds: ${occupancy.totalBeds}\n• Occupied: ${occupancy.occupiedBeds}\n• Available: ${occupancy.availableBeds}\n• Occupancy Rate: ${occupancy.occupancyRate}%\n• Monthly Average: ${occupancy.monthlyOccupancyRate}%`
						)
					)}
					{renderOccupancyCard(
						'Monthly Average',
						`${occupancy.monthlyOccupancyRate}%`,
						'Avg. occupancy',
						'trending-up',
						'#10b981',
						() => Alert.alert('Monthly Trend', 'This shows the average occupancy rate for the current month.')
					)}
					{renderOccupancyCard(
						'ICU Occupancy',
						`${icuMetrics.icuOccupancyRate}%`,
						`${icuMetrics.occupiedICUBeds}/${icuMetrics.totalICUBeds} ICU beds`,
						'local-hospital',
						'#dc2626',
						() => Alert.alert(
							'ICU Status',
							`ICU Details:\n• Total ICU Beds: ${icuMetrics.totalICUBeds}\n• Occupied: ${icuMetrics.occupiedICUBeds}\n• Available: ${icuMetrics.availableICUBeds}\n• Ventilators in use: ${icuMetrics.ventilatorUsage.inUse}/${icuMetrics.ventilatorUsage.total}`
						)
					)}
					{renderOccupancyCard(
						'Critical Patients',
						criticalPatients.total,
						`${criticalPatients.newToday} new today`,
						'warning',
						'#f59e0b',
						() => Alert.alert(
							'Critical Patients',
							`Critical Care Status:\n• Total Critical: ${criticalPatients.total}\n• New Today: ${criticalPatients.newToday}\n• Improved: ${criticalPatients.improved}\n• Deteriorated: ${criticalPatients.deteriorated}\n\nAlert Levels:\n• Red: ${criticalPatients.alertLevels.red}\n• Orange: ${criticalPatients.alertLevels.orange}\n• Yellow: ${criticalPatients.alertLevels.yellow}`
						)
					)}
				</View>

				{/* Department Occupancy */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Department Occupancy</Text>
					<FlatList
						data={occupancy.departmentOccupancy}
						renderItem={renderDepartmentOccupancy}
						keyExtractor={(item, index) => index.toString()}
						scrollEnabled={false}
					/>
				</View>

				{/* Surgery Metrics */}
				{renderSurgeryMetrics()}

				{/* ICU Metrics */}
				{renderICUMetrics()}

				{/* Critical Patients Breakdown */}
				{renderCriticalPatientsBreakdown()}

				{/* Quick Actions */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Quick Actions</Text>
					<View style={styles.actionGrid}>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => Alert.alert('Bed Management', 'Opening bed management system...')}
						>
							<MaterialIcons name="hotel" size={30} color="#1f2937" />
							<Text style={styles.actionText}>Bed Management</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => Alert.alert('Surgery Schedule', 'Opening surgery scheduling...')}
						>
							<MaterialIcons name="medical-services" size={30} color="#dc2626" />
							<Text style={styles.actionText}>Surgery Schedule</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => Alert.alert('ICU Monitor', 'Opening ICU monitoring system...')}
						>
							<MaterialCommunityIcons name="monitor-heart" size={30} color="#7c3aed" />
							<Text style={styles.actionText}>ICU Monitor</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => Alert.alert('Critical Alerts', 'Opening critical patient alerts...')}
						>
							<MaterialIcons name="emergency" size={30} color="#f59e0b" />
							<Text style={styles.actionText}>Critical Alerts</Text>
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
		backgroundColor: '#f8fafc',
	},
	loadingText: {
		marginTop: 15,
		fontSize: 16,
		color: '#6b7280',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 20,
		paddingHorizontal: 20,
		backgroundColor: '#1f2937',
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
	},
	headerTitle: {
		fontSize: 22,
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
	kpiContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginTop: 20,
		marginBottom: 20,
	},
	kpiCard: {
		width: '48%',
		padding: 18,
		borderRadius: 15,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
	},
	kpiHeader: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	kpiContent: {
		marginLeft: 12,
		flex: 1,
	},
	kpiValue: {
		fontSize: 24,
		fontWeight: '700',
		color: 'white',
		marginBottom: 2,
	},
	kpiTitle: {
		fontSize: 12,
		color: 'rgba(255,255,255,0.9)',
		fontWeight: '600',
	},
	kpiSubtitle: {
		fontSize: 10,
		color: 'rgba(255,255,255,0.7)',
		marginTop: 2,
	},
	section: {
		marginBottom: 25,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 15,
	},
	departmentCard: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	departmentHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	departmentName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	occupancyRate: {
		fontSize: 18,
		fontWeight: '700',
	},
	departmentStats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	bedStat: {
		alignItems: 'center',
		flex: 1,
	},
	bedNumber: {
		fontSize: 16,
		fontWeight: '700',
		color: '#1f2937',
	},
	bedLabel: {
		fontSize: 12,
		color: '#6b7280',
		marginTop: 2,
	},
	progressBar: {
		height: 6,
		backgroundColor: '#e5e7eb',
		borderRadius: 3,
		overflow: 'hidden',
	},
	progressFill: {
		height: '100%',
		borderRadius: 3,
	},
	surgeryGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	surgeryCard: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		width: '48%',
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	surgeryLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 10,
		textAlign: 'center',
	},
	surgeryStats: {
		alignItems: 'center',
	},
	surgeryStat: {
		alignItems: 'center',
		marginBottom: 8,
	},
	surgeryNumber: {
		fontSize: 20,
		fontWeight: '700',
	},
	surgeryDesc: {
		fontSize: 11,
		color: '#6b7280',
		marginTop: 2,
	},
	icuGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	icuCard: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		width: '48%',
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	icuHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	icuTitle: {
		fontSize: 12,
		fontWeight: '600',
		color: '#1f2937',
		marginLeft: 8,
		flex: 1,
	},
	icuRate: {
		fontSize: 20,
		fontWeight: '700',
		color: '#1f2937',
		textAlign: 'center',
	},
	icuSubtext: {
		fontSize: 11,
		color: '#6b7280',
		textAlign: 'center',
		marginTop: 4,
	},
	conditionCard: {
		backgroundColor: 'white',
		padding: 12,
		borderRadius: 12,
		marginBottom: 8,
		flexDirection: 'row',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	conditionIndicator: {
		width: 8,
		height: 40,
		borderRadius: 4,
		marginRight: 12,
	},
	conditionContent: {
		flex: 1,
	},
	conditionName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
	},
	conditionCount: {
		fontSize: 12,
		color: '#6b7280',
		marginTop: 2,
	},
	actionGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
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

export default OccupancyDashboard;