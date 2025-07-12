"use client";
import React, { useState } from "react";
import { Chat } from "@/Components/ui/chat";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { usePage, Head } from "@inertiajs/react";

export default function ChatbotAdmin() {
    const { auth } = usePage().props;
    const user = auth.user;
    const [messages, setMessages] = useState([
        { role: "system", content: `Halo! ${user.name}` },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => setInput(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const res = await fetch(route("chatbot.admin.post"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.reply || "(Tidak ada jawaban)",
                },
            ]);
            setIsLoading(false);
            setInput("");
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Maaf, terjadi kesalahan server.",
                },
            ]);
            setIsLoading(false);
        }
    };

    // Handler for prompt suggestions (optional, for shadcn pattern)
    const handleSuggestion = (suggestion) => {
        setInput(suggestion);
    };

    return (
        <AdminSidebar header={"Chat AI"}>
            <Head title="Chat AI" />
            <div className="bg-card rounded-xl shadow p-4 max-w-2xl mx-auto my-8">
                <Chat
                    messages={messages}
                    input={input}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isGenerating={isLoading}
                    stop={() => setIsLoading(false)}
                    suggestions={[
                        "Berapa jumlah pasien saat ini?",
                        "Tampilkan laporan screening hari ini.",
                        "Apa itu screening offline?",
                    ]}
                    append={(msg) => setInput(msg.content)} // for prompt suggestions, if needed
                    inputClassName="!border-0 !outline-none !shadow-none"
                />
            </div>
        </AdminSidebar>
    );
}
