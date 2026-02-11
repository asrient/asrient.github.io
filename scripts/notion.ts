import { NotionToMarkdown } from 'notion-to-md';
import { Client } from '@notionhq/client';
import fs from 'fs';
import crypto from 'crypto';
import 'dotenv/config';
import SETTINGS from '../config/site.json';

const notion = new Client({ auth: process.env.NOTION_TOKEN || '' });

const n2m = new NotionToMarkdown({ notionClient: notion });

const POSTS_DIR = './_posts';
const IMAGES_DIR = './public/assets/blog/images';
const IMG_BASE_PATH = '/assets/blog/images';

const NOTION_SETTINGS: Record<string, any> = (SETTINGS as any).NOTION || {};

export function stringToSlug(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

interface PageMeta {
    id: string;
    notionId: string;
    title: string;
    excerpt: string;
    date: string;
    tags: string[];
    cover: string;
    slug: string;
}

function pageMetadataToFrontMatter(page: PageMeta): string {
    const tags = page.tags.map((tag) => `- ${tag}`).join('\n');
    return `---
title: ${page.title}
excerpt: '${page.excerpt || ''}'
date: '${page.date}'
tags:
${tags}
coverImage: ${page.cover}
slug: ${page.slug}
author:
  name: ${SETTINGS.NAME}
  picture: '${NOTION_SETTINGS.AUTHOR_DP || ''}'
ogImage:
  url: ${page.cover}
---
`;
}

function sha1(data: string): string {
    return crypto.createHash('sha1').update(data).digest('hex');
}

async function downloadImage(url: string): Promise<string> {
    const res = await fetch(url);
    if (!res.ok) {
        console.error(`Failed to fetch ${url}, status: ${res.status}`);
        return url;
    }
    const filename = sha1(url).slice(0, 5) + '-' + url.split('/').pop()!.split('?')[0].split('#')[0];
    const filepath = `${IMAGES_DIR}/${filename}`;
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filepath, new Uint8Array(buffer));
    console.log(`[Downloaded image -> ${url} -> ${filepath}]`);
    return `${IMG_BASE_PATH}/${filename}`;
}

async function fixMdLinks(md: string): Promise<string> {
    const promises: Promise<string>[] = [];
    const reg = /\!\[(.*?)\]\((.*?)\)/g;
    md.replace(reg, (match, _p1, p2) => {
        promises.push(downloadImage(p2));
        return match;
    });
    promises.reverse();
    const files = await Promise.all(promises);
    return md.replace(reg, (_match, p1) => `![${p1}](${files.pop()})`);
}

async function savePage(page: PageMeta): Promise<void> {
    const mdblocks = await n2m.pageToMarkdown(page.notionId);
    const mdString = n2m.toMarkdownString(mdblocks);
    const meta = pageMetadataToFrontMatter(page);
    const md = await fixMdLinks(mdString.parent);
    console.log(`[Saving page -> ${page.title} -> ${page.id}]`);
    fs.writeFileSync(`${POSTS_DIR}/${page.id}.md`, meta + '\n' + md);
}

async function getPagesFromDatabase(databaseId: string): Promise<PageMeta[]> {
    const pages: PageMeta[] = [];
    let cursor: string | undefined = undefined;
    while (true) {
        const response: any = await notion.databases.query({
            database_id: databaseId,
            start_cursor: cursor,
            filter: {
                property: 'PUBLISH',
                checkbox: {
                    equals: true,
                },
            },
        });
        await Promise.all(
            response.results.map(async (page: any) => {
                const pageId = page.id.replace(/-/g, '');
                try {
                    const page_: PageMeta = {
                        id: pageId,
                        notionId: page.id,
                        title: page.properties.Page?.title[0].plain_text || pageId,
                        excerpt: page.properties.Intro?.rich_text[0]?.plain_text || '',
                        date: page.created_time,
                        tags: page.properties.Tags.multi_select.map((tag: any) => tag.name),
                        cover: page.cover?.external?.url,
                        slug: '',
                    };
                    if (page_.cover) {
                        page_.cover = await downloadImage(page_.cover);
                    }
                    page_.slug = stringToSlug(page_.title + '-' + page_.id);
                    pages.push(page_);
                } catch (e) {
                    console.error('Error while parsing page', page.id, e);
                }
            })
        );
        cursor = response.next_cursor;
        if (!cursor) {
            break;
        }
    }
    return pages;
}

function cleanup(): void {
    console.log('Cleaning up posts directory ====>');
    if (!fs.existsSync(POSTS_DIR)) {
        fs.mkdirSync(POSTS_DIR);
        console.log('created posts directory');
    }
    const files = fs.readdirSync(POSTS_DIR);
    files.forEach((file) => {
        fs.unlinkSync(`${POSTS_DIR}/${file}`);
    });
    console.log(`Deleted ${files.length} files.`);
    if (fs.existsSync(IMAGES_DIR)) {
        fs.rmSync(IMAGES_DIR, { recursive: true });
    }
    fs.mkdirSync(IMAGES_DIR);
}

export default (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (NOTION_SETTINGS.ENABLED !== true) {
            console.log('[Notion is disabled]');
            resolve();
            return;
        }
        if (!process.env.NOTION_TOKEN) {
            reject('[Notion is enabled but `NOTION_TOKEN` token is not set in the env.]');
            return;
        }
        if (!NOTION_SETTINGS.DATABASE_ID) {
            reject('Notion is enabled but database id is not set.');
            return;
        }
        cleanup();
        console.log('Fetching pages from Notion ====>');
        const tasks: Promise<void>[] = [];
        getPagesFromDatabase(NOTION_SETTINGS.DATABASE_ID).then((pages) => {
            console.log(`Found ${pages.length} published pages on Notion.`);
            const slugs: string[] = [];
            pages.forEach((page) => {
                slugs.push(page.slug);
                tasks.push(savePage(page));
            });
            fs.writeFileSync(`${POSTS_DIR}/slugs.json`, JSON.stringify(slugs));
            Promise.all(tasks).then(() => resolve()).catch(reject);
        }).catch(reject);
    });
};
