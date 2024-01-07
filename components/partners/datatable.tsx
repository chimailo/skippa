import { useRouter } from "next/navigation";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, getStatus } from "@/lib/utils";

type Props = {
  serialNo: string;
  merchants: { [key: string]: any }[];
};

const formatMerchants = (merchants: any[]) =>
  merchants.map((merchant) => ({
    id: merchant.id,
    businessName: merchant.merchantInformation.companyName,
    status: merchant.status,
    name:
      merchant.contactInformation.person.firstName +
      " " +
      merchant.contactInformation.person.lastName,
    phone: merchant.contactInformation.person.mobile,
    email: merchant.contactInformation.person.email,
    date: format(new Date(merchant.createdAt), "dd/MM/yyyy"),
  }));

export default function DataTable({ merchants, serialNo }: Props) {
  const formattedMerchants = formatMerchants(merchants);
  const status = getStatus();
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary hover:bg-primary">
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            #
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Business Name
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Status
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Contact Name
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Contact Phone No.
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Contact Email
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Date Created
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {formattedMerchants.map((merchant, index) => (
          <TableRow
            key={index}
            className={cn(
              "border-b-0 cursor-pointer",
              index % 2 === 0 && "bg-primary-light"
            )}
            onClick={() =>
              router.push(`/partners/${merchant.id}/manage-partner`)
            }
          >
            <TableCell align="center" className="font-medium">
              {Number(serialNo || 1) + index}
            </TableCell>
            <TableCell align="center" className="font-medium">
              {merchant.businessName || "N/A"}
            </TableCell>
            <TableCell align="center">
              <span
                className="px-2.5 py-1 text-xs rounded-full whitespace-nowrap capitalize"
                style={{
                  color: status[merchant.status as keyof typeof status].color,
                  backgroundColor:
                    status[merchant.status as keyof typeof status].bgColor,
                }}
              >
                {merchant.status.split("-").join(" ")}
              </span>
            </TableCell>
            <TableCell align="center" className="capitalize">
              {merchant.name}
            </TableCell>
            <TableCell align="center">{merchant.phone}</TableCell>
            <TableCell align="center">{merchant.email}</TableCell>
            <TableCell align="center">{merchant.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
