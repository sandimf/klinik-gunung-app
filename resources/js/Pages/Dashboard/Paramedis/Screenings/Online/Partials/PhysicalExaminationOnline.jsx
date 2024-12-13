import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Button } from "@/Components/ui/button";
import { useForm, usePage } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

const ScreeningDialog = ({ isOpen, setIsOpen, onSuccess, examiningScreening }) => {
  const user = usePage().props.auth.user;
  const { data, setData, post, processing, errors, reset } = useForm({
    patient_id: '',
    examiner_id: user.id,
    examiner_type: user.role === 'paramedis' ? 'paramedis' : 'doctor',
    blood_pressure: '',
    heart_rate: '',
    oxygen_saturation: '',
    respiratory_rate: '',
    body_temperature: '',
    physical_assessment: '',
    reason: '',
    medical_advice: '',
    health_status: '',
  });

  useEffect(() => {
    if (examiningScreening && examiningScreening.id) {
      setData('patient_id', examiningScreening.id);
    }
  }, [examiningScreening, setData]);

  const handleSaveExamination = (e) => {
    e.preventDefault();
    if (!data.patient_id) {
      console.error('Patient ID is missing');
      return;
    }
    post(route('physicalexamination-online.store'), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        onSuccess();
        setIsOpen(false);
        reset();
      },
      onError: (errors) => {
        console.error('Error occurred while saving examination:', errors);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pemeriksaan Fisik Online</DialogTitle>
          <DialogDescription>
            Masukkan hasil pemeriksaan fisik untuk {examiningScreening?.name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSaveExamination}>
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
              {errors.blood_pressure && <p className="text-red-500 text-sm col-span-4">{errors.blood_pressure}</p>}
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
              {errors.heart_rate && <p className="text-red-500 text-sm col-span-4">{errors.heart_rate}</p>}
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
              {errors.oxygen_saturation && <p className="text-red-500 text-sm col-span-4">{errors.oxygen_saturation}</p>}
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
              {errors.respiratory_rate && <p className="text-red-500 text-sm col-span-4">{errors.respiratory_rate}</p>}
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
              {errors.body_temperature && <p className="text-red-500 text-sm col-span-4">{errors.body_temperature}</p>}
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
              {errors.physical_assessment && <p className="text-red-500 text-sm col-span-4">{errors.physical_assessment}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">Alasan (jika tidak direkomendasikan)</Label>
              <Input
                id="reason"
                value={data.reason}
                onChange={(e) => setData('reason', e.target.value)}
                className="col-span-3"
              />
              {errors.reason && <p className="text-red-500 text-sm col-span-4">{errors.reason}</p>}
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
              {errors.medical_advice && <p className="text-red-500 text-sm col-span-4">{errors.medical_advice}</p>}
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
                  <SelectItem value="healthy">Sehat</SelectItem>
                  <SelectItem value="butuh_dokter">Butuh Dokter</SelectItem>
                  <SelectItem value="butuh_pendamping">Butuh Pendamping</SelectItem>
                </SelectContent>
              </Select>
              {errors.health_status && <p className="text-red-500 text-sm col-span-4">{errors.health_status}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={processing || !data.patient_id}>Simpan Pemeriksaan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScreeningDialog;

