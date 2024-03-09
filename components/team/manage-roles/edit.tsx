import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
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
import { useToast } from "@/components/ui/use-toast";
import $api from "@/lib/axios";
import { splitCamelCaseText } from "@/lib/utils";
import { Role } from "@/types";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/spinner";

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
  permissions: z.array(z.string()),
});

type Props = {
  rolesPages: string[];
  role: Role;
  token: string | null;
  getRolePerms: (perms?: string[]) => string[];
  fetchRoles: () => void;
};

export const EditRole = (props: Props) => {
  const { role, token, fetchRoles, rolesPages, getRolePerms } = props;
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      name: role.name as string,
      description: role.description as string,
      permissions: getRolePerms(role.permissions as string[]),
    },
  });

  useEffect(() => {
    form.setValue("name", role.name as string);
    form.setValue("description", role.description as string);
    form.setValue("permissions", getRolePerms(role.permissions as string[]));
  }, [role]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const handleSubmit = async (formData: z.infer<typeof FormSchema>) => {
    const perms = formData.permissions.map((perms) => `${perms}:view`);
    setSubmitting(true);
    try {
      const response = await $api({
        url: `/roles/${role.id}`,
        method: "put",
        token,
        data: { ...formData, permissions: perms },
      });

      toast({
        variant: "primary",
        description: response.message || "Role updated successfully",
      });

      fetchRoles();
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: splitCamelCaseText(error.name) || undefined,
        description:
          error.message || error.data?.message || "Failed to update role",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="text-white hover:bg-primary opacity-90 text-sm"
        >
          Edit Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Edit Role</DialogTitle>
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
                  {rolesPages.map((page) => (
                    <FormField
                      key={page}
                      control={form.control}
                      name="permissions"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={page}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(page)}
                                disabled={!role.isCustom}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, page])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== page
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="capitalize font-normal">
                              {page === "businesses" ? "partners" : page}
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
                Submit
                {submitting && (
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
};
