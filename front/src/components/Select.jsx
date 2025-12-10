import React from "react";
import InputRow from "./ui/InputRow";

const Select = ({ onChange, value, label, options, name }) => {
  return (
      <div className="fieldset">
        <label className="fieldset-legend" htmlFor="symbol-choice">
          {label}
        </label>
        <select
          id="symbol-choice"
          onChange={onChange}
          value={value}
          name={name}
          className="select select-error w-full"
        >
          <option disabled={true}> {label} </option>
          {options.map((option) => (
            <option key={option}> {option} </option>
          ))}
        </select>
    </div>
  );
};

export default Select;
