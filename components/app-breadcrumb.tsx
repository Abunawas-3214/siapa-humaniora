'use client'
import { usePathname } from "next/navigation"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { BREADCRUMB_DATA, BreadcrumbItem as NavItem } from '@/lib/nav-data';

type Trail = { title: string; href: string }[];

/**
 * Recursively searches the navigation data for a path matching the current URL.
 * It uses a wildcard (*) match for dynamic segments like IDs.
 */
const findTrail = (
	data: NavItem,
	currentPath: string,
	currentTrail: Trail = []
): Trail | null => {
	// 1. Check for exact match or wildcard match
	const pathToCheck = data.url;

	// Check if the current URL matches the item's URL (handling wildcards)
	// Example: currentPath = /admin/user/123/edit
	//          pathToCheck = /admin/user/*/edit
	const regex = new RegExp(`^${pathToCheck.replace(/\*/g, '[^/]+')}$`);

	if (regex.test(currentPath)) {
		// Match found! Return the trail including this item
		return [...currentTrail, { title: data.title, href: data.url.replace('*', currentPath.split('/').slice(-2)[0]) }];
	}

	// 2. Continue search in children
	if (data.items) {
		// If the current path STARTS with the current item's path, it's a potential parent.
		if (currentPath.startsWith(pathToCheck.replace('*', ''))) {
			const nextTrail = [...currentTrail, { title: data.title, href: pathToCheck }];

			for (const item of data.items) {
				const found = findTrail(item, currentPath, nextTrail);
				if (found) {
					return found;
				}
			}
		}
	}

	return null;
};

export default function AppBreadcrumb() {
	const pathname = usePathname()

	const fullTrail = findTrail(BREADCRUMB_DATA, pathname) || [];

	return (
		<Breadcrumb>
            <BreadcrumbList>
                {fullTrail.map((item, index) => {
                    const isLast = index === fullTrail.length - 1;
                    
                    // In a dynamic setup, the href for non-last items should be the mapped URL
                   return (
                        <span key={item.href} className="flex items-center">
                            <BreadcrumbItem>
                                {isLast ? (
                                    // Current Page (No link)
                                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                ) : (
                                    // Intermediate Links (Link component inside BreadcrumbLink)
                                    <BreadcrumbLink asChild>
                                        <Link href={item.href}>{item.title}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>

                            {/* Conditionally render the separator only if it's NOT the last item */}
                            {!isLast && <BreadcrumbSeparator className="ml-2.5"/>}
                        </span>
                    ); 
                })}
                
                {/* Fallback for routes not in the map (e.g., /admin, if filtered out above) */}
                {fullTrail.length === 0 && (
                    <BreadcrumbItem>
                         <BreadcrumbPage>{BREADCRUMB_DATA.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
	)
}
