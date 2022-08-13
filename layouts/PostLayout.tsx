import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/future/image'
import dayjs from 'dayjs'
import useSWR from 'swr'
import isMobile from 'is-mobile'
import CopyToClipboard from 'react-copy-to-clipboard'
import { CheckIcon } from '@heroicons/react/solid'
import { ClipboardCopyIcon, EyeIcon, ShareIcon } from '@heroicons/react/outline'
import { PostSEO } from '@/components/SEO'
import ShareToSocialLink from '@/components/ShareToSocialLink'
import ShareViaButton from '@/components/ShareViaButton'
import Modal from '@/components/Modal'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import Subscribe from '@/components/Subscribe'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { PostMeta } from '@/lib/types'
import fetcher from '@/lib/fetcher'
import share from '@/lib/share'

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
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
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

  const onSetShareModalState = (open: boolean) => {
    if (open) setCopiedToClipboard(false)
    setShareModalOpen(open)
  }

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
        <div className="xl:relative">
          {/* Sidebar */}
          <div className="fixed bottom-1 inset-x-0 mx-auto flex justify-center lg:inset-auto lg:top-1/3 lg:-mx-28 lg:h-0 lg:pb-8 z-20">
            <div className="flex justify-center gap-4 px-6 py-2 text-neutral-600 dark:text-neutral-300 lg:px-0 lg:py-0 bg-neutral-100 dark:bg-neutral-800 shadow-xl rounded-md lg:rounded-none lg:bg-none lg:block">
              <div className="flex gap-1 lg:flex-col items-center lg:py-3 lg:px-6">
                <EyeIcon className="h-7 w-7 lg:h-9 lg:w-9 " />
                <div className="text-xs">{data?.views ?? <>&nbsp;</>}</div>
              </div>
              <button
                className="flex gap-1 lg:flex-col items-center lg:py-3 lg:px-6"
                onClick={() => onSetShareModalState(true)}
              >
                <ShareIcon className="h-7 w-7 lg:w-9 lg:h-9" />
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
      <Modal
        className="px-2 pt-2 pb-2 sm:my-6 sm:px-3 sm:py-2 max-w-xs w-full"
        open={shareModalOpen}
        setOpen={(val) => onSetShareModalState(val)}
      >
        <div className="flex flex-col">
          <CopyToClipboard
            text={url}
            onCopy={() => setCopiedToClipboard(true)}
          >
            <button className="flex justify-between items-center text-left p-2 font-bold hover:text-sky-600">
              <span>Copy link</span>
              <ClipboardCopyIcon className="h-5 w-5" />
            </button>
          </CopyToClipboard>
          {copiedToClipboard && (
            <div className="flex justify-center items-center py-1 bg-green-100 text-green-900 dark:bg-teal-700 dark:text-emerald-100 font-semibold rounded-md">
              Copied to Clipboard <CheckIcon className="ml-2 h-5 w-5"/>
            </div>
          )}
          {isMobile() && <ShareViaButton shareData={{ url }} />}
          <ShareToSocialLink
            className="hidden sm:block"
            href={share.toTwitter(url, title)}
          >
            Share to Twitter
          </ShareToSocialLink>
          <ShareToSocialLink
            className="hidden sm:block"
            href={share.toLinkedIn(url, title, summary)}
          >
            Share to LinkedIn
          </ShareToSocialLink>
          <ShareToSocialLink
            className="hidden sm:block"
            href={share.toReddit(url, title)}
          >
            Share to Reddit
          </ShareToSocialLink>
          <ShareToSocialLink
            className="hidden sm:block"
            href={share.toHackerNews(url, title)}
          >
            Share to Hacker News
          </ShareToSocialLink>
          <ShareToSocialLink
            className="hidden sm:block"
            href={share.toFacebook(url)}
          >
            Share to Facebook
          </ShareToSocialLink>
        </div>
      </Modal>
    </>
  )
}
