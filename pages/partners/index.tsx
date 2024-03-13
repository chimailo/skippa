import { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { getIronSession } from "iron-session";

import DataTable from "@/components/partners/datatable";
import Filter from "@/components/partners/filter";
import Layout from "@/components/layout";
import Pagination, { TPagination } from "@/components/pagination";
import Search from "@/components/search";
import TableSkeleton from "@/components/loading/table";
import FetchError from "@/components/error";
import NoData from "@/components/nodata";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { sessionOptions } from "@/lib/session";
import $api from "@/lib/axios";
import { isObjectEmpty, splitCamelCaseText } from "@/lib/utils";
import useSession from "@/hooks/session";
import { SessionData } from "@/types";
import useUser from "@/hooks/user";

const endpoint = `/merchants`;

export default function Partners({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [merchants, setMerchants] = useState<{ [key: string]: any }[]>([]);
  const [pagination, setPagination] = useState<TPagination>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [filtering, setFiltering] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { signOut } = useSession();

  useEffect(() => {
    const search = window.location.search;
    const fetchMerchants = async () => {
      try {
        setLoading(true);
        const response = await $api({
          token: session.token,
          url: endpoint + search,
        });
        setMerchants(response.data.docs);
        setPagination(response.data.pagination);
      } catch (error: any) {
        if (error.data.name === "UnauthorizedError") {
          signOut();
          toast({
            duration: 1000 * 4,
            variant: "destructive",
            title: splitCamelCaseText(error.data.name) || undefined,
            description: error.data.message || "Your session has expired",
          });
          router.push(`/login?callbackUrl=/partners?${search}`);
          return;
        }
        setError(error.data.message || "Failed to fetch partners");
      } finally {
        setLoading(false);
      }
    };
    fetchMerchants();
  }, []);

  useUser();

  const getFilters = () => {
    const filter: Record<string, string> = {};
    const end_date = searchParams.get("end_date");
    const start_date = searchParams.get("start_date");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const name = searchParams.get("name");

    if (start_date) filter.start_date = start_date;
    if (end_date) filter.end_date = end_date;
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (name) filter.name = name;
    return filter;
  };

  const setParams = (params: { [key: string]: string }) =>
    new URLSearchParams(params).toString();

  function setData(
    data: { docs: any; pagination: TPagination },
    params: { [key: string]: string }
  ) {
    const query = setParams(params);
    setMerchants(data.docs);
    setPagination(data.pagination);
    router.push(`/partners?${query}`);
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  async function searchPartners() {
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
          `No partner was found that match the search term '${search}'`
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

  const isFiltersApplied = () => {
    const filters = getFilters();
    return !isObjectEmpty(filters);
  };

  const noDataMessage = () => {
    const filters = getFilters();
    const hasFilters = Object.keys(filters).length > 0;
    const filtersMsg =
      "Looks like we couldn't find any matches for your search";
    return hasFilters || search ? filtersMsg : "There is currently no partner";
  };

  return (
    <Layout
      auth
      user={session.user}
      title="Partners"
      sidebar={{ active: "partners" }}
    >
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <FetchError message="Failed to fetch partners" />
      ) : (
        <div className="block space-y-3 py-3">
          <Search
            placeholder="Search Partners"
            searching={searching}
            handleSearch={handleSearch}
            searchRecords={searchPartners}
          />
          <hr className="bg-slate-100" />
          <div className="flex justify-end px-5">
            <Filter fetching={filtering} handleFilter={handleFilter} />
          </div>
          <>
            {merchants.length ? (
              <>
                <DataTable
                  merchants={merchants}
                  serialNo={pagination!.serialNo as string}
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
            ) : search || isFiltersApplied() ? (
              <NoData message="Looks like we couldn't find any matches for your search" />
            ) : (
              <NoData message="There is currently no partner" />
            )}
          </>
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

  if (session.user?.type !== "admin") {
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
