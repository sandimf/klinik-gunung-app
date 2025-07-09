"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import ParamedisSidebar from "@/Layouts/Dashboard/ParamedisSidebarLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/Components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { router } from "@inertiajs/react";

const PhysicalExaminationSchema = z.object({
    blood_pressure: z.string().min(1, { message: "Tekanan darah wajib diisi." }),
    heart_rate: z.coerce.number({ invalid_type_error: "Detak jantung harus berupa angka." }).min(1, { message: "Detak jantung wajib diisi." }),
    oxygen_saturation: z.coerce.number({ invalid_type_error: "Saturasi oksigen harus berupa angka." }).min(1, { message: "Saturasi oksigen wajib diisi." }),
    respiratory_rate: z.coerce.number({ invalid_type_error: "Laju pernapasan harus berupa angka." }).min(1, { message: "Laju pernapasan wajib diisi." }),
    body_temperature: z.coerce.number({ invalid_type_error: "Suhu tubuh harus berupa angka." }).min(1, { message: "Suhu tubuh wajib diisi." }),
    physical_assessment: z.string().min(1, { message: "Penilaian fisik wajib diisi." }),
    reason: z.string().optional(),
    medical_advice: z.string().optional(),
    health_status: z.enum(["sehat", "tidak_sehat"]),
});

export default function PhysicalExaminationEdit({ examination }) {
    const form = useForm({
        resolver: zodResolver(PhysicalExaminationSchema),
        defaultValues: {
            blood_pressure: examination.blood_pressure || "",
            heart_rate: examination.heart_rate || "",
            oxygen_saturation: examination.oxygen_saturation || "",
            respiratory_rate: examination.respiratory_rate || "",
            body_temperature: examination.body_temperature || "",
            physical_assessment: examination.physical_assessment || "",
            reason: examination.reason || "",
            medical_advice: examination.medical_advice || "",
            health_status: examination.health_status || "sehat",
        },
        mode: "onChange", // <-- ini kuncinya
    });

    function onSubmit(data) {
        router.put(route("update.examinations", examination.id), data, {
            onSuccess: () => {
            },
        });
    }

    return (
        <ParamedisSidebar header={'Edit Pemeriksaan Fisik'}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Edit Pemeriksaan Fisik
                    </CardTitle>
                    <CardDescription>
                        Ubah data pemeriksaan fisik pasien sesuai hasil terbaru.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Tekanan Darah</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="blood_pressure"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel hidden>Tekanan Darah</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="120/80" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Detak Jantung</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="heart_rate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel hidden>Detak Jantung</FormLabel>
                                                        <FormControl>
                                                            <Input  {...field} placeholder="80" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Saturasi Oksigen</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="oxygen_saturation"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel hidden>Saturasi Oksigen</FormLabel>
                                                        <FormControl>
                                                            <Input  {...field} placeholder="98" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Laju Pernapasan</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="respiratory_rate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel hidden>Laju Pernapasan</FormLabel>
                                                        <FormControl>
                                                            <Input  {...field} placeholder="16" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Suhu Tubuh</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="body_temperature"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel hidden>Suhu Tubuh</FormLabel>
                                                        <FormControl>
                                                            <Input step="0.1" {...field} placeholder="36.5" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Penilaian Fisik</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="physical_assessment"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel hidden>Penilaian Fisik</FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                value={field.value}
                                                                onValueChange={field.onChange}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Pilih penilaian fisik" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="sangat_baik">Sangat Baik</SelectItem>
                                                                    <SelectItem value="cukup_baik">Cukup Baik</SelectItem>
                                                                    <SelectItem value="tidak_direkomendasikan">Tidak Direkomendasikan</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Alasan</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="reason"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel hidden>Alasan</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="Alasan" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Saran Medis</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="medical_advice"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel hidden>Saran Medis</FormLabel>
                                                        <FormControl>
                                                            <Textarea {...field} placeholder="Saran Medis" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Status Kesehatan</TableCell>
                                        <TableCell>
                                            <FormField
                                                control={form.control}
                                                name="health_status"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel hidden>Status Kesehatan</FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                value={field.value}
                                                                onValueChange={field.onChange}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Pilih status kesehatan" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="sehat">Sehat</SelectItem>
                                                                    <SelectItem value="tidak_sehat">Tidak Sehat</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <div className="flex justify-end mt-6">
                                <Button type="submit">
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </ParamedisSidebar>
    );
}
