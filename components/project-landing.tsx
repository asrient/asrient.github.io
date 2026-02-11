import ProjectConfigType from "../interfaces/projectConfig"
import PostBody from "./post-body";
import HomeCloudLanding from "./homecloud/landing";
import Container from "./container";

/*
* Update this component to add a custom landing page for a project.
* 
* The content prop is the markdown content of the project's index.md file.
* The project prop is the project's config object.
* 
* The component will render the appropriate landing page based on the project's name.
*/

const ProjectLanding = ({ content, project, theme }: {
    content: string,
    project: ProjectConfigType,
    theme: string
}) => {
    const name = project.name.toLowerCase();
    switch (name) {
        // case 'homecloud':
        //     return <HomeCloudLanding theme={theme} project={project} />
        default:
            return <Container><PostBody content={content} /></Container>
    }
}

export default ProjectLanding
