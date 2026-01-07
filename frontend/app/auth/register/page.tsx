"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { Ticket } from 'lucide-react';

export default function RegisterPage() {
    const [step, setStep] = useState<'ROLE_SELECTION' | 'FORM'>('ROLE_SELECTION');
    const [formData, setFormData] = useState<{
        name: string;
        email?: string;
        phoneNumber?: string;
        password: string;
        role: string;
    }>({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: 'USER', // 'USER' or 'ORGANIZER'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (role: string) => {
        setFormData({ ...formData, role });
        setStep('FORM');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Strip spaces from phone number if present
            const payload: any = { ...formData };

            // Remove empty strings to avoid backend validation errors
            Object.keys(payload).forEach(key => {
                if (payload[key] === '' || payload[key] === null) {
                    delete payload[key];
                }
            });

            if (payload.phoneNumber) {
                payload.phoneNumber = payload.phoneNumber.replace(/\s/g, '');
                // Ensure +228 prefix if missing (optional UX improvement)
                if (!payload.phoneNumber.startsWith('+228')) {
                    payload.phoneNumber = '+228' + payload.phoneNumber;
                }
            }

            await api.post('/auth/register', payload);
            router.push('/auth/login');
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.message;
            const zodErrors = err.response?.data?.error?.issues?.map((issue: any) => issue.message).join(', ');
            setError(zodErrors || errorMessage || 'Une erreur est survenue lors de l\'inscription');
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'ROLE_SELECTION') {
        return (
            <div className="min-h-screen bg-togo-green relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffce00_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                    <Link href="/" className="flex justify-center mb-6">
                        <span className="text-2xl font-bold text-white tracking-tighter">Togo<span className="text-togo-yellow">Tickets</span></span>
                    </Link>
                    <h2 className="text-center text-3xl font-extrabold text-white">
                        Bienvenue sur TogoTickets
                    </h2>
                    <p className="mt-2 text-center text-sm text-white/80">
                        Choisissez votre type de compte pour commencer
                    </p>
                </div>

                <div className="mt-8 relative z-10 sm:mx-auto sm:w-full sm:max-w-md px-4 gap-4 flex flex-col">
                    <button
                        onClick={() => handleRoleSelect('USER')}
                        className="group relative flex items-center p-6 bg-white border-2 border-transparent hover:border-togo-green rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200"
                    >
                        <div className="flex-shrink-0 h-12 w-12 bg-green-50 rounded-full flex items-center justify-center text-togo-green">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="ml-4 text-left">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-togo-green transition-colors">Spectateur</h3>
                            <p className="text-sm text-gray-500">Je veux découvrir et assister à des événements.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleRoleSelect('ORGANIZER')}
                        className="group relative flex items-center p-6 bg-white border-2 border-transparent hover:border-togo-red rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200"
                    >
                        <div className="flex-shrink-0 h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <div className="ml-4 text-left">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-togo-red transition-colors">Promoteur</h3>
                            <p className="text-sm text-gray-500">Je veux organiser et vendre des billets.</p>
                        </div>
                    </button>

                    <div className="text-center mt-4">
                        <Link href="/auth/login" className="text-sm font-medium text-togo-yellow hover:text-white transition-colors">
                            J'ai déjà un compte →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-togo-green relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffce00_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Fixed Header */}
            <nav className="fixed top-0 left-0 w-full z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t-4 border-t-togo-green">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-togo-green via-togo-yellow to-togo-red" />
                <div className="container flex h-16 items-center px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-togo-green">
                        <Ticket className="h-6 w-6" />
                        <span>TogoTickets</span>
                    </Link>
                </div>
            </nav>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md mt-16">
                <button
                    onClick={() => setStep('ROLE_SELECTION')}
                    className="mb-4 text-sm text-white/80 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors"
                >
                    ← Changer de type de compte
                </button>
                <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
                    Inscription {formData.role === 'ORGANIZER' ? 'Promoteur' : 'Spectateur'}
                </h2>
                <p className="mt-2 text-center text-sm text-white/80">
                    Déjà inscrit ?{' '}
                    <Link href="/auth/login" className="font-medium text-togo-yellow hover:text-white transition-colors">
                        Se connecter
                    </Link>
                </p>
            </div>

            <div className="mt-8 relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-2xl rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-togo-red p-4 rounded-md">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nom complet
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-togo-green focus:border-togo-green sm:text-sm text-black"
                                />
                            </div>
                        </div>

                        {formData.role === 'ORGANIZER' ? (
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Adresse Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-togo-green focus:border-togo-green sm:text-sm text-black"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                    Numéro de téléphone
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        placeholder="+228 90 90 90 90"
                                        required
                                        value={formData.phoneNumber || ''}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-togo-green focus:border-togo-green sm:text-sm text-black"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Format: +228 XX XX XX XX</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-togo-green focus:border-togo-green sm:text-sm text-black"
                                />
                            </div>
                        </div>

                        {/* Role is hidden/fixed based on selection */}
                        <div className="hidden">
                            <input type="hidden" name="role" value={formData.role} />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-togo-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-togo-red transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
