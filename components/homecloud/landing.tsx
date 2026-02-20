import { motion, useScroll, useTransform, Variants } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Container from "../container";
import Link from "next/link";
import ProjectConfigType from "../../interfaces/projectConfig";
import { detectPlatform, UserPlatform } from "../../lib/utils";
import { getBestCta, getOtherPlatforms, type HeroCta } from "../../lib/downloads";
import { downloadUrl } from "../../lib/projectUtils";
import cn from 'classnames';

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.8, delay: 0.15 },
    },
};

const slideUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.9, delay: 0.25 },
    },
};

/* ─── Hero Device Parallax (small screens) ─── */
const HeroDevicesParallax = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const yPc = useTransform(scrollYProgress, [0, 0.5, 1], [0, 25, 25]);
    const yMacbook = useTransform(scrollYProgress, [0, 0.5, 1], [0, -100, -100]);
    const yIpad = useTransform(scrollYProgress, [0, 0.5, 1], [0, -220, -260]);
    const yIphone = useTransform(scrollYProgress, [0, 0.5, 1], [0, -360, -380]);

    const scalePc = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1]);
    const scaleMacbook = useTransform(scrollYProgress, [0, 0.5, 1], [1.25, 1, 1]);
    const scaleIpad = useTransform(scrollYProgress, [0, 0.5, 1], [1.4, 1, 1]);
    const scaleIphone = useTransform(scrollYProgress, [0, 0.5, 1], [1.55, 1, 1]);

    return (
        <div ref={ref} className="w-full md:hidden flex flex-col items-center mt-8 -mb-[82%]">
            {/* PC - largest, full width */}
            <motion.div
                style={{ y: yPc, scale: scalePc }}
                className="w-[90%] z-[1]"
            >
                <Image
                    src="/assets/img/homecloud/hero-frames/pc.png"
                    width={800} height={600}
                    alt="Desktop"
                    className="w-full h-auto drop-shadow-2xl"
                />
            </motion.div>
            {/* MacBook - overlaps PC, centered */}
            <motion.div
                style={{ y: yMacbook, scale: scaleMacbook }}
                className="w-[86%] z-[2] -mt-[10%]"
            >
                <Image
                    src="/assets/img/homecloud/hero-frames/macbook.png"
                    width={800} height={600}
                    alt="MacBook"
                    className="w-full h-auto drop-shadow-2xl"
                />
            </motion.div>
            {/* iPad - overlaps MacBook, centered */}
            <motion.div
                style={{ y: yIpad, scale: scaleIpad }}
                className="w-[60%] z-[3] mt-[8%]"
            >
                <Image
                    src="/assets/img/homecloud/hero-frames/ipad.png"
                    width={800} height={600}
                    alt="iPad"
                    className="w-full h-auto drop-shadow-2xl"
                />
            </motion.div>
            {/* iPhone - smallest, overlaps iPad, centered */}
            <motion.div
                style={{ y: yIphone, scale: scaleIphone }}
                className="w-[30%] z-[4] mt-[10%] self-center"
            >
                <Image
                    src="/assets/img/homecloud/hero-frames/iphone.png"
                    width={800} height={600}
                    alt="iPhone"
                    className="w-full h-auto drop-shadow-2xl"
                />
            </motion.div>
        </div>
    );
};

/* ─── Logo ─── */
/* ─── Hero subtext builder ─── */
function getHeroSubtext(project: ProjectConfigType, platform: UserPlatform): React.ReactNode {
    const dl = project.downloadLinks || {};
    const downloadPageUrl = downloadUrl(project);
    const others = getOtherPlatforms(dl, platform.os);

    if (others.length > 0) {
        // Format as "x, y and z"
        const formatted = others.length > 1
            ? others.slice(0, -1).join(', ') + ' and ' + others[others.length - 1]
            : others[0];
        return (
            <Link href={downloadPageUrl} className="underline hover:text-neutral-700 dark:hover:text-neutral-300">
                Also available for {formatted}.
            </Link>
        );
    }

    return (
        <Link href={downloadPageUrl} className="underline hover:text-neutral-700 dark:hover:text-neutral-300">
            See all downloads
        </Link>
    );
}

