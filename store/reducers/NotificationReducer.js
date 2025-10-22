import {
	ADD_TODO,
	UPDATE_TODO,
	DELETE_TODO,
	TOGGLE_TODO,
	ADD_NOTIFICATION,
	MARK_NOTIFICATION_READ,
	DELETE_NOTIFICATION,
	FETCH_TODOS_START,
	FETCH_TODOS_SUCCESS,
	FETCH_TODOS_FAIL,
	SEND_REMINDER
} from '../actions/NotificationActions';

const initialState = {
	todos: [],
	notifications: [],
	loading: false,
	error: null,
	unreadCount: 0,
	pendingTodos: 0
};

const NotificationReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_TODOS_START:
			return {
				...state,
				loading: true,
				error: null
			};

		case FETCH_TODOS_SUCCESS:
			const pendingTodos = action.payload.filter(todo => !todo.completed).length;
			return {
				...state,
				loading: false,
				error: null,
				todos: action.payload,
				pendingTodos
			};

		case FETCH_TODOS_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload
			};

		case ADD_TODO:
			const newTodos = [...state.todos, action.payload];
			const newPendingCount = newTodos.filter(todo => !todo.completed).length;
			return {
				...state,
				todos: newTodos,
				pendingTodos: newPendingCount
			};

		case UPDATE_TODO:
			const updatedTodos = state.todos.map(todo =>
				todo.id === action.payload.id
					? { ...todo, ...action.payload.updates }
					: todo
			);
			const updatedPendingCount = updatedTodos.filter(todo => !todo.completed).length;
			return {
				...state,
				todos: updatedTodos,
				pendingTodos: updatedPendingCount
			};

		case TOGGLE_TODO:
			const toggledTodos = state.todos.map(todo =>
				todo.id === action.payload.id
					? {
						...todo,
						completed: !todo.completed,
						completedAt: todo.completed ? null : action.payload.completedAt
					}
					: todo
			);
			const toggledPendingCount = toggledTodos.filter(todo => !todo.completed).length;
			return {
				...state,
				todos: toggledTodos,
				pendingTodos: toggledPendingCount
			};

		case DELETE_TODO:
			const filteredTodos = state.todos.filter(todo => todo.id !== action.payload);
			const filteredPendingCount = filteredTodos.filter(todo => !todo.completed).length;
			return {
				...state,
				todos: filteredTodos,
				pendingTodos: filteredPendingCount
			};

		case ADD_NOTIFICATION:
			const newNotifications = [action.payload, ...state.notifications];
			return {
				...state,
				notifications: newNotifications,
				unreadCount: newNotifications.filter(notif => !notif.read).length
			};

		case MARK_NOTIFICATION_READ:
			const readNotifications = state.notifications.map(notif =>
				notif.id === action.payload
					? { ...notif, read: true }
					: notif
			);
			return {
				...state,
				notifications: readNotifications,
				unreadCount: readNotifications.filter(notif => !notif.read).length
			};

		case DELETE_NOTIFICATION:
			const remainingNotifications = state.notifications.filter(
				notif => notif.id !== action.payload
			);
			return {
				...state,
				notifications: remainingNotifications,
				unreadCount: remainingNotifications.filter(notif => !notif.read).length
			};

		case SEND_REMINDER:
			const reminderUpdatedTodos = state.todos.map(todo =>
				todo.id === action.payload.todoId
					? { ...todo, reminderSent: true }
					: todo
			);
			return {
				...state,
				todos: reminderUpdatedTodos
			};

		default:
			return state;
	}
};

export default NotificationReducer;