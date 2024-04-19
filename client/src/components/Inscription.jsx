import { useState, useEffect, useRef } from "react";

import { BiInfoCircle } from "react-icons/bi";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";

import {
  EMAIL_REGEX,
  USERNAME_REGEX,
  PASSWORD_REGEX,
  PSEUDONYM_REGEX,
} from "../../util/regex";

const Inscription = () => {
  const emailRef = useRef();

  const [formState, setFormState] = useState({
    email: "",
    username: "",
    pseudonym: "",
    password: "",
    match: "",
    dateOfBirth: "",
  });

  const [validations, setValidations] = useState({
    email: false,
    username: false,
    pseudonym: false,
    password: false,
    match: false,
    dateOfBirth: true,
  });

  const [focuses, setFocuses] = useState({
    email: false,
    username: false,
    pseudonym: false,
    password: false,
    match: false,
    dateOfBirth: false,
  });

  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setValidations((prevValidations) => ({
      ...prevValidations,
      email: EMAIL_REGEX.test(formState.email),
    }));
  }, [formState.email]);

  useEffect(() => {
    setValidations((prevValidations) => ({
      ...prevValidations,
      username: USERNAME_REGEX.test(formState.username),
    }));
  }, [formState.username]);

  useEffect(() => {
    setValidations((prevValidations) => ({
      ...prevValidations,
      pseudonym: PSEUDONYM_REGEX.test(formState.pseudonym),
    }));
  }, [formState.pseudonym]);

  useEffect(() => {
    setValidations((prevValidations) => ({
      ...prevValidations,
      password: PASSWORD_REGEX.test(formState.password),
      match: formState.password === formState.match,
    }));
  }, [formState.password, formState.match]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO
  };

  return (
    <section>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="sr-only">
            Adresse e-mail:
          </label>
          <input
            type="text"
            id="email"
            ref={emailRef}
            autoComplete="off"
            onChange={(e) =>
              setFormState((previous) => ({
                ...previous,
                email: e.target.value,
              }))
            }
            value={formState.email}
            required
            aria-invalid={validations.email ? "false" : "true"}
            aria-describedby="emailnote"
            onFocus={() =>
              setFocuses((previous) => ({ ...previous, email: true }))
            }
            onBlur={() =>
              setFocuses((previous) => ({ ...previous, email: false }))
            }
          />
          <p
            id="emailnote"
            className={
              focuses.email && formState.email && !validations.email
                ? "bg-slate-900 text-white"
                : "hidden"
            }
          >
            <BiInfoCircle />
            Doit être une adresse e-mail valide.
          </p>
        </div>
        <div>
          <label htmlFor="username" className="sr-only">
            Nom d'utilisateur:
          </label>
          <input
            type="email"
            id="username"
            autoComplete="off"
            onChange={(e) =>
              setFormState((previous) => ({
                ...previous,
                username: e.target.value,
              }))
            }
            value={formState.username}
            required
            aria-invalid={validations.username ? "false" : "true"}
            aria-describedby="usernamenote"
            onFocus={() =>
              setFocuses((previous) => ({ ...previous, username: true }))
            }
            onBlur={() =>
              setFocuses((previous) => ({ ...previous, username: false }))
            }
          />
          <p
            id="usernamenote"
            className={
              focuses.username && formState.username && !validations.username
                ? "block"
                : "hidden"
            }
          >
            <BiInfoCircle />
            Doit faire entre 04 et 24 caractères.
            <br />
            Doit commencer par une lettre.
            <br />
            Lettres, chiffres, et tirets seulement permis.
            <br />
          </p>
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Mot de passe:
            <CiCircleCheck
              className={validations.password ? "stroke-green-600" : "hidden"}
            />
            <CiCircleRemove
              className={
                validations.password || !formState.password
                  ? "hidden"
                  : "stroke-red-600"
              }
            />
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) =>
              setFormState((previous) => ({
                ...previous,
                password: e.target.value,
              }))
            }
            value={formState.password}
            required
            aria-invalid={validations.password ? "false" : "true"}
            aria-describedby="pwdnote"
            onFocus={() =>
              setFocuses((previous) => ({ ...previous, password: true }))
            }
            onBlur={() =>
              setFocuses((previous) => ({ ...previous, password: false }))
            }
          />
          <p
            id="pwdnote"
            className={
              focuses.password && formState.password && !validations.password
                ? "bg-slate-900 text-white"
                : "hidden"
            }
          >
            <BiInfoCircle />
            Doit faire entre 8 et 24 caractères.
          </p>
        </div>
        <div>
          <label htmlFor="match" className="sr-only">
            Confirmation du mot de passe :
            <CiCircleCheck
              className={
                validations.match && formState.match
                  ? "stroke-green-600"
                  : "hidden"
              }
            />
            <CiCircleRemove
              className={
                validations.match || !formState.match
                  ? "hidden"
                  : "stroke-red-600"
              }
            />
          </label>
          <input
            type="password"
            id="match"
            onChange={(e) =>
              setFormState((previous) => ({
                ...previous,
                match: e.target.value,
              }))
            }
            value={formState.match}
            required
            aria-invalid={validations.match ? "false" : "true"}
            aria-describedby="confirmnote"
            onFocus={() =>
              setFocuses((previous) => ({ ...previous, match: true }))
            }
            onBlur={() =>
              setFocuses((previous) => ({ ...previous, match: false }))
            }
          />
          <p
            id="confirmnote"
            className={
              focuses.match && !validations.match
                ? "bg-slate-900 text-white"
                : "hidden"
            }
          >
            <BiInfoCircle />
            Doit correspondre au mot de passe saisi.
          </p>
        </div>
        <div></div>
        <button
          disabled={
            Object.values(validations).some(
              (validation) => validation === false
            )
              ? true
              : false
          }
          className="disabled:text-red-600"
        >
          S'inscrire
        </button>
      </form>
    </section>
  );
};

export default Inscription;
