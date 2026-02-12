import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Octokit } from 'octokit';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_REPOS = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/projects.json'), 'utf-8'));

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

let updateProjectStr = process.env.UPDATE_PROJECT || '*';
updateProjectStr = updateProjectStr.toLowerCase();

const UPDATE_PROJECT = updateProjectStr === '*'
    ? PROJECT_REPOS
    : updateProjectStr.split(',').map((proj) => proj.trim());

const PROJECTS_DIR = './_projects';

function cleanup(removeToBeUpdated = false) {
    if (!fs.existsSync(PROJECTS_DIR)) {
        fs.mkdirSync(PROJECTS_DIR);
    }
    const keepRepos = removeToBeUpdated
        ? PROJECT_REPOS.filter((proj) => !UPDATE_PROJECT.includes(proj))
        : PROJECT_REPOS;
    const keepDirNames = keepRepos.map((proj) => getProjDir(proj, false));
    const dirs = fs.readdirSync(PROJECTS_DIR);
    dirs.forEach((dir) => {
        if (dir.startsWith('.') || keepDirNames.includes(dir)) {
            return;
        }
        fs.rmSync(`${PROJECTS_DIR}/${dir}`, { recursive: true });
    });
}

function getProjDir(proj, full = true) {
    const parts = proj.split('/');
    const dir = `${parts[0]}-${parts[1]}`;
    return full ? `${PROJECTS_DIR}/${dir}` : dir;
}

function getRemoteFileLink(filePath, proj, branch = 'main') {
    return `https://raw.githubusercontent.com/${proj}/${branch}/${filePath}`;
}

async function downloadProjFile(filePath, proj, branch = 'main') {
    const url = getRemoteFileLink(filePath, proj, branch);
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}, status: ${res.status}`);
    }
    console.log(`[Downloaded file -> ${url}]`);
    return res;
}

async function downloadProjTextFile(filePath, proj, branch = 'main') {
    return await (await downloadProjFile(filePath, proj, branch)).text();
}

async function downloadProjConfig(proj, branch) {
    return JSON.parse(await downloadProjTextFile('site.config.json', proj, branch));
}

/*
Download and save a project info & docs
*/

function fixImageLinks(md, proj, branch) {
    // strip HTML tags from markdown
    md = md.replace(/<[^>]+>/g, '');
    // replace image links that does not start with http with raw github links
    md = md.replace(/\!\[(.*?)\]\((?!http)(.*?)\)/g, (_match, p1, p2) => {
        return `![${p1}](${getRemoteFileLink(p2, proj, branch)})`;
    });
    return md;
}

function stringToSlug(name) {
    return name.toLowerCase().replace(' ', '-');
}

async function buildDocsConfig(proj, branch, docsPath) {
    if (!docsPath) {
        return;
    }
    const docsFilePath = `${getProjDir(proj, true)}/docs.json`;

    async function walk(proj, branch, pth, lev, basePath) {
        if (lev > 3) {
            console.warn(`[Warning] Max depth (3) reached for ${proj}, ${pth}`);
            return null;
        }
        let title = pth.split('/').pop();
        if (title.endsWith('.md')) {
            title = title.replace('.md', '');
        }
        const res = {
            title,
            mdUrl: null,
            path: stringToSlug(basePath),
            slugTitle: stringToSlug(title),
            githubUrl: `https://github.com/${proj}/tree/${branch}/${pth}`,
            routes: [],
        };
        if (pth.endsWith('.md')) {
            res.mdUrl = getRemoteFileLink(pth, proj, branch);
            return res;
        }
        const { data } = await octokit.rest.repos.getContent({
            owner: proj.split('/')[0],
            repo: proj.split('/')[1],
            path: pth,
        });
        const tasks = [];
        if (Array.isArray(data)) {
            data.forEach((file) => {
                if (file.name.toLowerCase() === 'readme.md' && file.type === 'file') {
                    res.mdUrl = getRemoteFileLink(file.path, proj, branch);
                } else {
                    tasks.push((async () => {
                        console.log('adding new file', file.name);
                        const bp = basePath + '/' + file.name.replace('.md', '');
                        const r = await walk(proj, branch, file.path, lev + 1, bp);
                        if (r) {
                            res.routes.push(r);
                        }
                    })());
                }
            });
        } else {
            return null;
        }
        await Promise.allSettled(tasks);
        return res;
    }

    const docsConfig = await walk(proj, branch, docsPath, 0, `/${proj.split('/')[1]}/docs`);
    fs.writeFileSync(docsFilePath, JSON.stringify(docsConfig, null, 2));
}

