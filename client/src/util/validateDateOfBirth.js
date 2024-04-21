import { subYears } from "date-fns";

const validateDateOfBirth = (dateOfBirth) => {
  const currentDate = new Date();
  const minDate = subYears(currentDate, 150);
  const maxDate = subYears(currentDate, 12);

  const inputDate = dateOfBirth ? new Date(dateOfBirth) : null;

  return inputDate >= minDate && inputDate <= maxDate;
};

export default validateDateOfBirth;
