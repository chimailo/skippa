"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { splitCamelCaseText } from "@/app/utils";
import { useToast } from "@/app/components/ui/use-toast";

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

const resetPassword = async (formData: FormType & { token: string | null }) => {
  const res = await fetch(`/api/auth/reset-password`, {
    method: "POST",
    body: JSON.stringify(formData),
  });
  const { data } = await res.json();

  return data;
};

export default function ForgotPasswordForm() {
  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    values: {
      password: "",
      confirmPassword: "",
    },
  });
  const { toast } = useToast();
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get("token");

  async function onSubmit(data: FormType) {
    try {
      const res = await resetPassword({ ...data, token });

      if (res?.error) {
        toast({
          variant: "destructive",
          title: splitCamelCaseText(res.name) || undefined,
          description:
            res.message ||
            "There was a problem with your request, please try again",
        });
        return;
      }

      form.reset();
      router.push("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ooops..., an error has occured",
      });
    }
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
