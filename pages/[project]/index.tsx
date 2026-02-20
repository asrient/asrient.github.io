import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { getProjectConfigs, getProjectConfig, getProjectIndexPage, nameToProjectId, stripTitleHeading } from '../../lib/projects'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import markdownToHtml from '../../lib/markdownToHtml'
import type ProjectConfigType from '../../interfaces/projectConfig'
import { getDefaultStaticProps } from '../../lib/utils'
import ProjectHero from "../../components/project-hero";
import { fixMdLinks } from '../../lib/projectUtils'
import ProjectLanding from '../../components/project-landing'
import { BRAND_NAME } from '../../lib/constants'
import ProjectResources from '../../components/project-resources'
import HomeCloudLanding from '../../components/homecloud/landing'

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
  const isCustomLanding = !!project.customLanding;

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
          {isCustomLanding ? (
            <HomeCloudLanding theme={theme} project={project} />
          ) : (
            <>
              <ProjectHero project={project} theme={theme} />
              <article className="pb-32">
                <ProjectLanding content={content} project={project} theme={theme} />
                <ProjectResources project={project} theme={theme} />
              </article>
            </>
          )}
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
  md = fixMdLinks(md, project, `/${project.name.toLowerCase()}`);
  const content = await markdownToHtml(md);

  return {
    props: {
      ...getDefaultStaticProps(),
      project,
      content,
      theme: project.accentColor,
      fullWidth: !!project.customLanding,
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
