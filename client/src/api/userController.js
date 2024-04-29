import axios from "@/api/axios";
import { AUTH_ROUTE, REGISTER_ROUTE, LOGOUT_ROUTE } from "@/api/routes";

export const register = async (
  email,
  username,
  gender,
  dateOfBirth,
  password
) =>
  await axios.post(
    REGISTER_ROUTE,
    JSON.stringify({ email, username, gender, dateOfBirth, password }),
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

export const auth = async (id, password) =>
  await axios.post(AUTH_ROUTE, JSON.stringify({ id, password }), {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

export const logout = async () =>
  await axios.get(LOGOUT_ROUTE, { withCredentials: true });
