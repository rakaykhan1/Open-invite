import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const Calendar = () => {
    const { events } = useApp();
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isSameDay = (d1, d2) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const getEventsForDay = (day) => {
        return events.filter(event => {
            const eventDate = new Date(event.time);
            return isSameDay(eventDate, new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        });
    };

    const selectedEvents = events.filter(event => {
        const eventDate = new Date(event.time);
        return isSameDay(eventDate, selectedDate);
    });

    // Helper to get the start of the week (Monday)
    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const handleNavigateToFeed = () => {
        const startOfWeek = getStartOfWeek(selectedDate);
        const weekLabel = `Week of ${startOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
        const elementId = weekLabel.replace(/\s+/g, '-').toLowerCase();

        navigate('/', { state: { scrollTo: elementId } });
    };

    return (
        <div className="p-4 pt-8 h-full flex flex-col">
            <header className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Calendar</h1>
                <div className="flex items-center gap-4 bg-slate-800/50 rounded-xl p-1">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-medium min-w-[100px] text-center">
                        {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </header>

            <div className="bg-slate-800/30 rounded-3xl p-4 mb-6">
                <div className="grid grid-cols-7 mb-4 text-center text-slate-500 text-xs font-medium uppercase tracking-wider">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i}>{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-y-4 gap-x-1">
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: days }).map((_, i) => {
                        const day = i + 1;
                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const dayEvents = getEventsForDay(day);
                        const isSelected = isSameDay(date, selectedDate);
                        const isToday = isSameDay(date, new Date());

                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(date)}
                                className="relative flex flex-col items-center justify-center h-10"
                            >
                                <span
                                    className={clsx(
                                        "w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all",
                                        isSelected ? "bg-primary text-white font-bold shadow-lg shadow-primary/30" :
                                            isToday ? "bg-slate-700 text-white font-medium" : "text-slate-300 hover:bg-slate-800/50"
                                    )}
                                >
                                    {day}
                                </span>
                                {dayEvents.length > 0 && (
                                    <div className="flex gap-0.5 mt-1">
                                        {dayEvents.slice(0, 3).map((ev, idx) => (
                                            <div
                                                key={idx}
                                                className={clsx(
                                                    "w-1 h-1 rounded-full",
                                                    ev.type === 'food' ? 'bg-orange-400' :
                                                        ev.type === 'culture' ? 'bg-purple-400' :
                                                            ev.type === 'party' ? 'bg-pink-400' : 'bg-blue-400'
                                                )}
                                            />
                                        ))}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                        {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h3>
                    <button
                        onClick={handleNavigateToFeed}
                        className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
                    >
                        View in Feed <ArrowRight size={12} />
                    </button>
                </div>

                <div className="space-y-2 pb-20">
                    <AnimatePresence mode="popLayout">
                        {selectedEvents.length > 0 ? (
                            selectedEvents.map((event) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <EventCard event={event} showDate={false} />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-slate-500 py-8 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700"
                            >
                                <p>No plans for this day</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
