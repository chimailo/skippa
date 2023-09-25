"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import Spinner from "@/app/components/loading";

type FormType = z.infer<typeof FormSchema>;

const FormSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email" }),
});

export default function ForgotPasswordForm() {
  const [alert, setAlert] = useState(false);
  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    values: {
      email: "",
    },
  });

  function onSubmit(data: FormType) {
    console.log(data);
    setAlert(true);
    form.reset();
  }

  return (
    <div className="shadow-3xl rounded-lg py-16 px-5 sm:px-8 md:py-20 md:max-w-md">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-12 sm:px-8"
        >
          <div className="text-center max-w-xs mx-auto">
            <h1 className="text-2xl mb-3 font-bold">Reset Password</h1>
            <p className="text-sm">
              Please enter your email to receive a link to help set up your new
              password
            </p>
          </div>
          {alert && (
            <Alert variant="primary">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                An email with a link to reset your password has been sent to the
                provided email address
              </AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} placeholder="Email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            size="lg"
            className="w-full font-bold hover:bg-primary hover:opacity-90 transition-opacity text-lg xl:text-2xl"
          >
            Log In
            {form.formState.isSubmitting && (
              <Spinner
                twColor="text-white before:bg-white"
                twSize="w-4 h-4"
                className="ml-3"
              />
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
