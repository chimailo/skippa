import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/spinner";
import Container from "@/components/container";
import BusinessVerificationForm1 from "@/components/onboarding/business/bvForm1";
import BusinessVerificationForm2, {
  SocMedia,
} from "@/components/onboarding/business/bvForm2";
import IndividualVerificationForm1 from "@/components/onboarding/individual/bvForm1";
import IndividualVerificationForm2 from "@/components/onboarding/individual/bvForm2";
import {
  BVFormSchema,
  bVinitialValues,
  IVFormSchema,
  iVInitialValues,
} from "@/components/onboarding/helpers";
import { splitCamelCaseText } from "@/lib/utils";
import $api from "@/lib/axios";
import { useMerchant } from "@/hooks/merchant";
import Layout from "@/components/layout";

type BVFormData = z.infer<typeof BVFormSchema>;
type IVFormData = z.infer<typeof IVFormSchema>;

const NUM_OF_FORM_PAGES = 2;

export default function Onboarding() {
  const [page, setPage] = useState(1);
  const [socialMedia, setSocialMedia] = useState<Record<string, SocMedia>>({});

  const router = useRouter();
  const session = useSession();
  const merchant = useMerchant({ user: session.data?.user || null });

  if (session.status === "unauthenticated") {
    router.push("/login");
  }

  const isLoading = session.status === "loading";
  const isBusiness = session.data?.user.type === "business";
  const isIndividual = session.data?.user.type === "individual";

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

  const form = isIndividual ? ivForm : bvForm;

  const { toast } = useToast();

  async function handleBVSubmit(formData: BVFormData) {
    try {
      const data = {
        ...formData,
        socialMedia: Object.assign(
          {},
          ...Object.values(socialMedia).map(({ name, handle }) => ({
            [name]: handle,
          }))
        ),
      };
      const { deliveryCategory: category, ...rest } = data;

      const deliveryCategory = {
        bike: category.includes("motorcycle"),
        car: category.includes("car"),
        van: category.includes("van"),
        truck: category.includes("truck"),
      };

      const directorDetail = {
        ...formData.directorDetail,
        dateOfBirth: new Date(
          formData.directorDetail.dateOfBirth
        ).toISOString(),
      };

      const res = await $api({
        method: "post",
        url: "/merchants/business/account/verification",
        data: { ...rest, deliveryCategory, directorDetail },
      });

      form.reset();
      localStorage.removeItem("passport");
      merchant.update({ ...session.data?.user!, business: res.data.business });
      router.push("/onboarding/welcome");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: splitCamelCaseText(error.data?.name || "") || undefined,
        description:
          error.data.message ||
          error.message ||
          "There was a problem with your request, please try again",
      });
    }
  }

  async function handleIVSubmit(formData: IVFormData) {
    try {
      const { deliveryCategory, ...rest } = formData;

      const category = {
        bike: deliveryCategory.includes("motorcycle"),
        car: deliveryCategory.includes("car"),
        van: deliveryCategory.includes("van"),
        truck: deliveryCategory.includes("truck"),
      };

      const res = await $api({
        method: "post",
        url: "/merchants/individual/account/verification",
        data: { ...rest, deliveryCategory: category },
      });

      localStorage.removeItem("passport");
      localStorage.removeItem("vPapers");
      merchant.update({ ...session.data?.user!, business: res.data.business });
      router.push("/onboarding/welcome");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: splitCamelCaseText(error.data?.name) || undefined,
        description:
          error.data?.message ||
          error.message ||
          "There was a problem with your request, please try again",
      });
    }
  }

  return (
    <Layout>
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
                twSize="w-8 h-8"
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
    </Layout>
  );
}
