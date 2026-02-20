export function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export function themed(theme: string) {
    return (strs: TemplateStringsArray) => {
        return strs[0].split(' ').map(s => {
            let parts = s.split('$');
            if (parts.length === 1) {
                return s;
            }
            parts.push(`-${theme}`);
            if (parts[0].startsWith('dark:')) {
                parts.push('-dark');
            }
            return parts.join('');
        }).join(' ');
    }
}

export function getDefaultStaticProps() {
    return {
        theme: 'orange',
        lastUpdatedOn: new Date().toISOString(),
    }
}

export type UserPlatform = {
    os: 'macOS' | 'Windows' | 'Linux' | 'iOS' | 'Android' | 'unknown';
    isMobile: boolean;
    arch: 'arm64' | 'x64' | 'unknown';
};

export function detectPlatform(): UserPlatform {
    if (typeof window === 'undefined' || !navigator?.userAgent) {
        return { os: 'unknown', isMobile: false, arch: 'unknown' };
    }

    const ua = navigator.userAgent;
    const platform = (navigator as any).userAgentData?.platform || navigator.platform || '';

    let os: UserPlatform['os'] = 'unknown';
    let isMobile = false;
    let arch: UserPlatform['arch'] = 'unknown';

    // Mobile detection
    if (/iPad|iPhone|iPod/.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
        os = 'iOS';
        isMobile = true;
    } else if (/Android/i.test(ua)) {
        os = 'Android';
        isMobile = true;
    } else if (/Mac/i.test(platform)) {
        os = 'macOS';
    } else if (/Win/i.test(platform)) {
        os = 'Windows';
    } else if (/Linux/i.test(platform)) {
        os = 'Linux';
    }

    // Arch detection (best effort)
    if (os === 'macOS') {
        // Apple Silicon Macs report arm in userAgentData or can be inferred
        const uaData = (navigator as any).userAgentData;
        if (uaData?.architecture === 'arm') {
            arch = 'arm64';
        } else if (uaData?.architecture === 'x86') {
            arch = 'x64';
        } else {
            // Fallback: newer Macs are arm64
            arch = 'arm64';
        }
    } else if (os === 'Windows' || os === 'Linux') {
        if (/aarch64|arm64/i.test(ua)) {
            arch = 'arm64';
        } else {
            arch = 'x64';
        }
    }

    return { os, isMobile, arch };
}
