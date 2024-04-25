import { useState, useContext, useEffect } from "react";
import classNames from "classnames";

import RegisterContext from "@/context/RegisterContext";
import CustomInput from "@/components/CustomInput";
import SubmitButton from "@/components/SubmitButton";

import validateDateOfBirth from "@/util/validateDateOfBirth";
import validatePseudonym from "@/util/validatePseudonym";
import { RadioGroup } from "@headlessui/react";

const genders = [
  { value: "male", label: "Homme" },
  { value: "female", label: "Femme" },
];

const InfoStep = ({ onNextStep, onPreviousStep }) => {
  const { userData, setUserData } = useContext(RegisterContext);
  const [gender, setGender] = useState(userData.gender);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePseudonymChange = (value) => {
    setUserData((user) => ({ ...user, pseudonym: value }));
  };

  const handleDateOfBirthChange = (value) => {
    setUserData((user) => ({ ...user, dateOfBirth: value }));
  };

  useEffect(() => {
    setUserData((user) => ({ ...user, gender: gender }));
  }, [gender]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pseudonym = userData.pseudonym;
    const dateOfBirth = userData.dateOfBirth;

    const isPseudonymValid = validatePseudonym(pseudonym);
    const isDateOfBirthValid = validateDateOfBirth(dateOfBirth);
    const isGenderValid = gender === "male" || gender === "female";

    const validEntries =
      isPseudonymValid && isDateOfBirthValid && isGenderValid;

    if (!validEntries) {
      setErrorMessage("Entrée invalide.");
      return;
    }

    onNextStep();
  };

  const handlePreviousState = () => onPreviousStep();

  return (
    <div className="flex flex-col text-center gap-12 wrapper lg:flex-row lg:justify-around lg:items-center">
      <div className="lg:w-[50%]">
        <h1 className="lg:font-semibold text-3xl lg:text-5xl">
          Quelques informations supplémentaires...
        </h1>
      </div>
      <div className="flex flex-col wrapper justify-center">
        <form onSubmit={handleSubmit} id="info" className="my-auto">
          {/* Champs du pseudonyme */}
          <CustomInput
            id="pseudonym"
            type="text"
            label="Pseudonyme"
            disabled={false}
            defaultValue={userData.pseudonym}
            errorMessage="Doit faire entre 04 et 28 caractères."
            shouldTrim={true}
            testFunction={(value) => validatePseudonym(value)}
            handleChange={handlePseudonymChange}
          />
          {/* Champs de la date de naîssance */}
          <CustomInput
            id="dob"
            type="date"
            label="Date de naîssance"
            disabled={false}
            defaultValue={userData.dateOfBirth}
            errorMessage="Vous devez avoir entre 12 et 130 ans."
            shouldTrim={false}
            testFunction={(value) => validateDateOfBirth(value)}
            handleChange={handleDateOfBirthChange}
          />
          <RadioGroup value={gender} onChange={setGender}>
            <RadioGroup.Label className="sr-only">Genre</RadioGroup.Label>
            <div className="flex justify-around">
              {genders.map((gender) => (
                <RadioGroup.Option
                  value={gender.value}
                  key={gender.value}
                  className="bg-red"
                >
                  {({ checked }) => (
                    <span
                      className={classNames(
                        "rounded-lg hover:bg-brand-300 hover:text-neutral-50 py-2 px-7 active:bg-brand-500 active:ring active:ring-offset-2 active:ring-brand-300 active:ring-opacity-75  focus:outline-none focus:ring focus:ring-offset-2 focus:ring-brand-300 focus:ring-opacity-75 transition duration-300 cursor-pointer",
                        { "bg-brand-400 text-neutral-50": checked }
                      )}
                    >
                      {gender.label}
                    </span>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
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
            isLoading={false}
            shouldDisable={
              !validatePseudonym(userData.pseudonym) ||
              !validateDateOfBirth(userData.dateOfBirth)
            }
            formId="info"
          >
            Continuer
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

export default InfoStep;
