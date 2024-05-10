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

    const fetchUserData = async () => {
      const response = await axiosPrivate.get(USER_ROUTE);
      setUser(response.data);
    };

    const fetchUserImage = async () => {
      const response = await axiosPrivate.get("/user/image", {
        responseType: "blob",
      });

      const image = new Blob([response.data], {
        type: response.data.type,
      });

      const url = URL.createObjectURL(image);

      setUser((prevUser) => ({
        ...prevUser,
        imageURL: url,
      }));
    };

    Promise.all([fetchUserData(), fetchUserImage()])
      .catch((error) => {
        console.log(error);
        setError(error);
        setLoading(false);
      })
      .finally(setLoading(false));

  }, [axiosPrivate]);

  return { user, setUser, error, loading };
};

export default useUser;
