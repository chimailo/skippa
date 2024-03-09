import { useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { getIronSession } from "iron-session";
import useSWR from "swr";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import Layout from "@/components/layout";
import UserSection from "@/components/partners/manage/about";
import UserForm from "@/components/partners/manage/user";
import BusinessForm from "@/components/partners/manage/business";
import IndividualForm from "@/components/partners/manage/individual";
import GuarantorForm from "@/components/partners/manage/guarantor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import PartnerSkeleton from "@/components/loading/partners";
import FetchError from "@/components/error";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import Spinner from "@/components/spinner";
import $api from "@/lib/axios";
import { sessionOptions } from "@/lib/session";
import { SessionData } from "@/types";
import { splitCamelCaseText } from "@/lib/utils";
import useSession from "@/hooks/session";
import useUser from "@/hooks/user";

const RejectFormSchema = z.object({
  reasonsForDecline: z.string().min(4, {
    message: "The reason for rejection must be at least 10 characters.",
  }),
});

const SuspendFormSchema = z.object({
  reasonsForSuspension: z.string().min(4, {
    message: "The reason for suspension must be at least 10 characters.",
  }),
});

export default function ManagePartners({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // const [merchant, setMerchant] = useState();
  const [loading, setLoading] = useState(false);

  const { signOut } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const search = useSearchParams();

  const id = router.query.id;
  const {
    data: merchant,
    error,
    isLoading,
    mutate,
  } = useSWR(
    `/merchants/${id}/manage-partners`,
    () => $api({ token: session?.token, url: `/merchants/${id}` }),
    {
      onError(err) {
        if (err.data.name === "UnauthorizedError") {
          signOut();
          toast({
            duration: 1000 * 4,
            variant: "destructive",
            title: splitCamelCaseText(error.data.name) || undefined,
            description: error.data.message || "Your session has expired",
          });
          router.push(`/login?callbackUrl=/partners/${id}/manage-partners`);
          return;
        }
      },
    }
  );

  useUser();

  const declineForm = useForm<z.infer<typeof RejectFormSchema>>({
    resolver: zodResolver(RejectFormSchema),
  });

  const suspendForm = useForm<z.infer<typeof SuspendFormSchema>>({
    resolver: zodResolver(SuspendFormSchema),
  });

  const handleRejectSubmit = async (form: z.infer<typeof RejectFormSchema>) => {
    try {
      const res = await $api({
        method: "post",
        url: `/admins/merchants/${merchant.data.id}/decline-activation`,
        data: { reasonsForDecline: form.reasonsForDecline },
        token: session?.token,
      });

      toast({
        variant: "primary",
        title: splitCamelCaseText(res.data.name) || undefined,
        description:
          res.data.message ||
          `Account verification request successfully declined`,
      });
      mutate(
        { data: { ...merchant.data, status: "rejected" } },
        { revalidate: true }
      );
      declineForm.reset();
    } catch (error: any) {
      toast({
        duration: 1000 * 4,
        variant: "destructive",
        title: splitCamelCaseText(error.data.name) || undefined,
        description:
          error.data.message ||
          `Failed to decline account verification request`,
      });
    }
  };

  const activateAccount = async () => {
    try {
      setLoading(true);
      const res = await $api({
        method: "post",
        url: `/admins/merchants/${merchant.data.id}/activate`,
        token: session?.token,
      });

      mutate(
        { data: { ...merchant.data, status: "activated" } },
        { revalidate: true }
      );
      toast({
        variant: "primary",
        title: splitCamelCaseText(res.name) || undefined,
        description: res.message || `Account successfully activated`,
      });
    } catch (error: any) {
      toast({
        duration: 1000 * 4,
        variant: "destructive",
        title: splitCamelCaseText(error.name) || undefined,
        description:
          error.message || error.data.message || `Failed to activate account`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendSubmit = async (
    form: z.infer<typeof SuspendFormSchema>
  ) => {
    try {
      const res = await $api({
        method: "post",
        url: `/admins/merchants/${merchant.data.id}/suspend`,
        data: { reasonsForSuspension: form.reasonsForSuspension },
        token: session?.token,
      });

      mutate(
        { data: { ...merchant.data, status: "suspended" } },
        { revalidate: true }
      );
      toast({
        variant: "primary",
        title: splitCamelCaseText(res.data.name) || undefined,
        description:
          res.data.message ||
          res.message ||
          `Account verification request successfully declined`,
      });
      suspendForm.reset();
    } catch (error: any) {
      toast({
        duration: 1000 * 4,
        variant: "destructive",
        title: splitCamelCaseText(error.data.name) || undefined,
        description:
          error.data.message ||
          error.message ||
          `Failed to decline account verification request`,
      });
    }
  };

  const handleUnsuspendSubmit = async () => {
    try {
      setLoading(true);
      const res = await $api({
        method: "post",
        url: `/admins/merchants/${merchant.data.id}/unsuspend`,
        token: session.token,
      });

      mutate(
        { data: { ...merchant.data, status: "activated" } },
        { revalidate: true }
      );
      toast({
        variant: "primary",
        title: splitCamelCaseText(res.data.name) || undefined,
        description: res.message || `Merchant account successfully unsuspended`,
      });
      suspendForm.reset;
    } catch (error: any) {
      toast({
        duration: 1000 * 4,
        variant: "destructive",
        title: splitCamelCaseText(error.data.name) || undefined,
        description:
          error?.data?.message ||
          error?.message ||
          `Failed to unsuspend this merchant`,
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (search.get("tab") === "business") {
      return "Business Information";
    } else if (search.get("tab") === "individual") {
      return "Individual Information";
    } else if (search.get("tab") === "guarantor") {
      return "Guarantor Information";
    } else {
      return "User Information";
    }
  };

  return (
    <Layout
      auth
      user={session.user}
      sidebar={{
        active: "partners",
        activeChild: "manage partner",
        name: merchant?.data.companyName || "",
      }}
      title="Manage Partners"
    >
      {isLoading ? (
        <PartnerSkeleton />
      ) : error ? (
        <FetchError message={error.message} />
      ) : (
        <div className="block sm:flex space-y-4 sm:space-y-0 px-5 py-7 ">
          {merchant && (
            <>
              <UserSection merchant={merchant.data} />
              <div className="border-l-2 hidden md:block min-h-[calc(100vh_-_12rem)] border-zinc-300"></div>
              <section className="py-5 flex-1">
                <section className="sm:px-5">
                  <div className="md:flex md:flex-row-reverse items-center mb-6 md:mb-8">
                    {merchant.data.status === "processing-activation" && (
                      <div className="flex gap-4 items-center mb-8 md:mb-0 justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-600 transition-opacity text-white rounded-full px-6 lg:px-12 hover:opacity-100 opacity-90"
                              disabled={declineForm.formState.isSubmitting}
                            >
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="lg:max-w-3xl ">
                            <DialogHeader>
                              <DialogTitle className="font-bold text-xl">
                                Reason for rejection
                              </DialogTitle>
                            </DialogHeader>
                            <Form {...declineForm}>
                              <form
                                className="space-y-6"
                                onSubmit={declineForm.handleSubmit(
                                  handleRejectSubmit
                                )}
                              >
                                <FormField
                                  control={declineForm.control}
                                  name="reasonsForDecline"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Textarea
                                          className="resize-none h-48"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <DialogFooter className="gap-4">
                                  <DialogClose asChild>
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="lg"
                                      className="font-bold text-lg"
                                    >
                                      Cancel
                                    </Button>
                                  </DialogClose>
                                  <Button
                                    type="submit"
                                    size="lg"
                                    className="font-bold text-lg hover:bg-primary"
                                  >
                                    Submit
                                    {declineForm.formState.isSubmitting && (
                                      <Spinner
                                        twColor="text-white before:bg-white"
                                        twSize="w-3 h-3"
                                        className="ml-3"
                                      />
                                    )}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          className="rounded-full px-6 lg:px-12 hover:bg-primary hover:opacity-100 opacity-90 transition-opacity"
                          disabled={loading}
                          onClick={activateAccount}
                        >
                          Activate
                          {loading && (
                            <Spinner
                              twColor="text-white before:bg-white"
                              twSize="w-3 h-3"
                              className="ml-3"
                            />
                          )}
                        </Button>
                      </div>
                    )}
                    {merchant.data.status === "activated" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-600 transition-opacity text-white rounded-full px-6 lg:px-12 hover:opacity-100 opacity-90"
                            disabled={suspendForm.formState.isSubmitting}
                          >
                            Suspend
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="lg:max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Reason for suspension</DialogTitle>
                          </DialogHeader>
                          <Form {...suspendForm}>
                            <form
                              className="space-y-6"
                              onSubmit={suspendForm.handleSubmit(
                                handleSuspendSubmit
                              )}
                            >
                              <FormField
                                control={suspendForm.control}
                                name="reasonsForSuspension"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Textarea
                                        className="resize-none h-48"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <DialogFooter className="gap-4">
                                <DialogClose asChild>
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="lg"
                                    className="font-bold text-lg"
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button
                                  type="submit"
                                  size="lg"
                                  className="font-bold text-lg hover:bg-primary"
                                >
                                  Submit
                                  {suspendForm.formState.isSubmitting && (
                                    <Spinner
                                      twColor="text-white before:bg-white"
                                      twSize="w-3 h-3"
                                      className="ml-3"
                                    />
                                  )}
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    )}
                    {merchant.data.status === "suspended" && (
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-600 transition-opacity text-white rounded-full px-6 lg:px-12  hover:opacity-100 opacity-90"
                        disabled={loading}
                        onClick={handleUnsuspendSubmit}
                      >
                        Unsuspend
                        {loading && (
                          <Spinner
                            twColor="text-white before:bg-white"
                            twSize="w-3 h-3"
                            className="ml-3"
                          />
                        )}
                      </Button>
                    )}
                    <h1 className="font-bold flex-1 text-primary">
                      {getTitle()}
                    </h1>
                  </div>
                  {search.get("tab") === "business" ? (
                    merchant.data.type === "business" ? (
                      <BusinessForm merchant={merchant.data} />
                    ) : (
                      <IndividualForm merchant={merchant.data} />
                    )
                  ) : search.get("tab") === "guarantor" ? (
                    <GuarantorForm merchant={merchant.data} />
                  ) : (
                    <UserForm merchant={merchant.data} />
                  )}
                </section>
              </section>
            </>
          )}
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps = (async (context) => {
  const session = await getIronSession<SessionData>(
    context.req,
    context.res,
    sessionOptions
  );

  if (!session.isLoggedIn || session.user?.type !== "admin") {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  }

  return { props: { session } };
}) satisfies GetServerSideProps<{ session: SessionData }>;
