import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import Container from "@/components/container";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Footer from "@/components/footer";
import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import WhySkippa from "@/components/whyskippa";

const TYPES = ["business", "individual"] as const;

const FormSchema = z.object({
  type: z.enum(TYPES, {
    required_error: "You need to select the type of the business.",
  }),
});

export default function BusinessTypeForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { type: "business" },
    mode: "onSubmit",
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    router.push(`/signup?type=${data.type}`);
    form.reset();
  }

  return (
    <Layout>
      <main className="flex flex-col items-center justify-between">
        <Container
          compact
          className="grid md:grid-flow-col md:auto-cols-fr md:gap-6 gap-12 my-12"
        >
          <div className="md:my-40 sm:w-4/5 md:w-full xl:w-4/5">
            <h1 className="text-3xl mb-4 md:mb-6 font-bold">
              Introducing <span className="text-primary">Skippa:</span>{" "}
              Revolutionizing Logistics for Your Company!
            </h1>
            <p className="text-sm">
              Are you a logistics company looking to elevate your services and
              provide an exceptional customer experience? Look no further!
              Skippa is here to transform the way you deliver packages and
              streamline your operations.
            </p>
          </div>
          <div className="shadow-3xl rounded-lg py-6 px-5 sm:px-8 md:py-8 xl:px-12">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <h1 className="text-2xl font-bold">Business Type Selection</h1>
                <p className="text-sm">
                  Please select the business type that best describes you
                </p>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-8 mb-12 lg:20">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-9 lg:space-y-16"
                        >
                          <FormItem className="flex space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="business" />
                            </FormControl>
                            <FormLabel className="font-bold">
                              Registered Business
                              <FormDescription className="mt-3.5 font-normal">
                                A registered business refers to a legally
                                recognized entity that has undergone the
                                necessary registration and incorporation
                                processes. It typically includes companies,
                                corporations, partnerships, and other formal
                                business structures. Registered businesses are
                                required to provide specific legal documentation
                                during the onboarding process, such as an
                                official business name, registration number, tax
                                identification number, and other relevant
                                information.
                              </FormDescription>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="individual" />
                            </FormControl>
                            <FormLabel className="font-bold">
                              Individual Business
                              <FormDescription className="mt-3.5 font-normal">
                                An individual business refers to a business
                                operated by a single person without any formal
                                legal structure. This type of business is often
                                referred to as a sole proprietorship. Individual
                                businesses are typically owned and managed by
                                one individual and are not legally separate from
                                the owner. In the onboarding process, individual
                                businesses may be required to provide personal
                                identification information, such as the
                                owner&apos;s name, contact details, and
                                identification documents.
                              </FormDescription>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full font-bold text-lg hover:bg-primary :hover:opacity-90 transition-opacity  xl:text-2xl"
                  size="lg"
                >
                  Proceed
                  {form.formState.isSubmitting && (
                    <Spinner
                      twColor="text-white before:bg-white"
                      twSize="w-4 h-4"
                      className="ml-3"
                    />
                  )}
                </Button>
                <p className="my-6 text-sm text-center font-medium">
                  Already have an account?
                  <Link
                    href="/login"
                    className="text-primary hover:underline ml-2"
                  >
                    Log In
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </Container>
        <WhySkippa />
      </main>
      <Footer />
    </Layout>
  );
}
