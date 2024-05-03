import { useEffect } from "react";

import { axiosPrivateImage } from "@/api/axios";
import useRefreshToken from "@/hooks/useRefreshToken";
import useAuth from "@/hooks/useAuth";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivateImage.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivateImage.interceptors.response.use(
      (response) => response,
      async (error) => {
        const previousRequest = error?.config;

        if (error?.response?.status === 403 && !previousRequest?.sent) {
          previousRequest.sent = true;
          const newAccessToken = await refresh();
          previousRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axiosPrivate(previousRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivateImage.interceptors.request.eject(requestIntercept);
      axiosPrivateImage.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivateImage;
};

export default useAxiosPrivate;
