import { Navbar } from '@/components/Navbar';
import { Calendar, Music, Palette, CheckCircle, Shield, Globe, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2572&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-togo-green/80 via-transparent to-togo-red/80 mix-blend-overlay"></div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        L&apos;Âme Culturelle <span className="text-togo-yellow">du Togo</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
                        Plus qu&apos;une simple billetterie, nous sommes le pont entre votre passion et la richesse événementielle de notre terre.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-sm font-bold text-togo-green uppercase tracking-wider mb-2">Notre Mission</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Réinventer la découverte événementielle au Togo.</h3>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            TogoBilleterie est né d&apos;un constat simple : le talent et la culture togolaise bouillonnent, mais l&apos;accès à ces expériences reste parfois complexe.
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Notre objectif est de digitaliser l&apos;écosystème culturel en offrant une plateforme sécurisée, intuitive et adaptée à nos réalités locales, notamment grâce à l&apos;intégration de T-Money et Flooz.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex gap-3">
                                <CheckCircle className="text-togo-green shrink-0" />
                                <span className="text-gray-800 font-medium">100% Sécurisé</span>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle className="text-togo-green shrink-0" />
                                <span className="text-gray-800 font-medium">Paiement Mobile</span>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle className="text-togo-green shrink-0" />
                                <span className="text-gray-800 font-medium">Support Local</span>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle className="text-togo-green shrink-0" />
                                <span className="text-gray-800 font-medium">Innovation</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <img src="https://images.unsplash.com/photo-1533174072545-e8d9859f6d18?q=80&w=2000&auto=format&fit=crop" alt="Concert" className="rounded-2xl shadow-lg w-full h-64 object-cover transform translate-y-8" />
                            <img src="https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2000&auto=format&fit=crop" alt="Festival" className="rounded-2xl shadow-lg w-full h-64 object-cover" />
                        </div>
                        {/* Decorative Circle */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-togo-yellow/10 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </section>

            {/* Cultural Mosaic Section */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Mosaïque Culturelle</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Le Togo est une terre de diversité. Nous célébrons toutes les facettes de notre identité.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1: Festivals */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border-t-4 border-togo-green group">
                            <div className="bg-green-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Calendar className="w-8 h-8 text-togo-green" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Festivals & Traditions</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Des luttes Evala en pays Kabyé à la fête des moissons, vivez l&apos;intensité de nos traditions ancestrales qui rythment l&apos;année et unissent les peuples.
                            </p>
                        </div>

                        {/* Card 2: Arts */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border-t-4 border-togo-yellow group">
                            <div className="bg-yellow-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Palette className="w-8 h-8 text-togo-yellow" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Arts & Artisanat</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Découvrez le génie créatif togolais, des batiks colorés aux sculptures sur bois, en passant par l&apos;art contemporain qui expose à Lomé et au-delà.
                            </p>
                        </div>

                        {/* Card 3: Music */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border-t-4 border-togo-red group">
                            <div className="bg-red-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Music className="w-8 h-8 text-togo-red" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Musique & Scène</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Vibrez au son de l&apos;Afrobeat, du Highlife et des nouvelles sonorités urbaines. Nos scènes accueillent les talents confirmés et les stars de demain.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 px-4 bg-gray-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pourquoi TogoBilleterie ?</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="bg-gray-800 p-3 rounded-lg h-fit">
                                        <Shield className="w-6 h-6 text-togo-green" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Fiabilité Absolue</h4>
                                        <p className="text-gray-400">Chaque billet généré est unique et vérifiable instantanément par QR Code.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-gray-800 p-3 rounded-lg h-fit">
                                        <Globe className="w-6 h-6 text-togo-yellow" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Paiements Locaux</h4>
                                        <p className="text-gray-400">Intégration native de T-Money et Flooz pour que tout le monde puisse participer.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-gray-800 p-3 rounded-lg h-fit">
                                        <Users className="w-6 h-6 text-togo-red" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Communauté</h4>
                                        <p className="text-gray-400">Nous soutenons les promoteurs locaux en leur donnant les outils pour réussir.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 relative h-96">
                            {/* Abstract Map or Graphic */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-togo-green to-togo-yellow rounded-3xl opacity-20 blur-2xl"></div>
                            <div className="relative h-full bg-gray-800 border border-gray-700 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                                <span className="text-6xl mb-4">🇹🇬</span>
                                <h3 className="text-2xl font-bold mb-2">Fait par des Togolais</h3>
                                <p className="text-gray-400">Pour le monde entier.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 bg-white text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">Prêt à vivre l&apos;expérience ?</h2>
                    <p className="text-xl text-gray-600 mb-10">
                        Ne manquez plus aucun événement. Rejoignez la plateforme numéro 1 de billetterie au Togo.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/events">
                            <Button size="lg" className="bg-togo-green hover:bg-green-700 text-lg px-8 h-14 rounded-full w-full sm:w-auto">
                                Explorer les événements <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-full border-2 w-full sm:w-auto">
                                Nous Contacter
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
