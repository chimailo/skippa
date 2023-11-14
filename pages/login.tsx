import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
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
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Container from "@/components/container";
import Footer from "@/components/footer";
import Spinner from "@/components/spinner";
import WhySkippa from "@/components/whyskippa";
import $api from "@/lib/axios";
import { splitCamelCaseText } from "@/lib/utils";
import Layout from "@/components/layout";
import { useMerchant } from "@/hooks/merchant";

type FormDataType = z.infer<typeof FormSchema>;

const FormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }),
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
  const { data: session } = useSession();
  const merchant = useMerchant({ user: session?.user || null });

  async function handleVerifyAccount(form: FormDataType) {
    const res = await $api({
      url: `/merchants/account/otp`,
      method: "post",
      data: { email: form.email },
    });
    const token = res.data.accountCreationToken;
    // Create cookie with the user login credentials to use to log
    // them in when they verify their account
    saveToCookie("password", form.password);
    router.push(`/signup/verify-account?token=${token}&email=${form.email}`);
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

      console.log(res);

      if (res?.error) {
        const error = JSON.parse(res.error);

        if (error.message === "Complete your signup process") {
          toast({
            duration: 1000 * 60,
            variant: "destructive",
            title: splitCamelCaseText(error.name) || undefined,
            description: error.message || "Complete your signup process",
          });
          handleVerifyAccount(formData);
          return;
        }
      }

      form.reset();
      merchant.update();
      router.push("/profile");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: splitCamelCaseText(error.data?.name) || undefined,
        description:
          error.data?.message ||
          error.message ||
          "There was a problem with your request, please try again",
      });
    }
  }

  return (
    <Layout>
      <main className="flex flex-col items-center justify-between">
        <Container
          compact
          className="grid md:grid-flow-col md:auto-cols-fr md:gap-6 gap-12 my-12"
        >
          <section className="md:my-40 sm:w-4/5 md:w-full xl:w-4/5">
            <h1 className="text-3xl mb-4 md:mb-6 font-bold">
              Unlocking the power of
              <span className="text-primary ml-2">Skippa!</span>
            </h1>
            <p className="text-sm">
              At Skippa, we understand that the world of logistics is constantly
              evolving, and we&apos;re here to help you stay ahead of the curve.
              Our innovative solutions are designed to meet the unique needs of
              logistics companies and individuals alike.
            </p>
          </section>
          <section className="shadow-3xl rounded-lg py-6 px-5 sm:px-8 md:py-8 xl:px-12">
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
                            type="button"
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
                <div className="space-y-4">
                  <Link
                    href="/forgot-password"
                    className="text-primary mt-8 font-bold text-sm"
                  >
                    Forgot password?
                  </Link>
                  <Button
                    type="submit"
                    disabled={
                      !form.formState.isValid || form.formState.isSubmitting
                    }
                    size="lg"
                    className="w-full font-bold hover:bg-primary hover:opacity-90 gap-3 transition-opacity text-lg xl:text-2xl"
                  >
                    Log In
                    {form.formState.isSubmitting && (
                      <Spinner twSize="w-4 h-4" />
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
          </section>
        </Container>
        <WhySkippa />
      </main>
      <Footer />
      <Toaster />
    </Layout>
  );
}
