import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { AlertCircle, Upload, X, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { ImageCropper } from "./ImageCropper";

export default function UpdateProfileInformation({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const [photoPreview, setPhotoPreview] = useState(
        user?.avatar
            ? user.avatar.startsWith("http")
                ? user.avatar
                : `/storage/${user.avatar}`
            : "/storage/avatar/avatar.svg" || null
    );
    const [showCropper, setShowCropper] = useState(false);
    const [cropperImage, setCropperImage] = useState("");

    const { data, setData, post, errors, processing } = useForm({
        name: user.name,
        email: user.email,
        avatar: null,
    });

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        if (data.avatar) {
            formData.append("avatar", data.avatar); // Lampirkan file avatar
        }

        post(route("profile.update"), {
            data: formData,
            onSuccess: () => {
                // Toast ini hanya muncul setelah profil berhasil diperbarui
                toast.success("Profile berhasil diperbarui", {
                    icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
                });
            },
            onError: (errors) => {
                const errorMessage =
                    Object.values(errors)[0] || "Terjadi kesalahan.";
                toast.error(errorMessage, {
                    icon: <X className="w-5 h-5 text-red-500" />,
                });
            },
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCropperImage(URL.createObjectURL(file));
            setShowCropper(true);
        }
    };

    const handleCropComplete = (croppedFile) => {
        setData("avatar", croppedFile); // Store the File object
        setPhotoPreview(URL.createObjectURL(croppedFile)); // Preview the cropped image
        setShowCropper(false); // Close the cropper
    };

    const handleCropCancel = () => {
        setShowCropper(false);
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                    <AvatarImage src={photoPreview} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <Input
                        type="file"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="avatar"
                        accept="image/*"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            document.getElementById("avatar").click()
                        }
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Ubah Foto Profile
                    </Button>
                </div>
            </div>

            {showCropper && (
                <ImageCropper
                    imageSrc={cropperImage}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}

            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
                {user.email_verified_at === null && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="w-4 h-4" />
                        <AlertTitle>Email kamu belum diverifikasi.</AlertTitle>
                        <AlertDescription>

                            <Button
                                variant="link"
                                className="h-auto p-0 font-normal text-xm"
                                onClick={() => route("verification.send")}
                            >
                                Klik di sini untuk kirim ulang verifikasi.
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {mustVerifyEmail && user.email_verified_at === null && (
                <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertTitle>Unverified Email</AlertTitle>
                    <AlertDescription>
                        Your email address is unverified.
                        <Button
                            variant="link"
                            className="h-auto p-0 font-normal"
                            onClick={() => route("verification.send")}
                        >
                            Click here to re-send the verification email.
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <Button type="submit" disabled={processing}>
                Simpan
            </Button>

            {status === "profile-updated" && (
                <p className="text-sm text-green-600">Saved.</p>
            )}
        </form>
    );
}
