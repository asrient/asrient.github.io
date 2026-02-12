import Link from 'next/link'
import Image from 'next/image'
import { themed } from '../lib/utils'
import ProjectConfigType from '../interfaces/projectConfig'
import RouteItem from '../interfaces/routeItem'
import React, { useState, useRef, useEffect, Suspense } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useRouter } from 'next/router'
import { IconClose } from './icon/IconClose';
import { IconHamburger } from './icon/IconHamburger';
import cn from 'classnames';
import { SidebarRouteTree } from './docs-sidebar/route-tree'
import { BRAND_NAME } from '../lib/constants'
import DarkModeToggle from './dark-mode-toggle'
import { downloadUrl } from '../lib/projectUtils'

const githubIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24">
    <g fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </g>
  </svg>
);

interface LinkType {
  name: string,
  url: string,
  external?: boolean,
  icon?: JSX.Element
}


const Links = ({ links }: {
  links: LinkType[]
}) => {
  const len = links.length;
  return (<>
    {links.map((link, i) => (
      <Link href={link.url}
        key={link.name + link.url}
        target={!!link.external ? '_blank' : '_self'}
        className={`hover:underline${i > 0 ? ' ml-5' : ''} ${(len - i) > 2 ? 'hidden md:block' : ''}`}>
        {link.icon || link.name}
      </Link>
    ))}
  </>)
}

const Header = ({ theme, project, docsConfig, style }: {
  theme: string,
  project?: ProjectConfigType,
  docsConfig?: RouteItem,
  style?: React.CSSProperties,
}) => {

  const thm = themed(theme);
  const isProjectPage = !!project;
  const showDocsSidebar = !!docsConfig;

  const [isOpen, setIsOpen] = useState(false);
  const scrollParentRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { asPath } = useRouter();

  // While the overlay is open, disable body scroll.
  useEffect(() => {
    if (isOpen) {
      const preferredScrollParent = scrollParentRef.current!;
      disableBodyScroll(preferredScrollParent);
      return () => enableBodyScroll(preferredScrollParent);
    } else {
      return undefined;
    }
  }, [isOpen]);

  // Close the overlay on any navigation.
  useEffect(() => {
    setIsOpen(false);
  }, [asPath]);

  // Also close the overlay if the window gets resized past mobile layout.
  // (This is also important because we don't want to keep the body locked!)
  useEffect(() => {
    const media = window.matchMedia(`(max-width: 768px)`);

    function closeIfNeeded() {
      if (!media.matches) {
        setIsOpen(false);
      }
    }

    closeIfNeeded();
    media.addEventListener('change', closeIfNeeded);
    return () => {
      media.removeEventListener('change', closeIfNeeded);
    };
  }, []);

  const scrollDetectorRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsScrolled(!entry.isIntersecting);
        });
      },
      {
        root: null,
        rootMargin: `0px 0px`,
        threshold: 0,
      }
    );
    observer.observe(scrollDetectorRef.current!);
    return () => observer.disconnect();
  }, []);



  let links: LinkType[] = [{
    name: 'Projects',
    url: '/projects'
  },
  {
    name: 'Journal',
    url: '/blog'
  }];

  if (isProjectPage) {
    links = [{
      name: 'Docs',
      url: `/${project.name.toLowerCase()}/docs`
    },
    {
      name: 'Github',
      url: project.githubUrl,
      external: true,
      icon: githubIcon
    }];
    if (project.showDownloads) {
      links = [{
        name: 'Download',
        url: downloadUrl(project),
        external: true,
      }, ...links];
    }
  }

  return (
    <>
      <div ref={scrollDetectorRef} />
      <div className={thm`flex p-2 pl-5 pr-5 text-sm justify-center $bg-accent-5 dark:$bg-accent-5 top-0 z-20 w-full` + (isProjectPage ? ' sticky' : '')} style={style}>
        <div className='max-w-6xl flex flex-row w-full justify-between'>
          <div className="leading-tight font-semibold flex items-center">
            {showDocsSidebar && <button
              type="button"
              aria-label="Menu"
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                'active:scale-95 transition-transform flex md:hidden rounded-full items-center justify-center mr-5',
                {
                  'text-link dark:text-link-dark': isOpen,
                }
              )}>
              {isOpen ? <IconClose /> : <IconHamburger />}
            </button>}
            <Link className='flex items-center' href="/">
              <Image
                src="/assets/icon/logo.svg"
                width={30}
                height={30}
                className='inline-block mr-2'
                alt="Logo - Rainbow"
              />
              {!isProjectPage && <span>{BRAND_NAME}</span>}
            </Link>
            {isProjectPage && (<>
              <span className='text-xl font-light'>/</span>
              <Link href={`/${project.name.toLowerCase()}`} className='ml-2'>{project.title}</Link>
            </>)}
          </div>
          <div className="leading-tight mt-auto mb-auto flex flex-row items-center">
            <Links links={links} />
            <DarkModeToggle />
          </div>
        </div>
      </div>
      {showDocsSidebar && isOpen && (
        <div
          ref={scrollParentRef}
          className={thm`overflow-y-scroll isolate no-bg-scrollbar w-full h-screen fixed top-0 left-0 $bg-accent-5 dark:$bg-accent-5 z-10`}>
          <aside
            className={cn(
              `lg:grow lg:flex flex-col w-full pb-8 pt-20`,
              isOpen ? 'block' : 'hidden'
            )}>
            <nav
              role="navigation"
              style={{ '--bg-opacity': '.2' } as React.CSSProperties} // Need to cast here because CSS vars aren't considered valid in TS types (cuz they could be anything)
              className="w-full lg:h-auto grow pr-0 lg:pr-5 pt-4 lg:py-6 md:pt-4 lg:pt-4 scrolling-touch scrolling-gpu">
              {/* No fallback UI so need to be careful not to suspend directly inside. */}
              <Suspense fallback={null}>
                <SidebarRouteTree
                  // Don't share state between the desktop and mobile versions.
                  // This avoids unnecessary animations and visual flicker.
                  key={isOpen ? 'mobile-overlay' : 'desktop-or-hidden'}
                  routeTree={docsConfig}
                  theme={theme}
                  isForceExpanded={isOpen}
                />
                {/* Test scrollability */}
                {/* <div style={{height:'1000px'}}></div> */}
              </Suspense>
              <div className="h-16" />
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}

export default Header
