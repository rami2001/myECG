import { useState, useContext } from "react";
import classNames from "classnames";

import RegisterContext from "@/context/RegisterContext";
import CustomInput from "@/components/CustomInput";
import SubmitButton from "@/components/SubmitButton";

import validatePassword from "@/util/validatePassword";

const PasswordStep = ({ onNextStep, onPreviousStep }) => {
  const { userData, setUserData, register } = useContext(RegisterContext);

  const [match, setMatch] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (value) => {
    setUserData((user) => ({ ...user, password: value }));
  };

  const handleMatchChange = (value) => {
    setMatch(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const password = userData.password;

    const isPasswordValid = validatePassword(password);
    const isMatching = match === password;

    const validEntries = isPasswordValid && isMatching;

    if (!validEntries) {
      setErrorMessage("Entrée invalide.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await register();
      onNextStep();
    } catch (error) {
      setErrorMessage(error.response?.data.message);
      setUserData((user) => ({ ...user, password: "" }));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousState = () => onPreviousStep();

  return (
    <div className="flex flex-col text-center gap-12 wrapper lg:flex-row lg:justify-around lg:items-center">
      <div className="lg:w-1/2">
        <h1 className="text-3xl font-semibold lg:text-5xl">Dernière étape</h1>
      </div>
      <div className="flex flex-col wrapper">
        <form onSubmit={handleSubmit} id="password" className="my-auto">
          {/* Champs du mot de passe */}
          <CustomInput
            id="password"
            type="password"
            label="Mot de passe"
            disabled={isLoading}
            defaultValue={userData.password}
            errorMessage="Doit faire entre 08 et 24 caractères."
            shouldTrim={false}
            testFunction={(value) => validatePassword(value)}
            handleChange={handlePasswordChange}
          />
          {/* Champs de confirmation du mot de passe */}
          <CustomInput
            id="match"
            type="password"
            label="Confirmation du mot de passe"
            disabled={isLoading}
            defaultValue={""}
            errorMessage="Doit correspondre au mot de passe."
            shouldTrim={false}
            testFunction={(value) => value === userData.password}
            handleChange={handleMatchChange}
          />
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
        </form>
        <div className="mt-auto flex flex-col gap-2">
          <SubmitButton
            isLoading={isLoading}
            shouldDisable={
              !validatePassword(userData.password) ||
              userData.password !== match
            }
            formId="password"
          >
            Terminer
          </SubmitButton>
          <button
            onClick={handlePreviousState}
            className="text-brand-300 hover:text-brand-400 mb-3"
          >
            &larr; Retourner en arrière
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordStep;
