import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { cn, getStatus } from "@/app/utils";
import Spinner from "@/app/components/loading";

export type Filter = {
  status?: string[];
  type?: string[];
  from?: Date;
  to?: Date;
};

type Props = {
  fetching: boolean;
  filter: Filter;
  handleFilter: (filter: Record<string, string>) => void;
};

const filterSchema = z.object({
  from: z.date(),
  to: z.date(),
  status: z.array(z.string()),
  type: z.array(z.string()),
});

export default function FilterModal({ fetching, filter, handleFilter }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      from: filter?.from,
      to: filter?.to,
      status: filter?.status || [],
      type: filter?.type || [],
    },
  });
  const status = getStatus();

  const handleSubmit = async (data: z.infer<typeof filterSchema>) => {
    const { from, to, status, type } = data;
    const filters = {
      from: from ? new Date(from).toISOString() : "",
      to: to ? new Date(to).toISOString() : "",
      status: status?.length ? status.join() : "",
      type: type?.length ? type.join() : "",
    };

    handleFilter(filters);
    setOpen(false);
  };

  // const handleCancel = () => {
  //   form.setValue("from", undefined);
  //   form.setValue("to", undefined);
  //   form.setValue("status", []);
  //   form.setValue("type", []);
  //   handleFilter();
  // };

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
                  name="from"
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
                              <CalendarIcon className="ml-auto h-4 w-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
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
                  name="to"
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
                              <CalendarIcon className="ml-auto h-4 w-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
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
              <h3 className="font-bold text-xl">Status</h3>
              <FormField
                control={form.control}
                name="status"
                render={() => (
                  <FormItem className="flex gap-4 items-center flex-wrap space-y-0">
                    {Object.keys(status).map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="status"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="capitalize font-normal">
                                {item.split("-").join(" ")}
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
              <h3 className="font-bold text-xl">Type</h3>
              <FormField
                control={form.control}
                name="type"
                render={() => (
                  <FormItem className="flex gap-4 items-center flex-wrap space-y-0">
                    {["business", "individual"].map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="type"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal capitalize">
                                {item}
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
            <DialogFooter>
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
                  // onClick={handleCancel}
                >
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
