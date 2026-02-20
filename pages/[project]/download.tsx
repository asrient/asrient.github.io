import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'
import { useEffect } from 'react'
import { getProjectConfigs, getProjectConfig, nameToProjectId } from '../../lib/projects'
import type ProjectConfigType from '../../interfaces/projectConfig'
import { getDefaultStaticProps } from '../../lib/utils'
import { BRAND_NAME } from '../../lib/constants'
import HCDownloadPage from '../../components/homecloud/hc-download-page'

type Props = {
    project: ProjectConfigType
    theme: string
}

function DownloadContent({ project }: { project: ProjectConfigType }) {
    switch (project.name.toLowerCase()) {
        case 'homecloud':
            return <HCDownloadPage project={project} />
        default:
            return null
    }
}

export default function DownloadPage({ project, theme }: Props) {
    const router = useRouter()

    useEffect(() => {
        if (!project?.customDownloadPage && project?.name) {
            router.replace(`/${project.name.toLowerCase()}`)
        }
    }, [project, router])

    if (!router.isFallback && !project?.name) {
        return <ErrorPage statusCode={404} />
    }

    if (!project.customDownloadPage) {
        return null
    }

    const title = `Download ${project.name} — ${BRAND_NAME}`

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta property="og:image" content={project.iconPath} />
            </Head>
            <DownloadContent project={project} />
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

    return {
        props: {
            ...getDefaultStaticProps(),
            project,
            theme: project.accentColor,
        },
    }
}

export async function getStaticPaths() {
    const projects = getProjectConfigs();

    return {
        paths: projects.map((proj) => ({
            params: {
                project: proj.name.toLowerCase(),
            },
        })),
        fallback: false,
    }
}
