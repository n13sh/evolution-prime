'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, User, Loader2, Minus, Maximize2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useSFX } from '@/lib/hooks/useSFX';

interface Message {
  id: number;
  sender_id: number;
  content: string;
  created_at: number;
}

interface Partner {
  id: number;
  display_name: string;
  role: string;
}

export function FloatingChat({ 
  currentUserId, 
  partners, 
  planType = 'moderate' 
}: { 
  currentUserId: number, 
  partners: Partner[], 
  planType?: 'free' | 'moderate' | 'pro' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(partners[0] || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const { playSFX } = useSFX();
  const router = useRouter();
  const isFree = planType === 'free';

  useEffect(() => {
    if (isOpen && selectedPartner) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, selectedPartner]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedPartner) return;
    try {
      const res = await fetch(`/api/messages?partnerId=${selectedPartner.id}`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedPartner || sending) return;

    setSending(true);
    playSFX('click', 0.05);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: selectedPartner.id, content: input }),
      });

      if (res.ok) {
        setInput('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  const toggleOpen = () => {
    if (isFree) {
      playSFX('alert');
      router.push('/plans');
      return;
    }
    setIsOpen(!isOpen);
    setMinimized(false);
    playSFX(isOpen ? 'hover' : 'transition');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && !isFree && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: minimized ? '60px' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[360px] max-w-[calc(100vw-48px)] flex flex-col"
          >
            <GlassCard className="h-full flex flex-col border-gold/10 overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="p-4 bg-white/3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
                    <User className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight text-white">{selectedPartner?.display_name || 'Chat'}</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gold/60">{selectedPartner?.role || 'Support'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setMinimized(!minimized)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    {minimized ? <Maximize2 className="w-3.5 h-3.5 text-[--text-muted]" /> : <Minus className="w-3.5 h-3.5 text-[--text-muted]" />}
                  </button>
                  <button onClick={toggleOpen} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <X className="w-3.5 h-3.5 text-[--text-muted]" />
                  </button>
                </div>
              </div>

              {!minimized && (
                <>
                  {/* Messages Area */}
                  <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-black/10">
                    {messages.length === 0 && !loading && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
                         <MessageSquare className="w-10 h-10 mb-4" />
                         <p className="text-[10px] font-black uppercase tracking-widest">No signals yet. Initiate transmission.</p>
                      </div>
                    )}
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${m.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                            m.sender_id === currentUserId
                              ? 'bg-gold text-black rounded-tr-none'
                              : 'glass border-white/5 text-white rounded-tl-none'
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <form onSubmit={handleSend} className="p-4 bg-white/3 border-t border-white/5">
                    <div className="relative">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your signal..."
                        className="w-full h-11 bg-white/5 border border-white/5 rounded-xl pl-4 pr-12 text-xs text-white focus:border-gold/30 outline-none transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="absolute right-1 top-1 bottom-1 px-3 bg-gold text-black rounded-lg hover:bg-white hover:text-black transition-all disabled:opacity-50"
                      >
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 overflow-hidden relative group ${
          isOpen ? 'bg-crimson rotate-90' : 'bg-gold shadow-gold/20'
        }`}
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageSquare className="w-6 h-6 text-black" fill="currentColor" />
        )}
      </button>
    </div>
  );
}
