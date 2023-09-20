import { trpc } from "@/trpc";
import Button from "@/ui/Button";
import Input from "@/ui/Input";
import { Form, Formik } from "formik";
import React, { FormEvent, useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { loginSchema } from "server/src/trpc";
const initialForm = {
  email: "",
  password: "",
};
const Login = () => {
  const loginMutation = trpc.auth.obtainToken.useMutation();
  return (
    <main>
      <div>
        <Formik
          initialValues={initialForm}
          validateOnBlur={true}
          onSubmit={(values, helpers) => {
            console.log(values);
          }}
        >
          {(props) => (
            <Form className="flex flex-col w-full max-w-md gap-2 ">
              <Input name="email" type="email" />
              <Input name="password" type="password" />
              <div className="py-2" />
              <Button>
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
