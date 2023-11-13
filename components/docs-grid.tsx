import type RouteItem from '../interfaces/routeItem'
import { themed } from '../lib/utils'
import Link from 'next/link'

type Props = {
  routes: RouteItem[],
  theme: string,
  title?: string
}

const DocsGrid = ({ routes, theme, title }: Props) => {

  const thm = themed(theme);

  return (
    <section className='pt-12 mx-auto max-w-5xl'>
      <hr className='mb-10' />
      <h2 className='h2'>
        {title || 'Read next'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-2 lg:gap-x-3 lg:gap-y-3">
        {routes.map((route) => (
          <Link href={route.path} key={route.path} className={thm`text-base font-light text-gray-600 dark:text-gray-400 px-6 py-8 md:px-8 md:py-10 bg-white/40 dark:bg-neutral-700/40 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:border-transparent rounded-xl border-neutral-200 dark:border-neutral-900 border border-solid`} >
            {route.title}
            </Link>
        ))}
      </div>
    </section>
  )
}

export default DocsGrid
