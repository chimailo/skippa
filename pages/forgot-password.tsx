import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Spinner from "@/components/spinner";
import { useToast } from "@/components/ui/use-toast";
import { splitCamelCaseText } from "@/lib/utils";
import Footer from "@/components/footer";
import Layout from "@/components/layout";
import Container from "@/components/container";
import $api from "@/lib/axios";

type FormType = z.infer<typeof FormSchema>;

const FormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email" }),
});

export default function ForgotPasswordForm() {
  const [alert, setAlert] = useState(false);
  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    values: {
      email: "",
    },
  });
  const { toast } = useToast();

  async function onSubmit(data: FormType) {
    try {
      await $api({ url: `/auth/password/reset`, method: "post", data });
      form.reset();
      setAlert(true);
    } catch (error: any) {
      if (error.res?.error) {
        toast({
          variant: "destructive",
          title: splitCamelCaseText(error.res.name) || undefined,
          description:
            error.res.message ||
            "There was a problem with your request, please try again",
        });
        return;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: "Ooops..., an error has occured",
      });
    }
  }

  return (
    <Layout>
      <main className="">
        <Container
          compact
          className="flex items-center justify-center my-16 md:my-24"
        >
          <div className="shadow-3xl rounded-lg py-16 px-5 sm:px-8 md:py-20 md:max-w-md">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-12 sm:px-8"
              >
                <div className="text-center max-w-xs mx-auto">
                  <h1 className="text-2xl mb-3 font-bold">Reset Password</h1>
                  <p className="text-sm">
                    Please enter your email to receive a link to help set up
                    your new password
                  </p>
                </div>
                {alert && (
                  <Alert variant="primary">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      An email with a link to reset your password has been sent
                      to the provided email address
                    </AlertDescription>
                  </Alert>
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} placeholder="Email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                  }
                  size="lg"
                  className="w-full font-bold hover:bg-primary hover:opacity-90 transition-opacity text-lg xl:text-2xl"
                >
                  Submit
                  {form.formState.isSubmitting && (
                    <Spinner
                      twColor="text-white before:bg-white"
                      twSize="w-4 h-4"
                      className="ml-3"
                    />
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </Container>
      </main>
      <Footer bg="light" />
    </Layout>
  );
}
