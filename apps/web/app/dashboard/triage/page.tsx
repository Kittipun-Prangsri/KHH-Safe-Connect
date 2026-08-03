'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Video, 
  UserCheck, 
  Filter, 
  Search,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function TriageDashboardPage() {
  const [filter, setFilter] = useState<'all' | 'red' | 'yellow' | 'green'>('all');
  const [triageData, setTriageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/game/triage')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTriageData(data.triage);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const summary = triageData?.summary || {
    total_active_patients: 128,
    green_count: 84,
    yellow_count: 32,
    red_count: 12,
    weekly_avg_nutrition_score: 4.12
  };

  const handleTriggerAction = (patientName: string, actionType: string) => {
    setActionSuccess(`สร้างงานติดตามด่วน: ${actionType} ให้กับ ${patientName} เรียบร้อยแล้ว`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const redPatients = triageData?.red_patients || [];
  const yellowPatients = triageData?.yellow_patients || [];
  const greenPatients = triageData?.green_patients || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> แดชบอร์ดหลัก
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-emerald-400 font-semibold">Triage Matrix System</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🚨 แดชบอร์ดคัดกรองเตือนภัยโภชนาการ (Triage Matrix 🟢🟡🔴)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            มอนิเตอร์สถานะการคุมคาร์บวงล้อ 2:1:1 ของผู้ป่วย DM แบบ Real-time เพื่อแจ้งเตือนพยาบาล NCDs และ อสม.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/nutrition-eval"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md"
          >
            <Sparkles className="w-4 h-4" /> หน้าตรวจประเมินรูปอาหาร
          </Link>
          <Link
            href="/reports/clinical-correlation"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
          >
            📊 รายงาน Clinical Outcomes
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 p-4 rounded-2xl flex items-center gap-3 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Triage Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Active */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="text-xs font-semibold text-slate-400">ผู้ป่วยในระบบติดตามทั้งหมด</div>
          <div className="text-3xl font-extrabold text-white mt-2">{summary.total_active_patients} ราย</div>
          <div className="text-[11px] text-slate-500 mt-1">คะแนนโภชนาการเฉลี่ย {summary.weekly_avg_nutrition_score} / 5.0</div>
        </div>

        {/* Red Alert */}
        <div 
          onClick={() => setFilter('red')}
          className={`bg-rose-950/40 border cursor-pointer transition rounded-3xl p-5 shadow-lg ${
            filter === 'red' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-rose-900/50 hover:border-rose-500/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-400">
            <span className="flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> 🔴 สีแดง (เสี่ยงสูง)</span>
            <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full text-[10px]">ต้องเข้าช่วยเหลือ</span>
          </div>
          <div className="text-3xl font-extrabold text-rose-300 mt-2">{summary.red_count} ราย</div>
          <div className="text-[11px] text-rose-400/80 mt-1">หลุดคาร์บติดกัน 3 มื้อ / คะแนน &lt; 2.5</div>
        </div>

        {/* Yellow Alert */}
        <div 
          onClick={() => setFilter('yellow')}
          className={`bg-amber-950/40 border cursor-pointer transition rounded-3xl p-5 shadow-lg ${
            filter === 'yellow' ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-amber-900/50 hover:border-amber-500/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> 🟡 สีเหลือง (เริ่มหลุดเกณฑ์)</span>
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-[10px]">ติดตามคำแนะนำ</span>
          </div>
          <div className="text-3xl font-extrabold text-amber-300 mt-2">{summary.yellow_count} ราย</div>
          <div className="text-[11px] text-amber-400/80 mt-1">คะแนนคุมคาร์บ 2.5 - 3.9</div>
        </div>

        {/* Green Alert */}
        <div 
          onClick={() => setFilter('green')}
          className={`bg-emerald-950/40 border cursor-pointer transition rounded-3xl p-5 shadow-lg ${
            filter === 'green' ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-emerald-900/50 hover:border-emerald-500/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> 🟢 สีเขียว (ปกติ)</span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px]">คุมคาร์บดีเยี่ยม</span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-300 mt-2">{summary.green_count} ราย</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">คะแนน 4.0 - 5.0 ต่อเนื่อง</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ผู้ป่วยทั้งหมด ({summary.total_active_patients})
          </button>
          <button
            onClick={() => setFilter('red')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'red' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-400 hover:text-rose-200'
            }`}
          >
            🔴 เคสด่วนสีแดง ({summary.red_count})
          </button>
          <button
            onClick={() => setFilter('yellow')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'yellow' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-400 hover:text-amber-200'
            }`}
          >
            🟡 เฝ้าระวังสีเหลือง ({summary.yellow_count})
          </button>
          <button
            onClick={() => setFilter('green')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'green' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-400 hover:text-emerald-200'
            }`}
          >
            🟢 สถานะดีเยี่ยม ({summary.green_count})
          </button>
        </div>
      </div>

      {/* Urgent Red Cases Matrix Table */}
      {(filter === 'all' || filter === 'red') && (
        <div className="bg-slate-900 border border-rose-900/50 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-rose-900/40 pb-4">
            <h2 className="text-lg font-bold text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" /> 🔴 รายชื่อผู้ป่วยกลุ่มสีแดง (ต้องดำเนินการด่วน)
            </h2>
            <span className="text-xs text-rose-400 font-semibold bg-rose-950 px-3 py-1 rounded-full border border-rose-800">
              แจ้งเตือน Real-time ไปยัง อสม. / พยาบาล NCDs
            </span>
          </div>

          <div className="space-y-3">
            {redPatients.map((p: any) => (
              <div key={p.id} className="bg-slate-950 border border-rose-900/60 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-rose-500/60 transition">
                <div className="flex items-center gap-4">
                  <img
                    src={p.last_meal_photo}
                    alt="Meal photo"
                    className="w-16 h-16 rounded-2xl object-cover border border-rose-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{p.name}</span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">{p.hn}</span>
                      <span className="text-xs text-rose-400 font-bold bg-rose-950 px-2 py-0.5 rounded-md border border-rose-900">
                        คะแนน {p.weekly_nutrition_score} / 5.0
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {p.disease} • {p.village} • เบอร์โทร: <span className="text-slate-200 font-semibold">{p.phone}</span>
                    </div>
                    <div className="text-xs text-rose-300 mt-1 font-semibold flex items-center gap-1">
                      ⚠️ เหตุผล: {p.reason}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleTriggerAction(p.name, 'Video Call พยาบาล')}
                    className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md"
                  >
                    <Video className="w-4 h-4" /> วิดีโอคอลทันที
                  </button>
                  <button
                    onClick={() => handleTriggerAction(p.name, 'ส่งทีม อสม. ลงเยี่ยมบ้าน')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4 text-amber-400" /> แจ้ง อสม. เยี่ยมบ้าน
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Yellow / Green Patient List */}
      {(filter === 'all' || filter === 'yellow' || filter === 'green') && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <Filter className="w-5 h-5 text-emerald-400" /> รายชื่อผู้ป่วยกลุ่มเฝ้าระวัง (สีเหลือง & สีเขียว)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {yellowPatients.map((p: any) => (
              <div key={p.id} className="bg-slate-950 border border-amber-900/40 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{p.name} ({p.hn})</span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded-md border border-amber-900">
                    🟡 คะแนน {p.weekly_nutrition_score}
                  </span>
                </div>
                <div className="text-xs text-slate-400">{p.reason}</div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">อัปเดต: {p.last_active}</span>
                  <button
                    onClick={() => handleTriggerAction(p.name, 'ส่งการ์ดความรู้ทาง LINE')}
                    className="text-amber-400 hover:underline font-semibold"
                  >
                    ส่งคำแนะนำวงล้อนับคาร์บ →
                  </button>
                </div>
              </div>
            ))}

            {greenPatients.map((p: any) => (
              <div key={p.id} className="bg-slate-950 border border-emerald-900/40 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{p.name} ({p.hn})</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-900">
                    🟢 คะแนน {p.weekly_nutrition_score} (Streak {p.streak_days} วัน)
                  </span>
                </div>
                <div className="text-xs text-slate-400">{p.action_needed}</div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">สถานะ: คุมคาร์บดีเยี่ยม</span>
                  <button
                    onClick={() => handleTriggerAction(p.name, 'ส่งข้อความชมเชย + Bonus XP')}
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    ส่งข้อความชมเชย →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
