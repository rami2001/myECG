import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInMonths } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const validateDateOfECG = (patientDateOfBirth, date) =>
  differenceInMonths(patientDateOfBirth, date) >= 1;
