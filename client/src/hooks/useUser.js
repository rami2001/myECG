import { useEffect, useState } from "react";

import { USER_ROUTE } from "@/api/routes";
import useAxiosPrivate from "@/hooks//useAxiosPrivate";

const useUser = () => {
  const axiosPrivate = useAxiosPrivate();

  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    axiosPrivate
      .get(USER_ROUTE)
      .then((response) => setUser(response.data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { user, setUser, error, loading };
};

export default useUser;
