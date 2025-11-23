import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Feed = () => {
    const { events, currentUser } = useApp();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollTo) {
            const element = document.getElementById(location.state.scrollTo);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    // Sort events by time
    const sortedEvents = [...events].sort((a, b) => new Date(a.time) - new Date(b.time));

    // Helper to get the start of the week (Monday)
    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    // Group events by week
    const groupedEvents = sortedEvents.reduce((acc, event) => {
        const date = new Date(event.time);
        const startOfWeek = getStartOfWeek(date);

        const weekLabel = `Week of ${startOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;

        if (!acc[weekLabel]) {
            acc[weekLabel] = [];
        }
        acc[weekLabel].push(event);
        return acc;
    }, {});

    return (
        <div className="p-4 pt-8">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Open Invite
                    </h1>
                    <p className="text-slate-400 text-sm">See where your friends are going</p>
                </div>
                <img
                    src={currentUser.avatar}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-primary"
                />
            </header>

            <div className="space-y-8">
                {Object.entries(groupedEvents).map(([weekLabel, weekEvents], groupIndex) => (
                    <div key={weekLabel} id={weekLabel.replace(/\s+/g, '-').toLowerCase()}>
                        <h2 className="text-slate-400 font-medium text-sm mb-4 uppercase tracking-wider sticky top-0 bg-dark/95 backdrop-blur-sm py-3 z-10 border-b border-white/5">
                            {weekLabel}
                        </h2>
                        <div className="space-y-3">
                            {weekEvents.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (groupIndex * 0.1) + (index * 0.05) }}
                                >
                                    <EventCard event={event} showDate={true} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}

                {sortedEvents.length === 0 && (
                    <div className="text-center text-slate-500 py-10">
                        <p>No plans yet. Be the first!</p>
                    </div>
                )}
            </div>

            <div className="h-20" /> {/* Spacer for bottom nav */}
        </div>
    );
};

export default Feed;
