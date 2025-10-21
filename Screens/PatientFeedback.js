import React, { useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Alert,
	SafeAreaView,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const PatientFeedback = (props) => {
	const [feedbackData, setFeedbackData] = useState({
		doctorRating: 0,
		nursingRating: 0,
		facilityRating: 0,
		billingRating: 0,
		overallRating: 0,
		waitTime: 0,
		cleanliness: 0,
		communication: 0,
		comments: '',
		visitType: 'OPD',
		department: 'General Medicine',
	});

	const [submitted, setSubmitted] = useState(false);

	const renderStarRating = (rating, setRating, label) => (
		<View style={styles.ratingSection}>
			<Text style={styles.ratingLabel}>{label}</Text>
			<View style={styles.starContainer}>
				{[1, 2, 3, 4, 5].map((star) => (
					<TouchableOpacity
						key={star}
						onPress={() => setRating(star)}
						style={styles.starButton}
					>
						<MaterialIcons
							name={star <= rating ? 'star' : 'star-border'}
							size={30}
							color={star <= rating ? '#FFD700' : '#DDD'}
						/>
					</TouchableOpacity>
				))}
				<Text style={styles.ratingText}>
					{rating === 0 ? 'Not Rated' :
					 rating === 1 ? 'Poor' :
					 rating === 2 ? 'Fair' :
					 rating === 3 ? 'Good' :
					 rating === 4 ? 'Very Good' : 'Excellent'}
				</Text>
			</View>
		</View>
	);

	const handleSubmitFeedback = () => {
		if (feedbackData.overallRating === 0) {
			Alert.alert('Required', 'Please provide an overall rating before submitting.');
			return;
		}

		Alert.alert(
			'Feedback Submitted Successfully!',
			`Thank you for your valuable feedback. Your overall rating: ${feedbackData.overallRating} stars.\n\nFeedback Summary:\n• Doctor: ${feedbackData.doctorRating}/5\n• Nursing: ${feedbackData.nursingRating}/5\n• Facilities: ${feedbackData.facilityRating}/5\n• Overall Experience: ${feedbackData.overallRating}/5\n\nYour feedback helps us improve our services.`,
			[
				{
					text: 'Submit Another',
					onPress: () => {
						setFeedbackData({
							doctorRating: 0,
							nursingRating: 0,
							facilityRating: 0,
							billingRating: 0,
							overallRating: 0,
							waitTime: 0,
							cleanliness: 0,
							communication: 0,
							comments: '',
							visitType: 'OPD',
							department: 'General Medicine',
						});
						setSubmitted(false);
					}
				},
				{
					text: 'Done',
					onPress: () => props.navigation.goBack()
				}
			]
		);
		setSubmitted(true);
	};

	if (submitted) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.successContainer}>
					<MaterialIcons name="check-circle" size={80} color="#10b981" />
					<Text style={styles.successTitle}>Thank You!</Text>
					<Text style={styles.successText}>
						Your feedback has been submitted successfully and will help us improve our services.
					</Text>
					<TouchableOpacity
						style={styles.doneButton}
						onPress={() => props.navigation.goBack()}
					>
						<Text style={styles.doneButtonText}>Done</Text>
					</TouchableOpacity>
				</View>
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
				<Text style={styles.headerTitle}>Patient Feedback</Text>
				<View style={styles.placeholder} />
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.introCard}>
					<MaterialIcons name="feedback" size={40} color="#06b6d4" />
					<Text style={styles.introTitle}>Share Your Experience</Text>
					<Text style={styles.introText}>
						Your feedback is valuable to us. Please rate your experience to help us improve our services.
					</Text>
				</View>

				{/* Visit Information */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Visit Information</Text>
					<View style={styles.visitInfo}>
						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Visit Type:</Text>
							<Text style={styles.infoValue}>{feedbackData.visitType}</Text>
						</View>
						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Department:</Text>
							<Text style={styles.infoValue}>{feedbackData.department}</Text>
						</View>
						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Date:</Text>
							<Text style={styles.infoValue}>{new Date().toDateString()}</Text>
						</View>
					</View>
				</View>

				{/* Main Ratings */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Rate Your Experience</Text>

					{renderStarRating(
						feedbackData.doctorRating,
						(rating) => setFeedbackData({...feedbackData, doctorRating: rating}),
						'👨‍⚕️ Doctor Consultation'
					)}

					{renderStarRating(
						feedbackData.nursingRating,
						(rating) => setFeedbackData({...feedbackData, nursingRating: rating}),
						'👩‍⚕️ Nursing Care'
					)}

					{renderStarRating(
						feedbackData.facilityRating,
						(rating) => setFeedbackData({...feedbackData, facilityRating: rating}),
						'🏥 Hospital Facilities'
					)}

					{renderStarRating(
						feedbackData.billingRating,
						(rating) => setFeedbackData({...feedbackData, billingRating: rating}),
						'💳 Billing Process'
					)}

					{renderStarRating(
						feedbackData.waitTime,
						(rating) => setFeedbackData({...feedbackData, waitTime: rating}),
						'⏰ Wait Time'
					)}

					{renderStarRating(
						feedbackData.cleanliness,
						(rating) => setFeedbackData({...feedbackData, cleanliness: rating}),
						'🧼 Cleanliness'
					)}

					{renderStarRating(
						feedbackData.communication,
						(rating) => setFeedbackData({...feedbackData, communication: rating}),
						'💬 Communication'
					)}
				</View>

				{/* Overall Rating */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Overall Experience *</Text>
					{renderStarRating(
						feedbackData.overallRating,
						(rating) => setFeedbackData({...feedbackData, overallRating: rating}),
						'⭐ Rate Your Overall Experience'
					)}
				</View>

				{/* Comments */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Additional Comments</Text>
					<TextInput
						style={styles.commentInput}
						placeholder="Please share any additional feedback, suggestions, or concerns..."
						value={feedbackData.comments}
						onChangeText={(text) => setFeedbackData({...feedbackData, comments: text})}
						multiline
						numberOfLines={4}
						textAlignVertical="top"
					/>
				</View>

				{/* Quick Feedback Options */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Quick Feedback</Text>
					<View style={styles.quickOptions}>
						<TouchableOpacity style={styles.quickOption}>
							<MaterialIcons name="thumb-up" size={20} color="#10b981" />
							<Text style={styles.quickText}>Excellent Service</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.quickOption}>
							<MaterialIcons name="schedule" size={20} color="#f59e0b" />
							<Text style={styles.quickText}>Long Wait Time</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.quickOption}>
							<MaterialIcons name="local-hospital" size={20} color="#06b6d4" />
							<Text style={styles.quickText}>Great Facilities</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.quickOption}>
							<MaterialIcons name="people" size={20} color="#8b5cf6" />
							<Text style={styles.quickText}>Helpful Staff</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Submit Button */}
				<TouchableOpacity
					style={styles.submitButton}
					onPress={handleSubmitFeedback}
				>
					<MaterialIcons name="send" size={24} color="white" />
					<Text style={styles.submitButtonText}>Submit Feedback</Text>
				</TouchableOpacity>

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
	visitInfo: {
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
	},
	infoValue: {
		fontSize: 14,
		color: '#1f2937',
		fontWeight: '600',
	},
	ratingSection: {
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
	ratingLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 12,
	},
	starContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	starButton: {
		padding: 4,
	},
	ratingText: {
		marginLeft: 12,
		fontSize: 14,
		color: '#6b7280',
		fontWeight: '500',
	},
	commentInput: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		fontSize: 14,
		color: '#1f2937',
		borderWidth: 1,
		borderColor: '#e5e7eb',
		minHeight: 100,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	quickOptions: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	quickOption: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 12,
		borderRadius: 8,
		width: '48%',
		marginBottom: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	quickText: {
		marginLeft: 8,
		fontSize: 12,
		color: '#374151',
		fontWeight: '500',
	},
	submitButton: {
		backgroundColor: '#06b6d4',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
		borderRadius: 12,
		marginTop: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	submitButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
	},
	successContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 40,
	},
	successTitle: {
		fontSize: 28,
		fontWeight: '700',
		color: '#10b981',
		marginTop: 20,
		marginBottom: 16,
	},
	successText: {
		fontSize: 16,
		color: '#6b7280',
		textAlign: 'center',
		lineHeight: 24,
		marginBottom: 32,
	},
	doneButton: {
		backgroundColor: '#10b981',
		paddingHorizontal: 32,
		paddingVertical: 12,
		borderRadius: 25,
	},
	doneButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
	bottomSpacing: {
		height: 40,
	},
});

export default PatientFeedback;