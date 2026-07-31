'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { MessageSquare, Send, Paperclip, CheckCheck, User, Clock, Search, Filter, AlertCircle, HeartHandshake } from 'lucide-react';

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
  subject: string;
  category: string;
  priority: 'urgent' | 'high' | 'normal';
  unreadCount: number;
  lastMessageTime: string;
  messages: ChatMessage[];
}

export default function ReplyPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'c1',
      patientName: 'นายสมชาย ดีเลิศ',
      hn: 'HN-98302',
      subject: 'สอบถามเรื่องขอเลื่อนวันนัดคลินิกเบาหวาน',
      category: 'ขอเลื่อนนัด',
      priority: 'high',
      unreadCount: 2,
      lastMessageTime: '10:15 น.',
      messages: [
        { id: 'm1', sender: 'patient', senderName: 'นายสมชาย', text: 'สวัสดีครับ พอดีวันที่ 5 สิงหาคม ผมติดธุระต่างจังหวัด ขอเลื่อนเป็นสัปดาห์ถัดไปได้ไหมครับ', time: '10:10 น.' },
        { id: 'm2', sender: 'patient', senderName: 'นายสมชาย', text: 'มียาเบาหวานเหลือพอทานอีกประมาณ 7 วันครับ', time: '10:15 น.' },
      ],
    },
    {
      id: 'c2',
      patientName: 'นางสาววิมล ศรีใส',
      hn: 'HN-12493',
      subject: 'สอบถามวิธีรับประทานยาความดันตัวใหม่',
      category: 'สอบถามการใช้ยา',
      priority: 'normal',
      unreadCount: 1,
      lastMessageTime: '09:30 น.',
      messages: [
        { id: 'm3', sender: 'patient', senderName: 'นางสาววิมล', text: 'สอบถามค่ะ ยาความดันตัวที่ได้มาใหม่ ต้องทานหลังอาหารทันทีเลยใช่ไหมคะ?', time: '09:30 น.' },
      ],
    },
  ]);

  const [activeChat, setActiveChat] = useState<Conversation>(conversations[0]);
  const [inputText, setInputText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'staff',
      senderName: 'กิตติพงษ์ (พยาบาล)',
      text: inputText,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      isInternal: isInternalNote,
    };

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
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-100px)] space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-teal-600" />
              <span>กล่องข้อความ Reply (Real-time Messaging)</span>
            </h1>
            <p className="text-slate-500 text-xs">สื่อสารกับผู้ป่วย สับเปลี่ยนผู้รับผิดชอบ และตอบกลับคำถาม</p>
          </div>
        </div>

        {/* Chat Interface Container */}
        <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm">
          {/* Left Sidebar: Conversations List */}
          <div className="md:w-80 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-3 border-b border-slate-200">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาข้อความ หรือ HN..."
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {conversations.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`p-4 cursor-pointer transition-all hover:bg-slate-100/60 ${
                    activeChat.id === chat.id ? 'bg-teal-50/80 border-l-4 border-teal-600' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 text-xs">{chat.patientName}</span>
                    <span className="text-[10px] text-slate-400">{chat.lastMessageTime}</span>
                  </div>
                  <div className="text-[10px] text-teal-600 font-mono mb-1">{chat.hn} &bull; {chat.category}</div>
                  <p className="text-xs text-slate-600 truncate">{chat.subject}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Area: Active Chat Window */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Active Chat Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span>{activeChat.patientName}</span>
                  <span className="text-xs font-mono text-teal-600">({activeChat.hn})</span>
                </h3>
                <p className="text-xs text-slate-500">{activeChat.subject}</p>
              </div>
              <button
                onClick={() => alert('ปิดเรื่องข้อความนี้แล้ว')}
                className="px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer border border-teal-200"
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
                  <span className="text-[10px] text-slate-400 mb-1">{msg.senderName} ({msg.time})</span>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.isInternal
                        ? 'bg-amber-50 text-amber-800 border border-amber-200 rounded-br-none'
                        : msg.sender === 'staff'
                        ? 'bg-teal-600 text-white rounded-br-none shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.isInternal && <span className="block text-[9px] font-bold uppercase text-amber-700 mb-1">[บันทึกภายในเจ้าหน้าที่]</span>}
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
                  'ยินดีให้ข้อมูลค่ะ',
                  'รับทราบการขอเลื่อนนัด เดี๋ยวเจ้าหน้าที่ปรับวันนัดให้นะคะ',
                  'รับประทานยาตามที่แพทย์สั่งหลังอาหารได้เลยค่ะ',
                ].map((tpl, i) => (
                  <button
                    key={i}
                    onClick={() => setInputText(tpl)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 whitespace-nowrap cursor-pointer"
                  >
                    {tpl}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer whitespace-nowrap bg-slate-50 px-2.5 py-2 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="rounded bg-white border-slate-300 text-teal-600"
                  />
                  <span>บันทึกภายใน</span>
                </label>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="พิมพ์ข้อความตอบกลับผู้ป่วย..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />

                <button
                  type="submit"
                  className="p-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
