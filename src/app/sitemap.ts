import { createClient } from "@/lib/supabase-server";
import { MetadataRoute } from "next";

const BASE_URL = "https://blog-eight-kohl-50.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // 발행된 포스트 가져오기
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  // 카테고리 가져오기
  const { data: categories } = await supabase
    .from("categories")
    .select("slug");

  // 태그 가져오기
  const { data: tags } = await supabase
    .from("tags")
    .select("slug");

  const postUrls: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
    url: `${BASE_URL}/categories/${cat.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const tagUrls: MetadataRoute.Sitemap = (tags || []).map((tag) => ({
    url: `${BASE_URL}/tags/${tag.slug}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...postUrls,
    ...categoryUrls,
    ...tagUrls,
  ];
}
