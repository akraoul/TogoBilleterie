"use client";

import { useState } from 'react';
import api from '../../../../lib/api';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, DollarSign, Image as ImageIcon, AlignLeft, Type, Phone, Plus, Trash2 } from 'lucide-react';

export default function CreateEventPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Musique',
        imageUrl: '',
        tmoneyNumber: '',
        floozNumber: ''
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const [ticketTypes, setTicketTypes] = useState([
        { name: 'Standard', price: '', quantity: '' }
    ]);

    const handleTicketTypeChange = (index: number, field: string, value: string) => {
        const newTicketTypes = [...ticketTypes];
        (newTicketTypes[index] as any)[field] = value;
        setTicketTypes(newTicketTypes);
    };

    const addTicketType = () => {
        setTicketTypes([...ticketTypes, { name: '', price: '', quantity: '' }]);
    };

    const removeTicketType = (index: number) => {
        if (ticketTypes.length > 1) {
            const newTicketTypes = ticketTypes.filter((_, i) => i !== index);
            setTicketTypes(newTicketTypes);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Combine date and time
            const fullDate = new Date(`${formData.date}T${formData.time}`);

            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('date', fullDate.toISOString());
            data.append('location', formData.location);
            data.append('category', formData.category);
            data.append('tmoneyNumber', formData.tmoneyNumber);
            data.append('floozNumber', formData.floozNumber);

            // Append ticket types as JSON string
            const validTicketTypes = ticketTypes.filter(t => t.name && t.price && t.quantity);
            data.append('ticketTypes', JSON.stringify(validTicketTypes));

            if (imageFile) {
                data.append('image', imageFile);
            }

            await api.post('/events', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            router.push('/promoter/events'); // Redirect to list
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la création');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Créer un événement</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Détails Principaux</label>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Type className="text-gray-400" size={18} />
                            </div>
                            <input
                                type="text"
                                name="title"
                                required
                                placeholder="Nom de l'événement"
                                value={formData.title}
                                onChange={handleChange}
                                className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-togo-green focus:border-togo-green sm:text-sm py-3 border text-black bg-white placeholder-gray-400"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <span className="block text-xs text-gray-500 mb-1">Catégorie</span>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-togo-green focus:border-togo-green sm:text-sm py-3 border text-black bg-white placeholder-gray-400"
                                >
                                    <option value="Musique">Musique / Concert</option>
                                    <option value="Festival">Festival</option>
                                    <option value="Sport">Sport</option>
                                    <option value="Culture">Arts & Culture</option>
                                    <option value="Humour">Humour / Stand-up</option>
                                    <option value="Theatre">Théâtre</option>
                                    <option value="Cinema">Cinéma</option>
                                    <option value="Soiree">Soirée / Clubbing</option>
                                    <option value="Conference">Conférence / Séminaire</option>
                                    <option value="Formation">Formation / Atelier</option>
                                    <option value="Tech">Tech & Innovation</option>
                                    <option value="Gastronomie">Gastronomie</option>
                                    <option value="Mode">Mode & Beauté</option>
                                    <option value="Religion">Religion</option>
                                    <option value="Tourisme">Tourisme</option>
                                    <option value="Autre">Autre</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date et Heure</label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-togo-green focus:border-togo-green sm:text-sm py-2 border px-3 text-black bg-white placeholder-gray-400"
                                />
                                <input
                                    type="time"
                                    name="time"
                                    required
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-togo-green focus:border-togo-green sm:text-sm py-2 border px-3 text-black bg-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="text-gray-400" size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    placeholder="Ex: Palais des Congrès"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-togo-green focus:border-togo-green sm:text-sm py-2 border text-black bg-white placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>



                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Types de Billets</label>
                            <button
                                type="button"
                                onClick={addTicketType}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-togo-green bg-green-100 hover:bg-green-200 focus:outline-none"
                            >
                                <Plus size={14} className="mr-1" /> Ajouter un type
                            </button>
                        </div>

                        <div className="space-y-3">
                            {ticketTypes.map((ticket, index) => (
                                <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="flex-1">
                                        <label className="block text-xs text-gray-500 mb-1">Nom (ex: VIP)</label>
                                        <input
                                            type="text"
                                            value={ticket.name}
                                            onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                                            placeholder="Standard"
                                            required
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-togo-green focus:border-togo-green sm:text-sm py-2 px-3 text-black bg-white placeholder-gray-400"
                                        />
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-xs text-gray-500 mb-1">Prix (FCFA)</label>
                                        <input
                                            type="number"
                                            value={ticket.price}
                                            onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                                            placeholder="5000"
                                            required
                                            min="0"
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-togo-green focus:border-togo-green sm:text-sm py-2 px-3 text-black bg-white placeholder-gray-400"
                                        />
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-xs text-gray-500 mb-1">Quantité</label>
                                        <input
                                            type="number"
                                            value={ticket.quantity}
                                            onChange={(e) => handleTicketTypeChange(index, 'quantity', e.target.value)}
                                            placeholder="100"
                                            required
                                            min="1"
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-togo-green focus:border-togo-green sm:text-sm py-2 px-3 text-black bg-white placeholder-gray-400"
                                        />
                                    </div>
                                    {ticketTypes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTicketType(index)}
                                            className="mt-6 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Numéros de Paiement (Mobile Money)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="block text-xs text-gray-500 mb-1">T-Money</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="text-yellow-500" size={18} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="tmoneyNumber"
                                        placeholder="Ex: 90000000"
                                        value={(formData as any).tmoneyNumber}
                                        onChange={handleChange}
                                        className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-togo-green focus:border-togo-green sm:text-sm py-2 border text-black bg-white"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-xs text-gray-500 mb-1">Flooz</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="text-blue-500" size={18} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="floozNumber"
                                        placeholder="Ex: 99000000"
                                        value={(formData as any).floozNumber}
                                        onChange={handleChange}
                                        className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-togo-green focus:border-togo-green sm:text-sm py-2 border text-black bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <AlignLeft className="text-gray-400" size={18} />
                            </div>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                placeholder="Décrivez votre événement..."
                                value={formData.description}
                                onChange={handleChange}
                                className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-togo-green focus:border-togo-green sm:text-sm py-2 border text-black bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image de couverture</label>

                        {previewUrl ? (
                            <div className="mb-4 relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageFile(null);
                                        setPreviewUrl(null);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-togo-green transition-colors cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                                <div className="space-y-1 text-center">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-togo-green hover:text-green-800 focus-within:outline-none">
                                            <span>Télécharger une image</span>
                                            <input id="file-upload" name="image" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                        </label>
                                        <p className="pl-1">ou glisser-déposer</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 5MB</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-togo-green hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-togo-green transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Création en cours...' : 'Soumettre pour validation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