async function downloadProject(proj) {
    console.log(`[Updating.. -> ${proj}]`);

    if (!PROJECT_REPOS.includes(proj)) {
        throw new Error(`Invalid update repo in env: ${proj}, add it to config/projects.json first.`);
    }
    const parts = proj.split('/');
    if (parts.length !== 2) {
        throw new Error(`Invalid repo url: ${proj}, should be in the format owner/repo`);
    }
    const owner = parts[0];
    const repo = parts[1];
    const { data } = await octokit.rest.repos.get({ owner, repo });

    let latestVersion = null;

    try {
        const { data: releaseData } = await octokit.rest.repos.getLatestRelease({ owner, repo });
        if (releaseData.tag_name) {
            latestVersion = releaseData.tag_name;
        }
    } catch (e) {
        console.log('error message', e.message);
        console.warn(`No latest release found for ${proj}`);
    }

    let configFile = {};
    try {
        configFile = await downloadProjConfig(proj, data.default_branch);
    } catch (e) {
        console.warn(`No site.config.json found for ${proj}, using default config..`, e);
    }

    const projConfig = {
        title: data.name,
        tagline: data.description,
        description: data.description,
        githubUrl: data.html_url,
        link: data.homepage,
        defaultBranch: data.default_branch,
        topics: data.topics,
        iconPath: null,
        repoIconPath: null,
        accentColor: 'orange',
        docsPath: 'docs',
        showDownloads: latestVersion !== null,
        latestVersion,
        webAppUrl: null,
        ...configFile,
    };

    // To make sure these properties are not overridden by config
    projConfig.name = data.name;
    projConfig.dirName = getProjDir(proj, false);

    try {
        const projIconBuffer = Buffer.from(
            await (await downloadProjFile(projConfig.iconPath, proj, projConfig.defaultBranch)).arrayBuffer()
        );
        const iconExt = projConfig.iconPath.split('.').pop();
        const iconPath = `/assets/icon/icon-${projConfig.name}.${iconExt}`;
        fs.writeFileSync(`./public${iconPath}`, new Uint8Array(projIconBuffer));
        projConfig.repoIconPath = projConfig.iconPath;
        projConfig.iconPath = iconPath;
    } catch (e) {
        console.warn(`No icon found for ${proj}, using default icon..`, e);
        projConfig.iconPath = '/assets/icon/default-icon.png';
    }

    const projDir = `${PROJECTS_DIR}/${projConfig.dirName}`;

    if (!fs.existsSync(projDir)) {
        fs.mkdirSync(projDir);
    }
    const projConfigPath = `${projDir}/config.json`;
    fs.writeFileSync(projConfigPath, JSON.stringify(projConfig, null, 2));

    const projReadme = fixImageLinks(
        await downloadProjTextFile('README.md', proj, projConfig.defaultBranch),
        proj,
        projConfig.defaultBranch
    );
    fs.writeFileSync(`${projDir}/index.md`, projReadme);

    await buildDocsConfig(proj, projConfig.defaultBranch, projConfig.docsPath);

    console.log(`[Updated -> ${proj}]`);
}

/**
 * Download all projects
 * Main function
 */
export default () => {
    return new Promise((resolve) => {
        console.log('Fetching projects from GitHub ====>');
        const tasks = [];
        cleanup(true);
        UPDATE_PROJECT.forEach((proj) => {
            const task = downloadProject(proj);
            task.catch((e) => {
                console.error('Error while downloading project', proj, e);
            });
            tasks.push(task);
        });

        Promise.allSettled(tasks).then(() => {
            console.log(`${tasks.length} projects downloaded. ====>`);
            resolve();
        });
    });
};
