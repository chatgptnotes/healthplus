import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
	SafeAreaView,
	Alert,
	Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
	markNotificationRead,
	deleteNotification,
	addNotification
} from '../store/actions/NotificationActions';

const NotificationCenter = ({ userRole = 'Doctor', userId = '1' }) => {
	const dispatch = useDispatch();
	const { notifications, unreadCount } = useSelector(state => state.notifications);
	const [showUnreadOnly, setShowUnreadOnly] = useState(false);

	useEffect(() => {
		const sampleNotifications = [
			{
				title: 'Task Reminder',
				message: 'You have 3 pending tasks that require attention',
				type: 'reminder',
				priority: 'high',
				userId: userId,
				userRole: userRole,
				data: { taskCount: 3 }
			},
			{
				title: 'Patient Alert',
				message: 'Patient रमेश कुमार vital signs require immediate attention',
				type: 'alert',
				priority: 'high',
				userId: userId,
				userRole: userRole,
				data: { patientId: 'P001', room: '201' }
			},
			{
				title: 'Medication Inventory',
				message: 'Low stock alert: Paracetamol tablets (25 units remaining)',
				type: 'inventory',
				priority: 'medium',
				userId: userId,
				userRole: userRole,
				data: { medication: 'Paracetamol', quantity: 25 }
			},
			{
				title: 'System Update',
				message: 'Hospital management system will undergo maintenance tonight at 11 PM',
				type: 'system',
				priority: 'low',
				userId: userId,
				userRole: userRole,
				data: { maintenanceTime: '23:00' }
			}
		];

		if (notifications.length === 0) {
			sampleNotifications.forEach(notif => {
				setTimeout(() => dispatch(addNotification(notif)), 100);
			});
		}
	}, [dispatch, notifications.length, userId, userRole]);

	const userNotifications = notifications.filter(notification =>
		notification.userRole === userRole || notification.userId === userId
	);

	const filteredNotifications = showUnreadOnly
		? userNotifications.filter(notif => !notif.read)
		: userNotifications;

	const getNotificationIcon = (type) => {
		switch (type) {
			case 'reminder':
				return 'schedule';
			case 'alert':
				return 'warning';
			case 'inventory':
				return 'inventory';
			case 'system':
				return 'info';
			default:
				return 'notifications';
		}
	};

	const getNotificationColor = (type, priority) => {
		if (priority === 'high') return '#dc2626';
		if (priority === 'medium') return '#f59e0b';
		switch (type) {
			case 'alert':
				return '#dc2626';
			case 'reminder':
				return '#7c3aed';
			case 'inventory':
				return '#0369a1';
			case 'system':
				return '#10b981';
			default:
				return '#6b7280';
		}
	};

	const formatTime = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now - date;
		const diffMinutes = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMinutes / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMinutes < 1) return 'Just now';
		if (diffMinutes < 60) return `${diffMinutes}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		return `${diffDays}d ago`;
	};

	const handleNotificationPress = (notification) => {
		if (!notification.read) {
			dispatch(markNotificationRead(notification.id));
		}

		switch (notification.type) {
			case 'reminder':
				Alert.alert(
					'Task Reminder',
					`You have ${notification.data?.taskCount || 'several'} pending tasks. Would you like to view them?`,
					[
						{ text: 'Later', style: 'cancel' },
						{ text: 'View Tasks', onPress: () => Alert.alert('Feature Coming', 'Todo list integration coming soon!') }
					]
				);
				break;
			case 'alert':
				Alert.alert(
					'Patient Alert',
					`Patient: ${notification.data?.patientId || 'Unknown'}\nRoom: ${notification.data?.room || 'N/A'}\n\n${notification.message}`,
					[
						{ text: 'Acknowledge', style: 'default' },
						{ text: 'View Patient', onPress: () => Alert.alert('Feature Coming', 'Patient dashboard integration coming soon!') }
					]
				);
				break;
			case 'inventory':
				Alert.alert(
					'Inventory Alert',
					`Medication: ${notification.data?.medication || 'Unknown'}\nRemaining: ${notification.data?.quantity || 0} units\n\nPlease reorder soon.`,
					[
						{ text: 'Noted', style: 'default' },
						{ text: 'Reorder', onPress: () => Alert.alert('Feature Coming', 'Inventory management integration coming soon!') }
					]
				);
				break;
			default:
				Alert.alert(notification.title, notification.message);
		}
	};

	const handleDeleteNotification = (notificationId) => {
		Alert.alert(
			'Delete Notification',
			'Are you sure you want to delete this notification?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteNotification(notificationId)) }
			]
		);
	};

	const markAllAsRead = () => {
		const unreadNotifications = userNotifications.filter(notif => !notif.read);
		unreadNotifications.forEach(notif => {
			dispatch(markNotificationRead(notif.id));
		});
	};

	const renderNotificationItem = ({ item }) => (
		<TouchableOpacity
			style={[styles.notificationItem, !item.read && styles.unreadNotification]}
			onPress={() => handleNotificationPress(item)}
		>
			<View style={styles.notificationHeader}>
				<View style={styles.iconContainer}>
					<MaterialIcons
						name={getNotificationIcon(item.type)}
						size={24}
						color={getNotificationColor(item.type, item.priority)}
					/>
					{!item.read && <View style={styles.unreadDot} />}
				</View>
				<View style={styles.notificationContent}>
					<View style={styles.titleRow}>
						<Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
							{item.title}
						</Text>
						<Text style={styles.timeText}>
							{formatTime(item.createdAt)}
						</Text>
					</View>
					<Text style={styles.notificationMessage} numberOfLines={2}>
						{item.message}
					</Text>
					<View style={styles.metaRow}>
						<View style={[styles.priorityBadge, { backgroundColor: getNotificationColor(item.type, item.priority) }]}>
							<Text style={styles.priorityText}>
								{item.priority?.toUpperCase()}
							</Text>
						</View>
						<Text style={styles.typeText}>
							{item.type?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
						</Text>
					</View>
				</View>
				<TouchableOpacity
					style={styles.deleteButton}
					onPress={() => handleDeleteNotification(item.id)}
				>
					<MaterialIcons name="delete" size={20} color="#6b7280" />
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Notifications</Text>
				<View style={styles.headerActions}>
					{unreadCount > 0 && (
						<View style={styles.unreadBadge}>
							<Text style={styles.unreadBadgeText}>{unreadCount}</Text>
						</View>
					)}
					{unreadCount > 0 && (
						<TouchableOpacity
							style={styles.markAllButton}
							onPress={markAllAsRead}
						>
							<MaterialIcons name="mark-email-read" size={20} color="white" />
						</TouchableOpacity>
					)}
				</View>
			</View>

			<View style={styles.filterContainer}>
				<View style={styles.filterRow}>
					<Text style={styles.filterLabel}>Show unread only:</Text>
					<Switch
						value={showUnreadOnly}
						onValueChange={setShowUnreadOnly}
						trackColor={{ false: '#e5e7eb', true: '#7c3aed' }}
						thumbColor={showUnreadOnly ? '#ffffff' : '#f3f4f6'}
					/>
				</View>
				<Text style={styles.notificationCount}>
					{filteredNotifications.length} {showUnreadOnly ? 'unread' : 'total'} notifications
				</Text>
			</View>

			<FlatList
				data={filteredNotifications}
				renderItem={renderNotificationItem}
				keyExtractor={item => item.id}
				style={styles.notificationList}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<MaterialCommunityIcons
							name={showUnreadOnly ? "email-check" : "bell-outline"}
							size={64}
							color="#d1d5db"
						/>
						<Text style={styles.emptyText}>
							{showUnreadOnly ? 'All caught up!' : 'No notifications yet'}
						</Text>
						<Text style={styles.emptySubtext}>
							{showUnreadOnly
								? 'No unread notifications at the moment'
								: 'Notifications will appear here when you receive them'
							}
						</Text>
					</View>
				}
			/>

			{/* Quick Action Buttons */}
			<View style={styles.quickActions}>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => Alert.alert('Feature Coming', 'Notification settings coming soon!')}
				>
					<MaterialIcons name="settings" size={20} color="#1f2937" />
					<Text style={styles.actionText}>Settings</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => Alert.alert('Feature Coming', 'Notification history coming soon!')}
				>
					<MaterialIcons name="history" size={20} color="#1f2937" />
					<Text style={styles.actionText}>History</Text>
				</TouchableOpacity>
			</View>
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
		backgroundColor: '#1f2937',
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
	},
	headerTitle: {
		fontSize: 22,
		fontWeight: '700',
		color: 'white',
	},
	headerActions: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	unreadBadge: {
		backgroundColor: '#dc2626',
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 4,
		marginRight: 10,
	},
	unreadBadgeText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '600',
	},
	markAllButton: {
		backgroundColor: '#7c3aed',
		borderRadius: 20,
		padding: 8,
	},
	filterContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 15,
		backgroundColor: 'white',
		marginHorizontal: 15,
		marginTop: 15,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	filterRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	filterLabel: {
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
		marginRight: 10,
	},
	notificationCount: {
		fontSize: 12,
		color: '#6b7280',
	},
	notificationList: {
		flex: 1,
		paddingHorizontal: 15,
		paddingTop: 10,
	},
	notificationItem: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	unreadNotification: {
		borderLeftWidth: 4,
		borderLeftColor: '#7c3aed',
		backgroundColor: '#fefbff',
	},
	notificationHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	iconContainer: {
		position: 'relative',
		marginRight: 12,
		padding: 8,
		backgroundColor: '#f9fafb',
		borderRadius: 8,
	},
	unreadDot: {
		position: 'absolute',
		top: 2,
		right: 2,
		width: 8,
		height: 8,
		backgroundColor: '#dc2626',
		borderRadius: 4,
	},
	notificationContent: {
		flex: 1,
	},
	titleRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 5,
	},
	notificationTitle: {
		fontSize: 16,
		fontWeight: '500',
		color: '#1f2937',
		flex: 1,
	},
	unreadTitle: {
		fontWeight: '600',
	},
	timeText: {
		fontSize: 12,
		color: '#6b7280',
		marginLeft: 8,
	},
	notificationMessage: {
		fontSize: 14,
		color: '#6b7280',
		lineHeight: 20,
		marginBottom: 8,
	},
	metaRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	priorityBadge: {
		paddingHorizontal: 6,
		paddingVertical: 3,
		borderRadius: 6,
	},
	priorityText: {
		fontSize: 10,
		fontWeight: '600',
		color: 'white',
	},
	typeText: {
		fontSize: 12,
		color: '#6b7280',
		fontWeight: '500',
	},
	deleteButton: {
		padding: 5,
		marginLeft: 10,
	},
	emptyContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 60,
	},
	emptyText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#6b7280',
		marginTop: 15,
	},
	emptySubtext: {
		fontSize: 14,
		color: '#9ca3af',
		marginTop: 8,
		textAlign: 'center',
	},
	quickActions: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingVertical: 15,
		paddingHorizontal: 20,
		backgroundColor: 'white',
		marginHorizontal: 15,
		marginBottom: 15,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 15,
		backgroundColor: '#f9fafb',
		borderRadius: 8,
	},
	actionText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
		marginLeft: 8,
	},
});

export default NotificationCenter;