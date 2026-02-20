import fs from 'fs';
import { PROJECT_REPOS, PROJECT_OVERRIDES } from './constants';
import ProjectConfigType from '../interfaces/projectConfig';
import RouteItem from '../interfaces/routeItem';
import path from 'path';
import { fixMdLinks } from './projectUtils';

/*
Read project docs and config from local file system.
Expects an already populated _project directory.
*/

const PROJECTS_DIR = path.join(process.cwd(), '_projects');

export function nameToProjectId(name: string) {
  return PROJECT_REPOS.find((proj) => proj.toLowerCase().split('/')[1] === name.toLowerCase());
}

export function getProjDir(proj: string) {
  const parts = proj.split('/');
  if (parts.length < 2) {
    throw new Error(`Invalid project name: ${proj}. Must be in the format <username>/<repo>.`);
  }
  const dir = `${parts[0]}-${parts[1]}`
  return `${PROJECTS_DIR}/${dir}`;
}

export function getProjectConfig(proj: string): ProjectConfigType {
  const dir = getProjDir(proj);
  if (!fs.existsSync(dir)) {
    throw new Error(`Project ${proj} does not exist in _projects directory. Please run \`npm run fetch\` to populate the directory.`);
  }
  const config = JSON.parse(fs.readFileSync(`${dir}/config.json`, 'utf8'));
  const overrides = PROJECT_OVERRIDES[proj] || {};
  return { ...config, ...overrides };
}

export function getProjectConfigs(limit = 999): ProjectConfigType[] {
  return PROJECT_REPOS.slice(0, limit).map(getProjectConfig);
}

export function getProjectIndexPage(proj: string): string {
  const dir = getProjDir(proj);
  return fs.readFileSync(`${dir}/index.md`, 'utf8');
}

export function getDocsConfig(proj: string): RouteItem {
  const dir = getProjDir(proj);
  return JSON.parse(fs.readFileSync(`${dir}/docs.json`, 'utf8'));
}

export function getAllDocsConfigs(): RouteItem[] {
  return PROJECT_REPOS.map(getDocsConfig);
}

export function getAllDocsPaths() {
  const paths = [];
  const walk = (d: RouteItem) => {
    if (d.routes) {
      d.routes.forEach(walk);
    }
    paths.push(d.path);
  }
  getAllDocsConfigs().forEach(walk);
  return paths;
}

// Breath-first search
export function getRouteFromSlug(slug: string) {
  if (slug[0] === '/') {
    slug = slug.slice(1);
  }
  if (slug[slug.length - 1] === '/') {
    slug = slug.slice(0, slug.length - 1);
  }

  const walk = (remainingPath: string[], d: RouteItem) => {
    if (remainingPath.length === 0) {
      return d;
    }
    for (let subD of d.routes) {
      // console.log('check path', subD.slugTitle, remainingPath[0])
      if (subD.slugTitle === remainingPath[0]) {
        let res = walk(remainingPath.slice(1), subD);
        if (!!res) {
          return res;
        }
      }
    }
    return null;
  }
  // slug: [project name]/docs/[...path]
  const proj = nameToProjectId(slug.split('/')[0]);
  if (!proj) {
    return null;
  }
  const docsConfig = getDocsConfig(proj);
  //console.log('remaining path', slug.split('/').slice(2));
  const currentDoc = walk(slug.split('/').slice(2), docsConfig);
  return {
    currentDoc,
    docsConfig,
    projectId: proj,
  }
}

export async function fetchMd(url: string, project?: ProjectConfigType, currentDocPath?: string) {
  if (!url) {
    return null;
  }
  const res = await fetch(url);
  const text = await res.text();
  const baseImageUrl = url.substring(0, url.lastIndexOf('/') + 1);
  return fixMdLinks(text, project, currentDocPath, baseImageUrl);
}

export function stripTitleHeading(md: string) {
  return md.replace(/^# .*\n/, '');
}
