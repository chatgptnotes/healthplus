import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	TextInput,
	FlatList,
	Alert,
	Modal,
	Switch,
	SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
	addTodo,
	updateTodo,
	toggleTodo,
	deleteTodo,
	fetchTodos
} from '../store/actions/NotificationActions';

const StaffTodoManager = ({ userRole = 'Doctor', userId = '1' }) => {
	const dispatch = useDispatch();
	const { todos, loading, pendingTodos } = useSelector(state => state.notifications);
	const [showAddModal, setShowAddModal] = useState(false);
	const [newTodoText, setNewTodoText] = useState('');
	const [selectedPriority, setSelectedPriority] = useState('medium');
	const [selectedCategory, setSelectedCategory] = useState('general');
	const [filterCompleted, setFilterCompleted] = useState(false);

	useEffect(() => {
		dispatch(fetchTodos(userId, userRole));
	}, [dispatch, userId, userRole]);

	const priorities = [
		{ value: 'high', label: 'High Priority', color: '#dc2626' },
		{ value: 'medium', label: 'Medium Priority', color: '#f59e0b' },
		{ value: 'low', label: 'Low Priority', color: '#10b981' }
	];

	const categories = [
		{ value: 'patient-care', label: 'Patient Care', icon: 'medical-services' },
		{ value: 'inventory', label: 'Inventory', icon: 'inventory' },
		{ value: 'lab', label: 'Lab Work', icon: 'biotech' },
		{ value: 'reports', label: 'Reports', icon: 'assessment' },
		{ value: 'administration', label: 'Administration', icon: 'admin-panel-settings' },
		{ value: 'general', label: 'General', icon: 'task' }
	];

	const userTodos = todos.filter(todo =>
		todo.userRole === userRole || todo.userId === userId
	);

	const filteredTodos = filterCompleted
		? userTodos.filter(todo => todo.completed)
		: userTodos.filter(todo => !todo.completed);

	const handleAddTodo = () => {
		if (newTodoText.trim()) {
			dispatch(addTodo({
				text: newTodoText.trim(),
				priority: selectedPriority,
				category: selectedCategory,
				userRole: userRole,
				userId: userId,
				dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
			}));
			setNewTodoText('');
			setShowAddModal(false);
		}
	};

	const handleToggleTodo = (todoId) => {
		dispatch(toggleTodo(todoId));
	};

	const handleDeleteTodo = (todoId) => {
		Alert.alert(
			'Delete Task',
			'Are you sure you want to delete this task?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteTodo(todoId)) }
			]
		);
	};

	const getPriorityColor = (priority) => {
		const priorityItem = priorities.find(p => p.value === priority);
		return priorityItem ? priorityItem.color : '#6b7280';
	};

	const getCategoryIcon = (category) => {
		const categoryItem = categories.find(c => c.value === category);
		return categoryItem ? categoryItem.icon : 'task';
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const renderTodoItem = ({ item }) => (
		<View style={[styles.todoItem, item.completed && styles.completedTodo]}>
			<View style={styles.todoHeader}>
				<TouchableOpacity
					style={[styles.checkbox, item.completed && styles.checkedBox]}
					onPress={() => handleToggleTodo(item.id)}
				>
					{item.completed && (
						<MaterialIcons name="check" size={16} color="white" />
					)}
				</TouchableOpacity>
				<View style={styles.todoContent}>
					<Text style={[styles.todoText, item.completed && styles.completedText]}>
						{item.text}
					</Text>
					<View style={styles.todoMeta}>
						<View style={styles.metaItem}>
							<MaterialIcons
								name={getCategoryIcon(item.category)}
								size={14}
								color="#6b7280"
							/>
							<Text style={styles.metaText}>
								{categories.find(c => c.value === item.category)?.label || 'General'}
							</Text>
						</View>
						<View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
							<Text style={styles.priorityText}>
								{priorities.find(p => p.value === item.priority)?.label || 'Medium'}
							</Text>
						</View>
					</View>
					{item.dueDate && (
						<Text style={styles.dueDateText}>
							Due: {formatDate(item.dueDate)}
						</Text>
					)}
					{item.completedAt && (
						<Text style={styles.completedText}>
							Completed: {formatDate(item.completedAt)}
						</Text>
					)}
				</View>
				<TouchableOpacity
					style={styles.deleteButton}
					onPress={() => handleDeleteTodo(item.id)}
				>
					<MaterialIcons name="delete" size={20} color="#dc2626" />
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderPrioritySelector = () => (
		<View style={styles.selectorContainer}>
			<Text style={styles.selectorLabel}>Priority:</Text>
			<View style={styles.selectorRow}>
				{priorities.map(priority => (
					<TouchableOpacity
						key={priority.value}
						style={[
							styles.selectorOption,
							{
								backgroundColor: selectedPriority === priority.value
									? priority.color
									: '#f3f4f6'
							}
						]}
						onPress={() => setSelectedPriority(priority.value)}
					>
						<Text style={[
							styles.selectorText,
							{
								color: selectedPriority === priority.value ? 'white' : '#374151'
							}
						]}>
							{priority.label}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	const renderCategorySelector = () => (
		<View style={styles.selectorContainer}>
			<Text style={styles.selectorLabel}>Category:</Text>
			<View style={styles.categoryGrid}>
				{categories.map(category => (
					<TouchableOpacity
						key={category.value}
						style={[
							styles.categoryOption,
							selectedCategory === category.value && styles.selectedCategory
						]}
						onPress={() => setSelectedCategory(category.value)}
					>
						<MaterialIcons
							name={category.icon}
							size={20}
							color={selectedCategory === category.value ? '#1f2937' : '#6b7280'}
						/>
						<Text style={[
							styles.categoryText,
							selectedCategory === category.value && styles.selectedCategoryText
						]}>
							{category.label}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>My Tasks</Text>
				<View style={styles.headerRight}>
					{pendingTodos > 0 && (
						<View style={styles.pendingBadge}>
							<Text style={styles.pendingText}>{pendingTodos}</Text>
						</View>
					)}
					<TouchableOpacity
						style={styles.addButton}
						onPress={() => setShowAddModal(true)}
					>
						<MaterialIcons name="add" size={24} color="white" />
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.filterContainer}>
				<View style={styles.filterRow}>
					<Text style={styles.filterLabel}>Show Completed:</Text>
					<Switch
						value={filterCompleted}
						onValueChange={setFilterCompleted}
						trackColor={{ false: '#e5e7eb', true: '#10b981' }}
						thumbColor={filterCompleted ? '#ffffff' : '#f3f4f6'}
					/>
				</View>
				<Text style={styles.todoCount}>
					{filterCompleted
						? `${filteredTodos.length} completed tasks`
						: `${filteredTodos.length} pending tasks`
					}
				</Text>
			</View>

			<FlatList
				data={filteredTodos}
				renderItem={renderTodoItem}
				keyExtractor={item => item.id}
				style={styles.todoList}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<MaterialCommunityIcons
							name={filterCompleted ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
							size={64}
							color="#d1d5db"
						/>
						<Text style={styles.emptyText}>
							{filterCompleted ? 'No completed tasks yet' : 'No pending tasks!'}
						</Text>
						<Text style={styles.emptySubtext}>
							{filterCompleted
								? 'Complete some tasks to see them here'
								: 'Great job! All caught up.'
							}
						</Text>
					</View>
				}
			/>

			{/* Add Todo Modal */}
			<Modal
				visible={showAddModal}
				animationType="slide"
				presentationStyle="pageSheet"
				onRequestClose={() => setShowAddModal(false)}
			>
				<SafeAreaView style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={() => setShowAddModal(false)}
						>
							<Text style={styles.cancelText}>Cancel</Text>
						</TouchableOpacity>
						<Text style={styles.modalTitle}>Add New Task</Text>
						<TouchableOpacity
							style={[styles.saveButton, !newTodoText.trim() && styles.disabledButton]}
							onPress={handleAddTodo}
							disabled={!newTodoText.trim()}
						>
							<Text style={[styles.saveText, !newTodoText.trim() && styles.disabledText]}>
								Add
							</Text>
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.modalContent}>
						<View style={styles.inputContainer}>
							<Text style={styles.inputLabel}>Task Description:</Text>
							<TextInput
								style={styles.textInput}
								value={newTodoText}
								onChangeText={setNewTodoText}
								placeholder="Enter task description..."
								multiline
								numberOfLines={3}
								textAlignVertical="top"
							/>
						</View>

						{renderPrioritySelector()}
						{renderCategorySelector()}
					</ScrollView>
				</SafeAreaView>
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
	headerRight: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	pendingBadge: {
		backgroundColor: '#dc2626',
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 4,
		marginRight: 10,
	},
	pendingText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '600',
	},
	addButton: {
		backgroundColor: '#10b981',
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
	todoCount: {
		fontSize: 12,
		color: '#6b7280',
	},
	todoList: {
		flex: 1,
		paddingHorizontal: 15,
		paddingTop: 10,
	},
	todoItem: {
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
	completedTodo: {
		opacity: 0.7,
		backgroundColor: '#f9fafb',
	},
	todoHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: '#d1d5db',
		marginRight: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	checkedBox: {
		backgroundColor: '#10b981',
		borderColor: '#10b981',
	},
	todoContent: {
		flex: 1,
	},
	todoText: {
		fontSize: 16,
		fontWeight: '500',
		color: '#1f2937',
		marginBottom: 8,
	},
	completedText: {
		textDecorationLine: 'line-through',
		color: '#6b7280',
	},
	todoMeta: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 5,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	metaText: {
		fontSize: 12,
		color: '#6b7280',
		marginLeft: 4,
	},
	priorityBadge: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
	},
	priorityText: {
		fontSize: 10,
		fontWeight: '600',
		color: 'white',
	},
	dueDateText: {
		fontSize: 12,
		color: '#f59e0b',
		fontWeight: '500',
	},
	deleteButton: {
		padding: 5,
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
	},
	modalContainer: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 15,
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	cancelButton: {
		padding: 5,
	},
	cancelText: {
		fontSize: 16,
		color: '#6b7280',
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1f2937',
	},
	saveButton: {
		backgroundColor: '#10b981',
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: 8,
	},
	disabledButton: {
		backgroundColor: '#d1d5db',
	},
	saveText: {
		fontSize: 16,
		fontWeight: '600',
		color: 'white',
	},
	disabledText: {
		color: '#6b7280',
	},
	modalContent: {
		flex: 1,
		padding: 20,
	},
	inputContainer: {
		marginBottom: 25,
	},
	inputLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 8,
	},
	textInput: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 15,
		fontSize: 16,
		color: '#1f2937',
		minHeight: 80,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	selectorContainer: {
		marginBottom: 25,
	},
	selectorLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1f2937',
		marginBottom: 12,
	},
	selectorRow: {
		flexDirection: 'row',
		gap: 10,
	},
	selectorOption: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 8,
		alignItems: 'center',
	},
	selectorText: {
		fontSize: 12,
		fontWeight: '600',
	},
	categoryGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	categoryOption: {
		width: '48%',
		backgroundColor: 'white',
		padding: 15,
		borderRadius: 12,
		alignItems: 'center',
		borderWidth: 2,
		borderColor: '#e5e7eb',
	},
	selectedCategory: {
		borderColor: '#1f2937',
		backgroundColor: '#f9fafb',
	},
	categoryText: {
		fontSize: 12,
		fontWeight: '500',
		color: '#6b7280',
		marginTop: 5,
		textAlign: 'center',
	},
	selectedCategoryText: {
		color: '#1f2937',
		fontWeight: '600',
	},
});

export default StaffTodoManager;