import axios from "@/api/axios";
import { AUTH, REGISTER, LOGOUT } from "@/api/routes";

export const register = async (
  email,
  username,
  gender,
  dateOfBirth,
  password
) =>
  await axios.post(
    REGISTER,
    JSON.stringify({ email, username, gender, dateOfBirth, password }),
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

export const auth = async (id, password) =>
  await axios.post(AUTH, JSON.stringify({ id, password }), {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

export const createProfile = async (
  id,
  username,
  pseudonym,
  dateOfBirth,
  gender,
  accessToken
) =>
  await axios.post(
    "/profile",
    JSON.stringify({ id, username, pseudonym, dateOfBirth, gender }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    }
  );

export const logout = async () =>
  await axios.get(LOGOUT, { withCredentials: true });
