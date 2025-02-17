import { Button } from "@/Components/ui/button";
import { FileText, Plus } from "lucide-react";
import { Link } from '@inertiajs/react';

const NoScreeningData = ({ detailRouteName }) => (
    <div className="text-center py-12">
        <div className="mb-4">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tidak ada data screening.</h3>
            <p className="text-muted-foreground mb-6">
                Mulai proses screening Anda untuk mengakses catatan dan hasil kesehatan Anda.
            </p>
        </div>
        <Button variant="default" size="lg" asChild>
            <Link href={detailRouteName}>
                <Plus className="h-5 w-5 mr-2" />
                Start New Screening
            </Link>
        </Button>
    </div>
);

export default NoScreeningData;
