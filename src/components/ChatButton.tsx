import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';

// Import API key from environment using import.meta.env
const GEMINI_API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY || '';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Initialize Gemini using the API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your cybersecurity learning assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !GEMINI_API_KEY) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Use model gemini-2.0-flash (available via API v1beta)
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      // Custom prompt to guide the model
      const prompt = `You are an expert cybersecurity assistant on CyberTech, a learning platform for cybersecurity courses. You provide very brief, accurate, and summarized answers on topics related to cybersecurity learning, including relevant programming and computer science aspects when they relate to cybersecurity. If the user's question is not directly related to cybersecurity learning, respond with: "I only answer questions related to cybersecurity learning." Always keep your responses concise and focused.
Previous conversation:
${messages
  .map((msg) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
  .join('\n')}

User: ${inputValue}

Assistant:`;

      // Use generateContent method to get the response
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: text || "Sorry, I couldn't understand your question.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, an error occurred while processing your request. Please try again.',
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-red-500 rotate-45' : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 left-6 z-40 w-80 md:w-96 bg-white rounded-lg shadow-xl transition-all duration-300 transform ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Chat Header */}
        <div className="bg-primary-600 text-white p-4 rounded-t-lg">
          <h3 className="font-bold">Cybersecurity Assistant</h3>
          <p className="text-sm text-primary-100">Ask any question about cybersecurity learning</p>
        </div>

        {/* Chat Messages */}
        <div className="h-80 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${message.sender === 'user' ? 'text-left' : 'text-right'}`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-bl-none'
                    : 'bg-gray-200 text-gray-800 rounded-br-none'
                }`}
              >
                {/* Render message text using ReactMarkdown */}
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
              <div
                className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-left' : 'text-right'}`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-right mb-4">
              <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-800 rounded-br-none">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Field */}
        <form onSubmit={handleSubmit} className="p-3 border-t">
          <div className="flex">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 p-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading || !GEMINI_API_KEY}
            />
            <button
              type="submit"
              className="bg-primary-600 text-white p-2 rounded-l-lg hover:bg-primary-700 transition disabled:bg-primary-400"
              disabled={isLoading || !inputValue.trim() || !GEMINI_API_KEY}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
          {!GEMINI_API_KEY && (
            <p className="text-red-500 text-xs mt-2">
              Please add your API key in the environment file (.env)
            </p>
          )}
        </form>
      </div>
    </>
  );
}
