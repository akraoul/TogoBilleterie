"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Mail, Clock, Trash2, CheckCircle } from 'lucide-react';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data } = await api.get('/contact');
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Messages de Contact</h1>

            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Chargement...</div>
            ) : messages.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-sm">
                    <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Aucun message</h3>
                    <p className="text-gray-500 mt-2">La boîte de réception est vide.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{msg.subject}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <span className="font-medium text-gray-900 mr-2">{msg.name}</span>
                                        <span className="mr-2">&lt;{msg.email}&gt;</span>
                                        <span>•</span>
                                        <Clock className="w-3 h-3 mx-2" />
                                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                {/* <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                    Nouveau
                                </div> */}
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line text-sm border border-gray-100">
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
