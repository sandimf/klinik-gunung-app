import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/Components/ui/card";
import { toast } from "sonner";
import { useForm } from "@inertiajs/react";

export default function Emergency() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        contact: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("emergency.store"), {
            onSuccess: () => {
                toast.success("Emergency Contact successfully added!");
            },
            onError: () => {
                toast.error("Failed to add Emergency Contact.");
            },
        });
    };

    return (
        <AdminSidebar>
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Emergency Contact</CardTitle>
                        <CardDescription>
                            Enter the emergency contact details to display for patients.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                {/* Name Field */}
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Enter contact name"
                                        autoComplete="off"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>
                                {/* Contact Field */}
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="contact">Contact Number</Label>
                                    <Input
                                        id="contact"
                                        value={data.contact}
                                        onChange={(e) =>
                                            setData("contact", e.target.value)
                                        }
                                        placeholder="Enter contact number"
                                        type="tel"
                                        autoComplete="off"
                                    />
                                    {errors.contact && (
                                        <p className="text-sm text-red-500">{errors.contact}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? "Adding..." : "Submit"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AdminSidebar>
    );
}
