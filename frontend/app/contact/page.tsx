"use client";

import { Navbar } from '@/components/Navbar';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';

export default function ContactPage() {
    const [faqOpen, setFaqOpen] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const toggleFaq = (index: number) => {
        setFaqOpen(faqOpen === index ? null : index);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/contact', formData);
            setIsSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue lors de l'envoi du message.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const faqs = [
        {
            question: "Comment acheter un billet ?",
            answer: "C'est très simple ! Choisissez un événement, sélectionnez le type de billet, entrez vos informations et payez en toute sécurité via T-Money ou Flooz. Votre billet QR code est généré instantanément."
        },
        {
            question: "Puis-je me faire rembourser ?",
            answer: "Les politiques de remboursement dépendent de l'organisateur de l'événement. En général, les billets ne sont pas remboursables sauf en cas d'annulation de l'événement. Veuillez nous contacter pour une assistance spécifique."
        },
        {
            question: "Mon paiement a échoué, que faire ?",
            answer: "Vérifiez votre solde T-Money ou Flooz et assurez-vous d'avoir saisi le bon numéro. Si le problème persiste, contactez notre support technique via ce formulaire ou par téléphone."
        },
        {
            question: "Comment organiser mon événement sur TogoBilleterie ?",
            answer: "Créez un compte 'Promoteur', soumettez les détails de votre événement et une fois validé, il sera visible par des milliers de spectateurs potentiels !"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-togo-green text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Contactez-nous</h1>
                    <p className="text-xl text-green-100 max-w-2xl mx-auto">
                        Une question ? Une suggestion ? N'hésitez pas à nous écrire ou à nous appeler. Notre équipe est là pour vous aider.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-16 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        {/* Phone Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <Phone className="text-togo-green w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Par Téléphone</h3>
                            <p className="text-gray-500 mb-4">Disponible du Lundi au Samedi de 8h à 20h.</p>
                            <div className="space-y-2">
                                <a href="tel:+22892590653" className="block text-lg font-medium text-gray-800 hover:text-togo-green transition-colors">
                                    +228 92 59 06 53
                                </a>
                                <a href="tel:+375255262164" className="block text-lg font-medium text-gray-800 hover:text-togo-green transition-colors">
                                    +375 25 526 21 64
                                </a>
                            </div>
                        </div>

                        {/* Email Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                                <Mail className="text-togo-yellow w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Par Email</h3>
                            <p className="text-gray-500 mb-4">Envoyez-nous un message à tout moment.</p>
                            <a href="mailto:agbonon7@gmail.com" className="block text-lg font-medium text-gray-800 hover:text-togo-yellow transition-colors break-words">
                                agbonon7@gmail.com
                            </a>
                        </div>

                        {/* Location Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <MapPin className="text-togo-red w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Nous Trouver</h3>
                            <p className="text-gray-500">
                                Lomé, Togo<br />
                                Quartier Adidogomé
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Envoyer un message</h2>

                            {isSuccess ? (
                                <div className="bg-green-50 border border-togo-green rounded-xl p-8 text-center">
                                    <div className="w-16 h-16 bg-togo-green rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send className="text-white w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message envoyé !</h3>
                                    <p className="text-gray-600">Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
                                    <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-6">
                                        Envoyer un autre message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-gray-700">Votre Nom</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Jean Dupont"
                                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-gray-700">Votre Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="jean@exemple.com"
                                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="text-gray-700">Sujet</Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder="Comment puis-je..."
                                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-gray-700">Message</Label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={6}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            placeholder="J'aimerais avoir plus d'informations sur..."
                                            className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-togo-green focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black focus:bg-white transition-colors"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-12 text-lg font-medium bg-togo-green hover:bg-green-800 text-white"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Envoi en cours...
                                            </div>
                                        ) : (
                                            <span className="flex items-center">
                                                Envoyer le message <Send className="ml-2 w-5 h-5" />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-20 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions Fréquentes</h2>
                        <p className="text-gray-600">Trouvez des réponses rapides à vos interrogations.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                                    {faqOpen === index ? (
                                        <ChevronUp className="w-5 h-5 text-togo-green" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                                {faqOpen === index && (
                                    <div className="px-6 pb-6 pt-0">
                                        <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
