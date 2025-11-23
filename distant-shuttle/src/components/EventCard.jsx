import React from 'react';
import { MapPin, Clock, UserPlus, Check, CalendarDays } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const EventCard = ({ event, showDate = false }) => {
    const { getUser, joinEvent, leaveEvent, currentUser } = useApp();
    const creator = getUser(event.creatorId);
    const isAttending = event.attendees.includes(currentUser.id);

    const handleJoinToggle = () => {
        if (isAttending) {
            leaveEvent(event.id);
        } else {
            joinEvent(event.id);
        }
    };

    const openGoogleMaps = () => {
        const query = encodeURIComponent(event.location);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    const typeColors = {
        food: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        culture: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        party: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
        other: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };

    const eventDate = new Date(event.time);
    const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = eventDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <motion.div
            className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-5 relative overflow-hidden group"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-full border-2 border-dark" />
                    <div>
                        <h3 className="font-bold text-lg leading-tight">{event.title}</h3>
                        <p className="text-slate-400 text-xs">by {creator.name}</p>
                    </div>
                </div>
                <span className={clsx("px-3 py-1 rounded-full text-xs font-medium border", typeColors[event.type] || typeColors.other)}>
                    {event.type.toUpperCase()}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                {showDate && (
                    <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                        <CalendarDays size={16} className="text-slate-400" />
                        {formattedDate}
                    </div>
                )}
                <button
                    onClick={openGoogleMaps}
                    className="flex items-center gap-2 text-slate-300 text-sm hover:text-primary transition-colors text-left"
                >
                    <MapPin size={16} className="text-primary" />
                    <span className="underline decoration-slate-600 underline-offset-2 group-hover:decoration-primary">{event.location}</span>
                </button>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Clock size={16} className="text-secondary" />
                    {formattedTime}
                </div>
                {event.notes && (
                    <div className="mt-2 p-3 bg-slate-900/50 rounded-xl text-xs text-slate-400 italic border border-white/5">
                        "{event.notes}"
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <div className="flex -space-x-2">
                    {event.attendees.map((userId) => {
                        const user = getUser(userId);
                        return (
                            <img
                                key={userId}
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full border-2 border-slate-800"
                                title={user.name}
                            />
                        );
                    })}
                    {event.attendees.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-xs text-white">
                            +{event.attendees.length - 3}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleJoinToggle}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95",
                        isAttending
                            ? "bg-green-500/20 text-green-400 border border-green-500/50"
                            : "bg-primary text-white shadow-lg shadow-primary/30"
                    )}
                >
                    {isAttending ? (
                        <>
                            <Check size={16} /> Going
                        </>
                    ) : (
                        <>
                            <UserPlus size={16} /> Join
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default EventCard;
