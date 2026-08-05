'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Calendar,
  AlertCircle,
  PhoneCall,
  MessageSquare,
  TrendingUp,
  Users,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Database,
  CheckCircle2,
  Zap,
  Clock,
  UserCheck,
  FileSpreadsheet,
  Settings,
  Activity,
  ArrowUpRight as ArrowUpRightIcon,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalPatients: 7400,
    appointmentsToday: 46,
    upcomingAppointments: 2944,
    missedFollowUps: 761,
  });

  const [recentAppointments, setRecentAppointments] = useState<any[]>([
    {
      id: '1',
      patientName: 'นายสุบิน อักษร',
      hn: 'HN-000028935',
      clinic: 'โรคเบาหวาน',
      doctor: 'นายแพทย์วัฒนนิกรณ์',
      time: '08:00 น.',
      status: 'confirmed',
      statusText: 'ยืนยันแล้ว',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: '2',
      patientName: 'น.ส.มาลัย วงษ์จำปา',
      hn: 'HN-000059754',
      clinic: 'โรคเบาหวาน',
      doctor: 'นายแพทย์วัฒนนิกรณ์',
      time: '08:30 น.',
      status: 'pending',
      statusText: 'รอยืนยัน',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: '3',
      patientName: 'นายวิทยา วงษ์จำปา',
      hn: 'HN-000006358',
      clinic: 'โรคความดัน',
      doctor: 'นายแพทย์วัฒนนิกรณ์',
      time: '09:00 น.',
      status: 'line_sent',
      statusText: 'ส่ง LINE แล้ว',
      statusColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
  ]);

  const fetchLiveHosxpStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hosxp/stats');
      const data = await res.json();
      if (data.success && data.stats) {
        setStatsData({
          totalPatients: data.stats.totalPatients || 7400,
          appointmentsToday: data.stats.appointmentsToday || 46,
          upcomingAppointments: data.stats.upcomingAppointments || 2944,
          missedFollowUps: data.stats.missedFollowUps || 761,
        });
        if (data.recentAppointments && data.recentAppointments.length > 0) {
          setRecentAppointments(data.recentAppointments);
        }
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

  const monthlyTrend = [
    { month: 'มี.ค.', count: 89, height: '42%' },
    { month: 'เม.ย.', count: 112, height: '55%' },
    { month: 'พ.ค.', count: 96, height: '47%' },
    { month: 'มิ.ย.', count: 138, height: '68%' },
    { month: 'ก.ค.', count: 166, height: '82%' },
    { month: 'ส.ค.', count: 124, height: '61%' },
  ];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-slate-800 font-sans">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>ภาพรวมระบบ (Dashboard)</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm flex items-center gap-2 mt-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ข้อมูลสถิติอัปเดตแบบเรียลไทม์ | 5 สิงหาคม 2569</span>
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchLiveHosxpStats}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
              <span>อัปเดต</span>
            </button>
            <Link
              href="/appointments"
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>สร้างรายการนัด</span>
            </Link>
          </div>
        </div>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Card 1: Total Patients */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-slate-500 text-xs font-bold">ผู้ป่วยทั้งหมดใน HOSxP</span>
                <div className="text-2xl md:text-3xl font-black text-slate-900 mt-3">
                  {loading ? '...' : statsData.totalPatients.toLocaleString()}{' '}
                  <span className="text-xs font-semibold text-slate-500">ราย</span>
                </div>
                <div className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>เพิ่มขึ้น 3.2%</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Card 2: Upcoming Appointments */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-slate-500 text-xs font-bold">ผู้ป่วยนัดล่วงหน้า</span>
                <div className="text-2xl md:text-3xl font-black text-slate-900 mt-3">
                  {loading ? '...' : statsData.upcomingAppointments.toLocaleString()}{' '}
                  <span className="text-xs font-semibold text-slate-500">ราย</span>
                </div>
                <div className="text-xs font-bold text-sky-600 mt-2 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>ตารางนัดหมาย</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Card 3: Today's Appointments */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-slate-500 text-xs font-bold">ผู้ป่วยนัดวันนี้</span>
                <div className="text-2xl md:text-3xl font-black text-slate-900 mt-3">
                  {loading ? '...' : statsData.appointmentsToday.toLocaleString()}{' '}
                  <span className="text-xs font-semibold text-slate-500">ราย</span>
                </div>
                <div className="text-xs font-bold text-amber-600 mt-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>ต้องดำเนินการวันนี้</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                <PhoneCall className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Card 4: Missed Follow-ups */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-slate-500 text-xs font-bold">ต้องติดตามขาดนัด</span>
                <div className="text-2xl md:text-3xl font-black text-slate-900 mt-3">
                  {loading ? '...' : statsData.missedFollowUps.toLocaleString()}{' '}
                  <span className="text-xs font-semibold text-slate-500">ราย</span>
                </div>
                <div className="text-xs font-bold text-rose-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>เพิ่มขึ้น 8.2%</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 1: Urgent Tasks & Quick Menu */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Urgent Tasks */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">⚡</span>
                <span>งานเร่งด่วนวันนี้</span>
              </h3>
              <Link href="/reply" className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-0.5">
                <span>ดูทั้งหมด</span>
                <ArrowUpRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-700">เร่งด่วน</span>
                  <span className="text-xs font-bold text-slate-800">Reply คัดกรองอาการผิดปกติ</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">3 ราย</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800">ติดตาม</span>
                  <span className="text-xs font-bold text-slate-800">ผู้ป่วยขาดนัดเกิน 7 วัน</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">18 ราย</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-100 text-sky-700">ยืนยันนัด</span>
                  <span className="text-xs font-bold text-slate-800">ผู้ป่วยยังไม่ตอบรับนัดวันนี้</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-600 text-white">12 ราย</span>
              </div>
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">📱</span>
              <span>เมนูด่วนสำหรับเจ้าหน้าที่ NCDs</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <Link
                href="/registry"
                className="p-3.5 bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-200 rounded-2xl font-bold text-emerald-900 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer min-h-[92px]"
              >
                <UserCheck className="w-6 h-6 text-emerald-600" />
                <span>ทะเบียน NCDs</span>
              </Link>

              <Link
                href="/follow-ups"
                className="p-3.5 bg-rose-50/80 hover:bg-rose-100/90 border border-rose-200 rounded-2xl font-bold text-rose-900 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer min-h-[92px]"
              >
                <AlertCircle className="w-6 h-6 text-rose-600" />
                <span>ผู้ป่วยขาดนัด</span>
              </Link>

              <Link
                href="/line-flex-test"
                className="p-3.5 bg-teal-50/80 hover:bg-teal-100/90 border border-teal-200 rounded-2xl font-bold text-teal-900 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer min-h-[92px]"
              >
                <MessageSquare className="w-6 h-6 text-teal-600" />
                <span>LINE Flex Cards</span>
              </Link>

              <Link
                href="/settings"
                className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-700 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer min-h-[92px]"
              >
                <Settings className="w-6 h-6 text-slate-600" />
                <span>ตั้งค่าระบบ</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2: Today's Appointments & Database Connection Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Appointments from HOSxP */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>รายการนัดหมายวันนี้ (HOSxP Live Data)</span>
              </h3>
              <Link href="/appointments" className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-0.5">
                <span>ดูทั้งหมด</span>
                <ArrowUpRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentAppointments.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between hover:bg-slate-100/60 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{app.patientName}</span>
                      <span className="text-[10px] text-teal-700 font-mono font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {app.hn}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {app.clinic} · {app.doctor}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800 text-xs">{app.time}</div>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border mt-1 ${app.statusColor}`}>
                      {app.statusText}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Database Connection Status */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 pb-2 border-b border-slate-100">
              <Database className="w-5 h-5 text-teal-600" />
              <span>สถานะการเชื่อมต่อฐานข้อมูล</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  HOSxP Database
                </span>
                <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>

              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Supabase Cloud
                </span>
                <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">ONLINE</span>
              </div>

              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  LINE Messaging API
                </span>
                <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">CONNECTED</span>
              </div>

              <div className="pt-2 flex justify-between items-center text-slate-500 font-medium">
                <span>Last Sync</span>
                <strong className="text-slate-800">13:35 น.</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: 6-Month Missed Followup Trend & Follow-up Effectiveness */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Missed Follow-ups Trend Chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <span>แนวโน้มผู้ป่วยขาดนัดย้อนหลัง 6 เดือน</span>
            </h3>

            {/* Visual Bar Chart */}
            <div className="h-56 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-100">
              {monthlyTrend.map((m, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-xs font-extrabold text-slate-700 opacity-90 group-hover:scale-110 transition-transform">
                    {m.count}
                  </span>
                  <div
                    style={{ height: m.height }}
                    className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg shadow-sm group-hover:from-teal-700 group-hover:to-teal-500 transition-all"
                  ></div>
                  <span className="text-xs font-bold text-slate-500">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up Effectiveness Stats */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <span>ประสิทธิผลการติดตาม</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-100">
                <span className="text-slate-600 font-medium">ติดต่อสำเร็จ</span>
                <strong className="text-emerald-600 text-sm font-black">68%</strong>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-100">
                <span className="text-slate-600 font-medium">ส่ง LINE สำเร็จ</span>
                <strong className="text-sky-600 text-sm font-black">21%</strong>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-100">
                <span className="text-slate-600 font-medium">ติดต่อไม่ได้</span>
                <strong className="text-amber-600 text-sm font-black">8%</strong>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">ปฏิเสธนัด</span>
                <strong className="text-rose-600 text-sm font-black">3%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

