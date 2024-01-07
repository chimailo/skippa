import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Props = {
  serialNo: number;
  customers: { [key: string]: any }[];
};

const formatMCustomers = (customers: any[]) =>
  customers.map((customer) => ({
    id: customer.id,
    name: customer.firstName + " " + customer.lastName,
    phone: customer.mobile,
    email: customer.email,
    date: format(new Date(customer.createdAt), "dd/MM/yyyy"),
  }));

export default function DataTable({ customers, serialNo }: Props) {
  const formattedCustomers = formatMCustomers(customers);

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary hover:bg-primary">
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            #
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
        {formattedCustomers.map((customer, index) => (
          <TableRow
            key={index}
            className={cn("border-b-0", index % 2 === 0 && "bg-primary-light")}
          >
            <TableCell align="center" className="font-medium">
              {serialNo + index}
            </TableCell>
            <TableCell align="center" className="capitalize">
              {customer.name}
            </TableCell>
            <TableCell align="center">{customer.phone}</TableCell>
            <TableCell align="center">{customer.email}</TableCell>
            <TableCell align="center">{customer.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
