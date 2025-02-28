export type navLinksTypes = {
    name: string,
    to: string,
    isScroll: boolean,
    href?: string
}

export const navlinks: navLinksTypes[] = [
    {
        name: "About",
        to: "about",
        isScroll: true
    },
    {
        name: "How it Works",
        to: "howItWorks",
        isScroll: true
    },
    {
        name: "Features",
        to: "features",
        isScroll: true
    },
    {
        name: "FAQs",
        to: "faqs",
        isScroll: true
    },
    {
        name: "Doctors",
        to: "doctors",
        isScroll: false,
        href: "/doctors"
    },
    {
        name: "Patients",
        to: "patients",
        isScroll: false,
        href: "/patients"
    },
]