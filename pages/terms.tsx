import type { InferGetStaticPropsType, GetStaticProps } from "next";
import Layout from "@/components/help/layout";
import { getSanitizedMarkup } from "@/lib/utils";

export default function FAQs({
  terms,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const content = getSanitizedMarkup(terms.body);

  return (
    <Layout>
      <article className="wysiwyg my-8 md:my-12">
        <div className="" dangerouslySetInnerHTML={{ __html: content }}></div>
      </article>
    </Layout>
  );
}

export const getStaticProps = (async () => {
  const res = await fetch(
    `${process.env.SKIPPA_CMS_BASE_URL}/terms-and-condition`
  );
  const data = await res.json();

  return { props: { terms: data.data.attributes } };
}) satisfies GetStaticProps<{
  terms: Record<string, string>;
}>;
