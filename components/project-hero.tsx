import ProjectConfigType from "../interfaces/projectConfig";
import Image from "next/image";
import { themed } from "../lib/utils";
import Link from "next/link";
import { downloadUrl } from "../lib/projectUtils";

const Buttons = ({ project, theme }: {
    project: ProjectConfigType,
    theme: string
}) => {
    const { showDownloads, webAppUrl } = project;
    const thm = themed(theme);
    const cls = thm`buttonPrimaryRound $bg-accent-4 dark:$bg-accent-4 border-transparent dark:border-transparent`;
    return (
        <div className='pt-10 px-3 flex items-center space-x-4'>
            {
                webAppUrl && <Link href={webAppUrl} target='_blank' className={cls}>
                    Try it out
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-1 w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                </Link>
            }
            {
                showDownloads && <Link href={downloadUrl(project)} className={cls}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download
                </Link>
            }
            {
                !showDownloads && !webAppUrl && !!project.githubUrl &&
                <Link href={project.githubUrl} target='_blank' className={cls}>
                    Github
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-1 w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                </Link>
            }
            {
                (!showDownloads || !webAppUrl) && !!project.docsPath &&
                <Link href={`/${project.name.toLowerCase()}/docs`} className={cls}>
                    Read docs
                </Link>
            }
        </div>
    )
}

interface Props {
    project: ProjectConfigType
    theme: string
}

export default function ProjectHero({ project, theme }: Props) {
    const thm = themed(theme);

    return (
        <div className='px-3'>
            <div className={thm`py-5 my-10 mx-auto max-w-8xl $bg-accent-1 dark:$bg-accent-1 border-2 border-white/10 rounded-md project-hero-texture relative z-10`}>
                <div className='max-w-3xl mx-auto min-h-[40vh] md:min-h-[30rem] flex items-center'>
                    <div className={thm`py-6 md:py-12 px-6 $text-accent-5 dark:$text-accent-5`}>
                        {
                            project.latestVersion && <div className={thm`mb-3 text-xs font-medium px-3 py-[0.3rem] rounded-full border $border-accent-4 dark:$border-accent-4 w-max`}>
                                {project.latestVersion}
                            </div>
                        }
                        <div className='mb-5 flex items-center'>
                            {project.iconPath &&
                                <Image src={project.iconPath}
                                    alt={`${project.name} icon`}
                                    height={0}
                                    width={0}
                                    className='h-11 w-11 mr-3' />}
                            <div className='text-white dark:text-zinc-800 text-3xl font-light'>
                                {project.title}
                            </div>
                        </div>

                        <h1 className={thm`font-poppins text-4xl md:text-5xl lg:text-6xl font-medium text-left`}>
                            {project.tagline}
                        </h1>
                        <Buttons project={project} theme={theme} />
                    </div>
                </div>
            </div>
        </div>)
}
