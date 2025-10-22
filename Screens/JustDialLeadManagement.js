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
	TextInput,
	Modal,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const JustDialLeadManagement = (props) => {
	const [activeTab, setActiveTab] = useState('dashboard');
	const [currentTime, setCurrentTime] = useState(new Date());
	const [showScriptModal, setShowScriptModal] = useState(false);

	// JustDial leads data
	const [leads, setLeads] = useState([
		{
			id: 'JD001',
			name: 'राजेश कुमार',
			phone: '9876543210',
			category: 'Orthopedics',
			hospital: 'Hope',
			status: 'New',
			receivedTime: '10:30 AM',
			responseTime: null,
			tatStatus: 'Pending',
			priority: 'High',
			notes: ''
		},
		{
			id: 'JD002',
			name: 'प्रिया शर्मा',
			phone: '9876543211',
			category: 'Gastroenterology',
			hospital: 'Ayushman',
			status: 'Responded',
			receivedTime: '10:15 AM',
			responseTime: '10:17 AM',
			tatStatus: 'Within TAT',
			priority: 'Medium',
			notes: 'Appointment confirmed for tomorrow 2 PM'
		},
		{
			id: 'JD003',
			name: 'अमित सिंह',
			phone: '9876543212',
			category: 'Ambulance Service',
			hospital: 'Raftaar',
			status: 'Missed',
			receivedTime: '09:45 AM',
			responseTime: null,
			tatStatus: 'Overdue',
			priority: 'Critical',
			notes: 'Emergency call - need to follow up immediately'
		}
	]);

	// Doctor availability schedule
	const [doctorSchedule, setDoctorSchedule] = useState([
		{
			id: 'DOC001',
			name: 'डॉ. निखिल खोब्रागड़े',
			specialty: 'Orthopedics',
			hospital: 'Hope',
			timing: '12:00 PM - 4:00 PM',
			available: true,
			opd: 'OPD-A'
		},
		{
			id: 'DOC002',
			name: 'डॉ. रवि गुप्ता',
			specialty: 'Gastroenterology',
			hospital: 'Ayushman',
			timing: '10:00 AM - 2:00 PM',
			available: true,
			opd: 'OPD-B'
		},
		{
			id: 'DOC003',
			name: 'डॉ. सुनीता देवी',
			specialty: 'General Medicine',
			hospital: 'Hope',
			timing: '9:00 AM - 1:00 PM',
			available: false,
			opd: 'OPD-C'
		}
	]);

	// Call script in both Hindi and English
	const callScript = {
		greeting: {
			hindi: "नमस्ते, Hope/Ayushman/Raftaar Hospital से बात हो रही है",
			english: "Good Morning, this is Hope/Ayushman/Raftaar Hospital"
		},
		inquiry: {
			hindi: "आपकी क्या समस्या है? किस डॉक्टर से मिलना चाहते हैं?",
			english: "What is your concern? Which specialist would you like to consult?"
		},
		availability: {
			hindi: "डॉक्टर की उपलब्धता बताना",
			english: "Inform about doctor availability"
		},
		appointment: {
			hindi: "अपॉइंटमेंट की पुष्टि करना",
			english: "Confirm the appointment"
		}
	};

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
			checkTAT();
		}, 60000);
		return () => clearInterval(timer);
	}, []);

	const checkTAT = () => {
		const now = new Date();
		setLeads(prevLeads =>
			prevLeads.map(lead => {
				if (lead.status === 'New') {
					const receivedTime = new Date(`${now.toDateString()} ${lead.receivedTime}`);
					const timeDiff = (now - receivedTime) / (1000 * 60); // minutes

					if (timeDiff > 3) {
						return { ...lead, tatStatus: 'Overdue', priority: 'Critical' };
					}
				}
				return lead;
			})
		);
	};

	const getTATColor = (tatStatus) => {
		switch (tatStatus) {
			case 'Within TAT': return '#10b981';
			case 'Overdue': return '#dc2626';
			case 'Pending': return '#f59e0b';
			default: return '#6b7280';
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'Critical': return '#dc2626';
			case 'High': return '#f59e0b';
			case 'Medium': return '#10b981';
			case 'Low': return '#6b7280';
			default: return '#6b7280';
		}
	};

	const respondToLead = (leadId) => {
		const lead = leads.find(l => l.id === leadId);
		if (!lead) return;

		Alert.alert(
			`Respond to ${lead.name}`,
			`Category: ${lead.category}\nHospital: ${lead.hospital}\nPhone: ${lead.phone}`,
			[
				{ text: 'Call Patient', onPress: () => makeCall(lead.phone, leadId) },
				{ text: 'Mark as Responded', onPress: () => markResponded(leadId) },
				{ text: 'View Script', onPress: () => setShowScriptModal(true) },
				{ text: 'Cancel', style: 'cancel' }
			]
		);
	};

	const makeCall = (phone, leadId) => {
		const now = new Date();
		setLeads(prevLeads =>
			prevLeads.map(lead =>
				lead.id === leadId
					? {
						...lead,
						status: 'In Progress',
						responseTime: now.toLocaleTimeString(),
						tatStatus: 'Within TAT'
					}
					: lead
			)
		);
		Alert.alert('Call Initiated', `Calling ${phone}...`);
	};

	const markResponded = (leadId) => {
		const now = new Date();
		setLeads(prevLeads =>
			prevLeads.map(lead =>
				lead.id === leadId
					? {
						...lead,
						status: 'Responded',
						responseTime: now.toLocaleTimeString(),
						tatStatus: 'Within TAT'
					}
					: lead
			)
		);
		Alert.alert('Success', 'Lead marked as responded successfully!');
	};

	const renderLeadCard = ({ item }) => (
		<TouchableOpacity
			style={[styles.leadCard, {
				borderLeftColor: getTATColor(item.tatStatus),
				borderLeftWidth: 4
			}]}
			onPress={() => respondToLead(item.id)}
		>
			<View style={styles.leadHeader}>
				<View style={styles.leadInfo}>
					<Text style={styles.leadName}>{item.name}</Text>
					<Text style={styles.leadCategory}>{item.category}</Text>
					<Text style={styles.leadHospital}>{item.hospital} Hospital</Text>
				</View>
				<View style={styles.leadStatus}>
					<View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
						<Text style={styles.priorityText}>{item.priority}</Text>
					</View>
					<View style={[styles.tatBadge, { backgroundColor: getTATColor(item.tatStatus) }]}>
						<Text style={styles.tatText}>{item.tatStatus}</Text>
					</View>
				</View>
			</View>

			<View style={styles.leadDetails}>
				<View style={styles.timeInfo}>
					<Text style={styles.timeLabel}>Received: {item.receivedTime}</Text>
					{item.responseTime && (
						<Text style={styles.timeLabel}>Responded: {item.responseTime}</Text>
					)}
				</View>
				<TouchableOpacity
					style={styles.callButton}
					onPress={() => makeCall(item.phone, item.id)}
				>
					<MaterialIcons name="call" size={20} color="white" />
					<Text style={styles.callButtonText}>Call</Text>
				</TouchableOpacity>
			</View>

			{item.notes && (
				<Text style={styles.leadNotes}>Notes: {item.notes}</Text>
			)}
		</TouchableOpacity>
	);

	const renderDoctorCard = ({ item }) => (
		<View style={styles.doctorCard}>
			<View style={styles.doctorHeader}>
				<View style={styles.doctorInfo}>
					<Text style={styles.doctorName}>{item.name}</Text>
					<Text style={styles.doctorSpecialty}>{item.specialty}</Text>
					<Text style={styles.doctorHospital}>{item.hospital} Hospital</Text>
				</View>
				<View style={styles.availabilityStatus}>
					<View style={[styles.statusIndicator, {
						backgroundColor: item.available ? '#10b981' : '#dc2626'
					}]}>
						<Text style={styles.statusText}>
							{item.available ? 'Available' : 'Unavailable'}
						</Text>
					</View>
				</View>
			</View>
			<Text style={styles.doctorTiming}>🕐 {item.timing}</Text>
			<Text style={styles.doctorOPD}>📍 {item.opd}</Text>
		</View>
	);

	const renderScriptModal = () => (
		<Modal
			visible={showScriptModal}
			animationType="slide"
			transparent={true}
			onRequestClose={() => setShowScriptModal(false)}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>Call Script - JustDial Follow-up</Text>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => setShowScriptModal(false)}
						>
							<MaterialIcons name="close" size={24} color="#6b7280" />
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.scriptContent}>
						<View style={styles.scriptSection}>
							<Text style={styles.scriptStepTitle}>1️⃣ Greeting</Text>
							<Text style={styles.scriptHindi}>🇮🇳 {callScript.greeting.hindi}</Text>
							<Text style={styles.scriptEnglish}>🇬🇧 {callScript.greeting.english}</Text>
						</View>

						<View style={styles.scriptSection}>
							<Text style={styles.scriptStepTitle}>2️⃣ Inquiry Response</Text>
							<Text style={styles.scriptHindi}>🇮🇳 {callScript.inquiry.hindi}</Text>
							<Text style={styles.scriptEnglish}>🇬🇧 {callScript.inquiry.english}</Text>
						</View>

						<View style={styles.scriptSection}>
							<Text style={styles.scriptStepTitle}>3️⃣ Doctor Availability</Text>
							<Text style={styles.scriptHindi}>🇮🇳 डॉ. निखिल खोब्रागड़े 12 बजे से 4 बजे तक उपलब्ध हैं</Text>
							<Text style={styles.scriptEnglish}>🇬🇧 Dr. Nikhil Khobragade is available from 12 PM to 4 PM</Text>
						</View>

						<View style={styles.scriptSection}>
							<Text style={styles.scriptStepTitle}>4️⃣ Appointment Confirmation</Text>
							<Text style={styles.scriptHindi}>🇮🇳 आज के लिए अपॉइंटमेंट कब चाहिए?</Text>
							<Text style={styles.scriptEnglish}>🇬🇧 When would you like the appointment for today?</Text>
						</View>

						<View style={styles.importantNotes}>
							<Text style={styles.notesTitle}>⚠️ Important Guidelines</Text>
							<Text style={styles.noteText}>• TAT (Turn Around Time): Respond within 3 minutes</Text>
							<Text style={styles.noteText}>• 7 hospitals get the inquiry - respond quickly</Text>
							<Text style={styles.noteText}>• JustDial dashboard should always be open</Text>
							<Text style={styles.noteText}>• Know doctor names and availability in advance</Text>
							<Text style={styles.noteText}>• Consultant list should be pinned in front</Text>
						</View>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);

	const leadsStats = {
		total: leads.length,
		responded: leads.filter(lead => lead.status === 'Responded').length,
		pending: leads.filter(lead => lead.status === 'New').length,
		overdue: leads.filter(lead => lead.tatStatus === 'Overdue').length
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
				<Text style={styles.headerTitle}>JustDial Lead Management</Text>
				<TouchableOpacity
					style={styles.scriptButton}
					onPress={() => setShowScriptModal(true)}
				>
					<MaterialIcons name="script" size={24} color="white" />
				</TouchableOpacity>
			</View>

			{/* Tab Navigation */}
			<View style={styles.tabContainer}>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
					onPress={() => setActiveTab('dashboard')}
				>
					<MaterialIcons name="dashboard" size={20} color={activeTab === 'dashboard' ? '#10b981' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'dashboard' && styles.activeTabText
					]}>
						Dashboard
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'leads' && styles.activeTab]}
					onPress={() => setActiveTab('leads')}
				>
					<MaterialCommunityIcons name="phone-incoming" size={20} color={activeTab === 'leads' ? '#10b981' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'leads' && styles.activeTabText
					]}>
						Active Leads
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'doctors' && styles.activeTab]}
					onPress={() => setActiveTab('doctors')}
				>
					<MaterialCommunityIcons name="doctor" size={20} color={activeTab === 'doctors' ? '#10b981' : '#6b7280'} />
					<Text style={[
						styles.tabText,
						activeTab === 'doctors' && styles.activeTabText
					]}>
						Doctor Schedule
					</Text>
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content}>
				{activeTab === 'dashboard' && (
					<View>
						{/* Stats Overview */}
						<View style={styles.statsContainer}>
							<View style={[styles.statCard, { backgroundColor: '#10b981' }]}>
								<Text style={styles.statValue}>{leadsStats.total}</Text>
								<Text style={styles.statLabel}>Total Leads</Text>
							</View>
							<View style={[styles.statCard, { backgroundColor: '#f59e0b' }]}>
								<Text style={styles.statValue}>{leadsStats.pending}</Text>
								<Text style={styles.statLabel}>Pending</Text>
							</View>
							<View style={[styles.statCard, { backgroundColor: '#dc2626' }]}>
								<Text style={styles.statValue}>{leadsStats.overdue}</Text>
								<Text style={styles.statLabel}>Overdue</Text>
							</View>
						</View>

						{/* Current Time and TAT Alert */}
						<View style={styles.tatContainer}>
							<Text style={styles.tatTitle}>⏰ Current Time: {currentTime.toLocaleTimeString()}</Text>
							<Text style={styles.tatWarning}>
								⚠️ Remember: Respond within 3 minutes or lose the lead!
							</Text>
							<Text style={styles.tatInfo}>
								📱 JustDial Dashboard should always be open in front of you
							</Text>
						</View>

						{/* Quick Actions */}
						<View style={styles.quickActionsContainer}>
							<Text style={styles.quickActionsTitle}>🚀 Quick Actions</Text>
							<View style={styles.quickActionsGrid}>
								<TouchableOpacity
									style={[styles.quickActionButton, { backgroundColor: '#10b981' }]}
									onPress={() => setActiveTab('leads')}
								>
									<MaterialCommunityIcons name="phone-incoming" size={30} color="white" />
									<Text style={styles.quickActionText}>View Leads</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.quickActionButton, { backgroundColor: '#f59e0b' }]}
									onPress={() => setShowScriptModal(true)}
								>
									<MaterialIcons name="script" size={30} color="white" />
									<Text style={styles.quickActionText}>Call Script</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.quickActionButton, { backgroundColor: '#8b5cf6' }]}
									onPress={() => setActiveTab('doctors')}
								>
									<MaterialCommunityIcons name="doctor" size={30} color="white" />
									<Text style={styles.quickActionText}>Doctor Schedule</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.quickActionButton, { backgroundColor: '#dc2626' }]}
									onPress={() => Alert.alert('Emergency', 'Emergency protocols activated')}
								>
									<MaterialIcons name="emergency" size={30} color="white" />
									<Text style={styles.quickActionText}>Emergency</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)}

				{activeTab === 'leads' && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>📞 Active JustDial Leads</Text>
						<Text style={styles.sectionSubtitle}>
							Tap on any lead to respond or call the patient
						</Text>
						<FlatList
							data={leads}
							renderItem={renderLeadCard}
							keyExtractor={item => item.id}
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
							ListEmptyComponent={
								<View style={styles.emptyState}>
									<MaterialCommunityIcons name="phone-off" size={64} color="#9ca3af" />
									<Text style={styles.emptyStateText}>No active leads</Text>
									<Text style={styles.emptyStateSubtext}>
										New leads will appear here when received from JustDial
									</Text>
								</View>
							}
						/>
					</View>
				)}

				{activeTab === 'doctors' && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>👨‍⚕️ Doctor Availability Schedule</Text>
						<Text style={styles.sectionSubtitle}>
							Current availability status for all specialties
						</Text>
						<FlatList
							data={doctorSchedule}
							renderItem={renderDoctorCard}
							keyExtractor={item => item.id}
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
						/>

						{/* Important Instructions */}
						<View style={styles.instructionsContainer}>
							<Text style={styles.instructionsTitle}>📋 Important Instructions</Text>
							<Text style={styles.instructionText}>
								• Consultant list and OPD timings should be pinned in front of you
							</Text>
							<Text style={styles.instructionText}>
								• Know doctor names and availability well in advance
							</Text>
							<Text style={styles.instructionText}>
								• Respond to inquiries immediately for respective categories
							</Text>
							<Text style={styles.instructionText}>
								• Example: Dr. Nikhil Khobragade is available from 12 PM to 4 PM
							</Text>
						</View>
					</View>
				)}
			</ScrollView>

			{renderScriptModal()}
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
	scriptButton: {
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
		backgroundColor: '#f0fdf4',
	},
	tabText: {
		fontSize: 12,
		color: '#6b7280',
		marginLeft: 5,
		fontWeight: '500',
	},
	activeTabText: {
		color: '#10b981',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	statCard: {
		flex: 0.32,
		padding: 15,
		borderRadius: 12,
		alignItems: 'center',
	},
	statValue: {
		fontSize: 24,
		fontWeight: '700',
		color: 'white',
		marginBottom: 5,
	},
	statLabel: {
		fontSize: 12,
		color: 'rgba(255,255,255,0.9)',
		textAlign: 'center',
	},
	tatContainer: {
		backgroundColor: '#fef3c7',
		padding: 15,
		borderRadius: 12,
		marginBottom: 20,
	},
	tatTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#92400e',
		marginBottom: 8,
	},
	tatWarning: {
		fontSize: 14,
		color: '#dc2626',
		marginBottom: 5,
		fontWeight: '500',
	},
	tatInfo: {
		fontSize: 14,
		color: '#92400e',
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
	leadCard: {
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
	leadHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	leadInfo: {
		flex: 1,
	},
	leadName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	leadCategory: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 2,
	},
	leadHospital: {
		fontSize: 12,
		color: '#10b981',
	},
	leadStatus: {
		alignItems: 'flex-end',
	},
	priorityBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		marginBottom: 4,
	},
	priorityText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
	},
	tatBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	tatText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
	},
	leadDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	timeInfo: {
		flex: 1,
	},
	timeLabel: {
		fontSize: 12,
		color: '#6b7280',
		marginBottom: 2,
	},
	callButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#10b981',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
	},
	callButtonText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
		marginLeft: 5,
	},
	leadNotes: {
		fontSize: 12,
		color: '#1f2937',
		fontStyle: 'italic',
		backgroundColor: '#f9fafb',
		padding: 8,
		borderRadius: 6,
	},
	doctorCard: {
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
	doctorHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	doctorInfo: {
		flex: 1,
	},
	doctorName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 2,
	},
	doctorSpecialty: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 2,
	},
	doctorHospital: {
		fontSize: 12,
		color: '#10b981',
	},
	availabilityStatus: {
		alignItems: 'flex-end',
	},
	statusIndicator: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	statusText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	doctorTiming: {
		fontSize: 14,
		color: '#1f2937',
		marginBottom: 4,
	},
	doctorOPD: {
		fontSize: 14,
		color: '#6b7280',
	},
	instructionsContainer: {
		backgroundColor: '#f0fdf4',
		padding: 15,
		borderRadius: 12,
		marginTop: 20,
	},
	instructionsTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#065f46',
		marginBottom: 10,
	},
	instructionText: {
		fontSize: 14,
		color: '#065f46',
		marginBottom: 5,
		lineHeight: 20,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: 'white',
		width: '90%',
		maxHeight: '80%',
		borderRadius: 12,
		padding: 20,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
	},
	closeButton: {
		padding: 8,
	},
	scriptContent: {
		flex: 1,
	},
	scriptSection: {
		marginBottom: 20,
	},
	scriptStepTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 8,
	},
	scriptHindi: {
		fontSize: 14,
		color: '#1f2937',
		marginBottom: 4,
		lineHeight: 20,
	},
	scriptEnglish: {
		fontSize: 14,
		color: '#6b7280',
		lineHeight: 20,
	},
	importantNotes: {
		backgroundColor: '#fef3c7',
		padding: 15,
		borderRadius: 8,
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

export default JustDialLeadManagement;