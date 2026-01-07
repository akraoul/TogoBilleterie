"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Share2, Clock, Ticket } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchEventById } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TicketType {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    imageUrl?: string;
    ticketTypes: TicketType[];
}

export default function EventDetailsPage() {
    const params = useParams();
    const id = params?.id as string;

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTicketType, setSelectedTicketType] = useState<number | null>(null);

    useEffect(() => {
        if (!id) return;

        const loadEvent = async () => {
            try {
                const data = await fetchEventById(id);
                if (data) {
                    setEvent(data);
                    // Select first ticket type by default if available
                    if (data.ticketTypes && data.ticketTypes.length > 0) {
                        setSelectedTicketType(data.ticketTypes[0].id);
                    }
                }
            } catch (error) {
                console.error("Error loading event:", error);
            } finally {
                setLoading(false);
            }
        };
        loadEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-togo-green"></div>
                </div>
            </div>
        );
    }

    if (!event) return notFound();

    const eventDate = new Date(event.date);
    const selectedType = event.ticketTypes.find(t => t.id === selectedTicketType);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <main className="flex-1">
                {/* Banner Image */}
                <div className="w-full h-64 md:h-96 bg-slate-200 relative overflow-hidden">
                    {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100">
                            <span className="text-lg font-medium">Image de couverture de l'événement</span>
                        </div>
                    )}
                </div>

                <div className="container px-4 md:px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-togo-green/10 text-togo-green px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                        {event.category}
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{event.title}</h1>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">À propos de l'événement</h3>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {event.description}
                                </p>
                            </div>
                        </div>

                        {/* Sidebar / Booking Card */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 border rounded-xl p-6 shadow-sm bg-white">
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start gap-3 text-slate-600">
                                        <Calendar className="h-5 w-5 text-togo-green mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-900">Date</p>
                                            <p>{format(eventDate, 'EEEE d MMMM yyyy', { locale: fr })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-slate-600">
                                        <Clock className="h-5 w-5 text-togo-green mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-900">Heure</p>
                                            <p>{format(eventDate, 'HH:mm')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-slate-600">
                                        <MapPin className="h-5 w-5 text-togo-green mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-900">Lieu</p>
                                            <p>{event.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4 mb-6">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <Ticket className="h-4 w-4" />
                                        Choisir un billet
                                    </h4>
                                    <div className="space-y-2">
                                        {event.ticketTypes.map((ticket) => (
                                            <div
                                                key={ticket.id}
                                                onClick={() => setSelectedTicketType(ticket.id)}
                                                className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${selectedTicketType === ticket.id
                                                    ? "border-togo-green bg-green-50 ring-1 ring-togo-green"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                <div>
                                                    <p className="font-medium text-slate-900">{ticket.name}</p>
                                                    <p className="text-xs text-slate-500">{ticket.quantity} dispos</p>
                                                </div>
                                                <p className="font-bold text-togo-green">
                                                    {ticket.price.toLocaleString('fr-FR')} FCFA
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Link
                                    href={selectedTicketType && selectedType
                                        ? `/checkout?eventId=${event.id}&ticketId=${selectedTicketType}`
                                        : "#"}
                                    onClick={(e) => !selectedTicketType && e.preventDefault()}
                                    className="w-full block"
                                >
                                    <Button
                                        size="lg"
                                        className="w-full text-lg bg-togo-red hover:bg-red-700 text-white"
                                        disabled={!selectedTicketType}
                                    >
                                        Acheter un ticket
                                    </Button>
                                </Link>

                                <div className="mt-4 flex justify-center">
                                    <Button variant="ghost" size="sm" className="text-slate-500">
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Partager
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
