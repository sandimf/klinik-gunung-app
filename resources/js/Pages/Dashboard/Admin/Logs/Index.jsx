import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ScrollArea } from "@/Components/ui/scroll-area";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Head } from '@inertiajs/react';
export default function Logs() {
    const [logs, setLogs] = useState([]);
    const logEndRef = useRef(null);

    useEffect(() => {
        const fetchLogs = () => {
            axios.get(route('admin.logs.data')).then(res => {
                setLogs(res.data.logs);
            });
        };
        fetchLogs();
        const interval = setInterval(fetchLogs, 3000); // 3 detik
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <AdminSidebar header={'logs'}>
            <Head title='logs' />
            <div className='container p-6 mx-auto space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-center">
                                Logs Aplikasi <span className="text-base font-normal">(Realtime)</span>
                            </h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[70vh] w-full rounded-md border bg-black text-green-200 p-4 font-mono text-sm">
                            {logs && logs.length > 0 ? (
                                <>
                                    {logs.map((line, idx) => (
                                        <div key={idx}>{line}</div>
                                    ))}
                                    <div ref={logEndRef} />
                                </>
                            ) : (
                                <p className="text-muted-foreground text-center">Log kosong atau tidak ditemukan.</p>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </AdminSidebar>
    );
} 