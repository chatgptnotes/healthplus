import { supabase } from '../../lib/supabase';

export const LOGIN = "LOGIN";
export const SIGNUP = "SIGNUP";
export const LOGOUT = "LOGOUT";
export const SET_AUTH_ERROR = "SET_AUTH_ERROR";
export const SET_LOADING = "SET_LOADING";

export const SignUp = (email, password, userData = {}) => {
	return async (dispatch) => {
		dispatch({ type: SET_LOADING, payload: true });
		try {
			const { data: authData, error: authError } = await supabase.auth.signUp({
				email,
				password,
			});

			if (authError) throw authError;

			if (authData.user) {
				const { error: profileError } = await supabase
					.from('User')
					.insert([
						{
							id: authData.user.id,
							email: authData.user.email,
							name: userData.name || '',
							role: userData.role || 'patient',
							created_at: new Date().toISOString(),
						},
					]);

				if (profileError) throw profileError;

				dispatch({
					type: SIGNUP,
					token: authData.session?.access_token,
					userId: authData.user.id,
					email: authData.user.email,
					role: userData.role || 'patient'
				});
			}
		} catch (error) {
			let message = 'Something went wrong';
			if (error.message?.includes('already registered')) {
				message = 'Email already exists';
			} else if (error.message) {
				message = error.message;
			}
			dispatch({ type: SET_AUTH_ERROR, payload: message });
			throw new Error(message);
		} finally {
			dispatch({ type: SET_LOADING, payload: false });
		}
	};
};

export const Login = (email, password, userRole = 'patient') => {
	return async (dispatch) => {
		dispatch({ type: SET_LOADING, payload: true });
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;

			// First check if user profile exists
			let { data: userData, error: userError } = await supabase
				.from('User')
				.select('*')
				.eq('id', data.user.id)
				.single();

			// If user profile doesn't exist, create one
			if (userError && userError.code === 'PGRST116') {
				const { data: newUserData, error: createError } = await supabase
					.from('User')
					.insert([{
						id: data.user.id,
						email: data.user.email,
						role: userRole,
						created_at: new Date().toISOString()
					}])
					.select()
					.single();

				if (createError) {
					console.error('Error creating user profile:', createError);
				} else {
					userData = newUserData;
				}
			}

			dispatch({
				type: LOGIN,
				token: data.session.access_token,
				userId: data.user.id,
				email: data.user.email,
				role: userData?.role || userRole
			});
		} catch (error) {
			let message = 'Something went wrong';
			if (error.message?.includes('Invalid login')) {
				message = 'Invalid email or password';
			} else if (error.message) {
				message = error.message;
			}
			dispatch({ type: SET_AUTH_ERROR, payload: message });
			throw new Error(message);
		} finally {
			dispatch({ type: SET_LOADING, payload: false });
		}
	};
};

export const Logout = () => {
	return async (dispatch) => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			dispatch({ type: LOGOUT });
		} catch (error) {
			console.error('Logout error:', error);
			dispatch({ type: LOGOUT });
		}
	};
};

export const checkSession = () => {
	return async (dispatch) => {
		try {
			const { data: { session } } = await supabase.auth.getSession();

			if (session) {
				// Fetch user role from User table
				const { data: userData, error } = await supabase
					.from('User')
					.select('*')
					.eq('id', session.user.id)
					.single();

				dispatch({
					type: LOGIN,
					token: session.access_token,
					userId: session.user.id,
					email: session.user.email,
					role: userData?.role || 'patient'
				});
			}
		} catch (error) {
			console.error('Session check error:', error);
		}
	};
};