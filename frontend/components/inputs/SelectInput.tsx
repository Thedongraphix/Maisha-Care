import { useField } from "formik";
import React from "react";

const SelectInput = ({ label, ...props }:any) => {
  const [field, meta] = useField(props);
  return (
    <>
      <div className="flex flex-col">
        <label htmlFor={props.id || props.name}>{label}</label>
        <select
          className="border border-black rounded-lg px-4 py-2 bg-transparent text-black text-sm outline-none"
          {...field}
          {...props}
        />
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
    </>
  );
};

export default SelectInput;
