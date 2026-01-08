"use client";
import { cn, getValidImageUrl } from "../lib/utils";

export interface EventProps {
    id: number;
    title: string;
    date: string;
    location: string;
    price: number | string; // Allow string for "5.000 FCFA" format if pre-formatted
    imageUrl?: string;
    category: string;
}

export default function EventCard({ event }: { event: EventProps }) {
    const eventDate = new Date(event.date);
    const validImageUrl = getValidImageUrl(event.imageUrl);

    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                {validImageUrl ? (
                    <img
                        src={validImageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <span className="text-sm">Pas d&apos;image</span>
                    </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-togo-green uppercase tracking-wide">
                    {event.category}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <div className="bg-green-50 text-togo-green rounded-lg px-3 py-1 flex flex-col items-center min-w-[60px]">
                        <span className="text-xs font-bold uppercase">{format(eventDate, 'MMM', { locale: fr })}</span>
                        <span className="text-xl font-black">{format(eventDate, 'dd')}</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-lg font-bold text-togo-green">{event.price.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-togo-green transition-colors">
                    {event.title}
                </h3>

                <div className="space-y-2 mt-auto text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-togo-yellow" />
                        <span>{format(eventDate, 'EEEE d MMMM yyyy', { locale: fr })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-togo-yellow" />
                        <span>{format(eventDate, 'HH:mm')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-togo-yellow" />
                        <span className="truncate">{event.location}</span>
                    </div>
                </div>


                <Link href={`/events/${event.id}`} className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center space-x-2 group-hover:bg-togo-green transition-colors">
                    <span>Acheter un billet</span>
                    <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
