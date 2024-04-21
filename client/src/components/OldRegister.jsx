import { useState, useEffect, useRef } from "react";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import classNames from "classnames";

import {
  EMAIL_REGEX,
  USERNAME_REGEX,
  PASSWORD_REGEX,
  PSEUDONYM_REGEX,
} from "../util/regex";

import axios from "../api/axios";

const InputNote = ({ id, info, value, focus, valid }) => {
  return (
    <p
      id={id}
      className={classNames("px-1 mt-1 text-xs text-brand-300 text-left", {
        block: focus && value && !valid,
        hidden: !(focus && value && !valid),
      })}
    >
      {info}
    </p>
  );
};

const inputStyle = (value, focus, valid) =>
  classNames(
    "w-full text-sm bg-background-50 px-3 py-2 rounded-lg shadow-sm disabled:bg-background-300 transition duration-200 ease-in-out",
    {
      "border-2 border-foreground-50": !focus && !value,
    },
    {
      "border-2 focus:border-foreground-400 focus:ring-foreground-400":
        focus && !value,
    },
    {
      "border-2 border-accent-400 focus:border-accent-400 focus:ring-accent-400":
        valid && value,
    },
    {
      "border-2 border-brand-400 focus:border-brand-400 focus:ring-brand-400":
        !valid && value,
    }
  );

