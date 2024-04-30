import React, { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [currentProfile, setCurrentProfile] = useState();

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        currentProfile,
        setCurrentProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
