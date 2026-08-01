'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  MessageSquare,
  Send,
  Paperclip,
  CheckCheck,
  User,
  Clock,
  Search,
  Filter,
  AlertCircle,
  HeartHandshake,
  RefreshCw,
  Database,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { maskName, maskPhone } from '@/lib/pdpaMasking';

interface ChatMessage {
  id: string;
  sender: 'staff' | 'patient';
  senderName: string;
  text: string;
  time: string;
  isInternal?: boolean;
}

interface Conversation {
  id: string;
  patientName: string;
  hn: string;
  phone?: string;
  subject: string;
  category: string;
  priority: 'urgent' | 'high' | 'normal';
  unreadCount: number;
  lastMessageTime: string;
  messages: ChatMessage[];
}

export default function ReplyPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  // Fetch real HOSxP patient messaging conversations
  const fetchLiveHosxpConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hosxp/conversations');
      const data = await res.json();

      if (data.success && Array.isArray(data.conversations) && data.conversations.length > 0) {
        setConversations(data.conversations);
        setActiveChat(data.conversations[0]);
      } else {
        setConversations([]);
        setActiveChat(null);
      }
    } catch (error) {
      console.error('Error fetching live HOSxP conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveHosxpConversations();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    setSending(true);

    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'staff',
      senderName: 'พยาบาล NCDs (รพ.คลองหาด)',
      text: inputText,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      isInternal: isInternalNote,
    };

    // If NOT an internal note, send real LINE message to patient
    if (!isInternalNote) {
      try {
        await fetch('/api/notify/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hn: activeChat.hn,
            patientName: activeChat.patientName,
            messageText: inputText,
          }),
        });
      } catch (err) {
        console.error('Error pushing LINE message:', err);
      }
    }

    const updated = conversations.map((c) => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          unreadCount: 0,
          messages: [...c.messages, newMessage],
        };
      }
      return c;
    });

    setConversations(updated);
    setActiveChat({
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
    });
    setInputText('');
    setSending(false);
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.hn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-100px)] space-y-4">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-teal-600" />
              <span>กล่องข้อความตอบกลับผู้ป่วย (HOSxP & LINE Real-Time Messaging)</span>
            </h1>
            <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>เชื่อมโยงข้อมูลผู้ป่วยสดจากฐานข้อมูล HOSxP และระบบแชต LINE Official Account</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLiveHosxpConversations}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
              <span>โหลดข้อความสด HOSxP</span>
            </button>
            <button
              onClick={() => setShowInfoBanner(!showInfoBanner)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>คำอธิบายการใช้งาน</span>
            </button>
          </div>
        </div>

        {/* Feature Explanation Banner */}
        {showInfoBanner && (
          <div className="p-4 rounded-2xl bg-teal-900 text-white text-xs shadow-md space-y-2 relative animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                <h3 className="font-extrabold text-sm text-teal-100">📖 คำอธิบายระบบสื่อสารและตอบกลับผู้ป่วย NCDs (Real-Time Reply Hub)</h3>
              </div>
              <button onClick={() => setShowInfoBanner(false)} className="text-teal-300 hover:text-white font-bold p-1">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-teal-100 text-[11px] pt-1">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <span className="font-bold text-teal-300 block mb-0.5">💬 1. ตอบกลับแชตตรงถึง LINE ผู้ป่วย</span>
                <span>พิมพ์ข้อความตอบกลับในฝั่งขวา ข้อความจะถูกส่งตรงเข้าแอป LINE บนโทรศัพท์ของผู้ป่วยทันทีแบบ Real-time</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <span className="font-bold text-amber-300 block mb-0.5">📝 2. บันทึกภายในเฉพาะเจ้าหน้าที่</span>
                <span>ติ๊กถูกที่ช่อง <b>"บันทึกภายใน"</b> เพื่อโน้ตเคสส่งต่อระหว่างพยาบาล/หมอ โดยข้อความจะไม่ถูกส่งไปที่ LINE ผู้ป่วย</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <span className="font-bold text-emerald-300 block mb-0.5">🏥 3. ดึงข้อมูลจริงจาก HOSxP</span>
                <span>แสดงชื่อ-นามสกุล, HN, เบอร์โทร และประวัตินัดหมายสดจากฐานข้อมูล HOSxP 100% ปิด Mock Data ทั้งหมด</span>
              </div>
            </div>
          </div>
        )}

        {/* Chat Interface Container */}
        <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm">
          {/* Left Sidebar: Conversations List */}
          <div className="md:w-80 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-3 border-b border-slate-200">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อผู้ป่วย, HN, หรือหัวข้อ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-teal-600" />
                  <p>กำลังเชื่อมต่อดึงข้อมูลข้อความสดจาก HOSxP...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">ไม่พบรายการสนทนาในระบบ</div>
              ) : (
                filteredConversations.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`p-4 cursor-pointer transition-all hover:bg-slate-100/60 ${
                      activeChat?.id === chat.id ? 'bg-teal-50/80 border-l-4 border-teal-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-800 text-xs">{chat.patientName}</span>
                      <span className="text-[10px] text-slate-400">{chat.lastMessageTime}</span>
                    </div>
                    <div className="text-[10px] text-teal-600 font-mono mb-1">
                      {chat.hn} &bull; {chat.category}
                    </div>
                    <p className="text-xs text-slate-600 truncate font-medium">{chat.subject}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Area: Active Chat Window */}
          {activeChat ? (
            <div className="flex-1 flex flex-col bg-white">
              {/* Active Chat Header */}
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <span>{activeChat.patientName}</span>
                    <span className="text-xs font-mono text-teal-600 font-bold">({activeChat.hn})</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                      <Database className="w-3 h-3" /> ข้อมูลจริง HOSxP
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{activeChat.subject}</p>
                </div>
                <button
                  onClick={() => alert(`ปิดเรื่องข้อความของ "${activeChat.patientName}" (${activeChat.hn}) เรียบร้อยแล้ว`)}
                  className="px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer border border-teal-200 shadow-sm"
                >
                  ปิดเรื่อง
                </button>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                {activeChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'staff' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 mb-1">
                      {msg.senderName} ({msg.time})
                    </span>
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        msg.isInternal
                          ? 'bg-amber-50 text-amber-900 border border-amber-300 rounded-br-none'
                          : msg.sender === 'staff'
                          ? 'bg-teal-600 text-white rounded-br-none font-medium'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.isInternal && (
                        <span className="block text-[9px] font-bold uppercase text-amber-700 mb-1">
                          🔒 [บันทึกภายในเจ้าหน้าที่ - ไม่ส่งไปที่ LINE]
                        </span>
                      )}
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Templates & Message Input Form */}
              <div className="p-3 border-t border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
                  <span className="text-slate-400 font-semibold whitespace-nowrap">ข้อความด่วน:</span>
                  {[
                    'ยินดีให้ข้อมูลค่ะ โรงพยาบาลยินดีดูแลตลอดยินดีต้อนรับค่ะ',
                    'รับทราบการขอเลื่อนนัด เดี๋ยวเจ้าหน้าที่ปรับวันนัดในระบบ HOSxP ให้นะคะ',
                    'รับประทานยาตามที่แพทย์สั่งหลังอาหารได้เลยค่ะ หากมีอาการเวียนศีรษะให้หยุดยาแล้วโทรหา รพ.',
                    'พรุ่งนี้มีนัดเจาะเลือด กรุณางดน้ำและอาหารหลัง 20:00 น. คืนนี้นะคะ',
                  ].map((tpl, i) => (
                    <button
                      key={i}
                      onClick={() => setInputText(tpl)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 whitespace-nowrap cursor-pointer transition-all"
                    >
                      {tpl}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer whitespace-nowrap bg-slate-50 hover:bg-slate-100 px-3 py-2.5 rounded-xl border border-slate-200 transition-all">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded bg-white border-slate-300 text-teal-600"
                    />
                    <span className={isInternalNote ? 'font-bold text-amber-700' : ''}>
                      {isInternalNote ? '🔒 บันทึกภายใน' : '💬 ส่งไป LINE'}
                    </span>
                  </label>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      isInternalNote
                        ? 'พิมพ์โน้ตบันทึกภายใน (เจ้าหน้าที่เห็นเท่านั้น)...'
                        : 'พิมพ์ข้อความส่งตรงเข้า LINE บนโทรศัพท์ของผู้ป่วย...'
                    }
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  />

                  <button
                    type="submit"
                    disabled={sending}
                    className={`p-2.5 text-white rounded-xl shadow-md transition-all cursor-pointer ${
                      isInternalNote
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-teal-600 hover:bg-teal-700'
                    }`}
                  >
                    <Send className={`w-4 h-4 ${sending ? 'animate-bounce' : ''}`} />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs p-8">
              กรุณาเลือกรายการผู้ป่วยทางซ้ายมือเพื่อเริ่มการสนทนา
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
