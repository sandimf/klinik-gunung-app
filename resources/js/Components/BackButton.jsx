import { ArrowLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/inertia-react";

export default function BackButton({ href }) {
    return (
        <Link href={href}>
            <Button variant="outline" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>
        </Link>
    );
} 