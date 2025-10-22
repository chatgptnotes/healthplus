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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const ReceptionDashboard = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	const [dashboardData, setDashboardData] = useState({
		todaysAppointments: 45,
		walkIns: 12,
		registrations: 8,
		waitingPatients: 15,
		appointmentQueue: [
			{ id: '1', patient: 'Sanya Gupta', doctor: 'Dr. Sharma', time: '10:30 AM', status: 'Waiting', type: 'Consultation' },
			{ id: '2', patient: 'Mukesh Jain', doctor: 'Dr. Agarwal', time: '10:45 AM', status: 'In Progress', type: 'Follow-up' },
			{ id: '3', patient: 'Ekta Singh', doctor: 'Dr. Verma', time: '11:00 AM', status: 'Scheduled', type: 'Check-up' },
		],
		recentRegistrations: [
			{ id: '1', name: 'Amit Yadav', phone: '+91 98765 43210', time: '9:30 AM', type: 'New Patient' },
			{ id: '2', name: 'Lakshmi Patel', phone: '+91 87654 32109', time: '9:15 AM', type: 'Emergency' },
		],
		departmentStatus: [
			{ id: '1', name: 'Cardiology', waitTime: '15 min', patients: 8, status: 'Normal' },
			{ id: '2', name: 'Orthopedics', waitTime: '25 min', patients: 12, status: 'Busy' },
			{ id: '3', name: 'Neurology', waitTime: '10 min', patients: 6, status: 'Normal' },
			{ id: '4', name: 'Emergency', waitTime: '5 min', patients: 3, status: 'Available' },
		]
	});

	const renderStatCard = (title, value, icon, color) => (
		<TouchableOpacity style={[styles.statCard, { backgroundColor: color }]}>
			<View style={styles.statIconContainer}>
				<MaterialIcons name={icon} size={24} color="white" />
			</View>
			<Text style={styles.statValue}>{value}</Text>
			<Text style={styles.statTitle}>{title}</Text>
		</TouchableOpacity>
	);

	const renderAppointmentItem = ({ item }) => (
		<View style={styles.listItem}>
			<View style={styles.listItemHeader}>
				<View>
					<Text style={styles.patientName}>{item.patient}</Text>
					<Text style={styles.doctorName}>Dr: {item.doctor}</Text>
					<Text style={styles.appointmentType}>{item.type}</Text>
				</View>
				<View style={styles.timeContainer}>
					<Text style={styles.appointmentTime}>{item.time}</Text>
					<View style={[styles.statusBadge, {
						backgroundColor: item.status === 'Waiting' ? '#f59e0b' :
										item.status === 'In Progress' ? '#10b981' : '#6366f1'
					}]}>
						<Text style={styles.statusText}>{item.status}</Text>
					</View>
				</View>
			</View>
		</View>
	);

	const renderRegistrationItem = ({ item }) => (
		<View style={styles.registrationItem}>
			<View style={styles.registrationHeader}>
				<Text style={styles.registrationName}>{item.name}</Text>
				<Text style={styles.registrationTime}>{item.time}</Text>
			</View>
			<Text style={styles.registrationPhone}>{item.phone}</Text>
			<View style={[styles.registrationTypeBadge, {
				backgroundColor: item.type === 'Emergency' ? '#dc2626' : '#10b981'
			}]}>
				<Text style={styles.registrationTypeText}>{item.type}</Text>
			</View>
		</View>
	);

	const renderDepartmentItem = ({ item }) => (
		<View style={styles.departmentItem}>
			<View style={styles.departmentHeader}>
				<Text style={styles.departmentName}>{item.name}</Text>
				<View style={[styles.departmentStatusBadge, {
					backgroundColor: item.status === 'Available' ? '#10b981' :
									item.status === 'Normal' ? '#6366f1' : '#f59e0b'
				}]}>
					<Text style={styles.departmentStatusText}>{item.status}</Text>
				</View>
			</View>
			<View style={styles.departmentStats}>
				<Text style={styles.departmentWait}>Wait: {item.waitTime}</Text>
				<Text style={styles.departmentPatients}>{item.patients} patients</Text>
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Reception Desk</Text>
				<TouchableOpacity style={styles.callButton}>
					<MaterialIcons name="phone" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Statistics Cards */}
				<View style={styles.statsContainer}>
					{renderStatCard('Today\'s Appointments', dashboardData.todaysAppointments, 'event', '#84cc16')}
					{renderStatCard('Walk-ins', dashboardData.walkIns, 'directions-walk', '#f59e0b')}
					{renderStatCard('New Registrations', dashboardData.registrations, 'person-add', '#10b981')}
					{renderStatCard('Waiting Patients', dashboardData.waitingPatients, 'hourglass-empty', '#ef4444')}
				</View>

				{/* Appointment Queue */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Appointment Queue</Text>
						<TouchableOpacity style={styles.viewAllButton}>
							<Text style={styles.viewAllText}>View All</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={dashboardData.appointmentQueue}
						renderItem={renderAppointmentItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
					/>
				</View>

				{/* Recent Registrations */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Recent Registrations</Text>
					<FlatList
						data={dashboardData.recentRegistrations}
						renderItem={renderRegistrationItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
					/>
				</View>

				{/* Department Status */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Department Status</Text>
					<FlatList
						data={dashboardData.departmentStatus}
						renderItem={renderDepartmentItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
						numColumns={2}
						columnWrapperStyle={styles.departmentRow}
					/>
				</View>

				{/* Quick Actions */}
				<View style={styles.quickActions}>
					<Text style={styles.sectionTitle}>Quick Actions</Text>
					<View style={styles.actionGrid}>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to PatientRegistration...');
									props.navigation.navigate('PatientRegistration');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialIcons name="person-add" size={30} color="#84cc16" />
							<Text style={styles.actionText}>New Registration</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to appointments...');
									props.navigation.navigate('appointments');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialIcons name="event" size={30} color="#84cc16" />
							<Text style={styles.actionText}>Book Appointment</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to PatientSearch...');
									props.navigation.navigate('PatientSearch');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialIcons name="search" size={30} color="#84cc16" />
							<Text style={styles.actionText}>Find Patient</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									alert('Emergency Alert sent to all medical staff!');
								} catch (error) {
									console.error('Emergency alert error:', error);
									alert('Alert error: ' + error.message);
								}
							}}
						>
							<MaterialIcons name="emergency" size={30} color="#84cc16" />
							<Text style={styles.actionText}>Emergency Alert</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to PatientFeedback...');
									props.navigation.navigate('PatientFeedback');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialIcons name="feedback" size={30} color="#06b6d4" />
							<Text style={styles.actionText}>Patient Feedback</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								try {
									console.log('Navigating to DigitalConsent...');
									props.navigation.navigate('DigitalConsent');
								} catch (error) {
									console.error('Navigation error:', error);
									alert('Navigation error: ' + error.message);
								}
							}}
						>
							<MaterialCommunityIcons name="file-document-edit" size={30} color="#8b5cf6" />
							<Text style={styles.actionText}>Digital Consent</Text>
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
		backgroundColor: '#84cc16',
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
	callButton: {
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
		backgroundColor: '#84cc16',
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
		alignItems: 'flex-start',
	},
	patientName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	doctorName: {
		fontSize: 14,
		color: '#6b7280',
		marginTop: 2,
	},
	appointmentType: {
		fontSize: 12,
		color: '#374151',
		marginTop: 4,
	},
	timeContainer: {
		alignItems: 'flex-end',
	},
	appointmentTime: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 4,
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
	registrationItem: {
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
	registrationHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	registrationName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	registrationTime: {
		fontSize: 12,
		color: '#6b7280',
	},
	registrationPhone: {
		fontSize: 14,
		color: '#374151',
		marginBottom: 8,
	},
	registrationTypeBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		alignSelf: 'flex-start',
	},
	registrationTypeText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	departmentRow: {
		justifyContent: 'space-between',
	},
	departmentItem: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		width: '48%',
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
		marginBottom: 8,
	},
	departmentName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
	},
	departmentStatusBadge: {
		paddingHorizontal: 6,
		paddingVertical: 3,
		borderRadius: 6,
	},
	departmentStatusText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
	},
	departmentStats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	departmentWait: {
		fontSize: 12,
		color: '#f59e0b',
		fontWeight: '500',
	},
	departmentPatients: {
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

export default ReceptionDashboard;