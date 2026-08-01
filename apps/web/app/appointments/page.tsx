'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Calendar as CalendarIcon, Plus, Filter, CheckCircle2, Clock, XCircle, AlertCircle, Search, ChevronRight, MessageSquare, Edit3, Save, RefreshCw, Database } from 'lucide-react';

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
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [notifyLineOnSave, setNotifyLineOnSave] = useState(true);
  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Fetch Live Real Appointments from HOSxP Database
  const fetchLiveHosxpAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hosxp/appointments');
      const data = await res.json();
      if (data.success && Array.isArray(data.appointments)) {
        const formatted = data.appointments.map((a: any) => ({
          id: a.id,
          hn: a.hn,
          patientName: a.patientName,
          disease: 'NCDs (HOSxP)',
          date: a.appointmentDate,
          time: a.appointmentTime,
          clinic: a.clinic,
          provider: a.doctor,
          status: 'confirmed' as const,
        }));
        setAppointments(formatted);
      }
    } catch (err) {
      console.error('❌ Failed to fetch live HOSxP appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveHosxpAppointments();
  }, []);

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

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    setAppointments(appointments.map(a => a.id === editingAppointment.id ? editingAppointment : a));

    if (notifyLineOnSave) {
      try {
        await fetch('/api/notify/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'Uf636cf9137cbd32ff2c18773591be46a',
            patientName: editingAppointment.patientName,
            hn: editingAppointment.hn,
            appointmentDate: editingAppointment.date,
            appointmentTime: editingAppointment.time,
            clinic: editingAppointment.clinic,
            doctor: editingAppointment.provider,
          }),
        });
      } catch (err) {
        console.error('Error sending LINE alert:', err);
      }
    }

    setEditingAppointment(null);
    alert(`✅ บันทึกข้อมูลนัดหมายผู้ป่วย "${editingAppointment.patientName}" (${editingAppointment.hn}) เรียบร้อย!`);
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-7 h-7 text-teal-600" />
              <span>รายการนัดหมายผู้ป่วย (HOSxP Real Database)</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ดึงข้อมูลนัดหมายล่วงหน้าสดจากตาราง oapp & patient เซิร์ฟเวอร์ HOSxP 192.168.1.4</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLiveHosxpAppointments}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
              <span>โหลดนัดหมาย HOSxP ใหม่</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหา HN หรือชื่อผู้ป่วยใน HOSxP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
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
              { code: 'rescheduled', label: 'ขอเลื่อน' },
              { code: 'missed', label: 'ขาดนัด' },
            ].map((s) => (
              <button
                key={s.code}
                onClick={() => setSelectedStatus(s.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedStatus === s.code
                    ? 'bg-teal-600 text-white shadow-sm font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Table */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">HN / ชื่อผู้ป่วย</th>
                  <th className="pb-3 font-semibold">วัน-เวลานัดหมาย</th>
                  <th className="pb-3 font-semibold">คลินิก / แพทย์</th>
                  <th className="pb-3 font-semibold">สถานะนัดหมาย</th>
                  <th className="pb-3 font-semibold text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
                        <span>กำลังดึงรายการนัดหมายล่วงหน้าสดจาก HOSxP (oapp & patient)...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      ไม่พบรายการนัดหมายตามเงื่อนไข
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-all group">
                      <td className="py-4 pr-3">
                        <span className="block font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                          {app.patientName}
                        </span>
                        <span className="block text-[10px] text-teal-600 font-mono font-bold">{app.hn}</span>
                      </td>
                      <td className="py-4">
                        <span className="block font-bold text-slate-800">{app.date}</span>
                        <span className="block text-[11px] text-amber-700 font-semibold">{app.time}</span>
                      </td>
                      <td className="py-4">
                        <span className="block font-medium text-slate-700">{app.clinic}</span>
                        <span className="block text-[10px] text-slate-400">{app.provider}</span>
                      </td>
                      <td className="py-4">{getStatusBadge(app.status)}</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingAppointment(app)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-lg transition-all text-xs font-semibold border border-slate-200 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                            <span>แก้ไข</span>
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

        {/* Interactive Edit Appointment Modal */}
        {editingAppointment && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-teal-600" />
                  <span>แก้ไขข้อมูลรายการนัดหมาย ({editingAppointment.hn})</span>
                </h3>
                <button onClick={() => setEditingAppointment(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ชื่อ-นามสกุล ผู้ป่วย</label>
                  <input
                    required
                    type="text"
                    value={editingAppointment.patientName}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, patientName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">วันนัดหมายใหม่</label>
                    <input
                      required
                      type="text"
                      value={editingAppointment.date}
                      onChange={(e) => setEditingAppointment({ ...editingAppointment, date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">เวลานัดหมายใหม่</label>
                    <input
                      required
                      type="text"
                      value={editingAppointment.time}
                      onChange={(e) => setEditingAppointment({ ...editingAppointment, time: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">คลินิกบริการ</label>
                    <input
                      required
                      type="text"
                      value={editingAppointment.clinic}
                      onChange={(e) => setEditingAppointment({ ...editingAppointment, clinic: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">แพทย์ผู้ตรวจ</label>
                    <input
                      required
                      type="text"
                      value={editingAppointment.provider}
                      onChange={(e) => setEditingAppointment({ ...editingAppointment, provider: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">สถานะการนัดหมาย</label>
                  <select
                    value={editingAppointment.status}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, status: e.target.value as Appointment['status'] })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
                  >
                    <option value="confirmed">ยืนยันนัดแล้ว</option>
                    <option value="scheduled">รอยืนยันนัด</option>
                    <option value="rescheduled">ขอเลื่อนนัด</option>
                    <option value="missed">ขาดนัดตรวจ</option>
                    <option value="completed">ตรวจแล้ว</option>
                  </select>
                </div>

                <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    <span className="text-xs text-teal-800 font-medium">ส่ง LINE Flex Message แจ้งวันนัดใหม่ทันที</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyLineOnSave}
                    onChange={(e) => setNotifyLineOnSave(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingAppointment(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-medium cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>บันทึกการแก้ไข</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
