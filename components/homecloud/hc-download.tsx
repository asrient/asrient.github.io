import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import cn from "classnames";
import ProjectConfigType from "../../interfaces/projectConfig";
import { detectPlatform } from "../../lib/utils";
import { getDownloadData, desktopPlatforms, type DesktopPlatform } from "../../lib/downloads";

// --- Store badge button ---
function StoreBadge({ url, icon, alt, className }: { url: string; icon: string; alt?: string; className?: string }) {
    return (
        <Link href={url} target="_blank" rel="noopener noreferrer"
            className={cn("inline-block hover:opacity-80 transition-opacity", className)}>
            <Image src={icon} width={0} height={0} sizes="100vw" alt={alt || ''} className="h-[40px] w-auto" />
        </Link>
    );
}

// --- Download link button ---
function DownloadButton({ label, url, primary }: { label: string; url: string; primary?: boolean }) {
    return (
        <Link href={url} target="_blank" rel="noopener noreferrer"
            className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors",
                primary
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90"
                    : "border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            )}>
            {label}
        </Link>
    );
}

const HCDownload = ({ project, title }: { project: ProjectConfigType; title: string }) => {
    const [desktopTab, setDesktopTab] = useState<DesktopPlatform>('macOS');
    const [mobileFirst, setMobileFirst] = useState(false);
    const [userArch, setUserArch] = useState<'arm64' | 'x64' | 'unknown'>('unknown');
    const { desktop, mobile, hasDesktop, hasMobile } = useMemo(() => getDownloadData(project.downloadLinks || {}), [project]);
    const currentDesktop = desktop[desktopTab];

    useEffect(() => {
        const { os, isMobile, arch } = detectPlatform();
        setUserArch(arch);
        if (isMobile) {
            setMobileFirst(true);
        }
        if (os === 'Windows') setDesktopTab('Windows');
        else if (os === 'Linux') setDesktopTab('Linux');
        // macOS is already the default
    }, []);

    const desktopSection = hasDesktop && (
        <div>
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h3 className="text-lg font-medium">Download for {desktopTab}</h3>
                <div className="flex gap-4 self-start border-b border-neutral-200 dark:border-neutral-700">
                    {desktopPlatforms.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setDesktopTab(tab)}
                            className={cn(
                                "pb-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                                desktopTab === tab
                                    ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white"
                                    : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 min-h-[48px]">
                {currentDesktop.store || currentDesktop.assets.length > 0 ? (
                    <>
                        {currentDesktop.store && (
                            <StoreBadge
                                url={currentDesktop.store.url}
                                icon={currentDesktop.store.icon}
                                alt={currentDesktop.store.label}
                            />
                        )}
                        {currentDesktop.assets.map((asset, i) => {
                            const isPrimary = asset.arch && userArch !== 'unknown'
                                ? asset.arch === userArch
                                : !currentDesktop.store && i === 0;
                            return (
                                <DownloadButton
                                    key={i}
                                    label={asset.label}
                                    url={asset.url}
                                    primary={isPrimary}
                                />
                            );
                        })}
                    </>
                ) : (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Coming soon</p>
                )}
            </div>
        </div>
    );

    const mobileSection = hasMobile && (
        <div>
            <h3 className="text-lg font-medium mb-5">Download for mobile</h3>
            <div className="flex flex-wrap gap-3">
                {mobile.map((store, i) => (
                    <StoreBadge
                        key={i}
                        url={store.url}
                        icon={store.icon}
                        alt={store.label}
                    />
                ))}
            </div>
        </div>
    );

    const separator = hasDesktop && hasMobile && (
        <hr className="my-8 border-neutral-200 dark:border-neutral-700" />
    );

    return (
        <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal mb-3">
                {title}
            </h2>
            <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-4xl leading-relaxed mb-10">
                It&apos;s easy to set up, install the {project.name} app on all your devices and login with the same email account, all your logged-in devices will automatically start showing up everywhere. {project.name} is available for all major platforms so that none of your devices are left out.
            </p>

            {/* Downloads card */}
            <div className="md:rounded-2xl md:border md:border-neutral-200 md:dark:border-neutral-700 md:p-8">
                {mobileFirst ? (
                    <>
                        {mobileSection}
                        {separator}
                        {desktopSection}
                    </>
                ) : (
                    <>
                        {desktopSection}
                        {separator}
                        {mobileSection}
                    </>
                )}
            </div>
        </div>
    );
};

export default HCDownload;
