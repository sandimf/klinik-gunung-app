import React, { useState } from "react";
import { router, Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { CreditCard, FileDown } from "lucide-react";
import ManagerSidebar from "@/Layouts/Dashboard/ManagerSidebarLayout";
import { Button } from "@/Components/ui/button";

const Report = ({ reports, filterType }) => {
    const [type, setType] = useState(filterType);

    const handleFilterChange = (value) => {
        setType(value);
        router.get(route("manager.report"), { type: value });
    };

    return (
        <ManagerSidebar header={"Laporan"}>
            <Head title="Laporan" />
            <div className="container mx-auto p-4 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Laporan</CardTitle>
                        <CardDescription>
                            View and filter report data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4">
                            <label htmlFor="type" className="font-medium">
                                Filter:
                            </label>
                            <Select
                                value={type}
                                onValueChange={handleFilterChange}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">
                                        Weekly
                                    </SelectItem>
                                    <SelectItem value="monthly">
                                        Monthly
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Button>
                                <FileDown className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Screenings</CardTitle>
                        <CardDescription>
                            Overview of offline and online screenings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="offline" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="offline">
                                    Screenings
                                </TabsTrigger>
                                <TabsTrigger value="online">
                                    Online Screenings
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="offline">
                                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                    <ul className="space-y-2">
                                        {reports.screenings
                                            .filter(
                                                (screening) =>
                                                    !screening.patient_online
                                            )
                                            .map((screening) => (
                                                <li
                                                    key={screening.id}
                                                    className="flex justify-between items-center"
                                                >
                                                    <span>
                                                        {screening.name}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {
                                                            screening.formatted_date
                                                        }
                                                    </span>
                                                </li>
                                            ))}
                                    </ul>
                                </ScrollArea>
                            </TabsContent>
                            <TabsContent value="online">
                                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                    <ul className="space-y-2">
                                        {reports.screenings
                                            .filter(
                                                (screening) =>
                                                    screening.patient_online
                                            )
                                            .map((screening) => (
                                                <li
                                                    key={screening.id}
                                                    className="flex justify-between items-center"
                                                >
                                                    <span>
                                                        {screening.name}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {
                                                            screening.formatted_date
                                                        }
                                                    </span>
                                                </li>
                                            ))}
                                    </ul>
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Pemasukan</CardTitle>
                        <CardDescription>
                            Summary of earnings for the selected period
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4">
                            <CreditCard className="h-8 w-8 text-green-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Total Earnings
                                </p>
                                <p className="text-3xl font-bold text-green-600">
                                    Rp {reports.totalIncome.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ManagerSidebar>
    );
};

export default Report;
