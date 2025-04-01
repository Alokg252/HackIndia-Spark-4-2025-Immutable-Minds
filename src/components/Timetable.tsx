import React, { useState } from 'react';

interface TimeSlot {
  id: number;
  title: string;
  instructor: string;
  time: string;
  day: string;
  subject: string;
  subjectColor: string;
}

const Timetable: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
  
  const [selectedDay, setSelectedDay] = useState(days[0]);

  const schedule: TimeSlot[] = [
    {
      id: 1,
      title: 'Introduction to Blockchain',
      instructor: 'Dr. Smith',
      time: '9:00 AM',
      day: 'Mon',
      subject: 'Blockchain',
      subjectColor: 'blue'
    },
    {
      id: 2,
      title: 'Smart Contract Development',
      instructor: 'Prof. Johnson',
      time: '2:00 PM',
      day: 'Mon',
      subject: 'Development',
      subjectColor: 'green'
    },
    {
      id: 3,
      title: 'Web3 Integration',
      instructor: 'Ms. Davis',
      time: '10:00 AM',
      day: 'Tue',
      subject: 'Web3',
      subjectColor: 'purple'
    }
  ];

  const getClassForTimeSlot = (day: string, time: string) => {
    const slot = schedule.find(s => s.day === day && s.time === time);
    return slot ? `bg-${slot.subjectColor}-100 text-${slot.subjectColor}-800 border-${slot.subjectColor}-200` : 'bg-white';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Timetable</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Days header */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`p-4 text-center font-medium ${
                selectedDay === day 
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Time slots */}
        <div className="divide-y">
          {timeSlots.map((time) => {
            const slot = schedule.find(s => s.day === selectedDay && s.time === time);
            return (
              <div key={time} className="grid grid-cols-[100px_1fr] gap-4 p-4">
                <div className="text-sm text-gray-600">{time}</div>
                {slot ? (
                  <div className={`p-3 rounded-lg ${getClassForTimeSlot(selectedDay, time)}`}>
                    <h3 className="font-medium">{slot.title}</h3>
                    <p className="text-sm mt-1">Instructor: {slot.instructor}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 bg-${slot.subjectColor}-100 text-${slot.subjectColor}-800`}>
                      {slot.subject}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg border border-dashed border-gray-200 text-gray-400">
                    No class scheduled
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timetable; 