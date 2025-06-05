import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import { Plus } from "lucide-react";

const QuestionerHeader = ({
    title = "Questioner List",
    buttonText = "Buat Kuesioner",
    routeName,
    children,
}) => {
    return (
        <div className="flex flex-wrap justify-between items-center mb-2 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <div className="flex gap-2">
                <Link href={routeName}>
                    <Button className="space-x-1">
                        <Plus />
                        <span>{buttonText}</span>
                    </Button>
                </Link>
            </div>

            {/* Menyediakan children untuk custom elemen */}
            {children && <div className="custom-content">{children}</div>}
        </div>
    );
};

export default QuestionerHeader;
