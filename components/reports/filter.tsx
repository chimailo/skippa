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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, orderStatus } from "@/lib/utils";
import Spinner from "@/components/spinner";
import { useSearchParams } from "next/navigation";
import { User } from "@/types";

type Props = {
  user: User | null;
  fetching: boolean;
  handleFilter: (filter: Record<string, string>) => void;
};

const paymentMethod = [
  { label: "Cash", value: "cash_on_delivery" },
  { label: "Wallet", value: "skippa_wallet" },
];

const orderType = ["single", "bulk"];

const filterSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.array(z.string()).optional(),
  // @ts-ignore
  type: z.enum(orderType).optional(),
  method: z.array(z.string()).optional(),
});

export default function Filter({ fetching, handleFilter, user }: Props) {
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const status = searchParams.get("orderStatus");
  const type = searchParams.get("orderType");
  const method = searchParams.get("paymentOption");

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      status: status ? status.split(",") : [],
      method: method ? method.split(",") : [],
      type: type || undefined,
    },
  });

  const ordStatus = Object.assign(
    {},
    ...Object.entries(orderStatus)
      .filter(([status, _]) => {
        if (user?.type === "business") {
          return !(
            status === "ready_for_pickup" || status === "pending_request"
          );
        }
        return true;
      })
      .map(([status, value]) => ({ [status]: value }))
  );

  const handleSubmit = async (data: z.infer<typeof filterSchema>) => {
    let start, end;
    let eday, emonth, eyear;
    let sday, smonth, syear;
    const { startDate, endDate, status, method, type } = data;

    if (startDate) {
      sday = new Date(startDate).getDate();
      smonth = new Date(startDate).getMonth() + 1;
      syear = new Date(startDate).getFullYear();
      start = `${syear}-${smonth}-${sday}`;
    }

    if (endDate) {
      eday = new Date(endDate).getDate();
      emonth = new Date(endDate).getMonth() + 1;
      eyear = new Date(endDate).getFullYear();
      end = `${eyear}-${emonth}-${eday}`;
    }

    const filters = {
      startDate: start ? start : "",
      endDate: end ? end : "",
      orderStatus: status?.length ? status.join() : "",
      orderType: type || "",
      paymentOption: method?.length ? method.join() : "",
    };

    handleFilter(filters);
    setOpen(false);
  };

  const handleClear = () => {
    form.setValue("startDate", undefined);
    form.setValue("endDate", undefined);
    form.setValue("status", []);
    form.setValue("type", undefined);
    form.setValue("method", []);
    handleFilter({
      startDate: "",
      endDate: "",
      status: "",
      method: "",
      type: "",
    });
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
                  name="startDate"
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
                  name="endDate"
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
                    {Object.keys(ordStatus).map((status) => (
                      <FormField
                        key={status}
                        control={form.control}
                        name="status"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={status}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(status)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          // @ts-expect-error
                                          ...field.value,
                                          status,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== status
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="capitalize font-normal">
                                {
                                  orderStatus[
                                    status as keyof typeof orderStatus
                                  ].label
                                }
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
                name="type"
                render={({ field }) => (
                  <FormItem className="flex gap-4 items-center flex-wrap space-y-0">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4 item-center"
                      >
                        {orderType.map((order) => (
                          <FormItem
                            key={order}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={order} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {order}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Payment Method</h3>
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
