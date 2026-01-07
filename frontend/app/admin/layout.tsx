"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, CheckCircle, LogOut, MessageSquare } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/admin/login') return;

        if (!loading) {
            if (!user || user.role !== 'ADMIN') {
                router.push('/admin/login');
            }
        }
    }, [user, loading, router, pathname]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
    if (!user || user.role !== 'ADMIN') return null;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className={`bg-gray-900 text-white w-64 min-h-screen flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? '' : '-ml-64'}`}>
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-bold">TogoTickets <span className="text-togo-yellow text-sm block">Admin</span></h1>
                </div>

                <nav className="mt-6 px-4 space-y-2">
                    <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-colors">
                        <LayoutDashboard size={20} />
                        <span>Tableau de bord</span>
                    </Link>
                    <Link href="/admin/validations" className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <CheckCircle size={20} />
                        <span>Validations</span>
                    </Link>
                    <Link href="/admin/messages" className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <MessageSquare size={20} />
                        <span>Messages</span>
                    </Link>
                </nav>

                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800 bg-gray-900">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm h-16 flex items-center px-6 justify-between">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-gray-900">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700">{user.name || user.email}</span>
                        <div className="h-8 w-8 bg-togo-green rounded-full flex items-center justify-center text-white font-bold">
                            {(user.name || user.email || 'A')[0].toUpperCase()}
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
