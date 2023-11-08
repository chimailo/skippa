"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
} from "lucide-react";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { useToast } from "@/app/components/ui/use-toast";
import { cn, getStatus, splitCamelCaseText } from "@/app/utils";
import FilterModal, { type Filter } from "./filter";
import { ToastAction } from "@/app/components/ui/toast";
import useDebounce from "@/app/hooks/debounce";

type Props = {
  data: { [key: string]: any }[];
  pagination: { [key: string]: number | boolean | null | undefined };
  token: string;
};

const setParams = (params: any) => new URLSearchParams(params).toString();

const fetchMerchants = async (params: string, token: string) => {
  const res = await fetch(`/api/partners`, {
    method: "POST",
    body: JSON.stringify({ params }),
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  const { data } = await res.json();

  return data;
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

export default function DataTable({ data, pagination, token }: Props) {
  const formattedMerchants = formatMerchants(data);

  const [merchants, setMerchants] =
    useState<Record<string, string>[]>(formattedMerchants);
  const [filters, setFilters] = useState<Filter>();
  const [pageMeta, setPageMeta] =
    useState<Record<string, number | boolean | null | undefined>>(pagination);
  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState("");

  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const status = getStatus();

  useEffect(() => {
    const filter: Filter = {};
    const to = params.get("to");
    const from = params.get("from");
    const status = params.get("status");
    const type = params.get("type");

    if (from) filter.from = new Date(from);
    if (to) filter.to = new Date(to);
    if (status) filter.status = status.split(",");
    if (type) filter.type = type.split(",");

    setFilters(filter);
  }, []);

  const handleFilterClick = async (filter: Record<string, string>) => {
    setFetching(true);
    let filtersApplied: Record<string, string> = {};

    Object.entries(filter).forEach(([key, value]) => {
      if (value) {
        filtersApplied[key] = value;
      }
    });

    setFilters(filtersApplied);
    const params = setParams(filtersApplied);
    const res = await fetchMerchants(params, token);

    if (!res.success) {
      toast({
        variant: "destructive",
        title: splitCamelCaseText(res.name) || undefined,
        description: res.message || "Failed to apply filters",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => handleFilterClick(filtersApplied)}
          >
            Try again
          </ToastAction>
        ),
      });
    }

    setMerchants(formatMerchants(res.data.docs));
    setPageMeta(res.data.pagination);
    router.push(`/partners?page=${pageMeta.currentPage}&${params}`);
    setFetching(false);
  };

  const handlePrevClick = async () => {
    if (!pageMeta.prevPage) return;

    const filter = {
      from: filters?.from ? new Date(filters.from).toISOString() : "",
      to: filters?.to ? new Date(filters.to).toISOString() : "",
      status: filters?.status?.length ? filters.status.join() : "",
      type: filters?.type?.length ? filters.type.join() : "",
    };
    const params = setParams({ page: pageMeta.prevPage, ...filter });
    const res = await fetchMerchants(params, token);

    if (!res.success) {
      toast({
        variant: "destructive",
        title: splitCamelCaseText(res.name) || undefined,
        description: res.message || "Failed to fetch previous page",
        action: (
          <ToastAction altText="Try again" onClick={() => handlePrevClick()}>
            Try again
          </ToastAction>
        ),
      });
    }

    setMerchants(formatMerchants(res.data.docs));
    setPageMeta(res.data.pagination);
    router.push(`/partners?${params}`);
  };

  const handleNextClick = async () => {
    if (!pageMeta.nextPage) return;

    const filter = {
      from: filters?.from ? new Date(filters.from).toISOString() : "",
      to: filters?.to ? new Date(filters.to).toISOString() : "",
      status: filters?.status?.length ? filters.status.join() : "",
      type: filters?.type?.length ? filters.type.join() : "",
    };
    const params = setParams({ page: pageMeta.nextPage, ...filter });
    const res = await fetchMerchants(params, token);

    if (!res.success) {
      toast({
        variant: "destructive",
        title: splitCamelCaseText(res.name) || undefined,
        description: res.message || "Failed to fetch next page",
        action: (
          <ToastAction altText="Try again" onClick={() => handleNextClick()}>
            Try again
          </ToastAction>
        ),
      });
    }

    setMerchants(formatMerchants(res.data.docs));
    setPageMeta(res.data.pagination);
    router.push(`/partners?${params}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debounceSearch();
  };

  async function searchRecords() {
    const searchParams = setParams({ name: search });
    const res = await fetchMerchants(searchParams, token);

    if (!search) {
      const filter = {
        from: filters?.from ? new Date(filters.from).toISOString() : "",
        to: filters?.to ? new Date(filters.to).toISOString() : "",
        status: filters?.status?.length ? filters.status.join() : "",
        type: filters?.type?.length ? filters.type.join() : "",
      };
      await handleFilterClick(filter);
    }

    setMerchants(formatMerchants(res.data.docs));
    setPageMeta(res.data.pagination);
  }

  const debounceSearch = useDebounce(searchRecords);

  return (
    <>
      <div className="max-w-lg relative px-5">
        <Input
          type="text"
          placeholder="Search User"
          className="pl-10"
          onChange={handleSearch}
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-8 top-2.5" />
      </div>
      <hr className="bg-slate-100" />
      <div className="flex justify-end px-5">
        {filters && (
          <FilterModal
            fetching={fetching}
            filter={filters}
            handleFilter={handleFilterClick}
          ></FilterModal>
        )}
      </div>
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
            <TableHead className="h-[3.75rem]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {merchants.map((merchant, index) => (
            <TableRow
              key={index}
              className={cn(
                "border-b-0 relative",
                index % 2 === 0 && "bg-primary-light"
              )}
            >
              <TableCell align="center" className="font-medium">
                {Number(pageMeta.serialNo || 0) + index}
              </TableCell>
              <TableCell align="center" className="font-medium">
                {merchant.businessName || "N/A"}
              </TableCell>
              <TableCell align="center">
                <span
                  className="px-2.5 py-1 text-xs rounded-full whitespace-nowrap"
                  style={{
                    color: status[merchant.status as keyof typeof status].color,
                    backgroundColor:
                      status[merchant.status as keyof typeof status].bgColor,
                  }}
                >
                  {merchant.status}
                </span>
              </TableCell>
              <TableCell align="center" className="capitalize">
                {merchant.name}
              </TableCell>
              <TableCell align="center">{merchant.phone}</TableCell>
              <TableCell align="center">{merchant.email}</TableCell>
              <TableCell align="center">{merchant.date}</TableCell>
              <TableCell align="center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="">
                      <MoreHorizontal className="w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[12rem]">
                    <DropdownMenuItem>
                      <Link
                        href={`/partners/${merchant.id}/manage-partners`}
                        className="w-full font-medium"
                      >
                        View Business
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-5 w-full justify-end flex gap-4 items-center">
        {pageMeta.hasPrevPage && (
          <Button
            variant="outline"
            size="sm"
            className="h-6 w-6 rounded-sm p-0"
            onClick={handlePrevClick}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
        <p className="text-sm">
          Page {pageMeta.currentPage} of {pageMeta.totalPages}
        </p>
        {pageMeta.hasNextPage && (
          <Button
            variant="outline"
            size="sm"
            className="h-6 w-6 rounded-sm p-0"
            onClick={handleNextClick}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </>
  );
}
