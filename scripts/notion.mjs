import { NotionToMarkdown } from "notion-to-md";
import { Client } from "@notionhq/client";
import fs from "fs";
import SETTINGS from '../config/site.json' assert { type: "json" };
import 'dotenv/config'

const notion = new Client({ auth: process.env.NOTION_TOKEN || '' });

const n2m = new NotionToMarkdown({ notionClient: notion });

const POSTS_DIR = './_posts';

const NOTION_SETTINGS = SETTINGS.NOTION || {};

// https://stackoverflow.com/questions/1053902/how-to-convert-a-title-to-a-url-slug-in-jquery

export function stringToSlug(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
}

function pageMetadataToFontMatter(page) {
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

async function savePage(page) {
    const mdblocks = await n2m.pageToMarkdown(page.notionId);
    const mdString = n2m.toMarkdownString(mdblocks);
    const meta = pageMetadataToFontMatter(page);
    //console.log('content', mdString);
    console.log(`[Saving page -> ${page.title} -> ${page.id}]`);
    fs.writeFileSync(`${POSTS_DIR}/${page.id}.md`, meta + '\n' + mdString.parent);
}

async function getPagesFromDatabase(databaseId) {
    const pages = [];
    let cursor = undefined;
    while (true) {
        const response = await notion.databases.query({
            database_id: databaseId,
            start_cursor: cursor,
            filter: {
                property: 'PUBLISH',
                checkbox: {
                    equals: true
                }
            }
        });
        response.results.forEach((page) => {
            //console.log('PAGE',page)
            const pageId = page.id.replace(/-/g, '');
            try {
                const page_ = {
                    id: pageId,
                    notionId: page.id,
                    title: page.properties.Page?.title[0].plain_text || pageId,
                    excerpt: page.properties.Intro?.rich_text[0]?.plain_text || '',
                    date: page.created_time,
                    tags: page.properties.Tags.multi_select.map((tag) => tag.name),
                    cover: page.cover?.external?.url,
                }
                page_.slug = stringToSlug(page_.title + '-' + page_.id);
                pages.push(page_);
            }
            catch (e) {
                console.error('Error while parsing page', page.id, e);
            }
        });
        cursor = response.next_cursor;
        if (!cursor) {
            break;
        }
    }
    return pages;
}

function cleanup() {
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
}

export default () => {
    return new Promise((resolve, reject)=>{
        if (NOTION_SETTINGS.ENABLED !== true) {
            console.log('[Notion is disabled]');
            resolve();
            return;
        }
        if(!process.env.NOTION_TOKEN) {
            reject('[Notion is enabled but `NOTION_TOKEN` token is not set in the env.]');
            return;
        }
        if(!NOTION_SETTINGS.DATABASE_ID) {
            reject('Notion is enabled but database id is not set.');
            return;
        }
        cleanup();
        console.log('Fetching pages from Notion ====>');
        const tasks = [];
        getPagesFromDatabase(NOTION_SETTINGS.DATABASE_ID).then((pages) => {
            console.log(`Found ${pages.length} published pages on Notion.`);
            const slugs = [];
            pages.forEach((page) => {
                slugs.push(page.slug);
                tasks.push(savePage(page));
            });
            fs.writeFileSync(`${POSTS_DIR}/slugs.json`, JSON.stringify(slugs));
            Promise.all(tasks).then(resolve).catch(reject);
        }).catch(reject);
    })
};
