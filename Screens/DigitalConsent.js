import React, { useState, useRef } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Alert,
	SafeAreaView,
	Switch,
	Dimensions,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const { width, height } = Dimensions.get('window');

const DigitalConsent = (props) => {
	const [consentData, setConsentData] = useState({
		patientName: 'John Doe',
		patientId: 'PT2024001',
		dateOfBirth: '1985-03-15',
		procedure: 'Cardiac Catheterization',
		doctor: 'Dr. Sarah Wilson',
		department: 'Cardiology',
		scheduledDate: '2024-10-25',
		emergencyContact: '+1 555-0123',
	});

	const [consentItems, setConsentItems] = useState([
		{
			id: '1',
			title: 'General Treatment Consent',
			description: 'I consent to receive medical treatment and procedures as recommended by my healthcare provider.',
			agreed: false,
			required: true,
		},
		{
			id: '2',
			title: 'Anesthesia Consent',
			description: 'I understand the risks and benefits of anesthesia and consent to its administration.',
			agreed: false,
			required: true,
		},
		{
			id: '3',
			title: 'Blood Transfusion Consent',
			description: 'I consent to blood transfusion if deemed necessary during the procedure.',
			agreed: false,
			required: false,
		},
		{
			id: '4',
			title: 'Photography/Recording Consent',
			description: 'I consent to photography or video recording for medical documentation purposes.',
			agreed: false,
			required: false,
		},
		{
			id: '5',
			title: 'Medical Research Participation',
			description: 'I consent to the use of my medical data for approved research studies.',
			agreed: false,
			required: false,
		},
		{
			id: '6',
			title: 'Financial Responsibility',
			description: 'I understand and accept financial responsibility for the medical services provided.',
			agreed: false,
			required: true,
		},
	]);

	const [signatureData, setSignatureData] = useState({
		patientSigned: false,
		guardianSigned: false,
		witnessSigned: false,
		signatureDate: null,
	});

	const [currentStep, setCurrentStep] = useState(1); // 1: Review, 2: Consent, 3: Signature, 4: Complete

	const toggleConsent = (id) => {
		setConsentItems(items =>
			items.map(item =>
				item.id === id ? { ...item, agreed: !item.agreed } : item
			)
		);
	};

	const handleDigitalSignature = (type) => {
		Alert.alert(
			'Digital Signature',
			`Please provide your ${type} signature using the signature pad below.`,
			[
				{
					text: 'Cancel',
					style: 'cancel'
				},
				{
					text: 'Sign',
					onPress: () => {
						setSignatureData(prev => ({
							...prev,
							[`${type}Signed`]: true,
							signatureDate: new Date().toISOString()
						}));
						Alert.alert('Success', `${type.charAt(0).toUpperCase() + type.slice(1)} signature captured successfully.`);
					}
				}
			]
		);
	};

	const validateConsents = () => {
		const requiredConsents = consentItems.filter(item => item.required);
		const agreedRequired = requiredConsents.filter(item => item.agreed);
		return agreedRequired.length === requiredConsents.length;
	};

	const handleSubmitConsent = () => {
		if (!validateConsents()) {
			Alert.alert('Required Consent Missing', 'Please agree to all required consent items before proceeding.');
			return;
		}

		if (!signatureData.patientSigned) {
			Alert.alert('Signature Required', 'Patient signature is required to complete the consent process.');
			return;
		}

		Alert.alert(
			'Consent Form Submitted Successfully!',
			`Digital consent has been recorded for:\n\nPatient: ${consentData.patientName}\nProcedure: ${consentData.procedure}\nDoctor: ${consentData.doctor}\nDate: ${new Date().toDateString()}\n\nConsent Status:\n• Required Items: All agreed\n• Patient Signature: ✓ Captured\n• Witness Signature: ${signatureData.witnessSigned ? '✓ Captured' : 'Not required'}\n\nThis consent is now part of the patient's permanent medical record.`,
			[
				{
					text: 'Print Copy',
					onPress: () => Alert.alert('Print Queue', 'Consent form has been added to the print queue.')
				},
				{
					text: 'Email Copy',
					onPress: () => Alert.alert('Email Sent', 'Consent form has been emailed to the patient.')
				},
				{
					text: 'Complete',
					onPress: () => {
						setCurrentStep(4);
						setTimeout(() => props.navigation.goBack(), 2000);
					}
				}
			]
		);
	};

	const renderProgressBar = () => (
		<View style={styles.progressContainer}>
			<View style={styles.progressBar}>
				{[1, 2, 3, 4].map((step) => (
					<View key={step} style={styles.progressStep}>
						<View style={[styles.progressCircle, {
							backgroundColor: currentStep >= step ? '#10b981' : '#e5e7eb'
						}]}>
							<Text style={[styles.progressText, {
								color: currentStep >= step ? 'white' : '#6b7280'
							}]}>{step}</Text>
						</View>
						{step < 4 && (
							<View style={[styles.progressLine, {
								backgroundColor: currentStep > step ? '#10b981' : '#e5e7eb'
							}]} />
						)}
					</View>
				))}
			</View>
			<View style={styles.progressLabels}>
				<Text style={styles.progressLabel}>Review</Text>
				<Text style={styles.progressLabel}>Consent</Text>
				<Text style={styles.progressLabel}>Sign</Text>
				<Text style={styles.progressLabel}>Complete</Text>
			</View>
		</View>
	);

	const renderPatientInfo = () => (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Patient Information</Text>
			<View style={styles.infoCard}>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Patient Name:</Text>
					<Text style={styles.infoValue}>{consentData.patientName}</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Patient ID:</Text>
					<Text style={styles.infoValue}>{consentData.patientId}</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Date of Birth:</Text>
					<Text style={styles.infoValue}>{consentData.dateOfBirth}</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Procedure:</Text>
					<Text style={styles.infoValue}>{consentData.procedure}</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Doctor:</Text>
					<Text style={styles.infoValue}>{consentData.doctor}</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Department:</Text>
					<Text style={styles.infoValue}>{consentData.department}</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Scheduled Date:</Text>
					<Text style={styles.infoValue}>{consentData.scheduledDate}</Text>
				</View>
			</View>
		</View>
	);

	const renderConsentItems = () => (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Consent Items</Text>
			{consentItems.map((item) => (
				<View key={item.id} style={styles.consentItem}>
					<View style={styles.consentHeader}>
						<View style={styles.consentTitleContainer}>
							<Text style={styles.consentTitle}>{item.title}</Text>
							{item.required && <Text style={styles.requiredText}>*Required</Text>}
						</View>
						<Switch
							value={item.agreed}
							onValueChange={() => toggleConsent(item.id)}
							trackColor={{ false: '#e5e7eb', true: '#10b981' }}
							thumbColor={item.agreed ? '#ffffff' : '#f4f3f4'}
						/>
					</View>
					<Text style={styles.consentDescription}>{item.description}</Text>
				</View>
			))}
		</View>
	);

	const renderSignatureSection = () => (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Digital Signatures</Text>

			<View style={styles.signatureCard}>
				<View style={styles.signatureHeader}>
					<MaterialIcons name="edit" size={24} color="#06b6d4" />
					<Text style={styles.signatureTitle}>Patient Signature</Text>
					{signatureData.patientSigned && <MaterialIcons name="check-circle" size={24} color="#10b981" />}
				</View>
				<Text style={styles.signatureDescription}>
					By signing below, I acknowledge that I have read and understand all consent items.
				</Text>
				<TouchableOpacity
					style={[styles.signatureButton, {
						backgroundColor: signatureData.patientSigned ? '#10b981' : '#06b6d4'
					}]}
					onPress={() => handleDigitalSignature('patient')}
				>
					<Text style={styles.signatureButtonText}>
						{signatureData.patientSigned ? 'Signature Captured' : 'Tap to Sign'}
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.signatureCard}>
				<View style={styles.signatureHeader}>
					<MaterialIcons name="people" size={24} color="#8b5cf6" />
					<Text style={styles.signatureTitle}>Witness Signature (Optional)</Text>
					{signatureData.witnessSigned && <MaterialIcons name="check-circle" size={24} color="#10b981" />}
				</View>
				<Text style={styles.signatureDescription}>
					Witness signature for procedures requiring additional verification.
				</Text>
				<TouchableOpacity
					style={[styles.signatureButton, {
						backgroundColor: signatureData.witnessSigned ? '#10b981' : '#8b5cf6'
					}]}
					onPress={() => handleDigitalSignature('witness')}
				>
					<Text style={styles.signatureButtonText}>
						{signatureData.witnessSigned ? 'Witness Signed' : 'Witness Sign'}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderCompletionScreen = () => (
		<View style={styles.completionContainer}>
			<MaterialIcons name="check-circle" size={80} color="#10b981" />
			<Text style={styles.completionTitle}>Consent Completed Successfully!</Text>
			<Text style={styles.completionText}>
				Your digital consent has been recorded and saved to your medical record.
				You will receive a copy via email within 24 hours.
			</Text>
			<View style={styles.completionStats}>
				<Text style={styles.completionStat}>✓ All required consents agreed</Text>
				<Text style={styles.completionStat}>✓ Patient signature captured</Text>
				<Text style={styles.completionStat}>✓ Consent form archived</Text>
				<Text style={styles.completionStat}>✓ Medical team notified</Text>
			</View>
		</View>
	);

	if (currentStep === 4) {
		return (
			<SafeAreaView style={styles.container}>
				{renderCompletionScreen()}
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => props.navigation.goBack()}
				>
					<MaterialIcons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Digital Consent</Text>
				<View style={styles.placeholder} />
			</View>

			{renderProgressBar()}

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.introCard}>
					<MaterialCommunityIcons name="file-document-edit" size={40} color="#06b6d4" />
					<Text style={styles.introTitle}>Digital Consent Form</Text>
					<Text style={styles.introText}>
						Please review the patient information and consent items carefully before proceeding with digital signatures.
					</Text>
				</View>

				{renderPatientInfo()}
				{renderConsentItems()}
				{renderSignatureSection()}

				<View style={styles.actionButtons}>
					<TouchableOpacity
						style={styles.secondaryButton}
						onPress={() => Alert.alert('Save Draft', 'Consent form has been saved as draft.')}
					>
						<MaterialIcons name="save" size={20} color="#6b7280" />
						<Text style={styles.secondaryButtonText}>Save Draft</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.primaryButton}
						onPress={handleSubmitConsent}
					>
						<MaterialIcons name="send" size={20} color="white" />
						<Text style={styles.primaryButtonText}>Submit Consent</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.bottomSpacing} />
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
		paddingVertical: 16,
		paddingHorizontal: 20,
		backgroundColor: '#06b6d4',
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	backButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: 'white',
	},
	placeholder: {
		width: 40,
	},
	progressContainer: {
		paddingHorizontal: 20,
		paddingVertical: 20,
		backgroundColor: 'white',
		marginHorizontal: 15,
		marginTop: 15,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	progressBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
	},
	progressStep: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	progressCircle: {
		width: 30,
		height: 30,
		borderRadius: 15,
		justifyContent: 'center',
		alignItems: 'center',
	},
	progressText: {
		fontSize: 12,
		fontWeight: '600',
	},
	progressLine: {
		width: 40,
		height: 2,
		marginHorizontal: 5,
	},
	progressLabels: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 10,
	},
	progressLabel: {
		fontSize: 12,
		color: '#6b7280',
		fontWeight: '500',
	},
	content: {
		flex: 1,
		paddingHorizontal: 15,
	},
	introCard: {
		backgroundColor: 'white',
		padding: 24,
		borderRadius: 12,
		alignItems: 'center',
		marginTop: 20,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	introTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#1f2937',
		marginTop: 12,
		marginBottom: 8,
	},
	introText: {
		fontSize: 14,
		color: '#6b7280',
		textAlign: 'center',
		lineHeight: 20,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 16,
	},
	infoCard: {
		backgroundColor: 'white',
		padding: 16,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#f3f4f6',
	},
	infoLabel: {
		fontSize: 14,
		color: '#6b7280',
		fontWeight: '500',
		flex: 1,
	},
	infoValue: {
		fontSize: 14,
		color: '#1f2937',
		fontWeight: '600',
		flex: 1,
		textAlign: 'right',
	},
	consentItem: {
		backgroundColor: 'white',
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	consentHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	consentTitleContainer: {
		flex: 1,
		marginRight: 10,
	},
	consentTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	requiredText: {
		fontSize: 12,
		color: '#ef4444',
		fontWeight: '500',
		marginTop: 2,
	},
	consentDescription: {
		fontSize: 14,
		color: '#6b7280',
		lineHeight: 20,
	},
	signatureCard: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 12,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	signatureHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	signatureTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginLeft: 8,
		flex: 1,
	},
	signatureDescription: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 16,
		lineHeight: 20,
	},
	signatureButton: {
		padding: 16,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	signatureButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
	actionButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
		gap: 12,
	},
	secondaryButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
		borderRadius: 12,
		backgroundColor: 'white',
		borderWidth: 2,
		borderColor: '#e5e7eb',
	},
	secondaryButtonText: {
		color: '#6b7280',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
	},
	primaryButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
		borderRadius: 12,
		backgroundColor: '#06b6d4',
	},
	primaryButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
	},
	completionContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 40,
	},
	completionTitle: {
		fontSize: 24,
		fontWeight: '700',
		color: '#10b981',
		marginTop: 20,
		marginBottom: 16,
		textAlign: 'center',
	},
	completionText: {
		fontSize: 16,
		color: '#6b7280',
		textAlign: 'center',
		lineHeight: 24,
		marginBottom: 32,
	},
	completionStats: {
		alignItems: 'flex-start',
	},
	completionStat: {
		fontSize: 14,
		color: '#10b981',
		marginBottom: 8,
		fontWeight: '500',
	},
	bottomSpacing: {
		height: 40,
	},
});

export default DigitalConsent;