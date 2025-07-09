import React, { useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { PhoneInput } from "@/Components/ui/phone-input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from "@/Components/ui/select";

function calculateAge(dateString) {
    if (!dateString) return "";
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function PatientInfoForm({ data, setData, errors }) {
    useEffect(() => {
        if (data.date_of_birth) {
            setData("age", calculateAge(data.date_of_birth));
        } else {
            setData("age", "");
        }
    }, [data.date_of_birth]);

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* NIK field */}
            <div>
                <Label htmlFor="nik">NIK</Label>
                <Input
                    id="nik"
                    value={data.nik}
                    placeholder="NIK"
                    onChange={(e) => setData("nik", e.target.value)}
                />
                {errors.nik && <p className="text-red-600">{errors.nik}</p>}
            </div>

            {/* Name field */}
            <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                    id="name"
                    value={data.name}
                    placeholder="Nama Lengkap"
                    onChange={(e) => setData("name", e.target.value)}
                />
                {errors.name && <p className="text-red-600">{errors.name}</p>}
            </div>

            {/* Email field */}

            {/* Place of Birth field */}
            <div>
                <Label htmlFor="place_of_birth">Tempat Lahir</Label>
                <Input
                    id="place_of_birth"
                    value={data.place_of_birth}
                    placeholder="Tempat Lahir"
                    onChange={(e) => setData("place_of_birth", e.target.value)}
                />
            </div>

            {/* Date of Birth field */}
            <div>
                <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
                <Input
                    id="date_of_birth"
                    type="date"
                    value={data.date_of_birth}
                    onChange={(e) => setData("date_of_birth", e.target.value)}
                    placeholder="Tanggal Lahir"
                />
                {data.date_of_birth && (
                    <div className="text-sm text-muted-foreground mt-1">
                        Umur: {calculateAge(data.date_of_birth)} tahun
                    </div>
                )}
            </div>

            {/* Gender field */}
            <div>
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <Select
                    value={data.gender}
                    onValueChange={(value) => setData("gender", value)}
                >
                    <SelectTrigger className="p-2 w-full rounded border">
                        <SelectValue placeholder="Pilih Jenis Kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Select Gender</SelectLabel>
                            <SelectItem value="laki-laki">Laki-Laki</SelectItem>
                            <SelectItem value="perempuan">Perempuan</SelectItem>
                            <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {errors.gender && (
                    <p className="text-red-600">{errors.gender}</p>
                )}
            </div>

            {/* Address field */}
            <div>
                <Label htmlFor="address">Alamat</Label>
                <Input
                    id="address"
                    value={data.address}
                    placeholder="Alamat"
                    onChange={(e) => setData("address", e.target.value)}
                />
            </div>

            {/* RT/RW field */}
            <div>
                <Label htmlFor="rt_rw">RT/RW</Label>
                <Input
                    id="rt_rw"
                    value={data.rt_rw}
                    placeholder="002/014"
                    onChange={(e) => setData("rt_rw", e.target.value)}
                />
            </div>

            {/* Village field */}
            <div>
                <Label htmlFor="village">Kel/Desa</Label>
                <Input
                    id="village"
                    value={data.village}
                    placeholder="Kel/Desa"
                    onChange={(e) => setData("village", e.target.value)}
                />
            </div>

            {/* District field */}
            <div>
                <Label htmlFor="district">Kecamatan</Label>
                <Input
                    id="district"
                    value={data.district}
                    placeholder="Kecamatan"
                    onChange={(e) => setData("district", e.target.value)}
                />
            </div>

            {/* Religion field */}
            <div>
                <Label htmlFor="religion">Agama</Label>
                <Input
                    id="religion"
                    value={data.religion}
                    placeholder="Agama"
                    onChange={(e) => setData("religion", e.target.value)}
                />
            </div>

            {/* Marital Status field */}
            <div>
                <Label htmlFor="marital_status">Status Perkawinan</Label>
                <Input
                    id="marital_status"
                    value={data.marital_status}
                    placeholder="Status Perkawinan"
                    onChange={(e) => setData("marital_status", e.target.value)}
                />
            </div>

            {/* Occupation field */}
            <div>
                <Label htmlFor="occupation">Pekerjaan</Label>
                <Input
                    id="occupation"
                    value={data.occupation}
                    placeholder="Pekerjaan"
                    onChange={(e) => setData("occupation", e.target.value)}
                />
            </div>

            {/* Nationality field */}
            <div>
                <Label htmlFor="nationality">Kewarganegaraan</Label>
                <Input
                    id="nationality"
                    value={data.nationality}
                    placeholder="Kewarganegaraan"
                    onChange={(e) => setData("nationality", e.target.value)}
                />
            </div>

            {/* Valid Until field */}
            <div>
                <Label htmlFor="valid_until">Berlaku Hingga</Label>
                <Input
                    id="valid_until"
                    value={data.valid_until}
                    placeholder="Berlaku Hingga"
                    onChange={(e) => setData("valid_until", e.target.value)}
                />
            </div>

            {/* Blood Type field */}
            <div>
                <Label htmlFor="blood_type">Golongan Darah</Label>
                <Input
                    id="blood_type"
                    value={data.blood_type}
                    placeholder="Contoh: A, B, AB, O (- jika tidak diketahui)"
                    onChange={(e) => setData("blood_type", e.target.value)}
                />
            </div>

            {/* Age field */}
            <div>
                <Label htmlFor="age">Umur</Label>
                <Input
                    id="age"
                    value={data.age}
                    placeholder="Umur"
                />
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    placeholder="email@example.com"
                    onChange={(e) => setData("email", e.target.value)}
                />
                {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>

            {/* Contact field */}
            <div>
                <Label htmlFor="contact">Nomor Telepon</Label>
                <PhoneInput
                    id="contact"
                    value={data.contact}
                    defaultCountry="ID"
                    onChange={val => setData("contact", val)}
                    international
                    countryCallingCodeEditable={false}
                />
                {errors.contact && (
                    <p className="text-red-600">{errors.contact}</p>
                )}
            </div>
            <div>
                <Label htmlFor="tinggi_badan">Tinggi Badan</Label>
                <Input
                    id="tinggi_badan"
                    value={data.tinggi_badan}
                    placeholder="Tinggi Badan"
                    onChange={(e) => setData("tinggi_badan", e.target.value)}
                />
                {errors.tinggi_badan && (
                    <p className="text-red-600">{errors.tinggi_badan}</p>
                )}
            </div>
            <div>
                <Label htmlFor="berat_badan">Berat Badan</Label>
                <Input
                    id="berat_badan"
                    value={data.berat_badan}
                    placeholder="Tinggi Badan"
                    onChange={(e) => setData("berat_badan", e.target.value)}
                />
                {errors.berat_badan && (
                    <p className="text-red-600">{errors.berat_badan}</p>
                )}
            </div>
        </div>
    );
}
