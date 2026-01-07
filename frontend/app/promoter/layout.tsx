"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, PlusCircle, Calendar, LogOut } from "lucide-react";

export default function PromoterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'ORGANIZER') {
                router.push('/auth/login');
            }
        }
    }, [user, loading, router]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
    if (!user || user.role !== 'ORGANIZER') return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-gray-200 w-64 min-h-screen flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? '' : '-ml-64'}`}>
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-togo-green">TogoTickets <span className="text-togo-yellow text-sm block">Promoteur</span></h1>
                </div>

                <nav className="mt-6 px-4 space-y-2">
                    <Link href="/promoter" className="flex items-center space-x-3 px-4 py-3 bg-togo-green/10 text-togo-green rounded-lg hover:bg-togo-green/20 transition-colors font-medium">
                        <LayoutDashboard size={20} />
                        <span>Tableau de bord</span>
                    </Link>
                    <Link href="/promoter/events/create" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-togo-green rounded-lg transition-colors">
                        <PlusCircle size={20} />
                        <span>Créer événement</span>
                    </Link>
                    <Link href="/promoter/events" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-togo-green rounded-lg transition-colors">
                        <Calendar size={20} />
                        <span>Mes événements</span>
                    </Link>
                </nav>

                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-100 bg-white">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm h-16 flex items-center px-6 justify-between sticky top-0 z-10">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-gray-900">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700">{user.name || user.email}</span>
                        <div className="h-8 w-8 bg-togo-yellow rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                            {(user.name || user.email || 'P')[0].toUpperCase()}
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
