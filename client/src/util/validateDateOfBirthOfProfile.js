import { subYears, subMonths } from "date-fns";

const validateDateOfBirthOfProfile = (dateOfBirth, isUser = true) => {
    const currentDate = new Date();
    const minDate = subYears(currentDate, 150);
    let maxDate;
    
    if (isUser)
      maxDate = subMonths(currentDate, 1);
    else
      maxDate = subYears(currentDate, 1);

    const inputDate = dateOfBirth ? new Date(dateOfBirth) : null;
  
    return inputDate >= minDate && inputDate <= maxDate;
  };

export default validateDateOfBirthOfProfile