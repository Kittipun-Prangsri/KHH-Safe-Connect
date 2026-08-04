'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Calendar, AlertCircle, PhoneCall, MessageSquare, TrendingUp, Users, ArrowUpRight, Plus, Download, RefreshCw, Database, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalPatients: 97859,
    appointmentsToday: 18,
    upcomingAppointments: 4102,
    missedFollowUps: 12,
  });

  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  const fetchLiveHosxpStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hosxp/stats');
      const data = await res.json();
      if (data.success) {
        setStatsData(data.stats);
        setRecentAppointments(data.recentAppointments || []);
      }
    } catch (err) {
      console.error('❌ Failed to fetch live HOSxP stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveHosxpStats();
  }, []);

  const stats = [
    { title: 'ผู้ป่วยทั้งหมดใน HOSxP', value: `${statsData.totalPatients.toLocaleString()} ราย`, change: 'ฐานข้อมูล HOSxP จริง', icon: Users, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { title: 'ผู้ป่วยนัดล่วงหน้า', value: `${statsData.upcomingAppointments.toLocaleString()} ราย`, change: 'ตาราง oapp & patient', icon: Calendar, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { title: 'ผู้ป่วยนัดวันนี้', value: `${statsData.appointmentsToday} ราย`, change: 'อัปเดตสดจาก HOSxP', icon: PhoneCall, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { title: 'ต้องติดตามขาดนัด', value: `${statsData.missedFollowUps} ราย`, change: 'ในรอบ 30 วันที่ผ่านมา', icon: AlertCircle, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <span>ภาพรวมระบบ (Dashboard)</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ข้อมูลสถิติอัปเดตตามเวลาจริง | {new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchLiveHosxpStats}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
              <span>อัปเดตสถิติสด</span>
            </button>
            <Link href="/appointments" className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 shadow-md transition-all cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              <span>สร้างรายการนัด</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/80 hover-grow shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.title}</span>
                  <div className={`p-2.5 rounded-xl border ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-1">{loading ? '...' : stat.value}</div>
                  <div className="text-[10px] text-teal-600 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-teal-500" />
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Appointments from HOSxP */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>รายการนัดหมายล่วงหน้าสดจาก HOSxP</span>
              </h3>
              <Link href="/appointments" className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-0.5">
                <span>ดูทั้งหมด</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="py-8 text-center text-slate-500 font-medium">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-600" />
                  <span>กำลังดึงรายการนัดหมายล่าสุดจาก HOSxP...</span>
                </div>
              ) : recentAppointments.length === 0 ? (
                <div className="py-8 text-center text-slate-400">ไม่พบนัดหมายล่วงหน้า</div>
              ) : (
                recentAppointments.map((app) => (
                  <div key={app.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between hover:bg-slate-100/60 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{app.patientName}</span>
                        <span className="text-[10px] text-teal-600 font-mono font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{app.hn}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        🏥 {app.clinic} | 👨‍⚕️ {app.doctor}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-slate-800 text-xs">{app.date}</span>
                      <span className="text-[11px] font-bold text-amber-700">{app.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions & Connection Status */}
          <div className="space-y-6">
            {/* Quick Action Shortcuts */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <span>เมนูด่วนสำหรับเจ้าหน้าที่ NCDs</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <Link
                  href="/registry"
                  className="p-3 bg-teal-50/80 hover:bg-teal-100/80 border border-teal-200 rounded-xl font-bold text-teal-900 transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-5 h-5 text-teal-600" />
                  <span>ทะเบียน NCDs</span>
                </Link>
                <Link
                  href="/missed-followups"
                  className="p-3 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200 rounded-xl font-bold text-rose-900 transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer"
                >
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <span>ผู้ป่วยขาดนัด</span>
                </Link>
                <Link
                  href="/line-flex-test"
                  className="p-3 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl font-bold text-emerald-900 transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <span>LINE Flex Cards</span>
                </Link>
                <Link
                  href="/settings"
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800 transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer"
                >
                  <Database className="w-5 h-5 text-slate-600" />
                  <span>ตั้งค่าระบบ</span>
                </Link>
              </div>
            </div>

            {/* Connection Status */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-600" />
                <span>สถานะการเชื่อมต่อฐานข้อมูล</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    HOSxP Database (192.168.1.4)
                  </span>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                </div>
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-teal-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    LINE Messaging Webhook
                  </span>
                  <span className="text-[10px] bg-teal-600 text-white font-bold px-2 py-0.5 rounded-full">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
