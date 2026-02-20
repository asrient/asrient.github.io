import ProjectConfigType, { DownloadLinks } from "../interfaces/projectConfig";
import { UserPlatform } from "./utils";

/* ─── Shared types ─── */

export type DesktopPlatform = 'macOS' | 'Windows' | 'Linux';
export const desktopPlatforms: DesktopPlatform[] = ['macOS', 'Windows', 'Linux'];

export type DownloadEntry = { label: string; url: string; arch?: 'arm64' | 'x64' };
export type StoreEntry = { label?: string; url: string; icon: string };

export type DesktopData = Record<DesktopPlatform, {
    store?: StoreEntry;
    assets: DownloadEntry[];
}>;

/* ─── Store badge constants ─── */

export const storeBadges = {
    macAppStore: { icon: '/assets/img/Mac_App_Store_Badge.svg', alt: 'Download on the Mac App Store' },
    appStore: { icon: '/assets/img/App_Store_Badge.svg', alt: 'Download on the App Store' },
    msStore: { icon: '/assets/img/ms_store.png', alt: 'Get it from Microsoft Store' },
    playStore: { icon: '/assets/img/PlayStore_Badge.png', alt: 'Get it on Google Play' },
} as const;

/* ─── Build structured download data from config ─── */

export function getDownloadData(dl: DownloadLinks) {
    const desktop: DesktopData = {
        macOS: { assets: [] },
        Windows: { assets: [] },
        Linux: { assets: [] },
    };
    const mobile: StoreEntry[] = [];

    // macOS
    if (dl.macAppStore) {
        desktop.macOS.store = { url: dl.macAppStore, ...storeBadges.macAppStore };
    }
    if (dl.macosArm64) {
        desktop.macOS.assets.push({ label: 'Download for Apple Silicon', url: dl.macosArm64, arch: 'arm64' });
    }
    if (dl.macosX64) {
        desktop.macOS.assets.push({ label: 'Download for Intel Macs', url: dl.macosX64, arch: 'x64' });
    }

    // Windows
    if (dl.msStore) {
        desktop.Windows.store = { url: dl.msStore, ...storeBadges.msStore };
    }
    if (dl.windowsExe) {
        desktop.Windows.assets.push({ label: 'Download Setup.exe', url: dl.windowsExe });
    }

    // Linux
    if (dl.linuxDeb) {
        desktop.Linux.assets.push({ label: 'Download .deb', url: dl.linuxDeb });
    }

    // Mobile
    if (dl.appStore) {
        mobile.push({ url: dl.appStore, ...storeBadges.appStore });
    }
    if (dl.playStore) {
        mobile.push({ url: dl.playStore, ...storeBadges.playStore });
    }

    const hasDesktop = desktopPlatforms.some(p => desktop[p].store || desktop[p].assets.length > 0);
    const hasMobile = mobile.length > 0;

    return { desktop, mobile, hasDesktop, hasMobile };
}

/* ─── Pick best CTA for a given platform ─── */

export type HeroCta = {
    type: 'store';
    url: string;
    icon: string;
    alt: string;
} | {
    type: 'button';
    url: string;
    label: string;
};

export function getBestCta(dl: DownloadLinks, platform: UserPlatform, fallbackUrl: string): HeroCta {
    const { desktop, mobile } = getDownloadData(dl);

    if (platform.isMobile) {
        // Find matching mobile store badge
        const mobileStore = mobile.find(s => {
            if (platform.os === 'iOS') return s.icon === storeBadges.appStore.icon;
            if (platform.os === 'Android') return s.icon === storeBadges.playStore.icon;
            return false;
        });
        if (mobileStore) {
            return { type: 'store', url: mobileStore.url, icon: mobileStore.icon, alt: mobileStore.label || '' };
        }
    } else {
        const osMap: Record<string, DesktopPlatform> = { macOS: 'macOS', Windows: 'Windows', Linux: 'Linux' };
        const key = osMap[platform.os];
        if (key) {
            const data = desktop[key];
            if (data.store) {
                return { type: 'store', url: data.store.url, icon: data.store.icon, alt: data.store.label || '' };
            }
            // Pick arch-matched asset, or first available
            const matched = data.assets.find(a => a.arch && a.arch === platform.arch)
                || data.assets[0];
            if (matched) {
                return { type: 'button', url: matched.url, label: `Download for ${key}` };
            }
        }
    }

    return { type: 'button', url: fallbackUrl, label: 'Download' };
}

/* ─── List other available platforms ─── */

export function getOtherPlatforms(dl: DownloadLinks, currentOs: UserPlatform['os']): string[] {
    const others: string[] = [];
    if (currentOs !== 'macOS' && (dl.macAppStore || dl.macosArm64 || dl.macosX64)) others.push('macOS');
    if (currentOs !== 'Windows' && (dl.msStore || dl.windowsExe)) others.push('Windows');
    if (currentOs !== 'Linux' && dl.linuxDeb) others.push('Linux');
    if (currentOs !== 'iOS' && dl.appStore) others.push('iOS');
    if (currentOs !== 'Android' && dl.playStore) others.push('Android');
    return others;
}
