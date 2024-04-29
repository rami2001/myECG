import { PROFILE_ROUTE } from "@/api/routes";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export const createProfile = async (
  id,
  username,
  pseudonym,
  dateOfBirth,
  gender
) => {
  const axiosPrivate = useAxiosPrivate();

  return await axiosPrivate.post(
    PROFILE_ROUTE,
    JSON.stringify({ id, username, pseudonym, dateOfBirth, gender })
  );
};

export const deleteProfile = async (id, profileId) => {
  const axiosPrivate = useAxiosPrivate();

  await axiosPrivate.delete(PROFILE_ROUTE, {
    data: {
      id: id,
      profileId: profileId,
    },
  });
};

export const updateProfile = async (
  profileId,
  username,
  pseudonym,
  gender,
  dateOfBirth,
  accessToken
) =>
  await axios.put(PROFILE_ROUTE, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
    data: {
      profileId: profileId,
      username: username,
      pseudonym: pseudonym,
      gender: gender,
      dateOfBirth: dateOfBirth,
    },
  });
