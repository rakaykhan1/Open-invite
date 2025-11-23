import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';
import { Camera, Save, LogOut } from 'lucide-react';

const Profile = () => {
    const { currentUser } = useApp();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (currentUser) {
            setFullName(currentUser.full_name || '');
            setUsername(currentUser.username || '');
            setAvatarUrl(currentUser.avatar);
        }
    }, [currentUser]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    username: username,
                    updated_at: new Date(),
                })
                .eq('id', currentUser.id);

            if (error) throw error;
            alert('Profile updated!');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (event) => {
        try {
            setLoading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', currentUser.id);

            if (updateError) {
                throw updateError;
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) return null;

    return (
        <div className="p-8 flex flex-col items-center h-full">
            <div className="relative mb-8 group">
                <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-primary shadow-xl shadow-primary/20 object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-slate-800 p-2 rounded-full border border-slate-600 cursor-pointer hover:bg-slate-700 transition-colors">
                    <Camera size={20} className="text-white" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={loading}
                    />
                </label>
            </div>

            <div className="w-full max-w-sm space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-slate-400 ml-1">Full Name</label>
                    <input
                        type="text"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none transition-colors"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-slate-400 ml-1">Username</label>
                    <input
                        type="text"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none transition-colors"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 mt-4"
                >
                    <Save size={20} />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                    onClick={handleSignOut}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
