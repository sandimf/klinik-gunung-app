import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { MoreHorizontal, FileText,ClipboardPlus } from "lucide-react";
import { Separator } from "@/Components/ui/separator";
import DoctorSidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { Input } from "@/Components/ui/input";
import { Head } from "@inertiajs/react";


export default function MedicalRecord() {
    return (
        <DoctorSidebar>
            <Head title="Medical Record" />
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Medical Record
                </h1>
                <p className="text-muted-foreground">
                    Here&apos;s a list of your apps for the integration!
                </p>
            </div>
            <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
                <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
                    <Input
                        placeholder="Patients Name or Medical Number ..."
                        className="h-9 w-40 lg:w-[250px]"
                        value=""
                        onChange=""
                    />
                    <Button>
                        <ClipboardPlus/>
                        New Medical Record
                    </Button>
                </div>
            </div>
            <Separator className="shadow" />
            <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
                <li
                    key="name"
                    className="rounded-lg border p-4 hover:shadow-md"
                >
                    <div className="mb-8 flex items-center justify-between">
                        <div
                            className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                        >
                            P
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span>Lihat Detail</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Edit Record</DropdownMenuItem>
                                <DropdownMenuItem>
                                    Jadwalkan Tindak Lanjut
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <h2 className="mb-1 font-semibold">
                            Sandi Maulana Fauzan
                        </h2>
                        <p className="line-clamp-2 text-gray-500">Sini</p>
                    </div>
                </li>
            </ul>
        </DoctorSidebar>
    );
}
