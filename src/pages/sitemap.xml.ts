import type { APIContext } from "astro";
import { fetchAllGrammarPoints } from "grammar-sdk";
import { contextFromAstro } from "~/libs/context";

type SitemapUrl = {
  loc: string;
  changefreq?: string;
  priority?: number | string;
};

const staticPages: SitemapUrl[] = [
  {
    loc: "grammar",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    loc: "cram",
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    loc: "sr/lesson",
    changefreq: "hourly",
    priority: 0.9,
  },
  {
    loc: "help",
    changefreq: "yearly",
    priority: 0.7,
  },
];

export async function GET(context: APIContext) {
  const site = context.site?.toString() || "https://yourdomain.com";

  const grammarPoints = await fetchAllGrammarPoints(contextFromAstro(context));

  const grammarPointsUrls = grammarPoints.map((point) => ({
    loc: `grammar/${point.id}/`,
    changefreq: "weekly",
    priority: 0.9,
  }));

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...grammarPointsUrls]
  .map((url) => ({
    loc: `${site}${url.loc}`,
    changefreq: url.changefreq,
    priority: url.priority,
  }))
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>${
      url.changefreq
        ? `
    <changefreq>${url.changefreq}</changefreq>`
        : ""
    }${
      url.priority !== undefined
        ? `
    <priority>${url.priority}</priority>`
        : ""
    }
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}
