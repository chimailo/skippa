import { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/spinner";
import Container from "@/components/container";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { splitCamelCaseText } from "@/lib/utils";
import $api from "@/lib/axios";
import Layout from "@/components/layout";

type FormData = z.infer<typeof FormSchema>;

const FormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First Name is required")
    .max(64, "First Name cannot be more than 64 characters"),
  lastName: z
    .string()
    .min(1, "Last Name is required")
    .max(64, "Last Name cannot be more than 64 characters"),
  idNumber: z.string().min(1, "The director's ID number is required"),
  idType: z.string().min(1, "The director's ID type is required"),
  employmentStatus: z.string().min(1, "Employment status is required"),
  employer: z.string().optional(),
  mobile: z
    .string()
    .min(1, "Phone number is required")
    .length(11, "Phone number must be of length 11 digits"),
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email" }),
  addressDetail: z.object({
    flatNumber: z.string().optional(),
    buildingName: z.string().optional(),
    landmark: z.string().min(1, "Landmark is required"),
    buildingNumber: z.string().min(1, "Building Number is required"),
    street: z
      .string()
      .min(1, "Street is required")
      .min(2, "Street must be at least 2 characters long")
      .max(64, "Street cannot be more than 64 characters"),
    subStreet: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
  }),
});

export default function Guarantor() {
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      idNumber: "",
      idType: "",
      mobile: "",
      email: "",
      employer: "",
      employmentStatus: "",
      addressDetail: {
        flatNumber: "",
        landmark: "",
        buildingNumber: "",
        buildingName: "",
        street: "",
        subStreet: "",
        country: "Nigeria",
        state: "",
        city: "",
      },
    },
    mode: "onBlur",
  });
  const { toast } = useToast();

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

  async function handleSubmit(formData: FormData) {
    const id = searchParams.get("merchantId");
    const token = searchParams.get("token");

    if (!(id || token)) {
      toast({
        duration: 1000 * 4,
        variant: "destructive",
        title: "Invalid Link",
        description:
          "This is not a valid link, please confirm it and try again ",
      });
      return;
    }

    try {
      await $api({
        method: "post",
        url: `/merchants/individual/${id}/guarantor/${token}/verification`,
        data: formData,
      });

      form.reset();
      router.push("/onboarding/guarantor/welcome");
    } catch (error: any) {
      toast({
        duration: 1000 * 4,
        variant: "destructive",
        title: splitCamelCaseText(error.data?.name) || undefined,
        description:
          error.data?.message ||
          error.message ||
          error.data[0]?.message ||
          "There was a problem with your request, please try again",
      });
    }
  }

  return (
    <Layout>
      <Container compact>
        <div className="shadow-3xl rounded-lg py-6 px-5 sm:px-8 md:py-8 xl:px-12 my-6 md:my-9 min-h-[calc(100vh_-_8rem)]">
          <div className=" mb-6 md:mb-9">
            <h1 className="text-3xl text-primary font-bold">Guarantor</h1>
            <h1 className="text-3xl text-primary font-bold">Form</h1>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 md:space-y-8 md:px-8 lg:px-12"
            >
              <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-8 sm:space-y-0">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-0">
                      <FormLabel className="after:text-red-600 after:ml-1 after:content-['*'] after:text-xl after:leading-none flex-1">
                        First Name
                      </FormLabel>
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
                    <FormItem className="w-full space-y-0">
                      <FormLabel className="after:text-red-600 after:ml-1 after:content-['*'] after:text-xl after:leading-none flex-1">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-6 sm:space-y-0">
                <FormField
                  control={form.control}
                  name="idType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        ID Type
                        <span className="text-red-600 text-xl leading-none">
                          *
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bvn">
                            Bank Verification Number
                          </SelectItem>
                          <SelectItem value="passport">
                            International Passport
                          </SelectItem>
                          <SelectItem value="drivers_license">
                            Driver&apos;s License
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">
                        ID Number
                        <span className="text-red-600 text-xl leading-none">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-6 sm:space-y-0">
                <FormField
                  control={form.control}
                  name="employmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Employment Status
                        <span className="text-red-600 text-xl leading-none">
                          *
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="self-employed">
                            Self-Employed
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employer"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">
                        Employer (Ignore if self-employed)
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-6 sm:space-y-0">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="after:text-red-600 after:ml-1 after:content-['*'] after:text-xl after:leading-none flex-1">
                        Phone Number
                      </FormLabel>
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
                      <FormLabel className="after:text-red-600 after:ml-1 after:content-['*'] after:text-xl after:leading-none flex-1">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input type="email" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <h2 className="font-semibold text-sm">Address Details</h2>
              <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-8 sm:space-y-0">
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="addressDetail.flatNumber"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="">Flat Number</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressDetail.buildingName"
                    render={({ field }) => (
                      <FormItem className="w-full col-span-2">
                        <FormLabel className="">Building Name</FormLabel>
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
                  name="addressDetail.landmark"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="">
                        Landmark
                        <span className="text-red-600 text-xl leading-none">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-8 sm:space-y-0">
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="addressDetail.buildingNumber"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="">
                          Building No.
                          <span className="text-red-600 text-xl leading-none">
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressDetail.street"
                    render={({ field }) => (
                      <FormItem className="w-full col-span-2">
                        <FormLabel className="">
                          Street
                          <span className="text-red-600 text-xl leading-none">
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="block sm:grid grid-cols-2 gap-2 space-y-6 sm:space-y-0">
                  <FormField
                    control={form.control}
                    name="addressDetail.subStreet"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="">Substreet</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressDetail.city"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="">
                          City
                          <span className="text-red-600 text-xl leading-none">
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="block sm:grid sm:grid-cols-2 gap-3 space-y-8 sm:space-y-0">
                <FormField
                  control={form.control}
                  name="addressDetail.state"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        State
                        <span className="text-red-600 text-xl leading-none">
                          *
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                <FormField
                  control={form.control}
                  name="addressDetail.country"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Country
                        <span className="text-red-600 text-xl leading-none">
                          *
                        </span>
                      </FormLabel>
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
              </div>
              <div className="my-4 flex justify-between items-center flex-row-reverse">
                <Button
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
                  size="lg"
                  className="font-semibold text-lg xl:text-2xl hover:bg-primary hover:opacity-90 transition-opacity"
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
        </div>
      </Container>
    </Layout>
  );
}
