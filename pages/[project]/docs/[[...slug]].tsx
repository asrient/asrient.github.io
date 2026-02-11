import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../../components/container'
import PostBody from '../../../components/post-body'
import { getRouteFromSlug, getAllDocsPaths, getProjectConfig, fetchMd } from '../../../lib/projects'
import Head from 'next/head'
import markdownToHtml from '../../../lib/markdownToHtml'
import type ProjectConfigType from '../../../interfaces/projectConfig'
import RouteItem from '../../../interfaces/routeItem'
import { Suspense } from 'react';
import DocsGrid from '../../../components/docs-grid'
import { getDefaultStaticProps, toTitleCase } from '../../../lib/utils'

type Props = {
  project: ProjectConfigType
  theme: string,
  currentDoc: RouteItem,
  docsConfig: RouteItem,
  content: string
}

export default function Doc({ project, theme, content, currentDoc }: Props) {
  const router = useRouter();
  const title = `${currentDoc?.title} | ${project?.name} Docs`

  if (!router.isFallback && (!project?.name || !currentDoc?.title)) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:image" content={project?.iconPath} />
      </Head>
      <Container>
        {/* No fallback UI so need to be careful not to suspend directly inside. */}
        <Suspense fallback={null}>
          <article className="pb-32 pt-16">
            <PostBody content={content} />
            {currentDoc.routes.length > 0 && <DocsGrid theme={theme} routes={currentDoc.routes} />}
          </article>
        </Suspense>
      </Container>
    </>
  )
}

type Params = {
  params: {
    slug: string[],
    project: string
  }
}

export async function getStaticProps({ params }: Params) {
  let slug = `/${params.project}/docs`;
  if (params.slug) {
    slug += `/${params.slug.join('/')}`;
  }
  console.log('slug', slug, params)
  try {
    const { projectId, currentDoc, docsConfig } = getRouteFromSlug(slug);
    //console.log('projectId', projectId, currentDoc, docsConfig)
    if (!projectId || !currentDoc) {
      throw new Error('Invalid slug');
    }
    const project = getProjectConfig(projectId);

    const defaultText = `# ${toTitleCase(currentDoc?.title || projectId)} \n Select a topic from below to continue reading.`;

    // For directory indexes (README-based), resolve relative links within the directory.
    // For leaf pages, resolve relative links against the parent directory.
    const isDirectoryIndex = currentDoc?.mdUrl?.toLowerCase().endsWith('readme.md');
    const baseDocPath = isDirectoryIndex
      ? currentDoc?.path
      : currentDoc?.path?.substring(0, currentDoc.path.lastIndexOf('/'));

    const content = await markdownToHtml((await fetchMd(currentDoc?.mdUrl, project, baseDocPath)) || defaultText);

    return {
      props: {
        ...getDefaultStaticProps(),
        project,
        currentDoc,
        docsConfig,
        theme: project.accentColor,
        content
      },
    }
  } catch (e) {
    console.error(e);
    return {
      props: {
        ...getDefaultStaticProps(),
        project: null,
        currentDoc: null,
        docsConfig: null,
        theme: 'orange',
        content: ''
      },
    }
  }

}

export async function getStaticPaths() {
  const paths: any = getAllDocsPaths().map(path => {
    //console.log('path', path, path.split('/').splice(3), path.split('/')[1]);
    return {
      params: {
        slug: path.split('/').splice(3),
        project: path.split('/')[1]
      },
    }
  });
  return {
    paths,
    fallback: false,
  }
}
