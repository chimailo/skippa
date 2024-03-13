import { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
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
import { Button } from "@/components/ui/button";
import { CarIcon, BikeIcon, TruckIcon, VanIcon } from "@/components/svg";
import { useToast } from "@/components/ui/use-toast";
import { sessionOptions } from "@/lib/session";
import Loading from "@/components/loading";
import $api from "@/lib/axios";
import {
  formatAmount,
  formatText,
  orderStatus,
  splitCamelCaseText,
} from "@/lib/utils";
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

  const totalCost =
    Number(order?.priceEstimate) +
    Number(order?.processingFee) +
    Number(order?.discount);

  const status = orderStatus[order?.orderStatus as keyof typeof orderStatus];

  return (
    <Layout
      auth
      user={session.user}
      title="Reports"
      sidebar={{ active: "reports" }}
    >
      {loading ? (
        <Loading />
      ) : error ? (
        <FetchError message={error || "Failed to fetch order"} />
      ) : (
        <div className="block space-y-6 p-6 text-[#393939]">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              className="flex items-center gap-1"
              onClick={() => router.back()}
            >
              <span className="text-lg">&larr;</span>
              Back
            </Button>
            {order?.orderStatus === "delivered" ? (
              <span className="px-2.5 py-1 text-xs rounded-full whitespace-nowrap capitalize bg-primary flex items-center gap-1 text-white">
                <CheckCircle2 className="w-3 h-3"></CheckCircle2>
                Delivered
              </span>
            ) : (
              <span
                className="px-2.5 py-1 text-xs rounded-full whitespace-nowrap text-white"
                style={{
                  backgroundColor: status ? status.color : "",
                }}
              >
                {status ? status.label : ""}
              </span>
            )}
          </div>
          <div className="flex md:flex-row-reverse flex-col gap-6">
            {order?.assignedRider && (
              <div className="text-sm space-y-3">
                <p className="md:text-right">{order.assignedRider.fullName}</p>
                <p className="md:text-right">{order.assignedRider.mobile}</p>
                <p className="md:text-right">
                  {order.riderMerchant.companyName}
                </p>
                {/* <p className="font-semibold md:text-right">
                  {order.assignedRider.vehicle?.name}
                  <span className="ml-2 font-normal">
                    {order.assignedRider.vehicle?.number}
                  </span>
                </p> */}
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
            )}
            <div className="flex-1 text-sm space-y-3">
              <h4 className="font-bold">Order {order?.trackingId}</h4>
              <p className="font-semibold">
                Delivery Fee:
                <span className="ml-1 font-normal">
                  {formatAmount(order?.priceEstimate)}
                </span>
              </p>
              <p className="font-semibold">
                Processing Fee:
                <span className="ml-1 font-normal">
                  {formatAmount(order?.processingFee)}
                </span>
              </p>
              <p className="font-semibold">
                Discount:
                <span className="ml-1 font-normal">
                  {formatAmount(order?.discount)}
                </span>
              </p>
              <p className="font-semibold">
                Total Cost:
                <span className="ml-1 font-normal">
                  {formatAmount(totalCost)}
                </span>
              </p>
              <p className="font-semibold">
                Payment Method:
                <span className="ml-1 font-normal">
                  {formatText(order?.paymentOption)}
                </span>
              </p>
              {order?.reasonForDelay.length > 0 && (
                <p className="font-semibold">
                  Reason for Delay:
                  <span className="ml-1 font-normal">
                    {
                      order?.reasonForDelay[order?.reasonForDelay.length - 1]
                        .reason
                    }
                  </span>
                </p>
              )}
              {order?.reasonForCancel.length > 0 && (
                <>
                  <p className="font-semibold">
                    Cancelled By:
                    <span className="ml-1 font-normal capitalize">
                      {
                        order?.reasonForCancel[
                          order?.reasonForCancel.length - 1
                        ].cancelledBy
                      }
                    </span>
                  </p>
                  <p className="font-semibold">
                    Reason for Cancellation:
                    <span className="ml-1 font-normal">
                      {
                        order?.reasonForCancel[
                          order?.reasonForCancel.length - 1
                        ].reason
                      }
                    </span>
                  </p>
                </>
              )}
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
                      {order?.createdByCustomer.fullName}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Phone No.:
                    <span className="ml-1 font-normal">
                      {order?.createdByCustomer.mobile}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Address:
                    <span className="ml-1 font-normal">
                      {`${order?.pickupLocation.address}, ${order?.pickupLocation.city}, ${order?.pickupLocation.state}, Nigeria`}
                    </span>
                  </p>
                </div>
                {order?.createdByCustomer._createdAt && (
                  <div className="flex-1 text-sm space-y-3">
                    <p className="font-semibold">
                      Date Picked Up:
                      <span className="ml-1 font-normal">
                        {order?.pickedUpAt
                          ? format(new Date(order.pickedUpAt), "dd/MM/yyyy")
                          : "Not available"}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Time Picked Up:
                      <span className="ml-1 font-normal">
                        {order?.pickedUpAt
                          ? format(new Date(order.pickedUpAt), "HH:mm")
                          : "Not available"}
                      </span>
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {order?.itemInfo.map((item: any, index: number) => (
            <Accordion
              key={item.id}
              type="single"
              collapsible
              className="shadow-sm"
            >
              <AccordionItem value="item-sender">
                <AccordionTrigger className="font-semibold hover:no-underline bg-[#F3FFFE] px-5">
                  Receiver&apos;s Details{" "}
                  {order?.itemInfo.length > 1 && index + 1}
                </AccordionTrigger>
                <AccordionContent className="">
                  <div className="md:grid grid-cols-2 gap-4 p-5">
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
                      <p className="font-semibold">
                        Item Name:
                        <span className="ml-1 font-normal">
                          {item.itemName || "Not Available"}
                        </span>
                      </p>
                      <p className="font-semibold">
                        Item Description:
                        <span className="ml-1 font-normal">
                          {item.description || "Not Available"}
                        </span>
                      </p>
                      <p className="font-semibold">
                        Item Quantity:
                        <span className="ml-1 font-normal">
                          {item.quantity || "Not Available"}
                        </span>
                      </p>
                      <p className="font-semibold">Image:</p>
                      <div className="gap-3 flex flex-wrap">
                        {item.itemImages.map((img: string, i: number) => (
                          <Image
                            key={i}
                            src={img}
                            alt={item.itemName}
                            width={96}
                            height={96}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 text-sm space-y-3">
                      <p className="font-semibold">
                        Date Received:
                        <span className="ml-1 font-normal">
                          {order?.deliveredAt
                            ? format(new Date(order?.deliveredAt), "dd/MM/yyyy")
                            : "Not available"}
                        </span>
                      </p>
                      <p className="font-semibold">
                        Time Received:
                        <span className="ml-1 font-normal">
                          {order?.deliveredAt
                            ? format(new Date(order?.deliveredAt), "HH:mm")
                            : "Not available"}
                        </span>
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
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

  // @ts-expect-error
  if (!session.user?.role.permissions.includes("reports:view")) {
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
