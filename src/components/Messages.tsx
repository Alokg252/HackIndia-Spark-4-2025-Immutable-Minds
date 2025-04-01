import React, { useState } from 'react';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  unread: boolean;
}

const Messages: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const messages: Message[] = [
    {
      id: 1,
      sender: 'Dr. Smith',
      content: 'Hello! Just wanted to remind you about the upcoming blockchain fundamentals assignment. Let me know if you have any questions.',
      timestamp: '2024-03-15T10:30:00',
      unread: true
    },
    {
      id: 2,
      sender: 'Prof. Johnson',
      content: "Great work on your smart contract implementation! I've reviewed your code and left some comments for improvement.",
      timestamp: '2024-03-14T15:45:00',
      unread: false
    },
    {
      id: 3,
      sender: 'Ms. Davis',
      content: 'The Web3 integration project deadline has been extended by 48 hours. Please make sure to submit your work by then.',
      timestamp: '2024-03-14T09:15:00',
      unread: true
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Messages</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex">
        {/* Message List */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="divide-y">
            {messages.map((message) => (
              <button
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`w-full p-4 text-left hover:bg-gray-50 ${
                  selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                } ${message.unread ? 'font-semibold' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium">{message.sender}</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {message.content}
                </p>
                {message.unread && (
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">{selectedMessage.sender}</h3>
                <span className="text-sm text-gray-500">
                  {formatDate(selectedMessage.timestamp)}
                </span>
              </div>
              <div className="p-4 flex-1">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {selectedMessage.content}
                </p>
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type your reply..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a message to view its contents
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages; 