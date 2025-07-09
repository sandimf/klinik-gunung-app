import { Eye } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/inertia-react";

export default function ViewDetailButton({ href, label = "Lihat Detail" }) {
    return (
        <Link href={href}>
            <Button size="sm">
                <Eye className="mr-2" />
                {label}
            </Button>
        </Link>
    );
} 