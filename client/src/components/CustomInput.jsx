import React, { useEffect, useState, useMemo } from "react";
import classNames from "classnames";

const InputNote = React.memo(({ id, info, value, focus, valid }) => {
  return (
    <p
      id={id}
      className={classNames(
        "px-1 my-2 text-xs text-brand-300 text-left transition-opacity duration-100",
        {
          "opacity-100": focus && value && !valid,
          "opacity-0": !(focus && value && !valid),
        }
      )}
    >
      {info}
    </p>
  );
});

const inputStyle = (value, focus, valid) =>
  useMemo(
    () =>
      classNames(
        "w-full text-sm bg-background-50 px-3 py-2 rounded-lg border-[3px] shadow-sm disabled:bg-background-300 transition duration-200 ease-in-out focus:ring-0",
        {
          "border-foreground-50": !focus && !value,
        },
        {
          "focus:border-foreground-200": focus && !value,
        },
        {
          "border-accent-400 focus:border-accent-400": valid && value,
        },
        {
          "border-brand-400 focus:border-brand-400 text-brand-300":
            !valid && value,
        }
      ),
    [value, focus, valid]
  );

const CustomInput = ({
  id,
  type,
  label,
  disabled,
  errorMessage,
  shouldTrim,
  testFunction,
  handleChange,
  defaultValue,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [isValid, setIsValid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const validity = testFunction(value);
    setIsValid(validity);
  }, [value]);

  const onChange = (e) => {
    const value = shouldTrim ? e.target.value.trim() : e.target.value;
    setValue(value);
    handleChange(value);
  };

  return (
    <div className="mb-8">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        type={type}
        id={id}
        autoComplete="off"
        onChange={onChange}
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
};

export default CustomInput;
