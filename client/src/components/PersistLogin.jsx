import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import useRefreshToken from "@/hooks/useRefreshToken";
import useAuth from "@/hooks/useAuth";
import Loading from "@/pages/Loading";

const PersistLogin = () => {
  const [loading, setLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        isMounted = false;
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setLoading(false);

    return () => (isMounted = false);
  }, []);

  return <>{loading ? <Loading /> : <Outlet />}</>;
};

export default PersistLogin;
