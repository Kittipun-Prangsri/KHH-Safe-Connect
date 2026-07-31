'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PhoneCall, Plus, Filter, CheckCircle2, Clock, AlertTriangle, User, Calendar, Check, X } from 'lucide-react';

interface FollowUpTask {
  id: string;
  hn: string;
  patientName: string;
  phone: string;
  taskType: 'โทรยืนยันนัด' | 'ติดตามขาดนัด' | 'ติดตามการใช้ยา' | 'ติดตามอาการ';
  assignedTo: string;
  dueDate: string;
  priority: 'urgent' | 'high' | 'normal';
  status: 'todo' | 'in_progress' | 'completed';
}

export default function FollowUpsPage() {
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [tasks, setTasks] = useState<FollowUpTask[]>([
    { id: '1', hn: 'HN-85401', patientName: 'นายเกรียงไกร ลุยรบ', phone: '086-555-4321', taskType: 'ติดตามขาดนัด', assignedTo: 'กิตติพงษ์ (พยาบาล)', dueDate: 'วันนี้ 12:00', priority: 'urgent', status: 'todo' },
    { id: '2', hn: 'HN-98302', patientName: 'นายสมชาย ดีเลิศ', phone: '081-234-5678', taskType: 'โทรยืนยันนัด', assignedTo: 'กิตติพงษ์ (พยาบาล)', dueDate: 'วันนี้ 15:30', priority: 'high', status: 'in_progress' },
    { id: '3', hn: 'HN-12493', patientName: 'นางสาววิมล ศรีใส', phone: '089-876-5432', taskType: 'ติดตามการใช้ยา', assignedTo: 'ภก. สมศักดิ์ (เภสัชกร)', dueDate: 'พรุ่งนี้ 10:00', priority: 'normal', status: 'todo' },
    { id: '4', hn: 'HN-44102', patientName: 'นางปราณี มั่นคง', phone: '092-333-1122', taskType: 'ติดตามอาการ', assignedTo: 'พญ. วรรณภา (แพทย์)', dueDate: '02 ส.ค. 2026', priority: 'normal', status: 'completed' },
  ]);

  const [showLogModal, setShowLogModal] = useState<FollowUpTask | null>(null);

  const filteredTasks = tasks.filter((t) => selectedPriority === 'all' || t.priority === selectedPriority);

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <PhoneCall className="w-7 h-7 text-teal-600" />
              <span>งานติดตามผู้ป่วย (Follow-up Tasks)</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">ติดตามผู้ป่วยขาดนัด โทรยืนยันนัดหมาย และบันทึกผลการติดต่อสื่อสาร</p>
          </div>
          <button
            onClick={() => alert('สร้างงานติดตามใหม่')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างงานติดตาม</span>
          </button>
        </div>

        {/* Priority Filters */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> ความด่วน:
            </span>
            {[
              { code: 'all', label: 'ทั้งหมด' },
              { code: 'urgent', label: 'ด่วนที่สุด' },
              { code: 'high', label: 'ด่วน' },
              { code: 'normal', label: 'ปกติ' },
            ].map((p) => (
              <button
                key={p.code}
                onClick={() => setSelectedPriority(p.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedPriority === p.code
                    ? 'bg-teal-600 text-white shadow-sm font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover-grow">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-teal-600 font-mono font-bold">{task.hn}</span>
                  <h3 className="font-bold text-slate-800 text-base">{task.patientName}</h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    task.priority === 'urgent' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    task.priority === 'high' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}
                >
                  {task.priority === 'urgent' ? 'ด่วนที่สุด' : task.priority === 'high' ? 'ด่วน' : 'ปกติ'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ประเภทงาน:</span>
                  <span className="font-semibold text-slate-800">{task.taskType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ผู้รับผิดชอบ:</span>
                  <span className="text-slate-700">{task.assignedTo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">กำหนดติดตาม:</span>
                  <span className="text-amber-700 font-semibold">{task.dueDate}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <a
                  href={`tel:${task.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-xs font-semibold hover:bg-teal-600 hover:text-white transition-all border border-teal-200"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{task.phone}</span>
                </a>
                <button
                  onClick={() => setShowLogModal(task)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  บันทึกผล
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Log Contact Result Modal */}
        {showLogModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-teal-600" />
                  <span>บันทึกผลการติดตาม ({showLogModal.patientName})</span>
                </h3>
                <button onClick={() => setShowLogModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTasks(tasks.map(t => t.id === showLogModal.id ? { ...t, status: 'completed' } : t));
                  setShowLogModal(null);
                  alert('บันทึกผลการติดตามเรียบร้อย!');
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ผลการติดต่อ</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800">
                    <option value="confirmed">ผู้ป่วยรับสาย และยืนยันวันนัด</option>
                    <option value="caregiver">ญาติรับสาย และรับเรื่องไว้แล้ว</option>
                    <option value="no_answer">สายไม่ว่าง / ไม่รับสาย</option>
                    <option value="reschedule">ผู้ป่วยขอเลื่อนวันนัด</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">สรุปการสนทนา & คำแนะนำที่ให้</label>
                  <textarea rows={3} placeholder="ระบุรายละเอียดผลการโทรพูดคุย..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800" />
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowLogModal(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl">ยกเลิก</button>
                  <button type="submit" className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl shadow-md hover:bg-teal-700">บันทึกผลติดตาม</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
