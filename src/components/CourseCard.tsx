import React, { useState } from 'react';
import StripeWrapper from './StripeWrapper';

interface CourseResources {
  videos: number;
  articles: number;
  downloads: number;
}

interface CourseProps {
  course: {
    id: number;
    title: string;
    description: string;
    duration: string;
    instructor: string;
    price: number;
    originalPrice: number;
    discount: string;
    image: string;
    students: number;
    rating: number;
    resources: CourseResources;
  };
}

const CourseCard: React.FC<CourseProps> = ({ course }) => {
  const [showPayment, setShowPayment] = useState(false);

  const handleEnrollClick = () => {
    console.log('Enroll button clicked for course:', course.title);
    console.log('Current showPayment state:', showPayment);
    setShowPayment(true);
    console.log('New showPayment state:', true);
  };

  // Add effect to monitor showPayment changes
  React.useEffect(() => {
    console.log('showPayment changed to:', showPayment);
  }, [showPayment]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Course Image */}
        <div className="relative h-48">
          <img 
            src={course.image} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-purple-500 text-white px-2 py-1 rounded">
            {course.discount}
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{course.title}</h3>
          <p className="text-gray-600 mb-4">{course.description}</p>

          {/* Course Details */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">⏱</span>
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span>{course.rating}</span>
              <span className="text-gray-500 ml-1">({course.students} students)</span>
            </div>
          </div>

          {/* Course Resources */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600">
              <span className="mr-2">📹</span>
              <span>{course.resources.videos} hours on-demand video</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="mr-2">📄</span>
              <span>{course.resources.articles} articles</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="mr-2">💾</span>
              <span>{course.resources.downloads} downloadable resources</span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold">${course.price}</span>
              <span className="text-gray-500 line-through ml-2">${course.originalPrice}</span>
            </div>
            <button
              type="button"
              onClick={handleEnrollClick}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 cursor-pointer z-10 relative"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      {showPayment && (
        <StripeWrapper
          course={{
            id: course.id.toString(),
            title: course.title,
            description: course.description,
            image: course.image,
            price: course.price
          }}
          onClose={() => {
            console.log('Closing payment modal');
            setShowPayment(false);
          }}
          onSuccess={() => {
            console.log('Payment successful for course:', course.title);
            setShowPayment(false);
          }}
        />
      )}
    </>
  );
};

export default CourseCard; 