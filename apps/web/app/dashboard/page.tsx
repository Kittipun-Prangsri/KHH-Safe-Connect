'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Calendar, AlertCircle, PhoneCall, MessageSquare, TrendingUp, Users, ArrowUpRight, Plus, Download } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const stats = [
    { title: 'ผู้ป่วยนัดวันนี้', value: '18 ราย', change: '+12% เทียบเมื่อวาน', icon: Calendar, color: 'text-clinical-400 bg-clinical-500/10' },
    { title: 'รอยืนยันติดต่อ', value: '5 ราย', change: 'ครบกำหนดวันนี้', icon: PhoneCall, color: 'text-amber-400 bg-amber-500/10' },
    { title: 'ผู้ป่วยขาดนัด', value: '2 ราย', change: '-4% เทียบเดือนที่แล้ว', icon: AlertCircle, color: 'text-rose-400 bg-rose-500/10' },
    { title: 'ข้อความ Reply ใหม่', value: '3 ข้อความ', change: '2 ข้อความเร่งด่วน', icon: MessageSquare, color: 'text-indigo-400 bg-indigo-500/10' },
  ];

  const recentFollowUps = [
    { hn: 'HN-98302', name: 'นายสมชาย ดีเลิศ', disease: 'DM, HT', status: 'โทรไม่ติด', date: '10:30 น.', priority: 'high' },
    { hn: 'HN-12493', name: 'นางสาววิมล ศรีใส', disease: 'CKD Stage 3', status: 'รอโทรยืนยันนัด', date: '11:15 น.', priority: 'normal' },
    { hn: 'HN-85401', name: 'นายเกรียงไกร ลุยรบ', disease: 'COPD', status: 'ขาดนัดตรวจ', date: 'เมื่อวาน', priority: 'urgent' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-navy-950/20">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">แผงควบคุมระบบ (Dashboard)</h1>
            <p className="text-navy-300 text-xs sm:text-sm">ยินดีต้อนรับกลับมา, คุณกิตติพงษ์ | ข้อมูลอัปเดตล่าสุด ณ วันนี้ {new Date().toLocaleDateString('th-TH')}</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-navy-800 border border-white/15 rounded-xl text-xs font-semibold text-white hover:bg-navy-700 hover:border-white/20 transition-all cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>ส่งออกรายงาน</span>
            </button>
            <Link href="/appointments" className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-clinical-600 to-clinical-500 text-white rounded-xl text-xs font-semibold hover:from-clinical-500 hover:to-clinical-400 shadow-glow transition-all cursor-pointer">
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
              <div key={idx} className="p-6 rounded-2xl glassmorphism hover-grow shadow-lg flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-navy-300 text-xs font-bold uppercase tracking-wider">{stat.title}</span>
                  <div className={`p-2 rounded-xl ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1.5">{stat.value}</div>
                  <div className="text-[10px] text-navy-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-clinical-400" />
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Recent Workload / Follow-ups */}
          <div className="lg:col-span-2 p-6 rounded-2xl glassmorphism border border-white/5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-white text-base">งานติดตามล่าสุด</h3>
                <p className="text-navy-400 text-xs">งานสายนัดหมายและการดูแลผู้ป่วย NCDs วันนี้</p>
              </div>
              <Link href="/follow-ups" className="text-xs font-semibold text-clinical-400 hover:text-clinical-300 flex items-center gap-0.5 transition-colors">
                <span>ดูงานทั้งหมด</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-navy-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">ผู้ป่วย</th>
                    <th className="pb-3 font-semibold">โรคประจำตัว</th>
                    <th className="pb-3 font-semibold">สถานะงาน</th>
                    <th className="pb-3 font-semibold">ความสำคัญ</th>
                    <th className="pb-3 font-semibold">เวลา</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {recentFollowUps.map((task, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-all">
                      <td className="py-3.5 pr-3">
                        <span className="block font-bold text-white">{task.name}</span>
                        <span className="block text-[10px] text-navy-400">{task.hn}</span>
                      </td>
                      <td className="py-3.5 text-navy-200">{task.disease}</td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-navy-300">
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          task.priority === 'urgent' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          task.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-clinical-500/10 text-clinical-300 border border-clinical-500/20'
                        }`}>
                          {task.priority === 'urgent' ? 'ด่วนที่สุด' :
                           task.priority === 'high' ? 'ด่วน' : 'ปกติ'}
                        </span>
                      </td>
                      <td className="py-3.5 text-navy-300">{task.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel: NCD Diseases Break Down */}
          <div className="p-6 rounded-2xl glassmorphism border border-white/5">
            <h3 className="font-bold text-white text-base mb-1">สัดส่วนผู้ป่วยตามกลุ่มโรค</h3>
            <p className="text-navy-400 text-xs mb-6">ผู้ป่วยขึ้นทะเบียน NCDs ทั้งหมดในระบบ</p>

            <div className="space-y-4">
              {[
                { label: 'DM (เบาหวาน)', count: '142 ราย', percent: '42%', color: 'bg-clinical-500' },
                { label: 'HT (ความดันสูง)', count: '124 ราย', percent: '37%', color: 'bg-amber-500' },
                { label: 'CKD (โรคไต)', count: '38 ราย', percent: '11%', color: 'bg-rose-500' },
                { label: 'COPD & ASTHMA', count: '32 ราย', percent: '10%', color: 'bg-indigo-500' },
              ].map((disease, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white">{disease.label}</span>
                    <span className="text-navy-300">{disease.count} ({disease.percent})</span>
                  </div>
                  <div className="w-full bg-navy-950/50 h-2 rounded-full overflow-hidden">
                    <div className={`${disease.color} h-full`} style={{ width: disease.percent }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-navy-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-clinical-500" />
                <span>ผู้ป่วยลงทะเบียนรวม 336 ราย</span>
              </span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
