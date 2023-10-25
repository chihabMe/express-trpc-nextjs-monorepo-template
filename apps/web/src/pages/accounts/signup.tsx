import { trpc } from "@/trpc";
import Button from "@/ui/Button";
import Input from "@/ui/Input";
import { Form, Formik } from "formik";
import React  from "react";
import { useRouter } from "next/router";
import parseZodErros from "@/utils/parseZodErros";
const initialForm = {
  email: "",
  username: "",
  password: "",
  rePassword: "",
};
const SingUp = () => {
  const singupMutation = trpc.accounts.createAccount.useMutation()
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col justify-center items-center ">
      <div className="w-full max-w-sm flex flex-col gap-4  pt-10">
        <Formik
          initialValues={initialForm}
          validateOnMount={true}
          onSubmit={async (values, helpers) => {
            helpers.setSubmitting(true);
            singupMutation.mutate({
              password: values.password,
              email: values.email,
              username:values.username,
              rePassword:values.rePassword
            }, {
              onSuccess: (data) => {
                router.push("/accounts/login");
              },
              onError: (error) => {
                const errors = error.data?.errors;
                //@ts-ignore
                const fieldErros = parseZodErros(errors);
                helpers.setErrors(fieldErros);
              },
            });
          }}
        >
          {(props) => (
            <Form className="flex flex-col w-full max-w-md gap-4 ">
              <Input label="Username" name="username" type="text" />
              <Input label="Email" name="email" type="email" />
              <Input label="Passowrd" name="password" type="password" />
              <Input label="Confirm your password" name="rePassword" type="password" />
              <div className="py-2" />
              <Button
                type="submit"
                // disabled={props.isSubmitting || !props.isValid}
                className=""
              >
                singup
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
};

export default SingUp;
