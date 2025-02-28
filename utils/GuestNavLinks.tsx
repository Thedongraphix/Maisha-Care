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
    }
]