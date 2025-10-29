'use client';

import { useState, useEffect } from 'react';
import { Trash2, Mail, Phone, User, MessageSquare } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submittedAt: string;
  read: boolean;
  replied: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      });
      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const response = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-blue-600 mt-1">{unreadCount} unread message{unreadCount > 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${selectedMessage ? 'lg:col-span-1' : ''}`}>
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.read) {
                        handleMarkRead(message.id);
                      }
                    }}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !message.read ? 'bg-blue-50' : ''
                    } ${selectedMessage?.id === message.id ? 'bg-blue-100' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{message.subject}</h3>
                          {!message.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{message.name} - {message.email}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(message.submittedAt).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                        className="text-red-600 hover:text-red-900 ml-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedMessage && (
          <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 font-medium">{selectedMessage.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              {selectedMessage.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline">
                    {selectedMessage.phone}
                  </a>
                </div>
              )}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <Mail className="h-4 w-4" />
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

