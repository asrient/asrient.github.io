import 'react'
import type ProjectConfigType from '../../interfaces/projectConfig'
import { MusicroomCard } from './musicroom-card'
import { HomecloudCard } from './homecloud-card'
import { HomenetCard } from './homenet-card'

const CardSwitcher = ({ project }: {
  project: ProjectConfigType
}) => {
  switch (project.name) {
    case 'HomeCloud':
      return <HomecloudCard project={project} />
    case 'homenet':
      return <HomenetCard project={project} />
    default:
      return null;
  };
};

type Props = {
  projects: ProjectConfigType[],
  theme: string
}

const ProjectShowcase = ({ projects, theme }: Props) => {
  return (
    <div className='py-10'>
      {projects.map((project) => (
        <CardSwitcher
          key={project.name}
          project={project}
        />
      ))}
    </div>
  )
}

export default ProjectShowcase
