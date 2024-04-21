import { useRef, useState, useEffect } from "react";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import CustomInput from "@/components/register/Input";
import classNames from "classnames";
import validateDateOfBirth from "@/util/validateDateOfBirth";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  PSEUDONYM_REGEX,
  USERNAME_REGEX,
} from "@/util/regex";

const Register = () => {
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const pseudonymRef = useRef(null);
  const dateOfBirthRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    emailRef?.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef?.current?.value || "";
    const username = usernameRef?.current?.value || "";
    const pseudonym = pseudonymRef?.current?.value || "";
    const dateOfBirth = dateOfBirthRef?.current?.value || "";
    const password = passwordRef?.current?.value || "";
    const confirmPassword = confirmPasswordRef?.current?.value || "";

    const isEmailValid = EMAIL_REGEX.test(email);
    const isUsernameValid = USERNAME_REGEX.test(username);
    const isPseudonymValid = PSEUDONYM_REGEX.test(pseudonym);
    const isPasswordValid = PASSWORD_REGEX.test(password);
    const isConfirmPasswordValid = password === confirmPassword;
    const isDateOfBirthValid = validateDateOfBirth(dateOfBirth);

    const validEntries =
      isEmailValid &&
      isUsernameValid &&
      isPasswordValid &&
      isConfirmPasswordValid &&
      isPseudonymValid &&
      isDateOfBirthValid;

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

  const shouldDisableButton = () => {
    const email = emailRef?.current?.value || "";
    const username = usernameRef?.current?.value || "";
    const pseudonym = pseudonymRef?.current?.value || "";
    const dateOfBirth = dateOfBirthRef?.current?.value || "";
    const password = passwordRef?.current?.value || "";
    const confirmPassword = confirmPasswordRef?.current?.value || "";

    const isEmailValid = EMAIL_REGEX.test(email);
    const isUsernameValid = USERNAME_REGEX.test(username);
    const isPseudonymValid = PSEUDONYM_REGEX.test(pseudonym);
    const isPasswordValid = PASSWORD_REGEX.test(password);
    const isConfirmPasswordValid = password === confirmPassword;
    const isDateOfBirthValid = validateDateOfBirth(dateOfBirth);

    return (
      !isEmailValid ||
      !isUsernameValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid ||
      !isPseudonymValid ||
      !isDateOfBirthValid
    );
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
        <CustomInput
          ref={emailRef}
          id="email"
          type="text"
          label="Adresse e-mail"
          disabled={isLoading}
          errorMessage="Doit être une adresse mail valide."
          shouldTrim={false}
          testFunction={(value) => EMAIL_REGEX.test(value)}
        />
        {/* Username field */}
        <CustomInput
          ref={usernameRef}
          id="username"
          type="text"
          label="Nom d'utilisateur"
          disabled={isLoading}
          errorMessage="Doit faire entre 08 et 24 caractères et être alphanumérique."
          shouldTrim={true}
          testFunction={(value) => USERNAME_REGEX.test(value)}
        />
        {/* Pseudonym field */}
        <CustomInput
          ref={pseudonymRef}
          id="pseudonym"
          type="text"
          label="Pseudonyme"
          disabled={isLoading}
          errorMessage="Doit faire entre 04 et 28 caractères."
          shouldTrim={true}
          testFunction={(value) => PSEUDONYM_REGEX.test(value)}
        />
        {/* Date of birth field */}
        <CustomInput
          ref={dateOfBirthRef}
          id="dateOfBirth"
          type="date"
          label="Date de naissance"
          disabled={false}
          errorMessage="Vous devez avoir entre 12 et 130 ans."
          shouldTrim={false}
          testFunction={(value) => validateDateOfBirth(value)}
        />
        {/* Password field */}
        <CustomInput
          ref={passwordRef}
          id="password"
          type="password"
          label="Mot de passe"
          disabled={false}
          errorMessage="Doit faire entre 8 et 24 caractères."
          shouldTrim={false}
          testFunction={(value) => PASSWORD_REGEX.test(value)}
        />
        {/* Password confirmation field */}
        <CustomInput
          ref={confirmPasswordRef}
          id="confirmPassword"
          type="password"
          label="Confirmation du mot de passe"
          disabled={false}
          errorMessage="Doit faire entre 8 et 24 caractères."
          shouldTrim={false}
          testFunction={(value) => value === passwordRef.current.value}
        />
        <button
          type="submit"
          value="S'inscrire"
          className="mt-8 py-3 rounded-lg bg-brand-400 hover:bg-brand-300 text-neutral-50 font-semibold w-full active:bg-brand-500 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-brand-300 focus:ring-opacity-75 cursor-pointer disabled:cursor-not-allowed disabled:bg-foreground-100 transition duration-100 ease-in-out"
          disabled={shouldDisableButton()}
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
