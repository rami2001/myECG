import { useState, useContext } from "react";
import classNames from "classnames";

import RegisterContext from "@/context/RegisterContext";
import CustomInput from "@/components/CustomInput";
import SubmitButton from "@/components/SubmitButton";

import axios from "@/api/axios";
import validateUsername from "@/util/validateUsername";
import validateEmail from "@/util/validateEmail";

const IdStep = ({ onNextStep }) => {
  const { userData, setUserData } = useContext(RegisterContext);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (value) => {
    setUserData((user) => ({ ...user, email: value }));
  };

  const handleUsernameChange = (value) => {
    setUserData((user) => ({ ...user, username: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = userData.email;
    const username = userData.username;

    const isEmailValid = validateEmail(email);
    const isUsernameValid = validateUsername(username);

    const validEntries = isEmailValid && isUsernameValid;

    if (!validEntries) {
      setErrorMessage("Entrée invalide.");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("/register/check", JSON.stringify({ email, username }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      onNextStep();
    } catch (error) {
      if (!error?.response)
        setErrorMessage("Vous n'êtes pas connecté à internet.");
      else setErrorMessage(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col text-center gap-12 wrapper lg:flex-row lg:justify-around lg:items-center">
      <div className="lg:w-[50%]">
        <h1 className="text-3xl font-semibold lg:text-5xl">Inscription</h1>
        <p className="my-3 leading-none">
          Vous avez déjà un compte ?
          <br />
          <a href="" className="text-brand-400 lg:text-lg">
            Connectez-vous
          </a>
          .
        </p>
      </div>
      <div className="flex flex-col wrapper justify-center">
        <form onSubmit={handleSubmit} id="id" className="my-auto">
          {/* Champs de l'email */}
          <CustomInput
            id="email"
            type="text"
            label="Adresse e-mail"
            disabled={isLoading}
            defaultValue={userData.email}
            errorMessage="Doit être une adresse mail valide."
            shouldTrim={false}
            testFunction={(value) => validateEmail(value)}
            handleChange={handleEmailChange}
          />
          {/* Champs du nom d'utilisateur */}
          <CustomInput
            id="username"
            type="text"
            label="Nom d'utilisateur"
            disabled={isLoading}
            defaultValue={userData.username}
            errorMessage="Doit faire entre 08 et 24 caractères et être alphanumérique."
            shouldTrim={true}
            testFunction={(value) => validateUsername(value)}
            handleChange={handleUsernameChange}
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
              !validateEmail(userData.email) ||
              !validateUsername(userData.username)
            }
            formId="id"
          >
            Continuer
          </SubmitButton>
          <button>
            <a href="/" className="text-brand-300 hover:text-brand-400">
              &larr; Revenir à l'accueil
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdStep;
