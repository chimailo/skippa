import { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ChangeRole from "@/components/team/change-role";
import { cn, splitCamelCaseText } from "@/lib/utils";
import $api from "@/lib/axios";
import { Role, SessionData } from "@/types";

type Props = {
  serialNo: number;
  roles: Role[];
  users: { [key: string]: any }[];
  session: SessionData;
  fetchTeam: (search: string) => void;
};

const formatUsers = (users: any[]) =>
  users.map((user) => ({
    id: user._id,
    name: user.firstName + " " + user.lastName,
    status: user.status,
    role: user.role.name,
    phone: user.mobile,
    email: user.email,
    date: format(new Date(user.createdAt), "dd/MM/yyyy"),
  }));

export default function DataTable({
  users,
  serialNo,
  session,
  roles,
  fetchTeam,
}: Props) {
  const formattedUsers = formatUsers(users);
  const status = {
    active: {
      color: "#00462A",
      bgColor: "#5FDBA7",
    },
    deactivated: {
      color: "#555F64",
      bgColor: "#C1CFD4",
    },
    invited: {
      color: "#A6A642",
      bgColor: "#FFFF99",
    },
  };
  const search = window.location.search;
  const modalOpen = Object.assign(
    {},
    ...formattedUsers.map((user) => ({ [user.id]: false }))
  );

  const [open, setOpen] = useState(modalOpen);
  const { toast } = useToast();

  const handleClose = (id: string) => setOpen({ ...open, [id]: !open[id] });

  const handleReInviteUser = async (email: string) => {
    try {
      const response = await $api({
        token: session.token,
        method: "post",
        url: "/merchants/business/users/reinvite",
        data: { email },
      });
      toast({
        duration: 1000 * 4,
        variant: "primary",
        title: splitCamelCaseText(response.data.name) || undefined,
        description:
          response.data.message || "Invitation link sent successfully",
      });
    } catch (error: any) {
      toast({
        duration: 1000 * 4,
        variant: "destructive",
        title: splitCamelCaseText(error.data.name) || undefined,
        description: error.data.message || "Failed to reinvite user",
      });
    }
  };

  const handleDeactivateUser = async (id: string) => {
    try {
      const response = await $api({
        token: session.token,
        method: "post",
        url: `/admins/merchants/${session.user?.role.businessId}/users/${id}/deactivate`,
      });
      fetchTeam(search);
      toast({
        duration: 1000 * 4,
        variant: "primary",
        description: response.data.message || "User deactivated successfully",
      });
    } catch (error: any) {
      toast({
        duration: 1000 * 4,
        variant: "destructive",
        title: splitCamelCaseText(error.data?.name) || undefined,
        description: error.data?.message || "Failed to deactivated user",
      });
    }
  };

  const handleReActivateUser = async (id: string) => {
    try {
      const response = await $api({
        token: session.token,
        method: "post",
        url: `/admins/merchants/${session.user?.role.businessId}/users/${id}/activate`,
      });
      fetchTeam(search);
      toast({
        duration: 1000 * 4,
        variant: "primary",
        description: response.data?.message || "User reactivated successfully",
      });
    } catch (error: any) {
      toast({
        duration: 1000 * 4,
        variant: "destructive",
        title: splitCamelCaseText(error.data?.name) || undefined,
        description: error.data?.message || "Failed to reactivate user",
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary hover:bg-primary">
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            #
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Name
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Status
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Role
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Phone Number
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Email
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Date Created
          </TableHead>
          <TableHead className="h-[3.75rem]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {formattedUsers.map((user, index) => (
          <TableRow
            key={index}
            className={cn("border-b-0", index % 2 === 0 && "bg-primary-light")}
          >
            <TableCell align="center" className="font-medium">
              {serialNo + index}
            </TableCell>
            <TableCell align="center" className="font-medium">
              {user.name}
            </TableCell>
            <TableCell align="center">
              <span
                className="px-2.5 py-1 text-xs rounded-full whitespace-nowrap capitalize"
                style={{
                  color: status[user.status as keyof typeof status].color,
                  backgroundColor:
                    status[user.status as keyof typeof status].bgColor,
                }}
              >
                {user.status.split("-").join(" ")}
              </span>
            </TableCell>
            <TableCell align="center" className="capitalize">
              {user.role}
            </TableCell>
            <TableCell align="center">{user.phone}</TableCell>
            <TableCell align="center">{user.email}</TableCell>
            <TableCell align="center">{user.date}</TableCell>
            <TableCell align="center">
              <Dialog
                open={open[user.id]}
                onOpenChange={() => handleClose(user.id)}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full bg-primary h-8 w-8 p-0 text-white hover:bg-teal-600 hover:text-white"
                    >
                      <MoreHorizontal className="w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[12rem]" align="end">
                    <DialogTrigger asChild>
                      <DropdownMenuItem>
                        <Button
                          variant="ghost"
                          className="w-full font-medium hover:bg-gray-100 text-left"
                        >
                          Change Role
                        </Button>
                      </DropdownMenuItem>
                    </DialogTrigger>
                    {user.status === "active" && (
                      <DropdownMenuItem>
                        <Button
                          variant="ghost"
                          className="w-full font-medium hover:bg-gray-100 text-left"
                          onClick={() => handleDeactivateUser(user.id)}
                        >
                          Deactivate User
                        </Button>
                      </DropdownMenuItem>
                    )}
                    {user.status === "deactivated" && (
                      <DropdownMenuItem>
                        <Button
                          variant="ghost"
                          className="w-full font-medium hover:bg-gray-100 text-left"
                          onClick={() => handleReActivateUser(user.id)}
                        >
                          Reactivate User
                        </Button>
                      </DropdownMenuItem>
                    )}
                    {user.status === "invited" && (
                      <DropdownMenuItem>
                        <Button
                          variant="ghost"
                          className="w-full font-medium hover:bg-gray-100 text-left"
                          onClick={() => handleReInviteUser(user.email)}
                        >
                          Re-invite User
                        </Button>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-bold text-2xl">
                      Change Role
                    </DialogTitle>
                  </DialogHeader>
                  <ChangeRole
                    token={session.token}
                    roles={roles}
                    user={user}
                    fetchTeam={fetchTeam}
                    handleClose={() => handleClose(user.id)}
                  />
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