const Register = () => {
  const emailRef = useRef();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  useEffect(() => {
    setIsEmailValid(EMAIL_REGEX.test(email));
  }, [email]);

  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);

  useEffect(() => {
    setIsUsernameValid(USERNAME_REGEX.test(username));
  }, [username]);

  const [pseudonym, setPseudonym] = useState("");
  const [isPseudonymValid, setIsPseudonymValid] = useState(false);
  const [isPseudonymFocused, setIsPseudonymFocused] = useState(false);

  useEffect(() => {
    setIsPseudonymValid(PSEUDONYM_REGEX.test(pseudonym));
  }, [pseudonym]);

  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  useEffect(() => {
    setIsPasswordValid(PASSWORD_REGEX.test(password));
  }, [password]);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);

  useEffect(() => {
    setIsConfirmPasswordValid(confirmPassword === password);
  }, [confirmPassword, password]);

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isDateOfBirthValid, setIsDateOfBirthValid] = useState(false);
  const [isDateOfBirthFocused, setIsDateOfBirthFocused] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const minDate = subYears(currentDate, 150);
    const maxDate = subYears(currentDate, 12);

    const inputDate = dateOfBirth ? new Date(dateOfBirth) : null;

    setIsDateOfBirthValid(inputDate >= minDate && inputDate <= maxDate);
  }, [dateOfBirth]);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(dateOfBirth);

    const validEntries =
      isEmailValid && isUsernameValid && isPasswordValid && isDateOfBirthValid;
    if (!validEntries) {
      setErrorMessage("Entrée invalide.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "/register",
        JSON.stringify({ email, username, password, pseudonym }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(response.data);

      setSuccess(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (success)
    return (
      <section className="bg-background-50 py-12 text-center">
        <h1 className="text-5xl font-semibold">Inscription réussie !</h1>
        <p className="text-lg mt-3">Veuillez confirmer votre adresse-mail.</p>
      </section>
    );

  return (
    <section className="bg-background-50 py-12 text-center">
      <h1 className="text-5xl font-semibold">Inscription</h1>
      <p className="my-3 leading-none">
        Vous avez déjà un compte ?
        <br />
        <a href="" className="text-brand-400">
          Connectez-vous
        </a>
        .
      </p>
      <form onSubmit={handleSubmit} className="px-10 mt-10">
        {/* Email field */}
        <div className="mb-6">
          <label htmlFor="email" className="sr-only">
            Adresse Mail
          </label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value.trim())}
            value={email}
            ref={emailRef}
            required
            disabled={isLoading}
            aria-invalid={isEmailValid ? "false" : "true"}
            aria-describedby="emailnote"
            onFocus={() => setIsEmailFocused((focused) => !focused)}
            onBlur={() => setIsEmailFocused((focused) => !focused)}
            placeholder="Adresse Mail"
            className={inputStyle(email, isEmailFocused, isEmailValid)}
          />
          <InputNote
            id="emailnote"
            info="Doit être une adresse mail valide."
            value={email}
            focus={isEmailFocused}
            valid={isEmailValid}
          />
        </div>

        {/* Username field */}
        <div className="mb-6">
          <label htmlFor="username" className="sr-only">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            id="username"
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value.trim())}
            value={username}
            required
            aria-invalid={isUsernameValid ? "false" : "true"}
            aria-describedby="usernamenote"
            onFocus={() => setIsUsernameFocused(true)}
            onBlur={() => setIsUsernameFocused(false)}
            placeholder="Nom d'utilisateur"
            disabled={isLoading}
            className={inputStyle(username, isUsernameFocused, isUsernameValid)}
          />
          <InputNote
            id="usernamenote"
            value={username}
            focus={isUsernameFocused}
            valid={isUsernameValid}
            info="Doit faire entre 08 et 24 caractères et être alphanumérique."
          />
        </div>

        {/* Pseudonym field */}
        <div className="mb-6">
          <label htmlFor="pseudonym" className="sr-only">
            Pseudonyme
          </label>
          <input
            type="text"
            id="pseudonym"
            autoComplete="off"
            onChange={(e) => setPseudonym(e.target.value.trim())}
            value={pseudonym}
            disabled={isLoading}
            required
            aria-invalid={isPseudonymValid ? "false" : "true"}
            aria-describedby="pseudonymnote"
            onFocus={() => setIsPseudonymFocused(true)}
            onBlur={() => setIsPseudonymFocused(false)}
            placeholder="Pseudonyme"
            className={inputStyle(
              pseudonym,
              isPseudonymFocused,
              isPseudonymValid
            )}
          />
          <InputNote
            id="pseudonymenote"
            value={pseudonym}
            valid={isPseudonymValid}
            focus={isPseudonymFocused}
            info="Doit faire entre 04 et 28 caractères."
          />
        </div>

        {/* Date of birth field */}
        <div className="mb-6">
          <label htmlFor="dateOfBirth" className="sr-only">
            Date de naîssance
          </label>
          <input
            type="date"
            id="dateOfBirth"
            onChange={(e) => setDateOfBirth(e.target.value)}
            value={dateOfBirth}
            disabled={isLoading}
            required
            aria-invalid={isDateOfBirthValid ? "false" : "true"}
            aria-describedby="dobnote"
            onFocus={() => setIsDateOfBirthFocused(true)}
            onBlur={() => setIsDateOfBirthFocused(false)}
            className={inputStyle(
              dateOfBirth,
              isDateOfBirthFocused,
              isDateOfBirthValid
            )}
          />
          <InputNote
            id="dobnote"
            value={dateOfBirth}
            valid={isDateOfBirthValid}
            focus={isDateOfBirthFocused}
            info="Vous devez avoir entre 12 et 130 ans."
          />
        </div>

        {/* Password field */}
        <div className="mb-6">
          <label htmlFor="password" className="sr-only">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            disabled={isLoading}
            required
            aria-invalid={isPasswordValid ? "false" : "true"}
            aria-describedby="passwordnote"
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            placeholder="Mot de passe"
            className={inputStyle(password, isPasswordFocused, isPasswordValid)}
          />
          <InputNote
            id="passwordnote"
            value={password}
            valid={isPasswordValid}
            focus={isPasswordFocused}
            info="Doit faire entre 8 et 24 caractères."
          />
        </div>

        {/* Password confirmation field */}
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="sr-only">
            Confirmation du mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            autoComplete="off"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            disabled={isLoading}
            required
            aria-invalid={isConfirmPasswordValid ? "false" : "true"}
            aria-describedby="confirmPasswordnote"
            onFocus={() => setIsConfirmPasswordFocused(true)}
            onBlur={() => setIsConfirmPasswordFocused(false)}
            placeholder="Confirmation du mot de passe"
            className={inputStyle(
              confirmPassword,
              isConfirmPasswordFocused,
              isConfirmPasswordValid
            )}
          />
          <InputNote
            id="confirmPasswordnote"
            value={confirmPassword}
            valid={isConfirmPasswordValid}
            focus={isConfirmPasswordFocused}
            info="Doit correspondre au mot de passe."
          />
        </div>

        <button
          type="submit"
          value="S'inscrire"
          className="mt-8 py-3 rounded-lg bg-brand-400 hover:bg-brand-300 text-neutral-50 font-semibold w-full active:bg-brand-500 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-brand-300 focus:ring-opacity-75 cursor-pointer disabled:cursor-not-allowed disabled:bg-foreground-100 transition duration-100 ease-in-out"
          disabled={
            !isEmailValid ||
            !isUsernameValid ||
            !isPseudonymValid ||
            !isPasswordValid ||
            !isConfirmPasswordValid ||
            !isDateOfBirthValid
          }
        >
          {isLoading ? (
            <CgSpinnerTwoAlt className="size-5 mx-auto stroke-neutral-50 animate-spin" />
          ) : (
            "S'inscrire"
          )}
        </button>
      </form>
      <p
        className={classNames(
          "text-brand-300 text-xs mt-5",
          {
            hidden: !errorMessage,
          },
          {
            block: errorMessage,
          }
        )}
      >
        Erreur : {errorMessage}
      </p>
    </section>
  );
};

export default Register;
