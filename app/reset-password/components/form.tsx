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

const FormSchema = z
  .object({
    password: z
      .string()
      .nonempty({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters long")
      .superRefine((val, ctx) => {
        if (!/\d/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must contain a digit",
          });
        }
        if (!/[a-z]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least a lowercase letter",
          });
        }
        if (!/[A-Z]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least a uppercase letter",
          });
        }
        if (!/[!@#$%^&*?}{'><.,;~/`)(+=._-]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least a special character",
          });
        }
      }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password do not match",
    path: ["confirmPassword"],
  });

export default function ForgotPasswordForm() {
  const [alert, setAlert] = useState(false);
  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    values: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: FormType) {
    console.log(data);
    setAlert(true);
    form.reset();
  }

  return (
    <div className="shadow-3xl rounded-lg py-12 px-5 sm:px-8 md:py-16 w-full sm:max-w-md">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 sm:px-8 sm:min-w-[24rem]"
        >
          <h1 className="text-2xl text-center mb-3 font-bold">
            Reset Password
          </h1>
          {alert && (
            <Alert variant="primary">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your password has been reset successfully, you may login with
                your new password.
              </AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="">Password</FormLabel>
                <FormControl className="flex items-center gap-3">
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="">Confirm Password</FormLabel>
                <FormControl className="flex items-center gap-3">
                  <Input {...field} />
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
            Submit
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
