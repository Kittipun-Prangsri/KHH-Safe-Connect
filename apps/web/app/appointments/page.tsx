'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Calendar as CalendarIcon, Plus, Filter, CheckCircle2, Clock, XCircle, AlertCircle, Search, ChevronRight } from 'lucide-react';

interface Appointment {
  id: string;
  hn: string;
  patientName: string;
  disease: string;
  date: string;
  time: string;
  clinic: string;
  provider: string;
  status: 'scheduled' | 'confirmed' | 'rescheduled' | 'missed' | 'completed';
}

export default function AppointmentsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', hn: 'HN-98302', patientName: 'นายสมชาย ดีเลิศ', disease: 'DM, HT', date: '31 ก.ค. 2026', time: '09:00 น.', clinic: 'คลินิกเบาหวาน', provider: 'พญ. วรรณภา จิตดี', status: 'confirmed' },
    { id: '2', hn: 'HN-12493', patientName: 'นางสาววิมล ศรีใส', disease: 'CKD Stage 3', date: '31 ก.ค. 2026', time: '10:30 น.', clinic: 'คลินิกโรคไต', provider: 'นพ. ศุภชัย เลิศสุวรรณ', status: 'scheduled' },
    { id: '3', hn: 'HN-85401', patientName: 'นายเกรียงไกร ลุยรบ', disease: 'COPD', date: '30 ก.ค. 2026', time: '11:00 น.', clinic: 'คลินิกโรคปอด', provider: 'พญ. วรรณภา จิตดี', status: 'missed' },
    { id: '4', hn: 'HN-44102', patientName: 'นางปราณี มั่นคง', disease: 'DM, HT, CKD', date: '01 ส.ค. 2026', time: '09:30 น.', clinic: 'คลินิกเบาหวาน', provider: 'นพ. ศุภชัย เลิศสุวรรณ', status: 'confirmed' },
    { id: '5', hn: 'HN-67812', patientName: 'นายอนันต์ แสงทอง', disease: 'ASTHMA', date: '02 ส.ค. 2026', time: '13:00 น.', clinic: 'คลินิกโรคหืด', provider: 'พญ. วรรณภา จิตดี', status: 'rescheduled' },
  ]);

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch = app.patientName.includes(searchTerm) || app.hn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200"><CheckCircle2 className="w-3 h-3 text-teal-600" /> ยืนยันนัดแล้ว</span>;
      case 'scheduled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3 text-amber-600" /> รอยืนยันนัด</span>;
      case 'missed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"><AlertCircle className="w-3 h-3 text-rose-600" /> ขาดนัดตรวจ</span>;
      case 'rescheduled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"><Clock className="w-3 h-3 text-indigo-600" /> ขอเลื่อนนัด</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700"><CheckCircle2 className="w-3 h-3" /> ตรวจแล้ว</span>;
    }
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-7 h-7 text-teal-600" />
              <span>รายการนัดหมายผู้ป่วย (Appointments)</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">บริหารจัดการวันนัด ยืนยันการมาตามนัด เลื่อนนัด และติดตามผู้ป่วยขาดนัด</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างรายการนัดใหม่</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อผู้ป่วย หรือ HN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <span className="text-xs text-slate-500 font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> สถานะ:
            </span>
            {[
              { code: 'all', label: 'ทั้งหมด' },
              { code: 'confirmed', label: 'ยืนยันแล้ว' },
              { code: 'scheduled', label: 'รอยืนยัน' },
              { code: 'missed', label: 'ขาดนัด' },
              { code: 'rescheduled', label: 'ขอเลื่อน' },
            ].map((st) => (
              <button
                key={st.code}
                onClick={() => setSelectedStatus(st.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedStatus === st.code
                    ? 'bg-teal-600 text-white shadow-sm font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Appointment Table */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">วัน-เวลานัดหมาย</th>
                  <th className="pb-3 font-semibold">ผู้ป่วย (HN)</th>
                  <th className="pb-3 font-semibold">โรคประจำตัว</th>
                  <th className="pb-3 font-semibold">คลินิก / แพทย์</th>
                  <th className="pb-3 font-semibold">สถานะนัดหมาย</th>
                  <th className="pb-3 font-semibold text-right">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      ไม่พบนัดหมายตามเงื่อนไข
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-all">
                      <td className="py-4 pr-3">
                        <span className="block font-bold text-slate-800">{app.date}</span>
                        <span className="block text-[10px] text-teal-600 font-mono">{app.time}</span>
                      </td>
                      <td className="py-4">
                        <span className="block font-bold text-slate-800">{app.patientName}</span>
                        <span className="block text-[10px] text-slate-400">{app.hn}</span>
                      </td>
                      <td className="py-4 text-slate-600">{app.disease}</td>
                      <td className="py-4">
                        <span className="block text-slate-700 font-medium">{app.clinic}</span>
                        <span className="block text-[10px] text-slate-400">{app.provider}</span>
                      </td>
                      <td className="py-4">{getStatusBadge(app.status)}</td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          {app.status === 'scheduled' && (
                            <button
                              onClick={() => {
                                setAppointments(appointments.map(a => a.id === app.id ? { ...a, status: 'confirmed' } : a));
                              }}
                              className="px-2.5 py-1 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white rounded-lg transition-all text-xs font-semibold cursor-pointer border border-teal-200"
                            >
                              ยืนยันนัด
                            </button>
                          )}
                          <button
                            onClick={() => alert(`จัดการนัดหมายของ ${app.patientName}`)}
                            className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-all text-xs cursor-pointer border border-slate-200"
                          >
                            แก้ไข
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Appointment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-teal-600" />
                  <span>สร้างรายการนัดหมายใหม่</span>
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowAddModal(false);
                  alert('สร้างรายการนัดหมายใหม่สำเร็จ!');
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">เลือกผู้ป่วย (HN)</label>
                  <input required type="text" placeholder="พิมพ์ HN-XXXXX หรือชื่อผู้ป่วย" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">วันนัดหมาย</label>
                    <input required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">เวลานัด</label>
                    <input required type="time" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">คลินิก</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800">
                    <option value="dm">คลินิกเบาหวาน</option>
                    <option value="ht">คลินิกความดันโลหิตสูง</option>
                    <option value="ckd">คลินิกโรคไต</option>
                    <option value="copd">คลินิกโรคปอดและหืด</option>
                  </select>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl">ยกเลิก</button>
                  <button type="submit" className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl shadow-md hover:bg-teal-700">บันทึกวันนัด</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
