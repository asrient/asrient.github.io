import ProjectConfigType from "../interfaces/projectConfig";

export function downloadUrl(proj: ProjectConfigType) {
    return `${proj.githubUrl}/releases/latest/`;
}

function slugifyPath(p: string): string {
    return p.split('/').map(s => s.toLowerCase().replace(/\s+/g, '-')).join('/');
}

export function fixMdLinks(md: string, project?: ProjectConfigType, currentDocPath?: string, baseImageUrl?: string): string {
    const docsPath = project?.docsPath;
    const projectSlug = project?.name?.toLowerCase();
    const githubUrl = project?.githubUrl;
    const defaultBranch = project?.defaultBranch;

    md = md.replace(/(?<!!)\[(.*?)\]\((?!http|#)(.*?)\)/g, (match, p1, p2) => {
        const isAbsolute = p2.startsWith('/');

        if (isAbsolute) {
            const pathWithoutLeadingSlash = p2.slice(1);
            // Absolute path matching /[docsPath]/... → rewrite to /[project]/docs/[slugified path]
            if (docsPath && projectSlug && (pathWithoutLeadingSlash === docsPath || pathWithoutLeadingSlash.startsWith(docsPath + '/'))) {
                const remainder = pathWithoutLeadingSlash.slice(docsPath.length).replace(/^\//, '').replace(/\.md$/, '');
                const slugged = remainder ? '/' + slugifyPath(remainder) : '';
                return `[${p1}](/${projectSlug}/docs${slugged})`;
            }
            // Absolute path not matching docsPath → link to GitHub
            if (githubUrl && defaultBranch) {
                return `[${p1}](${githubUrl}/blob/${defaultBranch}${p2})`;
            }
            return match;
        }

        // Relative link: resolve against currentDocPath to make absolute
        const cleaned = p2.replace(/^\.+\//, '').replace(/\.md$/, '');
        const slugged = slugifyPath(cleaned);
        if (currentDocPath) {
            return `[${p1}](${currentDocPath}/${slugged})`;
        }
        return `[${p1}](${slugged})`;
    });

    // Fix relative image links: resolve against the base URL if provided
    if (baseImageUrl) {
        md = md.replace(/\!\[(.*?)\]\((?!http)(.*?)\)/g, (match, p1, p2) => {
            return `![${p1}](${baseImageUrl}${p2})`;
        });
    }
    return md;
}
