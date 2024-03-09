import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatAmount } from "@/lib/utils";

type Props = {
  view: "settlement" | "order";
  serialNo: number;
  transactions: { [key: string]: any }[];
};

const formatTransactions = (transactions: any[]) =>
  transactions.map((transaction) => ({
    id: transaction.id,
    ref: transaction.reference,
    amount: formatAmount(transaction.priceEstimate || 0),
    status: transaction.status,
    type: transaction.type,
    transactionType: transaction.type,
    paymentMethod: transaction.paymentMethod,
    date: format(new Date(transaction.createdAt), "dd/MM/yyyy"),
  }));

export default function DataTable({ transactions, serialNo, view }: Props) {
  const formattedTransactions = formatTransactions(transactions);

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary hover:bg-primary">
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            #
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Reference
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Amount
          </TableHead>
          {view === "settlement" && (
            <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
              Status
            </TableHead>
          )}
          {view === "settlement" && (
            <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
              Transaction Type
            </TableHead>
          )}
          {view === "order" && (
            <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
              Type
            </TableHead>
          )}
          {view === "order" && (
            <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
              Payment Method
            </TableHead>
          )}
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Transaction Date
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {formattedTransactions.map((transaction, index) => (
          <TableRow
            key={index}
            className={cn("border-b-0", index % 2 === 0 && "bg-primary-light")}
          >
            <TableCell align="center" className="font-medium">
              {serialNo + index}
            </TableCell>
            <TableCell align="center" className="capitalize">
              {transaction.ref}
            </TableCell>
            <TableCell align="center">{transaction.amount}</TableCell>
            {view === "settlement" && (
              <TableCell align="center">{transaction.status}</TableCell>
            )}
            {view === "settlement" && (
              <TableCell align="center">
                {transaction.transactionType}
              </TableCell>
            )}
            {view === "order" && (
              <TableCell align="center">{transaction.type}</TableCell>
            )}
            {view === "order" && (
              <TableCell align="center">{transaction.paymentMethod}</TableCell>
            )}
            <TableCell align="center">{transaction.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
