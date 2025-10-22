import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
	Alert,
	SafeAreaView,
	Linking,
	TextInput,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const EmergencyContactsDirectory = (props) => {
	const [activeTab, setActiveTab] = useState('emergency');
	const [searchQuery, setSearchQuery] = useState('');

	// Emergency contacts for all hospitals
	const [emergencyContacts, setEmergencyContacts] = useState({
		police: [
			{
				id: 'POL001',
				name: 'Police Control Room',
				number: '112',
				type: 'Emergency',
				hospital: 'All',
				priority: 'critical'
			},
			{
				id: 'POL002',
				name: 'Sitaburdi Police Station',
				number: '0712-2560200',
				type: 'Local Police',
				hospital: 'Ayushman',
				priority: 'high'
			},
			{
				id: 'POL003',
				name: 'Panchpaoli Police Station',
				number: '0712-640367',
				type: 'Local Police',
				hospital: 'Hope',
				priority: 'high'
			},
			{
				id: 'POL004',
				name: 'Sadar Police Station',
				number: '0712-2560200',
				type: 'Local Police',
				hospital: 'Raftaar',
				priority: 'high'
			}
		],
		security: [
			{
				id: 'SEC001',
				name: 'Suraj Rajput',
				designation: 'In charge Security',
				number: '9373773132',
				hospital: 'Ayushman',
				priority: 'critical'
			},
			{
				id: 'SEC002',
				name: 'Suraj Rajput',
				designation: 'In charge Security',
				number: '9890230165',
				hospital: 'Hope',
				priority: 'critical'
			},
			{
				id: 'SEC003',
				name: 'Rahul',
				designation: 'Bouncer Manager',
				number: '9373773132',
				hospital: 'All Hospitals',
				priority: 'high'
			},
			{
				id: 'SEC004',
				name: 'Dilip Security Agency',
				designation: 'Security Agency',
				number: '9373601278',
				hospital: 'Hope',
				priority: 'medium'
			}
		],
		leadership: [
			{
				id: 'LEAD001',
				name: 'Gaurav Agrawal',
				designation: 'Finance & Administration',
				number: '+91 98765 43210',
				hospital: 'All',
				priority: 'critical'
			},
			{
				id: 'LEAD002',
				name: 'Abhishek',
				designation: 'Vice President',
				number: '+91 98765 43211',
				hospital: 'Hope',
				priority: 'high'
			},
			{
				id: 'LEAD003',
				name: 'Aman',
				designation: 'President / Incharge Raftaar',
				number: '+91 98765 43212',
				hospital: 'Raftaar',
				priority: 'high'
			}
		]
	});

	// Intercom directory for Hope Hospital
	const [intercomDirectory, setIntercomDirectory] = useState([
		{ id: 'INT001', department: 'Account Room', code: '601', floor: 'Ground Floor' },
		{ id: 'INT002', department: 'Doctor Chamber', code: '602', floor: 'Ground Floor' },
		{ id: 'INT003', department: 'Lab', code: '603', floor: 'Ground Floor' },
		{ id: 'INT004', department: 'Canteen', code: '604', floor: 'Ground Floor' },
		{ id: 'INT005', department: '2nd Floor', code: '605', floor: '2nd Floor' },
		{ id: 'INT006', department: 'X-Ray', code: '606', floor: 'Ground Floor' },
		{ id: 'INT007', department: 'OT (Operating Theatre)', code: '607', floor: '1st Floor' },
		{ id: 'INT008', department: 'Cath Lab', code: '608', floor: '1st Floor' },
		{ id: 'INT009', department: 'Pharmacy', code: '609', floor: 'Ground Floor' },
		{ id: 'INT010', department: 'Software', code: '610', floor: 'Ground Floor' },
		{ id: 'INT011', department: 'ICU 1st Floor', code: '611', floor: '1st Floor' },
		{ id: 'INT012', department: 'Reception', code: '612', floor: 'Ground Floor' },
		{ id: 'INT013', department: 'Dr. Murali Sir', code: '613', floor: '2nd Floor' },
		{ id: 'INT014', department: 'ICU 3rd Floor', code: '614', floor: '3rd Floor' },
		{ id: 'INT015', department: 'Billing', code: '615', floor: 'Ground Floor' },
		{ id: 'INT016', department: 'NephroPlus', code: '616', floor: '2nd Floor' }
	]);

	const makeCall = (number) => {
		const phoneNumber = `tel:${number}`;
		Linking.openURL(phoneNumber).catch(() => {
			Alert.alert('Error', 'Unable to make phone call');
		});
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'critical': return '#dc2626';
			case 'high': return '#f59e0b';
			case 'medium': return '#10b981';
			case 'low': return '#6b7280';
			default: return '#6b7280';
		}
	};

	const renderEmergencyContact = ({ item }) => (
		<TouchableOpacity
			style={[styles.contactCard, {
				borderLeftColor: getPriorityColor(item.priority),
				borderLeftWidth: 4
			}]}
			onPress={() => makeCall(item.number)}
		>
			<View style={styles.contactHeader}>
				<View style={styles.contactInfo}>
					<Text style={styles.contactName}>{item.name}</Text>
					{item.designation && (
						<Text style={styles.contactDesignation}>{item.designation}</Text>
					)}
					<Text style={styles.contactType}>{item.type || item.hospital}</Text>
				</View>
				<View style={styles.contactActions}>
					<View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
						<Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
					</View>
					<TouchableOpacity
						style={styles.callButton}
						onPress={() => makeCall(item.number)}
					>
						<MaterialIcons name="call" size={20} color="white" />
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.contactDetails}>
				<MaterialIcons name="phone" size={16} color="#6b7280" />
				<Text style={styles.contactNumber}>{item.number}</Text>
			</View>
		</TouchableOpacity>
	);

	const renderIntercomItem = ({ item }) => (
		<TouchableOpacity style={styles.intercomCard}>
			<View style={styles.intercomHeader}>
				<View style={styles.intercomInfo}>
					<Text style={styles.intercomDepartment}>{item.department}</Text>
					<Text style={styles.intercomFloor}>{item.floor}</Text>
				</View>
				<View style={styles.intercomCode}>
					<Text style={styles.codeLabel}>Code</Text>
					<Text style={styles.codeNumber}>{item.code}</Text>
				</View>
			</View>
			<TouchableOpacity
				style={styles.dialButton}
				onPress={() => Alert.alert(
					'Dial Intercom',
					`Dial ${item.code} to connect to ${item.department}`,
					[
						{ text: 'OK' },
						{ text: 'Call Reception', onPress: () => makeCall('612') }
					]
				)}
			>
				<MaterialCommunityIcons name="phone-dial" size={16} color="#10b981" />
				<Text style={styles.dialText}>Dial {item.code}</Text>
			</TouchableOpacity>
		</TouchableOpacity>
	);

	const filteredEmergencyContacts = () => {
		const allContacts = [
			...emergencyContacts.police,
			...emergencyContacts.security,
			...emergencyContacts.leadership
		];
		return allContacts.filter(contact =>
			contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			contact.number.includes(searchQuery) ||
			(contact.designation && contact.designation.toLowerCase().includes(searchQuery.toLowerCase()))
		);
	};

	const filteredIntercomContacts = () => {
		return intercomDirectory.filter(item =>
			item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.code.includes(searchQuery) ||
			item.floor.toLowerCase().includes(searchQuery.toLowerCase())
		);
	};

	const renderQuickActions = () => (
		<View style={styles.quickActionsContainer}>
			<Text style={styles.quickActionsTitle}>🚨 Quick Emergency Actions</Text>
			<View style={styles.quickActionsGrid}>
				<TouchableOpacity
					style={[styles.quickActionButton, { backgroundColor: '#dc2626' }]}
					onPress={() => makeCall('112')}
				>
					<MaterialIcons name="emergency" size={30} color="white" />
					<Text style={styles.quickActionText}>Police 112</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.quickActionButton, { backgroundColor: '#f59e0b' }]}
					onPress={() => makeCall('9373773132')}
				>
					<MaterialCommunityIcons name="security" size={30} color="white" />
					<Text style={styles.quickActionText}>Security</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.quickActionButton, { backgroundColor: '#10b981' }]}
					onPress={() => makeCall('612')}
				>
					<MaterialCommunityIcons name="phone-dial" size={30} color="white" />
					<Text style={styles.quickActionText}>Reception</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.quickActionButton, { backgroundColor: '#8b5cf6' }]}
					onPress={() => makeCall('613')}
				>
					<MaterialCommunityIcons name="doctor" size={30} color="white" />
					<Text style={styles.quickActionText}>Dr. Murali</Text>
				</TouchableOpacity>
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
				<Text style={styles.headerTitle}>Emergency Contacts & Intercom</Text>
				<TouchableOpacity
					style={styles.sosButton}
					onPress={() => makeCall('112')}
				>
					<MaterialIcons name="emergency" size={24} color="white" />
				</TouchableOpacity>
			</View>

			{/* Tab Navigation */}
			<View style={styles.tabContainer}>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'emergency' && styles.activeTab]}
					onPress={() => setActiveTab('emergency')}
				>
					<MaterialIcons name="emergency" size={20} color={activeTab === 'emergency' ? '#dc2626' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'emergency' && styles.activeTabText
					]}>
						Emergency Contacts
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'intercom' && styles.activeTab]}
					onPress={() => setActiveTab('intercom')}
				>
					<MaterialCommunityIcons name="phone-dial" size={20} color={activeTab === 'intercom' ? '#10b981' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'intercom' && styles.activeTabText
					]}>
						Intercom Directory
					</Text>
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content}>
				{/* Quick Actions */}
				{renderQuickActions()}

				{/* Search Bar */}
				<View style={styles.searchContainer}>
					<MaterialIcons name="search" size={24} color="#6b7280" />
					<TextInput
						style={styles.searchInput}
						placeholder={activeTab === 'emergency' ? "Search emergency contacts..." : "Search intercom directory..."}
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
					{searchQuery.length > 0 && (
						<TouchableOpacity onPress={() => setSearchQuery('')}>
							<MaterialIcons name="clear" size={24} color="#6b7280" />
						</TouchableOpacity>
					)}
				</View>

				{activeTab === 'emergency' && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Emergency Contacts Directory</Text>
						<Text style={styles.sectionSubtitle}>
							📞 Tap any contact to make a direct call
						</Text>
						<FlatList
							data={filteredEmergencyContacts()}
							renderItem={renderEmergencyContact}
							keyExtractor={item => item.id}
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
							ListEmptyComponent={
								<View style={styles.emptyState}>
									<MaterialIcons name="phone-disabled" size={64} color="#9ca3af" />
									<Text style={styles.emptyStateText}>No contacts found</Text>
									<Text style={styles.emptyStateSubtext}>
										Try adjusting your search criteria
									</Text>
								</View>
							}
						/>

						{/* Important Notes */}
						<View style={styles.notesContainer}>
							<Text style={styles.notesTitle}>📌 Important Guidelines</Text>
							<Text style={styles.noteText}>
								• Emergency contacts must be displayed prominently on each floor
							</Text>
							<Text style={styles.noteText}>
								• In case of mob/disturbance: Contact police first, then inform Suraj and Rahul
							</Text>
							<Text style={styles.noteText}>
								• All staff should save security agency owner's number
							</Text>
							<Text style={styles.noteText}>
								• Guards should use intercom to contact leadership, not leave position
							</Text>
						</View>
					</View>
				)}

				{activeTab === 'intercom' && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Hope Hospital - Intercom Directory</Text>
						<Text style={styles.sectionSubtitle}>
							📞 Internal communication system
						</Text>
						<FlatList
							data={filteredIntercomContacts()}
							renderItem={renderIntercomItem}
							keyExtractor={item => item.id}
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
							ListEmptyComponent={
								<View style={styles.emptyState}>
									<MaterialCommunityIcons name="phone-off" size={64} color="#9ca3af" />
									<Text style={styles.emptyStateText}>No intercom numbers found</Text>
									<Text style={styles.emptyStateSubtext}>
										Try adjusting your search criteria
									</Text>
								</View>
							}
						/>

						{/* Intercom Usage Guidelines */}
						<View style={styles.notesContainer}>
							<Text style={styles.notesTitle}>📞 Intercom Usage Guidelines</Text>
							<Text style={styles.noteText}>
								• All staff should know intercom numbers by heart
							</Text>
							<Text style={styles.noteText}>
								• Use intercom to contact departments without leaving your position
							</Text>
							<Text style={styles.noteText}>
								• For visitor inquiries about leadership, use intercom instead of walking
							</Text>
							<Text style={styles.noteText}>
								• Reception (612) is the main hub for all communications
							</Text>
						</View>
					</View>
				)}
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
		backgroundColor: '#dc2626',
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
	},
	backButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: 'white',
		textAlign: 'center',
		flex: 1,
	},
	sosButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	tabContainer: {
		flexDirection: 'row',
		backgroundColor: 'white',
		marginHorizontal: 20,
		marginTop: 20,
		borderRadius: 12,
		padding: 4,
	},
	tab: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		borderRadius: 8,
	},
	activeTab: {
		backgroundColor: '#fee2e2',
	},
	tabText: {
		fontSize: 12,
		color: '#6b7280',
		marginLeft: 5,
		fontWeight: '500',
	},
	activeTabText: {
		color: '#dc2626',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	quickActionsContainer: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	quickActionsTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 15,
	},
	quickActionsGrid: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	quickActionButton: {
		alignItems: 'center',
		padding: 15,
		borderRadius: 12,
		flex: 0.23,
	},
	quickActionText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
		marginTop: 5,
		textAlign: 'center',
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 12,
		paddingHorizontal: 15,
		paddingVertical: 12,
		marginBottom: 20,
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
	section: {
		marginBottom: 25,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 5,
	},
	sectionSubtitle: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 15,
	},
	contactCard: {
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
	contactHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	contactInfo: {
		flex: 1,
		marginRight: 10,
	},
	contactName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	contactDesignation: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 2,
	},
	contactType: {
		fontSize: 12,
		color: '#10b981',
	},
	contactActions: {
		alignItems: 'flex-end',
	},
	priorityBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginBottom: 8,
	},
	priorityText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
	},
	callButton: {
		backgroundColor: '#10b981',
		padding: 8,
		borderRadius: 20,
	},
	contactDetails: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	contactNumber: {
		fontSize: 16,
		color: '#1f2937',
		marginLeft: 8,
		fontWeight: '500',
	},
	intercomCard: {
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
	intercomHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	intercomInfo: {
		flex: 1,
	},
	intercomDepartment: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	intercomFloor: {
		fontSize: 14,
		color: '#6b7280',
	},
	intercomCode: {
		alignItems: 'center',
	},
	codeLabel: {
		fontSize: 12,
		color: '#6b7280',
	},
	codeNumber: {
		fontSize: 20,
		fontWeight: '700',
		color: '#10b981',
	},
	dialButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f0fdf4',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		alignSelf: 'flex-start',
	},
	dialText: {
		fontSize: 12,
		color: '#10b981',
		marginLeft: 5,
		fontWeight: '500',
	},
	notesContainer: {
		backgroundColor: '#fef3c7',
		padding: 15,
		borderRadius: 12,
		marginTop: 20,
	},
	notesTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#92400e',
		marginBottom: 10,
	},
	noteText: {
		fontSize: 14,
		color: '#92400e',
		marginBottom: 5,
		lineHeight: 20,
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

export default EmergencyContactsDirectory;