import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import Sidebar from "@/Layouts/Dashboard/PatientsSidebarLayout";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";

export default function DataPatients({ patient }) {
    const { data, setData, post, processing, errors } = useForm({
        nik: patient?.nik || "",
        name: patient?.name || "",
        email: patient?.email || "",
        age: patient?.age || "",
        gender: patient?.gender || "",
        contact: patient?.contact || "",
    });

    const isReadOnly = Boolean(patient);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("information.store"));
    };

    return (
        <Sidebar header={"Patient Information"}>
          <Head title="Information"/>
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>!</AlertTitle>
                <AlertDescription>
                    Mohon masukan data sebelum mengakses menu lainnya, Terimakasih
                </AlertDescription>
            </Alert>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="nik">NIK</Label>
                    <Input
                        id="nik"
                        value={data.nik}
                        onChange={(e) => setData("nik", e.target.value)}
                        readOnly={isReadOnly}
                        required
                    />
                    {errors.nik && <p className="text-red-600">{errors.nik}</p>}
                </div>
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        readOnly={isReadOnly}
                        required
                    />
                    {errors.name && (
                        <p className="text-red-600">{errors.name}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        readOnly={isReadOnly}
                        required
                    />
                    {errors.email && (
                        <p className="text-red-600">{errors.email}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                        id="age"
                        type="number"
                        value={data.age}
                        onChange={(e) => setData("age", e.target.value)}
                        readOnly={isReadOnly}
                    />
                    {errors.age && <p className="text-red-600">{errors.age}</p>}
                </div>
                <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select
                        id="gender"
                        value={data.gender}
                        onChange={(e) => setData("gender", e.target.value)}
                        disabled={isReadOnly}
                        className="block w-full border rounded"
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                        <p className="text-red-600">{errors.gender}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="contact">Contact</Label>
                    <Input
                        id="contact"
                        value={data.contact}
                        onChange={(e) => setData("contact", e.target.value)}
                        readOnly={isReadOnly}
                    />
                    {errors.contact && (
                        <p className="text-red-600">{errors.contact}</p>
                    )}
                </div>
                {!isReadOnly && (
                    <Button type="submit" disabled={processing}>
                        Save
                    </Button>
                )}
                {isReadOnly && (
                    <p className="text-gray-600">
                        Your profile data cannot be edited.
                    </p>
                )}
            </form>
        </Sidebar>
    );
}
