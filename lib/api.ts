import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { NAME } from './constants'

const postsDirectory = join(process.cwd(), '_posts')

export function getPostSlugs(): string[] {
  return JSON.parse(fs.readFileSync(`${postsDirectory}/slugs.json`, 'utf8'));
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const slugParts = slug.split('-');
  const postId = slugParts[slugParts.length - 1];
  const fullPath = join(postsDirectory, `${postId}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const author = {
    name: data.author?.name || NAME,
    picture: `${data.author?.picture || `/assets/blog/authors/${NAME.toLowerCase()}.jpeg`}`
  };

  type Items = {
    [key: string]: string | any
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'content') {
      items[field] = content
    }
    // Treat author as a special case
    if (field === 'author') {
      items[field] = author
    }
    else if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  return items
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}
