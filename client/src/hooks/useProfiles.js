import { useState, useEffect } from "react";

import { PROFILE_ROUTE } from "@/api/routes";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const useProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setLoading(true);

    axiosPrivate
      .get(PROFILE_ROUTE)
      .then((response) => {
        setProfiles(response.data);
        setCurrentProfile(response.data[0]);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [axiosPrivate]);

  return {
    profiles,
    setProfiles,
    currentProfile,
    setCurrentProfile,
    loading,
    error,
  };
};

export default useProfiles;
