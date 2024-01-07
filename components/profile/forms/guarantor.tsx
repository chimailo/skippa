import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { splitCamelCaseText } from "@/lib/utils";
import $api from "@/lib/axios";
import { User } from "@/types";

type FormDataType = z.infer<typeof FormSchema>;

type Props = {
  data: any;
  token: string | null;
  user: User;
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

export default function GuarantorForm({ token, data, user }: Props) {
  const [isEditing, setEditing] = useState(false);
  console.log(data);

  const guarantor = data.business.guarantorDetails.length
    ? data.business.guarantorDetails[data.business.guarantorDetails.length - 1]
    : null;
  const form = useForm<FormDataType>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: guarantor?.firstName || "",
      lastName: guarantor?.lastName || "",
      email: guarantor?.email || "",
    },
  });
  const { toast } = useToast();

  async function handleSubmit(data: FormDataType) {
    try {
      const res = await $api({
        method: "post",
        headers: { Authorization: `Bearer ${token}` },
        url: "/merchants/individual/guarantor/new",
        data,
      });

      toast({
        variant: "primary",
        title: splitCamelCaseText(res.name) || undefined,
        description: res.message || "Your details was successfully updated",
      });

      setEditing(false);
    } catch (error: any) {
      form.reset();
      setEditing(false);
      toast({
        duration: 1000 * 5,
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
        {!["processing-activation", "rejected", "activated"].includes(
          user.status
        ) && (
          <div className="w-full flex justify-end gap-4">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  size="lg"
                  variant="destructive"
                  className="font-bold text-lg xl:text-2xl transition-opacity"
                  onClick={() => {
                    form.reset();
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
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
              </>
            ) : (
              <Button
                type="button"
                size="lg"
                className="font-bold text-lg hover:bg-primary hover:opacity-90 rounded-xl transition-opacity"
                onClick={() => setEditing(true)}
              >
                Request New Guarantor
              </Button>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
