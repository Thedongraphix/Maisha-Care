export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="w-full">
            {/* <NavBar /> */}
            <main className="w-full">
                {children}
            </main>
            {/* <ScrollToTopBtn />
            <Footer /> */}
        </section>
    );
}