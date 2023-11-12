import ProjectConfigType from "../interfaces/projectConfig"
import PostBody from "./post-body";
import HomeCloudLanding from "./homecloud/landing";

/*
* Update this component to add a custom landing page for a project.
* 
* The content prop is the markdown content of the project's index.md file.
* The project prop is the project's config object.
* 
* The component will render the appropriate landing page based on the project's name.
*/

const ProjectLanding = ({ content, project }: {
    content: string,
    project: ProjectConfigType,
}) => {
    const name = project.name.toLowerCase();
    switch (name) {
        case 'homecloud':
            return <HomeCloudLanding />
        default:
            return <PostBody content={content} />
    }
}

export default ProjectLanding
