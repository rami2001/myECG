import { useEffect, useRef, useState } from "react";
import { classNames as cn } from "classnames";

const Register = () => {
  const usernameRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [pseudonym, setPseudonym] = useState("");
  const [validPseudonym, setValidPseudonym] = useState(false);
  const [pseudonymFocus, setPseudonymFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [match, setMatch] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    setValidUsername(USERNAME_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPseudonym(PSEUDONYM_REGEX.test(pseudonym));
  }, [pseudonym]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidMatch(match === password);
  }, [password, match]);

  return (
    <section>
      <h1>Register</h1>
      <p
        className={errorMessage ? "text-red-600" : "hidden"}
        aria-live="assertive"
      >
        {errorMessage}
      </p>
      <form action="">
        <label htmlFor="username">username:</label>
        <input
          type="text"
          id="username"
          name="username"
          ref={usernameRef}
          autoComplete="off"
          onChange={(e) => setUsername(e.value)}
          required
          aria-invalid={validUsername ? "false" : "true"}
          aria-describedby="uidnote"
          onFocus={setUsernameFocus(true)}
          onBlur={setUsernameFocus(false)}
        />
      </form>
    </section>
  );
};

export default Register;
