import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setCurrentUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchEvents();
            fetchUsers();

            // Real-time subscription for events
            const eventsSubscription = supabase
                .channel('public:events')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchEvents)
                .subscribe();

            // Real-time subscription for attendees
            const attendeesSubscription = supabase
                .channel('public:attendees')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'attendees' }, fetchEvents)
                .subscribe();

            return () => {
                supabase.removeChannel(eventsSubscription);
                supabase.removeChannel(attendeesSubscription);
            };
        }
    }, [currentUser]);

    const fetchProfile = async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (data) {
            setCurrentUser({ ...data, isCurrentUser: true, avatar: data.avatar_url || `https://ui-avatars.com/api/?name=${data.full_name}` });
        }
        setLoading(false);
    };

    const fetchUsers = async () => {
        const { data } = await supabase.from('profiles').select('*');
        if (data) {
            setUsers(data.map(u => ({ ...u, avatar: u.avatar_url || `https://ui-avatars.com/api/?name=${u.full_name}` })));
        }
    };

    const fetchEvents = async () => {
        if (!currentUser) return;

        // Get friend IDs first
        const { data: friendships } = await supabase
            .from('friendships')
            .select('friend_id, user_id')
            .eq('status', 'accepted')
            .or(`user_id.eq.${currentUser.id},friend_id.eq.${currentUser.id}`);

        const friendIds = friendships ? friendships.map(f => f.user_id === currentUser.id ? f.friend_id : f.user_id) : [];
        const visibleUserIds = [...friendIds, currentUser.id];

        const { data: eventsData, error } = await supabase
            .from('events')
            .select(`
        *,
        attendees (user_id)
      `)
            .in('creator_id', visibleUserIds); // Only fetch events from friends + self

        if (eventsData) {
            const formattedEvents = eventsData.map(event => ({
                ...event,
                creatorId: event.creator_id,
                attendees: event.attendees.map(a => a.user_id)
            }));
            setEvents(formattedEvents);
        }
    };

    const addEvent = async (eventData) => {
        if (!currentUser) return;

        const { error } = await supabase.from('events').insert({
            title: eventData.title,
            location: eventData.location,
            time: eventData.time,
            type: eventData.type,
            notes: eventData.notes,
            creator_id: currentUser.id
        });

        if (error) console.error('Error adding event:', error);
    };

    const joinEvent = async (eventId) => {
        if (!currentUser) return;
        await supabase.from('attendees').insert({ event_id: eventId, user_id: currentUser.id });
        fetchEvents(); // Optimistic update or wait for subscription
    };

    const leaveEvent = async (eventId) => {
        if (!currentUser) return;
        await supabase.from('attendees').delete().match({ event_id: eventId, user_id: currentUser.id });
        fetchEvents();
    };

    const getUser = (id) => {
        const user = users.find((u) => u.id === id);
        return user || { name: 'Unknown', avatar: 'https://i.pravatar.cc/150?u=unknown' };
    };

    return (
        <AppContext.Provider
            value={{
                events,
                currentUser,
                users,
                loading,
                addEvent,
                joinEvent,
                leaveEvent,
                getUser,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
