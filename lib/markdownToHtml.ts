import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import remarkPrism from 'remark-prism';

export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(remarkGfm).use(html, { sanitize: false }).use(remarkPrism, { 
    plugins: ["line-numbers"]
   }).process(markdown)
  return result.toString()
}
