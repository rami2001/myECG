import { z } from "zod";

import { USERNAME_REGEX } from "@/util/regex";
import validateDateOfBirth from "@/util/validateDateOfBirth";

const email = z
  .string({ required_error: "Champs requis." })
  .email("Doit être une adresse mail valide.");

const username = z
  .string({ required_error: "Champs requis." })
  .min(4, "Doit faire au moins 04 caractères.")
  .max(24, "Ne doit pas faire plus de 24 caractères.")
  .regex(
    USERNAME_REGEX,
    "Doit commencer par une lettre et points et tirets seulement sont permis comme symboles."
  );

const password = z
  .string({ required_error: "Champs requis." })
  .min(8, "Doit faire au moins 08 caractères.")
  .max(24, "Ne doit pas faire plus de 24 caractères.");

const pseudonym = z
  .string({ required_error: "Champs requis." })
  .min(4, "Doit faire au moins 04 caractères.")
  .max(24, "Ne doit pas faire plus de 24 caractères.");

const dateOfBirth = z
  .date({ required_error: "Champs requis." })
  .refine((date) => validateDateOfBirth(date), {
    message: "Vous devez avoir entre 12 et 150ans.",
    path: "dateOfBirth",
  });

const gender = z.enum(["male", "female"], {
  message: "Veuillez préciser votre genre.",
});

const id = z.union([email, username]);

export const registerSchema = z
  .object({
    email,
    username,
    password,
    gender,
    dateOfBirth,
    confirm: z.string({ required_error: "Champs requis." }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Doit correspondre au mot de passe.",
    path: ["confirm"],
  });

export const updateProfileSchema = z
  .object({
    email,
    username,
    password,
    dateOfBirth,
    confirm: z.string({ required_error: "Champs requis." }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Doit correspondre au mot de passe.",
    path: ["confirm"],
  });

export const authSchema = z.object({
  id,
  password,
});
