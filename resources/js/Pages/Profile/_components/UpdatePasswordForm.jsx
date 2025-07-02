import { useRef } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <form onSubmit={updatePassword} className="space-y-6">
            <div>
                <Label htmlFor="current_password">Kata Sandi Saat Ini</Label>
                <Input
                    id="current_password"
                    ref={currentPasswordInput}
                    value={data.current_password}
                    onChange={(e) =>
                        setData("current_password", e.target.value)
                    }
                    type="password"
                    autoComplete="current-password"
                    placeholder="Kata Sandi"
                />
                {errors.current_password && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.current_password}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="password">Kata Sandi Baru</Label>
                <Input
                    id="password"
                    ref={passwordInput}
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Kata Sandi Baru"
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="password_confirmation">
                    Konfirmasi Kata Sandi
                </Label>
                <Input
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    type="password"
                    autoComplete="new-password"
                    placeholder="Konfirmasi Kata Sandi"
                />
                {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.password_confirmation}
                    </p>
                )}
            </div>

            <Button type="submit" disabled={processing}>
                Simpan
            </Button>
        </form>
    );
}
