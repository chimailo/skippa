"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Session } from "next-auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Button } from "@/components/ui/button";
import { GuarantorFormSchema } from "@/components/onboarding/helpers";
import { splitCamelCaseText } from "@/lib/utils";
import $api from "@/lib/axios";

type FormDataType = z.infer<typeof FormSchema>;

type Props = {
  user: Session["user"] & { token: string };
};

const FormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First Name is required")
    .max(64, "First Name cannot be more than 64 characters long"),
  lastName: z
    .string()
    .min(2, "Last Name is required")
    .max(64, "Last Name cannot be more than 64 characters long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email" }),
});

export default function GuarantorForm({ user }: Props) {
  const [isEditing, setEditing] = useState(false);
  const form = useForm<FormDataType>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: user.guarantor?.firstName || "",
      lastName: user.guarantor?.lastName || "",
      email: user.guarantor?.email || "",
    },
  });
  const { toast } = useToast();

  async function handleSubmit(data: FormDataType) {
    try {
      const res = await $api({
        method: "post",
        headers: { Authorization: `Bearer ${user.token}` },
        url: "/merchants/individual/guarantor/new",
        data,
      });

      toast({
        variant: "primary",
        title: splitCamelCaseText(res.data.name) || undefined,
        description:
          res.data.message || "Your details was successfully updated",
      });

      form.reset();
    } catch (error: any) {
      toast({
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full col-span-1">
                <FormLabel className="">First Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full col-span-1">
                <FormLabel className="">Last Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full col-span-1">
                <FormLabel className="">Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full flex justify-end">
          {isEditing ? (
            <Button
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              size="lg"
              className="font-bold text-lg xl:text-2xl hover:bg-primary hover:opacity-90 rounded-xl transition-opacity"
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
          ) : (
            <Button
              type="button"
              size="lg"
              className="font-bold sm:text-lg xl:text-2xl hover:bg-primary hover:opacity-90 rounded-xl transition-opacity"
              onClick={() => setEditing(true)}
            >
              Request New Guarantor
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
