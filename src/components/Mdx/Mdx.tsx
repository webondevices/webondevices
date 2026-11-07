import { evaluate } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactElement } from "react";
import * as runtime from "react/jsx-runtime";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkGfm from "remark-gfm";
import { highlight } from "sugar-high";
import { lang } from "sugar-high/lang";
import styles from "./Mdx.module.css";

/* A YouTube video, embedded without tracking cookies until it plays. */
function Video({ youtube, title }: { youtube: string; title: string }) {
  return (
    <figure className={styles.video}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtube}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </figure>
  );
}

/* Markdown images stand on their own, with the alt text as the caption unless captions are off. */
function Img({ src, alt = "", caption = true }: ComponentPropsWithoutRef<"img"> & { caption?: boolean }) {
  return (
    <figure className={styles.figure}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
      <img src={src as string} alt={alt} loading="lazy" />
      {caption && alt && <figcaption>{alt}</figcaption>}
    </figure>
  );
}

function A({ href = "", children }: ComponentPropsWithoutRef<"a">) {
  if (/^(https?:)?\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  // The hosted demos are their own apps, not Next pages, so they need a full page load.
  if (href.startsWith("/demos/")) return <a href={href}>{children}</a>;
  return <Link href={href}>{children}</Link>;
}

/* Fenced code, highlighted at build time. */
function Pre({ children }: ComponentPropsWithoutRef<"pre">) {
  const code = children as ReactElement<{ className?: string; children: string }>;
  const fence = code.props.className?.replace("language-", "");
  let language;
  try {
    language = fence ? lang(fence) : undefined;
  } catch {
    language = undefined;
  }
  const html = highlight(code.props.children.trimEnd(), language ? { lang: language } : {});
  return (
    <pre className={styles.code} data-language={fence}>
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}

const components: MDXComponents = { Video, img: Img, a: A, pre: Pre };

/* The old blog's alt text is short labels ("robot car"), not captions. */
const uncaptioned: MDXComponents = {
  ...components,
  img: (props: ComponentPropsWithoutRef<"img">) => <Img {...props} caption={false} />,
};

/** Renders an MDX string with the site's prose styles and components. */
export async function Mdx({ source, captions = true }: { source: string; captions?: boolean }) {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeUnwrapImages],
  });
  return (
    <div className={styles.prose}>
      <Content components={captions ? components : uncaptioned} />
    </div>
  );
}
