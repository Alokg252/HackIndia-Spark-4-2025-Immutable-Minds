import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface ProfileProps {
  userAddress: string;
}

interface UserProfile {
  displayName: string;
  email: string;
  bio: string;
  notifications: {
    courseUpdates: boolean;
    certificates: boolean;
  };
  stats: {
    coursesEnrolled: number;
    certificatesEarned: number;
    hoursLearned: number;
  };
}

const Profile = ({ userAddress }: ProfileProps) => {
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    email: '',
    bio: '',
    notifications: {
      courseUpdates: true,
      certificates: true
    },
    stats: {
      coursesEnrolled: 0,
      certificatesEarned: 0,
      hoursLearned: 0
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  // Load profile data from localStorage or IPFS
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // First try to load from localStorage
        const savedProfile = localStorage.getItem(`profile-${userAddress}`);
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }

        // Load stats from blockchain/backend
        const stats = await fetchUserStats();
        if (stats) {
          setProfile(prev => ({
            ...prev,
            stats
          }));
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading profile:', error);
        setIsLoading(false);
      }
    };

    if (userAddress) {
      loadProfile();
    }
  }, [userAddress]);

  const fetchUserStats = async () => {
    // This would normally fetch from your backend/blockchain
    // For now, returning mock data
    return {
      coursesEnrolled: 4,
      certificatesEarned: 2,
      hoursLearned: 28
    };
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (setting: 'courseUpdates' | 'certificates') => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting]
      }
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Save to localStorage
      localStorage.setItem(`profile-${userAddress}`, JSON.stringify(profile));

      // Here you would typically also save to your backend/IPFS
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-8 py-12 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-12">
      <div className="flex gap-8">
        {/* Left Column */}
        <div className="w-[280px]">
          <div className="bg-[#0066FF] rounded-[24px] p-6 text-white mb-6">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-medium">
                  {profile.displayName ? profile.displayName.slice(0, 2).toUpperCase() : userAddress.slice(2, 4)}
                </span>
              </div>
              <h2 className="text-lg font-medium text-center mb-1">
                {profile.displayName || 'Your Name'}
              </h2>
              <p className="text-sm text-white/80">{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</p>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-gray-100">
            <h3 className="text-sm font-medium mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Attendance</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">19/20</div>
                  <div className="text-xs text-gray-600">Well done! Now attending all lessons. Keep going!</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Homework</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">53/56</div>
                  <div className="text-xs text-gray-600">Don't forget about your next homework</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Rating</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">89/100</div>
                  <div className="inline-block px-2 py-1 bg-blue-100 rounded-full text-xs font-medium text-blue-800">
                    Recommended
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1">
          <div className="bg-white rounded-[24px] p-8 border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Profile Settings</h2>
              <button 
                onClick={handleSaveChanges}
                disabled={isSaving}
                className={`bg-[#0066FF] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 ${
                  isSaving ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={profile.displayName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your display name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Tell us about yourself"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Course Updates</h3>
                  <p className="text-sm text-gray-600">Get notified about new course content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={profile.notifications.courseUpdates}
                    onChange={() => handleNotificationChange('courseUpdates')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0066FF]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">New Certificates</h3>
                  <p className="text-sm text-gray-600">Get notified when you earn a certificate</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={profile.notifications.certificates}
                    onChange={() => handleNotificationChange('certificates')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0066FF]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 