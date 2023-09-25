"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import Spinner from "@/app/components/loading";

type FormType = z.infer<typeof FormSchema>;

const FormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" })
    .nonempty({ message: "Email is required" }),
  password: z.string().nonempty({ message: "Password is required" }),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: FormType) {
    console.log(data);
    // router.push(`/signup`)
    form.reset();
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
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </Button>
                  </>
                </FormControl>
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
              disabled={!form.formState.isValid}
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
