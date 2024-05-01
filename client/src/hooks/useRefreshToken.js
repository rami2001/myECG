import axios from "@/api/axios";
import { REFRESH_ROUTE } from "@/api/routes";
import useAuth from "@/hooks/useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get(REFRESH_ROUTE, {
        withCredentials: true,
      });

      setAuth(response.data);

      return response.data.accessToken;
    } catch (error) {
      console.log(error);
    }
  };

  return refresh;
};

export default useRefreshToken;
