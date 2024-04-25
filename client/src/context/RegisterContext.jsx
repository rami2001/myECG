import React, { createContext, useState } from "react";
import axios from "@/api/axios";

const RegisterContext = createContext();

export const RegisterProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    email: "",
    username: "",
    password: "",
    pseudonym: "",
    dateOfBirth: "",
    gender: "", // Mâle par défaut
  });

  const register = async () => {
    const response = await axios.post("/register", JSON.stringify(userData), {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response;
  };

  return (
    <RegisterContext.Provider
      value={{
        userData,
        setUserData,
        register,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export default RegisterContext;
