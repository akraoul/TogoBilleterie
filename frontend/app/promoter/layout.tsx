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
    const [isSidebarOpen, setSidebarOpen] = useState(false); // Mobile: default closed

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'ORGANIZER') {
                router.push('/auth/login');
            }
        }
        // Close sidebar on route change (mobile)
        setSidebarOpen(false);
    }, [user, loading, router]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
    if (!user || user.role !== 'ORGANIZER') return null;

    return (
        <div className="min-h-screen bg-gray-50 flex relative">
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                bg-white border-r border-gray-200 w-64 min-h-screen flex-shrink-0 
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-togo-green">TogoTickets <span className="text-togo-yellow text-sm block">Promoteur</span></h1>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
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
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-6 justify-between sticky top-0 z-30">
                    <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-gray-900 p-2 -ml-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>

                    {/* Spacer for desktop */}
                    <div className="hidden md:block"></div>

                    <div className="flex items-center space-x-4">
                        <span className="hidden md:inline text-sm font-medium text-gray-700">{user.name || user.email}</span>
                        <div className="h-8 w-8 bg-togo-yellow rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                            {(user.name || user.email || 'P')[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
