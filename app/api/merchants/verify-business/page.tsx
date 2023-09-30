"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/components/ui/button";
import { Form } from "@/app/components/ui/form";
import { useToast } from "@/app/components/ui/use-toast";
import Spinner from "@/app/components/loading";
import Container from "@/app/components/container";
import BusinessVerificationForm1 from "./components/bvForm1";
import BusinessVerificationForm2 from "./components/bvForm2";

type FormDataType = z.infer<typeof FormSchema>;

const NUM_OF_FORM_PAGES = 2;
const initialValues = {
  billingEmail: "",
  tin: "",
  registrationNumber: "",
  socialMedia: {
    twitter: "",
    facebook: "",
    instagram: "",
  },
  deliveryCategory: [],
  bankAccountDetail: {
    bankName: "",
    accountNumber: "",
  },
  directorDetail: {
    idNumber: "",
    idType: "",
    image: "",
    firstName: "",
    lastName: "",
  },
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
};

const FormSchema = z.object({
  billingEmail: z
    .string()
    .nonempty({ message: "Billing Email is required" })
    .email({ message: "Invalid email" }),
  tin: z
    .string()
    .nonempty({ message: "Tax Identification Number is required" })
    .min(2, "Tax Identification Number must be at least 2 characters long")
    .max(
      64,
      "Tax Identification Number cannot be more than 64 characters long"
    ),
  registrationNumber: z
    .string()
    .nonempty({ message: "Registration Number is required" })
    .min(2, "Registration Number must be at least 2 characters long")
    .max(64, "Registration Number cannot be more than 64 characters"),
  deliveryCategory: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
  socialMedia: z.object({
    twitter: z
      .string()
      .url("Please enters a valid url")
      .refine((value) => value.includes("twitter")),
    facebook: z
      .string()
      .url("Please enters a valid url")
      .refine((value) => value.includes("facebook")),
    instagram: z
      .string()
      .url("Please enters a valid url")
      .refine((value) => value.includes("instagram")),
  }),
  bankAccountDetail: z.object({
    bankName: z.string(),
    accountNumber: z.string(),
  }),
  directorDetail: z.object({
    idNumber: z
      .string()
      .nonempty({ message: "The director's ID number is required" }),
    idType: z
      .string()
      .nonempty({ message: "The director's ID type is required" }),
    firstName: z
      .string()
      .nonempty({ message: "First Name is required" })
      .min(2, "First Name must be at least 2 characters long")
      .max(64, "First Name cannot be more than 64 characters"),
    lastName: z
      .string()
      .nonempty({ message: "Last Name is required" })
      .min(2, "Last Name must be at least 2 characters long")
      .max(64, "Last Name cannot be more than 64 characters"),
    image: z.string(),
  }),
  addressDetail: z.object({
    flatNumber: z.string(),
    buildingName: z.string(),
    landmark: z.string().nonempty({ message: "Landmark is required" }),
    buildingNumber: z
      .string()
      .nonempty({ message: "Building Number is required" }),
    street: z
      .string()
      .nonempty({ message: "Street is required" })
      .min(2, "Street must be at least 2 characters long")
      .max(64, "Street cannot be more than 64 characters"),
    subStreet: z.string(),
    country: z.string().nonempty({ message: "Country is required" }),
    state: z.string().nonempty({ message: "State is required" }),
    city: z.string().nonempty({ message: "LGA is required" }),
  }),
});

const verifyBusiness = async (formData: FormDataType) => {
  const res = await fetch(`/api/verify-business`, {
    method: "POST",
    body: JSON.stringify(formData),
  });
  const { data } = await res.json();

  return data;
};

export default function SignUpForm() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const form = useForm<FormDataType>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    values: initialValues,
  });
  const { toast } = useToast();
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callback=business-verification");
    },
  });

  async function onSubmit(formData: FormDataType) {
    try {
      const res = await verifyBusiness(formData);

      if (!res.success) {
        toast({
          variant: "destructive",
          title: res.name.split(/(?=[A-Z]+|[0-9]+)/).join(" ") || undefined,
          description:
            res.data[0].message ||
            "An error occured while verifying your account, please try again",
        });
        return;
      }

      form.reset();
      router.push("/");
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
      <div className="shadow-3xl rounded-lg py-6 px-5 sm:px-8 md:py-8 xl:px-12 my-6 md:my-9">
        <div className=" mb-6 md:mb-9">
          <h1 className="text-3xl text-primary font-bold">Business</h1>
          <h1 className="text-3xl text-primary font-bold">Verification</h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 md:space-y-8 md:px-8 lg:px-12"
          >
            {page === 1 ? (
              <BusinessVerificationForm1 form={form} />
            ) : (
              <BusinessVerificationForm2 form={form} />
            )}
            <div className="my-4 flex justify-between items-center flex-row-reverse">
              {page === NUM_OF_FORM_PAGES ? (
                <Button
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || form.formState.isValid
                  }
                  size="lg"
                  className="font-semibold text-lg xl:text-2xl hover:bg-primary hover:opacity-90 transition-opacity"
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
              ) : (
                <Button
                  type="button"
                  size="lg"
                  className="font-semibold text-lg hover:bg-primary hover:opacity-90 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  Next
                </Button>
              )}
              {page > 1 && (
                <Button
                  type="button"
                  size="lg"
                  className="font-semibold text-lg hover:bg-primary hover:opacity-90 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page - 1);
                  }}
                >
                  Previous
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </Container>
  );
}
