import type ProjectConfigType from '../interfaces/projectConfig';
import type RouteItem from '../interfaces/routeItem';
import { downloadUrl } from '../lib/projectUtils';
import DocsGrid from './docs-grid';
import Container from './container';

function getProjectResources(project: ProjectConfigType): RouteItem[] {
    const routes: RouteItem[] = [];
    if (project.docsPath) {
        routes.push({
            title: 'Documentation',
            path: `${project.name.toLowerCase()}/docs`,
        } as RouteItem);
    }
    if (project.githubUrl) {
        routes.push({
            title: 'GitHub',
            path: project.githubUrl,
        } as RouteItem);
    }
    if (project.webAppUrl) {
        routes.push({
            title: 'Open app',
            path: project.webAppUrl,
        } as RouteItem);
    }
    if (project.showDownloads) {
        routes.push({
            title: 'Download',
            path: downloadUrl(project),
        } as RouteItem);
    }
    return routes;
}

const ProjectResources = ({ project, theme, className }: { project: ProjectConfigType; theme: string; className?: string }) => {
    const routes = getProjectResources(project);
    if (routes.length === 0) return null;
    return (
        <Container className="relative z-10">
            <DocsGrid title="Resources" theme={theme} routes={routes} className={className} />
        </Container>
    );
};

export default ProjectResources;
