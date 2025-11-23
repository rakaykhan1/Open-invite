import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, MapPin, Clock, Type } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const CreateEvent = () => {
    const navigate = useNavigate();
    const { addEvent } = useApp();
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        time: '',
        type: 'food',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.location || !formData.time) return;

        addEvent(formData);
        navigate('/');
    };

    const types = [
        { id: 'food', label: 'Food & Drink', emoji: '🍔' },
        { id: 'culture', label: 'Culture', emoji: '🎨' },
        { id: 'party', label: 'Party', emoji: '🎉' },
        { id: 'other', label: 'Other', emoji: '📍' },
    ];

    return (
        <div className="p-4 pt-8 min-h-screen bg-dark">
            <header className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold">New Plan</h1>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm text-slate-400 font-medium ml-1">What are you doing?</label>
                    <div className="relative">
                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="e.g. Dinner at Mario's"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-slate-400 font-medium ml-1">Where?</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Location"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-slate-400 font-medium ml-1">When?</label>
                    <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="datetime-local"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [color-scheme:dark]"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-slate-400 font-medium ml-1">Notes</label>
                    <textarea
                        placeholder="Any extra details? (e.g. bring a coat)"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none h-24"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-slate-400 font-medium ml-1">Category</label>
                    <div className="grid grid-cols-2 gap-3">
                        {types.map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, type: type.id })}
                                className={clsx(
                                    "p-4 rounded-2xl border text-left transition-all duration-200",
                                    formData.type === type.id
                                        ? "bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                        : "bg-slate-800/30 border-slate-700 text-slate-400 hover:bg-slate-800"
                                )}
                            >
                                <span className="text-2xl mb-2 block">{type.emoji}</span>
                                <span className="text-sm font-medium">{type.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all mt-8"
                >
                    Post Plan
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
