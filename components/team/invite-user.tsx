import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/spinner";
import { splitCamelCaseText } from "@/lib/utils";
import $api from "@/lib/axios";
import { Role } from "@/types";

type Props = {
  token: string | null;
  roles: Role[];
  fetchTeam: (search: string) => void;
};

type FormDataType = z.infer<typeof FormSchema>;

const CATEGORIES = ["motorcycle", "car", "van", "truck"];

const FormSchema = z.object({
  firstName: z
    .string()
    .min(2, "First Name must be at least 2 characters long")
    .max(64, "First Name cannot be more than 64 characters long")
    .refine((val) => val.trim().length, {
      message: "First name is required",
    }),
  lastName: z
    .string()
    .min(2, "Last Name must be at least 2 characters long")
    .max(64, "Last Name cannot be more than 64 characters long")
    .refine((val) => val.trim().length, {
      message: "Last name is required",
    }),
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email" }),
  mobile: z
    .string()
    .min(1, "Phone number is required")
    .length(11, "Phone number must be of length 11 digits")
    .refine((val) => val.trim().length, {
      message: "Phone number is required",
    }),
  role: z.string().optional(),
  driversLicense: z.string().optional(),
  vehicleType: z.string().optional(),
});

export default function InviteUser({ token, roles, fetchTeam }: Props) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const { toast } = useToast();
  const form = useForm<FormDataType>({
    resolver: zodResolver(FormSchema),
    mode: "all",
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      mobile: "",
      // role: "",
      driversLicense: "",
    },
  });

  const handleRoleChange = (role: string) => setRole(role);

  const handleSubmit = async (formData: FormDataType) => {
    form.setValue("role", role);
    if (!role) {
      form.setError(
        "role",
        {
          message: "Role is required",
          type: "required",
        },
        { shouldFocus: true }
      );
      return;
    }
    if (role === "Riders" && !form.getValues("driversLicense")) {
      form.setError(
        "driversLicense",
        {
          message: "Drivers license is required for a riders role",
          type: "required",
        },
        { shouldFocus: true }
      );
      return;
    }
    if (role === "Riders" && !form.getValues("vehicleType")) {
      form.setError(
        "vehicleType",
        {
          message: "Vehicle type is required for a riders role",
          type: "required",
        },
        { shouldFocus: true }
      );
      return;
    }

    const { driversLicense, vehicleType, ...rest } = formData;
    const data = role === "Riders" ? formData : rest;

    try {
      const response = await $api({
        method: "post",
        token,
        url: "/merchants/business/users/invite",
        data: { ...data, role },
      });

      toast({
        duration: 1000 * 4,
        variant: "primary",
        title: splitCamelCaseText(response.name) || undefined,
        description: response.message || "Invitation link sent successfully",
      });

      const search = window.location.search;
      fetchTeam(search);
      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast({
        duration: 1000 * 4,
        variant: "destructive",
        title: splitCamelCaseText(error.data.name) || undefined,
        description: error.data.message || "Failed to invite this user",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          disabled={!roles.length || form.formState.isSubmitting}
          className="text-white hover:bg-primary opacity-90 text-sm"
        >
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">
            Invite New User
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5 after:leading-none">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input type="email" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid-cols-1 grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5 after:leading-none">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5 after:leading-none">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5 after:leading-none">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5 after:leading-none">
                    Role
                  </FormLabel>
                  <Select onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {roles.map((role: any) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {role === "Riders" && (
              <>
                <FormField
                  control={form.control}
                  name="driversLicense"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5 after:leading-none">
                        Driver&apos;s License
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5 after:leading-none">
                        Vehicle Type
                      </FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl className="capitalize">
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-80">
                          {CATEGORIES.map((category) => (
                            <SelectItem
                              key={category}
                              value={
                                category === "motorcycle" ? "bike" : category
                              }
                              className="capitalize"
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                className="font-medium text-lg hover:bg-primary"
                disabled={form.formState.isSubmitting}
              >
                Invite
                {form.formState.isSubmitting && (
                  <Spinner
                    twColor="text-white before:bg-white"
                    twSize="w-4 h-4"
                    className="ml-3"
                  />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
