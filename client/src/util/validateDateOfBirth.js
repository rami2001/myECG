import { subMonths, subYears } from "date-fns";

const validateDateOfBirth = (dateOfBirth, isUser = true) => {
  const currentDate = new Date();
  const minDate = subYears(currentDate, 150);
  const maxDate = isUser ? subYears(currentDate, 12) : subMonths(currentDate, 1);

  const inputDate = dateOfBirth ? new Date(dateOfBirth) : null;

  return inputDate >= minDate && inputDate <= maxDate;
};

export default validateDateOfBirth;
