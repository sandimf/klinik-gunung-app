import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Button } from "@/Components/ui/button";
import { useForm, usePage } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Checkbox } from '@/Components/ui/checkbox';
import { ScrollArea } from "@/Components/ui/scroll-area";
const ScreeningDialog = ({ isOpen, setIsOpen, onSuccess, examiningScreening }) => {
    const { auth } = usePage().props;
    const user = auth.user;
    const paramedis = auth.paramedis;
    const { data, setData, post, processing, errors, reset } = useForm({
        paramedis_id: paramedis[0].id,
        patient_id: '',
        blood_pressure: '',
        heart_rate: '',
        oxygen_saturation: '',
        respiratory_rate: '',
        body_temperature: '',
        physical_assessment: '',
        reason: '',
        medical_advice: '',
        health_status: '',
        konsultasi_dokter: '',
        pendampingan: '',
    });

    useEffect(() => {
        if (examiningScreening?.id) {
            setData('patient_id', examiningScreening.id);
        }
    }, [examiningScreening, setData]);

    const handleSaveExamination = (e) => {
        e.preventDefault();
        post(route('physicalexamination.store'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
                setIsOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="h-[70vh] flex flex-col sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Pemeriksaan Fisik</DialogTitle>
                    <DialogDescription>
                        Masukkan hasil pemeriksaan fisik untuk {examiningScreening?.name}.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-grow w-full p-4">
                    <div className="">
                        <form onSubmit={handleSaveExamination} className="w-full">
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="blood_pressure" className="text-right">Tekanan Darah</Label>
                                    <Input
                                        id="blood_pressure"
                                        value={data.blood_pressure}
                                        onChange={(e) => setData('blood_pressure', e.target.value)}
                                        placeholder="mmHg"
                                        className="col-span-3"
                                    />
                                    {errors.blood_pressure && <p className="text-red-500 text-sm">{errors.blood_pressure}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="heart_rate" className="text-right">Detak Jantung</Label>
                                    <Input
                                        id="heart_rate"
                                        value={data.heart_rate}
                                        onChange={(e) => setData('heart_rate', e.target.value)}
                                        placeholder="BPM"
                                        className="col-span-3"
                                    />
                                    {errors.heart_rate && <p className="text-red-500 text-sm">{errors.heart_rate}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="oxygen_saturation" className="text-right">Saturasi Oksigen</Label>
                                    <Input
                                        id="oxygen_saturation"
                                        value={data.oxygen_saturation}
                                        onChange={(e) => setData('oxygen_saturation', e.target.value)}
                                        placeholder="%"
                                        className="col-span-3"
                                    />
                                    {errors.oxygen_saturation && <p className="text-red-500 text-sm">{errors.oxygen_saturation}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="respiratory_rate" className="text-right">Frekuensi Napas</Label>
                                    <Input
                                        id="respiratory_rate"
                                        value={data.respiratory_rate}
                                        onChange={(e) => setData('respiratory_rate', e.target.value)}
                                        placeholder="breaths per minute"
                                        className="col-span-3"
                                    />
                                    {errors.respiratory_rate && <p className="text-red-500 text-sm">{errors.respiratory_rate}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="body_temperature" className="text-right">Suhu Tubuh</Label>
                                    <Input
                                        id="body_temperature"
                                        value={data.body_temperature}
                                        onChange={(e) => setData('body_temperature', e.target.value)}
                                        placeholder="°C"
                                        className="col-span-3"
                                    />
                                    {errors.body_temperature && <p className="text-red-500 text-sm">{errors.body_temperature}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Penilaian fisik</Label>
                                    <RadioGroup value={data.physical_assessment} onValueChange={(value) => setData('physical_assessment', value)} className="col-span-3">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="sangat_baik" id="sangat_baik" />
                                            <Label htmlFor="sangat_baik">Sangat baik</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="cukup_baik" id="cukup_baik" />
                                            <Label htmlFor="cukup_baik">Cukup baik</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="tidak_direkomendasikan" id="tidak_direkomendasikan" />
                                            <Label htmlFor="tidak_direkomendasikan">Tidak direkomendasikan</Label>
                                        </div>
                                    </RadioGroup>
                                    {errors.physical_assessment && <p className="text-red-500 text-sm">{errors.physical_assessment}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="reason" className="text-right">Alasan (jika tidak direkomendasikan)</Label>
                                    <Input
                                        id="reason"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        placeholder="Alasan (jika tidak direkomendasikan)"
                                        className="col-span-3"
                                    />
                                    {errors.reason && <p className="text-red-500 text-sm">{errors.reason}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="medical_advice" className="text-right">Saran Medis</Label>
                                    <Textarea
                                        id="medical_advice"
                                        value={data.medical_advice}
                                        onChange={(e) => setData('medical_advice', e.target.value)}
                                        placeholder="Saran untuk pasien..."
                                        className="col-span-3"
                                    />
                                    {errors.medical_advice && <p className="text-red-500 text-sm">{errors.medical_advice}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="health_status" className="text-right">Status Kesehatan</Label>
                                    <Select
                                        value={data.health_status}
                                        onValueChange={(value) => setData('health_status', value)}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Pilih status kesehatan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sehat">Sehat</SelectItem>
                                            <SelectItem value="tidak_sehat">Tidak Sehat</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.health_status && <p className="text-red-500 text-sm col-span-4">{errors.health_status}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="health_status" className="text-right">Pendampingan (Opsional)</Label>
                                    <Select
                                        value={data.pendampingan}
                                        onValueChange={(value) => setData('pendampingan', value)}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Pilih Pendampingan" />
                                        </SelectTrigger>
                                        <SelectContent>

                                            <SelectItem value="pendampingan_perawat">Pendampingan Perawat</SelectItem>
                                            <SelectItem value="pendampingan_paramedis">Pendampingan Paramedis</SelectItem>
                                            <SelectItem value="pendampingan_dokter">Pendampingan Dokter</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.pendampingan && <p className="text-red-500 text-sm col-span-4">{errors.pendampingan}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="konsultasi_dokter" className="text-right">Konsultasi Dokter</Label>
                                    <Checkbox id="konsultasi_dokter" checked={!!data.konsultasi_dokter} onCheckedChange={(value) => setData('konsultasi_dokter', value ? 1 : 0)} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={processing}>Simpan Pemeriksaan</Button>
                            </DialogFooter>
                        </form>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ScreeningDialog;
