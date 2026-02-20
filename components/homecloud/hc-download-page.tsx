import Container from '../container'
import HCDownload from './hc-download'
import ProjectConfigType from '../../interfaces/projectConfig'

const HCDownloadPage = ({ project }: { project: ProjectConfigType }) => {
    return (
        <section className="py-16 md:py-24 px-4">
            <Container className="max-w-7xl">
                <HCDownload project={project} title={`Download ${project.name}`} />
            </Container>
        </section>
    )
}

export default HCDownloadPage
