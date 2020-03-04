import { SET_MP, MP, LOGOUT } from '../constants';

export const AUTH_INITIAL_STATE = {
  token: null,
  mp: null
};

export const authReducer = (state = AUTH_INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_MP: {
      localStorage.setItem(MP, JSON.stringify(action.payload));
      return {
        ...state,
        mp: action.payload.medicalPractitioner,
        token: action.payload.token
      };
    }

    case LOGOUT: {
      localStorage.setItem(MP, JSON.stringify(AUTH_INITIAL_STATE));
      return AUTH_INITIAL_STATE;
    }

    default:
      return state;
  }
};
