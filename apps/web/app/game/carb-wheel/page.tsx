'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  RotateCw, 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  AlertCircle, 
  Footprints,
  Info,
  Flame
} from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  category: 'veg' | 'carb' | 'protein' | 'hidden_carb';
  carbUnits: number;
  description: string;
  icon: string;
}

const FOOD_ITEMS: FoodItem[] = [
  { id: 'f1', name: 'ผักใบเขียว (คะน้า/กะหล่ำ)', category: 'veg', carbUnits: 0, description: 'ทานได้ไม่อั้น คาร์บท่ำ ผัก 2 ส่วน', icon: '🥬' },
  { id: 'f2', name: 'ข้าวกล้อง (1 ทัพพี)', category: 'carb', carbUnits: 1, description: 'ข้าว/แป้ง 1 ส่วน พอดีมื้อ', icon: '🍚' },
  { id: 'f3', name: 'ปลานึ่ง / ไก่อบ', category: 'protein', carbUnits: 0, description: 'เนื้อสัตว์ไขมันต่ำ 1 ส่วน', icon: '🐟' },
  { id: 'f4', name: 'แครอท / ข้าวโพดอ่อน (3 ทัพพี)', category: 'hidden_carb', carbUnits: 1, description: '⚠️ ผักมีแป้งซ่อน! 3 ทัพพีเท่ากับ 1 คาร์บ', icon: '🌽' },
  { id: 'f5', name: 'เงาะ 4 ผล / มังคุด 4 ลูก', category: 'hidden_carb', carbUnits: 1, description: '⚠️ ผลไม้คาร์บสูง! หวานจัดควรระวัง', icon: '🥭' },
  { id: 'f6', name: 'เครื่องดื่มชูกำลัง / น้ำอัดลม', category: 'hidden_carb', carbUnits: 2, description: '❌ น้ำตาลสูงมาก ควรหลีกเลี่ยง', icon: '🥤' }
];

