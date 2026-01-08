"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, CheckCircle2 } from "lucide-react";
import { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import api, { fetchEventById, BACKEND_URL } from "@/lib/api";
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const eventId = searchParams.get("eventId");
    const ticketId = searchParams.get("ticketId");

    const [step, setStep] = useState<"summary" | "payment" | "success">("summary");
    const [paymentMethod, setPaymentMethod] = useState<"tmoney" | "flooz">("tmoney");
    const [isLoading, setIsLoading] = useState(false);
    const [event, setEvent] = useState<any>(null);
    const [ticketType, setTicketType] = useState<any>(null);
    const [purchasedTickets, setPurchasedTickets] = useState<any[]>([]);

    // User Form State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentNumber, setPaymentNumber] = useState("");

    const ticketRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            if (eventId && ticketId) {
                const eventData = await fetchEventById(eventId);
                if (eventData) {
                    setEvent(eventData);
                    const foundTicket = eventData.ticketTypes?.find((t: any) => t.id === parseInt(ticketId));
                    if (foundTicket) {
                        setTicketType(foundTicket);
                    }
                }
            }

            // Try to fetch user profile to pre-fill form
            try {
                const { data: user } = await api.get('/auth/me');
                if (user) {
                    setEmail(user.email || '');
                    setPhone(user.phoneNumber || '');
                    if (user.name) {
                        const parts = user.name.split(' ');
                        if (parts.length > 1) {
                            setFirstName(parts[0]);
                            setLastName(parts.slice(1).join(' '));
                        } else {
                            setFirstName(user.name);
                        }
                    }
                }
            } catch (e) {
                // Not logged in or error, ignore
            }
        };
        loadData();
    }, [eventId, ticketId]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Call Backend API to buy ticket
            const response = await api.post('/tickets/buy', {
                eventId: eventId ? parseInt(eventId) : undefined,
                ticketTypeId: ticketId ? parseInt(ticketId) : undefined,
                quantity: 1, // Default to 1 for now
                paymentMethod: paymentMethod.toUpperCase(),
                phoneNumber: paymentNumber,
                userDetails: {
                    firstName,
                    lastName,
                    email,
                    phone
                }
            });

            if (response.data && response.data.tickets) {
                setPurchasedTickets(response.data.tickets);
            }

            // Simulate network delay for effect
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setStep("success");
        } catch (error) {
            console.error("Payment failed", error);
            alert("Le paiement a échoué. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };



    const handleDownloadTicket = async () => {
        if (!ticketRef.current) return;

        try {
            const canvas = await html2canvas(ticketRef.current, {
                scale: 2, // High resolution
                backgroundColor: '#ffffff',
                useCORS: true // Essential for loading the external image
            });
            const imgData = canvas.toDataURL('image/png');
            // A5 Landscape: 210mm width x 148mm height
            const pdf = new jsPDF('l', 'mm', 'a5');

            const pdfWidth = 210;
            // Calculate dimensions to fit the landscape format essentially filling the page
            // We maintain aspect ratio but strive to fill width
            const imgProps = pdf.getImageProperties(imgData);
            const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfImgHeight);
            pdf.save(`ticket-${event?.title || 'event'}.pdf`);
        } catch (error) {
            console.error("Error generating PDF", error);
        }
    };

    if (step === "success") {
        const ticket = purchasedTickets[0]; // Display the first ticket for now
        // Construct image URL properly. Assuming backend is on localhost:3001
        // If event.imageUrl is "uploads/events/file.jpg", we prepend the base.
        const imageUrl = event?.imageUrl
            ? (event.imageUrl.startsWith('http') ? event.imageUrl : `${BACKEND_URL}/${event.imageUrl}`)
            : null;

        return (
            <div className="flex flex-col min-h-screen bg-slate-50">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl text-center space-y-8">
                        <div>
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-8 w-8 text-togo-green" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Paiement Réussi !</h2>
                            <p className="text-slate-500 mt-2">Votre billet pour <strong>{event?.title}</strong> est prêt.</p>
                        </div>

                        {/* Ticket Preview Component to be captured - A5 Landscape Ratio (approx 1.41) */}
                        <div style={{ overflowX: 'auto', paddingBottom: '20px' }}>
                            {/* Container sized to mimic A5 Landscape proportions roughly on screen (e.g., 800px x 565px or scaled down) */}
                            {/* ZERO Tailwind color classes used inside here */}
                            <div
                                ref={ticketRef}
                                style={{
                                    width: '800px',
                                    height: '560px', // A5 Ratio
                                    backgroundColor: '#ffffff',
                                    color: '#0F172A',
                                    display: 'flex',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    textAlign: 'left',
                                    position: 'relative',
                                    margin: '0 auto',
                                    fontFamily: 'sans-serif'
                                }}
                            >



                                {/* Header Image Section */}
                                <div style={{ width: '35%', height: '100%', position: 'relative', backgroundColor: '#1e293b', overflow: 'hidden' }}>
                                    {imageUrl ? (
                                        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img
                                                src={imageUrl}
                                                alt={event?.title}
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    objectFit: 'contain',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                                }}
                                                crossOrigin="anonymous"
                                            />
                                        </div>
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E2E8F0', color: '#94A3B8' }}>
                                            No Image
                                        </div>
                                    )}

                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        padding: '24px',
                                        zIndex: 10
                                    }}>
                                        <span style={{
                                            backgroundColor: '#006a4e',
                                            color: '#ffffff',
                                            padding: '6px 12px',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}>
                                            {event?.category || 'Événement'}
                                        </span>
                                    </div>
                                </div>

                                {/* MIDDLE COLUMN: INFO (40%) */}
                                <div style={{ width: '40%', padding: '40px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>

                                    <div>
                                        <h1 style={{ fontSize: '28px', fontWeight: '900', lineHeight: '1.1', marginBottom: '8px', color: '#1E293B', textTransform: 'uppercase' }}>
                                            {event?.title}
                                        </h1>
                                        <div style={{ width: '50px', height: '4px', backgroundColor: '#006a4e', marginBottom: '24px' }}></div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div>
                                                <p style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748B', fontWeight: 'bold' }}>Date</p>
                                                <p style={{ fontSize: '16px', fontWeight: '600', color: '#334155' }}>
                                                    {new Date(event?.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748B', fontWeight: 'bold' }}>Heure</p>
                                                <p style={{ fontSize: '16px', fontWeight: '600', color: '#334155' }}>
                                                    {new Date(event?.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748B', fontWeight: 'bold' }}>Lieu</p>
                                                <p style={{ fontSize: '16px', fontWeight: '600', color: '#334155' }}>
                                                    {event?.location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 'bold', marginBottom: '4px' }}>Acheteur</p>
                                        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F172A' }}>{firstName} {lastName}</p>
                                    </div>

                                    {/* Dashed Line Decoration Right Border */}
                                    <div style={{ position: 'absolute', right: 0, top: '20px', bottom: '20px', borderRight: '2px dashed #CBD5E1' }}></div>
                                    {/* Notches for tear-off effect */}
                                    <div style={{ position: 'absolute', right: '-12px', top: -12, width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#ffffff', zIndex: 10 }}></div>
                                    <div style={{ position: 'absolute', right: '-12px', bottom: -12, width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#ffffff', zIndex: 10 }}></div>
                                </div>

                                {/* RIGHT COLUMN: STUB/QR (25%) */}
                                <div style={{ width: '25%', padding: '30px', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>

                                    <div style={{ marginBottom: '20px' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '6px 16px',
                                            backgroundColor: '#DCFCE7',
                                            color: '#166534',
                                            fontSize: '14px',
                                            fontWeight: '800',
                                            border: '2px solid #166534',
                                            textTransform: 'uppercase'
                                        }}>
                                            {ticketType?.name}
                                        </span>
                                    </div>

                                    <div style={{ padding: '10px', backgroundColor: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '8px', marginBottom: '16px' }}>
                                        {ticket?.qrCode ? (
                                            <QRCodeSVG value={ticket.qrCode} size={110} />
                                        ) : (
                                            <div style={{ width: '110px', height: '110px', backgroundColor: '#E2E8F0' }}></div>
                                        )}
                                    </div>

                                    <p style={{ fontSize: '10px', fontFamily: 'monospace', color: '#64748B', wordBreak: 'break-all', lineHeight: 1.2 }}>
                                        {ticket?.qrCode}
                                    </p>

                                    <div style={{ marginTop: 'auto' }}>
                                        <p style={{ fontSize: '10px', color: '#94A3B8', fontStyle: 'italic' }}>Scan at gate</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 max-w-sm mx-auto">
                            <Button onClick={handleDownloadTicket} className="w-full bg-togo-green hover:bg-green-700 h-12 text-lg">
                                Télécharger le ticket (PDF)
                            </Button>
                            <Link href="/">
                                <Button variant="ghost" className="w-full">Retour à l&apos;accueil</Button>
                            </Link>
                        </div>
                    </div>
                </main >
            </div >
        );
    }

    if (!event || !ticketType) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <p>Chargement des détails de la commande...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <main className="container max-w-4xl px-4 py-8 flex-1">
                <h1 className="text-2xl font-bold mb-8">Finaliser votre commande</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-lg mb-4">Informations Personnelles</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input id="firstName" placeholder="Votre prénom" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input id="lastName" placeholder="Votre nom" value={lastName} onChange={e => setLastName(e.target.value)} required />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="email">Email (pour recevoir le billet)</Label>
                                    <Input id="email" type="email" placeholder="exemple@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input id="phone" type="tel" placeholder="+228 9X XX XX XX" value={phone} onChange={e => setPhone(e.target.value)} required />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-lg mb-4">Moyen de Paiement</h3>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div
                                    className={cn("cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors", paymentMethod === 'tmoney' ? 'border-togo-yellow bg-yellow-50/50' : 'border-slate-200')}
                                    onClick={() => setPaymentMethod('tmoney')}
                                >
                                    <Smartphone className="h-6 w-6 text-yellow-500" />
                                    <span className="font-semibold">T-Money</span>
                                </div>
                                <div
                                    className={cn("cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors", paymentMethod === 'flooz' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200')}
                                    onClick={() => setPaymentMethod('flooz')}
                                >
                                    <Smartphone className="h-6 w-6 text-blue-500" />
                                    <span className="font-semibold">Flooz</span>
                                </div>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Numéro de paiement {paymentMethod === 'tmoney' ? '(Togocom)' : '(Moov)'}</Label>
                                    <Input placeholder="9X XX XX XX" value={paymentNumber} onChange={e => setPaymentNumber(e.target.value)} required />
                                </div>
                                <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded-md">
                                    ⚠️ Simulation : Aucun débit réel ne sera effectué.
                                </div>
                                <Button className="w-full text-lg h-12 bg-togo-green hover:bg-green-700" type="submit" disabled={isLoading}>
                                    {isLoading ? 'Traitement...' : `Payer ${ticketType.price.toLocaleString('fr-FR')} FCFA`}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-24">
                            <h3 className="font-semibold text-lg mb-4">Résumé</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-medium text-slate-900">{event.title}</p>
                                    <p className="text-sm text-slate-500">{event.location}</p>
                                    <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-slate-600">Type</span>
                                        <span className="font-medium">{ticketType.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-slate-600">Prix unitaire</span>
                                        <span className="font-medium">{ticketType.price.toLocaleString('fr-FR')} FCFA</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-slate-600">Quantité</span>
                                        <span className="font-medium">1</span>
                                    </div>
                                </div>
                                <div className="border-t pt-4 flex justify-between items-center">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-lg text-togo-green">{ticketType.price.toLocaleString('fr-FR')} FCFA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
