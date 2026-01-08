"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { Eye, EyeOff } from 'lucide-react';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!token) {
        return (
            <div className="text-center">
                <p className="text-red-500">Lien invalide ou manquant.</p>
                <Link href="/auth/login" className="text-togo-green hover:underline">Retour à la connexion</Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/auth/reset-password', { token, newPassword: password });
            setMessage('Mot de passe modifié avec succès ! Redirection...');
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Nouveau mot de passe
                </label>
                <div className="mt-1 relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-togo-green focus:border-togo-green sm:text-sm pr-10"
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

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmer le mot de passe
                </label>
                <div className="mt-1">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {isLoading ? 'Modification...' : 'Modifier le mot de passe'}
                </button>
            </div>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center mb-6">
                    <span className="text-2xl font-bold text-gray-900 tracking-tighter">Togo<span className="text-togo-yellow">Tickets</span></span>
                </Link>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Réinitialiser le mot de passe
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <Suspense fallback={<div>Chargement...</div>}>
                        <ResetPasswordContent />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
