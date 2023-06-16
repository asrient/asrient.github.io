import ProjectCard from './project-card'
import type ProjectConfigType from '../interfaces/projectConfig'
import { themed } from '../lib/utils'
import Link from 'next/link'

type Props = {
  projects: ProjectConfigType[],
  theme: string
}

const ProjectShowcase = ({ projects, theme }: Props) => {

  const thm = themed(theme);


  return (
    <section className='pt-10 pb-20 mx-auto max-w-5xl'>
      <div className={thm`p-2 py-7 md:pb-8 md:px-6 rounded-2xl border-dashed $border-accent-2 dark:$border-accent-3 border-2 $bg-accent-4 dark:$bg-accent-4`}>
      <h2 className='h2'>
        Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-x-3 gap-y-3 md:gap-y-0">
        {projects.map((project) => (
          <ProjectCard
            key={project.name}
            name={project.name}
            iconPath={project.iconPath}
            tagline={project.tagline}
            link={`/${project.name.toLowerCase()}`}
            accentColor = {project.accentColor}
          />
        ))}
      </div>
      <div className='flex justify-center pt-7'>
        <Link href='/projects' className='buttonPrimaryRound'>
          View All
          </Link>
      </div>
      </div>
    </section>
  )
}

export default ProjectShowcase
