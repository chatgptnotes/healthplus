import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	SafeAreaView,
	Picker,
	Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const PatientRegistration = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [currentField, setCurrentField] = useState('');

	// Form data state
	const [patientData, setPatientData] = useState({
		// Personal Information
		firstName: '',
		lastName: '',
		middleName: '',
		dateOfBirth: new Date(),
		gender: '',
		bloodGroup: '',
		maritalStatus: '',

		// Contact Information
		phoneNumber: '',
		alternatePhone: '',
		email: '',
		address: '',
		city: '',
		state: '',
		pincode: '',
		emergencyContactName: '',
		emergencyContactPhone: '',
		emergencyContactRelation: '',

		// Medical Information
		allergies: '',
		chronicConditions: '',
		previousSurgeries: '',
		currentMedications: '',

		// Insurance Information
		insuranceProvider: '',
		insuranceType: '', // CGHS, ECHS, Railways, TPA, Cash
		policyNumber: '',
		insuranceCardNumber: '',

		// Employment Information
		occupation: '',
		employer: '',
		workAddress: '',

		// Additional Information
		referredBy: '',
		preferredDoctor: '',
		preferredLanguage: 'English',
		nationality: 'Indian',
		religion: '',

		// Emergency
		isEmergency: false,
		priority: 'Normal' // Normal, Urgent, Emergency
	});

	const [errors, setErrors] = useState({});

	const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
	const genders = ['Male', 'Female', 'Other'];
	const maritalStatus = ['Single', 'Married', 'Divorced', 'Widowed', 'Other'];
	const insuranceTypes = ['Cash', 'CGHS', 'ECHS', 'Railways', 'TPA Health', 'Star Health', 'ICICI Lombard', 'Other'];
	const priorities = ['Normal', 'Urgent', 'Emergency'];
	const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Gujarati', 'Marathi', 'Punjabi'];

	const validateForm = () => {
		const newErrors = {};

		// Required field validation
		if (!patientData.firstName.trim()) newErrors.firstName = 'First name is required';
		if (!patientData.lastName.trim()) newErrors.lastName = 'Last name is required';
		if (!patientData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
		if (!patientData.gender) newErrors.gender = 'Gender is required';
		if (!patientData.address.trim()) newErrors.address = 'Address is required';

		// Phone number validation
		if (patientData.phoneNumber && !/^\d{10}$/.test(patientData.phoneNumber)) {
			newErrors.phoneNumber = 'Phone number must be 10 digits';
		}

		// Email validation
		if (patientData.email && !/\S+@\S+\.\S+/.test(patientData.email)) {
			newErrors.email = 'Please enter a valid email address';
		}

		// Emergency contact validation
		if (patientData.emergencyContactPhone && !/^\d{10}$/.test(patientData.emergencyContactPhone)) {
			newErrors.emergencyContactPhone = 'Emergency contact must be 10 digits';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleDateChange = (event, selectedDate) => {
		setShowDatePicker(false);
		if (selectedDate) {
			setPatientData({
				...patientData,
				[currentField]: selectedDate
			});
		}
	};

	const showDatePickerFor = (field) => {
		setCurrentField(field);
		setShowDatePicker(true);
	};

	const handleSubmit = async () => {
		if (!validateForm()) {
			Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
			return;
		}

		setIsLoading(true);
		try {
			// Here you would dispatch an action to save the patient data
			// await dispatch(PatientActions.RegisterPatient(patientData));

			Alert.alert(
				'Registration Successful',
				`Patient ${patientData.firstName} ${patientData.lastName} has been registered successfully.`,
				[
					{
						text: 'OK',
						onPress: () => {
							// Reset form or navigate back
							props.navigation.goBack();
						}
					}
				]
			);
		} catch (error) {
			Alert.alert('Registration Failed', error.message || 'An error occurred during registration.');
		} finally {
			setIsLoading(false);
		}
	};

	const renderSection = (title, children) => (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>{title}</Text>
			<View style={styles.sectionContent}>
				{children}
			</View>
		</View>
	);

	const renderInput = (label, field, placeholder, options = {}) => (
		<View style={styles.inputContainer}>
			<Text style={[styles.inputLabel, options.required && styles.requiredField]}>
				{label} {options.required && '*'}
			</Text>
			<TextInput
				style={[styles.textInput, errors[field] && styles.inputError]}
				placeholder={placeholder}
				value={patientData[field]}
				onChangeText={(text) => setPatientData({ ...patientData, [field]: text })}
				keyboardType={options.keyboardType || 'default'}
				multiline={options.multiline || false}
				numberOfLines={options.numberOfLines || 1}
				autoCapitalize={options.autoCapitalize || 'words'}
			/>
			{errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
		</View>
	);

	const renderPicker = (label, field, items, required = false) => (
		<View style={styles.inputContainer}>
			<Text style={[styles.inputLabel, required && styles.requiredField]}>
				{label} {required && '*'}
			</Text>
			<View style={[styles.pickerContainer, errors[field] && styles.inputError]}>
				<Picker
					selectedValue={patientData[field]}
					style={styles.picker}
					onValueChange={(itemValue) => setPatientData({ ...patientData, [field]: itemValue })}
				>
					<Picker.Item label={`Select ${label}`} value="" />
					{items.map((item, index) => (
						<Picker.Item key={index} label={item} value={item} />
					))}
				</Picker>
			</View>
			{errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
		</View>
	);

	const renderDateInput = (label, field, required = false) => (
		<View style={styles.inputContainer}>
			<Text style={[styles.inputLabel, required && styles.requiredField]}>
				{label} {required && '*'}
			</Text>
			<TouchableOpacity
				style={[styles.dateInput, errors[field] && styles.inputError]}
				onPress={() => showDatePickerFor(field)}
			>
				<Text style={styles.dateText}>
					{patientData[field].toLocaleDateString()}
				</Text>
				<MaterialIcons name="date-range" size={24} color="#6b7280" />
			</TouchableOpacity>
			{errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
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
				<Text style={styles.headerTitle}>Patient Registration</Text>
				<View style={styles.placeholder} />
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Personal Information */}
				{renderSection('Personal Information', (
					<>
						{renderInput('First Name', 'firstName', 'Enter first name', { required: true })}
						{renderInput('Middle Name', 'middleName', 'Enter middle name (optional)')}
						{renderInput('Last Name', 'lastName', 'Enter last name', { required: true })}
						{renderDateInput('Date of Birth', 'dateOfBirth', true)}
						{renderPicker('Gender', 'gender', genders, true)}
						{renderPicker('Blood Group', 'bloodGroup', bloodGroups)}
						{renderPicker('Marital Status', 'maritalStatus', maritalStatus)}
					</>
				))}

				{/* Contact Information */}
				{renderSection('Contact Information', (
					<>
						{renderInput('Phone Number', 'phoneNumber', 'Enter 10-digit mobile number', {
							required: true,
							keyboardType: 'numeric'
						})}
						{renderInput('Alternate Phone', 'alternatePhone', 'Enter alternate number (optional)', {
							keyboardType: 'numeric'
						})}
						{renderInput('Email', 'email', 'Enter email address (optional)', {
							keyboardType: 'email-address',
							autoCapitalize: 'none'
						})}
						{renderInput('Address', 'address', 'Enter complete address', {
							required: true,
							multiline: true,
							numberOfLines: 3
						})}
						{renderInput('City', 'city', 'Enter city')}
						{renderInput('State', 'state', 'Enter state')}
						{renderInput('PIN Code', 'pincode', 'Enter PIN code', { keyboardType: 'numeric' })}
					</>
				))}

				{/* Emergency Contact */}
				{renderSection('Emergency Contact', (
					<>
						{renderInput('Contact Person Name', 'emergencyContactName', 'Enter emergency contact name')}
						{renderInput('Contact Person Phone', 'emergencyContactPhone', 'Enter emergency contact number', {
							keyboardType: 'numeric'
						})}
						{renderInput('Relationship', 'emergencyContactRelation', 'Enter relationship (e.g., Father, Spouse)')}
					</>
				))}

				{/* Medical Information */}
				{renderSection('Medical Information', (
					<>
						{renderInput('Allergies', 'allergies', 'List any known allergies (optional)', {
							multiline: true,
							numberOfLines: 2
						})}
						{renderInput('Chronic Conditions', 'chronicConditions', 'List chronic conditions (optional)', {
							multiline: true,
							numberOfLines: 2
						})}
						{renderInput('Previous Surgeries', 'previousSurgeries', 'List previous surgeries (optional)', {
							multiline: true,
							numberOfLines: 2
						})}
						{renderInput('Current Medications', 'currentMedications', 'List current medications (optional)', {
							multiline: true,
							numberOfLines: 2
						})}
					</>
				))}

				{/* Insurance Information */}
				{renderSection('Insurance Information', (
					<>
						{renderPicker('Insurance Type', 'insuranceType', insuranceTypes)}
						{renderInput('Insurance Provider', 'insuranceProvider', 'Enter insurance provider name')}
						{renderInput('Policy Number', 'policyNumber', 'Enter policy number')}
						{renderInput('Insurance Card Number', 'insuranceCardNumber', 'Enter insurance card number')}
					</>
				))}

				{/* Additional Information */}
				{renderSection('Additional Information', (
					<>
						{renderInput('Occupation', 'occupation', 'Enter occupation')}
						{renderInput('Employer', 'employer', 'Enter employer name')}
						{renderInput('Referred By', 'referredBy', 'Enter referring doctor/person name')}
						{renderInput('Preferred Doctor', 'preferredDoctor', 'Enter preferred doctor name')}
						{renderPicker('Preferred Language', 'preferredLanguage', languages)}
						{renderInput('Religion', 'religion', 'Enter religion (optional)')}
						{renderPicker('Priority', 'priority', priorities)}
					</>
				))}

				{/* Emergency Registration Toggle */}
				<View style={styles.section}>
					<TouchableOpacity
						style={styles.emergencyToggle}
						onPress={() => setPatientData({
							...patientData,
							isEmergency: !patientData.isEmergency,
							priority: !patientData.isEmergency ? 'Emergency' : 'Normal'
						})}
					>
						<MaterialCommunityIcons
							name={patientData.isEmergency ? "checkbox-marked" : "checkbox-blank-outline"}
							size={24}
							color={patientData.isEmergency ? "#dc2626" : "#6b7280"}
						/>
						<Text style={[styles.emergencyText, patientData.isEmergency && styles.emergencyTextActive]}>
							Emergency Registration
						</Text>
					</TouchableOpacity>
				</View>

				{/* Submit Button */}
				<TouchableOpacity
					style={[styles.submitButton, isLoading && styles.disabledButton]}
					onPress={handleSubmit}
					disabled={isLoading}
				>
					{isLoading ? (
						<ActivityIndicator size="small" color="white" />
					) : (
						<>
							<MaterialIcons name="person-add" size={24} color="white" />
							<Text style={styles.submitButtonText}>Register Patient</Text>
						</>
					)}
				</TouchableOpacity>

				<View style={styles.bottomSpacing} />
			</ScrollView>

			{/* Date Picker Modal */}
			{showDatePicker && (
				<DateTimePicker
					value={patientData[currentField] || new Date()}
					mode="date"
					display={Platform.OS === 'ios' ? 'spinner' : 'default'}
					onChange={handleDateChange}
					maximumDate={new Date()}
				/>
			)}
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
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
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
		textAlign: 'center',
		flex: 1,
	},
	placeholder: {
		width: 40,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	section: {
		marginBottom: 25,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 15,
		paddingBottom: 8,
		borderBottomWidth: 2,
		borderBottomColor: '#10b981',
	},
	sectionContent: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	inputContainer: {
		marginBottom: 15,
	},
	inputLabel: {
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
		marginBottom: 5,
	},
	requiredField: {
		color: '#dc2626',
	},
	textInput: {
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		backgroundColor: '#fff',
	},
	inputError: {
		borderColor: '#dc2626',
	},
	errorText: {
		color: '#dc2626',
		fontSize: 12,
		marginTop: 4,
	},
	pickerContainer: {
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 8,
		backgroundColor: '#fff',
	},
	picker: {
		height: 50,
	},
	dateInput: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 12,
		backgroundColor: '#fff',
	},
	dateText: {
		fontSize: 16,
		color: '#374151',
	},
	emergencyToggle: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	emergencyText: {
		fontSize: 16,
		fontWeight: '500',
		color: '#6b7280',
		marginLeft: 10,
	},
	emergencyTextActive: {
		color: '#dc2626',
		fontWeight: '600',
	},
	submitButton: {
		flexDirection: 'row',
		backgroundColor: '#10b981',
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#10b981',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
		marginTop: 10,
	},
	disabledButton: {
		backgroundColor: '#9ca3af',
		shadowOpacity: 0.1,
	},
	submitButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
		marginLeft: 10,
	},
	bottomSpacing: {
		height: 30,
	},
});

export default PatientRegistration;