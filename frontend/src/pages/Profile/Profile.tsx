import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

interface UserProfile {
  id: number;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  address: string;
  age: number | null;
  birthday: string | null;
  phone: string;
  bio: string;
  date_joined: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/users/me/');
        setProfile(response.data);
        setFormData(response.data);
      } catch (err: any) {
        console.error('Failed to fetch profile', err);
        setError('Failed to load profile details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await api.patch('/auth/users/me/', formData);
      setProfile(response.data);
      setFormData(response.data);
      setIsEditing(false);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error('Failed to update profile', err);
      setError('Failed to update profile. Please check the provided information.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow">{error}</div>
      </div>
    );
  }

  const displayName = profile?.name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || profile?.email;
  const initial = displayName?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header section */}
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-5xl font-bold text-slate-500 shadow-lg">
              {initial}
            </div>
          </div>
          <div className="absolute top-6 right-8">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2 rounded-lg font-medium transition-all shadow-sm border border-white/10"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 px-8 pb-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">{displayName}</h1>
              <p className="text-slate-500 font-medium">{profile?.email}</p>
              <p className="text-sm text-slate-400 mt-1">Joined {new Date(profile?.date_joined || '').toLocaleDateString()}</p>
            </div>
          </div>

          {successMsg && (
            <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              {successMsg}
            </div>
          )}

          {error && isEditing && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={formData.first_name || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={formData.last_name || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                    placeholder="How you want to be seen"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    value={formData.age || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="birthday" className="block text-sm font-semibold text-slate-700 mb-1">Birthday</label>
                  <input
                    type="date"
                    name="birthday"
                    id="birthday"
                    value={formData.birthday || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-semibold text-slate-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    id="bio"
                    rows={4}
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none resize-none"
                    placeholder="Tell us a little about yourself..."
                  />
                </div>
              </div>

              <div className="pt-5 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(profile || {});
                    setError(null);
                  }}
                  className="px-5 py-2.5 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md disabled:opacity-70 flex items-center"
                >
                  {saving && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">Email Address</p>
                      <p className="font-medium text-slate-900">{profile?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone Number</p>
                      <p className="font-medium text-slate-900">{profile?.phone || <span className="text-slate-400 italic">Not provided</span>}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="font-medium text-slate-900">{profile?.address || <span className="text-slate-400 italic">Not provided</span>}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Personal Details</h3>
                  <div className="space-y-4">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-sm text-slate-500">Age</p>
                        <p className="font-medium text-slate-900">{profile?.age || <span className="text-slate-400 italic">-</span>}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Birthday</p>
                        <p className="font-medium text-slate-900">{profile?.birthday || <span className="text-slate-400 italic">-</span>}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Bio</p>
                      <p className="font-medium text-slate-900 leading-relaxed mt-1">
                        {profile?.bio || <span className="text-slate-400 italic">No bio provided.</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
