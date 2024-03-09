import { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { getIronSession } from "iron-session";

import DataTable from "@/components/team/datatable";
import Filter from "@/components/team/filter";
import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import Pagination, { TPagination } from "@/components/pagination";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { sessionOptions } from "@/lib/session";
import $api from "@/lib/axios";
import { Role, SessionData } from "@/types";
import { splitCamelCaseText } from "@/lib/utils";
import useSession from "@/hooks/session";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import InviteUser from "@/components/team/invite-user";
import FetchError from "@/components/error";
import TableSkeleton from "@/components/loading/table";
import NoData from "@/components/nodata";
import useUser from "@/hooks/user";

const endpoint = `/merchants/users`;

export default function Team({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [users, setUsers] = useState<{ [key: string]: any }[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
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

  const fetchTeam = async (search: string) => {
    try {
      setLoading(true);
      const response = await $api({
        token: session.token,
        url: endpoint + search,
      });
      setUsers(response.data.docs);
      setPagination(response.data.pagination);
    } catch (error: any) {
      if (error?.data.name === "UnauthorizedError") {
        signOut();
        toast({
          duration: 1000 * 4,
          variant: "destructive",
          title: splitCamelCaseText(error.data.name) || undefined,
          description: error.data.message || "Your session has expired",
        });
        router.push(`/login?callbackUrl=/team?${search}`);
        return;
      }
      setError(error.data.message || "Failed to fetch team");
    } finally {
      setLoading(false);
    }
  };

  const noDataMessage = () => {
    const filters = getFilters();
    const hasFilters = Object.keys(filters).length > 0;
    const filtersMsg =
      "Looks like we couldn't find any matches for your search";
    return hasFilters || search
      ? filtersMsg
      : "There is currently nobody in your team";
  };

  useEffect(() => {
    const search = window.location.search;
    const fetchRoles = async () => {
      try {
        const response = await $api({
          token: session.token,
          url: "/roles",
        });
        setRoles(response.data);
      } catch (error: any) {
        toast({
          duration: 1000 * 4,
          variant: "destructive",
          title: splitCamelCaseText(error.data.name) || undefined,
          description: error.data.message || "Failed to fetch roles",
        });
      }
    };
    (() => fetchTeam(search).then(() => fetchRoles()))();
  }, []);

  useUser();

  const getFilters = () => {
    const filter: Record<string, string> = {};
    const status = searchParams.get("status");
    const role = searchParams.get("role");
    const name = searchParams.get("name");

    if (status) filter.status = status;
    if (role) filter.role = role;
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
    setUsers(data.docs);
    setPagination(data.pagination);
    router.push(`/team?${query}`);
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  async function searchTeam() {
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
          `No team member was found that match the search term '${search}'`
      );
    } finally {
      setSearching(false);
    }
  }

  const handleFilter = async (filter: Record<string, string>) => {
    let filtersApplied: Record<string, string> = {};
    Object.entries(filter).forEach(([key, value]) => {
      if (value && value !== "name") {
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
        description: error.data.message || "Failed to fetch the previous page",
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

  return (
    <Layout user={session.user} auth sidebar={{ active: "team" }}>
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <FetchError message="Failed to fetch users in team" />
      ) : (
        <div className="block space-y-3 py-3">
          <div className="sm:flex items-center gap-4 px-5 justify-between">
            <Search
              placeholder="Search Users"
              searching={searching}
              handleSearch={handleSearch}
              searchRecords={searchTeam}
            />
            <div className="flex gap-4 justify-end mt-4 sm:mt-0">
              <Button
                asChild
                size="sm"
                className="text-white text-sm hover:bg-primary opacity-90"
              >
                <Link href="/team/manage-roles">Manage Roles</Link>
              </Button>
              <InviteUser
                token={session.token}
                roles={roles}
                fetchTeam={fetchTeam}
              />
            </div>
          </div>
          <hr className="bg-slate-100" />
          <div className="flex justify-end px-5">
            <Filter
              fetching={filtering}
              handleFilter={handleFilter}
              roles={roles}
            />
          </div>
          <>
            {users.length ? (
              <>
                <DataTable
                  users={users}
                  roles={roles}
                  session={session}
                  fetchTeam={fetchTeam}
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

  if (!session.isLoggedIn || session.user?.type === "individual") {
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
