"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Menu, Ticket, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t-4 border-t-togo-green">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-togo-green via-togo-yellow to-togo-red" />
            <div className="container flex h-16 items-center px-4 md:px-6">
                <Link className="flex items-center gap-2 font-bold text-xl text-togo-green" href="/">
                    <Ticket className="h-6 w-6" />
                    <span>TogoTickets</span>
                </Link>
                <div className="hidden md:flex ml-auto gap-6 items-center">
                    <Link className="text-sm font-medium text-gray-800 hover:underline underline-offset-4 hover:text-togo-red" href="/events">
                        Événements
                    </Link>
                    <Link className="text-sm font-medium text-gray-800 hover:underline underline-offset-4 hover:text-togo-red" href="/about">
                        À propos
                    </Link>
                    <Link className="text-sm font-medium text-gray-800 hover:underline underline-offset-4 hover:text-togo-red" href="/contact">
                        Contact
                    </Link>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="text-sm font-medium text-gray-800 hover:text-togo-green hover:underline underline-offset-4">
                                Mes Tickets
                            </Link>
                            <span className="text-sm font-medium text-gray-500">|</span>
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{user.name || user.email}</span>
                            <Button size="sm" variant="outline" onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                                Déconnexion
                            </Button>
                        </div>
                    ) : (
                        <Link href="/auth/login">
                            <Button size="sm">Connexion</Button>
                        </Link>
                    )}
                </div>
                <div className="ml-auto flex md:hidden gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 bg-white/95 backdrop-blur absolute w-full left-0 top-16 shadow-lg flex flex-col gap-4 animate-in slide-in-from-top-5">
                    <Link
                        className="text-sm font-medium p-2 hover:bg-slate-50 rounded-md transition-colors hover:text-togo-red"
                        href="/events"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Événements
                    </Link>
                    <Link
                        className="text-sm font-medium p-2 hover:bg-slate-50 rounded-md transition-colors hover:text-togo-red"
                        href="/about"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        À propos
                    </Link>
                    <Link
                        className="text-sm font-medium p-2 hover:bg-slate-50 rounded-md transition-colors hover:text-togo-red"
                        href="/contact"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Contact
                    </Link>
                    <div className="pt-2 border-t">
                        {user ? (
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-gray-700 p-2">Compte: {user.name || user.email}</span>
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-medium p-2 hover:bg-slate-50 rounded-md transition-colors text-togo-green"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Mes Tickets
                                </Link>
                                <Button className="w-full" variant="outline" onClick={handleLogout}>Déconnexion</Button>
                            </div>
                        ) : (
                            <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                                <Button className="w-full">Connexion</Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
