import Container from '../components/container'
import { getProjectConfigs } from '../lib/projects'
import Head from 'next/head'
import { BRAND_NAME } from '../lib/constants'
import ProjectConfigType from '../interfaces/projectConfig'
import ProjectLibrary from '../components/projects-library'
import { getDefaultStaticProps } from '../lib/utils'

type Props = {
  theme: string,
  projects: ProjectConfigType[]
}

export default function Index({ theme, projects }: Props) {
  return (
    <>
      <Head>
        <title>{`Projects | Made by ${BRAND_NAME}`}</title>
      </Head>
      <Container>
        <ProjectLibrary projects={projects} theme={theme} />
      </Container>
    </>
  )
}

export const getStaticProps = async () => {

  const projects = getProjectConfigs();
  return {
    props: {
      ...getDefaultStaticProps(),
      projects
    },
  }
}
