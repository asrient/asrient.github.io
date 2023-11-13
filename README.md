# Code for asrient.github.io

Statically generated blog & documentation website.

This repo can also be used as a template for your own personal website.
Built using Next.js, TailwindCSS and React.

The final output is html and js files that can be hosted on any CDN like github pages, vercel, netlify, cloudflare pages etc and does not need any computation during runtime.

Forked from Next.js's [blog-starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter).


The blog posts are stored in `/_posts` as Markdown files with front matter support. Adding a new Markdown file in there will create a new blog post.

To create the blog posts we use [`remark`](https://github.com/remarkjs/remark) and [`remark-html`](https://github.com/remarkjs/remark-html) to convert the Markdown files into an HTML string, and then send it down as a prop to the page. The metadata of every post is handled by [`gray-matter`](https://github.com/jonschlinkert/gray-matter) and also sent in props to the page.

## Demo

[https://asrient.github.io/](https://asrient.github.io)

## How to use

After cloning

```bash
cd path/to/repo
npm i
```

Download necessary files, this fetches project related info and available docs for each from github

```bash
npm run fetch
```
Run dev server

```bash
npm run dev
```

Your blog should be up and running on [http://localhost:3000](http://localhost:3000)! 

## Deploy it to the cloud

To deploy on any cloud or cdn

```bash
npm run export
```

This fetches required data from github and generates final html, css, js bundles at `/out` directory.
Host the contents of this directory to cloud.

## Files to configure

- `/config/site.json` - website related settings.
- `/config/projects.json` - List the projects hosted on github for which docs will be created.

# Notes

- `blog-starter` uses [Tailwind CSS](https://tailwindcss.com) [(v3.0)](https://tailwindcss.com/blog/tailwindcss-v3).
- Create new themes using [uicolors](https://uicolors.app/create).
