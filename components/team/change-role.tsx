import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import { useToast } from "@/components/ui/use-toast";
import $api from "@/lib/axios";
import { splitCamelCaseText } from "@/lib/utils";
import { Role } from "@/types";

type Props = {
  roles: Role[];
  user?: Record<string, string>;
  token: string | null;
  handleClose: () => void;
  fetchTeam: (search: string) => void;
};

const FormSchema = z.object({
  role: z.string().min(1, "Role is required"),
});

export default function ChangeRole(props: Props) {
  const { roles, token, user, handleClose, fetchTeam } = props;
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: user?.role || "",
    },
  });

  const handleChangeRole = async (formData: z.infer<typeof FormSchema>) => {
    try {
      setSubmitting(true);
      const response = await $api({
        token,
        method: "post",
        url: `/merchants/users/${user?.id}/change-role`,
        data: formData,
      });
      toast({
        duration: 1000 * 4,
        variant: "primary",
        title: splitCamelCaseText(response.name) || undefined,
        description: response.message || "User role changed successfully",
      });

      const search = window.location.search;
      fetchTeam(search);
      handleClose();
    } catch (error: any) {
      toast({
        duration: 1000 * 4,
        variant: "destructive",
        title: splitCamelCaseText(error.name) || undefined,
        description:
          error.data?.message || error.message || "Failed to change user role",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleChangeRole)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="">Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
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
        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            className="font-medium text-lg hover:bg-primary"
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
  );
}
