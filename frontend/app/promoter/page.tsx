"use client";

import Link from "next/link";
import { PlusCircle, Calendar, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function PromoterDashboard() {
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalTicketsSold: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch events linked to this promoter
                const response = await api.get('/events/my');
                const events = response.data;

                // Calculate totals
                const totalEvents = events.length;
                const totalTicketsSold = events.reduce((acc: number, event: any) => {
                    // Requires backend to include: include: { _count: { select: { tickets: true } } }
                    return acc + (event._count?.tickets || 0);
                }, 0);

                setStats({ totalEvents, totalTicketsSold });
            } catch (error) {
                console.error("Error fetching promoter stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenue Promoteur !</h2>
            <p className="text-gray-600 mb-8">Gérez vos événements et suivez vos ventes de billets.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Shortcuts */}
                <Link href="/promoter/events/create" className="group bg-gradient-to-br from-togo-green to-green-700 rounded-xl shadow-lg p-6 text-white hover:scale-105 transition-transform">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-green-100 font-medium mb-1">Nouvel Événement</p>
                            <h3 className="text-2xl font-bold">Créer maintenant</h3>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                            <PlusCircle size={28} />
                        </div>
                    </div>
                    <div className="mt-8 flex items-center text-sm font-medium text-green-100 group-hover:text-white">
                        Commencer &rarr;
                    </div>
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Mes Événements</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
                        <Ticket size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Billets Vendus</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalTicketsSold}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Activités Récentes</h3>
                <p className="text-gray-500 italic">Aucune activité récente.</p>
            </div>
        </div>
    );
}
