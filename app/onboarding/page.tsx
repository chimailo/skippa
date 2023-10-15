"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/app/components/ui/button";
import { Form } from "@/app/components/ui/form";
import { useToast } from "@/app/components/ui/use-toast";
import Spinner from "@/app/components/loading";
import Container from "@/app/components/container";
import BusinessVerificationForm1 from "@/app/onboarding/components/business/bvForm1";
import BusinessVerificationForm2 from "@/app/onboarding/components/business/bvForm2";
import IndividualVerificationForm1 from "@/app/onboarding/components/individual/bvForm1";
import IndividualVerificationForm2 from "@/app/onboarding/components/individual/bvForm2";
import { splitCamelCaseText } from "@/app/utils";
import {
  BVFormSchema,
  bVinitialValues,
  IVFormSchema,
  iVInitialValues,
} from "./helpers";

type BVFormData = z.infer<typeof BVFormSchema>;
type IVFormData = z.infer<typeof IVFormSchema>;

export interface SocMedia {
  name: "twitter" | "facebook" | "instagram";
  handle: string;
}

const NUM_OF_FORM_PAGES = 2;

const verifyBusiness = async (formData: BVFormData) => {
  const { deliveryCategory, ...rest } = formData;

  const category = {
    bike: deliveryCategory.includes("motorcycle"),
    car: deliveryCategory.includes("car"),
    van: deliveryCategory.includes("van"),
    truck: deliveryCategory.includes("truck"),
  };

  const directorDetail = {
    ...formData.directorDetail,
    dob: new Date(formData.directorDetail.dob).toISOString(),
  };
  console.log({ ...rest, category, directorDetail });

  const res = await fetch(`/api/merchants/onboarding/business`, {
    method: "POST",
    body: JSON.stringify({ ...rest, category, directorDetail }),
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const { data } = await res.json();

  return data;
};

const verifyIBusiness = async (formData: IVFormData) => {
  const { deliveryCategory, ...rest } = formData;

  const category = {
    bike: deliveryCategory.includes("motorcycle"),
    car: deliveryCategory.includes("car"),
    van: deliveryCategory.includes("van"),
    truck: deliveryCategory.includes("truck"),
  };
  console.log({ ...rest, category });

  const res = await fetch(`/api/merchants/onboarding/individual`, {
    method: "POST",
    body: JSON.stringify({ ...rest, category }),
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const { data } = await res.json();

  return data;
};

export default function VerifyBusinessForm() {
  const [page, setPage] = useState(1);
  const [socialMedia, setSocialMedia] = useState<Record<string, SocMedia>>({});
  const [papersUrl, setPapersUrl] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");

  const router = useRouter();
  const session = useSession();

  if (session.status === "unauthenticated") {
    router.push("/login?callback=/onboarding");
  }

  const isLoading = session.status === "loading";
  const isBusiness = session.data?.user?.role.businessType === "business";
  const isIndividual = session.data?.user?.role.businessType === "individual";

  const bvForm = useForm<BVFormData>({
    resolver: zodResolver(BVFormSchema),
    defaultValues: bVinitialValues,
    mode: "onBlur",
  });
  const ivForm = useForm<IVFormData>({
    resolver: zodResolver(IVFormSchema),
    defaultValues: iVInitialValues,
    mode: "onBlur",
  });

  const form = isBusiness ? bvForm : ivForm;

  const { toast } = useToast();

  async function handleBVSubmit(formData: BVFormData) {
    try {
      const data = {
        ...formData,
        directorDetail: { ...formData.directorDetail, imageUrl },
        socialMedia: Object.assign(
          {},
          ...Object.values(socialMedia).map(({ name, handle }) => ({
            [name]: handle,
          }))
        ),
      };

      const res = await verifyBusiness(data);

      // if (!res.success) {
      //   toast({
      //     variant: "destructive",
      //     title: splitCamelCaseText(res.name) || undefined,
      //     description:
      //       res.data[0].message ||
      //       "There was a problem with your request, please try again",
      //   });
      //   return;
      // }

      // form.reset();
      // router.push("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ooops..., an error has occured",
      });
    }
  }

  async function handleIVSubmit(formData: IVFormData) {
    try {
      const data = {
        ...formData,
        vehiclePapers: papersUrl,
        passport: imageUrl,
      };

      const res = await verifyIBusiness(data);

      // if (!res.success) {
      //   toast({
      //     variant: "destructive",
      //     title: splitCamelCaseText(res.name) || undefined,
      //     description:
      //       res.data[0].message ||
      //       "There was a problem with your request, please try again",
      //   });
      //   return;
      // }

      // form.reset();
      // router.push("/dashboard");
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
          <h1 className="text-3xl text-primary font-bold">Business</h1>
          <h1 className="text-3xl text-primary font-bold">Verification</h1>
        </div>
        {isLoading && (
          <div className="w-full py-12 md:py-24 flex items-center justify-center">
            <Spinner
              twColor="text-primary before:bg-primary"
              twSize="w-12 h-12"
            />
          </div>
        )}
        {isBusiness && (
          <Form {...bvForm}>
            <form
              onSubmit={bvForm.handleSubmit(handleBVSubmit)}
              className="space-y-6 md:space-y-8 md:px-8 lg:px-12"
            >
              {page === 1 ? (
                <BusinessVerificationForm1 form={bvForm} />
              ) : (
                <BusinessVerificationForm2
                  form={bvForm}
                  setSocMedia={setSocialMedia}
                  socMedia={socialMedia}
                />
              )}
              <div className="my-4 flex justify-between items-center flex-row-reverse">
                {page === NUM_OF_FORM_PAGES ? (
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
        )}
        {isIndividual && (
          <Form {...ivForm}>
            <form
              onSubmit={ivForm.handleSubmit(handleIVSubmit)}
              className="space-y-6 md:space-y-8 md:px-8 lg:px-12"
            >
              {page === 1 ? (
                <IndividualVerificationForm1 form={ivForm} />
              ) : (
                <IndividualVerificationForm2 form={ivForm} />
              )}
              <div className="my-4 flex justify-between items-center flex-row-reverse">
                {page === NUM_OF_FORM_PAGES ? (
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
        )}
      </div>
    </Container>
  );
}