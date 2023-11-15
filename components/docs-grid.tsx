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
    <section className='pt-12 mx-auto max-w-5xl relative z-10'>
      <hr className='mb-10' />
      <h2 className='h2'>
        {title || 'Read next'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-2 lg:gap-x-3 lg:gap-y-3">
        {routes.map((route) => (
          <Link href={route.path} key={route.path} className={thm`text-base font-light text-gray-900/60 dark:text-white/50 px-6 py-8 md:px-8 md:py-10 bg-white/40 dark:bg-neutral-700/40 hover:bg-neutral-500/10 dark:hover:bg-white/10 hover:border-transparent rounded-xl border-neutral-500/30 border border-solid`} >
            {route.title}
          </Link>
        ))}
      </div>
    </section>
  )
}

export default DocsGrid
