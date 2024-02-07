import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { splitCamelCaseText } from "@/lib/utils";
import Spinner from "@/components/spinner";
import $api from "@/lib/axios";

type Props = {
  token: string | null;
  roles: string[];
  fetchRoles: () => void;
};

const FormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(64, "First Name cannot be more than 64 characters long")
    .refine((val) => val.trim().length, {
      message: "Name is required",
    }),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters long")
    .refine((val) => val.trim().length, {
      message: "Description is required",
    }),
  permissions: z
    .array(z.string())
    .nonempty("Permission is required to create a role"),
});

export default function CreateRole({ token, roles, fetchRoles }: Props) {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const handleSubmit = async (formData: z.infer<typeof FormSchema>) => {
    const { name, description, permissions } = formData;
    const perms = permissions.map((perms) => `${perms}:view`);

    try {
      const response = await $api({
        method: "post",
        token,
        url: "/roles",
        data: { name: name.trim(), description, permissions: perms },
      });

      toast({
        duration: 1000 * 5,
        variant: "primary",
        title: splitCamelCaseText(response.name) || undefined,
        description: response.message || "Role created successfully",
      });

      form.reset();
      setOpen(false);
      fetchRoles();
    } catch (error: any) {
      toast({
        duration: 1000 * 5,
        variant: "destructive",
        title: splitCamelCaseText(error.data?.name) || undefined,
        description:
          error.message || error.data?.message || "Failed to create role",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="px-5">
        <DialogTrigger asChild>
          <Button
            type="button"
            className="text-white hover:bg-primary opacity-90 text-sm"
          >
            + Create a custom role
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create Role</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5 after:leading-none">
                    Role Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="after:text-red-600 after:text-xl after:content-['*'] after:ml-0.5 after:leading-none">
                    Description
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
              name="permissions"
              render={() => (
                <FormItem className="space-y-4 md:space-y-6">
                  <FormLabel>What would this role have access to?</FormLabel>
                  {roles.map((role) => (
                    <FormField
                      key={role}
                      control={form.control}
                      name="permissions"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={role}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(role)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, role])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== role
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="capitalize font-normal">
                              {role === "businesses" ? "partners" : role}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                className="font-medium text-lg hover:bg-primary"
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
              >
                Create Role
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
