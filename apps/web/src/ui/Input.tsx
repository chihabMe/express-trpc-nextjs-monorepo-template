import React from "react";
import { useField } from "formik";

// Separate component for rendering validation errors
//
const ValidationError = ({ errors }: { errors: string[] }) => (
  <div className="text-red-400">
    {errors}
  </div>
);

interface InputProps {
  name: string;
  type: string;
}
const Input = ({ name, type, ...props }: InputProps) => {
  const [field, meta, helpers] = useField({ name });
  const errors = meta.touched ? meta.error as string[] | undefined : undefined;
  const valid = meta.touched && !meta.error;
  console.log("errors", errors);
  return (
    <div className="flex flex-col gap-2">
      <input
        {...field}
        {...props}
        id={name}
        type={type}
        className={` ${errors && "outline-red-400 text-red-400"} ${
          valid && "!outline-green-400 text-green-400"
        } rounded-md w-full  outline-gray-200 transform duration-200 focus:outline-blue-400 outline-2 outline  px-2 h-10 text-title font-medium`}
      />
      {meta.touched && errors && <ValidationError errors={errors} />}
    </div>
  );
};

export default Input;
