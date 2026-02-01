import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function listPublishedPosts({ locale, limit = 50 }) {
  const supabase = getSupabaseAdmin();
  let q = supabase
    .from("blog_posts")
    .select("id, locale, slug, title, excerpt, author, cover_image_url, published_at, updated_at")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (locale) q = q.eq("locale", locale);

  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function getPublishedPostBySlug({ locale, slug }) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .eq("locale", locale)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function listAllPostsAdmin({ limit = 200 }) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, locale, slug, title, excerpt, author, cover_image_url, published, published_at, updated_at, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getPostAdmin(id) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}
