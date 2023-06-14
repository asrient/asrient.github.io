import { useRef, useLayoutEffect, Fragment } from 'react';

import cn from 'classnames';
import { useRouter } from 'next/router';
import { SidebarLink } from './SidebarLink';
import { useCollapse } from 'react-collapsed';
import usePendingRoute from '../../hooks/usePendingRoute';
import RouteItem from '../../interfaces/routeItem';
import Link from 'next/link';
import { themed } from '../../lib/utils';


interface SidebarRouteTreeProps {
    isForceExpanded: boolean;
    routeTree: RouteItem;
    level?: number;
    theme: string;
}

function CollapseWrapper({
    isExpanded,
    duration,
    children,
}: {
    isExpanded: boolean;
    duration: number;
    children: any;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const timeoutRef = useRef<number | null>(null);
    const { getCollapseProps } = useCollapse({
        isExpanded,
        duration,
    });

    // Disable pointer events while animating.
    const isExpandedRef = useRef(isExpanded);
    if (typeof window !== 'undefined') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useLayoutEffect(() => {
            const wasExpanded = isExpandedRef.current;
            if (wasExpanded === isExpanded) {
                return;
            }
            isExpandedRef.current = isExpanded;
            if (ref.current !== null) {
                const node: HTMLDivElement = ref.current;
                node.style.pointerEvents = 'none';
                if (timeoutRef.current !== null) {
                    window.clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = window.setTimeout(() => {
                    node.style.pointerEvents = '';
                }, duration + 100);
            }
        });
    }

    return (
        <div
            ref={ref}
            className={cn(isExpanded ? 'opacity-100' : 'opacity-50')}
            style={{
                transition: `opacity ${duration}ms ease-in-out`,
            }}>
            <div {...getCollapseProps()}>{children}</div>
        </div>
    );
}

function Selectable({
    children,
    isSelected,
    theme
}: {
    children: any;
    isSelected: boolean;
    theme: string;
}) {
    const thm = themed(theme);

    let cls = '';
    if (isSelected) {
        cls += thm`rounded $bg-accent-4 border-l-4 $border-accent-2 border-solid`;
    }
    return (
        <div className={cls}>
            {children}
        </div>
    );
}

export function SidebarRouteTree({
    isForceExpanded,
    routeTree,
    level = 0,
    theme,
}: SidebarRouteTreeProps) {
    const slug = useRouter().asPath.split(/[\?\#]/)[0];
    const pendingRoute = usePendingRoute();
    const currentRoutes = routeTree.routes as RouteItem[];
    const body = (
        <ul>
            {currentRoutes.map(({ title, routes, path }, index) => {
                const selected = slug === path;
                const isExpanded = isForceExpanded || selected || slug.startsWith(path + '/');
                let listItem = null;
                if (level === 0) {
                    // if current route item has no path and children treat it as an API sidebar heading
                    listItem = (<Fragment key={`${title}-${level}-separator`}>
                        {index !== 0 && (
                            <li
                                role="separator"
                                className="mt-4 mb-2 ml-5 border-b border-border dark:border-border-dark"
                            />
                        )}
                        <Selectable isSelected={selected} theme={theme}>
                            <SidebarLink
                                key={`${title}-${path}-${level}-link`}
                                href={path}
                                isPending={pendingRoute === path}
                                selected={selected}
                                level={level}
                                title={title}
                                wip={false}
                                isExpanded={isExpanded}
                                hideArrow={true}
                            />
                        </Selectable>
                        <SidebarRouteTree
                            level={level + 1}
                            theme={theme}
                            isForceExpanded={isForceExpanded}
                            routeTree={{ title, routes, path } as RouteItem}
                        />
                    </Fragment>);
                } else if (routes.length == 1) {
                    // if route has a path and child routes, treat it as an expandable sidebar item
                    listItem = (
                        <li key={`${title}-${path}-${level}-heading`}>
                            <Selectable isSelected={selected} theme={theme}>
                                <SidebarLink
                                    key={`${title}-${path}-${level}-link`}
                                    href={path}
                                    isPending={pendingRoute === path}
                                    selected={selected}
                                    level={level}
                                    title={title}
                                    wip={false}
                                    isExpanded={isExpanded}
                                    hideArrow={isForceExpanded}
                                />
                            </Selectable>
                            <CollapseWrapper duration={250} isExpanded={isExpanded}>
                                <SidebarRouteTree
                                    isForceExpanded={isForceExpanded}
                                    routeTree={{ title, routes, path } as RouteItem}
                                    level={level + 1}
                                    theme={theme}
                                />
                            </CollapseWrapper>
                        </li>
                    );
                } else {
                    // if route has a path and no child routes, treat it as a sidebar link
                    listItem = (
                        <li key={`${title}-${path}-${level}-link`}>
                            <Selectable isSelected={selected} theme={theme}>
                                <SidebarLink
                                    isPending={pendingRoute === path}
                                    href={path}
                                    selected={selected}
                                    level={level}
                                    title={title}
                                    wip={false}
                                />
                            </Selectable>
                        </li>
                    );
                }
                return listItem;
            }
            )}
        </ul>
    );
    if (level === 0) {
        return (
            <>
                <div className='text-2xl font-bold text-black px-4 pb-3'>Documentation</div>
                {body}
            </>
        );
    }
    return body;
}