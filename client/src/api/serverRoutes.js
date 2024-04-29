export default SERVER_ROUTES = {
  AUTH: "/auth",
  REGISTER: "/register",
  REFRESH: "/refresh",
  LOGOUT: "/logout",
  PROFILE: "/profile",
  USER: "/user",
  ECG: "/ecg",
  ECG_ID: (ecg) => `/ecg/${ecg}`,
};
