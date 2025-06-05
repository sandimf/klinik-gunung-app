import { Button } from "@/Components/ui/button";
import { FileText, Plus } from "lucide-react";
import { Link } from "@inertiajs/react";

const NoScreeningData = ({ detailRouteName }) => (
    <div className="py-12 text-center">
        <div className="mb-4">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
                Tidak ada data screening.
            </h3>
            <p className="mb-6 text-muted-foreground">
                Mulai proses screening Anda untuk mengakses catatan dan hasil
                kesehatan Anda.
            </p>
        </div>
        <Button variant="default" size="lg" asChild>
            <Link href={detailRouteName}>
                <Plus className="w-5 h-5 mr-2" />
                Buat Screening Baru
            </Link>
        </Button>
    </div>
);

export default NoScreeningData;
