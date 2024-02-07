import type { InferGetStaticPropsType, GetStaticProps } from "next";
import Layout from "@/components/help/layout";
import { getSanitizedMarkup } from "@/lib/utils";
import NoData from "@/components/nodata";

export default function FAQs({
  policy,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      {policy.body ? (
        <article className="wysiwyg my-8 md:my-12">
          <div
            className=""
            dangerouslySetInnerHTML={{
              __html: getSanitizedMarkup(policy.body),
            }}
          ></div>
        </article>
      ) : (
        <NoData message="No content was found" />
      )}
    </Layout>
  );
}

export const getStaticProps = (async () => {
  const res = await fetch(`${process.env.SKIPPA_CMS_BASE_URL}/privacy-policy`);
  const data = await res.json();

  if (data.error) {
    return { props: { policy: { ...data.error } } };
  }

  return { props: { policy: data.data.attributes } };
}) satisfies GetStaticProps<{
  policy: Record<string, string>;
}>;
