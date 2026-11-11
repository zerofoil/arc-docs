import { source } from "@/lib/source";
import {
  DocsBody,
  DocsPage,
  DocsTitle,
  DocsDescription,
} from "@/layouts/spacious/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { appDescription, appBanner, appName } from "@/lib/shared";

export default async function Page(props: PageProps<"/[lang]/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const MDX = page.data.body;
  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/[lang]/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const title = page.data.title
    ? `${page.data.title} - ${appName}`
    : `${appName} Documentation`;

  return {
    title: page.data.title,
    description: appDescription,
    openGraph: {
      title: title,
      description: appDescription,
      images: appBanner,
    },
    twitter: {
      card: "summary",
      title: title,
      description: appDescription,
      images: appBanner,
    },
  };
}
