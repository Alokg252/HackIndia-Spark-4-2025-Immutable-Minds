import { useState } from 'react';

interface Course {
  id: number;
  title: string;
  category: string;
  instructor: string;
  rating: number;
  studentsCount: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  originalPrice: number;
  illustration: JSX.Element;
  backgroundColor: string;
  tags: string[];
  lastUpdated: string;
}

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const totalPages = 8;

  const categories = [
    'All Categories',
    'Computer Science',
    'Business',
    'Design',
    'Marketing',
    'Personal Development',
    'Mathematics',
    'Language Learning'
  ];

  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  const tabs = [
    { id: 'all', label: 'All Courses', count: 180 },
    { id: 'trending', label: 'Trending', count: 24 },
    { id: 'newest', label: 'New & Notable', count: 36 },
    { id: 'bestsellers', label: 'Bestsellers', count: 42 }
  ];

  const courses: Course[] = [
    {
      id: 1,
      title: 'Advanced Machine Learning & Data Science',
      category: 'Computer Science',
      instructor: 'Dr. Sarah Chen',
      rating: 4.8,
      studentsCount: 12420,
      duration: '32h 15m',
      level: 'Advanced',
      price: 89.99,
      originalPrice: 199.99,
      tags: ['Python', 'AI', 'Data Science', 'Neural Networks'],
      lastUpdated: 'March 2024',
      backgroundColor: '#F3F0FF',
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <g transform="translate(40, 40)">
            <rect width="100" height="80" fill="none" stroke="#6B46C1" strokeWidth="2" rx="4"/>
            <path d="M20 40 L40 20 L60 40 L80 10" stroke="#6B46C1" strokeWidth="2" fill="none"/>
            <circle cx="40" cy="20" r="4" fill="#6B46C1"/>
            <circle cx="60" cy="40" r="4" fill="#6B46C1"/>
          </g>
        </svg>
      )
    },
    {
      id: 2,
      title: 'UI/UX Design Mastery: From Beginner to Professional',
      category: 'Design',
      instructor: 'Alex Morgan',
      rating: 4.9,
      studentsCount: 8340,
      duration: '41h 30m',
      level: 'Beginner',
      price: 94.99,
      originalPrice: 189.99,
      tags: ['Figma', 'Adobe XD', 'Design Systems', 'Prototyping'],
      lastUpdated: 'March 2024',
      backgroundColor: '#FFEDD5',
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <g transform="translate(40, 40)">
            <rect width="90" height="60" fill="none" stroke="#EA580C" strokeWidth="2" rx="8"/>
            <circle cx="45" cy="30" r="15" fill="#EA580C"/>
            <rect x="70" y="20" width="10" height="20" fill="#EA580C" rx="2"/>
          </g>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Financial Markets & Investment Strategies',
      category: 'Business',
      instructor: 'Prof. Michael Roberts',
      rating: 4.7,
      studentsCount: 6280,
      duration: '28h 45m',
      level: 'Intermediate',
      price: 79.99,
      originalPrice: 159.99,
      tags: ['Finance', 'Investment', 'Stock Market', 'Analysis'],
      lastUpdated: 'February 2024',
      backgroundColor: '#F0FDF4',
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <g transform="translate(40, 40)">
            <path d="M10 80 L30 40 L50 60 L70 20 L90 40" stroke="#16A34A" strokeWidth="2" fill="none"/>
            <circle cx="30" cy="40" r="4" fill="#16A34A"/>
            <circle cx="50" cy="60" r="4" fill="#16A34A"/>
            <circle cx="70" cy="20" r="4" fill="#16A34A"/>
          </g>
        </svg>
      )
    },
    {
      id: 4,
      title: 'Digital Marketing & Social Media Strategy',
      category: 'Marketing',
      instructor: 'Emma Thompson',
      rating: 4.9,
      studentsCount: 15680,
      duration: '36h 20m',
      level: 'Intermediate',
      price: 84.99,
      originalPrice: 169.99,
      tags: ['Social Media', 'SEO', 'Content Marketing', 'Analytics'],
      lastUpdated: 'March 2024',
      backgroundColor: '#EFF6FF',
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <g transform="translate(40, 40)">
            <circle cx="50" cy="50" r="30" fill="none" stroke="#2563EB" strokeWidth="2"/>
            <path d="M35 50 L65 50 M50 35 L50 65" stroke="#2563EB" strokeWidth="2"/>
          </g>
        </svg>
      )
    },
    {
      id: 5,
      title: 'Full Stack Web Development Bootcamp',
      category: 'Computer Science',
      instructor: 'David Miller',
      rating: 4.8,
      studentsCount: 9840,
      duration: '48h 30m',
      level: 'Intermediate',
      price: 99.99,
      originalPrice: 199.99,
      tags: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      lastUpdated: 'March 2024',
      backgroundColor: '#FDF2F8',
      illustration: (
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <g transform="translate(40, 40)">
            <rect width="80" height="60" fill="none" stroke="#DB2777" strokeWidth="2" rx="4"/>
            <path d="M20 30 L60 30 M20 40 L40 40" stroke="#DB2777" strokeWidth="2"/>
          </g>
        </svg>
      )
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>
            <p className="text-gray-600 max-w-2xl">
              Choose from over 180 online courses with new additions published every month. Find the right course for your career.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[300px] px-4 py-2 border border-gray-200 rounded-lg pl-10"
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="none">
                <path d="M8 16C11.866 16 15 12.866 15 9C15 5.13401 11.866 2 8 2C4.13401 2 1 5.13401 1 9C1 12.866 4.13401 16 8 16Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M13 13L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-6 mb-8">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category === 'All Categories' ? 'all' : category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
          >
            {levels.map(level => (
              <option key={level} value={level === 'All Levels' ? 'all' : level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#FF4D4D] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div 
                className="aspect-video p-8 relative" 
                style={{ backgroundColor: course.backgroundColor }}
              >
                <div className="absolute top-4 right-4 flex gap-2">
                  {course.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-white bg-opacity-90 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="w-full h-full">
                  {course.illustration}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.level}
                  </span>
                  <span className="text-sm text-gray-600">{course.duration}</span>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-600">by</span>
                  <span className="text-sm font-medium">{course.instructor}</span>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="font-medium">{course.rating}</span>
                    <span className="text-gray-600">({course.studentsCount.toLocaleString()})</span>
                  </div>
                  <span className="text-sm text-gray-600">Updated {course.lastUpdated}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">${course.price}</span>
                    <span className="text-sm text-gray-600 line-through ml-2">${course.originalPrice}</span>
                  </div>
                  <button className="px-4 py-2 bg-[#FF4D4D] text-white rounded-lg font-medium hover:bg-[#ff3333] transition-colors">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-12">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * 9 + 1}-{Math.min(currentPage * 9, tabs.find(t => t.id === activeTab)?.count || 0)} of {tabs.find(t => t.id === activeTab)?.count || 0} courses
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 16L6 10L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                  currentPage === i + 1
                    ? 'bg-[#FF4D4D] text-white'
                    : 'border border-gray-200 hover:border-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage; 