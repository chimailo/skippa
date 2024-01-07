import { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getIronSession } from "iron-session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import Layout from "@/components/layout";
import CreateRole from "@/components/team/manage-roles/create";
import { EditRole } from "@/components/team/manage-roles/edit";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import $api from "@/lib/axios";
import { cn, splitCamelCaseText } from "@/lib/utils";
import { sessionOptions } from "@/lib/session";
import { Role, SessionData } from "@/types";
import {
  RoleCollapsible,
  RoleCollapsibleTrigger,
  RoleCollapsibleContent,
} from "@/components/team/manage-roles/collapsible";
import useSession from "@/hooks/session";
import FetchError from "@/components/error";
import { Skeleton } from "@/components/ui/skeleton";
import Loading from "@/components/loading";
import RoleDetails from "@/components/team/manage-roles/details";

type Permission = {
  name: string;
  permission: string;
};

type Permissions = {
  name: string;
  permission: Permission[];
};

const adminRoles = [
  "dashboard",
  "partners",
  "customers",
  "reports",
  "settlements",
  "team",
  "profile",
];

const businessRoles = [
  "dashboard",
  "reports",
  "settlements",
  "team",
  "profile",
];

export default function ManagePartners({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permissions[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [activeRole, setActiveRole] = useState<Role>();
  const [collapsible, setCollapsible] = useState({
    default: false,
    custom: false,
  });

  const router = useRouter();
  const { signOut } = useSession();
  const { toast } = useToast();
  const search = useSearchParams();
  const roleId = search.get("role");

  const fetchRoles = async () => {
    try {
      setFetching(true);
      const response = await $api({
        token: session.token,
        url: "/roles",
      });
      setRoles(response.data);
    } catch (error: any) {
      if (error?.data.name === "UnauthorizedError") {
        signOut();
        toast({
          duration: 1000 * 5,
          variant: "destructive",
          title: splitCamelCaseText(error.data.name) || undefined,
          description: error.data.message || "Your session has expired",
        });
        router.push(`/login?callbackUrl=/team?${search}`);
        return;
      }

      toast({
        duration: 1000 * 5,
        variant: "destructive",
        title: splitCamelCaseText(error.data.name) || undefined,
        description: error.data.message || "Failed to fetch roles",
      });
      setError(error.data.message || "Failed to fetch roles");
    } finally {
      setFetching(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await $api({
        token: session.token,
        url: "/roles/business/permissions",
      });
      setPermissions(response.data);
    } catch (error: any) {
      toast({
        duration: 1000 * 5,
        variant: "destructive",
        title: splitCamelCaseText(error.data.name) || undefined,
        description: error.data.message || "Failed to fetch permissions",
      });
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (roles) {
      const role = roles.find((role) => role.id === roleId);
      setActiveRole(role);
    }
  }, [roleId, roles]);

  const rolesPages = () => permissions.map((permission) => permission.name);

  function getRolePerms(permissions?: string[]) {
    const perms: string[] = [];
    permissions &&
      permissions.forEach((perm) => {
        let page = perm.split(":")[0];

        if (!perms.includes(page)) perms.push(page);
      });
    return perms;
  }

  const handleDeleteRole = async (id: string) => {
    try {
      const response = await $api({
        url: `/roles/${id}`,
        method: "delete",
        token: session.token,
      });
      toast({
        duration: 1000 * 5,
        variant: "primary",
        title: splitCamelCaseText(response.data.name) || undefined,
        description: response.data.message || "Role deleted successfully",
      });
      await fetchRoles();
    } catch (error: any) {
      toast({
        duration: 1000 * 5,
        variant: "destructive",
        title: splitCamelCaseText(error.data.name) || undefined,
        description: error.data.message || "Failed to delete role",
      });
    }
  };

  const defaultRoles = roles.filter((role) => !role.isCustom);
  const customRoles = roles.filter((role) => role.isCustom);

  const toggleCollapsible = (type: "default" | "custom") => {
    setCollapsible((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };

  return (
    <Layout auth user={session.user} sidebar={{ active: "team" }}>
      {fetching ? (
        <Loading />
      ) : error ? (
        <FetchError message={error || "Failed to fetch roles"} />
      ) : (
        <>
          <div className="p-5 flex items-center">
            <h1 className="font-bold text-2xl flex-1">Manage Roles</h1>
            {activeRole && activeRole.isCustom && (
              <div className="flex gap-4 justify-end mt-4 sm:mt-0">
                <Button
                  type="button"
                  size="sm"
                  className="text-white text-sm hover:bg-red-500 bg-red-500 opacity-90"
                  onClick={() => handleDeleteRole(activeRole.id as string)}
                >
                  Delete Role
                </Button>
                <EditRole
                  role={activeRole}
                  fetchRoles={fetchRoles}
                  token={session.token}
                  rolesPages={rolesPages()}
                  getRolePerms={getRolePerms}
                />
              </div>
            )}
          </div>
          <div className="md:flex md:gap-x-5 mb-5">
            <section className="max-w-[18rem] w-full space-y-4">
              {["default", "custom"].map((type) => (
                <RoleCollapsible key={type}>
                  <RoleCollapsibleTrigger
                    type={type as "default" | "custom"}
                    collapsible={collapsible}
                    toggle={() =>
                      toggleCollapsible(type as "default" | "custom")
                    }
                  >
                    {type} Roles
                  </RoleCollapsibleTrigger>
                  <RoleCollapsibleContent
                    roles={type === "default" ? defaultRoles : customRoles}
                    collapsible={collapsible}
                    type={type as "default" | "custom"}
                    // setActiveRole={handleActiveRole}
                  />
                </RoleCollapsible>
              ))}
              <CreateRole
                token={session.token}
                roles={rolesPages()}
                fetchRoles={fetchRoles}
              />
            </section>
            <div className="border-l-2 hidden md:block min-h-[calc(100vh_-_12rem)] border-zinc-300"></div>
            <hr className="md:hidden h-0.5 my-5 bg-zinc-300" />
            {activeRole && (
              <RoleDetails role={activeRole} pages={rolesPages()} />
            )}
          </div>
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

  if (!session.isLoggedIn) {
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
