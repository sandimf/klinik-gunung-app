"use client";

import { useState } from "react";
import { useRouter } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import ParamedisSidebar from "@/Layouts/Dashboard/ParamedisSidebarLayout";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Toaster, toast } from "sonner";

export default function PhysicalExaminationEdit({ examination }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        blood_pressure: examination.blood_pressure || "",
        heart_rate: examination.heart_rate || 0,
        oxygen_saturation: examination.oxygen_saturation || 0,
        respiratory_rate: examination.respiratory_rate || 0,
        body_temperature: examination.body_temperature || 0,
        physical_assessment: examination.physical_assessment || "",
        reason: examination.reason || "",
        medical_advice: examination.medical_advice || "",
        health_status: examination.health_status || "healthy",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "heart_rate" || name === "respiratory_rate" || name === "body_temperature" || name === "oxygen_saturation"
                ? Math.max(0, value) // Validasi agar nilai tidak negatif
                : value,
        }));
    };

    const handleSelectChange = (value) => {
        setFormData((prev) => ({ ...prev, health_status: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route("examinations.update", examination.id), formData, {
            onSuccess: () => {
                toast.success("Examination updated successfully!");
            },
            onError: () => {
                toast.error("Failed to update examination.");
            },
        });
    };

    return (
        <ParamedisSidebar>
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit Physical Examination</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="blood_pressure">Blood Pressure</Label>
                            <Input
                                id="blood_pressure"
                                name="blood_pressure"
                                value={formData.blood_pressure}
                                onChange={handleChange}
                                aria-label="Blood Pressure"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="heart_rate">Heart Rate</Label>
                            <Input
                                type="number"
                                id="heart_rate"
                                name="heart_rate"
                                value={formData.heart_rate}
                                onChange={handleChange}
                                aria-label="Heart Rate"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="oxygen_saturation">Oxygen Saturation</Label>
                            <Input
                                type="number"
                                id="oxygen_saturation"
                                name="oxygen_saturation"
                                value={formData.oxygen_saturation}
                                onChange={handleChange}
                                aria-label="Oxygen Saturation"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="respiratory_rate">Respiratory Rate</Label>
                            <Input
                                type="number"
                                id="respiratory_rate"
                                name="respiratory_rate"
                                value={formData.respiratory_rate}
                                onChange={handleChange}
                                aria-label="Respiratory Rate"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="body_temperature">Body Temperature</Label>
                            <Input
                                type="number"
                                id="body_temperature"
                                name="body_temperature"
                                value={formData.body_temperature}
                                onChange={handleChange}
                                step="0.1"
                                aria-label="Body Temperature"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="physical_assessment">Physical Assessment</Label>
                            <Textarea
                                id="physical_assessment"
                                name="physical_assessment"
                                value={formData.physical_assessment}
                                onChange={handleChange}
                                aria-label="Physical Assessment"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason</Label>
                            <Input
                                id="reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                aria-label="Reason"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="medical_advice">Medical Advice</Label>
                            <Textarea
                                id="medical_advice"
                                name="medical_advice"
                                value={formData.medical_advice}
                                onChange={handleChange}
                                aria-label="Medical Advice"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="health_status">Health Status</Label>
                            <Select
                                value={formData.health_status}
                                onValueChange={handleSelectChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select health status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="healthy">Healthy</SelectItem>
                                    <SelectItem value="butuh_dokter">Butuh Dokter</SelectItem>
                                    <SelectItem value="butuh_pendamping">Butuh Pendamping</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit">Update Physical Examination</Button>
                    </form>
                </CardContent>
                <Toaster />
            </Card>
        </ParamedisSidebar>
    );
}
