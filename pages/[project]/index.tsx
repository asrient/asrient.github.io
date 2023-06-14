import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import { getProjectConfigs, getProjectConfig, getProjectIndexPage, nameToProjectId } from '../../lib/projects'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { BRAND_NAME } from '../../lib/constants'
import markdownToHtml from '../../lib/markdownToHtml'
import type ProjectConfigType from '../../interfaces/projectConfig'
import type RouteItem from '../../interfaces/routeItem'
import DocsGrid from '../../components/docs-grid'
import { getDefaultStaticProps } from '../../lib/utils'

type Props = {
  project: ProjectConfigType
  theme: string,
  content: string
}

export default function Project({ project, theme, content }: Props) {
  const router = useRouter()
  const title = `${project.name} — ${project.tagline}`
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
  return (
    <Container>
      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <>
          <article className="pb-32">
            <Head>
              <title>{title}</title>
              <meta property="og:image" content={project.iconPath} />
            </Head>
            <div className='pt-16'></div>
            <PostBody content={content} />
            {nextRoutes.length > 0 && <DocsGrid title="Resources" theme={theme} routes={nextRoutes} />}
          </article>
        </>
      )}
    </Container>
  )
}

type Params = {
  params: {
    project: string
  }
}

export async function getStaticProps({ params }: Params) {
  const projId = nameToProjectId(params.project);
  const project = getProjectConfig(projId);
  const content = await markdownToHtml(getProjectIndexPage(projId) || '');

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
