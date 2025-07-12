"use client";

import React, { useState } from "react";
import { Chat } from "@/Components/ui/chat";
import { usePage, Head } from "@inertiajs/react";

export default function AI() {
    const { auth } = usePage().props;
    const user = auth.user;
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: `Halo! ${user.name}, Ada yang bisa saya bantu hari ini?`,
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Handler for input change
    const handleInputChange = (e) => setInput(e.target.value);

    // Handler for form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const res = await fetch(route("chatbot.post"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.reply || "Maaf, tidak ada jawaban yang diterima.",
                },
            ]);

        } catch (err) {
            console.error('Error:', err);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Maaf, terjadi kesalahan server. Silakan coba lagi.",
                },
            ]);
        } finally {
            setIsLoading(false);
            setInput("");
        }
    };

    // Handler for prompt suggestions
    const handleSuggestion = (suggestion) => {
        setInput(suggestion);
    };

    // Tampilkan info beta hanya saat chat baru dibuka (belum ada pesan user)
    const isFirst = messages.filter(m => m.role === 'user').length === 0;

    return (
        <>
            <Head title="Chat AI" />
            <div className="bg-card rounded-xl shadow p-4 max-w-2xl mx-auto my-8 h-[80vh] flex flex-col justify-end">
                {isFirst && (
                    <div className="text-xs text-muted-foreground text-center mb-2">Beta v0.1.0<v0 className="1"></v0></div>
                )}
                <Chat
                    messages={messages}
                    input={input}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isGenerating={isLoading}
                    stop={() => setIsLoading(false)}
                    suggestions={[
                        "Berapa jumlah pasien saat ini?",
                        "informasi tentang [Nama Pasien]",
                        "Berapa pasien laki-laki dan perempuan?",
                        "Statistik pasien lengkap",
                    ]}
                    append={(msg) => setInput(msg.content)}
                    inputClassName="!border-0 !outline-none !shadow-none"
                />
            </div>
        </>
    );
}