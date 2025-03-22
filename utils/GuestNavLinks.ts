export type navLinksTypes = {
    name: string;
    to: string;
    isScroll?: boolean;
    href?: string;
    hasDropdown?: boolean;
    dropdownItems?: {
        name: string;
        href: string;
        description?: string;
    }[];
}

export const navlinks: navLinksTypes[] = [
    {
        name: "home",
        to: "home",
        isScroll: true
    },
    {
        name: "about",
        to: "about",
        isScroll: true
    },
    {
        name: "features",
        to: "features",
        isScroll: true
    },
    {
        name: "testimonials",
        to: "testimonials",
        isScroll: true
    },
    {
        name: "faqs",
        to: "faqs",
        isScroll: true
    },
    
    {
        name: "Consultation",
        to: "consultation",
        isScroll: false,
        href: "/consultation"
    },
    {
        name: "Patients",
        to: "patients",
        isScroll: false,
        href: "/patients/login"
    },
    {
        name: "Resources",
        to: "resources",
        isScroll: false,
        hasDropdown: true,
        dropdownItems: [
            {
                name: "Documentation",
                href: "/docs",
                description: "Development guides and resources"
            },
            {
                name: "API Reference",
                href: "/api-reference",
                description: "Complete API documentation"
            }
        ]
    },
    {
        name: "Doctors",
        to: "doctors",
        isScroll: false,
        href: "/doctors"
    }
];