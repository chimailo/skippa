import type { InferGetStaticPropsType, GetStaticProps } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Layout from "@/components/help/layout";
import { getSanitizedMarkup } from "@/lib/utils";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: "Partners" | "Customers";
};

export default function FAQs({
  faqs,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const customerFaqs = faqs.filter((faq) => faq.category === "Customers");
  const partnerFaqs = faqs.filter((faq) => faq.category === "Partners");

  return (
    <Layout title="Frequently Asked Questions">
      <>
        {customerFaqs.length && (
          <section className="my-12 sm:my-16">
            <h1 className="text-xl my-8 font-bold text-primary">Customers</h1>
            {customerFaqs.map((faq) => (
              <Accordion key={faq.id} type="single" collapsible>
                <AccordionItem value={"item-" + faq.id}>
                  <AccordionTrigger className="font-medium text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base">
                    <div
                      className="wysiwyg"
                      dangerouslySetInnerHTML={{
                        __html: getSanitizedMarkup(faq.answer),
                      }}
                    ></div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </section>
        )}
        {partnerFaqs.length && (
          <section className="my-12 sm:my-16">
            <h1 className="text-xl my-8 font-bold text-primary">Partners</h1>
            {partnerFaqs.map((faq) => (
              <Accordion key={faq.id} type="single" collapsible>
                <AccordionItem value={"item-" + faq.id}>
                  <AccordionTrigger className="font-medium text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base">
                    <div
                      className="wysiwyg"
                      dangerouslySetInnerHTML={{
                        __html: getSanitizedMarkup(faq.answer),
                      }}
                    ></div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </section>
        )}
      </>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const res = await fetch(`${process.env.SKIPPA_CMS_BASE_URL}/faqs`);
  const data = await res.json();
  // @ts-ignore
  const faqs: FAQ[] = data.data.map((faq) => ({
    ...faq.attributes,
    id: faq.id,
  }));

  return { props: { faqs } };
};
