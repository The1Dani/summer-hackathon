// src/components/Student/Chat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, X, Users, MessageCircle } from 'lucide-react';
import { parseEmailName } from '../../utils/parseEmailName';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file';
}

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  chatTitle: string;
  participants: string[];   // emails
  userRole: 'student' | 'mentor';
}

export default function Chat({
  isOpen,
  onClose,
  chatTitle,
  participants,
  userRole
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Seed initial messages on open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const seeded: Message[] = [];
      if (participants[0]) {
        seeded.push({
          id: '1',
          sender: parseEmailName(participants[0]),
          content: 'Hey everyone! How are we doing with the project?',
          timestamp: new Date(Date.now() - 3600000),
          type: 'text'
        });
      }
      if (participants[1]) {
        seeded.push({
          id: '2',
          sender: parseEmailName(participants[1]),
          content: 'I just wrapped up my tasks—will push my branch shortly.',
          timestamp: new Date(Date.now() - 1800000),
          type: 'text'
        });
      }
      seeded.push({
        id: '3',
        sender: 'You',
        content: 'Great work! Let me know when it’s live.',
        timestamp: new Date(Date.now() - 900000),
        type: 'text'
      });
      setMessages(seeded);
    }
  }, [isOpen, participants, messages.length]);

  // Auto-scroll
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  // Send new
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <MessageCircle className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{chatTitle}</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                {participants.length} participants
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Participants */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {participants.map((email, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {parseEmailName(email)}
              </span>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, idx) => {
            const showDate =
              idx === 0 ||
              formatDate(message.timestamp) !==
                formatDate(messages[idx - 1].timestamp);
            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex justify-center mb-4">
                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}
                <div
                  className={`flex ${
                    message.sender === 'You'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md ${
                      message.sender === 'You'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    } rounded-lg px-4 py-2`}
                  >
                    {message.sender !== 'You' && (
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        {message.sender}
                      </p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'You'
                          ? 'text-primary-200'
                          : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-2"
          >
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Smile className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
