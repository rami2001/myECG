import axios from "@/api/axios";
import { LOGOUT_ROUTE } from "@/api/routes";

const useLogout = () => {
  const logout = async () => await axios.get(LOGOUT_ROUTE);

  return logout;
};

export default useLogout;
