
export type DownloadLinks = {
    macAppStore?: string,
    appStore?: string,
    playStore?: string,
    msStore?: string,
    macosArm64?: string,
    macosX64?: string,
    windowsExe?: string,
    linuxDeb?: string,
}

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
    customDownloadPage: boolean,
    customLanding: boolean,
    latestVersion: string | null,
    webAppUrl: string | null,
    downloadLinks: DownloadLinks,
}

export default ProjectConfigType
