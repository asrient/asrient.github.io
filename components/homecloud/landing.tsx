import { motion, useScroll, useTransform, Variants } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Container from "../container";
import Link from "next/link";
import ProjectConfigType from "../../interfaces/projectConfig";
import { downloadUrl } from "../../lib/projectUtils";
import cn from 'classnames';

const fadeIn: Variants = {
    hidden: {
        opacity: 0,
        y: 50,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            delay: 0.3,
        }
    }
};

const SectionCard = ({ children }: {
    children: React.ReactNode
}) => {
    return (<section className="py-5 sm:py-10 mt-[1rem] px-6 md:px-8 lg:px-12 mx-2 flex flex-wrap justify-between items-center border-lite rounded-2xl bg-white/10 dark:bg-gray-900/10">
        {children}
    </section>)
}

const SectionTitle = ({ children }: {
    children: React.ReactNode
}) => {
    return (<h2 className="text-5xl sm:text-6xl font-semibold pb-2">
        {children}
    </h2>)
}

const SectionText = ({ children }: {
    children: React.ReactNode
}) => {
    return (<div className="text-xl dark:text-gray-200/70 text-gray-700/70 font-light">
        {children}
    </div>)
}

const Section1 = () => {
    const zoomIn: Variants = {
        hidden: {
            top: '15rem',
            scale: 2,
            opacity: 0.2,
        },
        visible: {
            top: '0rem',
            scale: 1,
            opacity: 1,
            transition: {
                duration: 1.2,
                delay: 0.2,
            }
        }
    };
    return (<section className="py-10 px-3">
        <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            className="mb-20 mx-auto max-w-3xl text-center"
        >
            <SectionTitle>
                Introducing HomeCloud
            </SectionTitle>

            <SectionText>
                Homecloud is your personal digital content management app designed to streamline your digital life.
                It enables you to manage files, photos, notes, and more across all your storage devices and services.
                No more hassle of switching between different apps or sticking to a single storage provider.
            </SectionText>
        </motion.div>
        <motion.div
            className="relative bg-[url('/assets/img/homecloud/section1-sm.png')] md:bg-[url('/assets/img/homecloud/section1.png')] bg-contain bg-center bg-no-repeat w-full h-[40rem] max-h-[60vh] max-w-[60vw] mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={zoomIn}
        >
        </motion.div>
    </section>)
}

const Section2 = () => {
    const icons = [
        "g-drive.svg",
        "dropbox.svg",
        "webdav.png",
        "nextcloud.svg",
    ]
    const popOut: Variants = {
        hidden: {
            opacity: 0.5,
            scale: 0.7,
            y: 100,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.2,
                type: 'spring',
            }
        }
    };
    return (<SectionCard>
        <div className="max-w-2xl mx-auto">
            <SectionTitle>
                Google Drive, Dropbox, Nextcloud, WebDAV and more.
            </SectionTitle>
            <SectionText>
                Store your data where it makes sense for you.
                You can keep your important files on Google Drive, your photos archive on an external hard drive and so on. And yet, still enjoy the same awesome experience.
            </SectionText>
            <div className="flex items-center pt-8 px-3 space-x-3">
                {icons.map((icon, i) => <Image src={`/assets/img/homecloud/${icon}`} key={icon} className="rounded-2xl w-16 h-16 bg-white" width={50} height={50} alt='app' />)
                }
            </div>
        </div>
        <div className="mx-auto">
            <motion.div
                variants={popOut}
                initial="hidden"
                whileInView="visible"
            >
                <Image src='/assets/img/homecloud/section2.png' className="w-[20rem] max-w-[90vw] h-auto" width={0} height={0} alt='app' />
            </motion.div>
        </div>
    </SectionCard>)
}

const Section3 = () => {

    return (<SectionCard>
        <div className="mx-auto">
            <Image src='/assets/img/homecloud/section3.png' className="w-[14rem] my-5 max-w-[80vw] h-auto" width={0} height={0} alt='app' />
        </div>
        <div className="max-w-2xl mx-auto">
            <SectionTitle>
                Photos. Notes. Not just files.
            </SectionTitle>
            <SectionText>
                Organize your photos, notes from across storages in one place.
                Photos are automatically organized by date and location. And the Notes app let's you organize your notes in a hierarchical structure.
            </SectionText>
        </div>
    </SectionCard>)
}

