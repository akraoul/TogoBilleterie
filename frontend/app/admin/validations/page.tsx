"use client";

import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, X, MapPin, Calendar, DollarSign } from 'lucide-react';

export default function AdminValidations() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingEvents = async () => {
        try {
            const { data } = await api.get('/admin/events/pending');
            setEvents(data);
        } catch (error) {
            console.error('Failed to fetch events', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingEvents();
    }, []);

    const handleAction = async (id: number, status: 'APPROVED' | 'REJECTED') => {
        if (!confirm(`Êtes-vous sûr de vouloir ${status === 'APPROVED' ? 'approuver' : 'rejeter'} cet événement ?`)) return;

        try {
            await api.patch(`/admin/events/${id}/status`, { status });
            // Refresh list
            fetchPendingEvents();
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Une erreur est survenue');
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Validations en attente</h2>

            {events.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
                    <p className="text-xl">Aucun événement en attente de validation.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
                            <div className="md:w-1/3 h-48 md:h-auto bg-gray-100 relative">
                                {event.imageUrl ? (
                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Pas d&apos;image
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full uppercase">
                                    En attente
                                </div>
                            </div>

                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            <span>{format(new Date(event.date), 'dd MMMM yyyy, HH:mm', { locale: fr })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} />
                                            <span>{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={16} />
                                            <span>{event.price} FCFA</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">Organisateur:</span>
                                            <span>{event.organizer}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleAction(event.id, 'REJECTED')}
                                        className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        <X size={18} />
                                        Rejeter
                                    </button>
                                    <button
                                        onClick={() => handleAction(event.id, 'APPROVED')}
                                        className="flex items-center gap-2 px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors"
                                    >
                                        <Check size={18} />
                                        Valider
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
