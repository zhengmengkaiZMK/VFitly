CREATE TYPE "BlogPostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'OFFLINE');
CREATE TABLE public.blog_posts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 slug varchar(180) NOT NULL UNIQUE,
 title varchar(200) NOT NULL,
 description text NOT NULL,
 content text NOT NULL,
 category varchar(100) NOT NULL,
 tags text[] NOT NULL DEFAULT '{}',
 image text NOT NULL,
 author_name varchar(100) NOT NULL,
 created_by_id uuid NOT NULL,
 updated_by_id uuid NOT NULL,
 status "BlogPostStatus" NOT NULL DEFAULT 'DRAFT',
 published_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL
);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(status, published_at DESC);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.blog_posts FROM anon, authenticated;
