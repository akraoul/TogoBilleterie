"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { Ticket, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [loginType, setLoginType] = useState<'USER' | 'ORGANIZER'>('USER');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', { identifier, password });
            if (data.user.role === 'ORGANIZER') {
                login(data.token, data.user, '/promoter');
            } else if (data.user.role === 'ADMIN') {
                login(data.token, data.user, '/admin');
            } else {
                login(data.token, data.user, '/');
            }
        } catch (err: any) {
            console.error(err);
            if (err.message === "Network Error" || !err.response) {
                setError("Impossible de contacter le serveur. Vérifiez votre connexion internet.");
            } else {
                setError(err.response?.data?.message || 'Une erreur est survenue');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-togo-green relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffce00_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center mb-6">
                    <span className="text-2xl font-bold text-white tracking-tighter">Togo<span className="text-togo-yellow">Tickets</span></span>
                </Link>
                <h2 className="text-center text-3xl font-extrabold text-white">
                    Bon retour parmi nous
                </h2>
                <p className="mt-2 text-center text-sm text-white/80">
                    Connectez-vous pour accéder à vos billets
                </p>
            </div>

            <div className="mt-8 relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-2xl rounded-2xl sm:px-10">

                    {/* Tabs */}
                    <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
                        <button
                            onClick={() => setLoginType('USER')}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${loginType === 'USER'
                                ? 'bg-white text-togo-green shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Spectateur
                        </button>
                        <button
                            onClick={() => setLoginType('ORGANIZER')}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${loginType === 'ORGANIZER'
                                ? 'bg-white text-togo-green shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Promoteur
                        </button>
                    </div>

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
                            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                                {loginType === 'USER' ? 'Numéro de téléphone' : 'Adresse Email'}
                            </label>
                            <div className="mt-1">
                                <input
                                    id="identifier"
                                    name="identifier"
                                    type={loginType === 'USER' ? 'tel' : 'email'}
                                    autoComplete={loginType === 'USER' ? 'tel' : 'email'}
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder={loginType === 'USER' ? '+228 90 90 90 90' : 'exemple@email.com'}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-togo-green focus:border-togo-green sm:text-sm text-black"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-togo-green focus:border-togo-green sm:text-sm text-black pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <Link href="/auth/forgot-password" className="font-medium text-togo-green hover:text-green-500">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-togo-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-togo-red transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-white/90">
                    Pas encore de compte ?{' '}
                    <Link href="/auth/register" className="font-medium text-togo-yellow hover:text-white transition-colors">
                        Créer un compte gratuitement
                    </Link>
                </p>
            </div>
        </div>
    );
}
