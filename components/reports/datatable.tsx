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
import { cn, formatAmount, formatText, orderStatus } from "@/lib/utils";

type Props = {
  serialNo: number;
  reports: { [key: string]: any }[];
};

const formatReport = (reports: any[]) =>
  reports.map((report) => ({
    id: report.id,
    trackingId: report.trackingId,
    status: orderStatus[report.orderStatus as keyof typeof orderStatus],
    paymentMethod: formatText(report.paymentOption),
    income: formatAmount(report.priceEstimate || 0),
    time: format(new Date(report.createdAt), "HH:mm"),
    date: format(new Date(report.createdAt), "dd/MM/yyyy"),
  }));

export default function DataTable({ reports, serialNo }: Props) {
  const router = useRouter();
  const formattedReport = formatReport(reports);

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary hover:bg-primary">
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            #
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Order Id
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Status
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Payment Method
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Net Income
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Time
          </TableHead>
          <TableHead className="text-center whitespace-nowrap h-[3.75rem] text-white font-bold">
            Shipment Date
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {formattedReport.map((report, index) => (
          <TableRow
            key={index}
            className={cn(
              "border-b-0 cursor-pointer",
              index % 2 === 0 && "bg-primary-light"
            )}
            onClick={() => router.push(`/reports/${report.id}`)}
          >
            <TableCell align="center" className="font-medium">
              {serialNo + index}
            </TableCell>
            <TableCell align="center" className="capitalize">
              {report.trackingId}
            </TableCell>
            <TableCell align="center">
              <span
                className="px-2.5 py-1 text-xs rounded-full whitespace-nowrap text-white"
                style={{ backgroundColor: report.status.color }}
              >
                {report.status.label}
              </span>
            </TableCell>
            <TableCell align="center">{report.paymentMethod}</TableCell>
            <TableCell align="center">{report.income}</TableCell>
            <TableCell align="center">{report.time}</TableCell>
            <TableCell align="center">{report.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
