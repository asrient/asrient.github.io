import { AppProps } from 'next/app'
import Layout from '../components/layout'
import '../styles/index.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  pageProps.theme = pageProps.theme || 'orange';
  return (<Layout theme={pageProps.theme} project={pageProps.project || null} currentDoc={pageProps.currentDoc || null} docs={pageProps.docsConfig || null} lastUpdatedOn={pageProps.lastUpdatedOn} >
    <Component {...pageProps} />
  </Layout>)
}
