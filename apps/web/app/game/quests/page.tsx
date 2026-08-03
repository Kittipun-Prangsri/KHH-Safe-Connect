'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Camera, 
  HeartPulse, 
  CalendarCheck, 
  Footprints, 
  CheckCircle2, 
  Sparkles, 
  Award,
  Upload,
  AlertCircle
} from 'lucide-react';

export default function QuestsPage() {
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [mentalQuizDone, setMentalQuizDone] = useState(false);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <Link href="/game" className="text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
        </Link>
        <h1 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
          🎯 ภารกิจสุขภาพ (Quests)
        </h1>
        <div className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/30">
          ภารกิจประจำวัน
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {/* Quest 1: Meal Photo Upload */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-5 shadow-lg space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Daily Quest</span>
                <h2 className="text-sm font-bold text-white">ส่งภาพถ่ายมื้ออาหารผ่าน LINE</h2>
                <p className="text-xs text-slate-400 mt-0.5">ให้นักโภชนาการ/พยาบาลประเมินคะแนนคาร์บ</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              +50 XP
            </span>
          </div>

          {!photoUploaded ? (
            <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-4 text-center cursor-pointer transition bg-slate-900/40">
              <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <div className="text-xs font-semibold text-slate-200">ถ่ายภาพมื้ออาหาร หรือคลิกอัปโหลด</div>
              <div className="text-[10px] text-slate-400 mt-1">ระบบจะผูกภาพกับ HN และส่งไปยัง Dashboard สหวิชาชีพ</div>
              <button
                onClick={() => setPhotoUploaded(true)}
                className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                จำลองการส่งภาพอาหาร
              </button>
            </div>
          ) : (
            <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-2xl p-4 text-center text-xs text-emerald-200">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <div className="font-bold">ส่งภาพถ่ายมื้ออาหารเรียบร้อยแล้ว!</div>
              <div className="text-[11px] text-emerald-300 mt-0.5">ทีมสหวิชาชีพกำลังดำเนินการประเมินคะแนนวงล้อนับคาร์บให้คุณ (+50 XP)</div>
            </div>
          )}
        </div>

        {/* Quest 2: Mental Health Quiz (Weekly) */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-5 shadow-lg space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl font-bold">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Weekly Quest (หมวด 5)</span>
                <h2 className="text-sm font-bold text-white">แบบประเมินสุขภาพจิต (2Q/9Q)</h2>
                <p className="text-xs text-slate-400 mt-0.5">ประเมินสภาวะอารมณ์และความเครียดประจำสัปดาห์</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              +100 XP
            </span>
          </div>

          {!mentalQuizDone ? (
            <button
              onClick={() => setMentalQuizDone(true)}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> ทำแบบประเมินสุขภาพจิต (+100 XP)
            </button>
          ) : (
            <div className="bg-purple-950/50 border border-purple-500/50 rounded-2xl p-4 text-center text-xs text-purple-200">
              <CheckCircle2 className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <div className="font-bold">ทำแบบประเมินประเมินเรียบร้อยแล้ว!</div>
              <div className="text-[11px] text-purple-300 mt-0.5">สภาวะสุขภาพจิตอยู่ในเกณฑ์ปกติ (+100 XP)</div>
            </div>
          )}
        </div>

        {/* Quest 3: Appointment Response Rate */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-5 shadow-lg space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl font-bold">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Appointment Quest</span>
                <h2 className="text-sm font-bold text-white">ตอบรับระบบนัดหมายอัตโนมัติ</h2>
                <p className="text-xs text-slate-400 mt-0.5">ยืนยันวันนัดหมายล่วงหน้าผ่าน LINE</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              +50 XP
            </span>
          </div>

          {!appointmentConfirmed ? (
            <button
              onClick={() => setAppointmentConfirmed(true)}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> กดปุ่ม "ยืนยันวันนัดหมาย" (+50 XP)
            </button>
          ) : (
            <div className="bg-cyan-950/50 border border-cyan-500/50 rounded-2xl p-4 text-center text-xs text-cyan-200">
              <CheckCircle2 className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
              <div className="font-bold">ยืนยันนัดเรียบร้อยแล้ว!</div>
              <div className="text-[11px] text-cyan-300 mt-0.5">นัดหมายถัดไป: วันจันทร์ที่ 15 ก.ย. 2026 คลินิก NCDs โรงพยาบาลคลองหาด</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
