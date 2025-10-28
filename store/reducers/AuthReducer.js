import {LOGIN, SIGNUP, LOGOUT, SET_AUTH_ERROR, SET_LOADING} from '../actions/AuthActions';

const initialState = {
	token:null,
	userId:null,
	email:null,
	role:null,
	loading:false,
	error:null,
	isAuthenticated:false
};

const AuthReducer = (state = initialState, action)=>{
	switch(action.type){
		case LOGIN:
			return {
				...state,
				token:action.token,
				userId:action.userId,
				email:action.email,
				role:action.role,
				isAuthenticated:true,
				error:null
			}
		case SIGNUP:
			return {
				...state,
				token:action.token,
				userId:action.userId,
				email:action.email,
				role:action.role,
				isAuthenticated:true,
				error:null
			}
		case LOGOUT:
			return initialState;
		case SET_AUTH_ERROR:
			return {
				...state,
				error:action.payload
			}
		case SET_LOADING:
			return {
				...state,
				loading:action.payload
			}
		default:
			return state;
	}
};

export default AuthReducer;		