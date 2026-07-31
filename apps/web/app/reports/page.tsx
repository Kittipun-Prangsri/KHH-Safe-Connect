'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { BarChart3, Download, FileText, Calendar, Users, TrendingUp, Filter, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-teal-600" />
              <span>รายงานและสถิติ (Reports & Analytics)</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">สรุปสถิติการมาตามนัด ผู้ป่วยขาดนัด การติดตาม และภาระงานเจ้าหน้าที่</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => alert('ส่งออกรายงานเป็น Excel/CSV')}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={() => alert('ส่งออกรายงานเป็น PDF')}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 shadow-md transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Stats Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'ผู้ป่วยลงทะเบียนรวม', val: '336 ราย', sub: 'DM 42%, HT 37%' },
            { title: 'อัตราการมาตามนัด', val: '92.4%', sub: '+3.1% จากเดือนก่อน' },
            { title: 'ผู้ป่วยขาดนัดที่ติดตามสำเร็จ', val: '88.5%', sub: 'โทรติดตามภายใน 24 ชม.' },
            { title: 'จำนวนการสื่อสาร Reply', val: '142 เรื่อง', sub: 'แก้ไขสำเร็จ 96%' },
          ].map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{s.title}</span>
              <div className="text-2xl font-extrabold text-slate-800">{s.val}</div>
              <div className="text-[10px] text-teal-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-teal-500" />
                <span>{s.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Report List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-base">รายงานสรุปนัดหมายประจำเดือน</h3>
            <p className="text-xs text-slate-500">รายงานการเข้าตรวจของผู้ป่วย NCDs แยกตามกลุ่มโรคและคลินิกบริการ</p>
            <button
              onClick={() => alert('ดาวน์โหลดรายงานนัดหมาย')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all border border-slate-200"
            >
              ดาวน์โหลดรายงาน (.xlsx)
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-base">รายงานการติดตามผู้ป่วยขาดนัด</h3>
            <p className="text-xs text-slate-500">รายงานประวัติการโทรติดตาม และสาเหตุการขาดนัดเพื่อนำไปวิเคราะห์</p>
            <button
              onClick={() => alert('ดาวน์โหลดรายงานติดตาม')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all border border-slate-200"
            >
              ดาวน์โหลดรายงาน (.xlsx)
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
