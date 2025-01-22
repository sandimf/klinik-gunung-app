import { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <form onSubmit={updatePassword} className="space-y-6">
            <div>
                <Label htmlFor="current_password">Current Password</Label>
                <Input
                    id="current_password"
                    ref={currentPasswordInput}
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    type="password"
                    autoComplete="current-password"
                    placeholder="*****"
                />
                {errors.current_password && <p className="text-sm text-red-600 mt-1">{errors.current_password}</p>}
            </div>

            <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                    id="password"
                    ref={passwordInput}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    type="password"
                    autoComplete="new-password"
                    placeholder="*****"

                />
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>

            <div>
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    type="password"
                    autoComplete="new-password"
                    placeholder="*****"

                />
                {errors.password_confirmation && <p className="text-sm text-red-600 mt-1">{errors.password_confirmation}</p>}
            </div>

            <Button type="submit" disabled={processing}>Save</Button>
        </form>
    );
}

