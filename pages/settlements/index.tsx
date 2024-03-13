import { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { getIronSession } from "iron-session";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/settlements/datatable";
import Filter from "@/components/settlements/filter";
import Layout from "@/components/layout";
import Search from "@/components/search";
import TableSkeleton from "@/components/loading/table";
import FetchError from "@/components/error";
import Pagination, { TPagination } from "@/components/pagination";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { sessionOptions } from "@/lib/session";
import $api from "@/lib/axios";
import { SessionData } from "@/types";
import { cn, splitCamelCaseText } from "@/lib/utils";
import useSession from "@/hooks/session";
import NoData from "@/components/nodata";
import useUser from "@/hooks/user";
import CashflowCard from "@/components/settlements/cashflowCard";
import RadioButton from "@/components/radioButton";
import { Button } from "@/components/ui/button";

type ViewType = "settlement" | "order";

const FormSchema = z.object({
  bvn: z.string().length(11, {
    message: "BVN must be exactly 11 digits.",
  }),
});

const endpoint = `/settlements`;

export default function Settlements({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const searchParams = useSearchParams();
  const active = searchParams.get("view") as ViewType;

  const [view, setView] = useState<ViewType>(active || "settlement");
  const [orders, setOrders] = useState<{ [key: string]: any }[]>([]);
  const [settlements, setSettlements] = useState<{ [key: string]: any }[]>([]);
  const [pagination, setPagination] = useState<TPagination>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { signOut } = useSession();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      bvn: "",
    },
  });

  // useEffect(() => {
  //   const search = window.location.search;
  //   const fetchActiveView = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await $api({
  //         token: session.token,
  //         url: endpoint + search,
  //       });

  //       view === "order"
  //         ? setOrders(response.data.docs)
  //         : setSettlements(response.data.docs);
  //       setPagination(response.data.pagination);
  //     } catch (error: any) {
  //       if (error.data.name === "UnauthorizedError") {
  //         signOut();
  //         toast({
  //           variant: "destructive",
  //           title: splitCamelCaseText(error.data.name) || undefined,
  //           description: error.data.message || "Your session has expired",
  //         });
  //         router.push(`/login?callbackUrl=/settlements?${search}`);
  //         return;
  //       }
  //       setError(error.data.message || "Failed to fetch transactions");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchActiveView();
  // }, [view]);

  // useUser();

  const getFilters = () => {
    const filter: Record<string, string> = {};
    const end_date = searchParams.get("end_date");
    const start_date = searchParams.get("start_date");
    const paymentMethod = searchParams.get("paymentMethod");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const name = searchParams.get("name");

    if (start_date) filter.start_date = start_date;
    if (end_date) filter.end_date = end_date;
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (name) filter.name = name;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    return filter;
  };

  const setParams = (params: { [key: string]: string }) =>
    new URLSearchParams(params).toString();

  function setData(
    data: { docs: any; pagination: TPagination },
    params: { [key: string]: string }
  ) {
    const query = setParams(params);
    view === "order" ? setOrders(data.docs) : setSettlements(data.docs);
    setPagination(data.pagination);
    router.push(`/settlements?view=${view}&${query}`);
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  async function searchSettlements() {
    try {
      setSearching(true);
      const response = await $api({
        token: session.token,
        url: `${endpoint}`,
        params: { name: search },
      });
      setData(response.data, search ? { name: search } : {});
    } catch (error: any) {
      setError(
        error.data.message ||
          `No transaction reference match the search term '${search}'`
      );
    } finally {
      setSearching(false);
    }
  }

  const handleFilter = async (filter: Record<string, string>) => {
    let filtersApplied: Record<string, string> = {};
    Object.entries(filter).forEach(([key, value]) => {
      if (value && key !== "name") {
        filtersApplied[key] = value;
      }
    });

    try {
      setFiltering(true);
      const response = await $api({
        token: session.token,
        url: `${endpoint}`,
        params: filtersApplied,
      });
      setData(response.data, filtersApplied);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: splitCamelCaseText(error.data.name) || undefined,
        description: error.data.message || "Failed to apply filters",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => handleFilter(filtersApplied)}
          >
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setFiltering(false);
    }
  };

  const handlePrevClick = async () => {
    if (!pagination?.prevPage) return;

    const filters = getFilters();
    const params = { page: (pagination?.prevPage as string) || "", ...filters };

    try {
      setFetching(true);
      const response = await $api({
        token: session.token,
        url: `${endpoint}`,
        params,
      });
      setData(response.data, params);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: splitCamelCaseText(error.data.name) || undefined,
        description: error.data.message || "Failed to fetch previous page",
        action: (
          <ToastAction altText="Try again" onClick={() => handlePrevClick()}>
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setFetching(false);
    }
  };

  const handleNextClick = async () => {
    if (!pagination?.nextPage) return;

    const filters = getFilters();
    const params = { page: (pagination?.nextPage as string) || "", ...filters };

    try {
      setFetching(true);
      const response = await $api({
        token: session.token,
        url: `${endpoint}`,
        params,
      });
      setData(response.data, params);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: splitCamelCaseText(error.data.name) || undefined,
        description: error.data.message || "Failed to fetch the next page",
        action: (
          <ToastAction altText="Try again" onClick={() => handleNextClick()}>
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = () => {};

  const noDataMessage = () => {
    const filters = getFilters();
    const hasFilters = Object.keys(filters).length > 0;
    const filtersMsg =
      "Looks like we couldn't find any matches for your search";
    return hasFilters || search ? filtersMsg : "There are no transactions yet";
  };

  return (
    <Layout
      auth
      customChild
      user={session.user}
      title="Settlement"
      sidebar={{ active: "settlements" }}
    >
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <FetchError message="Failed to fetch settlements" />
      ) : (
        <>
          <div className="grid grid-cols-3 max-w-lg gap-7 my-4">
            {Array.from({ length: 5 }, (_, index) => (
              <CashflowCard
                key={index}
                title={"Inflow"}
                amount={15000}
                arrow={"up"}
              ></CashflowCard>
            ))}
          </div>
          {session.user?.type !== "admin" && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={fetching}
                  className="bg-[#272E2D] flex items-center gap-2 font-bold text-white rounded-full py-2 px-5 my-7 text-[10px]"
                >
                  Request Virtual Account
                  <span className="text-sm">+</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-bold text-2xl">
                    Virtual Account
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="bvn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">BVN</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              inputMode="numeric"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="gap-4 sm:justify-center">
                      <Button
                        disabled={
                          form.formState.isSubmitting || !form.formState.isValid
                        }
                        type="submit"
                        size="lg"
                        className="font-bold text-lg hover:bg-primary"
                      >
                        Request
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
          <div className="flex items-center gap-7 my-7">
            <RadioButton
              name="order"
              view={view}
              handleChange={() => setView("order")}
            ></RadioButton>
            <RadioButton
              name="settlement"
              view={view}
              handleChange={() => setView("settlement")}
            ></RadioButton>
          </div>
          <main
            className={cn(
              "overflow-y-auto z-10 rounded-lg bg-white min-h-[calc(100vh_-_6rem)]"
            )}
          >
            <div className="block space-y-3 py-3">
              <h1 className="text-xs font-semibold px-3">
                Transactions History
              </h1>
              <Search
                placeholder="Search Transaction Reference"
                searching={searching}
                handleSearch={handleSearch}
                searchRecords={searchSettlements}
              />
              <hr className="bg-slate-100" />
              <div className="flex justify-end px-5">
                <Filter
                  view={view}
                  fetching={filtering}
                  handleFilter={handleFilter}
                />
              </div>
              {view === "order" && orders.length ? (
                <>
                  <DataTable
                    transactions={orders}
                    view={view}
                    serialNo={
                      (Number(pagination?.currentPage || 0) - 1) *
                        Number(pagination?.perPage || 0) +
                      1
                    }
                  />
                  {pagination && (
                    <Pagination
                      fetching={fetching}
                      pagination={pagination}
                      handleNextClick={handleNextClick}
                      handlePrevClick={handlePrevClick}
                    />
                  )}
                </>
              ) : view === "settlement" && settlements.length ? (
                <>
                  <DataTable
                    transactions={settlements}
                    view={view}
                    serialNo={
                      (Number(pagination?.currentPage || 0) - 1) *
                        Number(pagination?.perPage || 0) +
                      1
                    }
                  />
                  {pagination && (
                    <Pagination
                      fetching={fetching}
                      pagination={pagination}
                      handleNextClick={handleNextClick}
                      handlePrevClick={handlePrevClick}
                    />
                  )}
                </>
              ) : (
                <NoData message={noDataMessage()} />
              )}
            </div>
          </main>
        </>
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
  if (!session.user?.role.permissions.includes("settlements:view")) {
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
