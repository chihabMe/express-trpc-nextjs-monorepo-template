import { trpc } from "@/trpc";
import Button from "@/ui/Button";
import Input from "@/ui/Input";
import { Form, Formik } from "formik";
import React, { FormEvent, useState } from "react";
import { loginSchema } from "@/schemas/login.schema";
import { useRouter } from "next/router";
import parseZodErros from "@/utils/parseZodErros";
const initialForm = {
  email: "",
  password: "",
};
const Login = () => {
  const loginMutation = trpc.auth.obtainToken.useMutation();
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col justify-center items-center ">
      <div className="w-full max-w-sm flex flex-col gap-4  pt-10">
        <Formik
          initialValues={initialForm}
          validateOnMount={true}
          // validationSchema={loginSchema}
          onSubmit={async (values, helpers) => {
            helpers.setSubmitting(true);
            loginMutation.mutate({
              password: values.password,
              email: values.email,
            }, {
              onSuccess: (data) => {
                router.push("/");
              },
              onError: (error) => {
                const errors = error.data?.zodError;
                //@ts-ignore
                const fieldErros = parseZodErros(errors);
                helpers.setErrors(fieldErros);
              },
            });
          }}
        >
          {(props) => (
            <Form className="flex flex-col w-full max-w-md gap-4 ">
              <Input label="Email" name="email" type="email" />
              <Input label="Passowrd" name="password" type="password" />
              <div className="py-2" />
              <Button
                type="submit"
                // disabled={props.isSubmitting || !props.isValid}
                className=""
              >
                login
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
};

export default Login;
