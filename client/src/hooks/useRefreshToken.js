import axios from "@/api/axios";
import { REFRESH_ROUTE } from "@/api/routes";
import useAuth from "@/hooks/useAuth";

const useRefreshToken = () => {
  const { user, setUser } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get(REFRESH_ROUTE, {
        withCredentials: true,
      });

      console.log(response);
      console.log(user);
      setUser({ ...user, accessToken: response.data.accessToken });
      console.log(user.accessToken);
      console.log(response.data.accessToken);

      return response.data.accessToken;
    } catch (error) {
      console.log(error);
    }
  };

  return refresh;
};

export default useRefreshToken;
