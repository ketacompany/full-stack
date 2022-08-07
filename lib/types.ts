import { MDXRemoteSerializeResult } from 'next-mdx-remote'

export type GrayMatter = {
  date: string | null;
  slug: string;
  [key: string]: any;
}

export type Post = {
  html: MDXRemoteSerializeResult<Record<string, unknown>>;
  frontMatter: GrayMatter;
}

export type PostMeta = {
  id: string;
  slug: string;
  views: number;
  likes: number;
  shares: number;
}

export type SocialIconKind = 'email' | 'github' | 'youtube' | 'twitter' | 'instagram' | 'twitch' | 'linkedin';