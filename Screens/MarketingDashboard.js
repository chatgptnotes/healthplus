import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	Alert,
	FlatList,
	Switch,
	TextInput,
	Modal,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const MarketingDashboard = (props) => {
	const [selectedTab, setSelectedTab] = useState('overview');
	const [isCreateCampaignModal, setIsCreateCampaignModal] = useState(false);

	// Marketing team and leadership
	const [marketingTeam] = useState([
		{ id: '1', name: 'सुश्री नेहा सिंह', role: 'Marketing Leader', department: 'Digital Marketing', active: true },
		{ id: '2', name: 'श्री विकास शर्मा', role: 'Content Manager', department: 'Creative Team', active: true },
		{ id: '3', name: 'श्रीमती अंजलि गुप्ता', role: 'Social Media Manager', department: 'Digital Marketing', active: true },
		{ id: '4', name: 'श्री सुनील कुमार', role: 'Brand Manager', department: 'Brand Strategy', active: false },
	]);

	// Marketing metrics and campaigns data
	const [marketingData, setMarketingData] = useState({
		monthlyBudget: 2500000,
		budgetUsed: 1850000,
		budgetRemaining: 650000,
		totalCampaigns: 12,
		activeCampaigns: 5,
		completedCampaigns: 7,
		socialMediaFollowers: {
			facebook: 45200,
			instagram: 32800,
			twitter: 18500,
			linkedin: 12400,
			youtube: 8900,
		},
		campaignPerformance: {
			avgReach: 125000,
			avgEngagement: 8.5,
			avgCTR: 3.2,
			avgConversion: 2.1,
			totalLeads: 1247,
			qualifiedLeads: 823,
		},
		activeCampaigns: [
			{
				id: '1',
				name: 'Hope Hospital Excellence Campaign',
				type: 'Brand Awareness',
				platform: 'Multi-platform',
				budget: 500000,
				spent: 320000,
				status: 'Active',
				startDate: '2024-10-01',
				endDate: '2024-10-31',
				reach: 85000,
				engagement: 9.2,
				leads: 156,
				manager: 'सुश्री नेहा सिंह'
			},
			{
				id: '2',
				name: 'Cardiac Care Specialization',
				type: 'Service Promotion',
				platform: 'Google Ads',
				budget: 300000,
				spent: 185000,
				status: 'Active',
				startDate: '2024-10-10',
				endDate: '2024-11-10',
				reach: 42000,
				engagement: 7.8,
				leads: 89,
				manager: 'श्री विकास शर्मा'
			},
			{
				id: '3',
				name: 'Maternal Care Program',
				type: 'Health Education',
				platform: 'Social Media',
				budget: 200000,
				spent: 125000,
				status: 'Active',
				startDate: '2024-09-25',
				endDate: '2024-11-25',
				reach: 67000,
				engagement: 12.4,
				leads: 234,
				manager: 'श्रीमती अंजलि गुप्ता'
			},
		],
		upcomingCampaigns: [
			{
				id: '4',
				name: 'Preventive Health Checkup',
				type: 'Service Promotion',
				platform: 'Digital Marketing',
				budget: 400000,
				launchDate: '2024-11-01',
				manager: 'सुश्री नेहा सिंह',
				status: 'Planning'
			},
			{
				id: '5',
				name: 'Orthopedic Excellence',
				type: 'Specialty Focus',
				platform: 'Print & Digital',
				budget: 350000,
				launchDate: '2024-11-15',
				manager: 'श्री विकास शर्मा',
				status: 'Creative Development'
			},
		],
		contentCalendar: [
			{ date: '2024-10-22', type: 'Blog Post', title: 'Heart Health Tips for Seniors', platform: 'Website', status: 'Scheduled' },
			{ date: '2024-10-23', type: 'Social Media', title: 'Patient Success Story', platform: 'Instagram', status: 'Approved' },
			{ date: '2024-10-24', type: 'Video', title: 'Doctor Interview - Diabetes Care', platform: 'YouTube', status: 'In Production' },
			{ date: '2024-10-25', type: 'Infographic', title: 'Vaccination Schedule', platform: 'Facebook', status: 'Design Review' },
		],
		marketingChannels: [
			{ channel: 'Digital Advertising', budget: 800000, spent: 580000, performance: 'Good', roi: 4.2 },
			{ channel: 'Social Media Marketing', budget: 400000, spent: 285000, performance: 'Excellent', roi: 5.8 },
			{ channel: 'Content Marketing', budget: 300000, spent: 195000, performance: 'Good', roi: 3.9 },
			{ channel: 'Print Advertising', budget: 250000, spent: 180000, performance: 'Average', roi: 2.1 },
			{ channel: 'Event Marketing', budget: 200000, spent: 125000, performance: 'Good', roi: 3.5 },
			{ channel: 'SEO & Website', budget: 150000, spent: 98000, performance: 'Excellent', roi: 6.2 },
		],
		leadGeneration: {
			totalLeads: 1247,
			qualifiedLeads: 823,
			convertedLeads: 387,
			conversionRate: 31.1,
			leadSources: [
				{ source: 'Google Ads', leads: 456, conversion: 35.2 },
				{ source: 'Facebook Ads', leads: 298, conversion: 28.9 },
				{ source: 'Organic Search', leads: 234, conversion: 41.2 },
				{ source: 'Referrals', leads: 189, conversion: 25.4 },
				{ source: 'Direct Website', leads: 70, conversion: 18.6 },
			]
		}
	});

	const renderTabButton = (tab, label, icon) => (
		<TouchableOpacity
			style={[styles.tabButton, selectedTab === tab && styles.activeTab]}
			onPress={() => setSelectedTab(tab)}
		>
			<MaterialIcons name={icon} size={20} color={selectedTab === tab ? '#e91e63' : '#6b7280'} />
			<Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{label}</Text>
		</TouchableOpacity>
	);

	const renderMetricCard = (title, value, subtitle, icon, color, change) => (
		<View style={[styles.metricCard, { borderLeftColor: color }]}>
			<View style={styles.metricContent}>
				<View style={styles.metricText}>
					<Text style={styles.metricValue}>{value}</Text>
					<Text style={styles.metricTitle}>{title}</Text>
					{subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
					{change && (
						<Text style={[styles.metricChange, { color: change.startsWith('+') ? '#10b981' : '#ef4444' }]}>
							{change}
						</Text>
					)}
				</View>
				<View style={[styles.metricIcon, { backgroundColor: color }]}>
					<MaterialIcons name={icon} size={20} color="white" />
				</View>
			</View>
		</View>
	);

	const renderCampaignCard = (campaign) => (
		<View key={campaign.id} style={styles.campaignCard}>
			<View style={styles.campaignHeader}>
				<Text style={styles.campaignName}>{campaign.name}</Text>
				<View style={[styles.statusBadge, {
					backgroundColor: campaign.status === 'Active' ? '#10b981' :
									campaign.status === 'Planning' ? '#f59e0b' : '#6b7280'
				}]}>
					<Text style={styles.statusText}>{campaign.status}</Text>
				</View>
			</View>
			<View style={styles.campaignDetails}>
				<Text style={styles.campaignType}>{campaign.type} • {campaign.platform}</Text>
				<Text style={styles.campaignManager}>Manager: {campaign.manager}</Text>
			</View>
			{campaign.status === 'Active' && (
				<>
					<View style={styles.budgetBar}>
						<View style={styles.budgetInfo}>
							<Text style={styles.budgetText}>₹{campaign.spent.toLocaleString()} / ₹{campaign.budget.toLocaleString()}</Text>
							<Text style={styles.budgetPercent}>{Math.round((campaign.spent / campaign.budget) * 100)}%</Text>
						</View>
						<View style={styles.progressBar}>
							<View style={[styles.progressFill, { width: `${(campaign.spent / campaign.budget) * 100}%` }]} />
						</View>
					</View>
					<View style={styles.campaignMetrics}>
						<View style={styles.metricItem}>
							<Text style={styles.metricLabel}>Reach</Text>
							<Text style={styles.metricData}>{campaign.reach.toLocaleString()}</Text>
						</View>
						<View style={styles.metricItem}>
							<Text style={styles.metricLabel}>Engagement</Text>
							<Text style={styles.metricData}>{campaign.engagement}%</Text>
						</View>
						<View style={styles.metricItem}>
							<Text style={styles.metricLabel}>Leads</Text>
							<Text style={styles.metricData}>{campaign.leads}</Text>
						</View>
					</View>
				</>
			)}
		</View>
	);

	const renderChannelCard = (channel) => (
		<View key={channel.channel} style={styles.channelCard}>
			<View style={styles.channelHeader}>
				<Text style={styles.channelName}>{channel.channel}</Text>
				<View style={[styles.performanceBadge, {
					backgroundColor: channel.performance === 'Excellent' ? '#10b981' :
									channel.performance === 'Good' ? '#06b6d4' : '#f59e0b'
				}]}>
					<Text style={styles.performanceText}>{channel.performance}</Text>
				</View>
			</View>
			<View style={styles.channelBudget}>
				<Text style={styles.budgetLabel}>Budget: ₹{channel.budget.toLocaleString()}</Text>
				<Text style={styles.spentLabel}>Spent: ₹{channel.spent.toLocaleString()}</Text>
			</View>
			<View style={styles.roiContainer}>
				<Text style={styles.roiLabel}>ROI: {channel.roi}x</Text>
				<Text style={[styles.roiValue, {
					color: channel.roi >= 4 ? '#10b981' : channel.roi >= 3 ? '#06b6d4' : '#f59e0b'
				}]}>
					{channel.roi >= 4 ? 'Excellent' : channel.roi >= 3 ? 'Good' : 'Average'}
				</Text>
			</View>
		</View>
	);

	const renderOverviewTab = () => (
		<ScrollView showsVerticalScrollIndicator={false}>
			{/* Budget Overview */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Marketing Budget Overview</Text>
				<View style={styles.budgetOverview}>
					<View style={styles.budgetCard}>
						<Text style={styles.budgetAmount}>₹{marketingData.monthlyBudget.toLocaleString()}</Text>
						<Text style={styles.budgetLabel}>Monthly Budget</Text>
					</View>
					<View style={styles.budgetCard}>
						<Text style={[styles.budgetAmount, { color: '#ef4444' }]}>₹{marketingData.budgetUsed.toLocaleString()}</Text>
						<Text style={styles.budgetLabel}>Used ({Math.round((marketingData.budgetUsed / marketingData.monthlyBudget) * 100)}%)</Text>
					</View>
					<View style={styles.budgetCard}>
						<Text style={[styles.budgetAmount, { color: '#10b981' }]}>₹{marketingData.budgetRemaining.toLocaleString()}</Text>
						<Text style={styles.budgetLabel}>Remaining</Text>
					</View>
				</View>
			</View>

			{/* Key Metrics */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Key Performance Metrics</Text>
				<View style={styles.metricsGrid}>
					{renderMetricCard('Total Campaigns', marketingData.totalCampaigns, `${marketingData.activeCampaigns} active`, 'campaign', '#e91e63', '+15%')}
					{renderMetricCard('Total Leads', marketingData.campaignPerformance.totalLeads.toLocaleString(), `${marketingData.campaignPerformance.qualifiedLeads} qualified`, 'people', '#10b981', '+23%')}
					{renderMetricCard('Avg Reach', `${(marketingData.campaignPerformance.avgReach / 1000).toFixed(0)}K`, 'Per campaign', 'visibility', '#06b6d4', '+8%')}
					{renderMetricCard('Avg Engagement', `${marketingData.campaignPerformance.avgEngagement}%`, 'Across platforms', 'thumb-up', '#f59e0b', '+12%')}
				</View>
			</View>

			{/* Marketing Team */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Marketing Team</Text>
				{marketingTeam.map(member => (
					<View key={member.id} style={styles.teamMemberCard}>
						<View style={styles.memberInfo}>
							<View style={[styles.statusIndicator, {
								backgroundColor: member.active ? '#10b981' : '#ef4444'
							}]} />
							<View style={styles.memberDetails}>
								<Text style={styles.memberName}>{member.name}</Text>
								<Text style={styles.memberRole}>{member.role}</Text>
								<Text style={styles.memberDept}>{member.department}</Text>
							</View>
						</View>
						<View style={styles.memberStatus}>
							<Text style={[styles.statusText, {
								color: member.active ? '#10b981' : '#ef4444'
							}]}>
								{member.active ? 'Active' : 'Away'}
							</Text>
						</View>
					</View>
				))}
			</View>
		</ScrollView>
	);

	const renderCampaignsTab = () => (
		<ScrollView showsVerticalScrollIndicator={false}>
			{/* Active Campaigns */}
			<View style={styles.section}>
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Active Campaigns</Text>
					<TouchableOpacity
						style={styles.addButton}
						onPress={() => setIsCreateCampaignModal(true)}
					>
						<MaterialIcons name="add" size={20} color="white" />
						<Text style={styles.addButtonText}>New Campaign</Text>
					</TouchableOpacity>
				</View>
				{marketingData.activeCampaigns.map(renderCampaignCard)}
			</View>

			{/* Upcoming Campaigns */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Upcoming Campaigns</Text>
				{marketingData.upcomingCampaigns.map(campaign => (
					<View key={campaign.id} style={styles.upcomingCard}>
						<View style={styles.upcomingHeader}>
							<Text style={styles.upcomingName}>{campaign.name}</Text>
							<Text style={styles.upcomingDate}>Launch: {campaign.launchDate}</Text>
						</View>
						<Text style={styles.upcomingType}>{campaign.type} • {campaign.platform}</Text>
						<Text style={styles.upcomingManager}>Manager: {campaign.manager}</Text>
						<Text style={styles.upcomingBudget}>Budget: ₹{campaign.budget.toLocaleString()}</Text>
					</View>
				))}
			</View>
		</ScrollView>
	);

	const renderAnalyticsTab = () => (
		<ScrollView showsVerticalScrollIndicator={false}>
			{/* Social Media Analytics */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Social Media Following</Text>
				<View style={styles.socialGrid}>
					{Object.entries(marketingData.socialMediaFollowers).map(([platform, followers]) => (
						<View key={platform} style={styles.socialCard}>
							<MaterialCommunityIcons
								name={platform === 'facebook' ? 'facebook' :
									 platform === 'instagram' ? 'instagram' :
									 platform === 'twitter' ? 'twitter' :
									 platform === 'linkedin' ? 'linkedin' : 'youtube'}
								size={24}
								color={platform === 'facebook' ? '#1877f2' :
									   platform === 'instagram' ? '#E4405F' :
									   platform === 'twitter' ? '#1DA1F2' :
									   platform === 'linkedin' ? '#0077B5' : '#FF0000'}
							/>
							<Text style={styles.socialPlatform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Text>
							<Text style={styles.socialFollowers}>{followers.toLocaleString()}</Text>
						</View>
					))}
				</View>
			</View>

			{/* Marketing Channels Performance */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Channel Performance</Text>
				{marketingData.marketingChannels.map(renderChannelCard)}
			</View>

			{/* Lead Generation */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Lead Generation Sources</Text>
				{marketingData.leadGeneration.leadSources.map(source => (
					<View key={source.source} style={styles.leadSourceCard}>
						<View style={styles.leadSourceHeader}>
							<Text style={styles.sourceName}>{source.source}</Text>
							<Text style={styles.leadCount}>{source.leads} leads</Text>
						</View>
						<View style={styles.conversionInfo}>
							<Text style={styles.conversionRate}>Conversion: {source.conversion}%</Text>
							<View style={styles.conversionBar}>
								<View style={[styles.conversionFill, { width: `${source.conversion}%` }]} />
							</View>
						</View>
					</View>
				))}
			</View>
		</ScrollView>
	);

	const createNewCampaign = () => {
		Alert.alert(
			'Campaign Created Successfully!',
			'New marketing campaign has been created and added to the planning phase.\n\nNext Steps:\n• Campaign brief preparation\n• Creative development\n• Budget allocation approval\n• Launch date confirmation\n\nCampaign team will be notified.',
			[
				{ text: 'View Campaign', onPress: () => setIsCreateCampaignModal(false) },
				{ text: 'Create Another', onPress: () => setIsCreateCampaignModal(false) },
				{ text: 'Done', onPress: () => setIsCreateCampaignModal(false) }
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
				<Text style={styles.headerTitle}>Marketing Dashboard</Text>
				<TouchableOpacity
					style={styles.reportButton}
					onPress={() => Alert.alert('Marketing Report', 'Comprehensive marketing report generated successfully!')}
				>
					<MaterialIcons name="analytics" size={24} color="white" />
				</TouchableOpacity>
			</View>

			{/* Tab Navigation */}
			<View style={styles.tabContainer}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{renderTabButton('overview', 'Overview', 'dashboard')}
					{renderTabButton('campaigns', 'Campaigns', 'campaign')}
					{renderTabButton('analytics', 'Analytics', 'analytics')}
					{renderTabButton('content', 'Content', 'edit')}
				</ScrollView>
			</View>

			<View style={styles.content}>
				{selectedTab === 'overview' && renderOverviewTab()}
				{selectedTab === 'campaigns' && renderCampaignsTab()}
				{selectedTab === 'analytics' && renderAnalyticsTab()}
				{selectedTab === 'content' && (
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Content Calendar</Text>
							{marketingData.contentCalendar.map((content, index) => (
								<View key={index} style={styles.contentCard}>
									<View style={styles.contentHeader}>
										<Text style={styles.contentDate}>{content.date}</Text>
										<View style={[styles.contentStatus, {
											backgroundColor: content.status === 'Scheduled' ? '#10b981' :
														   content.status === 'Approved' ? '#06b6d4' :
														   content.status === 'In Production' ? '#f59e0b' : '#8b5cf6'
										}]}>
											<Text style={styles.contentStatusText}>{content.status}</Text>
										</View>
									</View>
									<Text style={styles.contentTitle}>{content.title}</Text>
									<Text style={styles.contentType}>{content.type} • {content.platform}</Text>
								</View>
							))}
						</View>
					</ScrollView>
				)}
			</View>

			{/* Create Campaign Modal */}
			<Modal
				visible={isCreateCampaignModal}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setIsCreateCampaignModal(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Create New Campaign</Text>
						<TextInput
							style={styles.modalInput}
							placeholder="Campaign Name"
							placeholderTextColor="#9ca3af"
						/>
						<TextInput
							style={styles.modalInput}
							placeholder="Campaign Type"
							placeholderTextColor="#9ca3af"
						/>
						<TextInput
							style={styles.modalInput}
							placeholder="Budget Amount"
							placeholderTextColor="#9ca3af"
							keyboardType="numeric"
						/>
						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={styles.cancelButton}
								onPress={() => setIsCreateCampaignModal(false)}
							>
								<Text style={styles.cancelButtonText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.createButton}
								onPress={createNewCampaign}
							>
								<Text style={styles.createButtonText}>Create Campaign</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
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
		backgroundColor: '#e91e63',
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
	tabContainer: {
		backgroundColor: 'white',
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#f3f4f6',
	},
	tabButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 10,
		marginRight: 15,
		borderRadius: 8,
		backgroundColor: '#f9fafb',
	},
	activeTab: {
		backgroundColor: '#fce7f3',
	},
	tabText: {
		fontSize: 14,
		color: '#6b7280',
		marginLeft: 8,
		fontWeight: '500',
	},
	activeTabText: {
		color: '#e91e63',
	},
	content: {
		flex: 1,
		paddingHorizontal: 15,
		paddingTop: 20,
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
		marginBottom: 15,
	},
	addButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#e91e63',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
	},
	addButtonText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
		marginLeft: 6,
	},
	budgetOverview: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	budgetCard: {
		backgroundColor: 'white',
		flex: 1,
		marginHorizontal: 5,
		padding: 16,
		borderRadius: 12,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	budgetAmount: {
		fontSize: 16,
		fontWeight: '700',
		color: '#1f2937',
		marginBottom: 4,
	},
	budgetLabel: {
		fontSize: 12,
		color: '#6b7280',
		textAlign: 'center',
	},
	metricsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	metricCard: {
		width: '48%',
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		marginBottom: 12,
		borderLeftWidth: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	metricContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	metricText: {
		flex: 1,
	},
	metricValue: {
		fontSize: 18,
		fontWeight: '700',
		color: '#1f2937',
		marginBottom: 4,
	},
	metricTitle: {
		fontSize: 12,
		color: '#6b7280',
		fontWeight: '500',
	},
	metricSubtitle: {
		fontSize: 10,
		color: '#9ca3af',
		marginTop: 2,
	},
	metricChange: {
		fontSize: 10,
		fontWeight: '600',
		marginTop: 4,
	},
	metricIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	teamMemberCard: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	memberInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	statusIndicator: {
		width: 8,
		height: 40,
		borderRadius: 4,
		marginRight: 12,
	},
	memberDetails: {
		flex: 1,
	},
	memberName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	memberRole: {
		fontSize: 14,
		color: '#e91e63',
		fontWeight: '500',
		marginTop: 2,
	},
	memberDept: {
		fontSize: 12,
		color: '#6b7280',
		marginTop: 1,
	},
	memberStatus: {
		alignItems: 'flex-end',
	},
	campaignCard: {
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
	campaignHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	campaignName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		flex: 1,
		marginRight: 10,
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
	campaignDetails: {
		marginBottom: 12,
	},
	campaignType: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 4,
	},
	campaignManager: {
		fontSize: 12,
		color: '#9ca3af',
	},
	budgetBar: {
		marginBottom: 12,
	},
	budgetInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 6,
	},
	budgetText: {
		fontSize: 12,
		color: '#374151',
	},
	budgetPercent: {
		fontSize: 12,
		color: '#6b7280',
		fontWeight: '500',
	},
	progressBar: {
		height: 4,
		backgroundColor: '#e5e7eb',
		borderRadius: 2,
		overflow: 'hidden',
	},
	progressFill: {
		height: '100%',
		backgroundColor: '#e91e63',
	},
	campaignMetrics: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	metricItem: {
		alignItems: 'center',
	},
	metricLabel: {
		fontSize: 10,
		color: '#9ca3af',
		marginBottom: 2,
	},
	metricData: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
	},
	upcomingCard: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		borderLeftWidth: 4,
		borderLeftColor: '#f59e0b',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	upcomingHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	upcomingName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		flex: 1,
	},
	upcomingDate: {
		fontSize: 12,
		color: '#f59e0b',
		fontWeight: '500',
	},
	upcomingType: {
		fontSize: 14,
		color: '#6b7280',
		marginBottom: 4,
	},
	upcomingManager: {
		fontSize: 12,
		color: '#9ca3af',
		marginBottom: 4,
	},
	upcomingBudget: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
	},
	socialGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	socialCard: {
		width: '48%',
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		alignItems: 'center',
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	socialPlatform: {
		fontSize: 12,
		fontWeight: '500',
		color: '#6b7280',
		marginTop: 8,
		marginBottom: 4,
	},
	socialFollowers: {
		fontSize: 16,
		fontWeight: '700',
		color: '#1f2937',
	},
	channelCard: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	channelHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	channelName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	performanceBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	performanceText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '500',
	},
	channelBudget: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	budgetLabel: {
		fontSize: 14,
		color: '#6b7280',
	},
	spentLabel: {
		fontSize: 14,
		color: '#374151',
		fontWeight: '500',
	},
	roiContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	roiLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
	},
	roiValue: {
		fontSize: 12,
		fontWeight: '500',
	},
	leadSourceCard: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	leadSourceHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	sourceName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	leadCount: {
		fontSize: 14,
		color: '#6b7280',
	},
	conversionInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	conversionRate: {
		fontSize: 12,
		color: '#374151',
		marginRight: 10,
		minWidth: 100,
	},
	conversionBar: {
		flex: 1,
		height: 4,
		backgroundColor: '#e5e7eb',
		borderRadius: 2,
		overflow: 'hidden',
	},
	conversionFill: {
		height: '100%',
		backgroundColor: '#10b981',
	},
	contentCard: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	contentHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	contentDate: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
	},
	contentStatus: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	contentStatusText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
	},
	contentTitle: {
		fontSize: 16,
		fontWeight: '500',
		color: '#374151',
		marginBottom: 4,
	},
	contentType: {
		fontSize: 12,
		color: '#6b7280',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: 'white',
		margin: 20,
		padding: 24,
		borderRadius: 12,
		width: '90%',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 20,
		textAlign: 'center',
	},
	modalInput: {
		borderWidth: 1,
		borderColor: '#e5e7eb',
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
		fontSize: 16,
		color: '#374151',
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
	},
	cancelButton: {
		flex: 1,
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e5e7eb',
		marginRight: 8,
		alignItems: 'center',
	},
	cancelButtonText: {
		color: '#6b7280',
		fontWeight: '500',
	},
	createButton: {
		flex: 1,
		padding: 12,
		borderRadius: 8,
		backgroundColor: '#e91e63',
		marginLeft: 8,
		alignItems: 'center',
	},
	createButtonText: {
		color: 'white',
		fontWeight: '600',
	},
});

export default MarketingDashboard;