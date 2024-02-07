import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Spinner from "@/components/spinner";
import { useSearchParams } from "next/navigation";

type Props = {
  fetching: boolean;
  handleFilter: (filter: Record<string, string>) => void;
};

const orderStatus = [
  { label: "Accepted", value: "accepted" },
  { label: "Pending request", value: "pending_request" },
  { label: "In transit to sender", value: "transit_to_sender" },
  { label: "Picked up from sender", value: "picked_up_from_sender" },
  { label: "In transit to receiver", value: "transit_to_receiver" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const paymentMethod = [
  { label: "Cash", value: "skippa_wallet" },
  { label: "Wallet", value: "cash_on_delivery" },
];

const filterSchema = z.object({
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  status: z.array(z.string()).optional(),
  method: z.array(z.string()).optional(),
});

export default function Filter({ fetching, handleFilter }: Props) {
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");
  const status = searchParams.get("orderStatus");
  const method = searchParams.get("orderType");

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
      status: status ? status.split(",") : [],
      method: method ? method.split(",") : [],
    },
  });

  const handleSubmit = async (data: z.infer<typeof filterSchema>) => {
    let start, end;
    let eday, emonth, eyear;
    let sday, smonth, syear;
    const { start_date, end_date, status, method } = data;

    if (start_date) {
      sday = new Date(start_date).getDate();
      smonth = new Date(start_date).getMonth() + 1;
      syear = new Date(start_date).getFullYear();
      start = `${syear}-${smonth}-${sday}`;
    }

    if (end_date) {
      eday = new Date(end_date).getDate();
      emonth = new Date(end_date).getMonth() + 1;
      eyear = new Date(end_date).getFullYear();
      end = `${eyear}-${emonth}-${eday}`;
    }

    const filters = {
      start_date: start ? start : "",
      end_date: end ? end : "",
      orderStatus: status?.length ? status.join() : "",
      paymentMethod: method?.length ? method.join() : "",
    };

    handleFilter(filters);
    setOpen(false);
  };

  const handleClear = () => {
    form.setValue("start_date", undefined);
    form.setValue("end_date", undefined);
    form.setValue("status", []);
    form.setValue("method", []);
    handleFilter({ start_date: "", end_date: "", status: "", method: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={fetching}
          className="text-primary font-semibold gap-2 hover:text-primary"
        >
          Filter
          {fetching && (
            <Spinner
              twColor="text-primary before:bg-primary"
              twSize="w-3 h-3"
              className="ml-3"
            />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Filter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Date</h3>
              <div className="grid-cols-1 grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="w-full space-y-2">
                      <FormLabel className="text-base text-zinc-500">
                        From
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value &&
                                format(new Date(field.value), "PPP")}
                              <CalendarIcon className="ml-auto h-4 w-4 text-primary" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            // @ts-expect-error
                            selected={new Date(field.value)}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="w-full  space-y-2">
                      <FormLabel className="text-base text-zinc-500">
                        To
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value &&
                                format(new Date(field.value), "PPP")}
                              <CalendarIcon className="ml-auto h-4 w-4 text-primary" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            // @ts-expect-error
                            selected={new Date(field.value)}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Status</h3>
              <FormField
                control={form.control}
                name="status"
                render={() => (
                  <FormItem className="flex gap-4 items-center flex-wrap space-y-0">
                    {orderStatus.map((status) => (
                      <FormField
                        key={status.value}
                        control={form.control}
                        name="status"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={status.value}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(status.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          // @ts-expect-error
                                          ...field.value,
                                          status.value,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== status.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="capitalize font-normal">
                                {status.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Type</h3>
              <FormField
                control={form.control}
                name="method"
                render={() => (
                  <FormItem className="flex gap-4 items-center flex-wrap space-y-0">
                    {paymentMethod.map((method) => (
                      <FormField
                        key={method.value}
                        control={form.control}
                        name="method"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={method.value}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(method.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          // @ts-expect-error
                                          ...field.value,
                                          method.value,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== method.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal capitalize">
                                {method.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="gap-4">
              <Button
                type="submit"
                size="lg"
                className="font-bold text-lg hover:bg-primary"
              >
                Apply
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="font-bold text-lg"
                  onClick={handleClear}
                >
                  Clear
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
