"use client";

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { LayoutDashboard, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', {
                identifier: identifier.trim(),
                password
            });

            if (data.user.role !== 'ADMIN') {
                setError("Accès refusé. Ce compte n'a pas les droits d'administrateur.");
                return;
            }

            // Login and redirect to /admin
            login(data.token, data.user, '/admin');
        } catch (err: any) {
            console.error("Login Error:", err);
            if (err.message === "Network Error" || !err.response) {
                setError("Erreur de connexion au serveur. Vérifiez votre internet ou la configuration.");
            } else {
                setError(err.response?.data?.message || 'Identifiants invalides');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6 text-togo-yellow">
                    <LayoutDashboard size={48} />
                </div>
                <h2 className="text-center text-3xl font-extrabold text-white">
                    Administration TogoTickets
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Espace réservé aux gestionnaires
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-700">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-900/50 border-l-4 border-red-500 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-red-200">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium text-gray-300">
                                Email ou ID Admin
                            </label>
                            <div className="mt-1">
                                <input
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-togo-yellow focus:border-togo-yellow sm:text-sm bg-gray-700 text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
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
                                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-togo-yellow focus:border-togo-yellow sm:text-sm bg-gray-700 text-white pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-gray-900 bg-togo-yellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-togo-yellow transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Connexion...' : 'Accéder au tableau de bord'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
