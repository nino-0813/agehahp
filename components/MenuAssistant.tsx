import React, { useState } from 'react';
import { askMenuAssistant } from '../services/geminiService';
import { X, MessageCircle, Send } from 'lucide-react';

const MenuAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: 'こんにちは。奏樹コンシェルジュです。メニューやアクセスについてお気軽にお尋ねください。' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await askMenuAssistant(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'エラーが発生しました。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-100 animate-fade-in-up">
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <h3 className="font-bold">奏樹 AI Concierge</h3>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-70 transition-opacity">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg text-sm max-w-[85%] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white self-end rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 self-start rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="self-start bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="質問を入力..."
              className="flex-1 bg-gray-100 text-sm px-3 py-2 rounded-md outline-none focus:ring-1 focus:ring-primary"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-primary text-white p-2 rounded-md disabled:opacity-50 hover:bg-primary/90"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MenuAssistant;