import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { AlertCircle, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert"
import {toast,Toaster} from "sonner"

export default function UpdateProfileInformation({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, errors, processing } = useForm({
        name: user.name,
        email: user.email,
        avatar: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("profile.update"), {
            onSuccess: () => {
                toast.success(
                    "Profile Berhasil di update",
                    {
                        icon: (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ),
                    }
                );
            },
            onError: (errors) => {
                toast.error(errorMessage, {
                    icon: <X className="h-5 w-5 text-red-500" />,
                });
            },
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <Toaster position='top-center' />
            <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                    <AvatarImage src={photoPreview || user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <Input
                        type="file"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="photo"
                        accept="image/*"
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById('photo').click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        Change Photo
                    </Button>
                </div>
            </div>

            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            {mustVerifyEmail && user.email_verified_at === null && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Unverified Email</AlertTitle>
                    <AlertDescription>
                        Your email address is unverified.
                        <Button variant="link" className="p-0 h-auto font-normal" onClick={() => route('verification.send')}>
                            Click here to re-send the verification email.
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <Button type="submit" disabled={processing}>Save</Button>

            {status === 'profile-updated' && (
                <p className="text-sm text-green-600">Saved.</p>
            )}
        </form>
    );
}

