'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { User, Mail, Phone, Building, Award, Calendar, Save, Lock, Camera } from 'lucide-react';

// Doctor profile interface
interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  hospital: string;
  yearsOfExperience: number;
  qualifications: string[];
  bio: string;
  profileImage: string;
  joinedDate: string;
  casesHandled: number;
}

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    hospital: '',
    bio: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // In a real app, fetch data from API
    const fetchDoctorProfile = async () => {
      try {
        // This would be the API call:
        // const response = await fetch('/api/doctor/profile');
        // const data = await response.json();

        // Mock data for development
        const mockProfile: DoctorProfile = {
          id: 'D12345',
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@maishacare.com',
          phone: '+254 712 345 678',
          specialization: 'General Practitioner',
          hospital: 'Maisha Care Hospital',
          yearsOfExperience: 8,
          qualifications: [
            'MD, University of Nairobi',
            'Fellowship in Primary Care',
            'Certified in Telemedicine Practice'
          ],
          bio: 'Dr. Sarah Johnson is a dedicated general practitioner with 8 years of experience in primary care and telemedicine. She is passionate about making healthcare accessible to all patients through innovative digital solutions.',
          profileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
          joinedDate: '2022-02-15',
          casesHandled: 128
        };

        setTimeout(() => {
          setProfile(mockProfile);
          setFormData({
            name: mockProfile.name,
            email: mockProfile.email,
            phone: mockProfile.phone,
            specialization: mockProfile.specialization,
            hospital: mockProfile.hospital,
            bio: mockProfile.bio,
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, make API call to update the profile
      // await fetch('/api/doctor/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update local state to reflect changes
      if (profile) {
        setProfile({
          ...profile,
          ...formData,
        });
      }

      setEditMode(false);
      setIsSubmitting(false);

      // Show success toast (in a real app)
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsSubmitting(false);

      // Show error toast (in a real app)
      alert('Failed to update profile. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color1"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">Profile not found</h2>
        <p className="mt-2 text-gray-500">Unable to load your profile information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Profile tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('profile')}
            className={`mr-4 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-color1 text-color1'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`mr-4 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-color1 text-color1'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`mr-4 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-color1 text-color1'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Statistics
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row">
              {/* Profile image */}
              <div className="mb-6 lg:mb-0 lg:mr-10 flex flex-col items-center">
                <div className="relative mb-4">
                  <Image
                    src={profile.profileImage}
                    alt={`Profile photo of ${profile.name}`}
                    width={128}
                    height={128}
                    className="rounded-full object-cover border-4 border-white shadow-md"
                  />
                  {editMode && (
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 p-1.5 bg-color1 text-white rounded-full hover:bg-color1/90 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <h1 className="text-xl font-bold text-gray-900 text-center">{profile.name}</h1>
                <p className="text-color1 font-medium">{profile.specialization}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Joined {formatDate(profile.joinedDate)}</span>
                </div>
              </div>

              {/* Profile details / form */}
              <div className="flex-1">
                {editMode ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="pl-10 w-full rounded-md border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="pl-10 w-full rounded-md border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="pl-10 w-full rounded-md border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                          Specialization
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Award className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="specialization"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            className="pl-10 w-full rounded-md border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-1">
                          Hospital / Clinic
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="hospital"
                            name="hospital"
                            value={formData.hospital}
                            onChange={handleInputChange}
                            className="pl-10 w-full rounded-md border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Professional Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-6 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-color1/30"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-color1 hover:bg-color1/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-color1/30 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-1" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                        <div className="mt-3 space-y-4">
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-gray-400 mr-3" />
                            <span>{profile.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-5 w-5 text-gray-400 mr-3" />
                            <span>{profile.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Professional Details</h3>
                        <div className="mt-3 space-y-4">
                          <div className="flex items-center">
                            <Building className="h-5 w-5 text-gray-400 mr-3" />
                            <span>{profile.hospital}</span>
                          </div>
                          <div className="flex items-start">
                            <Award className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                            <div>
                              <span>{profile.yearsOfExperience} years of experience</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Qualifications</h3>
                      <ul className="mt-3 list-disc list-inside space-y-1">
                        {profile.qualifications.map((qualification, index) => (
                          <li key={index} className="text-gray-700">{qualification}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">About</h3>
                      <p className="mt-3 text-gray-700">{profile.bio}</p>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-color1 hover:bg-color1/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-color1/30"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Lock className="h-5 w-5 mr-2 text-color1" />
            Security Settings
          </h2>
          
          <form className="space-y-6 max-w-2xl">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                className="w-full rounded-md border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
                placeholder="Enter your current password"
              />
            </div>
            
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                className="w-full rounded-md border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
                placeholder="Enter your new password"
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters and include uppercase, lowercase, number and special character.
              </p>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full rounded-md border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-color1/30 focus:border-color1"
                placeholder="Confirm your new password"
              />
            </div>
            
            <div className="pt-2">
              <button
                type="button"
                className="px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-color1 hover:bg-color1/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-color1/30"
              >
                Update Password
              </button>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
              <p className="text-gray-600 mb-4">
                Add an extra layer of security to your account by enabling two-factor authentication.
              </p>
              
              <button
                type="button"
                className="px-6 py-2.5 border border-color1 shadow-sm text-sm font-medium rounded-md text-color1 bg-white hover:bg-color1/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-color1/30"
              >
                Enable Two-Factor Authentication
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
          <h2 className="text-xl font-bold mb-6">Statistics & Performance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700">Cases Handled</h3>
              <p className="text-3xl font-bold text-color1 mt-2">{profile.casesHandled}</p>
              <p className="text-sm text-gray-500 mt-1">Since joining</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700">Response Time</h3>
              <p className="text-3xl font-bold text-color1 mt-2">4.2h</p>
              <p className="text-sm text-gray-500 mt-1">Average response time</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700">Satisfaction</h3>
              <p className="text-3xl font-bold text-color1 mt-2">4.8/5</p>
              <p className="text-sm text-gray-500 mt-1">Based on patient feedback</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { date: '2023-06-22', action: 'Reviewed case #45892' },
                  { date: '2023-06-20', action: 'Updated treatment plan for case #45878' },
                  { date: '2023-06-19', action: 'Approved AI recommendation for case #45860' },
                  { date: '2023-06-15', action: 'Reviewed case #45832' },
                  { date: '2023-06-12', action: 'Reviewed case #45810' },
                ].map((activity, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-md">
                    <span>{activity.action}</span>
                    <span className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Performance Metrics</h3>
              <p className="text-gray-600 mb-4">
                Detailed performance analytics and metrics will be available soon.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}