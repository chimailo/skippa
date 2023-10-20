"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, MoveLeft } from "lucide-react";
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
import Link from "next/link";
import Container from "@/app/components/container";
import { useSession } from "next-auth/react";

type FormType = z.infer<typeof FormSchema>;

const FormSchema = z
  .object({
    currentPassword: z
      .string()
      .nonempty({ message: "You must enter your current password" }),
    newPassword: z
      .string()
      .nonempty({ message: "New password is required" })
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
    confirmPassword: z
      .string()
      .nonempty({ message: "Confirm Password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password and Confirm Password do not match",
    path: ["confirmPassword"],
  });

const changePassword = async (formData: FormType, token: string) => {
  const res = await fetch(`/api/profile/change-password`, {
    method: "PUT",
    body: JSON.stringify({ ...formData, token }),
  });
  const { data } = await res.json();

  return data;
};

export default function ForgotPasswordForm() {
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
  const session = useSession({ required: true });

  async function onSubmit(data: FormType) {
    try {
      const res = await changePassword(data, session.data?.token!);

      if (!res?.success) {
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
      toast({
        variant: "primary",
        title: splitCamelCaseText(res?.name) || undefined,
        description: res.message || "Your password was successfully updated",
      });
      router.push("/profile");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ooops..., an error has occured",
      });
    }
  }

  return (
    <Container>
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
              disabled={!form.formState.isValid || form.formState.isSubmitting}
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
  );
}
