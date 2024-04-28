import Container from '../components/container'
import MoreStories from '../components/more-stories'
import Intro from '../components/home/intro'
import { getAllPosts } from '../lib/api'
import { getProjectConfigs } from '../lib/projects'
import Head from 'next/head'
import { BRAND_NAME } from '../lib/constants'
import Post from '../interfaces/post'
import ProjectConfigType from '../interfaces/projectConfig'
import ProjectShowcase from '../components/home/projects-showcase'
import { getDefaultStaticProps } from '../lib/utils'
import Header from '../components/header'
import Contacts from '../components/contacts'

type Props = {
  allPosts: Post[],
  theme: string,
  projects: ProjectConfigType[]
}

export default function Index({ allPosts, theme, projects }: Props) {
  return (
    <>
      <Head>
        <title>{`${BRAND_NAME} | Personal Site`}</title>
      </Head>
      <div className='dark'>
      <Header theme={theme} style={{ position: 'absolute', backgroundColor: 'transparent'}} />
      </div>
      
      <Intro theme={theme} />
      {projects.length > 0 && <ProjectShowcase projects={projects} theme={theme} />}
      <Container>
        {allPosts.length > 0 && <MoreStories title="Latest posts" posts={allPosts} />}
      </Container>
      <Contacts />
    </>
  )
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ]).splice(0, 4);

  const projects = getProjectConfigs(3);

  return {
    props: {
      ...getDefaultStaticProps(),
      showHeader: false,
      theme: 'monochrome',
      allPosts,
      projects,
      fullWidth: true,
    },
  }
}
