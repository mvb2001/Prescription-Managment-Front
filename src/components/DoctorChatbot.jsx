import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../services/api';

const DoctorChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello Doctor. Ask me about patient care, medicine guidance, or prescription support.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    setError('');
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setIsSending(true);

    try {
      const response = await chatAPI.sendMessage(text);
      const reply = typeof response.data === 'string' ? response.data : 'No response from assistant.';
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      console.error('Chat request failed:', err);
      setError('Unable to reach chatbot right now. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-blue-100 rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white">Doctor AI Assistant</h3>
        <p className="text-cyan-100 text-sm mt-1">Secure chat linked to your doctor account</p>
      </div>

      <div className="h-[460px] overflow-y-auto p-5 bg-slate-50 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={`${msg.role}-${index}`}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-br-md'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-600 border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 text-sm shadow-sm">
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        {error && (
          <p className="text-sm text-red-600 mb-3">{error}</p>
        )}

        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your medical question..."
            rows={2}
            className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorChatbot;
