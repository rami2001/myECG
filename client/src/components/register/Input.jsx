import { useEffect, useState, forwardRef } from "react";
import classNames from "classnames";

const InputNote = React.memo(({ id, info, value, focus, valid }) => {
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
});

const inputStyle = (value, focus, valid) =>
  useMemo(() =>
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
    ), [value, focus, valid]
  );

const Input = forwardRef((props, forwardedRef) => {
  const { id, type, label, disabled, errorMessage, shouldTrim, testFunction } =
    props;

  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const validity = testFunction(value);
    setIsValid(validity);
  }, [value]);

  return (
    <div className="mb-6">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        ref={forwardedRef}
        type={type}
        id={id}
        autoComplete="off"
        onChange={(e) =>
          setValue(shouldTrim ? e.target.value.trim() : e.target.value)
        }
        value={value}
        disabled={disabled}
        required
        aria-invalid={isValid ? "false" : "true"}
        aria-describedby={`${id}note`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={label}
        className={inputStyle(value, isFocused, isValid)}
      />
      <InputNote
        id={`${id}note`}
        value={value}
        valid={isValid}
        focus={isFocused}
        info={errorMessage}
      />
    </div>
  );
});

export default Input;
