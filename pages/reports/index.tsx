import { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { getIronSession } from "iron-session";

import DataTable from "@/components/reports/datatable";
import Filter from "@/components/reports/filter";
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
import { splitCamelCaseText } from "@/lib/utils";
import useSession from "@/hooks/session";
import useUser from "@/hooks/user";
import NoData from "@/components/nodata";

export default function Reports({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [reports, setReport] = useState<{ [key: string]: any }[]>([]);
  const [pagination, setPagination] = useState<TPagination>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [filtering, setFiltering] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { signOut } = useSession();
  const endpoint =
    session.user?.type === "admin"
      ? "/orders/admin/reports"
      : `/orders/business/reports`;

  useEffect(() => {
    const search = window.location.search;
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await $api({
          token: session.token,
          url: endpoint + search,
        });
        setReport(response.data.docs);
        setPagination(response.data.pagination);
      } catch (error: any) {
        if (error.data?.name === "UnauthorizedError") {
          signOut();
          toast({
            variant: "destructive",
            title: splitCamelCaseText(error.data?.name) || undefined,
            description: error.data.message || "Your session has expired",
          });
          router.push(`/login?callbackUrl=/reports?${search}`);
          return;
        }
        setError(error.data.message || "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  useUser();

  const getFilters = () => {
    const filter: Record<string, string> = {};
    const end_date = searchParams.get("endDate");
    const start_date = searchParams.get("startDate");
    const status = searchParams.get("orderStatus");
    const type = searchParams.get("orderType");
    const payMethod = searchParams.get("paymentOption");

    if (start_date) filter.startDate = start_date;
    if (end_date) filter.endDate = end_date;
    if (status) filter.orderStatus = status;
    if (payMethod) filter.paymentOption = payMethod;
    if (type) filter.orderType = type;
    return filter;
  };

  const setParams = (params: { [key: string]: string }) =>
    new URLSearchParams(params).toString();

  function setData(
    data: { docs: any; pagination: TPagination },
    params: { [key: string]: string }
  ) {
    const query = setParams(params);
    setReport(data.docs);
    setPagination(data.pagination);
    router.push(`/reports?${query}`);
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  async function searchReports() {
    try {
      setSearching(true);
      const response = await $api({
        token: session.token,
        url: `${endpoint}`,
        params: { trackingId: search },
      });
      setData(response.data, search ? { trackingId: search } : {});
    } catch (error: any) {
      setError(error.data.message || `No order ID match the search input`);
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
        duration: 1000 * 4,
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
        duration: 1000 * 4,
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
        duration: 1000 * 4,
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

  const noDataMessage = () => {
    const filters = getFilters();
    const hasFilters = Object.keys(filters).length > 0;
    const filtersMsg =
      "Looks like we couldn't find any matches for your search";
    return hasFilters || search
      ? filtersMsg
      : "There is currently no report entry";
  };

  return (
    <Layout
      auth
      user={session.user}
      title="Reports"
      sidebar={{ active: "reports" }}
    >
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <FetchError message={error || "Failed to fetch reports"} />
      ) : (
        <div className="block space-y-3 py-3">
          <Search
            placeholder="Search ID"
            searching={searching}
            searchKey="trackingId"
            handleSearch={handleSearch}
            searchRecords={searchReports}
          />
          <hr className="bg-slate-100" />
          <div className="flex justify-end px-5">
            <Filter
              fetching={filtering}
              handleFilter={handleFilter}
              user={session.user}
            />
          </div>
          {reports.length ? (
            <>
              <DataTable
                reports={reports}
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
