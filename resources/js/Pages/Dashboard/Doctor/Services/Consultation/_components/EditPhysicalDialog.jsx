import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

export default function EditPhysicalDialog({ exam }) {
  const [open, setOpen] = useState(false);
  const { data, setData, put, processing, errors } = useForm({
    blood_pressure: exam.blood_pressure || "",
    heart_rate: exam.heart_rate || "",
    oxygen_saturation: exam.oxygen_saturation || "",
    respiratory_rate: exam.respiratory_rate || "",
    body_temperature: exam.body_temperature || "",
    physical_assessment: exam.physical_assessment || "",
    reason: exam.reason || "",
    medical_advice: exam.medical_advice || "",
    health_status: exam.health_status || "",
    medical_accompaniment: exam.medical_accompaniment || "",
    consultation: exam.consultation || false,
    doctor_advice: exam.doctor_advice || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('physicalexamination.update', exam.id), {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Edit
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[70vh] flex flex-col sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Pemeriksaan Fisik</DialogTitle>
            <DialogDescription>
              Edit hasil pemeriksaan fisik pasien.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-grow w-full p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="blood_pressure" className="text-right">Tekanan Darah</Label>
                  <Input
                    id="blood_pressure"
                    value={data.blood_pressure}
                    onChange={e => setData("blood_pressure", e.target.value)}
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
                    onChange={e => setData("heart_rate", e.target.value)}
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
                    onChange={e => setData("oxygen_saturation", e.target.value)}
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
                    onChange={e => setData("respiratory_rate", e.target.value)}
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
                    onChange={e => setData("body_temperature", e.target.value)}
                    placeholder="°C"
                    className="col-span-3"
                  />
                  {errors.body_temperature && <p className="text-red-500 text-sm">{errors.body_temperature}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Penilaian fisik</Label>
                  <RadioGroup value={data.physical_assessment} onValueChange={value => setData('physical_assessment', value)} className="col-span-3">
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
                    onChange={e => setData("reason", e.target.value)}
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
                    onChange={e => setData("medical_advice", e.target.value)}
                    placeholder="Saran untuk pasien..."
                    className="col-span-3"
                  />
                  {errors.medical_advice && <p className="text-red-500 text-sm">{errors.medical_advice}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="health_status" className="text-right">Status Kesehatan</Label>
                  <Select
                    value={data.health_status}
                    onValueChange={value => setData('health_status', value)}
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

                {/* <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="doctor_advice" className="text-right">Saran Dokter</Label>
                  <Textarea
                    id="doctor_advice"
                    value={data.doctor_advice}
                    onChange={e => setData("doctor_advice", e.target.value)}
                    placeholder="Saran untuk pasien..."
                    className="col-span-3"
                  />
                  {errors.doctor_advice && <p className="text-red-500 text-sm">{errors.doctor_advice}</p>}
                </div> */}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={processing}>Simpan</Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
} 