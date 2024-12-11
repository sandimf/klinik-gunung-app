import { Head, Link } from "@inertiajs/react";

export default function Welcome() {
    return (
        <>
        <Head title="Home" />
            <h1 className="font-bold">Klinik Gunung</h1>
            <Link href={route("login")}>Login</Link>
        </>
    );
}
