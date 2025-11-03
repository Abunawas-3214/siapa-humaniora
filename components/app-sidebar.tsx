'use client'
import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useState, useEffect } from "react"
import { NavUser } from "./nav-user"
import { useSession } from "next-auth/react"
import { VersionSwitcher } from "@/components/version-switcher"

// -------------------
// TYPES
// -------------------
interface NavItem {
  title: string
  url: string
  isActive: boolean
  mustAdmin?: boolean
}

interface NavGroup {
  title: string
  url: string
  mustAdmin?: boolean
  items: NavItem[]
}

interface NavData {
  versions: string[]
  navMain: NavGroup[]
}

// -------------------
// NAV DATA
// -------------------
const data: NavData = {
  versions: ["1.0.1"],
  navMain: [
    {
      title: "Persuratan",
      url: "#",
      items: [
        { title: "Dashboard", url: "/admin", isActive: false },
        { title: "Surat Masuk", url: "/admin/surat-masuk*", isActive: false },
        { title: "Surat Keluar", url: "/admin/surat-keluar", isActive: false, mustAdmin: true},
      ],
    },
    {
      title: "Manajemen",
      url: "#",
      mustAdmin: true, // 👈 Hide entire group for non-admin
      items: [
        {
          title: "User",
          url: "/admin/user*",
          isActive: false,
          mustAdmin: true, // 👈 Hide item for non-admin
        },
      ],
    },
  ],
}

// -------------------
// SIDEBAR COMPONENT
// -------------------
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [navData, setNavData] = useState<NavData>(data)
  const { data: session } = useSession()

  const isAdmin = session?.user?.isAdmin || session?.user?.isSuperAdmin || false

  useEffect(() => {
    const updatedNavData: NavData = {
      ...data,
      navMain: data.navMain
        .filter((group) => !group.mustAdmin || isAdmin) // Hide group if mustAdmin
        .map((group) => ({
          ...group,
          items: group.items
            .filter((item) => !item.mustAdmin || isAdmin) // Hide items if mustAdmin
            .map((item) => {
              if (item.url.endsWith("*")) {
                const baseUrl = item.url.slice(0, -1)
                return { ...item, isActive: pathname.startsWith(baseUrl) }
              }
              return { ...item, isActive: item.url === pathname }
            }),
        })),
    }

    setNavData(updatedNavData)
  }, [pathname, isAdmin])

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
      </SidebarHeader>

      <SidebarContent>
        {navData.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link href={item.url.replace("*", "")}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {session && (
        <SidebarFooter>
          <NavUser
            user={{
              id: session.user.id,
              name: session.user.name ?? "Unknown User",
              email: session.user.email ?? "Unknown Email",
              avatar: session.user.image ?? undefined,
            }}
          />
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  )
}
