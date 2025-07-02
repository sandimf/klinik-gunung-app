import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/Components/ui/card';
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/Auth/AuthLayout';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout>
            <Head title="Lupa Kata Sandi" />
           
                    <p className="mb-4 text-sm text-gray-600 text-center">
                        Reset kata sandi Anda dengan mengisi alamat email Anda di bawah ini.
                    </p>

                    {status && (
                        <p className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </p>
                    )}

                    <form onSubmit={submit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                placeholder="nama@email.com"
                                onChange={(e) => setData('email', e.target.value)}
                                autoFocus
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                    </form>
                    <Button type="submit" disabled={processing} onClick={submit}>
                        Kirim Tautan Reset Kata Sandi
                    </Button>
        </AuthLayout>
    );
}

