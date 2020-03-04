import React, { useReducer, createContext } from 'react';

import { AUTH_INITIAL_STATE, authReducer } from './reducers/authReducer';

export const AuthContext = createContext(null);

const AuthConfig = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

  return (
    <AuthContext.Provider value={{ authState, authDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthConfig;
