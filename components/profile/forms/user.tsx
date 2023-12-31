import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from "@/types";

type FormDataType = z.infer<typeof FormSchema>;

const FormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First Name is required")
    .max(64, "First Name cannot be more than 64 characters long"),
  lastName: z
    .string()
    .min(1, "Last Name is required")
    .max(64, "Last Name cannot be more than 64 characters long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email" }),
  mobile: z
    .string()
    .min(1, "Phone number is required")
    .length(11, "Phone number must be of length 11 digits"),
});

export default function UserForm({ user }: { user: User }) {
  const form = useForm<FormDataType>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: user.name?.split(" ")[0],
      lastName: user.name?.split(" ")[1],
      email: user.email as string,
      mobile: user.phone,
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="lg:grid grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full col-span-1">
                <FormLabel className="">First Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full col-span-1">
                <FormLabel className="">Last Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full col-span-1">
                <FormLabel className="">Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem className="w-full col-span-1">
                <FormLabel className="">Phone Number</FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
