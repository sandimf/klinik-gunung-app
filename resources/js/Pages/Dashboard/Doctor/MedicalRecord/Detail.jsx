import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { CalendarDays, FileText, Phone, MapPin } from "lucide-react";
import DoctorSidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { Head } from "@inertiajs/react";

export default function MedicalRecordDetail({ medicalRecord }) {
    return (
        <DoctorSidebar header={`Medical Record ${medicalRecord.patient?.name}`}>
            <Head title="Medical Record"/>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                            src={
                                medicalRecord.patient?.user?.avatar
                                    ? medicalRecord.patient?.user.avatar.startsWith(
                                          "http"
                                      )
                                        ? medicalRecord.patient.user.avatar
                                        : `/storage/${user.avatar}`
                                    : "/storage/avatar/avatar.svg"
                            }
                            alt={medicalRecord.patient.name || "Klinik gunung"}
                        />
                        <AvatarFallback>
                            {medicalRecord.patient?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <CardTitle className="text-2xl">
                            {medicalRecord.patient?.name || "N/A"}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">
                                {medicalRecord.medical_record_number || "N/A"}
                            </Badge>
                            <span>{medicalRecord.patient?.age} Tahun</span>
                            <span>
                                {medicalRecord.patient?.gender === "Male"
                                    ? "Laki-laki"
                                    : medicalRecord.patient?.gender === "Female"
                                    ? "Perempuan"
                                    : "Tidak Diketahui"}
                            </span>
                            <Badge>{medicalRecord.patient.bloodType}</Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{medicalRecord.patient.contact}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{medicalRecord.patient.address}</span>
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-semibold mb-2">Informasi Pasien</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Nama
                                </p>
                                <p>{medicalRecord.patient?.name || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    NIK
                                </p>
                                <p>{medicalRecord.patient?.nik}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tempat Lahir
                                </p>
                                <p>
                                    {medicalRecord.patient.place_of_birth ||
                                        "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Alamat
                                </p>
                                <p>
                                    RT/RW:{" "}
                                    {medicalRecord.patient?.rt_rw || "N/A"},{" "}
                                    Kel/Desa:{" "}
                                    {medicalRecord.patient?.village || "N/A"},{" "}
                                    Kecamatan:
                                    {medicalRecord.patient?.district || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Agama
                                </p>
                                <p>
                                    {medicalRecord.patient?.religion || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status Perkawinan
                                </p>
                                <div className="flex gap-1 flex-wrap">
                                    {medicalRecord.patient?.marital_status ||
                                        "N/A"}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Pekerjaan
                                </p>
                                <div className="flex gap-1 flex-wrap">
                                    {medicalRecord.patient?.occupation || "N/A"}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Kewarganegaraan
                                </p>
                                <div className="flex gap-1 flex-wrap">
                                    {medicalRecord.patient?.nationality ||
                                        "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Medical Informasi */}
                    <Separator />
                    <div>
                        <h3 className="font-semibold mb-2">
                            Informasi Pemeriksaan Fisik
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tekanan Darah
                                </p>
                                <p>
                                    {medicalRecord.physical_examination
                                        ?.blood_pressure || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Denyut Jantung
                                </p>
                                <p>
                                    {medicalRecord.physical_examination
                                        ?.heart_rate || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Saturasi Oksigen
                                </p>
                                <p>
                                    {medicalRecord.physical_examination
                                        ?.oxygen_saturation || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Frekuensi Nafas
                                </p>
                                <p>
                                    {medicalRecord.physical_examination
                                        ?.respiratory_rate || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Suhu Tubuh
                                </p>
                                <p>
                                    {medicalRecord.physical_examination
                                        ?.body_temperature || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status Kesehatan
                                </p>
                                <div className="flex gap-1 flex-wrap">
                                    {medicalRecord.physical_examination
                                        ?.health_status || "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informasi Pasien */}

                    <Separator />
                </CardContent>
            </Card>
        </DoctorSidebar>
    );
}
