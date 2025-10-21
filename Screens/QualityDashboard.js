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

const QualityDashboard = (props) => {
	const [currentTab, setCurrentTab] = useState('overview');
	const [selectedPeriod, setSelectedPeriod] = useState('monthly');
	const [showKPIModal, setShowKPIModal] = useState(false);
	const [selectedKPI, setSelectedKPI] = useState(null);

	const [qualityMetrics] = useState({
		overall: {
			score: 92.5,
			trend: '+2.3',
			status: 'excellent'
		},
		patientSafety: {
			score: 94.2,
			incidents: 2,
			previousMonth: 3,
			trend: '-33%'
		},
		clinicalQuality: {
			score: 91.8,
			mortalityRate: 1.2,
			infectionRate: 0.8,
			readmissionRate: 5.5
		},
		patientSatisfaction: {
			score: 89.6,
			responseRate: 78,
			complaints: 12,
			compliments: 156
		}
	});

	const [kpiData] = useState([
		{
			id: '1',
			name: 'Hospital Acquired Infection Rate',
			category: 'Patient Safety',
			value: '0.8%',
			target: '<1.2%',
			status: 'good',
			trend: 'down',
			description: 'Rate of infections acquired during hospital stay',
			owner: 'डॉ. अनिल गुप्ता',
			lastUpdated: '2024-01-15'
		},
		{
			id: '2',
			name: 'Patient Satisfaction Score',
			category: 'Patient Experience',
			value: '89.6%',
			target: '>85%',
			status: 'excellent',
			trend: 'up',
			description: 'Overall patient satisfaction from surveys',
			owner: 'श्रीमती सुनीता शर्मा',
			lastUpdated: '2024-01-14'
		},
		{
			id: '3',
			name: 'Average Length of Stay',
			category: 'Operational Efficiency',
			value: '4.2 days',
			target: '<5 days',
			status: 'good',
			trend: 'stable',
			description: 'Average number of days patients stay in hospital',
			owner: 'श्री राकेश वर्मा',
			lastUpdated: '2024-01-15'
		},
		{
			id: '4',
			name: 'Medication Error Rate',
			category: 'Patient Safety',
			value: '0.12%',
			target: '<0.2%',
			status: 'excellent',
			trend: 'down',
			description: 'Rate of medication administration errors',
			owner: 'डॉ. प्रीति सिंह',
			lastUpdated: '2024-01-15'
		},
		{
			id: '5',
			name: 'Bed Occupancy Rate',
			category: 'Operational Efficiency',
			value: '87.3%',
			target: '80-90%',
			status: 'good',
			trend: 'up',
			description: 'Percentage of beds occupied',
			owner: 'श्री मोहन कुमार',
			lastUpdated: '2024-01-15'
		},
		{
			id: '6',
			name: 'Emergency Response Time',
			category: 'Clinical Quality',
			value: '3.2 min',
			target: '<5 min',
			status: 'excellent',
			trend: 'down',
			description: 'Average response time for emergency calls',
			owner: 'डॉ. राज श्रीवास्तव',
			lastUpdated: '2024-01-15'
		},
		{
			id: '7',
			name: 'Staff Turnover Rate',
			category: 'Human Resources',
			value: '8.5%',
			target: '<12%',
			status: 'good',
			trend: 'stable',
			description: 'Annual staff turnover percentage',
			owner: 'श्रीमती अंजली गुप्ता',
			lastUpdated: '2024-01-15'
		},
		{
			id: '8',
			name: 'Hand Hygiene Compliance',
			category: 'Patient Safety',
			value: '96.2%',
			target: '>95%',
			status: 'excellent',
			trend: 'up',
			description: 'Compliance rate for hand hygiene protocols',
			owner: 'डॉ. सुनील कुमार',
			lastUpdated: '2024-01-15'
		}
	]);

	const [departmentKPIs] = useState([
		{
			department: 'Emergency',
			kpis: [
				{ name: 'Average Wait Time', value: '18 min', target: '<30 min', status: 'good' },
				{ name: 'Patient Throughput', value: '92/day', target: '>80/day', status: 'excellent' },
				{ name: 'Left Without Treatment', value: '2.1%', target: '<5%', status: 'good' }
			]
		},
		{
			department: 'Surgery',
			kpis: [
				{ name: 'On-time Starts', value: '94.5%', target: '>90%', status: 'excellent' },
				{ name: 'Cancellation Rate', value: '3.2%', target: '<5%', status: 'good' },
				{ name: 'Complication Rate', value: '1.8%', target: '<3%', status: 'good' }
			]
		},
		{
			department: 'ICU',
			kpis: [
				{ name: 'Mortality Rate', value: '12.5%', target: '<15%', status: 'good' },
				{ name: 'Readmission Rate', value: '4.2%', target: '<8%', status: 'excellent' },
				{ name: 'CLABSI Rate', value: '0.9', target: '<2.0', status: 'excellent' }
			]
		},
		{
			department: 'Pharmacy',
			kpis: [
				{ name: 'Dispensing Accuracy', value: '99.8%', target: '>99%', status: 'excellent' },
				{ name: 'Average Fill Time', value: '8.5 min', target: '<15 min', status: 'excellent' },
				{ name: 'Stock-out Rate', value: '0.5%', target: '<2%', status: 'excellent' }
			]
		}
	]);

	const statusColors = {
		excellent: '#10b981',
		good: '#f59e0b',
		warning: '#ef4444',
		critical: '#dc2626'
	};

	const statusIcons = {
		excellent: 'check-circle',
		good: 'alert-circle',
		warning: 'alert-triangle',
		critical: 'x-circle'
	};

	const trendIcons = {
		up: 'trending-up',
		down: 'trending-down',
		stable: 'minus'
	};

	const renderOverviewTab = () => (
		<ScrollView>
			<View style={styles.metricsGrid}>
				<View style={styles.metricCard}>
					<View style={styles.metricHeader}>
						<MaterialCommunityIcons name="shield-check" size={30} color="#10b981" />
						<Text style={styles.metricTitle}>Overall Quality Score</Text>
					</View>
					<Text style={styles.metricValue}>{qualityMetrics.overall.score}%</Text>
					<View style={styles.metricTrend}>
						<MaterialCommunityIcons name="trending-up" size={16} color="#10b981" />
						<Text style={[styles.trendText, { color: '#10b981' }]}>
							{qualityMetrics.overall.trend}% this month
						</Text>
					</View>
				</View>

				<View style={styles.metricCard}>
					<View style={styles.metricHeader}>
						<MaterialCommunityIcons name="heart-pulse" size={30} color="#6366f1" />
						<Text style={styles.metricTitle}>Patient Safety</Text>
					</View>
					<Text style={styles.metricValue}>{qualityMetrics.patientSafety.score}%</Text>
					<Text style={styles.metricSubtext}>
						{qualityMetrics.patientSafety.incidents} incidents this month
					</Text>
				</View>

				<View style={styles.metricCard}>
					<View style={styles.metricHeader}>
						<MaterialCommunityIcons name="stethoscope" size={30} color="#f59e0b" />
						<Text style={styles.metricTitle}>Clinical Quality</Text>
					</View>
					<Text style={styles.metricValue}>{qualityMetrics.clinicalQuality.score}%</Text>
					<Text style={styles.metricSubtext}>
						{qualityMetrics.clinicalQuality.mortalityRate}% mortality rate
					</Text>
				</View>

				<View style={styles.metricCard}>
					<View style={styles.metricHeader}>
						<MaterialCommunityIcons name="emoticon-happy" size={30} color="#8b5cf6" />
						<Text style={styles.metricTitle}>Patient Satisfaction</Text>
					</View>
					<Text style={styles.metricValue}>{qualityMetrics.patientSatisfaction.score}%</Text>
					<Text style={styles.metricSubtext}>
						{qualityMetrics.patientSatisfaction.responseRate}% response rate
					</Text>
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Key Performance Indicators</Text>
				{kpiData.slice(0, 4).map(renderKPICard)}
			</View>
		</ScrollView>
	);

	const renderKPIsTab = () => (
		<ScrollView>
			<View style={styles.kpiFilters}>
				<TouchableOpacity
					style={[styles.filterButton, selectedPeriod === 'weekly' && styles.activeFilter]}
					onPress={() => setSelectedPeriod('weekly')}
				>
					<Text style={[styles.filterText, selectedPeriod === 'weekly' && styles.activeFilterText]}>
						Weekly
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.filterButton, selectedPeriod === 'monthly' && styles.activeFilter]}
					onPress={() => setSelectedPeriod('monthly')}
				>
					<Text style={[styles.filterText, selectedPeriod === 'monthly' && styles.activeFilterText]}>
						Monthly
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.filterButton, selectedPeriod === 'quarterly' && styles.activeFilter]}
					onPress={() => setSelectedPeriod('quarterly')}
				>
					<Text style={[styles.filterText, selectedPeriod === 'quarterly' && styles.activeFilterText]}>
						Quarterly
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.kpiGrid}>
				{kpiData.map(renderKPICard)}
			</View>
		</ScrollView>
	);

	const renderDepartmentsTab = () => (
		<ScrollView>
			{departmentKPIs.map((dept, index) => (
				<View key={index} style={styles.departmentCard}>
					<Text style={styles.departmentName}>{dept.department} Department</Text>
					<View style={styles.departmentKPIs}>
						{dept.kpis.map((kpi, kpiIndex) => (
							<View key={kpiIndex} style={styles.departmentKPI}>
								<View style={styles.departmentKPIHeader}>
									<Text style={styles.departmentKPIName}>{kpi.name}</Text>
									<View style={[styles.statusDot, { backgroundColor: statusColors[kpi.status] }]} />
								</View>
								<Text style={styles.departmentKPIValue}>{kpi.value}</Text>
								<Text style={styles.departmentKPITarget}>Target: {kpi.target}</Text>
							</View>
						))}
					</View>
				</View>
			))}
		</ScrollView>
	);

	const renderKPICard = (kpi) => (
		<TouchableOpacity
			key={kpi.id}
			style={styles.kpiCard}
			onPress={() => {
				setSelectedKPI(kpi);
				setShowKPIModal(true);
			}}
		>
			<View style={styles.kpiHeader}>
				<View style={styles.kpiInfo}>
					<Text style={styles.kpiName}>{kpi.name}</Text>
					<Text style={styles.kpiCategory}>{kpi.category}</Text>
				</View>
				<View style={styles.kpiStatus}>
					<MaterialCommunityIcons
						name={statusIcons[kpi.status]}
						size={24}
						color={statusColors[kpi.status]}
					/>
				</View>
			</View>
			<View style={styles.kpiMetrics}>
				<Text style={styles.kpiValue}>{kpi.value}</Text>
				<View style={styles.kpiTrend}>
					<MaterialCommunityIcons
						name={trendIcons[kpi.trend]}
						size={16}
						color={statusColors[kpi.status]}
					/>
					<Text style={styles.kpiTarget}>Target: {kpi.target}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);

	const renderKPIModal = () => (
		<Modal
			visible={showKPIModal}
			animationType="slide"
			presentationStyle="pageSheet"
		>
			<SafeAreaView style={styles.modalContainer}>
				<View style={styles.modalHeader}>
					<TouchableOpacity onPress={() => setShowKPIModal(false)}>
						<Ionicons name="close" size={24} color="#6b7280" />
					</TouchableOpacity>
					<Text style={styles.modalTitle}>KPI Details</Text>
					<View style={{ width: 24 }} />
				</View>

				{selectedKPI && (
					<ScrollView style={styles.modalContent}>
						<View style={styles.kpiDetailCard}>
							<View style={styles.kpiDetailHeader}>
								<MaterialCommunityIcons
									name={statusIcons[selectedKPI.status]}
									size={40}
									color={statusColors[selectedKPI.status]}
								/>
								<View style={styles.kpiDetailInfo}>
									<Text style={styles.kpiDetailName}>{selectedKPI.name}</Text>
									<Text style={styles.kpiDetailCategory}>{selectedKPI.category}</Text>
								</View>
							</View>

							<View style={styles.kpiMetricsDetail}>
								<View style={styles.metricDetailRow}>
									<Text style={styles.metricDetailLabel}>Current Value:</Text>
									<Text style={styles.metricDetailValue}>{selectedKPI.value}</Text>
								</View>
								<View style={styles.metricDetailRow}>
									<Text style={styles.metricDetailLabel}>Target:</Text>
									<Text style={styles.metricDetailValue}>{selectedKPI.target}</Text>
								</View>
								<View style={styles.metricDetailRow}>
									<Text style={styles.metricDetailLabel}>Status:</Text>
									<View style={styles.statusRow}>
										<View style={[styles.statusDot, { backgroundColor: statusColors[selectedKPI.status] }]} />
										<Text style={[styles.statusLabel, { color: statusColors[selectedKPI.status] }]}>
											{selectedKPI.status.toUpperCase()}
										</Text>
									</View>
								</View>
							</View>

							<View style={styles.kpiInfoSection}>
								<Text style={styles.infoSectionTitle}>Description</Text>
								<Text style={styles.infoText}>{selectedKPI.description}</Text>
							</View>

							<View style={styles.kpiInfoSection}>
								<Text style={styles.infoSectionTitle}>Ownership</Text>
								<Text style={styles.infoText}>Responsible: {selectedKPI.owner}</Text>
								<Text style={styles.infoText}>Last Updated: {selectedKPI.lastUpdated}</Text>
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
				<Text style={styles.headerTitle}>Quality Dashboard</Text>
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
					style={[styles.tab, currentTab === 'kpis' && styles.activeTab]}
					onPress={() => setCurrentTab('kpis')}
				>
					<Text style={[styles.tabText, currentTab === 'kpis' && styles.activeTabText]}>
						KPIs
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, currentTab === 'departments' && styles.activeTab]}
					onPress={() => setCurrentTab('departments')}
				>
					<Text style={[styles.tabText, currentTab === 'departments' && styles.activeTabText]}>
						Departments
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.content}>
				{currentTab === 'overview' && renderOverviewTab()}
				{currentTab === 'kpis' && renderKPIsTab()}
				{currentTab === 'departments' && renderDepartmentsTab()}
			</View>

			{renderKPIModal()}
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
		fontSize: 16,
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
	metricsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginBottom: 25,
	},
	metricCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		width: (width - 50) / 2,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	metricHeader: {
		alignItems: 'center',
		marginBottom: 15,
	},
	metricTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: '#6b7280',
		textAlign: 'center',
		marginTop: 8,
	},
	metricValue: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#1f2937',
		textAlign: 'center',
		marginBottom: 8,
	},
	metricSubtext: {
		fontSize: 12,
		color: '#6b7280',
		textAlign: 'center',
	},
	metricTrend: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	trendText: {
		fontSize: 12,
		fontWeight: '600',
		marginLeft: 4,
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
	kpiFilters: {
		flexDirection: 'row',
		marginBottom: 20,
		backgroundColor: 'white',
		borderRadius: 25,
		padding: 4,
	},
	filterButton: {
		flex: 1,
		paddingVertical: 12,
		alignItems: 'center',
		borderRadius: 20,
	},
	activeFilter: {
		backgroundColor: '#6366f1',
	},
	filterText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#6b7280',
	},
	activeFilterText: {
		color: 'white',
	},
	kpiGrid: {
		marginBottom: 20,
	},
	kpiCard: {
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
	kpiHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 15,
	},
	kpiInfo: {
		flex: 1,
	},
	kpiName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 4,
	},
	kpiCategory: {
		fontSize: 14,
		color: '#6b7280',
	},
	kpiStatus: {
		marginLeft: 10,
	},
	kpiMetrics: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	kpiValue: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1f2937',
	},
	kpiTrend: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	kpiTarget: {
		fontSize: 12,
		color: '#6b7280',
		marginLeft: 4,
	},
	departmentCard: {
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
	departmentName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 15,
	},
	departmentKPIs: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	departmentKPI: {
		width: '48%',
		marginBottom: 15,
	},
	departmentKPIHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	departmentKPIName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
		flex: 1,
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginLeft: 8,
	},
	departmentKPIValue: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 4,
	},
	departmentKPITarget: {
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
	modalContent: {
		flex: 1,
		padding: 20,
	},
	kpiDetailCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	kpiDetailHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 25,
		paddingBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	kpiDetailInfo: {
		marginLeft: 15,
		flex: 1,
	},
	kpiDetailName: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 4,
	},
	kpiDetailCategory: {
		fontSize: 16,
		color: '#6b7280',
	},
	kpiMetricsDetail: {
		marginBottom: 25,
	},
	metricDetailRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	metricDetailLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#6b7280',
	},
	metricDetailValue: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1f2937',
	},
	statusRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	statusLabel: {
		fontSize: 14,
		fontWeight: 'bold',
		marginLeft: 8,
	},
	kpiInfoSection: {
		marginBottom: 20,
	},
	infoSectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 10,
	},
	infoText: {
		fontSize: 15,
		color: '#4b5563',
		lineHeight: 22,
		marginBottom: 4,
	},
});

export default QualityDashboard;