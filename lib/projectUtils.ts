import ProjectConfigType from "../interfaces/projectConfig";

export function downloadUrl(proj: ProjectConfigType) {
    return `${proj.githubUrl}/releases/latest/`;
}
