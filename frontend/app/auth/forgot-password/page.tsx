"use client";

import { useState } from 'react';
import Link from 'next/link';
import api from '../../../lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            await api.post('/auth/forgot-password', { email });
            setMessage('Un email avec les instructions de réinitialisation a été envoyé.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center mb-6">
                    <span className="text-2xl font-bold text-gray-900 tracking-tighter">Togo<span className="text-togo-yellow">Tickets</span></span>
                </Link>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Mot de passe oublié ?
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Entrez votre email pour recevoir un lien de réinitialisation.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}
                        {message && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                                <p className="text-sm text-green-700">{message}</p>
                            </div>
                        )}

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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-togo-green focus:border-togo-green sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-togo-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-togo-green transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Envoi...' : 'Envoyer le lien'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Ou
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link href="/auth/login" className="font-medium text-togo-green hover:text-green-500">
                                Retour à la connexion
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
