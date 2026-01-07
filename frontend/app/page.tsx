"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Calendar, MapPin, Music, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../lib/api";
import EventCard, { EventProps } from "../components/EventCard";
import { Navbar } from "../components/Navbar";

export default function Home() {
  const [events, setEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events/public');
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      {/* Hero Section */}
      <section className="relative bg-togo-green h-[600px] rounded-br-[80px] overflow-hidden">
        {/* Abstract Background Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffce00_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-togo-yellow/10 transform skew-x-12 translate-x-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="max-w-3xl space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 text-togo-yellow text-sm font-bold border border-white/20">
              <span className="w-2 h-2 rounded-full bg-togo-yellow animate-pulse"></span>
              <span>La billetterie n°1 au Togo</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
              Vivez les meilleurs <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-togo-yellow to-yellow-200">événements</span> du Togo
            </h1>

            <p className="text-xl text-gray-200 max-w-2xl leading-relaxed">
              Concerts, festivals, sports, conférences... Réservez vos places en toute sécurité et simplicité sur TogoTickets.
            </p>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-2xl max-w-2xl flex flex-col md:flex-row gap-2 transform transition-all hover:scale-[1.01]">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Artiste, événement, lieu..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-togo-green/20 transition-all outline-none text-gray-800 placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-togo-green hover:bg-green-800 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-togo-green/30 flex items-center justify-center space-x-2"
              >
                <span>Trouver</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[#232323] mb-2">Événements à la une</h2>
            <div className="h-1 w-20 bg-togo-yellow rounded-full"></div>
          </div>
          <Link href="/events" className="hidden md:flex items-center space-x-2 text-togo-green font-bold hover:text-green-800 transition-colors">
            <span>Tout voir</span>
            <ChevronRight size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-togo-green"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-xl text-gray-500 font-medium">Aucun événement disponible pour le moment.</p>
            <p className="text-gray-400 mt-2">Revenez plus tard !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Link href="/events" className="inline-flex items-center space-x-2 text-togo-green font-bold text-lg">
            <span>Voir tous les événements</span>
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#232323] mb-12 text-center">Explorer par catégorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Concerts', 'Festivals', 'Sport', 'Théâtre'].map((cat, idx) => (
              <div
                key={idx}
                className="group cursor-pointer"
                onClick={() => router.push(`/events?category=${cat === 'Concerts' ? 'Musique' : cat === 'Festivals' ? 'Festival' : cat}`)}
              >
                <div className="relative h-16 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className={`absolute inset-0 bg-gradient-to-tr ${idx % 2 === 0 ? 'from-green-600 to-togo-green' : 'from-yellow-500 to-togo-yellow'} opacity-90 group-hover:scale-110 transition-transform duration-500`}></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-base tracking-wide uppercase">
                    {cat}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
