import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	Alert,
	Dimensions,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const { width } = Dimensions.get('window');

const FeedbackAnalytics = (props) => {
	const [selectedTimeFrame, setSelectedTimeFrame] = useState('month');
	const [selectedDepartment, setSelectedDepartment] = useState('all');

	// Mock analytics data - would come from database in real implementation
	const [analyticsData, setAnalyticsData] = useState({
		overallStats: {
			totalFeedbacks: 1247,
			averageRating: 4.2,
			responseRate: 78.5,
			npsScore: 67,
		},
		timeFrameStats: {
			thisMonth: { feedbacks: 342, rating: 4.2, change: '+5.3%' },
			lastMonth: { feedbacks: 325, rating: 4.0, change: '+2.1%' },
			thisQuarter: { feedbacks: 1041, rating: 4.1, change: '+8.7%' },
		},
		departmentRatings: [
			{ name: 'Cardiology', rating: 4.5, feedbacks: 156, trend: 'up' },
			{ name: 'Orthopedics', rating: 4.3, feedbacks: 134, trend: 'up' },
			{ name: 'Neurology', rating: 4.2, feedbacks: 98, trend: 'stable' },
			{ name: 'Emergency', rating: 3.9, feedbacks: 203, trend: 'down' },
			{ name: 'General Medicine', rating: 4.1, feedbacks: 187, trend: 'up' },
			{ name: 'Pediatrics', rating: 4.6, feedbacks: 89, trend: 'up' },
		],
		categoryBreakdown: {
			doctorConsultation: { average: 4.3, count: 1247 },
			nursingCare: { average: 4.4, count: 1189 },
			facilities: { average: 4.0, count: 1198 },
			billingProcess: { average: 3.8, count: 1156 },
			waitTime: { average: 3.6, count: 1234 },
			cleanliness: { average: 4.2, count: 1201 },
			communication: { average: 4.1, count: 1223 },
		},
		recentFeedbacks: [
			{
				id: '1',
				patient: 'John D.',
				department: 'Cardiology',
				overallRating: 5,
				date: '2024-10-20',
				comment: 'Excellent care and very professional staff.',
				categories: { doctor: 5, nursing: 5, facilities: 4, billing: 5 }
			},
			{
				id: '2',
				patient: 'Sarah M.',
				department: 'Emergency',
				overallRating: 3,
				date: '2024-10-20',
				comment: 'Long wait time but good treatment once seen.',
				categories: { doctor: 4, nursing: 4, facilities: 3, billing: 3 }
			},
			{
				id: '3',
				patient: 'Mike R.',
				department: 'Orthopedics',
				overallRating: 4,
				date: '2024-10-19',
				comment: 'Good service overall, room for improvement in billing.',
				categories: { doctor: 5, nursing: 4, facilities: 4, billing: 2 }
			},
		],
		consentStats: {
			totalConsents: 892,
			digitalConsents: 734,
			paperConsents: 158,
			completionRate: 96.8,
			averageTime: '4.2 minutes',
		},
		trends: {
			satisfactionTrend: [3.8, 3.9, 4.0, 4.1, 4.2, 4.2], // Last 6 months
			volumeTrend: [298, 312, 345, 387, 325, 342], // Last 6 months
		}
	});

	const renderStatCard = (title, value, subtitle, icon, color, onPress) => (
		<TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
			<View style={styles.statContent}>
				<View style={styles.statText}>
					<Text style={styles.statValue}>{value}</Text>
					<Text style={styles.statTitle}>{title}</Text>
					{subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
				</View>
				<View style={[styles.statIcon, { backgroundColor: color }]}>
					<MaterialIcons name={icon} size={24} color="white" />
				</View>
			</View>
		</TouchableOpacity>
	);

	const renderTimeFrameButton = (timeFrame, label) => (
		<TouchableOpacity
			style={[styles.timeFrameButton, selectedTimeFrame === timeFrame && styles.activeTimeFrameButton]}
			onPress={() => setSelectedTimeFrame(timeFrame)}
		>
			<Text style={[
				styles.timeFrameButtonText,
				selectedTimeFrame === timeFrame && styles.activeTimeFrameButtonText
			]}>
				{label}
			</Text>
		</TouchableOpacity>
	);

	const renderDepartmentRating = (department) => (
		<View key={department.name} style={styles.departmentCard}>
			<View style={styles.departmentHeader}>
				<Text style={styles.departmentName}>{department.name}</Text>
				<View style={styles.ratingContainer}>
					<MaterialIcons name="star" size={16} color="#FFD700" />
					<Text style={styles.departmentRating}>{department.rating}</Text>
					<MaterialIcons
						name={department.trend === 'up' ? 'trending-up' : department.trend === 'down' ? 'trending-down' : 'trending-flat'}
						size={16}
						color={department.trend === 'up' ? '#10b981' : department.trend === 'down' ? '#ef4444' : '#6b7280'}
					/>
				</View>
			</View>
			<Text style={styles.departmentFeedbacks}>{department.feedbacks} feedbacks</Text>
			<View style={styles.ratingBar}>
				<View style={[styles.ratingFill, { width: `${(department.rating / 5) * 100}%` }]} />
			</View>
		</View>
	);

	const renderCategoryCard = (category, data) => (
		<View key={category} style={styles.categoryCard}>
			<Text style={styles.categoryName}>{category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Text>
			<View style={styles.categoryStats}>
				<View style={styles.categoryRating}>
					<MaterialIcons name="star" size={14} color="#FFD700" />
					<Text style={styles.categoryRatingText}>{data.average}</Text>
				</View>
				<Text style={styles.categoryCount}>{data.count} responses</Text>
			</View>
			<View style={styles.categoryBar}>
				<View style={[styles.categoryFill, { width: `${(data.average / 5) * 100}%` }]} />
			</View>
		</View>
	);

	const renderRecentFeedback = (feedback) => (
		<View key={feedback.id} style={styles.feedbackCard}>
			<View style={styles.feedbackHeader}>
				<View>
					<Text style={styles.feedbackPatient}>{feedback.patient}</Text>
					<Text style={styles.feedbackDepartment}>{feedback.department}</Text>
				</View>
				<View style={styles.feedbackRating}>
					{[1, 2, 3, 4, 5].map((star) => (
						<MaterialIcons
							key={star}
							name="star"
							size={14}
							color={star <= feedback.overallRating ? '#FFD700' : '#DDD'}
						/>
					))}
				</View>
			</View>
			<Text style={styles.feedbackComment}>{feedback.comment}</Text>
			<Text style={styles.feedbackDate}>{feedback.date}</Text>
		</View>
	);

	const generateReport = () => {
		Alert.alert(
			'Feedback Analytics Report',
			`PATIENT FEEDBACK ANALYTICS REPORT
Period: ${selectedTimeFrame === 'month' ? 'This Month' : selectedTimeFrame === 'quarter' ? 'This Quarter' : 'This Year'}

📊 OVERVIEW:
• Total Feedbacks: ${analyticsData.overallStats.totalFeedbacks}
• Average Rating: ${analyticsData.overallStats.averageRating}/5
• Response Rate: ${analyticsData.overallStats.responseRate}%
• NPS Score: ${analyticsData.overallStats.npsScore}

🏆 TOP PERFORMING DEPARTMENTS:
• Pediatrics: 4.6/5 (89 feedbacks)
• Cardiology: 4.5/5 (156 feedbacks)
• Orthopedics: 4.3/5 (134 feedbacks)

⚠️ AREAS FOR IMPROVEMENT:
• Wait Time: 3.6/5 average
• Billing Process: 3.8/5 average
• Emergency Department: 3.9/5 average

📈 TRENDS:
• Overall satisfaction increased 5.3% this month
• Feedback volume up 342 responses
• Digital consent adoption: 82.3%

💡 RECOMMENDATIONS:
• Focus on reducing wait times
• Improve billing process transparency
• Enhance emergency department workflow
• Continue promoting feedback collection`,
			[
				{ text: 'Export PDF', onPress: () => Alert.alert('Export', 'Report exported to PDF successfully.') },
				{ text: 'Email Report', onPress: () => Alert.alert('Email', 'Report emailed to management team.') },
				{ text: 'OK' }
			]
		);
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
				<Text style={styles.headerTitle}>Feedback Analytics</Text>
				<TouchableOpacity style={styles.reportButton} onPress={generateReport}>
					<MaterialIcons name="assessment" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Time Frame Selector */}
				<View style={styles.timeFrameSelector}>
					{renderTimeFrameButton('week', 'This Week')}
					{renderTimeFrameButton('month', 'This Month')}
					{renderTimeFrameButton('quarter', 'This Quarter')}
					{renderTimeFrameButton('year', 'This Year')}
				</View>

				{/* Overview Stats */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Overview</Text>
					<View style={styles.statsGrid}>
						{renderStatCard(
							'Total Feedbacks',
							analyticsData.overallStats.totalFeedbacks.toLocaleString(),
							'All time',
							'feedback',
							'#06b6d4'
						)}
						{renderStatCard(
							'Average Rating',
							`${analyticsData.overallStats.averageRating}/5`,
							'+5.3% this month',
							'star',
							'#10b981'
						)}
						{renderStatCard(
							'Response Rate',
							`${analyticsData.overallStats.responseRate}%`,
							'Above target',
							'trending-up',
							'#8b5cf6'
						)}
						{renderStatCard(
							'NPS Score',
							analyticsData.overallStats.npsScore.toString(),
							'Good standing',
							'thumb-up',
							'#f59e0b'
						)}
					</View>
				</View>

				{/* Department Performance */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Department Performance</Text>
					<View style={styles.departmentGrid}>
						{analyticsData.departmentRatings.map(renderDepartmentRating)}
					</View>
				</View>

				{/* Category Breakdown */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Category Breakdown</Text>
					<View style={styles.categoryGrid}>
						{Object.entries(analyticsData.categoryBreakdown).map(([category, data]) =>
							renderCategoryCard(category, data)
						)}
					</View>
				</View>

				{/* Consent Analytics */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Digital Consent Analytics</Text>
					<View style={styles.consentStats}>
						<View style={styles.consentStatCard}>
							<Text style={styles.consentStatValue}>{analyticsData.consentStats.totalConsents}</Text>
							<Text style={styles.consentStatLabel}>Total Consents</Text>
						</View>
						<View style={styles.consentStatCard}>
							<Text style={styles.consentStatValue}>{analyticsData.consentStats.digitalConsents}</Text>
							<Text style={styles.consentStatLabel}>Digital Consents</Text>
						</View>
						<View style={styles.consentStatCard}>
							<Text style={styles.consentStatValue}>{analyticsData.consentStats.completionRate}%</Text>
							<Text style={styles.consentStatLabel}>Completion Rate</Text>
						</View>
						<View style={styles.consentStatCard}>
							<Text style={styles.consentStatValue}>{analyticsData.consentStats.averageTime}</Text>
							<Text style={styles.consentStatLabel}>Avg. Time</Text>
						</View>
					</View>
				</View>

				{/* Recent Feedbacks */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Recent Feedbacks</Text>
					{analyticsData.recentFeedbacks.map(renderRecentFeedback)}
				</View>

				{/* Action Buttons */}
				<View style={styles.actionSection}>
					<TouchableOpacity
						style={styles.actionButton}
						onPress={() => Alert.alert('Filter', 'Open advanced filter options for detailed analysis.')}
					>
						<MaterialIcons name="filter-list" size={20} color="white" />
						<Text style={styles.actionButtonText}>Advanced Filters</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.actionButton, { backgroundColor: '#10b981' }]}
						onPress={generateReport}
					>
						<MaterialIcons name="download" size={20} color="white" />
						<Text style={styles.actionButtonText}>Export Report</Text>
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
		backgroundColor: '#6366f1',
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
	reportButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	content: {
		flex: 1,
		paddingHorizontal: 15,
	},
	timeFrameSelector: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: 'white',
		marginTop: 15,
		borderRadius: 12,
		padding: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	timeFrameButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
	},
	activeTimeFrameButton: {
		backgroundColor: '#6366f1',
	},
	timeFrameButtonText: {
		fontSize: 14,
		color: '#6b7280',
		fontWeight: '500',
	},
	activeTimeFrameButtonText: {
		color: 'white',
	},
	section: {
		marginTop: 20,
		marginBottom: 10,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 15,
	},
	statsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	statCard: {
		width: '48%',
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		borderLeftWidth: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	statContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	statText: {
		flex: 1,
	},
	statValue: {
		fontSize: 20,
		fontWeight: '700',
		color: '#1f2937',
		marginBottom: 4,
	},
	statTitle: {
		fontSize: 14,
		color: '#6b7280',
		fontWeight: '500',
	},
	statSubtitle: {
		fontSize: 12,
		color: '#10b981',
		fontWeight: '500',
		marginTop: 2,
	},
	statIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	departmentGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	departmentCard: {
		width: '48%',
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
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
		flex: 1,
	},
	ratingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	departmentRating: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
		marginHorizontal: 4,
	},
	departmentFeedbacks: {
		fontSize: 12,
		color: '#6b7280',
		marginBottom: 8,
	},
	ratingBar: {
		height: 4,
		backgroundColor: '#e5e7eb',
		borderRadius: 2,
		overflow: 'hidden',
	},
	ratingFill: {
		height: '100%',
		backgroundColor: '#10b981',
	},
	categoryGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	categoryCard: {
		width: '48%',
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 12,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	categoryName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 8,
	},
	categoryStats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	categoryRating: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	categoryRatingText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
		marginLeft: 4,
	},
	categoryCount: {
		fontSize: 12,
		color: '#6b7280',
	},
	categoryBar: {
		height: 3,
		backgroundColor: '#e5e7eb',
		borderRadius: 2,
		overflow: 'hidden',
	},
	categoryFill: {
		height: '100%',
		backgroundColor: '#06b6d4',
	},
	consentStats: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	consentStatCard: {
		width: '48%',
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	consentStatValue: {
		fontSize: 24,
		fontWeight: '700',
		color: '#8b5cf6',
		marginBottom: 4,
	},
	consentStatLabel: {
		fontSize: 12,
		color: '#6b7280',
		textAlign: 'center',
	},
	feedbackCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	feedbackHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	feedbackPatient: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	feedbackDepartment: {
		fontSize: 14,
		color: '#6b7280',
	},
	feedbackRating: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	feedbackComment: {
		fontSize: 14,
		color: '#374151',
		lineHeight: 20,
		marginBottom: 8,
		fontStyle: 'italic',
	},
	feedbackDate: {
		fontSize: 12,
		color: '#6b7280',
	},
	actionSection: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
		gap: 12,
	},
	actionButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#6366f1',
		padding: 16,
		borderRadius: 12,
	},
	actionButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
	},
	bottomSpacing: {
		height: 40,
	},
});

export default FeedbackAnalytics;