import { connectDB } from '@/lib/mongodb';
import { PageContent } from '@/models/index';

export interface CMSPageData {
  content: Record<string, string>;
  images:  Record<string, string>;
}

/**
 * Server-side CMS data layer.
 * Fetches page content from MongoDB.
 * Returns empty objects if no data exists yet —
 * components fall back to their own hardcoded defaults.
 *
 * Usage (in a Next.js Server Component):
 *   const { content, images } = await getPageContent('home');
 */
export async function getPageContent(pageSlug: string): Promise<CMSPageData> {
  try {
    await connectDB();
    const page = await PageContent.findOne({ pageSlug }).lean() as {
      content?: Record<string, string>;
      images?:  Record<string, string>;
    } | null;

    return {
      content: page?.content ?? {},
      images:  page?.images  ?? {},
    };
  } catch {
    // If DB is unreachable, return empty — components use hardcoded defaults
    return { content: {}, images: {} };
  }
}
