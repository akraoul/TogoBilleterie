"use client";

import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Users, Calendar, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [promoters, setPromoters] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, promotersRes, eventsRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/promoters'),
                    api.get('/admin/events')
                ]);
                setStats(statsRes.data);
                setPromoters(promotersRes.data);
                setEvents(eventsRes.data);
            } catch (error) {
                console.error('Failed to fetch admin data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center">Chargement du tableau de bord...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Vue d&apos;ensemble</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard
                    title="Utilisateurs"
                    value={stats?.users || 0}
                    icon={<Users className="text-blue-500" size={24} />}
                    color="bg-blue-50"
                />
                <StatCard
                    title="Promoteurs"
                    value={stats?.promoters || 0}
                    icon={<Users className="text-purple-500" size={24} />}
                    color="bg-purple-50"
                />
                <StatCard
                    title="Événements"
                    value={stats?.events || 0}
                    icon={<Calendar className="text-green-500" size={24} />}
                    color="bg-green-50"
                />
                <StatCard
                    title="En Attente"
                    value={stats?.pendingEvents || 0}
                    icon={<AlertCircle className="text-yellow-500" size={24} />}
                    color="bg-yellow-50"
                />
            </div>

            {/* Content Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Promoters List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-800">Promoteurs Récents</h3>
                        <span className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{promoters.length} total</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Nom</th>
                                    <th className="px-6 py-3">Contact</th>
                                    <th className="px-6 py-3">Inscrit le</th>
                                </tr>
                            </thead>
                            <tbody>
                                {promoters.length === 0 ? (
                                    <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">Aucun promoteur</td></tr>
                                ) : (
                                    promoters.slice(0, 5).map((promoter: any) => (
                                        <tr key={promoter.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{promoter.name || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span>{promoter.email}</span>
                                                    <span className="text-xs text-gray-500">{promoter.identifier}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(promoter.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Events List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-800">Tous les événements</h3>
                        <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">{events.length} total</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Événement</th>
                                    <th className="px-6 py-3">Organisateur</th>
                                    <th className="px-6 py-3">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.length === 0 ? (
                                    <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">Aucun événement</td></tr>
                                ) : (
                                    events.slice(0, 5).map((event: any) => (
                                        <tr key={event.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {event.title}
                                                <div className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4">{event.organizer}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${event.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    event.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: any) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 border border-gray-100">
            <div className={`p-4 rounded-full ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}
