export type navLinksTypes = {
    name: string;
    to: string;
    isScroll?: boolean;
    href?: string;
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
        name: "Patients",
        to: "patients",
        isScroll: false,
        href: "/patients"
    },
    {
        name: "Doctors",
        to: "doctors",
        isScroll: false,
        href: "/doctors"
    }
];