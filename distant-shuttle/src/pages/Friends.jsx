import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';
import { UserPlus, Check, X, Search, UserCheck } from 'lucide-react';

const Friends = () => {
    const { currentUser } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [activeTab, setActiveTab] = useState('friends'); // 'friends' | 'add'

    useEffect(() => {
        if (currentUser) {
            fetchFriends();
            fetchFriendRequests();
        }
    }, [currentUser]);

    const fetchFriends = async () => {
        const { data, error } = await supabase
            .from('friendships')
            .select(`
        id,
        friend:friend_id (id, full_name, username, avatar_url),
        user:user_id (id, full_name, username, avatar_url)
      `)
            .eq('status', 'accepted')
            .or(`user_id.eq.${currentUser.id},friend_id.eq.${currentUser.id}`);

        if (data) {
            const formattedFriends = data.map(f =>
                f.user.id === currentUser.id ? f.friend : f.user
            );
            setFriends(formattedFriends);
        }
    };

    const fetchFriendRequests = async () => {
        const { data } = await supabase
            .from('friendships')
            .select(`
        id,
        user:user_id (id, full_name, username, avatar_url)
      `)
            .eq('friend_id', currentUser.id)
            .eq('status', 'pending');

        if (data) {
            setFriendRequests(data);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        const { data } = await supabase
            .from('profiles')
            .select('*')
            .ilike('username', `%${searchQuery}%`)
            .neq('id', currentUser.id)
            .limit(5);

        if (data) {
            setSearchResults(data);
        }
    };

    const sendFriendRequest = async (userId) => {
        const { error } = await supabase
            .from('friendships')
            .insert({ user_id: currentUser.id, friend_id: userId });

        if (error) {
            alert('Error sending request (maybe already sent?)');
        } else {
            alert('Request sent!');
            setSearchResults(prev => prev.filter(u => u.id !== userId));
        }
    };

    const acceptRequest = async (friendshipId) => {
        await supabase
            .from('friendships')
            .update({ status: 'accepted' })
            .eq('id', friendshipId);

        fetchFriendRequests();
        fetchFriends();
    };

    return (
        <div className="p-4 pt-8 h-full flex flex-col">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-4">Friends</h1>
                <div className="flex bg-slate-800/50 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('friends')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'friends' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        My Friends
                    </button>
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'add' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Add Friend
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'friends' ? (
                    <div className="space-y-4">
                        {friendRequests.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Requests</h3>
                                <div className="space-y-2">
                                    {friendRequests.map(req => (
                                        <div key={req.id} className="bg-slate-800/40 p-3 rounded-xl flex items-center justify-between border border-primary/20">
                                            <div className="flex items-center gap-3">
                                                <img src={req.user.avatar_url || `https://ui-avatars.com/api/?name=${req.user.full_name}`} className="w-10 h-10 rounded-full" alt="" />
                                                <div>
                                                    <p className="font-bold text-sm">{req.user.full_name}</p>
                                                    <p className="text-xs text-slate-400">@{req.user.username}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => acceptRequest(req.id)} className="p-2 bg-primary rounded-full text-white"><Check size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Your Friends ({friends.length})</h3>
                        {friends.map(friend => (
                            <div key={friend.id} className="flex items-center gap-3 p-2 hover:bg-slate-800/30 rounded-xl transition-colors">
                                <img src={friend.avatar_url || `https://ui-avatars.com/api/?name=${friend.full_name}`} className="w-12 h-12 rounded-full border border-slate-700" alt="" />
                                <div>
                                    <p className="font-bold">{friend.full_name}</p>
                                    <p className="text-sm text-slate-400">@{friend.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search by username..."
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>

                        <div className="space-y-2">
                            {searchResults.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name}`} className="w-10 h-10 rounded-full" alt="" />
                                        <div>
                                            <p className="font-bold text-sm">{user.full_name}</p>
                                            <p className="text-xs text-slate-400">@{user.username}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => sendFriendRequest(user.id)}
                                        className="p-2 bg-slate-700 hover:bg-primary text-white rounded-lg transition-colors"
                                    >
                                        <UserPlus size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Friends;