const Section4 = () => {
    const colorChange: Variants = {
        hidden: {
            color: '#FFA500',
        },
        visible: {
            color: '#3cbb0e',
            transition: {
                duration: 1,
                delay: 1,
                type: 'spring',
            }
        }
    };
    const commonTransition = {
        duration: 1,
        delay: 0.9,
        type: 'spring',
    };
    const visibleToHidden: Variants = {
        hidden: {
            opacity: 1,
            transition: commonTransition,
        },
        visible: {
            opacity: 0,
            transition: commonTransition,
        }
    };
    return (<SectionCard>
        <div className="max-w-4xl py-16 sm:py-20 mx-auto">
            <SectionTitle>
                <motion.div className="mb-2 mx-1 w-10 h-10 relative"
                    variants={colorChange}
                    initial="hidden"
                    whileInView="visible"
                >
                    <motion.div
                        variants={visibleToHidden}
                        className="absolute top-0 left-0 w-full h-full"
                        initial="hidden"
                        whileInView="visible"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                        </svg>
                    </motion.div>
                    <motion.div
                        variants={visibleToHidden}
                        initial="visible"
                        whileInView="hidden"
                        className="absolute top-0 left-0 w-full h-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                            <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9v-3c0-2.9 2.35-5.25 5.25-5.25z" />
                        </svg>
                    </motion.div>
                </motion.div>
                Free your data from vendor lock-in.
            </SectionTitle>
            <SectionText>
                <motion.div variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                >
                    Store your data where it makes sense for you, maintaining ownership and control over your files and content.
                    Seamlessly switch between various storage providers without limitations or commitments.
                </motion.div>
            </SectionText>
        </div>
    </SectionCard>)
}

const Section5 = () => {

    return (<SectionCard>
        <div className="mx-auto">
            <Image src='/assets/img/homecloud/section5.png' className="w-[14rem] my-5 max-w-[80vw] h-auto" width={0} height={0} alt='app' />
        </div>
        <div className="max-w-2xl mx-auto">
            <SectionTitle>
                Upload from any device. Access everywhere.
            </SectionTitle>
            <SectionText>
                Back up your photos from your phone, work on them on your computer. As long as you have access to your storage, you can access your content. Even without HomeCloud app.
            </SectionText>
        </div>
    </SectionCard>)
}

const Section6 = () => {

    return (<SectionCard>
        <div className="mx-auto">
            <Image src='/assets/img/homecloud/section6.png' className="w-[14rem] my-5 max-w-[80vw] h-auto" width={0} height={0} alt='app' />
        </div>
        <div className="max-w-2xl mx-auto">
            <SectionTitle>
                No Sign-ups Required.
            </SectionTitle>
            <SectionText>
                HomeCloud does not rely on any centralized service to work. All your data stays on your existing storage spaces.
                That means no signups, no subscriptions, no usage limits.
                Made possible by a unique syncing algorithm that works without any central database.
            </SectionText>
        </div>
    </SectionCard>)
}

const SelectButton = ({ selected, name, onClick }: {
    selected: boolean,
    name: string,
    onClick: () => void,
}) => {
    return (<button className={`min-w-[4rem] px-3 py-2 rounded-lg ${selected ? 'dark:bg-slate-100/50 dark:text-gray-900 text-gray-100 bg-slate-800/50' : 'hover:bg-slate-500/10'}`} onClick={onClick}>
        {name}
    </button>)
}

const AppsSection = () => {
    const [selected, setSelected] = useState('photos');
    const select = (name: string) => {
        setSelected(name);
    }
    const appIcon = (name: string) => {
        return `/assets/img/homecloud/${name}.png`;
    }
    return (<section className="mt-10 py-6">
        <Container className="max-w-5xl">
            <div className="mb-10 p-1 bg-slate-500/20 flex space-x-2 w-fit rounded-lg text-sm">
                <SelectButton selected={selected === 'photos'} name='Photos' onClick={() => select('photos')} />
                <SelectButton selected={selected === 'notes'} name='Notes' onClick={() => select('notes')} />
                <SelectButton selected={selected === 'files'} name='Files' onClick={() => select('files')} />
            </div>
            <SectionTitle>
                <Image src={appIcon(selected)} className="w-16 h-16" width={0} height={0} alt='app' />
                {selected === 'photos' && 'Photos'}
                {selected === 'notes' && 'Notes'}
                {selected === 'files' && 'Files'}
            </SectionTitle>
            <div className="min-h-[6rem]">
                <SectionText>
                    {selected === 'photos' && `HomeCloud automatically organizes your photos by date and location.
                You can view them by creation date, date added or by their storage location.
                You can also add tags to your photos to organize them better.`}
                    {selected === 'notes' && `HomeCloud's Notes app let's you organize your notes in a hierarchical structure.
                Notes are stored in HTML format, so you can easily export them or view them in a browser.`}
                    {selected === 'files' && `HomeCloud's Files app let's you manage your files across all your storage devices and services and
                move files between them seemlessly. You can also pin folders to your favorites for quick access.`}
                </SectionText>
            </div>

        </Container>

        <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            style={{ backgroundImage: `url('/assets/img/homecloud/${selected}-screen.png')` }}
            className="md:mx-3 my-3 h-[30rem] md:h-[40rem] lg:h-[50rem] w-full bg-cover md:bg-contain bg-no-repeat bg-left md:bg-center">
        </motion.div>
    </section>)
}

