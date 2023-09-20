import React from "react";
import { useField } from "formik";

// Separate component for rendering validation errors
//
const ValidationError = ({ errors }: { errors: string[] }) => (
  <div>
    {errors}
  </div>
);

interface InputProps {
  name: string;
  type: string;
}
const Input = ({ name, type, ...props }: InputProps) => {
  const [field, meta, helpers] = useField<>({ name });
  const errors = meta.error as string[] | undefined;
  console.log("errors", errors);
  return (
    <div className="flex flex-col gap-2">
      <input
        {...field}
        {...props}
        id={name}
        type={type}
        className=" rounded-md w-full bg-gray-200 outline-gray-50 active:outline-blue-300 outline-2 outline  px-2 h-10 text-title font-medium"
      />
      {meta.touched && errors && <ValidationError errors={errors} />}
    </div>
  );
};

export default Input;