export default function CarbWheelGamePage() {
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');
  const [selectedItems, setSelectedItems] = useState<string[]>(['f1', 'f2', 'f3']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [walkTimerActive, setWalkTimerActive] = useState(false);
  const [walkSeconds, setWalkSeconds] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const toggleItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSpinWheel = () => {
    setIsSpinning(true);
    const newRotation = rotation + 1440 + Math.floor(Math.random() * 360);
    setRotation(newRotation);
    setTimeout(() => {
      setIsSpinning(false);
    }, 2000);
  };

  const totalCarbUnits = selectedItems.reduce((sum, id) => {
    const item = FOOD_ITEMS.find((f) => f.id === id);
    return sum + (item ? item.carbUnits : 0);
  }, 0);

  const hasVeg = selectedItems.some((id) => FOOD_ITEMS.find((f) => f.id === id)?.category === 'veg');
  const hasCarb = selectedItems.some((id) => FOOD_ITEMS.find((f) => f.id === id)?.category === 'carb');
  const hasProtein = selectedItems.some((id) => FOOD_ITEMS.find((f) => f.id === id)?.category === 'protein');
  const is211Correct = hasVeg && hasCarb && hasProtein;

  let score = 5.0;
  if (!is211Correct) score -= 1.5;
  if (totalCarbUnits > 2) score -= 2.0;
  score = Math.max(1.0, score);

  const handleSubmitScore = async () => {
    setSubmitted(true);
    try {
      await fetch('/api/game/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: 'demo-patient-001',
          addXp: 100,
          addCoins: 30,
          questCode: 'carb_wheel_simulator'
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      {/* Header Bar */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <Link href="/game" className="text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
        </Link>
        <h1 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
          🎡 วงล้อนับคาร์บ 2:1:1
        </h1>
        <div className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-full font-bold border border-amber-500/30">
          +100 XP
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {/* Banner Intro */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-3xl p-5 shadow-lg text-white relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                หลักโภชนาการคลองหาด
              </span>
              <h2 className="text-xl font-bold mt-1">จัดมื้ออาหาร 2:1:1</h2>
              <p className="text-xs text-rose-100 mt-1">
                ผัก 2 ส่วน, ข้าว/แป้ง 1 ส่วน, เนื้อสัตว์ 1 ส่วน (คาร์บไม่เกิน 1-2 ทัพพี)
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-4xl shadow-inner">
              🥗
            </div>
          </div>
        </div>

        {/* Meal Selector */}
        <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700 text-xs font-semibold">
          {(['breakfast', 'lunch', 'dinner'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMeal(m)}
              className={`flex-1 py-2 rounded-xl transition ${
                selectedMeal === m
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m === 'breakfast' ? '🌅 มื้อเช้า' : m === 'lunch' ? '☀️ มื้อกลางวัน' : '🌙 มื้อเย็น'}
            </button>
          ))}
        </div>

        {/* Interactive Carb Wheel Canvas Graphic */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl text-center relative overflow-hidden">
          <div className="relative w-56 h-56 mx-auto mb-4">
            <div
              className="w-full h-full rounded-full border-4 border-amber-400/80 shadow-2xl relative transition-transform duration-1000 ease-out overflow-hidden"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {/* Wheel Segments */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-600 to-rose-500 clip-pie-1 flex items-center justify-center">
                <span className="text-white text-xs font-bold -rotate-45">มื้ออาหาร 2:1:1</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-indigo-500 clip-pie-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold rotate-45">แป้งซ่อนในผัก</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-500 clip-pie-3 flex items-center justify-center">
                <span className="text-white text-xs font-bold rotate-135">คาร์บ 1-2 ทัพพี</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-teal-500 clip-pie-4 flex items-center justify-center">
                <span className="text-white text-xs font-bold -rotate-135">ออกกำลังกาย</span>
              </div>
            </div>

            {/* Center Pointer */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-lg">
              🎯
            </div>
          </div>

          <button
            onClick={handleSpinWheel}
            disabled={isSpinning}
            className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-2xl shadow-lg transition flex items-center gap-2 mx-auto"
          >
            <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? 'กำลังหมุนวงล้อ...' : 'หมุนวงล้อสุ่มความรู้คาร์บ'}
          </button>
        </div>

        {/* Plate Food Selection Checklist */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              🍱 เลือกเมนูจัดจานอาหารของคุณ
            </h3>
            <span className="text-xs text-slate-400">คลิกเลือกเมนู</span>
          </div>

          <div className="space-y-2">
            {FOOD_ITEMS.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500 text-white'
                      : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-100">{item.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.carbUnits > 0 && (
                      <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                        +{item.carbUnits} คาร์บ
                      </span>
                    )}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Meal Evaluation Result Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300">ผลประเมินวงล้อนับคาร์บ</span>
            <span className="text-amber-400 font-extrabold text-sm">คะแนน {score.toFixed(1)} / 5.0</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`p-3 rounded-2xl border ${is211Correct ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/30 border-rose-500/40 text-rose-300'}`}>
              <div className="font-bold flex items-center gap-1">
                {is211Correct ? '✓ สัดส่วน 2:1:1 ครบ' : '⚠️ ไม่ครบ 2:1:1'}
              </div>
              <div className="text-[10px] mt-1 opacity-80">
                {is211Correct ? 'ผัก 2 ส่วน ข้าว 1 ส่วน เนื้อ 1 ส่วน' : 'ควรมีผัก ข้าว และเนื้อให้ครบ'}
              </div>
            </div>

            <div className={`p-3 rounded-2xl border ${totalCarbUnits <= 2 ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/30 border-amber-500/40 text-amber-300'}`}>
              <div className="font-bold flex items-center gap-1">
                {totalCarbUnits <= 2 ? '🟢 คาร์บเหมาะสม' : '🟡 คาร์บสูงเกิน'}
              </div>
              <div className="text-[10px] mt-1 opacity-80">
                ปริมาณรวม: {totalCarbUnits} คาร์บ
              </div>
            </div>
          </div>

          {!submitted ? (
            <button
              onClick={handleSubmitScore}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4" /> บันทึกการเล่นมินิเกม รับ +100 XP
            </button>
          ) : (
            <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-3.5 text-center text-xs text-emerald-200">
              🎉 บันทึกสำเร็จ! คุณได้รับ **+100 XP** และ **+30 Coins** เข้าสู่โปรไฟล์แล้ว
            </div>
          )}
        </div>

        {/* Post-Meal Walk Bonus Quest */}
        <div className="bg-gradient-to-r from-teal-900/60 to-emerald-900/60 border border-teal-500/30 rounded-3xl p-5 text-center">
          <div className="w-12 h-12 bg-teal-500/20 text-teal-300 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2">
            🚶‍♂️
          </div>
          <h3 className="text-sm font-bold text-white">โบนัส: เดินขยับกาย 10-15 นาทีหลังอาหาร</h3>
          <p className="text-xs text-teal-200 mt-1">ช่วยลดการพุ่งสูงของระดับน้ำตาลหลังมื้ออาหาร</p>

          <button
            onClick={() => setWalkTimerActive(!walkTimerActive)}
            className="mt-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5 shadow-md"
          >
            <Footprints className="w-4 h-4" />
            {walkTimerActive ? 'กำลังเดิน... (กดเพื่อเสร็จสิ้น)' : 'เช็คอินการเดินหลังอาหาร (+30 XP)'}
          </button>
        </div>
      </div>
    </div>
  );
}
