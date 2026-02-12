import type ProjectConfigType from '../interfaces/projectConfig'
import { themed } from '../lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import SectionTitle from './section-title'

type Props = {
  projects: ProjectConfigType[],
  theme: string
}

const ProjectCardBig = ({ name, title, iconPath, tagline, description, link, accentColor }: ProjectConfigType) => {
  return (
    <div className="w-full flex flex-col justify-start py-12 px-7 md:px-12 bg-accent-4-orange dark:bg-accent-4-orange-dark h-full lg:min-h-[30rem] border-lite">
      <div className="pb-2">
        <Image src={iconPath} height={100} width={100} alt={name + ' project icon'} />
      </div>
      <div className="text-sm text-2">
        <div className="text-3xl font-medium text-black dark:text-white">{title}</div>
      </div>
      <br />
      <div className="text-base text-2 lg:min-h-[7rem]">
        {description || tagline}
      </div>
      <div className='flex pt-4'>
        <Link href={`/${name.toLowerCase()}`} className='buttonPrimaryRound'>
          Learn more
        </Link>
      </div>
    </div>
  )
};

const ProjectsLibrary = ({ projects, theme }: Props) => {

  const thm = themed(theme);

  return (
    <section className='py-4 pt-10 mx-auto max-w-4xl'>
      <SectionTitle>Projects</SectionTitle>
      <div className="flex flex-col md:grid md:grid-cols-2 md:gap-x-3 gap-y-3">
        {projects.map((project) => (
          <ProjectCardBig
            key={project.title}
            {...project}
          />
        ))}
      </div>
    </section>
  )
}

export default ProjectsLibrary
