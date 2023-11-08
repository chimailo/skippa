"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/app/components/ui/button";
import { Form } from "@/app/components/ui/form";
import { useToast } from "@/app/components/ui/use-toast";
import Spinner from "@/app/components/loading";
import Container from "@/app/components/container";
import Header from "@/app/components/header";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { splitCamelCaseText } from "@/app/utils";

type FormData = z.infer<typeof FormSchema>;

const FormSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First Name is required" })
    .min(2, "First Name must be at least 2 characters long")
    .max(64, "First Name cannot be more than 64 characters"),
  lastName: z
    .string()
    .min(1, { message: "Last Name is required" })
    .min(2, "Last Name must be at least 2 characters long")
    .max(64, "Last Name cannot be more than 64 characters"),
  idNumber: z
    .string()
    .min(1, { message: "The director's ID number is required" }),
  idType: z.string().min(1, { message: "The director's ID type is required" }),
  employmentStatus: z
    .string()
    .min(1, { message: "Employment status is required" }),
  employer: z.string().optional(),
  mobile: z
    .string()
    .min(1, { message: "Phone number is required" })
    .length(11, "Phone number must be of length 11 digits"),
  addressDetail: z.object({
    flatNumber: z.string().optional(),
    buildingName: z.string().optional(),
    landmark: z.string().min(1, { message: "Landmark is required" }),
    buildingNumber: z
      .string()
      .min(1, { message: "Building Number is required" }),
    street: z
      .string()
      .min(1, { message: "Street is required" })
      .min(2, "Street must be at least 2 characters long")
      .max(64, "Street cannot be more than 64 characters"),
    subStreet: z.string().optional(),
    country: z.string().min(1, { message: "Country is required" }),
    state: z.string().min(1, { message: "State is required" }),
    city: z.string().min(1, { message: "City is required" }),
  }),
});

const verifyGuarantor = async (
  formData: FormData,
  id: string,
  token: string
) => {
  const res = await fetch(`/api/merchants/onboarding/individual/guarantor`, {
    method: "POST",
    body: JSON.stringify({ id, formData, token }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { data } = await res.json();

  return data;
};

export default function VerifyBusinessForm() {
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
      employer: "Nigeria",
      employmentStatus: "",
      addressDetail: {
        flatNumber: "",
        landmark: "",
        buildingNumber: "",
        buildingName: "",
        street: "",
        subStreet: "",
        country: "",
        state: "",
        city: "",
      },
    },
    mode: "onBlur",
  });
  const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    if (!(id || token)) {
      toast({
        variant: "destructive",
        title: "Invalid Link",
        description: "This link is incorrect, pls confirm it and try again ",
      });
      return;
    }

    try {
      const res = await verifyGuarantor(formData, id!, token!);

      if (!res.success) {
        toast({
          variant: "destructive",
          title: splitCamelCaseText(res.name) || undefined,
          description:
            res.data[0].message ||
            "There was a problem with your request, please try again",
        });
        return;
      }

      form.reset();
      router.push("/onboarding/guarantor/welcome");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ooops..., an error has occured",
      });
    }
  }

  return (
    <Container compact>
      <div className="shadow-3xl rounded-lg py-6 px-5 sm:px-8 md:py-8 xl:px-12 my-6 md:my-9 min-h-[calc(100vh_-_8rem)]">
        <div className=" mb-6 md:mb-9">
          <h1 className="text-3xl text-primary font-bold">Guarantor</h1>
          <h1 className="text-3xl text-primary font-bold">Verification</h1>
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
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
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
                    <FormLabel className="">
                      State
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
                name="addressDetail.country"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="">
                      Country
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
  );
}
