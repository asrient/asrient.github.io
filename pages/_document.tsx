import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className='dark:text-neutral-100 dark:bg-neutral-800'>
        <Main />
        <NextScript />
        <Script
        src="/scripts/darkmode.js"
        strategy="beforeInteractive"
      />
      </body>
    </Html>
  )
}
