import AppLogoIcon from "@/Components/app-logo-icon";
import { Link } from "@inertiajs/react";

export default function AuthSimpleLayout({ children, title, description }) {
    return (
        <div className="flex flex-col gap-6 justify-center items-center p-6 bg-background min-h-svh md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4 items-center">
                        <Link
                            href={route("dashboard")}
                            className="flex flex-col gap-2 items-center font-medium"
                        >
                            <div className="flex justify-center items-center mb-1 w-9 h-9 rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-sm text-center text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
