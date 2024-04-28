import { AppProps } from 'next/app'
import Layout from '../components/layout'
import '../styles/index.css'
import "../styles/prism-monokai.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  pageProps.theme = pageProps.theme || 'orange';
  return (<Layout theme={pageProps.theme}
    project={pageProps.project || null}
    showHeader={pageProps.showHeader}
    fullWidth={pageProps.fullWidth || false}
    currentDoc={pageProps.currentDoc || null} docs={pageProps.docsConfig || null}
    lastUpdatedOn={pageProps.lastUpdatedOn} >
    <Component {...pageProps} />
  </Layout>)
}
