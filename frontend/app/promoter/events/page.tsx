"use client";

import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';
import { getValidImageUrl } from '../../../lib/utils';

export default function MyEventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const [cancellationReason, setCancellationReason] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/events/my');
                setEvents(data);
            } catch (error) {
                console.error('Failed to fetch events', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Validé</span>;
            case 'REJECTED':
                return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Rejeté</span>;
            case 'CANCELLED':
                return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Annulé</span>;
            case 'CANCELLATION_REQUESTED':
                return <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold uppercase">En cours d'annulation</span>;
            default:
                return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase">En Attente</span>;
        }
    };

    const handleCancelClick = (event: any) => {
        setSelectedEvent(event);
        setCancellationReason('');
        setShowCancelModal(true);
    };

    const submitCancellationRequest = async () => {
        if (!selectedEvent || !cancellationReason.trim()) {
            alert("Veuillez entrer un motif d'annulation.");
            return;
        }

        try {
            await api.post(`/events/${selectedEvent.id}/cancel-request`, { reason: cancellationReason });
            // Refresh events
            const { data } = await api.get('/events/my');
            setEvents(data);
            setShowCancelModal(false);
            setSelectedEvent(null);
            setCancellationReason('');
            alert("Votre demande d'annulation a été envoyée à l'administrateur.");
        } catch (error: any) {
            console.error('Error requesting cancellation', error);
            alert(error.response?.data?.message || "Erreur lors de la demande d'annulation.");
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Mes Événements</h2>
            </div>

            {events.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500 border border-gray-200">
                    <p className="text-xl mb-4">Vous n&apos;avez pas encore créé d&apos;événement.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                            <div className="md:w-48 h-48 md:h-auto bg-gray-100 relative shrink-0">
                                {event.imageUrl ? (
                                    <img src={getValidImageUrl(event.imageUrl)} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Pas d&apos;image
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                                        <div className="flex items-center text-sm text-gray-500 gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{event.category}</span>
                                        </div>
                                    </div>
                                    <div>
                                        {getStatusBadge(event.status)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-togo-green" />
                                        <span>{format(new Date(event.date), 'dd MMM yyyy', { locale: fr })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-togo-green" />
                                        <span>{format(new Date(event.date), 'HH:mm', { locale: fr })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-togo-green" />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={16} className="text-togo-green" />
                                        <span className="font-bold">{event.price} FCFA</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                    <a href={`/promoter/events/${event.id}/edit`} className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                                        Modifier
                                    </a>
                                    <button className="text-togo-green font-medium hover:text-green-800 text-sm transition-colors">
                                        Voir détails &rarr;
                                    </button>

                                    {event.status !== 'CANCELLED' && event.status !== 'REJECTED' && event.status !== 'CANCELLATION_REQUESTED' && (
                                        <button
                                            onClick={() => handleCancelClick(event)}
                                            className="text-red-600 font-medium hover:text-red-800 text-sm transition-colors ml-2"
                                        >
                                            Annuler
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {/* Cancellation Request Modal */}
            {showCancelModal && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Demander l&apos;annulation</h3>
                        <p className="text-gray-600 mb-4">
                            Vous êtes sur le point de demander l&apos;annulation de <strong>{selectedEvent.title}</strong>.
                            <br />
                            Cette demande doit être validée par un administrateur.
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Motif de l&apos;annulation (Requis)</label>
                            <textarea
                                value={cancellationReason}
                                onChange={(e) => setCancellationReason(e.target.value)}
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-togo-green focus:border-transparent outline-none"
                                rows={4}
                                placeholder="Expliquez pourquoi vous annulez cet événement..."
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                            >
                                Retour
                            </button>
                            <button
                                onClick={submitCancellationRequest}
                                disabled={!cancellationReason.trim()}
                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Envoyer la demande
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
