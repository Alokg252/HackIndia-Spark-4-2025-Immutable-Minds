import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatabaseService from '../services/DatabaseService';

interface DashboardProps {
  userAddress: string | null;
}

interface UserProfile {
  id: number;
  display_name: string;
  attendance: number;
  total_attendance: number;
  homework_completed: number;
  total_homework: number;
  rating: number;
  max_rating: number;
  weekly_goal_progress: number;
}

interface Event {
  id: number;
  title: string;
  date: string;
  image: string;
}

interface Task {
  id: number;
  title: string;
  deadline: string;
  status: 'todo' | 'review' | 'completed';
  completion_date?: string;
}

interface TimeTableEntry {
  id: number;
  time: string;
  title: string;
  subject: string;
  subject_color: string;
  participants: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: JSX.Element;
  notifications?: number;
}

const Dashboard: React.FC<DashboardProps> = ({ userAddress }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timetable, setTimetable] = useState<TimeTableEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('lessons');
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!userAddress) {
        setError('Please connect your wallet to view the dashboard.');
        setIsLoading(false);
        return;
      }

      console.log('Loading dashboard data for address:', userAddress);
      setIsLoading(true);
      setError(null);
      
      try {
        const db = DatabaseService.getInstance();
        
        // Get saved name from localStorage first
        const savedProfile = localStorage.getItem(`profile-${userAddress}`);
        const savedName = savedProfile ? JSON.parse(savedProfile).displayName : null;
        
        // Load user profile from database
        const userProfiles = await db.query('user_profiles', { wallet_address: userAddress });
        
        if (userProfiles.length === 0) {
          // Create default profile with saved name
          const newProfile = await db.execute('INSERT', 'user_profiles', {
            wallet_address: userAddress,
            display_name: savedName || 'New User',
            attendance: 19,
            total_attendance: 20,
            homework_completed: 53,
            total_homework: 56,
            rating: 89,
            max_rating: 100,
            weekly_goal_progress: 70
          });
          
          setProfile(newProfile);
          
          // Add default tasks
          const defaultTasks = [
            { title: 'Rational Inequalities. AI Assessment #5', status: 'todo', deadline: '2024-03-30' },
            { title: 'All about Homostas. Quiz', status: 'todo', deadline: '2024-03-29' },
            { title: 'Historical Chronicles', status: 'review', deadline: '2024-03-30' },
            { title: 'Physics Phantoms', status: 'completed', completion_date: '2024-03-25' }
          ];
          
          for (const task of defaultTasks) {
            await db.execute('INSERT', 'tasks', {
              user_id: newProfile.id,
              ...task
            });
          }
          
          // Load tasks after creation
          const tasks = await db.query('tasks', { user_id: newProfile.id });
          setTasks(tasks);
        } else {
          // If we have a saved name, update the profile
          if (savedName && savedName !== userProfiles[0].display_name) {
            const updatedProfile = await db.execute('UPDATE', 'user_profiles', {
              id: userProfiles[0].id,
              display_name: savedName
            });
            setProfile(updatedProfile || userProfiles[0]);
          } else {
            setProfile(userProfiles[0]);
          }
          const tasks = await db.query('tasks', { user_id: userProfiles[0].id });
          setTasks(tasks);
        }
        
        // Set empty arrays for events and timetable for now
        setEvents([]);
        setTimetable([]);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [userAddress]);

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const reviewTasks = tasks.filter(task => task.status === 'review');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const menuItems: MenuItem[] = [
    {
      id: 'lessons',
      label: 'Lessons',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 'timetable',
      label: 'Timetable',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'homework',
      label: 'Homework',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    },
    {
      id: 'assessments',
      label: 'Assessments',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      notifications: 1
    }
  ];

  const supportItems: MenuItem[] = [
    {
      id: 'support',
      label: 'Support',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'lessons':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Lessons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((lesson) => (
                <div key={lesson} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-2">Lesson {lesson}</h3>
                  <p className="text-gray-600 mb-4">Next class: Today, 2:00 PM</p>
                  <button className="text-blue-600 hover:text-blue-800">Join Class</button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'timetable':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Timetable</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              {/* Weekly calendar grid */}
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="bg-gray-50 p-4 text-center font-medium">
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'homework':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Homework</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((homework) => (
                <div key={homework} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-2">Assignment {homework}</h3>
                  <p className="text-gray-600 mb-4">Due: In 3 days</p>
                  <button className="text-blue-600 hover:text-blue-800">Submit</button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Messages</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="divide-y">
                {[1, 2, 3].map((message) => (
                  <div key={message} className="p-4 hover:bg-gray-50">
                    <h3 className="font-medium">Instructor {message}</h3>
                    <p className="text-gray-600">Message preview...</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'assessments':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Assessments</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((assessment) => (
                <div key={assessment} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-2">Quiz {assessment}</h3>
                  <p className="text-gray-600 mb-4">Duration: 30 minutes</p>
                  <button className="text-blue-600 hover:text-blue-800">Start Quiz</button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Support</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-4">Contact our support team for assistance.</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Contact Support
              </button>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notifications</label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                      <span className="ml-2">Email notifications</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Theme</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>Light</option>
                    <option>Dark</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                activeSection === item.id
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
              {item.notifications && (
                <span className="ml-auto bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.notifications}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-4 py-6">
          {supportItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg mb-2 ${
                activeSection === item.id
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;