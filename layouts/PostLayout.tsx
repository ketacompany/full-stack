import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/future/image'
import dayjs from 'dayjs'
import useSWR from 'swr'
import { EyeIcon, ShareIcon } from '@heroicons/react/outline'
import { PostSEO } from '@/components/SEO'
import Modal from '@/components/Modal'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import Subscribe from '@/components/Subscribe'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { PostMeta } from '@/lib/types'
import fetcher from '@/lib/fetcher'
import share from '@/lib/share'
import CustomLink from '@/components/Link'

type Props = {
  frontMatter: any
  next: any
  prev: any
  children: React.ReactNode
}

export default function PostLayout({
  frontMatter,
  next,
  prev,
  children,
}: Props) {
  const router = useRouter()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const { date, title, summary, slug, tags } = frontMatter
  const { data } = useSWR<PostMeta>(`/api/blog/meta/${slug}`, fetcher)
  const url = `${siteMetadata.siteUrl}${router.asPath}`

  useEffect(() => {
    const incrementViewCount = () => {
      fetch(`/api/blog/views/${slug}`, {
        method: 'POST',
      }).catch((e) => console.warn(e))
    }

    incrementViewCount()
  }, [slug])

  return (
    <>
      <PostSEO
        title={title}
        summary={summary}
        date={date}
        url={`${siteMetadata.siteUrl}/blog/${slug}`}
        {...frontMatter}
      />
      <article className="selection:bg-orange-300 selection:dark:bg-orange-700 xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
        <div className="relative">
          {/* Sidebar */}
          <div className="fixed top-1/3 -mx-28 hidden h-0 pb-8 xl:block">
            <div className="">
              <div className="flex flex-col items-center py-3 px-6">
                <EyeIcon className="h-9 w-9 text-neutral-900 dark:text-neutral-200" />
                <div className="text-xs">{data?.views ?? <>&nbsp;</>}</div>
              </div>
              <button
                className="block py-3 px-6"
                onClick={() => setShareModalOpen(true)}
              >
                <ShareIcon className="h-9 w-9 text-neutral-900 dark:text-neutral-200" />
                <div className="text-xs">{data?.shares ?? <>&nbsp;</>}</div>
              </button>
            </div>
          </div>
          {/* Blog post with title and author */}
          <div className="relative">
            <header className="space-y-1 pt-6 xl:pb-6">
              <PageTitle>{title}</PageTitle>
              <div className="mt-2 flex w-full flex-col-reverse items-start justify-between md:flex-row md:items-center">
                <div className="flex items-center">
                  <Image
                    alt="John Braat"
                    height={30}
                    width={30}
                    src="/static/img/avatar.webp"
                    sizes="5vw"
                    priority
                    className="rounded-full"
                  />
                  <p className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                    Jonathan Braat /{' '}
                    {dayjs(new Date(date)).format('MMMM DD, YYYY')} ⋅{' '}
                    {frontMatter.readingTime}
                  </p>
                </div>
                <p className="min-w-32 hidden md:block">
                  {tags.map((tag: any) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </p>
              </div>
            </header>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-3xl pt-10 pb-8 dark:prose-dark sm:prose-xl">
                {children}
              </div>
              <Subscribe className="my-20" />
            </div>

            <div>
              {(next || prev) && (
                <nav className="grid grid-cols-2 gap-3 py-4">
                  {prev && (
                    <div className="group col-span-1">
                      <Link href={`/blog/${prev.slug}`}>
                        <div className="flex cursor-pointer flex-col rounded-md border border-gray-400 p-3 text-left transition-all ease-in-out group-hover:border-primary-600 dark:border-gray-700">
                          <div className="text-bold text-sm tracking-wide text-gray-700 dark:text-gray-200">
                            Previous
                          </div>
                          <div className="flex text-primary-500">
                            <span className="mr-1.5">&larr;</span>
                            <span className="flex-1 truncate">
                              {prev.title}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                  {next && (
                    <div className="group col-span-1 col-start-2">
                      <Link href={`/blog/${next.slug}`}>
                        <div className="flex cursor-pointer flex-col rounded-md border border-gray-400 py-3 pr-3 pl-4 text-right transition-all ease-in-out group-hover:border-primary-600 dark:border-gray-700">
                          <div className="text-sm tracking-wide text-gray-700 dark:text-gray-200">
                            Next
                          </div>
                          <div className="flex text-primary-500">
                            <span className="flex-1 truncate">
                              {next.title}
                            </span>
                            <span className="ml-1.5">&rarr;</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                </nav>
              )}
            </div>
          </div>
        </div>
      </article>
      <Modal open={shareModalOpen} setOpen={(val) => setShareModalOpen(val)}>
        <div className="flex flex-col gap-2">
          <div><span>Copy link</span><span>IC</span></div>
          <CustomLink href={share.toTwitter(url, title)}>
            Share to twitter
          </CustomLink>
          <CustomLink href={share.toLinkedIn(url, title, summary)}>
            Share to LinkedIn
          </CustomLink>
          <CustomLink href={share.toReddit(url, title)}>
            Share to Reddit
          </CustomLink>
          <CustomLink href={share.toHackerNews(url, title)}>
            Share to Hacker News
          </CustomLink>
          <CustomLink href={share.toFacebook(url)}>
            Share to Facebook
          </CustomLink>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:col-start-2 sm:text-sm"
            onClick={() => setShareModalOpen(false)}
          >
            Deactivate
          </button>
        </div>
      </Modal>
    </>
  )
}
