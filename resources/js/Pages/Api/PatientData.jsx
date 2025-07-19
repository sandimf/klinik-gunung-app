import React from "react";
import { Head } from "@inertiajs/react";

export default function PatientData({ patient }) {
    return (
        <>
            <Head title="Data Pasien" />
            <div className="min-h-screen bg-gray-100 py-8 px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">Klinik Gunung</h1>

                    {/* Informasi Pasien */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <Field label="Nama Lengkap" value={patient["Nama Lengkap"]} />
                        <Field label="NIK" value={patient.Nik} />
                        <Field label="Umur" value={patient.Umur} />
                        <Field label="Jenis Kelamin" value={patient["Jenis Kelamin"]} />
                        <Field label="Nomor Telepon" value={patient["Nomor Telepon"]} />
                        <Field label="Alamat" value={patient.Alamat} />
                        <Field label="Status Kesehatan" value={patient["Status Kesehatan"]} />
                        <Field label="Tanggal Screening" value={patient["Tanggal Screening"] ?? '-'} />
                    </div>

                    {/* Pemeriksaan Fisik */}
                    {patient["Pemeriksaan Fisik"]?.length > 0 && (
                        <div className="mt-10">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Hasil Pemeriksaan Fisik</h2>
                            {patient["Pemeriksaan Fisik"].map((item, index) => (
                                <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <Field label="Tanggal Pemeriksaan" value={new Date(item.examination_date).toLocaleString()} />
                                        {/* <Field label="Paramedis" value={item.paramedis_name} /> */}
                                        <Field label="Tekanan Darah" value={item.blood_pressure} />
                                        <Field label="Denyut Jantung" value={item.heart_rate} />
                                        <Field label="Saturasi Oksigen" value={item.oxygen_saturation} />
                                        <Field label="Laju Pernapasan" value={item.respiratory_rate} />
                                        <Field label="Suhu Tubuh" value={item.body_temperature} />
                                        <Field label="Penilaian Fisik" value={item.physical_assessment} />
                                        <Field label="Status Kesehatan" value={item.health_status} />
                                        {/* <Field label="Saran Medis" value={item.medical_advice} /> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// Komponen untuk setiap field data
const Field = ({ label, value }) => (
    <div>
        <p className="text-gray-500 font-semibold">{label}</p>
        <p className="text-gray-900">{value ?? '-'}</p>
    </div>
);
