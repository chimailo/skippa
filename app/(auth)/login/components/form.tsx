"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
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
import { useToast } from "@/app/components/ui/use-toast";
import Spinner from "@/app/components/loading";
import { splitCamelCaseText } from "@/app/utils";

type FormDataType = z.infer<typeof FormSchema>;

const resendCode = async (email: string) => {
  const res = await fetch(`/api/merchants/resend-code`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  const { data } = await res.json();

  return data;
};

const FormSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z.string().nonempty({ message: "Password is required" }),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<FormDataType>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    values: {
      email: "",
      password: "",
    },
  });
  const { toast } = useToast();

  async function handleVerifyAccount(form: FormDataType, createToken?: string) {
    await resendCode(form.email);
    // Create cookie with the user login credentials to use to log
    // them in when they verify their account
    saveToCookie("password", form.password);
    router.push(
      `/register/verify-account?createToken=${createToken}&email=${form.email}`
    );
  }

  const saveToCookie = (name: string, payload: string) => {
    const encodePayload = btoa(payload);
    document.cookie = `${name}=${encodePayload}; max-age=120;`;
  };

  async function onSubmit(formData: FormDataType) {
    try {
      const res = await signIn("credentials", {
        ...formData,
        redirect: false,
      });

      if (res?.error) {
        const error = JSON.parse(res.error);

        // use `createToken` instead when it is added to the login response
        // for an account that is not yet verified
        if (error.message === "Complete you signup process") {
          toast({
            duration: 1000 * 60 * 2,
            variant: "destructive",
            title: splitCamelCaseText(error.name) || undefined,
            description:
              error.message ||
              "There was a problem with your request, please try again",
          });
          handleVerifyAccount(formData, error.createToken);
          return;
        }

        toast({
          variant: "destructive",
          title: splitCamelCaseText(error.name) || undefined,
          description:
            error.message ||
            "There was a problem with your request, please try again",
        });
        return;
      }

      form.reset();
      router.push("/onboarding");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ooops..., an error has occured",
      });
    }
  }

  return (
    <div className="shadow-3xl rounded-lg py-6 px-5 sm:px-8 md:py-8 xl:px-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 md:space-y-8"
        >
          <h1 className="text-2xl mb-6 md:mb-10 font-bold">Login</h1>
          <FormField
            control={form.control}
            name="email"
            render={({ field, formState }) => (
              <FormItem>
                <FormLabel className="">Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </Button>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-4">
            <Link
              href="/forgot-password"
              className="text-primary mt-8 font-bold text-sm"
            >
              Forgot password?
            </Link>
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
            <p className="text-sm text-center font-medium">
              Don&apos;t have an account?
              <Link
                href="/"
                className="text-primary text-medium hover:underline ml-2"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
