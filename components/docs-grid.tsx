import ProjectCard from './project-card'
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
        {title || 'Read Next'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-2 md:gap-x-3 md:gap-y-3">
        {routes.map((route) => (
          <Link href={route.path} key={route.path} className={thm`text-base font-medium text-gray-500 dark:text-gray-300 px-4 py-6 md:px-8 md:py-6 hover:bg-white dark:hover:bg-neutral-800 hover:border-transparent rounded-xl $border-accent-4 dark:$border-accent-4 border-2 border-solid`} >
            {route.title}
            </Link>
        ))}
      </div>
    </section>
  )
}

export default DocsGrid
