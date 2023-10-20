"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Session } from "next-auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Button } from "@/app/components/ui/button";
import { splitCamelCaseText } from "@/app/utils";

type FormDataType = z.infer<typeof FormSchema>;

const FormSchema = z.object({
  firstName: z
    .string()
    .nonempty({ message: "First Name is required" })
    .min(2, "First Name must be at least 2 characters long")
    .max(64, "First Name cannot be more than 64 characters long"),
  lastName: z
    .string()
    .nonempty({ message: "Last Name is required" })
    .min(2, "Last Name must be at least 2 characters long")
    .max(64, "Last Name cannot be more than 64 characters long"),
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email" }),
  mobile: z
    .string()
    .nonempty({ message: "Phone number is required" })
    .length(11, "Phone number must be of length 11 digits"),
});

const updateUser = async (formData: FormDataType, token: string) => {
  const res = await fetch(`/api/profile`, {
    method: "PUT",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const { data } = await res.json();

  return data;
};

export default function UserForm({
  user,
}: {
  user: Session["user"] & { token: string };
}) {
  const [isEditing, setEditing] = useState(false);
  const form = useForm<FormDataType>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: user.name?.split(" ")[0],
      lastName: user.name?.split(" ")[1],
      email: user.email as string,
      mobile: user.phone,
    },
  });
  const { toast } = useToast();

  async function handleSubmit(data: FormDataType) {
    try {
      const res = await updateUser(data, user.token);

      if (!res?.success) {
        toast({
          variant: "destructive",
          title: splitCamelCaseText(res?.name) || undefined,
          description:
            res.message ||
            "There was a problem with your request, please try again",
        });
        return;
      }

      toast({
        variant: "primary",
        title: splitCamelCaseText(res?.name) || undefined,
        description: res.message || "Your details was successfully updated",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ooops..., an error has occured",
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
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem className="w-full col-span-1">
                <FormLabel className="">Phone Number</FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={!isEditing} />
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
              className="font-bold text-lg xl:text-2xl hover:bg-primary hover:opacity-90 transition-opacity"
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
              className="font-bold text-lg xl:text-2xl hover:bg-primary hover:opacity-90 transition-opacity"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
