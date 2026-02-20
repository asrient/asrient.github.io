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

## Project `site.config.json`

Each project repo can include a `site.config.json` at the root to customize how it appears on this site. The file is fetched automatically during `npm run fetch`. All fields are optional and will fall back to sensible defaults.

```jsonc
{
  // Display
  "title": "My Project",                  // Display name (default: repo name)
  "tagline": "Short tagline",             // One-liner shown on project card
  "description": "Longer description",    // Full description
  "accentColor": "red",                   // Theme color (matches a file in /config/themes/)
  "iconPath": "img/icon.png",             // Path to icon in the repo (downloaded & served locally)
  "webAppUrl": "https://app.example.com", // Link to a hosted web app

  // Docs
  "docsPath": "docs",                     // Folder in the repo containing documentation (set to null to disable)

  // Downloads
  "showDownloads": true,                  // Show download/release info on the project page

  // Download links (shown on the download page)
  "downloadLinks": {
    "macAppStore": "https://apps.apple.com/app/...",        // Mac App Store (desktop macOS section)
    "appStore": "https://apps.apple.com/app/...",           // iOS App Store (mobile section)
    "playStore": "https://play.google.com/store/apps/...",  // Google Play (mobile section)
    "msStore": "ms-windows-store://pdp/?productId=...",     // Microsoft Store (desktop Windows section)
    "macosArm64": "https://github.com/.../file.zip",        // Direct download for macOS Apple Silicon
    "macosX64": "https://github.com/.../file.zip",          // Direct download for macOS Intel
    "windowsExe": "https://github.com/.../Setup.exe",       // Direct download for Windows installer
    "linuxDeb": "https://github.com/.../file.deb"           // Direct download for Linux .deb package
  }
}
```

Additionally, per-project overrides can be set in `/config/projects.json` without modifying the project repo:

```jsonc
[
  {
    "repo": "owner/repo",
    "customDownloadPage": true,   // Enable a dedicated /project/download page
    "customLanding": true,        // Use a custom landing page component (implies full-width layout)
    "showDownloads": true
  },
  "owner/other-repo"             // Plain string for projects with no overrides
]
```

# Notes

- `blog-starter` uses [Tailwind CSS](https://tailwindcss.com) [(v3.0)](https://tailwindcss.com/blog/tailwindcss-v3).
- Create new themes using [uicolors](https://uicolors.app/create).
