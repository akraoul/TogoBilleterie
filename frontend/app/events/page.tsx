"use client";

import { Navbar } from "@/components/Navbar";
import EventCard, { EventProps } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { fetchEvents } from "@/lib/api";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function EventsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Chargement...</div>}>
            <EventsContent />
        </Suspense>
    );
}

function EventsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [events, setEvents] = useState<EventProps[]>([]);
    const [loading, setLoading] = useState(true);

    // Initialize state from URL params
    const initialSearch = searchParams.get('search') || "";
    const initialCategory = searchParams.get('category') || null;

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
    const [showFilters, setShowFilters] = useState(!!initialCategory); // Auto-open filters if category is selected

    const CATEGORIES = [
        "Musique", "Festival", "Sport", "Culture", "Humour",
        "Theatre", "Cinema", "Soiree", "Conference", "Formation",
        "Tech", "Gastronomie", "Mode", "Religion", "Tourisme", "Autre"
    ];

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const apiEvents = await fetchEvents();
                if (apiEvents) {
                    const mappedEvents = apiEvents.map((e: any) => ({
                        id: e.id,
                        title: e.title,
                        date: new Date(e.date).toLocaleDateString('fr-TG', { day: 'numeric', month: 'short', year: 'numeric' }),
                        location: e.location,
                        price: e.price, // backend already sends number, display handles formatting or we format here ONCE
                        category: e.category,
                        imageUrl: e.imageUrl
                    }));
                    setEvents(mappedEvents);
                } else {
                    setEvents([]);
                }
            } catch (error) {
                console.error("Failed to load events", error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    // Filter logic
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filtering: Case-insensitive and handles "Theatrre" vs "Théâtre" potentially if we normalize, 
        // but for now strict equality or mapped check.
        const matchesCategory = selectedCategory
            ? (event.category === selectedCategory || (selectedCategory === "Theatre" && event.category === "Théâtre"))
            : true;

        return matchesSearch && matchesCategory;
    });

    const updateUrl = (search: string, category: string | null) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        router.replace(`/events?${params.toString()}`, { scroll: false });
    };

    // Sync state changes to URL (optional but good for shareability)
    useEffect(() => {
        // Debounce URL update to avoid history spam could be nice, but simple replace is okay for now
        // actually, let's NOT auto-sync back to URL on every keystroke to avoid lag, 
        // but initial load FROM URL is the critical part requested.
    }, [searchQuery, selectedCategory]);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <main className="container px-4 md:px-6 py-8 flex-1">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tous les événements</h1>
                        <p className="text-slate-500">Explorez ce qui se passe à Lomé et partout au Togo.</p>
                    </div>

                    <div className="flex flex-col w-full md:w-auto gap-4">
                        <div className="flex w-full md:w-auto gap-2">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <input
                                    type="search"
                                    placeholder="Rechercher..."
                                    className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-togo-yellow focus:ring-1 focus:ring-togo-yellow placeholder:text-slate-500"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        // updateUrl(e.target.value, selectedCategory);
                                    }}
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setShowFilters(!showFilters)}
                                className={cn(showFilters && "bg-slate-200")}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters Area */}
                {showFilters && (
                    <div className="mb-8 p-4 bg-white rounded-lg border shadow-sm animate-in slide-in-from-top-2">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-sm">Filtrer par catégorie</h3>
                            {selectedCategory && (
                                <Button variant="ghost" size="sm" onClick={() => { setSelectedCategory(null); updateUrl(searchQuery, null); }} className="h-6 text-xs text-red-500 hover:text-red-700 hover:bg-red-50">
                                    Effacer <X className="ml-1 h-3 w-3" />
                                </Button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        const newCat = selectedCategory === category ? null : category;
                                        setSelectedCategory(newCat);
                                        updateUrl(searchQuery, newCat);
                                    }}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                                        selectedCategory === category
                                            ? "bg-togo-green text-white border-togo-green"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-togo-green hover:text-togo-green"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-togo-green"></div>
                        </div>
                    ) : filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center">
                            <p className="text-slate-500 text-lg">Aucun événement ne correspond à votre recherche.</p>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory(null);
                                    router.replace('/events');
                                }}
                                className="text-togo-red hover:underline"
                            >
                                Tout effacer
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <footer className="py-6 border-t text-center text-xs text-slate-500 bg-white">
                © 2026 TogoTickets
            </footer>
        </div>
    );
}
