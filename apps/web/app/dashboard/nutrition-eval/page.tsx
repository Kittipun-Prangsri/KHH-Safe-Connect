'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Utensils, 
  Star, 
  MessageSquare, 
  AlertCircle,
  Save,
  Clock
} from 'lucide-react';

export default function NutritionEvalPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [activeLog, setActiveLog] = useState<any>(null);
  const [score, setScore] = useState<number>(4.5);
  const [portion211, setPortion211] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('จัดจานอาหารได้ตามหลัก 2:1:1 ปริมาณคาร์บ 1 ทัพพี พอดีมื้อ');
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/game/carb-wheel')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.logs.length > 0) {
          setLogs(data.logs);
          setActiveLog(data.logs[0]);
          setScore(data.logs[0].carb_score || 4.5);
          setNotes(data.logs[0].nutritionist_notes || '');
        }
      });
  }, []);

  const handleSelectLog = (log: any) => {
    setActiveLog(log);
    setScore(log.carb_score || 4.0);
    setNotes(log.nutritionist_notes || '');
    setPortion211(log.portion_211_correct !== undefined ? log.portion_211_correct : true);
  };

  const handleSaveEvaluation = async () => {
    if (!activeLog) return;
    setSaving(true);

    try {
      const res = await fetch('/api/game/carb-wheel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeLog.id,
          patient_id: activeLog.patient_id,
          carb_score: score,
          portion_211_correct: portion211,
          nutritionist_notes: notes,
        })
      });

      const data = await res.json();
      setSaving(false);

      if (data.success) {
        setSavedSuccess(`บันทึกผลการประเมินมื้ออาหารของ ${activeLog.patient_name || 'ผู้ป่วย'} เรียบร้อยแล้ว`);
        setTimeout(() => setSavedSuccess(null), 4000);
      }
    } catch (e) {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard/triage" className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> แดชบอร์ด Triage
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-emerald-400 font-semibold">Nutrition Scoring Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🥗 เครื่องมือประเมินคะแนนภาพอาหาร (Carb Counting Scoring)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            สำหรับนักโภชนาการและพยาบาล NCDs ในการตรวจประเมินภาพถ่ายมื้ออาหารของผู้ป่วยตามสัดส่วนวงล้อนับคาร์บ 2:1:1
          </p>
        </div>

        <Link
          href="/dashboard/triage"
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
        >
          🚨 กลับหน้า Triage Matrix
        </Link>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 p-4 rounded-2xl flex items-center gap-3 shadow-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{savedSuccess}</span>
        </div>
      )}

      {/* Main Grid: Pending Meal Photos vs Evaluation Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Photo Log List */}
        <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center justify-between">
            <span>รายการภาพถ่ายมื้ออาหารรอประเมิน</span>
            <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
              {logs.length} มื้อ
            </span>
          </h2>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {logs.map((log) => {
              const isSelected = activeLog?.id === log.id;
              return (
                <div
                  key={log.id}
                  onClick={() => handleSelectLog(log)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={log.photo_url}
                      alt="Meal"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-100">{log.patient_name || log.patient_id}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        มื้อ: {log.meal_type === 'breakfast' ? 'เช้า' : log.meal_type === 'lunch' ? 'กลางวัน' : 'เย็น'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        ส่งเมื่อ: {new Date(log.submitted_at).toLocaleTimeString('th-TH')}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        log.alert_status === 'red'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : log.alert_status === 'yellow'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {log.carb_score ? `${log.carb_score} คะแนน` : 'รอประเมิน'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Scoring & Evaluation Form */}
        <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {activeLog ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    ประเมินภาพถ่ายมื้ออาหาร: {activeLog.patient_name || activeLog.patient_id}
                  </h2>
                  <div className="text-xs text-slate-400 mt-0.5">
                    HN: {activeLog.hn || 'HN-67001'} • มื้ออาหาร: {activeLog.meal_type}
                  </div>
                </div>
                <span className="text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full">
                  สถานะ: 🟢 พร้อมลงคะแนน
                </span>
              </div>

              {/* Photo Preview & Guidelines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-inner group">
                  <img
                    src={activeLog.photo_url}
                    alt="Meal preview"
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-200">
                    ภาพถ่ายมื้อจริงจากผู้ป่วย
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="font-bold text-amber-400 flex items-center gap-1">
                    <Utensils className="w-4 h-4" /> เกณฑ์วงล้อนับคาร์บ 2:1:1
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    <li>• 🥬 <strong>ผัก 2 ส่วน</strong>: เน้นผักใบเขียว</li>
                    <li>• 🍚 <strong>ข้าว 1 ส่วน</strong>: คาร์บไม่เกิน 1-2 ทัพพี</li>
                    <li>• 🐟 <strong>เนื้อ 1 ส่วน</strong>: เนื้อสัตว์ไขมันต่ำ</li>
                    <li>• ⚠️ <strong>เช็คแป้งซ่อน</strong>: ผลไม้หวานสูง หรือผักมีแป้ง</li>
                  </ul>
                </div>
              </div>

              {/* Scoring Form Inputs */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-2">
                    ให้คะแนนการนับคาร์บ (Carb Counting Score 1.0 - 5.0 คะแนน)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setScore(num)}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition border ${
                          score === num
                            ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {num}.0 ⭐
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2:1:1 Checkbox */}
                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">
                    การจัดสัดส่วนอาหารถูกต้องตามหลัก 2:1:1 หรือไม่?
                  </span>
                  <button
                    onClick={() => setPortion211(!portion211)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      portion211 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {portion211 ? '✓ ถูกต้องครบถ้วน' : '✕ ไม่ถูกต้อง'}
                  </button>
                </div>

                {/* Nutritionist Advice Notes */}
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-2">
                    คำแนะนำจากนักโภชนาการ / พยาบาล NCDs
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    placeholder="พิมพ์คำแนะนำเกี่ยวกับเมนูอาหารนี้..."
                  />
                </div>

                <button
                  onClick={handleSaveEvaluation}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3 rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> {saving ? 'กำลังบันทึก...' : 'บันทึกการประเมินคะแนนโภชนาการ'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-500 py-20 text-xs">
              เลือกรายการภาพถ่ายมื้ออาหารทางซ้ายเพื่อเริ่มประเมิน
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
