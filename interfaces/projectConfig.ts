
type ProjectConfigType = {
    name: string,
    title: string,
    slug: string,
    tagline: string,
    description: string,
    githubUrl: string,
    link: string,
    defaultBranch: string,
    topics: string[],
    iconPath: string | null,
    repoIconPath: string | null,
    accentColor: string,
    docsPath: string,
    dirName: string,
    showDownloads: boolean,
    latestVersion: string | null,
    webAppUrl: string | null,
}

export default ProjectConfigType
