import Container from './container'
import { BRAND_NAME, SITE_GITHUB_URL, FOOTER_TEXT, FOOTER_LINKS } from '../lib/constants'
import ProjectConfigType from '../interfaces/projectConfig'
import RouteItem from '../interfaces/routeItem'
import { themed } from '../lib/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DateFormatter from './date-formatter'

const Footer = ({ theme, project, currentDoc, lastUpdatedOn }: {
  theme: string;
  project?: ProjectConfigType;
  currentDoc?: RouteItem;
  lastUpdatedOn?: string;
}) => {
  const thm = themed(theme);

  const [date, setDate] = useState(lastUpdatedOn?.toString() || '');

  useEffect(() => {
    console.log('Site last built date:', lastUpdatedOn)
    setDate(new Date(lastUpdatedOn || 0).toISOString());
  }, []);

  return (
    <footer className={thm`$bg-accent-5 dark:$bg-accent-5 border-color-lite border-t pt-12 pb-4`}>
      <Container className='max-w-5xl'>
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between">
          <h3 className="text-3xl font-bold tracking-tighter leading-tight text-center lg:text-left mt-5 lg:mt-0 lg:mb-0 lg:pr-4 lg:w-1/2">
            <div className='flex flex-row justify-center items-center md:justify-start'>
              <Link href={project ? `/${project.name.toLowerCase()}` : "/"}>
                <Image
                  src={project?.iconPath || "/assets/icon/logo.svg"}
                  width={40}
                  height={40}
                  className='inline-block mr-3'
                  alt="Logo - Rainbow"
                />
                <span>{project?.title || BRAND_NAME}</span>
              </Link>
            </div>
          </h3>
          <div className="flex justify-center items-center lg:justify-end lg:w-1/2 text-sm font-light">
            {!!currentDoc && currentDoc.githubUrl ? <a
              target='_blank'
              href={currentDoc.githubUrl}
              className={thm`hover:bg-white/30 dark:hover:bg-black/30 $text-accent-1 dark:$text-accent-2 border $border-accent-1 dark:$border-accent-2 py-2 px-3 lg:px-4 duration-200 transition-colors mb-6 lg:mb-0`}
            >
              Edit this page on GitHub
            </a> :
              <a href={SITE_GITHUB_URL} target='_blank' className='dark:text-white/40 text-gray-700/80 underline hidden lg:inline'>
                Statically generated using Next.js
              </a>
            }
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-center lg:justify-between text-center items-center text-sm font-light dark:text-white/40 text-gray-700/80 pt-4">
          <div>
            <span>{FOOTER_TEXT}</span>
            <span>&nbsp;Last updated on <DateFormatter dateString={date} /></span>
          </div>
          <div className='flex flex-row mt-2 lg:mt-0'>
            {
              FOOTER_LINKS.map((link, index) => (
                <Link className={`text-blue-500 ${index !== 0 ? 'ml-3' : ''}`} href={link.LINK} key={link.LINK + link.NAME}>{link.NAME}</Link>))
            }
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
