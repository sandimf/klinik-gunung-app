import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/Components/ui/select";

export function PatientInfoForm({ data, setData, errors }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
        />
        {errors.name && <p className="text-red-600">{errors.name}</p>}
      </div>

      {/* Email field */}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
        />
        {errors.email && <p className="text-red-600">{errors.email}</p>}
      </div>

      {/* Contact field */}
      <div>
        <Label htmlFor="contact">Contact</Label>
        <Input
          id="contact"
          value={data.contact}
          onChange={(e) => setData("contact", e.target.value)}
        />
        {errors.contact && <p className="text-red-600">{errors.contact}</p>}
      </div>

      {/* Place of Birth field */}
      <div>
        <Label htmlFor="place_of_birth">Place of Birth</Label>
        <Input
          id="place_of_birth"
          value={data.place_of_birth}
          onChange={(e) => setData("place_of_birth", e.target.value)}
        />
      </div>

      {/* Date of Birth field */}
      <div>
        <Label htmlFor="date_of_birth">Date of Birth</Label>
        <Input
          id="date_of_birth"
          value={data.date_of_birth}
          onChange={(e) => setData("date_of_birth", e.target.value)}
        />
      </div>

      {/* Gender field */}
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={data.gender}
          onValueChange={(value) => setData("gender", value)}
        >
          <SelectTrigger className="w-full border rounded p-2">
            <SelectValue placeholder="Select a Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Gender</SelectLabel>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.gender && <p className="text-red-600">{errors.gender}</p>}
      </div>

      {/* Address field */}
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={data.address}
          onChange={(e) => setData("address", e.target.value)}
        />
      </div>

      {/* RT/RW field */}
      <div>
        <Label htmlFor="rt_rw">RT/RW</Label>
        <Input
          id="rt_rw"
          value={data.rt_rw}
          onChange={(e) => setData("rt_rw", e.target.value)}
        />
      </div>

      {/* Village field */}
      <div>
        <Label htmlFor="village">Village</Label>
        <Input
          id="village"
          value={data.village}
          onChange={(e) => setData("village", e.target.value)}
        />
      </div>

      {/* District field */}
      <div>
        <Label htmlFor="district">District</Label>
        <Input
          id="district"
          value={data.district}
          onChange={(e) => setData("district", e.target.value)}
        />
      </div>

      {/* Religion field */}
      <div>
        <Label htmlFor="religion">Religion</Label>
        <Input
          id="religion"
          value={data.religion}
          onChange={(e) => setData("religion", e.target.value)}
        />
      </div>

      {/* Marital Status field */}
      <div>
        <Label htmlFor="marital_status">Marital Status</Label>
        <Input
          id="marital_status"
          value={data.marital_status}
          onChange={(e) => setData("marital_status", e.target.value)}
        />
      </div>

      {/* Occupation field */}
      <div>
        <Label htmlFor="occupation">Occupation</Label>
        <Input
          id="occupation"
          value={data.occupation}
          onChange={(e) => setData("occupation", e.target.value)}
        />
      </div>

      {/* Nationality field */}
      <div>
        <Label htmlFor="nationality">Nationality</Label>
        <Input
          id="nationality"
          value={data.nationality}
          onChange={(e) => setData("nationality", e.target.value)}
        />
      </div>

      {/* Valid Until field */}
      <div>
        <Label htmlFor="valid_until">Valid Until</Label>
        <Input
          id="valid_until"
          value={data.valid_until}
          onChange={(e) => setData("valid_until", e.target.value)}
        />
      </div>

      {/* Blood Type field */}
      <div>
        <Label htmlFor="blood_type">Blood Type</Label>
        <Input
          id="blood_type"
          value={data.blood_type}
          onChange={(e) => setData("blood_type", e.target.value)}
        />
      </div>

      {/* Age field */}
      <div>
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          value={data.age}
          onChange={(e) => setData("age", e.target.value)}
        />
      </div>
    </div>
  );
}

