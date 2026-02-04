import { supabase } from '@/lib/supabase';

const YOUR_DOMAIN = 'https://deenelevate.com';

export default async function sitemap() {
  const { data: blogs } = await supabase.from('blogs').select('slug, updated_at');
  const { data: duas } = await supabase.from('duas').select('slug, updated_at');

  const blogEntries = blogs?.map((blog) => ({
    url: `${YOUR_DOMAIN}/blogs/${blog.slug}`,
    lastModified: new Date(blog.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  })) ?? [];

  const duaEntries = duas?.map((dua) => ({
    url: `${YOUR_DOMAIN}/duas/${dua.slug}`,
    lastModified: new Date(dua.updated_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  })) ?? [];

  const staticRoutes = [
    '',
    '/blogs',
    '/duas',
    '/hadith',
    '/quran',
  ].map((route) => ({
    url: `${YOUR_DOMAIN}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  }));

  return [...staticRoutes, ...blogEntries, ...duaEntries];
}
