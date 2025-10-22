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

const BillingDashboard = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	const [dashboardData, setDashboardData] = useState({
		todaysCollection: 125000,
		insuranceClaims: 12,
		cashlessApprovals: 8,
		recentTransactions: [
			{ id: '1', patient: 'Manish Agarwal', amount: 5500, type: 'Cash', status: 'Completed', time: '10:30 AM' },
			{ id: '2', patient: 'Kavita Sharma', amount: 12000, type: 'Insurance', status: 'Pending', time: '10:15 AM' },
			{ id: '3', patient: 'Ravi Kumar', amount: 8500, type: 'Card', status: 'Completed', time: '9:45 AM' },
		],
		insuranceBreakdown: [
			{ id: '1', provider: 'CGHS', claims: 15, amount: 85000, status: 'Active' },
			{ id: '2', provider: 'ECHS', claims: 8, amount: 42000, status: 'Active' },
			{ id: '3', provider: 'Railways', claims: 6, amount: 28000, status: 'Processing' },
			{ id: '4', provider: 'TPA Health', claims: 12, amount: 65000, status: 'Active' },
		],
		pendingBills: [
			{ id: '1', patient: 'Pooja Gupta', amount: 15000, department: 'Cardiology', days: 2 },
			{ id: '2', patient: 'Suresh Patel', amount: 8500, department: 'Orthopedics', days: 1 },
			{ id: '3', patient: 'Deepika Singh', amount: 12000, department: 'Neurology', days: 3 },
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

	const renderTransactionItem = ({ item }) => (
		<View style={styles.listItem}>
			<View style={styles.listItemHeader}>
				<View>
					<Text style={styles.patientName}>{item.patient}</Text>
					<Text style={styles.transactionTime}>{item.time}</Text>
				</View>
				<View style={styles.amountContainer}>
					<Text style={styles.transactionAmount}>₹{item.amount.toLocaleString()}</Text>
					<View style={[styles.statusBadge, {
						backgroundColor: item.status === 'Completed' ? '#10b981' : '#f59e0b'
					}]}>
						<Text style={styles.statusText}>{item.status}</Text>
					</View>
				</View>
			</View>
			<View style={styles.paymentTypeContainer}>
				<Text style={[styles.paymentType, {
					color: item.type === 'Cash' ? '#10b981' :
						  item.type === 'Card' ? '#6366f1' : '#f59e0b'
				}]}>
					{item.type} Payment
				</Text>
			</View>
		</View>
	);

	const renderInsuranceItem = ({ item }) => (
		<View style={styles.insuranceItem}>
			<View style={styles.insuranceHeader}>
				<Text style={styles.insuranceProvider}>{item.provider}</Text>
				<View style={[styles.insuranceStatusBadge, {
					backgroundColor: item.status === 'Active' ? '#10b981' : '#f59e0b'
				}]}>
					<Text style={styles.insuranceStatusText}>{item.status}</Text>
				</View>
			</View>
			<View style={styles.insuranceStats}>
				<View style={styles.insuranceStat}>
					<Text style={styles.insuranceStatValue}>{item.claims}</Text>
					<Text style={styles.insuranceStatLabel}>Claims</Text>
				</View>
				<View style={styles.insuranceStat}>
					<Text style={styles.insuranceStatValue}>₹{item.amount.toLocaleString()}</Text>
					<Text style={styles.insuranceStatLabel}>Amount</Text>
				</View>
			</View>
		</View>
	);

	const renderPendingBillItem = ({ item }) => (
		<View style={styles.pendingBillItem}>
			<View style={styles.pendingBillHeader}>
				<View>
					<Text style={styles.pendingPatientName}>{item.patient}</Text>
					<Text style={styles.pendingDepartment}>{item.department}</Text>
				</View>
				<View style={styles.pendingAmountContainer}>
					<Text style={styles.pendingAmount}>₹{item.amount.toLocaleString()}</Text>
					<Text style={styles.pendingDays}>{item.days} days pending</Text>
				</View>
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Billing & Finance</Text>
				<TouchableOpacity style={styles.reportButton}>
					<MaterialIcons name="assessment" size={24} color="white" />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{/* Statistics Cards */}
				<View style={styles.statsContainer}>
					{renderStatCard('Today\'s Collection', dashboardData.todaysCollection.toLocaleString(), 'account-balance-wallet', '#06b6d4', '₹', () => Alert.alert(
						'Today\'s Collection Summary',
						'💰 DAILY COLLECTION REPORT\n\n📊 Total Collection: ₹' + dashboardData.todaysCollection.toLocaleString() + '\n\n💳 PAYMENT BREAKDOWN:\n• Cash Payments: ₹45,200 (42%)\n• Card Payments: ₹38,500 (36%)\n• Digital Payments: ₹18,300 (17%)\n• Insurance Direct: ₹5,400 (5%)\n\n🏥 DEPARTMENT WISE:\n• Emergency: ₹28,400\n• General Ward: ₹32,600\n• ICU: ₹24,800\n• Surgery: ₹21,600\n\n📈 HOURLY COLLECTION:\n• 8-12 AM: ₹35,200\n• 12-4 PM: ₹42,100\n• 4-8 PM: ₹30,100',
						[
							{ text: 'View Payment Details', onPress: () => Alert.alert('Payment Details', 'Recent major payments:\n\n• 2:30 PM - ₹15,400 (Surgery - Mr. Sharma)\n• 1:45 PM - ₹8,200 (Emergency - Ms. Patel)\n• 12:20 PM - ₹12,600 (ICU - Mr. Kumar)\n• 11:30 AM - ₹6,800 (General - Mrs. Singh)\n\nAll payments verified and recorded.') },
							{ text: 'Generate Receipt Report', onPress: () => Alert.alert('Receipt Report', 'Daily receipt report generated:\n\n📄 Total Receipts: 147\n✅ Processed: 147\n⏳ Pending: 0\n\nReport sent to accounts department.\nBackup saved to system.') },
							{ text: 'View Trends', onPress: () => Alert.alert('Collection Trends', 'Weekly collection analysis:\n\n📈 This Week: ₹742,300\n📈 Last Week: ₹698,500\n📈 Growth: +6.3%\n\n🏆 Best Day: Wednesday (₹125,600)\n📉 Lowest Day: Sunday (₹78,400)\n\nTrend: Increasing collections') },
							{ text: 'OK' }
						]
					))}
					{renderStatCard('Pending Bills', dashboardData.pendingBills.length, 'receipt', '#f59e0b', '', () => Alert.alert(
						'Pending Bills - Action Required',
						'📋 BILLS AWAITING PAYMENT\n\n🔴 OVERDUE (>7 days): ' + Math.floor(dashboardData.pendingBills.length * 0.3) + ' bills\n🟡 DUE SOON (3-7 days): ' + Math.floor(dashboardData.pendingBills.length * 0.4) + ' bills\n🟢 RECENT (<3 days): ' + Math.floor(dashboardData.pendingBills.length * 0.3) + ' bills\n\n💰 TOTAL AMOUNT:\n• Overdue: ₹1,24,500\n• Due Soon: ₹2,18,300\n• Recent: ₹1,89,600\n\n📊 BY DEPARTMENT:\n• General Ward: 8 bills\n• Emergency: 5 bills\n• Surgery: 4 bills\n• ICU: 3 bills',
						[
							{ text: 'Process Overdue Bills', onPress: () => Alert.alert('Overdue Bills Processing', '🔴 PRIORITY OVERDUE BILLS:\n\n1. Rajesh Kumar - ₹45,200 (12 days overdue)\n   Department: Surgery\n   Status: Insurance pending\n\n2. Priya Sharma - ₹32,100 (9 days overdue)\n   Department: ICU\n   Status: Family contacted\n\n3. Amit Singh - ₹28,600 (8 days overdue)\n   Department: Emergency\n   Status: Payment plan requested\n\nCollection team has been notified.') },
							{ text: 'Send Payment Reminders', onPress: () => Alert.alert('Payment Reminders', 'Automated payment reminders sent:\n\n📧 Email reminders: 15 sent\n📱 SMS alerts: 12 sent\n📞 Call notifications: 5 scheduled\n\n⏰ Follow-up schedule:\n• Tomorrow: 8 patients\n• Day after: 5 patients\n• End of week: 2 patients\n\nReminder system active.') },
							{ text: 'View Detailed List', onPress: () => Alert.alert('Detailed Bill List', 'Top pending bills by amount:\n\n1. ₹45,200 - Rajesh Kumar (Surgery)\n2. ₹38,900 - Pooja Gupta (ICU)\n3. ₹32,100 - Priya Sharma (Emergency)\n4. ₹28,600 - Amit Singh (General)\n5. ₹24,300 - Sunita Devi (Surgery)\n\nTotal pending: ₹' + (124500 + 218300 + 189600).toLocaleString()) },
							{ text: 'OK' }
						]
					))}
					{renderStatCard('Insurance Claims', dashboardData.insuranceClaims, 'local-hospital', '#10b981', '', () => Alert.alert(
						'Insurance Claims Management',
						'🏥 INSURANCE CLAIMS STATUS\n\n📊 TOTAL CLAIMS: ' + dashboardData.insuranceClaims + '\n\n✅ APPROVED: 42 claims (₹18,24,600)\n⏳ PENDING: 28 claims (₹12,45,300)\n🔄 UNDER REVIEW: 15 claims (₹8,76,200)\n❌ REJECTED: 3 claims (₹1,23,400)\n\n🏢 TOP INSURANCE PARTNERS:\n• Star Health: 25 claims\n• HDFC Ergo: 18 claims\n• ICICI Lombard: 15 claims\n• New India: 12 claims\n• Oriental: 8 claims\n\n⏱️ AVERAGE PROCESSING TIME: 5.2 days',
						[
							{ text: 'Process Pending Claims', onPress: () => Alert.alert('Pending Claims Processing', '⏳ CLAIMS AWAITING ACTION:\n\n🔄 Ready for Submission:\n• Claim #IC2024-001 - ₹45,600 (Star Health)\n• Claim #IC2024-002 - ₹32,800 (HDFC Ergo)\n• Claim #IC2024-003 - ₹28,900 (ICICI Lombard)\n\n📋 Documents Required:\n• 5 claims need discharge summary\n• 3 claims need additional tests\n• 2 claims need doctor signatures\n\nProcessing initiated.') },
							{ text: 'Follow Up Rejections', onPress: () => Alert.alert('Rejected Claims Follow-up', '❌ REJECTED CLAIMS ANALYSIS:\n\n1. Claim #IC2024-015 - ₹52,300\n   Reason: Incomplete documentation\n   Action: Re-submit with missing docs\n\n2. Claim #IC2024-022 - ₹38,700\n   Reason: Pre-approval not taken\n   Action: Appeal with justification\n\n3. Claim #IC2024-028 - ₹32,400\n   Reason: Treatment not covered\n   Action: Patient responsibility\n\nAppeal process initiated for eligible claims.') },
							{ text: 'Generate Claims Report', onPress: () => Alert.alert('Claims Report Generated', 'Monthly insurance claims report:\n\n📈 Approval Rate: 84.2%\n💰 Total Processed: ₹42,68,500\n⏱️ Average TAT: 5.2 days\n\n🏆 Top Performing Insurers:\n1. Star Health - 96% approval\n2. HDFC Ergo - 91% approval\n3. ICICI Lombard - 88% approval\n\nReport saved and sent to management.') },
							{ text: 'OK' }
						]
					))}
					{renderStatCard('Cashless Approvals', dashboardData.cashlessApprovals, 'verified', '#8b5cf6', '', () => Alert.alert(
						'Cashless Approvals Dashboard',
						'💳 CASHLESS TREATMENT STATUS\n\n📊 TOTAL APPROVALS: ' + dashboardData.cashlessApprovals + '\n\n✅ ACTIVE APPROVALS: 18 patients\n⏳ PENDING APPROVAL: 12 requests\n🔄 RENEWAL REQUIRED: 6 cases\n⚠️ LIMIT EXCEEDED: 2 cases\n\n💰 APPROVED AMOUNTS:\n• Total Sanctioned: ₹28,45,600\n• Amount Utilized: ₹19,67,400\n• Available Balance: ₹8,78,200\n\n🏥 DEPARTMENT WISE:\n• Cardiology: 8 approvals\n• Orthopedics: 6 approvals\n• Neurology: 4 approvals\n• General Surgery: 4 approvals',
						[
							{ text: 'Process Pending Requests', onPress: () => Alert.alert('Pending Cashless Requests', '⏳ APPROVAL REQUESTS WAITING:\n\n🔄 HIGH PRIORITY:\n• Patient: Mr. Rajesh Kumar\n  Amount: ₹2,45,000 (Cardiac Surgery)\n  Insurer: Star Health\n  Status: Pre-auth sent\n\n• Patient: Mrs. Priya Sharma\n  Amount: ₹1,68,000 (Orthopedic)\n  Insurer: HDFC Ergo\n  Status: Awaiting documents\n\n⏱️ Average approval time: 24-48 hours\nFollow-up with insurers initiated.') },
							{ text: 'Monitor Active Cases', onPress: () => Alert.alert('Active Cashless Monitoring', '✅ ONGOING CASHLESS TREATMENTS:\n\n1. Room 301 - Mr. Arun Patel\n   Approved: ₹3,20,000\n   Utilized: ₹1,85,000\n   Remaining: ₹1,35,000\n   Days: 5 of 10\n\n2. Room 205 - Mrs. Sita Devi\n   Approved: ₹2,10,000\n   Utilized: ₹1,92,000\n   Remaining: ₹18,000\n   Status: Near limit\n\nDaily monitoring active for all cases.') },
							{ text: 'Renewal Alerts', onPress: () => Alert.alert('Renewal Required', '🔄 APPROVALS NEEDING RENEWAL:\n\n⚠️ EXPIRING SOON:\n• Patient: Mr. Vijay Singh (Room 408)\n  Current Limit: ₹1,50,000\n  Expires: Tomorrow\n  Action: Extension requested\n\n• Patient: Mrs. Lakshmi (Room 312)\n  Current Limit: ₹2,00,000\n  Expires: 2 days\n  Action: Pending insurer response\n\nRenewal requests submitted proactively.') },
							{ text: 'OK' }
						]
					))}
				</View>

				{/* Recent Transactions */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Recent Transactions</Text>
						<TouchableOpacity style={styles.viewAllButton}>
							<Text style={styles.viewAllText}>View All</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						data={dashboardData.recentTransactions}
						renderItem={renderTransactionItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
					/>
				</View>

				{/* Insurance Providers */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Insurance Providers</Text>
					<FlatList
						data={dashboardData.insuranceBreakdown}
						renderItem={renderInsuranceItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
						numColumns={2}
						columnWrapperStyle={styles.insuranceRow}
					/>
				</View>

				{/* Pending Bills */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Pending Bills</Text>
					<FlatList
						data={dashboardData.pendingBills}
						renderItem={renderPendingBillItem}
						keyExtractor={item => item.id}
						scrollEnabled={false}
					/>
				</View>

				{/* Quick Actions */}
				<View style={styles.quickActions}>
					<Text style={styles.sectionTitle}>Quick Actions</Text>
					<View style={styles.actionGrid}>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								Alert.alert(
									'Generate Bill',
									'Select bill type:',
									[
										{text: 'New Patient Bill', onPress: () => alert('New Patient Billing Form:\n\n• Patient ID: Required\n• Services: Select from list\n• Doctor consultation: ₹500\n• Lab tests: Variable\n• Pharmacy: Variable\n\nTotal will be calculated automatically.')},
										{text: 'Insurance Bill', onPress: () => alert('Insurance Billing:\n\n• Insurance Provider: Select\n• Policy Number: Required\n• Covered Amount: Auto-calculated\n• Patient Co-pay: ₹' + (Math.random() * 1000 + 500).toFixed(0) + '\n\nClaim will be submitted automatically.')},
										{text: 'Emergency Bill', onPress: () => alert('Emergency Billing:\n\n• Priority billing enabled\n• Immediate processing\n• Insurance pre-authorization bypass\n• Payment terms: 30 days\n\nEmergency surcharge: ₹1000')},
										{text: 'Cancel', style: 'cancel'}
									]
								)
							}}
						>
							<MaterialIcons name="receipt-long" size={30} color="#06b6d4" />
							<Text style={styles.actionText}>Generate Bill</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								Alert.alert(
									'Insurance Claims',
									'Select action:',
									[
										{text: 'Submit New Claim', onPress: () => alert('New Insurance Claim:\n\n• CGHS: 15 pending claims (₹85,000)\n• ECHS: 8 pending claims (₹42,000)\n• Railways: 6 pending claims (₹28,000)\n• TPA Health: 12 pending claims (₹65,000)\n\nTotal pending: ₹2,20,000')},
										{text: 'Check Claim Status', onPress: () => alert('Claim Status Check:\n\n• Enter claim number\n• View processing status\n• Estimated settlement time\n• Required documents\n\nLatest update: 2 claims approved today')},
										{text: 'Reimbursement Tracker', onPress: () => alert('Reimbursement Tracking:\n\n• This month received: ₹1,85,000\n• Pending reimbursements: ₹2,20,000\n• Average processing time: 15 days\n• Success rate: 94%')},
										{text: 'Cancel', style: 'cancel'}
									]
								)
							}}
						>
							<MaterialIcons name="local-hospital" size={30} color="#06b6d4" />
							<Text style={styles.actionText}>Insurance Claim</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								Alert.alert(
									'Process Payment',
									'Select payment method:',
									[
										{text: 'Cash Payment', onPress: () => alert('Cash Payment Processing:\n\n• Amount: Enter manually\n• Receipt generation: Automatic\n• Change calculation: Automatic\n• Daily cash limit: ₹50,000\n\nCurrent cash in register: ₹12,500')},
										{text: 'Card Payment', onPress: () => alert('Card Payment Processing:\n\n• Debit/Credit cards accepted\n• Contactless payments: Enabled\n• Processing fee: 1.8%\n• Settlement time: T+2 days\n\nTerminal status: Online')},
										{text: 'Digital Payment', onPress: () => alert('Digital Payment Options:\n\n• UPI payments\n• Mobile wallets\n• Net banking\n• QR code payments\n\nInstant settlement available')},
										{text: 'EMI/Installments', onPress: () => alert('EMI Payment Plans:\n\n• 3 months: 0% interest\n• 6 months: 8% interest\n• 12 months: 12% interest\n\nMinimum amount: ₹10,000')},
										{text: 'Cancel', style: 'cancel'}
									]
								)
							}}
						>
							<MaterialIcons name="payment" size={30} color="#06b6d4" />
							<Text style={styles.actionText}>Process Payment</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={() => {
								Alert.alert(
									'Financial Reports',
									'Select report type:',
									[
										{text: 'Daily Collection', onPress: () => alert('Daily Collection Report:\n\n• Today\'s total: ₹1,25,000\n• Cash: ₹45,000 (36%)\n• Card: ₹35,000 (28%)\n• Digital: ₹25,000 (20%)\n• Insurance: ₹20,000 (16%)\n\nTransactions: 127')},
										{text: 'Monthly Summary', onPress: () => alert('Monthly Financial Summary:\n\n• Total revenue: ₹24,50,000\n• Outstanding dues: ₹3,85,000\n• Insurance pending: ₹2,20,000\n• Collection efficiency: 85%\n\nGrowth: +12% vs last month')},
										{text: 'Outstanding Dues', onPress: () => alert('Outstanding Dues Report:\n\n• Total outstanding: ₹3,85,000\n• 0-30 days: ₹1,50,000\n• 31-60 days: ₹1,25,000\n• 60+ days: ₹1,10,000\n\nTop 5 accounts need follow-up')},
										{text: 'Insurance Analytics', onPress: () => alert('Insurance Analytics:\n\n• Claims submitted: 41\n• Claims approved: 35 (85%)\n• Claims rejected: 4 (10%)\n• Claims pending: 2 (5%)\n\nAverage claim value: ₹5,366')},
										{text: 'Cancel', style: 'cancel'}
									]
								)
							}}
						>
							<MaterialIcons name="assessment" size={30} color="#06b6d4" />
							<Text style={styles.actionText}>Financial Report</Text>
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
		backgroundColor: '#06b6d4',
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
	reportButton: {
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
		backgroundColor: '#06b6d4',
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
		marginBottom: 8,
	},
	patientName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	transactionTime: {
		fontSize: 12,
		color: '#6b7280',
		marginTop: 2,
	},
	amountContainer: {
		alignItems: 'flex-end',
	},
	transactionAmount: {
		fontSize: 16,
		fontWeight: '700',
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
	paymentTypeContainer: {
		alignItems: 'flex-start',
	},
	paymentType: {
		fontSize: 14,
		fontWeight: '500',
	},
	insuranceRow: {
		justifyContent: 'space-between',
	},
	insuranceItem: {
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
	insuranceHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	insuranceProvider: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1f2937',
	},
	insuranceStatusBadge: {
		paddingHorizontal: 6,
		paddingVertical: 3,
		borderRadius: 6,
	},
	insuranceStatusText: {
		color: 'white',
		fontSize: 10,
		fontWeight: '500',
	},
	insuranceStats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	insuranceStat: {
		alignItems: 'center',
	},
	insuranceStatValue: {
		fontSize: 14,
		fontWeight: '700',
		color: '#1f2937',
	},
	insuranceStatLabel: {
		fontSize: 10,
		color: '#6b7280',
		marginTop: 2,
	},
	pendingBillItem: {
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
	pendingBillHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	pendingPatientName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
	},
	pendingDepartment: {
		fontSize: 14,
		color: '#6b7280',
		marginTop: 2,
	},
	pendingAmountContainer: {
		alignItems: 'flex-end',
	},
	pendingAmount: {
		fontSize: 16,
		fontWeight: '700',
		color: '#dc2626',
	},
	pendingDays: {
		fontSize: 12,
		color: '#f59e0b',
		marginTop: 2,
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

export default BillingDashboard;