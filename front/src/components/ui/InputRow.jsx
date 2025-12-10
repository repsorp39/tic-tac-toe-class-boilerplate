import React from "react";

const InputRow = ({
  onChange,
  value,
  name,
  type,
  label,
  placeholder = "",
  errorMessage = "",
  className = "",
  ...props
}) => {
  return (
    <div>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">{label}</legend>
        <input
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          className={`input w-full ${className} `}
          {...props}
        />
        <p className="label text-red-700">{errorMessage}</p>
      </fieldset>
    </div>
  );
};

export default InputRow;
