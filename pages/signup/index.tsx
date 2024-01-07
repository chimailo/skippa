import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Container from "@/components/container";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Footer from "@/components/footer";
import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import WhySkippa from "@/components/whyskippa";
import { splitCamelCaseText } from "@/lib/utils";
import $api from "@/lib/axios";

export type BFormData = z.infer<typeof BFormSchema>;
export type IFormData = z.infer<typeof IFormSchema>;

const BFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First Name must be at least 2 characters long")
      .max(64, "First Name cannot be more than 64 characters long")
      .refine((val) => val.trim().length, {
        message: "First name is required",
      }),
    lastName: z
      .string()
      .min(2, "Last Name must be at least 2 characters long")
      .max(64, "Last Name cannot be more than 64 characters long")
      .refine((val) => val.trim().length, {
        message: "Last name is required",
      }),
    companyName: z
      .string()
      .min(2, "Business Name is required must be at least 2 characters long")
      .max(64, "Business Name cannot be more than 64 characters long")
      .refine((val) => val.trim().length, {
        message: "Company name is required",
      }),
    email: z
      .string()
      .min(1, "Email is required")
      .email({ message: "Invalid email" })
      .refine((val) => val.trim().length, {
        message: "Email is required",
      }),
    mobile: z
      .string()
      .min(1, "Phone number is required")
      .length(11, "Phone number must be of length 11 digits")
      .refine((val) => val.trim().length, {
        message: "Phone number is required",
      }),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
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
        if (!/[!@#$%&*]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Password must contain at least a special character !@#$%&*",
          });
        }
      }),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    terms: z.boolean().refine((val) => val, {
      message:
        "You must agree to the terms and conditions to create an account",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password do not match",
    path: ["confirmPassword"],
  });

const IFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First Name must be at least 2 characters long")
      .max(64, "First Name cannot be more than 64 characters long")
      .refine((val) => val.trim().length, {
        message: "First name is required",
      }),
    lastName: z
      .string()
      .min(2, "Last Name must be at least 2 characters long")
      .max(64, "Last Name cannot be more than 64 characters long")
      .refine((val) => val.trim().length, {
        message: "Last name is required",
      }),
    email: z
      .string()
      .min(1, "Email is required")
      .email({ message: "Invalid email" }),
    mobile: z
      .string()
      .min(1, "Phone number is required")
      .length(11, "Phone number must be of length 11 digits")
      .refine((val) => val.trim().length, {
        message: "Phone number is required",
      }),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
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
        if (!/[!@#$%&*]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Password must contain at least a special character !@#$%&*",
          });
        }
      }),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    terms: z.boolean().refine((val) => val, {
      message:
        "You must agree to the terms and conditions to create an account",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password do not match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const router = useRouter();
  const search = useSearchParams();
  const type = search.get("type");

  useEffect(() => {
    if (!type) {
      router.push("/");
    }
  }, []);

  const { data } = useSWR(`/options/countries`, () =>
    $api({ url: `/options/countries` })
  );

  useEffect(() => {
    if (data) {
      const countries = data.data;
      const states = data.data[0].states;

      setCountries(countries);
      setStates(states);
    }
  }, [data]);

  const form = useForm<BFormData | IFormData>({
    resolver: zodResolver(type === "business" ? BFormSchema : IFormSchema),
    mode: "onBlur",
    defaultValues: {
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

  const saveToCookie = (name: string, payload: string) => {
    const encodePayload = btoa(payload);
    document.cookie = `${name}=${encodePayload}; max-age=3600;`;
  };

  async function onSubmit(formData: BFormData | IFormData) {
    try {
      const { terms, ...rest } = formData;
      const res = await $api({
        url: `/merchants/${type}/account/create`,
        method: "post",
        data: rest,
      });

      // Create cookie with the user login credentials to use to log
      // them in when they verify their account
      saveToCookie("password", formData.password);
      form.reset();
      const token = res.data.accountCreationToken;
      router.push(
        `/signup/verify-account?token=${token}&email=${formData.email}`
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        duration: 1000 * 60,
        title: splitCamelCaseText(error.name) || undefined,
        description:
          (error.name === "validationError"
            ? error.data[0]?.message
            : error.data.message) ||
          "An error occured while creating your account, please try again",
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
          <div className="md:my-40 sm:w-4/5 md:w-full xl:w-4/5">
            <h1 className="text-3xl mb-4 md:mb-6 font-bold">
              Join the
              <span className="text-primary mx-2">Skippa</span>Evolution!
            </h1>
            <p className="text-sm">
              Ready to experience the future of logistics with Skippa? Sign up
              now to get started. It only takes a few minutes to create your
              account and access our powerful logistics platform.
            </p>
          </div>
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
                {type === "business" && (
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
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=""></FormLabel>
                      {type === "business" ? "Company Email" : "Email"}
                      <FormControl>
                        <Input type="email" {...field} required />
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
                        <FormLabel>Country</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-80">
                            {countries.map((country: any) => (
                              <SelectItem
                                key={country.alpha2Code}
                                value={country.name}
                              >
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-80">
                            {states.map((state: any) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                            type="button"
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
                          industry. Lorem Ipsum has been the industry&apos;s
                          standard dummy text ever since the 1500s, when an
                          unknown printer took a galley of type and scrambled it
                          to make a type specimen book. It has survived not only
                          five centuries, but also the leap into electronic
                          typesetting, remaining essentially unchanged. It was
                          popularised in the 1960s with the release of Letraset
                          sheets containing Lorem
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <Button
                    disabled={
                      form.formState.isSubmitting || !form.formState.isValid
                    }
                    size="lg"
                    className="w-full font-bold text-lg xl:text-2xl hover:bg-primary hover:opacity-90 transition-opacity gap-3"
                  >
                    Submit
                    {form.formState.isSubmitting && (
                      <Spinner twSize="w-4 h-4" />
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
        </Container>
        <WhySkippa />
      </main>
      <Footer />
    </Layout>
  );
}
function useSWRImmutable(
  arg0: string,
  arg1: () => any
): { data: any; error: any; isLoading: any } {
  throw new Error("Function not implemented.");
}
