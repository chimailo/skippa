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
import { cn } from "@/lib/utils";
import Spinner from "@/components/spinner";
import { useSearchParams } from "next/navigation";

const trnTypes = ["credit", "debit"];
const types = ["inflow", "outflow"];
const trnStatus = ["pending", "failed", "success"];

type Props = {
  view: "settlement" | "order";
  fetching: boolean;
  handleFilter: (filter: Record<string, string>) => void;
};

const filterSchema = z.object({
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  status: z.array(z.string()).optional(),
  // @ts-ignore
  type: z.enum(types).optional(),
  // @ts-ignore
  trnType: z.enum(trnTypes).optional(),
  method: z.array(z.string()).optional(),
});

export default function Filter({ fetching, handleFilter, view }: Props) {
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const trnType = searchParams.get("trnType");
  const method = searchParams.get("paymentOption");

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
      status: status ? status.split(",") : [],
      method: method ? method.split(",") : [],
      type: type || undefined,
      trnType: trnType || undefined,
    },
  });

  const handleSubmit = async (data: z.infer<typeof filterSchema>) => {
    let start, end;
    let eday, emonth, eyear;
    let sday, smonth, syear;
    const { start_date, end_date, status, method, type } = data;

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
      type: type || "",
      trnType: trnType || "",
      paymentOption: method?.length ? method.join() : "",
    };

    handleFilter(filters);
    setOpen(false);
  };

  const handleClear = () => {
    form.setValue("start_date", undefined);
    form.setValue("end_date", undefined);
    form.setValue("status", []);
    form.setValue("type", undefined);
    form.setValue("trnType", undefined);
    form.setValue("method", []);
    handleFilter({
      startDate: "",
      endDate: "",
      status: "",
      method: "",
      trnType: "",
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
              <h3 className="font-bold text-xl">Date</h3>
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
              <div className="space-y-3">
                <h3 className="font-bold text-lg">Status</h3>
                <FormField
                  control={form.control}
                  name="status"
                  render={() => (
                    <FormItem className="flex gap-4 items-center flex-wrap space-y-0">
                      {trnStatus.map((status) => (
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
                                  {status}
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
              {view === "order" && (
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
                            {types.map((order) => (
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
              )}
              {view === "settlement" && (
                <div className="space-y-3">
                  <h3 className="font-bold text-lg">Transaction Type</h3>
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
                            {trnTypes.map((type) => (
                              <FormItem
                                key={type}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem value={type} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {type}
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
              )}
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
