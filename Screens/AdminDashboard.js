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
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const AdminDashboard = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	const [dashboardData, setDashboardData] = useState({
		totalUsers: 247,
		activeStaff: 45,
		monthlyRevenue: 2450000,
		userBreakdown: [
			{ role: 'Doctors', count: 15, color: '#6366f1' },
			{ role: 'Nurses', count: 28, color: '#f59e0b' },
			{ role: 'Lab Tech', count: 8, color: '#8b5cf6' },
			{ role: 'Pharmacy', count: 6, color: '#ef4444' },
			{ role: 'Billing', count: 4, color: '#06b6d4' },
			{ role: 'Reception', count: 3, color: '#84cc16' },
			{ role: 'Patients', count: 183, color: '#10b981' },
		],
		systemAlerts: [
			{ id: '1', type: 'Security', message: 'Failed login attempts detected', severity: 'High', time: '2 min ago' },
			{ id: '2', type: 'System', message: 'Database backup completed', severity: 'Info', time: '1 hour ago' },
			{ id: '3', type: 'Performance', message: 'Server response time increased', severity: 'Medium', time: '3 hours ago' },
		],
		departmentStats: [
			{ id: '1', name: 'Cardiology', revenue: 450000, patients: 89, staff: 8 },
			{ id: '2', name: 'Orthopedics', revenue: 380000, patients: 76, staff: 6 },
			{ id: '3', name: 'Neurology', revenue: 320000, patients: 54, staff: 5 },
			{ id: '4', name: 'Emergency', revenue: 280000, patients: 112, staff: 12 },
		],
		recentActivities: [
			{ id: '1', user: 'Dr. Sharma', action: 'Updated patient record', time: '10 min ago' },
			{ id: '2', user: 'Nurse Priya', action: 'Recorded vital signs', time: '15 min ago' },
			{ id: '3', user: 'Admin Singh', action: 'Created new user account', time: '30 min ago' },
		]
	});

	const renderStatCard = (title, value, icon, color, prefix = '', onPress) => (
		<TouchableOpacity style={[styles.statCard, { backgroundColor: color }]} onPress={onPress}>
			<View style={styles.statIconContainer}>
				<MaterialIcons name={icon} size={24} color="white" />
			</View>
			<Text style={styles.statValue}>{prefix}{value}</Text>
			<Text style={styles.statTitle}>{title}</Text>
		</TouchableOpacity>
	);

	const renderUserRoleItem = ({ item }) => (
		<View style={styles.userRoleItem}>
			<View style={[styles.roleColorIndicator, { backgroundColor: item.color }]} />
			<View style={styles.roleInfo}>
				<Text style={styles.roleName}>{item.role}</Text>
				<Text style={styles.roleCount}>{item.count} users</Text>
			</View>
		</View>
	);

	const renderAlertItem = ({ item }) => (
		<View style={styles.alertItem}>
			<View style={styles.alertHeader}>
				<View style={styles.alertTypeContainer}>
					<Text style={styles.alertType}>{item.type}</Text>
					<View style={[styles.severityBadge, {
						backgroundColor: item.severity === 'High' ? '#dc2626' :
										item.severity === 'Medium' ? '#f59e0b' : '#10b981'
					}]}>
						<Text style={styles.severityText}>{item.severity}</Text>
					</View>
				</View>
				<Text style={styles.alertTime}>{item.time}</Text>
			</View>
			<Text style={styles.alertMessage}>{item.message}</Text>
		</View>
	);

	const renderDepartmentStatsItem = ({ item }) => (
		<View style={styles.departmentStatsItem}>
			<Text style={styles.departmentStatsName}>{item.name}</Text>
			<View style={styles.departmentStatsGrid}>
				<View style={styles.departmentStat}>
					<Text style={styles.departmentStatValue}>₹{(item.revenue / 1000).toFixed(0)}k</Text>
					<Text style={styles.departmentStatLabel}>Revenue</Text>
				</View>
				<View style={styles.departmentStat}>
					<Text style={styles.departmentStatValue}>{item.patients}</Text>
					<Text style={styles.departmentStatLabel}>Patients</Text>
				</View>
				<View style={styles.departmentStat}>
					<Text style={styles.departmentStatValue}>{item.staff}</Text>
					<Text style={styles.departmentStatLabel}>Staff</Text>
				</View>
			</View>
		</View>
	);

	const renderActivityItem = ({ item }) => (
		<View style={styles.activityItem}>
			<View style={styles.activityContent}>
				<Text style={styles.activityUser}>{item.user}</Text>
				<Text style={styles.activityAction}>{item.action}</Text>
			</View>
			<Text style={styles.activityTime}>{item.time}</Text>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Admin Dashboard</Text>
				<TouchableOpacity style={styles.settingsButton}>
					<MaterialIcons name="settings" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Statistics Cards */}
				<View style={styles.statsContainer}>
					{renderStatCard('Total Users', dashboardData.totalUsers, 'people', '#1f2937', '', () =>
						alert('Total Users Breakdown:\n\n• 15 Doctors\n• 28 Nurses\n• 8 Lab Technicians\n• 6 Pharmacy Staff\n• 4 Billing Staff\n• 3 Reception\n• 183 Patients\n\nTotal: 247 users\nActive today: 45 users')
					)}
					{renderStatCard('Active Staff', dashboardData.activeStaff, 'work', '#10b981', '', () =>
						alert('Active Staff Details:\n\n• Currently logged in: 45\n• On duty: 38\n• On break: 7\n• Average session: 6.5 hours\n\nPeak hours: 9 AM - 2 PM\nStaff utilization: 85%')
					)}
					{renderStatCard('System Alerts', dashboardData.systemAlerts.length, 'warning', '#ef4444', '', () =>
						Alert.alert(
							'System Alerts',
							'View alert details:',
							[
								{text: 'Security Alert', onPress: () => alert('Security Alert:\n\n• Failed login attempts detected\n• IP: 192.168.1.100\n• Attempts: 5\n• User: admin\n• Time: 2 min ago\n\nAction: Account temporarily locked')},
								{text: 'System Status', onPress: () => alert('System Information:\n\n• Database backup completed\n• Time: 1 hour ago\n• Size: 2.3 GB\n• Status: Successful\n• Next backup: Tomorrow 3:00 AM')},
								{text: 'Performance', onPress: () => alert('Performance Alert:\n\n• Server response time increased\n• Current: 1.8s (normal: 1.2s)\n• Cause: High database load\n• Action: Optimization recommended\n• Time: 3 hours ago')},
								{text: 'Close', style: 'cancel'}
							]
						)
					)}
					{renderStatCard('Monthly Revenue', (dashboardData.monthlyRevenue / 100000).toFixed(1) + 'L', 'trending-up', '#6366f1', '₹', () =>
						alert('Monthly Revenue Analysis:\n\n• Total: ₹24,50,000\n• Target: ₹22,00,000 (111%)\n• Growth: +12% vs last month\n\nBreakdown:\n• OPD: ₹12,50,000 (51%)\n• IPD: ₹8,00,000 (33%)\n• Pharmacy: ₹2,50,000 (10%)\n• Lab: ₹1,50,000 (6%)')
					)}
				</View>

				{/* User Role Breakdown */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>User Distribution</Text>
					<FlatList
						data={dashboardData.userBreakdown}
						renderItem={renderUserRoleItem}
						keyExtractor={(item, index) => index.toString()}
						scrollEnabled={false}
						numColumns={2}
						columnWrapperStyle={styles.userRoleRow}
					/>
				</View>

				{/* System Alerts */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>System Alerts</Text>
						<TouchableOpacity
							style={styles.viewAllButton}
							onPress={() => {
								Alert.alert(
									'All System Alerts',
									'View all alert categories:',
									[
										{text: 'Security Alerts (1)', onPress: () => alert('Security Alerts:\n\n1. Failed login attempts detected\n   • IP: 192.168.1.100\n   • User: admin\n   • Time: 2 min ago\n   • Status: Active\n\n• No other security issues\n• Last security scan: Today')},
										{text: 'System Status (1)', onPress: () => alert('System Status Alerts:\n\n1. Database backup completed\n   • Time: 1 hour ago\n   • Size: 2.3 GB\n   • Status: Success\n\n• Server uptime: 99.8%\n• Last maintenance: 3 days ago')},
										{text: 'Performance (1)', onPress: () => alert('Performance Alerts:\n\n1. Server response time increased\n   • Current: 1.8s\n   • Normal: 1.2s\n   • Time: 3 hours ago\n   • Action: Optimization needed\n\n• Database load: 78%\n• Memory usage: 72%')},
										{text: 'Alert Settings', onPress: () => alert('Alert Configuration:\n\n• Email notifications: Enabled\n• SMS alerts: Enabled for critical\n• Alert threshold: Medium and above\n• Recipients: 3 administrators\n\nLast alert sent: 2 min ago')},
										{text: 'Close', style: 'cancel'}
									]
								)
							}}
						>
							<Text style={styles.viewAllText}>View All</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={dashboardData.systemAlerts}
						renderItem={renderAlertItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
					/>
				</View>

				{/* Department Performance */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Department Performance</Text>
					<FlatList
						data={dashboardData.departmentStats}
						renderItem={renderDepartmentStatsItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
					/>
				</View>

				{/* Recent Activities */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Recent Activities</Text>
					<FlatList
						data={dashboardData.recentActivities}
						renderItem={renderActivityItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
					/>
				</View>

				{/* Quick Actions */}
				<View style={styles.quickActions}>
					<Text style={styles.sectionTitle}>System Management</Text>
					<View style={styles.actionGrid}>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								Alert.alert(
									'User Management',
									'Select an action:',
									[
										{text: 'View All Users', onPress: () => alert('Showing 247 registered users:\n• 15 Doctors\n• 28 Nurses\n• 8 Lab Technicians\n• 6 Pharmacy Staff\n• 4 Billing Staff\n• 3 Reception\n• 183 Patients')},
										{text: 'Add New User', onPress: () => alert('New user registration form would open here')},
										{text: 'User Permissions', onPress: () => alert('User role and permission management would open here')},
										{text: 'Cancel', style: 'cancel'}
									]
								)
							}}
						>
							<MaterialIcons name="people" size={30} color="#1f2937" />
							<Text style={styles.actionText}>User Management</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								Alert.alert(
									'System Settings',
									'Select a setting category:',
									[
										{text: 'Hospital Info', onPress: () => alert('Hospital Information:\n• Name: Hope Hospital\n• Address: Medical District\n• Phone: +91 98765 43210\n• Email: info@hopehospital.com')},
										{text: 'Security Settings', onPress: () => alert('Security Configuration:\n• Password Policy: Strong\n• Session Timeout: 30 minutes\n• Two-Factor Auth: Enabled\n• Login Attempts: 3 max')},
										{text: 'System Config', onPress: () => alert('System Configuration:\n• Database: Connected\n• Server Status: Online\n• Last Update: Today\n• Version: 2.1.0')},
										{text: 'Cancel', style: 'cancel'}
									]
								)
							}}
						>
							<MaterialIcons name="settings" size={30} color="#1f2937" />
							<Text style={styles.actionText}>System Settings</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								Alert.alert(
									'Admin Reports',
									'Select a report type:',
									[
										{text: 'User Activity', onPress: () => alert('User Activity Report:\n• Active Sessions: 45\n• Today\'s Logins: 127\n• Failed Attempts: 3\n• Peak Usage: 2:30 PM')},
										{text: 'System Performance', onPress: () => alert('System Performance:\n• CPU Usage: 68%\n• Memory Usage: 72%\n• Storage Used: 45%\n• Response Time: 1.2s avg')},
										{text: 'Department Stats', onPress: () => alert('Department Statistics:\n• Cardiology: 89 patients\n• Orthopedics: 76 patients\n• Neurology: 54 patients\n• Emergency: 112 patients')},
										{text: 'Cancel', style: 'cancel'}
									]
								)
							}}
						>
							<MaterialIcons name="assessment" size={30} color="#1f2937" />
							<Text style={styles.actionText}>Reports</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								Alert.alert(
									'System Backup',
									'Choose backup type:',
									[
										{text: 'Quick Backup', onPress: () => {
											alert('Quick backup initiated...\n\n✓ User data backed up\n✓ Patient records backed up\n✓ Settings backed up\n\nBackup completed successfully!\nLocation: /backups/quick_' + new Date().toISOString().split('T')[0])
										}},
										{text: 'Full System Backup', onPress: () => {
											alert('Full system backup initiated...\n\nThis may take 15-20 minutes.\n\n✓ Database backup started\n✓ File system backup started\n✓ Configuration backup started\n\nBackup will complete in background.\nNotification will be sent when done.')
										}},
										{text: 'Schedule Backup', onPress: () => alert('Backup Scheduler:\n\n• Daily backups: Enabled (3:00 AM)\n• Weekly full backup: Enabled (Sunday 1:00 AM)\n• Retention period: 30 days\n• Auto-cleanup: Enabled')},
										{text: 'Cancel', style: 'cancel'}
									]
								)
							}}
						>
							<MaterialIcons name="backup" size={30} color="#1f2937" />
							<Text style={styles.actionText}>Backup System</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to FeedbackAnalytics...');
									props.navigation.navigate('FeedbackAnalytics');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialIcons name="analytics" size={30} color="#6366f1" />
							<Text style={styles.actionText}>Feedback Analytics</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to MorningHuddle...');
									props.navigation.navigate('MorningHuddle');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialCommunityIcons name="account-group" size={30} color="#06b6d4" />
							<Text style={styles.actionText}>Morning Huddle</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to MarketingDashboard...');
									props.navigation.navigate('MarketingDashboard');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialCommunityIcons name="bullhorn" size={30} color="#f59e0b" />
							<Text style={styles.actionText}>Marketing</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to LeadershipTeam...');
									props.navigation.navigate('LeadershipTeam');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialCommunityIcons name="account-star" size={30} color="#8b5cf6" />
							<Text style={styles.actionText}>Leadership</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to QualityDashboard...');
									props.navigation.navigate('QualityDashboard');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialCommunityIcons name="clipboard-check" size={30} color="#10b981" />
							<Text style={styles.actionText}>Quality KPIs</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to NABHAccreditation...');
									props.navigation.navigate('NABHAccreditation');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialCommunityIcons name="certificate" size={30} color="#dc2626" />
							<Text style={styles.actionText}>NABH</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to SOPManagement...');
									props.navigation.navigate('SOPManagement');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialCommunityIcons name="file-document-multiple" size={30} color="#0ea5e9" />
							<Text style={styles.actionText}>SOPs</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to DailyAccountingSOP...');
									props.navigation.navigate('DailyAccountingSOP');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialCommunityIcons name="calculator" size={30} color="#10b981" />
							<Text style={styles.actionText}>Daily Accounting</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to PatientWiseReconciliation...');
									props.navigation.navigate('PatientWiseReconciliation');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialCommunityIcons name="file-search" size={30} color="#f59e0b" />
							<Text style={styles.actionText}>Reconciliation</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to StaffTrainingModule...');
									props.navigation.navigate('StaffTrainingModule');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialCommunityIcons name="school" size={30} color="#8b5cf6" />
							<Text style={styles.actionText}>Staff Training</Text>
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
		fontSize: 24,
		fontWeight: '700',
		color: 'white',
	},
	settingsButton: {
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
		fontSize: 20,
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
		backgroundColor: '#1f2937',
		borderRadius: 12,
	},
	viewAllText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	userRoleRow: {
		justifyContent: 'space-between',
	},
	userRoleItem: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		width: '48%',
		flexDirection: 'row',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	roleColorIndicator: {
		width: 8,
		height: 40,
		borderRadius: 4,
		marginRight: 12,
	},
	roleInfo: {
		flex: 1,
	},
	roleName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
	},
	roleCount: {
		fontSize: 12,
		color: '#6b7280',
		marginTop: 2,
	},
	alertItem: {
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
	alertHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	alertTypeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	alertType: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
		marginRight: 8,
	},
	severityBadge: {
		paddingHorizontal: 6,
		paddingVertical: 3,
		borderRadius: 6,
	},
	severityText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
	},
	alertTime: {
		fontSize: 12,
		color: '#6b7280',
	},
	alertMessage: {
		fontSize: 14,
		color: '#374151',
	},
	departmentStatsItem: {
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
	departmentStatsName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 10,
	},
	departmentStatsGrid: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	departmentStat: {
		alignItems: 'center',
		flex: 1,
	},
	departmentStatValue: {
		fontSize: 16,
		fontWeight: '700',
		color: '#1f2937',
	},
	departmentStatLabel: {
		fontSize: 12,
		color: '#6b7280',
		marginTop: 2,
	},
	activityItem: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	activityContent: {
		flex: 1,
	},
	activityUser: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
	},
	activityAction: {
		fontSize: 14,
		color: '#6b7280',
		marginTop: 2,
	},
	activityTime: {
		fontSize: 12,
		color: '#6b7280',
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

export default AdminDashboard;