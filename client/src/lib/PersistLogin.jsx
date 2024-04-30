import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import useRefreshToken from "@/hooks/useRefreshToken";
import useAuth from "@/hooks/useAuth";

const PersistLogin = () => {
  const [loading, setLoading] = useState(true);
  const refresh = useRefreshToken();
  const { user } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    !user?.accessToken ? verifyRefreshToken() : setLoading(false);
  }, []);

  return <>{loading ? <p>Chargement...</p> : <Outlet />}</>;
};

export default PersistLogin;
