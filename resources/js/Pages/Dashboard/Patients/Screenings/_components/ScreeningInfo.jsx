import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Users,
    Mail,
    Calendar,
    FileDown,
    ArrowRight,
    CheckCircle,
    Clock,
    AlertCircle,
    Info,
    InfoIcon,
} from "lucide-react";
import { Link } from "@inertiajs/react";

import StatusMessage from "./StatusMessage";

const StatusIcon = ({ status }) => {
    switch (status) {
        case "completed":
            return <CheckCircle className="w-8 h-8 text-green-500" />;
        case "pending":
            return <Clock className="w-8 h-8 text-yellow-500" />;
        case "cancelled":
            return <AlertCircle className="w-8 h-8 text-red-500" />;
        default:
            return null;
    }
};

const ScreeningInfo = ({ screening, detailRouteName, RouteName }) => {
    const handleDownload = () => {
        window.location.href = route(
            "generate.screening.pdf",
            `${screening.id}`
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center text-center md:flex-row md:text-left md:justify-between">
                <div className="flex gap-4 items-center mb-4 md:mb-0">
                    <StatusIcon status={screening.screening_status} />
                    <div>
                        <h2 className="mb-1 text-2xl font-bold">
                            Screening {screening.name}
                        </h2>
                        <StatusMessage
                            status={screening.screening_status}
                            isOnline={screening.answers[0]?.isOnline}
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge
                            className="px-4 py-1 text-sm"
                        >
                            {screening.screening_status}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-3 items-center">
                            <Users className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Nama Lengkap
                                </p>
                                <p className="font-semibold">
                                    {screening.name}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-3 items-center">
                            <Users className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Antrian
                                </p>

                                <p className="font-semibold">
                                    {screening.answers[0]?.queue}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-3 items-center">
                            <Mail className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Email
                                </p>
                                <p className="font-semibold">
                                    {screening.email}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-3 items-center">
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tanggal Screening
                                </p>
                                <p className="font-semibold">
                                    {screening.formatted_created_at}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-3 items-center">
                            <InfoIcon className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status Pemeriksaan
                                </p>
                                <p className="font-semibold">
                                    {screening.screening_status === "Pending"
                                        ? "Menunggu Pemeriksaan"
                                        : screening.screening_status}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-4 justify-end sm:flex-row">
                <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="flex items-center"
                    disabled={
                        screening.screening_status === "Pending" ||
                        screening.payment_status === "Pending"
                    }
                >
                    <FileDown className="mr-2 w-4 h-4" />
                    Download PDF
                </Button>

                <Button asChild>
                    <Link href={detailRouteName}>
                        {RouteName}
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default ScreeningInfo;
