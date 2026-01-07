"use client";

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import api from '@/lib/api';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Clock, Ticket as TicketIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Ticket {
    id: number;
    qrCode: string;
    status: string;
    event: {
        id: number;
        title: string;
        date: string;
        location: string;
        imageUrl: string | null;
    };
    ticketType: {
        name: string;
        price: number;
    };
}

export default function DashboardPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const { data } = await api.get('/tickets/my');
                setTickets(data);
            } catch (error) {
                console.error("Failed to fetch tickets", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="container max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mes Billets</h1>
                    <Link href="/events">
                        <Button variant="outline">Explorer les événements</Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-togo-green"></div>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <TicketIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Aucun billet trouvé</h3>
                        <p className="text-gray-500 mt-2 mb-6">Vous n'avez pas encore acheté de billets.</p>
                        <Link href="/events">
                            <Button className="bg-togo-green hover:bg-green-700">Découvrir les événements</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                {/* Event Image Header */}
                                <div className="h-32 bg-gray-100 relative">
                                    {ticket.event.imageUrl ? (
                                        <img
                                            src={ticket.event.imageUrl.startsWith('http') ? ticket.event.imageUrl : `http://localhost:3001/${ticket.event.imageUrl}`}
                                            alt={ticket.event.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                            <span className="text-4xl">🎫</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-togo-green uppercase">
                                        {ticket.status}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1">{ticket.event.title}</h3>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2 text-togo-yellow" />
                                            {new Date(ticket.event.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Clock className="h-4 w-4 mr-2 text-togo-yellow" />
                                            {new Date(ticket.event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 mr-2 text-togo-yellow" />
                                            {ticket.event.location}
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 border-dashed border-gray-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <span className="block text-xs text-gray-500 uppercase">Billet</span>
                                                <span className="font-bold text-gray-900">{ticket.ticketType?.name || 'Standard'}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-xs text-gray-500 uppercase">Prix</span>
                                                <span className="font-bold text-togo-green">{ticket.ticketType?.price} FCFA</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <QRCodeSVG value={ticket.qrCode} size={120} />
                                        </div>
                                        <p className="text-center text-[10px] text-gray-400 font-mono mt-2 truncate w-full">
                                            {ticket.qrCode}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
