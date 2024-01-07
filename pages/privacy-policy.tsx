import type { InferGetStaticPropsType, GetStaticProps } from "next";
import Layout from "@/components/help/layout";
import { getSanitizedMarkup } from "@/lib/utils";

export default function FAQs({
  policy,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const content = getSanitizedMarkup(policy.body);

  return (
    <Layout>
      <article className="wysiwyg my-8 md:my-12">
        <div className="" dangerouslySetInnerHTML={{ __html: content }}></div>
      </article>
    </Layout>
  );
}

export const getStaticProps = (async () => {
  const res = await fetch(`${process.env.SKIPPA_CMS_BASE_URL}/privacy-policy`);
  const data = await res.json();

  return { props: { policy: data.data.attributes } };
}) satisfies GetStaticProps<{
  policy: Record<string, string>;
}>;
