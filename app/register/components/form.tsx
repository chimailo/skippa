"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { useToast } from "@/app/components/ui/use-toast";
import Spinner from "@/app/components/loading";
import { splitCamelCaseText } from "@/app/utils";

export type FormDataType = z.infer<typeof FormSchema>;

const FormSchema = z
  .object({
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
    companyName: z
      .string()
      .min(2, "Business Name must be at least 2 characters long")
      .max(64, "Business Name cannot be more than 64 characters long")
      .nonempty({ message: "Business Name is required" }),
    email: z
      .string()
      .nonempty({ message: "Email is required" })
      .email({ message: "Invalid email" }),
    mobile: z
      .string()
      .length(11, "Phone number must be of length 11 digits")
      .nonempty({ message: "Phone number is required" }),
    country: z.string().nonempty({ message: "Country is required" }),
    state: z.string().nonempty({ message: "State is required" }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .nonempty({ message: "Password is required" })
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
        if (!/[!@#$%&*]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Password must contain at least a special character !@#$%&*",
          });
        }
      }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Confirm Password is required" }),
    terms: z.boolean().refine((val) => val, {
      message:
        "You must agree to the terms and conditions to create an account",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password do not match",
    path: ["confirmPassword"],
  });

const createMerchant = async (
  formData: Omit<FormDataType, "terms"> & { type: string | null }
) => {
  const res = await fetch(`/api/merchants/create`, {
    method: "POST",
    body: JSON.stringify(formData),
  });
  const { data } = await res.json();

  return data;
};

export default function SignUpForm() {
  const router = useRouter();
  const search = useSearchParams();
  const form = useForm<FormDataType>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    values: {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      mobile: "",
      country: "Nigeria",
      state: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });
  const { toast } = useToast();
  const type = search.get("type");

  if (!type) {
    router.push("/");
    return;
  }

  async function onSubmit(formData: FormDataType) {
    try {
      const { terms, ...rest } = formData;
      const res = await createMerchant({ ...rest, type });

      if (!res.success) {
        toast({
          variant: "destructive",
          title: splitCamelCaseText(res.name) || undefined,
          description:
            res.data[0].message ||
            "An error occured while creating you account, please try again",
        });
        return;
      }

      form.reset();
      router.push(
        `/register/verify-account?token=${res.data.accountCreationToken}&email=${formData.email}`
      );
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
          <div className="">
            <h1 className="text-2xl mb-3 font-bold">Create An Account</h1>
            <p className="font-bold text-sm">Business Owner</p>
          </div>
          <div className="block sm:flex md:block lg:flex items-start gap-3 space-y-6 sm:space-y-0 md:space-y-8 lg:space-y-0">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="">First Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="">Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Business Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Company Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Phone Number</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="block sm:flex md:block lg:flex items-center gap-3 space-y-6 sm:space-y-0 md:space-y-8 lg:space-y-0">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="">Country</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="">State</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="">Password</FormLabel>
                <FormControl className="flex items-center gap-3">
                  <Input type="password" {...field} />
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
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-bold">
                    I agree to the terms & conditions
                  </FormLabel>
                  <FormDescription className="font-medium text-xs">
                    is simply dummy text of the printing and typesetting
                    industry. Lorem Ipsum has been the industry&apos;s standard
                    dummy text ever since the 1500s, when an unknown printer
                    took a galley of type and scrambled it to make a type
                    specimen book. It has survived not only five centuries, but
                    also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <div className="space-y-4">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              size="lg"
              className="w-full font-bold text-lg xl:text-2xl hover:bg-primary hover:opacity-90 transition-opacity"
            >
              Submit
              {form.formState.isSubmitted && (
                <Spinner
                  twColor="text-white before:bg-white"
                  twSize="w-4 h-4"
                  className="ml-3"
                />
              )}
            </Button>
            <p className="text-sm text-center font-medium">
              Already have an account?
              <Link
                href="/login"
                className="text-primary text-medium hover:underline ml-2"
              >
                Log In
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