const DownloadCard = ({ name, description, url, color }: {
    name: string,
    description: string,
    url: string,
    color?: 'blue' | 'purple',
}) => {
    let className = '';
    switch (color) {
        case 'blue':
            className = 'bg-blue-200/60 dark:bg-blue-900/60';
            break;
        case 'purple':
            className = 'bg-purple-200/60 dark:bg-purple-900/60';
            break;
        default:
            className = 'dark:bg-zinc-800 bg-zinc-100/60';
            break;
    }
    return (<div className={cn("px-8 py-8 border-lite rounded-md flex flex-col items-center md:items-baseline", className)}>
        <h3 className="text-2xl font-semibold">
            {name}
        </h3>
        <div className="text-sm opacity-60 font-light">
            {description}
        </div>
        <Link href={url} className="buttonPrimaryRound mt-8">
            Download
        </Link>
    </div>)
}

const CtaSection = ({ project }: {
    project: ProjectConfigType,
}) => {
    const downloadLink = downloadUrl(project);

    return (<Container className="py-10 px-3">
        <div className="max-w-5xl mx-auto">
            <SectionTitle>
                Available in many forms and sizes.
            </SectionTitle>
            <SectionText>
                Choose the version that best suits your needs.
            </SectionText>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 space-y-2 md:space-y-0 md:space-x-3">
                <DownloadCard name="HomeCloud Desktop"
                    description="For Windows, Linux and macOS."
                    color="blue"
                    url={downloadLink} />
                <DownloadCard name="HomeCloud Server"
                    color="purple"
                    description="For self-hosted web version."
                    url={downloadLink} />
            </div>
            <div className="mt-2 md:mt-3 py-8 px-6 border-lite rounded-md dark:bg-zinc-900/10 bg-zinc-100/10">
                <h3 className="flex flex-col items-center">
                    <div className="text-2xl font-semibold">
                        Try out HomeCloud in your browser.
                    </div>
                    <div className="text-sm opacity-60">
                        You can just use our public instance which runs HomeCloud Server version for free.
                    </div>
                    <Link href={project.webAppUrl || '/'} className="buttonPrimaryRound mt-8">
                        Open
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-1 w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                    </Link>
                </h3>
            </div>
        </div>
    </Container>)
}

const HomeCloudLanding = ({ theme, project }: {
    theme: string,
    project: ProjectConfigType,
}) => {
    const { scrollYProgress } = useScroll();

    const opacity = useTransform(
        scrollYProgress,
        [0, 0.2, 0.35, 0.5, 0.8, 0.9, 1],
        [0.2, 0.7, 0.6, 0.8, 0.7, 0.5, 0],
    );

    const y1 = useTransform(
        scrollYProgress,
        [0, 0.2, 0.5, 0.65, 1],
        ['30rem', '26rem', '19rem', '20rem', '5rem',],
    );

    const y2 = useTransform(
        scrollYProgress,
        [0, 0.3, 0.5, 0.7, 1],
        ['25rem', '30rem', '20rem', '0rem', '16rem',],
    );

    const x1 = useTransform(
        scrollYProgress,
        [0, 0.3, 0.5, 0.8, 1],
        ['0%', '40%', '50%', '28%', '80%',],
    );

    const x2 = useTransform(
        scrollYProgress,
        [0, 0.4, 0.5, 0.6, 1],
        ['80%', '10%', '50%', '0%', '40%'],
    );

    return (<div>
        <motion.div style={{ opacity, y: y1, x: x1 }}
            className='fixed z-0 top-[2rem] left-[5%] md:left-[25%] h-[10rem] w-[20rem] dark:bg-orange-600/50 bg-orange-400/70 blur-3xl'>
        </motion.div>
        <motion.div
            style={{ opacity, y: y2, x: x2 }}
            className='fixed z-0 top-[5rem] left-[0%] md:left-[30%] h-[10rem] w-[28rem] dark:bg-blue-600/40 bg-blue-400/50 blur-3xl'>
        </motion.div>
        <div className='relative z-10'>
            <Section1 />
            <Section2 />
            <div className='lg:grid grid-cols-2 flex flex-col'>
                <Section3 />
                <Section4 />
                <Section5 />
                <Section6 />
            </div>
            <AppsSection />
            <CtaSection project={project} />
        </div>
    </div>)
}

export default HomeCloudLanding