/* ─── Hero Section ─── */
const HeroSection = ({ project }: { project: ProjectConfigType }) => {
    const [platform, setPlatform] = useState<UserPlatform>({ os: 'unknown', isMobile: false, arch: 'unknown' });

    useEffect(() => {
        setPlatform(detectPlatform());
    }, []);

    const cta = getBestCta(project.downloadLinks || {}, platform, downloadUrl(project));
    const subtext = getHeroSubtext(project, platform);

    return (
        <section className="pt-16 pb-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <div className="flex flex-col items-center justify-center gap-3 mb-6">
                    {project.iconPath && <Image src={project.iconPath} width={56} height={56} alt={project.name} className="w-20 h-20" />}
                    <span className="text-2xl font-medium tracking-tight">{project.name}</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal leading-tight max-w-3xl mx-auto px-6">
                    Make your devices work better together, for you.
                </h1>
                <div className="mt-8 flex justify-center">
                    {cta.type === 'store' ? (
                        <Link href={cta.url} target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-80 transition-opacity">
                            <Image src={cta.icon} width={0} height={0} sizes="100vw" alt={cta.alt} className="h-[44px] w-auto" />
                        </Link>
                    ) : (
                        <Link href={cta.url}
                            className="inline-block px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors">
                            {cta.label}
                        </Link>
                    )}
                </div>
                <p className="mt-4 mx-4 text-sm text-neutral-500 dark:text-neutral-400">
                    {subtext}
                </p>
            </motion.div>

            {/* Hero image placeholder */}
            <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={slideUp}
                className="mt-12 mx-auto w-full md:h-[30rem] lg:h-[45rem] overflow-hidden"
            >
                <Image
                    src="/assets/img/homecloud/hero1.png"
                    width={1200} height={800}
                    alt="HomeCloud hero"
                    className="w-full h-full object-contain hidden md:block"
                />
            </motion.div>
            <HeroDevicesParallax />
        </section>
    );
};

/* ─── Superpowered Section ─── */
const SuperpoweredSection = () => (
    <section className="py-10 md:py-36 md:min-h-[30vh] flex items-center px-4">
        <Container className="max-w-6xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal leading-snug">
                    When you connect your devices together, they get{' '}
                    <span className="text-green-500">Superpowered</span>.
                    And you unlock experiences that are{' '}
                    <span className="text-red-500">Magical</span>,{' '}
                    <span className="text-blue-500">Powerful</span>, and{' '}
                    <span className="text-purple-500">Fun</span>.
                </h2>
            </motion.div>
        </Container>
    </section>
);

/* ─── Feature Card ─── */
type FeatureCardProps = {
    title: string;
    description: string;
    image?: string;
    smallImage?: string;
};

