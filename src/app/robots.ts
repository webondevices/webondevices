import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // /brand/ is the internal design-system preview.
    rules: { userAgent: "*", allow: "/", disallow: "/brand/" },
    sitemap: "https://www.webondevices.com/sitemap.xml",
  };
}
