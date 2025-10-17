const getAge = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  const years = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth() + (years * 12);

  if (years >= 1) {
    return [years, "ans"];
  } else {
    return [months, "mois"];
  }
};

export default getAge;