const FeatureCard = ({ title, description, image, smallImage }: FeatureCardProps) => {

    return (
        <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            className={cn("rounded-xl overflow-hidden flex flex-col", 'md:border border-neutral-200 dark:border-neutral-700')}
        >
            <div className="w-full p-4 md:p-14 flex flex-col justify-center">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-normal leading-snug mb-3">{title}</h3>
                <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">{description}</p>
            </div>
            <div className="w-full flex items-center justify-center p-0 md:p-6">
                {image ? (
                    <>
                        <Image src={image} width={1200} height={800} alt={title} className="w-full h-auto rounded-xl hidden md:block" />
                        <Image src={smallImage || image} width={600} height={400} alt={title} className="w-full h-auto rounded-xl md:hidden" />
                    </>
                ) : (
                    <div className="w-full h-[20rem] md:h-[28rem] rounded-xl bg-white/40 dark:bg-black/10 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-sm">
                        Screenshot Placeholder
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const FeaturesSection = () => (
    <section className="py-8 px-0 md:px-4">
        <Container className="max-w-7xl space-y-6">
            <FeatureCard
                title="Transfer a file, photo or link. Or thousands of them."
                description="Send files, photos, links and more between your devices instantly. No cables, no cloud uploads. Just fast & direct transfers with no size limits."
                image="/assets/img/homecloud/transfer-files.png"
                smallImage="/assets/img/homecloud/transfer-files-sm.png"
            />
            <FeatureCard
                title="Browse and edit your files & photos on the bigger screen, or on the go."
                description="Access your phone's photos right from your computer or your computer's files from your phone. View, edit or organize them from any device. You can even save changes made remotely on desktop without downloading and copying them."
                image="/assets/img/homecloud/browse.png"
                smallImage="/assets/img/homecloud/browse-sm.png"
            />
            <FeatureCard
                title="Copy on one device, paste on another."
                description="Access your clipboard across all your devices. Copy text or links on one device and paste them on another seamlessly."
                image="/assets/img/homecloud/clipboard.png"
                smallImage="/assets/img/homecloud/clipboard-sm.png"
            />
            <FeatureCard
                title="Change that song, or turn up the volume. From your nearest device."
                description="Control your desktop's media playback from your phone. Skip tracks, adjust volume or pause playback from whichever device is closest to you."
                image="/assets/img/homecloud/media-control.png"
                smallImage="/assets/img/homecloud/media-control-sm.png"
            />
        </Container>
    </section>
);

/* ─── Trust / Security Section ─── */
type TrustCardProps = {
    title: string;
    description: string;
    icon: React.ReactNode;
};

const TrustCard = ({ title, description, icon }: TrustCardProps) => (
    <div className={cn("rounded-xl p-6 flex flex-col gap-2",
        'bg-zinc-100 dark:bg-zinc-700/40',
        //'border border-neutral-200 dark:border-neutral-700'
    )}>
        <div className="w-12 h-12 m-4">{icon}</div>
        <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <span className="text-neutral-900 dark:text-neutral-200 font-semibold">{title}. </span>
            {description}
        </p>
    </div>
);

const TrustSection = () => (
    <section className="py-16 md:py-24 px-4">
        <Container className="max-w-7xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal mb-10">
                    Secure, Safe and Connected.
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <TrustCard
                        title="Stay connected anywhere"
                        description="Whether you are at home near your devices or on a vacation, HomeCloud keeps you connected with unique networking that works both with or without internet."
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>
                        }
                    />
                    <TrustCard
                        title="Your privacy is never optional"
                        description="With HomeCloud your data never leaves your devices. All connections are always direct and end-to-end encrypted."
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        }
                    />
                    <TrustCard
                        title="Free and open-sourced"
                        description="No purchases or subscriptions. HomeCloud is free to use without any restrictions. Open sourced on GitHub for everyone to contribute or audit."
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        }
                    />
                </div>
            </motion.div>
        </Container>
    </section>
);

import HCDownload from './hc-download';
import ProjectResources from '../project-resources';

/* ─── Download / CTA Section ─── */
const CtaSection = ({ project }: { project: ProjectConfigType }) => {
    return (
        <section className="py-16 md:pt-24 px-4">
            <Container className="max-w-7xl">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <HCDownload project={project} title="Let's get you started" />
                </motion.div>
            </Container>
        </section>
    );
};

const ResourcesSection = ({ project, theme }: { project: ProjectConfigType, theme: string }) => {
    return (
        <section className="pb-16">
            <ProjectResources className="max-w-7xl" project={project} theme={theme} />
        </section>
    );
};

/* ─── Main Landing Component ─── */
const HomeCloudLanding = ({ theme, project }: {
    theme: string;
    project: ProjectConfigType;
}) => {
    return (
        <div>
            <HeroSection project={project} />
            <SuperpoweredSection />
            <FeaturesSection />
            <TrustSection />
            <CtaSection project={project} />
            <ResourcesSection project={project} theme={theme} />
        </div>
    );
};

export default HomeCloudLanding;
