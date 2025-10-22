export const ADD_TODO = 'ADD_TODO';
export const UPDATE_TODO = 'UPDATE_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const MARK_NOTIFICATION_READ = 'MARK_NOTIFICATION_READ';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
export const FETCH_TODOS_START = 'FETCH_TODOS_START';
export const FETCH_TODOS_SUCCESS = 'FETCH_TODOS_SUCCESS';
export const FETCH_TODOS_FAIL = 'FETCH_TODOS_FAIL';
export const SEND_REMINDER = 'SEND_REMINDER';

export const addTodo = (todoData) => {
	return {
		type: ADD_TODO,
		payload: {
			id: Date.now().toString(),
			text: todoData.text,
			priority: todoData.priority || 'medium',
			category: todoData.category || 'general',
			userRole: todoData.userRole,
			userId: todoData.userId,
			completed: false,
			createdAt: new Date().toISOString(),
			dueDate: todoData.dueDate || null,
			reminderSent: false
		}
	};
};

export const updateTodo = (todoId, updates) => {
	return {
		type: UPDATE_TODO,
		payload: {
			id: todoId,
			updates: {
				...updates,
				updatedAt: new Date().toISOString()
			}
		}
	};
};

export const toggleTodo = (todoId) => {
	return {
		type: TOGGLE_TODO,
		payload: {
			id: todoId,
			completedAt: new Date().toISOString()
		}
	};
};

export const deleteTodo = (todoId) => {
	return {
		type: DELETE_TODO,
		payload: todoId
	};
};

export const addNotification = (notificationData) => {
	return {
		type: ADD_NOTIFICATION,
		payload: {
			id: Date.now().toString(),
			title: notificationData.title,
			message: notificationData.message,
			type: notificationData.type || 'info',
			priority: notificationData.priority || 'medium',
			userRole: notificationData.userRole,
			userId: notificationData.userId,
			read: false,
			createdAt: new Date().toISOString(),
			data: notificationData.data || {}
		}
	};
};

export const markNotificationRead = (notificationId) => {
	return {
		type: MARK_NOTIFICATION_READ,
		payload: notificationId
	};
};

export const deleteNotification = (notificationId) => {
	return {
		type: DELETE_NOTIFICATION,
		payload: notificationId
	};
};

export const sendReminder = (todoId, userId) => {
	return (dispatch) => {
		dispatch({
			type: SEND_REMINDER,
			payload: { todoId, userId }
		});

		dispatch(addNotification({
			title: 'Task Reminder',
			message: 'You have pending tasks that need attention',
			type: 'reminder',
			priority: 'high',
			userId: userId,
			data: { todoId }
		}));
	};
};

export const fetchTodos = (userId, userRole) => {
	return async (dispatch) => {
		dispatch({ type: FETCH_TODOS_START });

		try {
			const mockTodos = [
				{
					id: '1',
					text: 'Review patient charts for morning rounds',
					priority: 'high',
					category: 'patient-care',
					userRole: 'Doctor',
					userId: userId,
					completed: false,
					createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
					dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
					reminderSent: false
				},
				{
					id: '2',
					text: 'Update medication inventory',
					priority: 'medium',
					category: 'inventory',
					userRole: 'Pharmacy',
					userId: userId,
					completed: false,
					createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
					dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
					reminderSent: false
				},
				{
					id: '3',
					text: 'Process lab results',
					priority: 'high',
					category: 'lab',
					userRole: 'Lab Technician',
					userId: userId,
					completed: true,
					createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
					completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
					reminderSent: false
				},
				{
					id: '4',
					text: 'Check ICU patient vitals',
					priority: 'high',
					category: 'patient-care',
					userRole: 'Nurse',
					userId: userId,
					completed: false,
					createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
					dueDate: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
					reminderSent: false
				},
				{
					id: '5',
					text: 'Generate daily occupancy report',
					priority: 'medium',
					category: 'reports',
					userRole: 'Administrator',
					userId: userId,
					completed: false,
					createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
					dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
					reminderSent: false
				}
			];

			const userTodos = mockTodos.filter(todo =>
				todo.userRole === userRole || todo.userId === userId
			);

			dispatch({
				type: FETCH_TODOS_SUCCESS,
				payload: userTodos
			});

			const pendingTodos = userTodos.filter(todo =>
				!todo.completed &&
				todo.dueDate &&
				new Date(todo.dueDate) < new Date(Date.now() + 2 * 60 * 60 * 1000) &&
				!todo.reminderSent
			);

			pendingTodos.forEach(todo => {
				dispatch(sendReminder(todo.id, userId));
			});

		} catch (error) {
			dispatch({
				type: FETCH_TODOS_FAIL,
				payload: error.message
			});
		}
	};
};