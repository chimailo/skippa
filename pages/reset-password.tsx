"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/spinner";
import { splitCamelCaseText } from "@/lib/utils";
import Footer from "@/components/footer";
import Layout from "@/components/layout";
import Container from "@/components/container";
import $api from "@/lib/axios";

type FormType = z.infer<typeof FormSchema>;

const FormSchema = z
  .object({
    password: z
      .string()
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
    confirmPassword: z.string().min(8, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password do not match",
    path: ["confirmPassword"],
  });

export default function ForgotPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      const res = await $api({
        url: `/auth/token/${token}/password/reset`,
        method: "put",
        data,
      });

      toast({
        duration: 1000 * 5,
        variant: "primary",
        title: splitCamelCaseText(res.name) || undefined,
        description: res.message || "Your password reset was successful",
      });
      form.reset();

      setTimeout(() => {
        router.push("/login");
      }, 9000);
    } catch (error: any) {
      toast({
        duration: 1000 * 5,
        variant: "destructive",
        title: splitCamelCaseText(error.data?.name) || undefined,
        description:
          error.data?.message ||
          error.message ||
          "Failed to reset your password, please try again",
      });
    }
  }

  return (
    <Layout>
      <main className="">
        <Container
          compact
          className="flex items-center justify-center my-16 md:my-24"
        >
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
                        <>
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-gray-100 absolute right-2 top-[1.6rem] z-50"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowPassword(!showPassword);
                            }}
                          >
                            {showPassword ? (
                              <Eye size={18} />
                            ) : (
                              <EyeOff size={18} />
                            )}
                          </Button>
                        </>
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
                        <>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-gray-100 absolute right-2 top-[1.6rem] z-50"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowConfirmPassword(!showConfirmPassword);
                            }}
                          >
                            {showConfirmPassword ? (
                              <Eye size={18} />
                            ) : (
                              <EyeOff size={18} />
                            )}
                          </Button>
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                  }
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
        </Container>
      </main>
      <Footer bg="light" />
    </Layout>
  );
}
