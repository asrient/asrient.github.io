import Footer from './footer'
import Meta from './meta'
import Header from './header'
import { themed } from '../lib/utils'
import ProjectConfigType from '../interfaces/projectConfig'
import RouteItem from '../interfaces/routeItem'
import { SidebarRouteTree } from './docs-sidebar/route-tree'

type Props = {
  theme: string
  children: React.ReactNode,
  project?: ProjectConfigType
  docs?: RouteItem,
  currentDoc?: RouteItem
  lastUpdatedOn?: string,
  showHeader?: boolean,
  fullWidth?: boolean,
}

const Layout = ({ theme, children, project, docs, currentDoc, lastUpdatedOn, showHeader, fullWidth }: Props) => {

  const thm = themed(theme);
  const showSidebar = !!docs;
  const showHeaderBar = showHeader === undefined ? true : showHeader;
  const extraClasses = showSidebar ? 'block md:flex md:flex-row' : '';

  return (
    <>
      <Meta />
      {showHeaderBar && <Header theme={theme} project={project} docsConfig={docs} />}
      <div className={thm`$bg-accent-5 dark:$bg-accent-5 min-h-[80vh]`}>
        <div className={`relative ${!fullWidth ? 'max-w-screen-xl md:px-4 py-3 md:py-5 mx-auto' : ''} ` + extraClasses}>
          {showSidebar && <div className={'hidden h-full w-full md:block sticky top-0 left-0 right-0 py-0 max-w-[18rem]'}>
            <div className='overflow-y-scroll no-bg-scrollbar w-full h-[100vh] pt-16 scrolling-touch scrolling-gpu'>
              <SidebarRouteTree theme={theme} routeTree={docs} level={0} isForceExpanded={false} />
            </div>
          </div>}
          <main className='w-full relative' style={{ overflowX: 'hidden' }}>{children}</main>
        </div>
      </div>
      <Footer theme={theme} project={project} currentDoc={currentDoc} lastUpdatedOn={lastUpdatedOn} />
    </>
  )
}

export default Layout
