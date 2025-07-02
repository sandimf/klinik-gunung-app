import { Link } from "@inertiajs/react";
import Header from "@/Components/Navbar";
import { Head } from "@inertiajs/react";

export default function Welcome() {
    return (
        <div className="flex flex-col min-h-[100dvh]">
            <Head title="Welcome" />
            <Header />
            <main className="flex-1">
                <section className="py-12 w-full md:py-24 lg:py-32">
                    <div className="flex flex-col justify-center items-center space-y-4 text-center">
                        <div className="flex flex-col justify-center items-center space-y-4 text-center">
                            <div className="flex flex-col justify-center items-center space-y-4 text-center">
                                <div className="flex flex-col justify-center items-center space-y-4 text-center">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        Klinik Gunung
                                    </h1>
                                    <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                                        Lorem ipsum dolor, sit amet consectetur
                                        adipisicing elit. Cupiditate quos
                                        quaerat provident neque nam asperiores
                                        vero sequi delectus.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link
                                        href={route("screening-now.index")}
                                        className="inline-flex justify-center items-center px-8 h-10 text-sm font-medium text-gray-50 bg-gray-900 rounded-md shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                                        prefetch={false}
                                    >
                                        Screening Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 items-center px-4 py-6 w-full border-t sm:flex-row shrink-0 md:px-6">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    &copy; 2025 Acme Inc. All rights reserved.
                </p>
                <nav className="flex gap-4 sm:ml-auto sm:gap-6">
                    <Link
                        href="#"
                        className="text-xs hover:underline underline-offset-4"
                        prefetch={false}
                    >
                        Terms of Service
                    </Link>
                    <Link
                        href="#"
                        className="text-xs hover:underline underline-offset-4"
                        prefetch={false}
                    >
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    );
}

function InfinityIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" />
        </svg>
    );
}

function InfoIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    );
}

function MountainIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    );
}

function UserPlusIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="22" x2="16" y1="11" y2="11" />
        </svg>
    );
}
