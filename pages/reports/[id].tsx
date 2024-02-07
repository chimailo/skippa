import { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getIronSession } from "iron-session";
import { format } from "date-fns";
import { CheckCircle2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Layout from "@/components/layout";
import FetchError from "@/components/error";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { CarIcon, BikeIcon, TruckIcon, VanIcon } from "@/components/svg";
import { useToast } from "@/components/ui/use-toast";
import { sessionOptions } from "@/lib/session";
import $api from "@/lib/axios";
import { formatAmount, splitCamelCaseText } from "@/lib/utils";
import useSession from "@/hooks/session";
import { SessionData } from "@/types";

export default function Reports({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [order, setOrder] = useState<{ [key: string]: any }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { signOut } = useSession();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await $api({
          token: session.token,
          url: `/orders/${params.id}?type=${session.user?.type}`,
        });
        setOrder(response.data);
      } catch (error: any) {
        if (error.data?.name === "UnauthorizedError") {
          signOut();
          toast({
            duration: 1000 * 5,
            variant: "destructive",
            title: splitCamelCaseText(error.data?.name) || undefined,
            description: error.data?.message || "Your session has expired",
          });
          router.push(`/login?callbackUrl=/reports/${params.id}`);
          return;
        }
        setError(error.data?.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, []);

  return (
    <Layout
      auth
      user={session.user}
      title="Reports"
      sidebar={{ active: "reports" }}
    >
      {loading ? (
        <Spinner className="w-8 h-8 text-primary" />
      ) : error ? (
        <FetchError message={error || "Failed to fetch order"} />
      ) : (
        <div className="block space-y-6 p-6 text-[#393939]">
          <div className="flex justify-between items-center">
            <Button variant="ghost" asChild className="flex items-center gap-1">
              <Link href="/reports">
                <span className="text-lg">&larr;</span>
                Back
              </Link>
            </Button>
            {order?.orderStatus === "delivered" ? (
              <span className="px-2.5 py-1 text-xs rounded-full whitespace-nowrap capitalize bg-primary flex items-center gap-1 text-white">
                <CheckCircle2 className="w-3 h-3"></CheckCircle2>
                Delivered
              </span>
            ) : (
              <p className="text-xs whitespace-nowrap capitalize">
                {order?.orderStatus}
              </p>
            )}
          </div>
          <div className="flex md:flex-row-reverse flex-col gap-6">
            <div className="text-sm space-y-3">
              <p className="md:text-right">{"Ayo Badmus"}</p>
              <p className="font-semibold md:text-right">
                Green Honda
                <span className="ml-2 font-normal">{"KJA 123ZX"}</span>
              </p>
              {order?.vehicleType === "bike" ? (
                <BikeIcon className="w-16 h-9 fill-current md:clear-both md:float-right"></BikeIcon>
              ) : order?.vehicleType === "truck" ? (
                <TruckIcon className="w-16 h-9 fill-current md:clear-both md:float-right"></TruckIcon>
              ) : order?.vehicleType === "van" ? (
                <VanIcon className="w-16 h-9 fill-current md:clear-both md:float-right"></VanIcon>
              ) : (
                <CarIcon className="w-16 h-9 fill-current md:clear-both md:float-right"></CarIcon>
              )}
            </div>
            <div className="flex-1 text-sm space-y-3">
              <h4 className="font-bold">Order{order?.id}</h4>
              <p className="font-semibold">
                Delivery Fee:
                <span className="ml-1 font-normal">{formatAmount(13000)}</span>
              </p>
              <p className="font-semibold">
                Processing Fee:
                <span className="ml-1 font-normal">
                  {formatAmount(order?.processingFee)}
                </span>
              </p>
              {order?.discount && (
                <p className="font-semibold">
                  Discount:
                  <span className="ml-1 font-normal">
                    {formatAmount(order?.discount)}
                  </span>
                </p>
              )}
              <p className="font-semibold">
                Total Cost:
                <span className="ml-1 font-normal">
                  {formatAmount(order?.priceEstimate)}
                </span>
              </p>
            </div>
          </div>
          <Accordion type="single" collapsible className="shadow-sm">
            <AccordionItem value="item-sender">
              <AccordionTrigger className="font-semibold hover:no-underline bg-[#F3FFFE] px-5">
                Sender&apos;s Details
              </AccordionTrigger>
              <AccordionContent className="md:grid grid-cols-2 gap-4 p-5">
                <div className="flex-1 text-sm space-y-3">
                  <p className="font-semibold">
                    Name:
                    <span className="ml-1 font-normal">
                      {formatAmount(13000)}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Phone No.:
                    <span className="ml-1 font-normal">+2348144333226</span>
                  </p>
                  <p className="font-semibold">
                    Address:
                    <span className="ml-1 font-normal">
                      {
                        "32, Obafemi Awolowo Way, Oregun, Ikeja, Lagos State, Nigeria"
                      }
                    </span>
                  </p>
                  <p className="font-semibold">
                    Payment Method:
                    <span className="ml-1 font-normal">{"Online"}</span>
                  </p>
                </div>
                <div className="flex-1 text-sm space-y-3">
                  <p className="font-semibold">
                    Date Picked Up:
                    <span className="ml-1 font-normal">
                      {format(
                        new Date("2024-01-30T16:22:41.513Z"),
                        "dd/MM/yyyy"
                      )}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Time Picked Up:
                    <span className="ml-1 font-normal">
                      {format(new Date("2024-01-30T16:22:41.513Z"), "HH:mm")}
                    </span>
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible className="shadow-sm">
            <AccordionItem value="item-sender">
              <AccordionTrigger className="font-semibold hover:no-underline bg-[#F3FFFE] px-5">
                Receiver&apos;s Details
              </AccordionTrigger>
              <AccordionContent className="">
                {order?.itemInfo.map((item: any) => (
                  <div key={item.id} className="md:grid grid-cols-2 gap-4 p-5">
                    <div className="flex-1 text-sm space-y-3">
                      <p className="font-semibold">
                        Name:
                        <span className="ml-1 font-normal">
                          {item.receiverInfo.name}
                        </span>
                      </p>
                      <p className="font-semibold">
                        Phone No.:
                        <span className="ml-1 font-normal">
                          {item.receiverInfo.phoneNumber}
                        </span>
                      </p>
                      <p className="font-semibold">
                        Address:
                        <span className="ml-1 font-normal">
                          {`${item.addressInfo.address}, ${item.addressInfo.city} ${item.addressInfo.state} Nigeria`}
                        </span>
                      </p>
                    </div>
                    <div className="flex-1 text-sm space-y-3">
                      <p className="font-semibold">
                        Date Picked Up:
                        <span className="ml-1 font-normal">
                          {format(
                            new Date("2024-01-30T16:22:41.513Z"),
                            "dd/MM/yyyy"
                          )}
                        </span>
                      </p>
                      <p className="font-semibold">
                        Time Picked Up:
                        <span className="ml-1 font-normal">
                          {format(
                            new Date("2024-01-30T16:22:41.513Z"),
                            "HH:mm"
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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

  if (
    !session.isLoggedIn ||
    // @ts-expect-error
    !session.user?.role.permissions.includes("reports:view")
  ) {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  }
  return { props: { session } };
}) satisfies GetServerSideProps<{
  session: SessionData;
}>;
