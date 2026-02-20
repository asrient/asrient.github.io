import me from '../config/site.json'
import projects from '../config/projects.json'

export const BRAND_NAME = me.BRAND_TEXT
export const NAME = me.NAME
export const REAL_NAME = me.REAL_NAME
export const EMAIL = ''
export const SOCIALS = me.SOCIALS
export const INTRO = me.INTRO

type ProjectEntry = string | { repo: string; [key: string]: any };
const projectEntries = projects as ProjectEntry[];
export const PROJECT_REPOS = projectEntries.map((p) => typeof p === 'string' ? p : p.repo);
export const PROJECT_OVERRIDES: Record<string, Record<string, any>> = {};
projectEntries.forEach((p) => {
    if (typeof p !== 'string') {
        const { repo, ...overrides } = p;
        if (Object.keys(overrides).length > 0) {
            PROJECT_OVERRIDES[repo] = overrides;
        }
    }
});

export const SITE_GITHUB_URL = me.SITE_GITHUB_URL
export const FOOTER_TEXT = me.FOOTER_TEXT
export const FOOTER_LINKS = me.FOOTER_LINKS || []
