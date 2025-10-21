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
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';

const LeadershipTeam = (props) => {
	const [leadershipTeam, setLeadershipTeam] = useState([
		{
			id: '1',
			name: 'डॉ. राजेश शर्मा',
			role: 'Technical Leader',
			department: 'Chief Medical Officer',
			email: 'rajesh.sharma@hopehospital.in',
			phone: '+91 98765 43210',
			experience: '15 years',
			specialization: 'Medical Technology & Digital Health',
			status: 'active',
			joinDate: '2019-03-15',
			responsibilities: [
				'Medical technology implementation',
				'Digital health initiatives',
				'Clinical decision support systems',
				'Medical equipment evaluation'
			]
		},
		{
			id: '2',
			name: 'श्रीमती प्रिया पटेल',
			role: 'Operations Leader',
			department: 'Hospital Operations',
			email: 'priya.patel@hopehospital.in',
			phone: '+91 98765 43211',
			experience: '12 years',
			specialization: 'Healthcare Operations & Process Management',
			status: 'active',
			joinDate: '2020-01-10',
			responsibilities: [
				'Daily hospital operations',
				'Process optimization',
				'Resource allocation',
				'Quality assurance protocols'
			]
		},
		{
			id: '3',
			name: 'श्री अमित कुमार',
			role: 'Statistics & Analytics Leader',
			department: 'Data Analytics',
			email: 'amit.kumar@hopehospital.in',
			phone: '+91 98765 43212',
			experience: '10 years',
			specialization: 'Healthcare Analytics & Business Intelligence',
			status: 'active',
			joinDate: '2020-09-01',
			responsibilities: [
				'Data analysis and reporting',
				'Performance metrics tracking',
				'Business intelligence',
				'Predictive analytics for healthcare'
			]
		},
		{
			id: '4',
			name: 'सुश्री नेहा सिंह',
			role: 'Marketing Leader',
			department: 'Marketing & Communications',
			email: 'neha.singh@hopehospital.in',
			phone: '+91 98765 43213',
			experience: '8 years',
			specialization: 'Healthcare Marketing & Digital Communications',
			status: 'active',
			joinDate: '2021-05-20',
			responsibilities: [
				'Marketing strategy development',
				'Digital marketing campaigns',
				'Brand management',
				'Community outreach programs'
			]
		}
	]);

	const [showMemberModal, setShowMemberModal] = useState(false);
	const [selectedMember, setSelectedMember] = useState(null);
	const [showAddModal, setShowAddModal] = useState(false);
	const [newMember, setNewMember] = useState({
		name: '',
		role: '',
		department: '',
		email: '',
		phone: '',
		experience: '',
		specialization: '',
		responsibilities: ''
	});

	const statusColors = {
		active: '#10b981',
		inactive: '#6b7280',
		onLeave: '#f59e0b'
	};

	const roleIcons = {
		'Technical Leader': 'stethoscope',
		'Operations Leader': 'cogs',
		'Statistics & Analytics Leader': 'chart-line',
		'Marketing Leader': 'bullhorn'
	};

	const addNewMember = () => {
		if (!newMember.name || !newMember.role || !newMember.department) {
			Alert.alert('Error', 'Please fill in all required fields');
			return;
		}

		const responsibilities = newMember.responsibilities
			.split('\n')
			.filter(r => r.trim())
			.map(r => r.trim());

		const member = {
			id: Date.now().toString(),
			...newMember,
			responsibilities,
			status: 'active',
			joinDate: new Date().toISOString().split('T')[0]
		};

		setLeadershipTeam([...leadershipTeam, member]);
		setNewMember({
			name: '',
			role: '',
			department: '',
			email: '',
			phone: '',
			experience: '',
			specialization: '',
			responsibilities: ''
		});
		setShowAddModal(false);
		Alert.alert('Success', 'Leadership team member added successfully');
	};

	const toggleMemberStatus = (memberId) => {
		setLeadershipTeam(prev =>
			prev.map(member =>
				member.id === memberId
					? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
					: member
			)
		);
	};

	const renderMemberCard = (member) => (
		<TouchableOpacity
			key={member.id}
			style={[styles.memberCard, { borderLeftColor: statusColors[member.status] }]}
			onPress={() => {
				setSelectedMember(member);
				setShowMemberModal(true);
			}}
		>
			<View style={styles.memberHeader}>
				<View style={styles.memberInfo}>
					<View style={styles.memberNameRow}>
						<MaterialCommunityIcons
							name={roleIcons[member.role] || 'account'}
							size={24}
							color="#6366f1"
						/>
						<Text style={styles.memberName}>{member.name}</Text>
						<View style={[styles.statusBadge, { backgroundColor: statusColors[member.status] }]}>
							<Text style={styles.statusText}>{member.status}</Text>
						</View>
					</View>
					<Text style={styles.memberRole}>{member.role}</Text>
					<Text style={styles.memberDepartment}>{member.department}</Text>
				</View>
			</View>
			<View style={styles.memberStats}>
				<View style={styles.statItem}>
					<Text style={styles.statLabel}>Experience</Text>
					<Text style={styles.statValue}>{member.experience}</Text>
				</View>
				<View style={styles.statItem}>
					<Text style={styles.statLabel}>Responsibilities</Text>
					<Text style={styles.statValue}>{member.responsibilities.length}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);

	const renderMemberModal = () => (
		<Modal
			visible={showMemberModal}
			animationType="slide"
			presentationStyle="pageSheet"
		>
			<SafeAreaView style={styles.modalContainer}>
				<View style={styles.modalHeader}>
					<TouchableOpacity onPress={() => setShowMemberModal(false)}>
						<Ionicons name="close" size={24} color="#6b7280" />
					</TouchableOpacity>
					<Text style={styles.modalTitle}>Leadership Team Member</Text>
					<TouchableOpacity
						onPress={() => toggleMemberStatus(selectedMember?.id)}
						style={[styles.statusToggle, { backgroundColor: statusColors[selectedMember?.status || 'active'] }]}
					>
						<Text style={styles.statusToggleText}>
							{selectedMember?.status === 'active' ? 'Deactivate' : 'Activate'}
						</Text>
					</TouchableOpacity>
				</View>

				{selectedMember && (
					<ScrollView style={styles.modalContent}>
						<View style={styles.memberDetailCard}>
							<View style={styles.memberDetailHeader}>
								<MaterialCommunityIcons
									name={roleIcons[selectedMember.role] || 'account'}
									size={40}
									color="#6366f1"
								/>
								<View style={styles.memberDetailInfo}>
									<Text style={styles.memberDetailName}>{selectedMember.name}</Text>
									<Text style={styles.memberDetailRole}>{selectedMember.role}</Text>
									<Text style={styles.memberDetailDepartment}>{selectedMember.department}</Text>
								</View>
							</View>

							<View style={styles.contactSection}>
								<Text style={styles.sectionTitle}>Contact Information</Text>
								<View style={styles.contactItem}>
									<MaterialIcons name="email" size={20} color="#6b7280" />
									<Text style={styles.contactText}>{selectedMember.email}</Text>
								</View>
								<View style={styles.contactItem}>
									<MaterialIcons name="phone" size={20} color="#6b7280" />
									<Text style={styles.contactText}>{selectedMember.phone}</Text>
								</View>
							</View>

							<View style={styles.detailSection}>
								<Text style={styles.sectionTitle}>Professional Details</Text>
								<View style={styles.detailItem}>
									<Text style={styles.detailLabel}>Experience:</Text>
									<Text style={styles.detailValue}>{selectedMember.experience}</Text>
								</View>
								<View style={styles.detailItem}>
									<Text style={styles.detailLabel}>Specialization:</Text>
									<Text style={styles.detailValue}>{selectedMember.specialization}</Text>
								</View>
								<View style={styles.detailItem}>
									<Text style={styles.detailLabel}>Join Date:</Text>
									<Text style={styles.detailValue}>{selectedMember.joinDate}</Text>
								</View>
							</View>

							<View style={styles.responsibilitiesSection}>
								<Text style={styles.sectionTitle}>Key Responsibilities</Text>
								{selectedMember.responsibilities.map((responsibility, index) => (
									<View key={index} style={styles.responsibilityItem}>
										<MaterialCommunityIcons name="check-circle" size={16} color="#10b981" />
										<Text style={styles.responsibilityText}>{responsibility}</Text>
									</View>
								))}
							</View>
						</View>
					</ScrollView>
				)}
			</SafeAreaView>
		</Modal>
	);

	const renderAddMemberModal = () => (
		<Modal
			visible={showAddModal}
			animationType="slide"
			presentationStyle="pageSheet"
		>
			<SafeAreaView style={styles.modalContainer}>
				<View style={styles.modalHeader}>
					<TouchableOpacity onPress={() => setShowAddModal(false)}>
						<Ionicons name="close" size={24} color="#6b7280" />
					</TouchableOpacity>
					<Text style={styles.modalTitle}>Add Team Member</Text>
					<TouchableOpacity onPress={addNewMember} style={styles.saveButton}>
						<Text style={styles.saveButtonText}>Save</Text>
					</TouchableOpacity>
				</View>

				<ScrollView style={styles.modalContent}>
					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Name *</Text>
						<TextInput
							style={styles.input}
							value={newMember.name}
							onChangeText={(text) => setNewMember({...newMember, name: text})}
							placeholder="Enter full name"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Role *</Text>
						<TextInput
							style={styles.input}
							value={newMember.role}
							onChangeText={(text) => setNewMember({...newMember, role: text})}
							placeholder="e.g., Technical Leader"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Department *</Text>
						<TextInput
							style={styles.input}
							value={newMember.department}
							onChangeText={(text) => setNewMember({...newMember, department: text})}
							placeholder="Enter department"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Email</Text>
						<TextInput
							style={styles.input}
							value={newMember.email}
							onChangeText={(text) => setNewMember({...newMember, email: text})}
							placeholder="Enter email address"
							keyboardType="email-address"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Phone</Text>
						<TextInput
							style={styles.input}
							value={newMember.phone}
							onChangeText={(text) => setNewMember({...newMember, phone: text})}
							placeholder="Enter phone number"
							keyboardType="phone-pad"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Experience</Text>
						<TextInput
							style={styles.input}
							value={newMember.experience}
							onChangeText={(text) => setNewMember({...newMember, experience: text})}
							placeholder="e.g., 10 years"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Specialization</Text>
						<TextInput
							style={styles.input}
							value={newMember.specialization}
							onChangeText={(text) => setNewMember({...newMember, specialization: text})}
							placeholder="Enter area of specialization"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.inputLabel}>Responsibilities</Text>
						<TextInput
							style={[styles.input, styles.textArea]}
							value={newMember.responsibilities}
							onChangeText={(text) => setNewMember({...newMember, responsibilities: text})}
							placeholder="Enter each responsibility on a new line"
							multiline
							numberOfLines={6}
						/>
					</View>
				</ScrollView>
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
				<Text style={styles.headerTitle}>Leadership Team</Text>
				<TouchableOpacity
					onPress={() => setShowAddModal(true)}
					style={styles.addButton}
				>
					<Ionicons name="add" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content}>
				<View style={styles.statsOverview}>
					<View style={styles.statCard}>
						<MaterialCommunityIcons name="account-group" size={30} color="#6366f1" />
						<Text style={styles.statNumber}>{leadershipTeam.length}</Text>
						<Text style={styles.statLabel}>Total Leaders</Text>
					</View>
					<View style={styles.statCard}>
						<MaterialCommunityIcons name="check-circle" size={30} color="#10b981" />
						<Text style={styles.statNumber}>{leadershipTeam.filter(m => m.status === 'active').length}</Text>
						<Text style={styles.statLabel}>Active</Text>
					</View>
					<View style={styles.statCard}>
						<MaterialCommunityIcons name="clock" size={30} color="#f59e0b" />
						<Text style={styles.statNumber}>
							{Math.round(leadershipTeam.reduce((sum, m) => sum + parseInt(m.experience), 0) / leadershipTeam.length)}
						</Text>
						<Text style={styles.statLabel}>Avg Experience</Text>
					</View>
				</View>

				<View style={styles.teamSection}>
					<Text style={styles.sectionTitle}>Leadership Team Members</Text>
					{leadershipTeam.map(renderMemberCard)}
				</View>
			</ScrollView>

			{renderMemberModal()}
			{renderAddMemberModal()}
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
	addButton: {
		padding: 5,
	},
	content: {
		flex: 1,
		padding: 20,
	},
	statsOverview: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 25,
	},
	statCard: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 12,
		alignItems: 'center',
		flex: 1,
		marginHorizontal: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	statNumber: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1f2937',
		marginTop: 8,
	},
	statLabel: {
		fontSize: 12,
		color: '#6b7280',
		marginTop: 4,
	},
	teamSection: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 15,
	},
	memberCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		marginBottom: 15,
		borderLeftWidth: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	memberHeader: {
		marginBottom: 15,
	},
	memberNameRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	memberName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#1f2937',
		marginLeft: 10,
		flex: 1,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 10,
		color: 'white',
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},
	memberRole: {
		fontSize: 16,
		fontWeight: '600',
		color: '#6366f1',
		marginBottom: 4,
		marginLeft: 34,
	},
	memberDepartment: {
		fontSize: 14,
		color: '#6b7280',
		marginLeft: 34,
	},
	memberStats: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingTop: 15,
		borderTopWidth: 1,
		borderTopColor: '#e5e7eb',
	},
	statItem: {
		alignItems: 'center',
	},
	statLabel: {
		fontSize: 12,
		color: '#6b7280',
		marginBottom: 4,
	},
	statValue: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1f2937',
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
	statusToggle: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
	},
	statusToggleText: {
		fontSize: 12,
		color: 'white',
		fontWeight: 'bold',
	},
	saveButton: {
		backgroundColor: '#6366f1',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
	},
	saveButtonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 14,
	},
	modalContent: {
		flex: 1,
		padding: 20,
	},
	memberDetailCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	memberDetailHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 25,
		paddingBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	memberDetailInfo: {
		marginLeft: 15,
		flex: 1,
	},
	memberDetailName: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#1f2937',
		marginBottom: 4,
	},
	memberDetailRole: {
		fontSize: 16,
		fontWeight: '600',
		color: '#6366f1',
		marginBottom: 2,
	},
	memberDetailDepartment: {
		fontSize: 14,
		color: '#6b7280',
	},
	contactSection: {
		marginBottom: 25,
	},
	contactItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	contactText: {
		fontSize: 16,
		color: '#1f2937',
		marginLeft: 10,
	},
	detailSection: {
		marginBottom: 25,
	},
	detailItem: {
		flexDirection: 'row',
		marginBottom: 12,
	},
	detailLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#6b7280',
		width: 120,
	},
	detailValue: {
		fontSize: 16,
		color: '#1f2937',
		flex: 1,
	},
	responsibilitiesSection: {
		marginBottom: 20,
	},
	responsibilityItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 8,
	},
	responsibilityText: {
		fontSize: 15,
		color: '#1f2937',
		marginLeft: 8,
		flex: 1,
		lineHeight: 22,
	},
	inputGroup: {
		marginBottom: 20,
	},
	inputLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 8,
	},
	input: {
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 12,
		fontSize: 16,
		color: '#1f2937',
	},
	textArea: {
		height: 120,
		textAlignVertical: 'top',
	},
});

export default LeadershipTeam;