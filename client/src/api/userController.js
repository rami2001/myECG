import axios from "@/api/axios";

export const register = async (
  email,
  username,
  gender,
  dateOfBirth,
  password
) =>
  await axios.post(
    "/register",
    JSON.stringify({ email, username, gender, dateOfBirth, password }),
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

export const auth = async (id, password) =>
  await axios.post("/auth", JSON.stringify({ id, password }), {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
