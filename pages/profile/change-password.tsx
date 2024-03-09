import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getIronSession } from "iron-session";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, MoveLeft } from "lucide-react";

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
import Link from "next/link";
import Container from "@/components/container";
import $api from "@/lib/axios";
import Layout from "@/components/layout";
import useSession from "@/hooks/session";
import { sessionOptions } from "@/lib/session";
import { SessionData } from "@/types";

type FormType = z.infer<typeof FormSchema>;

const FormSchema = z
  .object({
    currentPassword: z.string().min(1, "You must enter your current password"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long")
      .superRefine((val, ctx) => {
        if (!/\d/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "New password must contain a digit",
          });
        }
        if (!/[a-z]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "New password must contain at least a lowercase letter",
          });
        }
        if (!/[A-Z]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "New password must contain at least a uppercase letter",
          });
        }
        if (!/[!@#$%^&*?}{'><.,;~/`)(+=._-]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "New password must contain at least a special character",
          });
        }
      }),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password and Confirm Password do not match",
    path: ["confirmPassword"],
  });

export default function ForgotPasswordForm({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    values: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(data: FormType) {
    try {
      const res = await $api({
        method: "put",
        url: `/auth/user/me/password/change`,
        headers: { Authorization: `Bearer ${session.token}` },
        data,
      });

      form.reset();
      toast({
        duration: 1000 * 4,
        variant: "primary",
        title: splitCamelCaseText(res.data?.name) || undefined,
        description:
          res.data.message || "Your password was successfully updated",
      });
      router.push("/profile");
    } catch (error: any) {
      toast({
        duration: 1000 * 4,
        variant: "destructive",
        title: splitCamelCaseText(error.data?.name) || undefined,
        description:
          error.data[0]?.message ||
          error.data?.message ||
          error.message ||
          "There was a problem with your request, please try again",
      });
    }
  }

  return (
    <Layout auth user={session.user} sidebar={{ active: "profile" }}>
      <Container className="py-8">
        <div className="flex items-center gap-3 mb-12">
          <Link
            href="/profile"
            className="rounded-full transition-colors items-center flex justify-center text-black h-10 w-10 hover:bg-zinc-100"
          >
            <MoveLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Change Password</h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-md pl-12"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-base">Current Password</FormLabel>
                  <FormControl className="flex items-center gap-3">
                    <>
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        type="button"
                        className="hover:bg-gray-100 absolute right-2 top-[1.6rem] z-50"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? (
                          <Eye size={18} className="text-zinc-600" />
                        ) : (
                          <EyeOff size={18} className="text-zinc-600" />
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
              name="newPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-base">New Password</FormLabel>
                  <FormControl className="flex items-center gap-3">
                    <>
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        size="sm"
                        type="button"
                        variant="ghost"
                        className="hover:bg-gray-100 absolute right-2 top-[1.6rem] z-50"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowNewPassword(!showNewPassword);
                        }}
                      >
                        {showNewPassword ? (
                          <Eye size={18} className="text-zinc-600" />
                        ) : (
                          <EyeOff size={18} className="text-zinc-600" />
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
                  <FormLabel className="text-base">Confirm Password</FormLabel>
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
                          <Eye size={18} className="text-zinc-600" />
                        ) : (
                          <EyeOff size={18} className="text-zinc-600" />
                        )}
                      </Button>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end">
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                size="lg"
                className="font-bold hover:bg-primary hover:opacity-90 transition-opacity text-lg xl:text-2xl"
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
            </div>
          </form>
        </Form>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = (async (context) => {
  const session = await getIronSession<SessionData>(
    context.req,
    context.res,
    sessionOptions
  );

  if (!session.isLoggedIn) {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  }

  return { props: { session } };
}) satisfies GetServerSideProps<{ session: SessionData }>;
