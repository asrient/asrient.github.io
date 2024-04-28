import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { getProjectConfigs, getProjectConfig, getProjectIndexPage, nameToProjectId, stripTitleHeading } from '../../lib/projects'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import markdownToHtml from '../../lib/markdownToHtml'
import type ProjectConfigType from '../../interfaces/projectConfig'
import type RouteItem from '../../interfaces/routeItem'
import DocsGrid from '../../components/docs-grid'
import { getDefaultStaticProps } from '../../lib/utils'
import ProjectHero from "../../components/project-hero";
import { downloadUrl } from '../../lib/projectUtils'
import ProjectLanding from '../../components/project-landing'
import { BRAND_NAME } from '../../lib/constants'
import Container from '../../components/container'

type Props = {
  project: ProjectConfigType
  theme: string,
  content: string
}

export default function Project({ project, theme, content }: Props) {
  const router = useRouter()
  const title = `${project.name} — ${project.tagline || BRAND_NAME}`
  if (!router.isFallback && !project?.name) {
    return <ErrorPage statusCode={404} />
  }
  const nextRoutes: RouteItem[] = [];
  if (!!project?.docsPath) {
    nextRoutes.push({
      title: 'Documentation',
      path: `${project.name.toLowerCase()}/docs`,
    } as RouteItem);
  }
  if (!!project?.githubUrl) {
    nextRoutes.push({
      title: 'GitHub',
      path: project.githubUrl,
    } as RouteItem);
  }
  if (!!project?.webAppUrl) {
    nextRoutes.push({
      title: 'Open app',
      path: project.webAppUrl,
    } as RouteItem);
  }
  if (!!project?.showDownloads) {
    nextRoutes.push({
      title: 'Download',
      path: downloadUrl(project),
    } as RouteItem);
  }

  return (
    <>
      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <>
          <Head>
            <title>{title}</title>
            <meta property="og:image" content={project.iconPath} />
          </Head>
          <ProjectHero project={project} theme={theme} />
          <article className="pb-32">
            <ProjectLanding content={content} project={project} theme={theme} />
            {nextRoutes.length > 0 && <Container className='relative z-10'>
              <DocsGrid title="Resources" theme={theme} routes={nextRoutes} />
            </Container>}
          </article>
        </>
      )}
    </>
  )
}

type Params = {
  params: {
    project: string
  }
}

export async function getStaticProps({ params }: Params) {
  const projId = nameToProjectId(params.project);
  if (!projId) {
    throw new Error(`Project ${params.project} not found`);
  }
  const project = getProjectConfig(projId);
  let md = getProjectIndexPage(projId) || '';
  md = stripTitleHeading(md);
  const content = await markdownToHtml(md);

  return {
    props: {
      ...getDefaultStaticProps(),
      project,
      content,
      theme: project.accentColor
    },
  }
}

export async function getStaticPaths() {
  const projects = getProjectConfigs();

  return {
    paths: projects.map((proj) => {
      return {
        params: {
          project: proj.name.toLowerCase(),
        },
      }
    }),
    fallback: false,
  }
}
