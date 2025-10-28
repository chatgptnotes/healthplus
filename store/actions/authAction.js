import { supabase } from '../../lib/supabase';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const SIGN_UP = 'SIGN_UP';
export const SET_AUTH_ERROR = 'SET_AUTH_ERROR';
export const SET_LOADING = 'SET_LOADING';

export const signUp = (email, password, userData) => {
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
              name: userData.name,
              role: userData.role,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) throw profileError;

        dispatch({
          type: SIGN_UP,
          payload: {
            user: authData.user,
            session: authData.session,
            userData,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: SET_AUTH_ERROR,
        payload: error.message,
      });
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };
};

export const signIn = (email, password) => {
  return async (dispatch) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: userData, error: userError } = await supabase
        .from('User')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      dispatch({
        type: SIGN_IN,
        payload: {
          user: data.user,
          session: data.session,
          userData,
        },
      });
    } catch (error) {
      dispatch({
        type: SET_AUTH_ERROR,
        payload: error.message,
      });
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };
};

export const signOut = () => {
  return async (dispatch) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      dispatch({ type: SIGN_OUT });
    } catch (error) {
      dispatch({
        type: SET_AUTH_ERROR,
        payload: error.message,
      });
    }
  };
};

export const checkSession = () => {
  return async (dispatch) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data: userData, error } = await supabase
          .from('User')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error) {
          dispatch({
            type: SIGN_IN,
            payload: {
              user: session.user,
              session,
              userData,
            },
          });
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };
};