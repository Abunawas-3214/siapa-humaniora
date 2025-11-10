// src/lib/nav-data.ts

export type BreadcrumbItem = {
    title: string;
    url: string;
    items?: BreadcrumbItem[];
};

export const BREADCRUMB_DATA: BreadcrumbItem = {
    title: "Dashboard",
    url: "/admin",
    items: [
        {
            title: "Surat Masuk",
            url: "/admin/surat-masuk",
            items: [
                { title: "Tambah", url: "/admin/surat-masuk/tambah" },
                // Use a wildcard (*) to match any ID segment
                { title: "Edit", url: "/admin/surat-masuk/*/edit" }
            ]
        },
        {
            title: "Surat Keluar",
            url: "/admin/surat-keluar",
            items: [
                { title: "Tambah", url: "/admin/surat-keluar/tambah" },
                // Use a wildcard (*) to match any ID segment
                { title: "Edit", url: "/admin/surat-keluar/*/edit" }
            ]
        },
        {
            title: "User Management",
            url: "/admin/user",
            items: [
                { title: "Tambah", url: "/admin/user/tambah" },
                { title: "Edit", url: "/admin/user/*/edit" }
            ]
        },
        // Add other main sections here
    ]
};