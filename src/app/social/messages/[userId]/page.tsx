'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSocialStore } from '@/store/useSocialStore';
import { useParams } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hey! How\'s your strength training going?',
    timestamp: '10:30 AM',
    isSent: false,
  },
  {
    id: '2',
    text: 'Going great! Just finished my morning session. You?',
    timestamp: '10:32 AM',
    isSent: true,
  },
  {
    id: '3',
    text: 'Nice! I\'m on day 5 of the 7-day sprint. Want to do a 1v1 challenge?',
    timestamp: '10:35 AM',
    isSent: false,
  },
  {
    id: '4',
    text: 'Absolutely! That would be awesome. When do you want to start?',
    timestamp: '10:37 AM',
    isSent: true,
  },
  {
    id: '5',
    text: 'How about this weekend? We could do a strength & endurance combo.',
    timestamp: '10:40 AM',
    isSent: false,
  },
];

export default function ChatPage() {
  const params = useParams();
  const userId = params?.userId as string;

  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: String(messages.length + 1),
        text: inputText,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isSent: true,
      };
      setMessages([...messages, newMessage]);
      setInputText('');

      // Simulate a reply
      setTimeout(() => {
        const replies = [
          'That sounds perfect!',
          'I\'m in! Let\'s do it.',
          'Great idea!',
          'Count me in!',
          'Sounds good to me.',
        ];
        const randomReply =
          replies[Math.floor(Math.random() * replies.length)];
        const reply: Message = {
          id: String(messages.length + 2),
          text: randomReply,
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isSent: false,
        };
        setMessages((prev) => [...prev, reply]);
      }, 1000);
    }
  };

  // Get user info from userId (in a real app, this would come from the store or API)
  const userInfo = {
    userId: userId || 'user1',
    username: 'AlexJ',
    avatar: 'ð¨',
  };

  return (
    <div className="h-screen flex flex-col bg-bg-primary text-text-primary">
      {/* Header */}
      <div className="border-b border-border-subtle bg-bg-secondary/50 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/social/messages"
            className="text-text-secondary hover:text-text-primary transition"
          >
            â Back
          </Link>
          <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-lg">
            {userInfo.avatar}
          </div>
          <div>
            <h1 className="text-xl font-bold">{userInfo.username}</h1>
            <p className="text-xs text-text-muted">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.isSent
                  ? 'bg-accent-gold text-black rounded-br-none'
                  : 'bg-bg-tertiary text-text-primary border border-border-subtle rounded-bl-none'
              }`}
            >
              <p className="break-words">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.isSent ? 'text-black/60' : 'text-text-muted'
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border-subtle bg-bg-secondary/50 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-lg bg-bg-primary border border-border-subtle text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-gold transition"
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-accent-gold text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
