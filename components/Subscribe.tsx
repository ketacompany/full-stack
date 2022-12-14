import React from 'react'
import { useState, useRef } from 'react'
import { Form, FormState } from 'lib/types'
import SuccessMessage from 'components/SuccessMessage'
import ErrorMessage from 'components/ErrorMessage'
import LoadingSpinner from 'components/LoadingSpinner'
import siteMetadata from '@/data/siteMetadata'
import CustomLink from '@/components/Link'
import classNames from 'classnames'

type Props = {
  className?: string
}

export default function Subscribe({ className }: Props) {
  const [form, setForm] = useState<FormState>({ state: Form.Initial })
  const ref = useRef<HTMLInputElement>(null)

  const subscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (ref?.current) {
      setForm({ state: Form.Loading })

      const email = ref.current.value
      const res = await fetch(`/api/newsletter/subscribers?email=${email}`, {
        method: 'POST',
      })

      const { error } = await res.json()
      if (error) {
        setForm({
          state: Form.Error,
          message: error,
        })
        return
      }

      ref.current.value = ''
      setForm({
        state: Form.Success,
        message: `Hooray! You're now on the list.`,
      })
    }
  }

  return (
    <div
      className={classNames(
        'my-4 w-full rounded-md border-2 border-2 border-primary-400 bg-neutral-100 p-6 dark:border-primary-700 dark:bg-gray-800',
        className,
      )}
    >
      <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100 md:text-xl">
        Subscribe to my newsletter
      </p>
      <p className="my-1 text-neutral-700 dark:text-neutral-200">
        Get notifications about new personal development and SaaS blog posts.
      </p>
      <form className="relative my-4" onSubmit={subscribe}>
        <input
          ref={ref}
          aria-label="Email for newsletter"
          placeholder="coolperson@email.com"
          type="email"
          autoComplete="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-2 pr-32 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100"
        />
        <button
          className="absolute right-1 top-1 flex h-8 items-center justify-center rounded border-2 bg-gray-100 px-4 font-medium text-gray-900 hover:border-primary-400 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100 hover:dark:border-primary-400"
          type="submit"
        >
          {form.state === Form.Loading ? <LoadingSpinner /> : 'Subscribe'}
        </button>
      </form>
      {form.state === Form.Error ? (
        <ErrorMessage>{form.message}</ErrorMessage>
      ) : form.state === Form.Success ? (
        <SuccessMessage>{form.message}</SuccessMessage>
      ) : (
        <p className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-200 hover:dark:text-neutral-50">
          <CustomLink href={siteMetadata.revue}>View all issues</CustomLink>
        </p>
      )}
    </div>
  )
}
