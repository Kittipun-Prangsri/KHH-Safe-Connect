'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Info, 
  CheckCircle2, 
  Utensils
} from 'lucide-react';
import { WheelSliceData, WheelData } from './wheelData';


// Web Audio API Click Synthesizer for sound feedback
function playClickSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Ignore audio error if not allowed
  }
}

// Helper to construct SVG Pie Sector Path
function makePieSectorPath(cx: number, cy: number, r: number, startAngleDeg: number, endAngleDeg: number) {
  const startRad = (startAngleDeg - 90) * (Math.PI / 180);
  const endRad = (endAngleDeg - 90) * (Math.PI / 180);

  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);

  const largeArcFlag = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

export default function VolvelleWheelPage() {
  const TOTAL_SLICES = WheelData.SLICES.length; // 7
  const SLICE_ANGLE = 360 / TOTAL_SLICES; // 51.42857 degrees

  // Top cover wheel rotation angle in degrees
  const [rotation, setRotation] = useState<number>(0);
  const [activeSliceIndex, setActiveSliceIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // References for drag calculation
  const wheelRef = useRef<HTMLDivElement>(null);
  const startAngleRef = useRef<number>(0);
  const startRotationRef = useRef<number>(0);
  const lastSoundSliceRef = useRef<number>(0);

  // Snap to slice rotation
  const snapToSlice = (rot: number) => {
    const sliceIndex = Math.round(rot / SLICE_ANGLE);
    const targetRot = sliceIndex * SLICE_ANGLE;
    setRotation(targetRot);
    const index = ((sliceIndex % TOTAL_SLICES) + TOTAL_SLICES) % TOTAL_SLICES;
    setActiveSliceIndex(index);
    if (soundEnabled) playClickSound();
  };

  // Rotate to specific slice by button click
  const rotateToSlice = (index: number) => {
    const currentSlice = Math.round(rotation / SLICE_ANGLE);
    const currentMod = ((currentSlice % TOTAL_SLICES) + TOTAL_SLICES) % TOTAL_SLICES;
    let diff = index - currentMod;
    if (diff > TOTAL_SLICES / 2) diff -= TOTAL_SLICES;
    if (diff < -TOTAL_SLICES / 2) diff += TOTAL_SLICES;

    const targetRotation = (currentSlice + diff) * SLICE_ANGLE;
    setRotation(targetRotation);
    setActiveSliceIndex(index);
    if (soundEnabled) playClickSound();
  };

  // Drag Math via Math.atan2(y, x)
  const getPointerAngle = (clientX: number, clientY: number) => {
    if (!wheelRef.current) return 0;
    const rect = wheelRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    const angle = getPointerAngle(e.clientX, e.clientY);
    startAngleRef.current = angle;
    startRotationRef.current = rotation;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const currentAngle = getPointerAngle(e.clientX, e.clientY);
    const delta = currentAngle - startAngleRef.current;
    const newRot = startRotationRef.current + delta;
    setRotation(newRot);

    const currentSliceIndex = Math.round(newRot / SLICE_ANGLE);
    if (currentSliceIndex !== lastSoundSliceRef.current) {
      lastSoundSliceRef.current = currentSliceIndex;
      if (soundEnabled) playClickSound();
    }
    const idx = ((currentSliceIndex % TOTAL_SLICES) + TOTAL_SLICES) % TOTAL_SLICES;
    setActiveSliceIndex(idx);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    snapToSlice(rotation);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const activeSlice = WheelData.SLICES[activeSliceIndex];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      {/* 1. Header Navigation */}
      <header className="bg-slate-800/90 border-b border-slate-700/80 p-4 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link 
            href="/game" 
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition bg-slate-700/50 hover:bg-slate-700 px-3 py-1.5 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" /> แดชบอร์ดเกม
          </Link>
          
          <div className="text-center">
            <h1 className="text-sm md:text-base font-bold text-cyan-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> สื่อวงล้อหมุนให้ความรู้สุขภาพ 2 ชั้น
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              จำลองนวัตกรรม "วงล้อนับคาร์บ: เบาหวานระยะสงบ ชีวิตกลับมาคุมได้" รพ.คลองหาด
            </p>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition"
            title={soundEnabled ? 'ปิดเสียงประกอบ' : 'เปิดเสียงประกอบ'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </header>

      {/* 2. Interactive Arena */}
      <main className="max-w-4xl mx-auto px-4 py-6 flex-1 flex flex-col items-center justify-center w-full">
        {/* Banner Slogan */}
        <div className="text-center mb-4 max-w-lg">
          <span className="bg-cyan-500/20 text-cyan-300 text-[11px] font-bold px-3 py-1 rounded-full border border-cyan-500/30 uppercase tracking-wider inline-block mb-1.5">
            Volvelle Dual Disc Simulator
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-white">
            เบาหวานระยะสงบ ชีวิตกลับมาคุมได้
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            หมุนวงล้อชั้นบนหรือคลิกหมวดหมู่ เพื่อส่องดูสัดส่วนอาหารและเทคนิคคุมคาร์บ 2:1:1
          </p>
        </div>

        {/* Dual-Disc Volvelle Wheel Container */}
        <div className="relative my-4 flex items-center justify-center">
          {/* External Instruction Glow Pointer */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1 rounded-full shadow-lg border border-amber-300 flex items-center gap-1 z-30 animate-bounce">
            <span>หมุนวงล้อส่องเนื้อหา ➔</span>
          </div>

          {/* SVG Volvelle Component (500x500 Canvas) */}
          <div
            ref={wheelRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] relative rounded-full shadow-2xl touch-none select-none cursor-grab active:cursor-grabbing border-4 border-cyan-400/30 bg-slate-950"
            style={{ touchAction: 'none' }}
          >
            <svg
              viewBox="0 0 500 500"
              className="w-full h-full rounded-full overflow-hidden shadow-2xl"
            >
              <defs>
                {/* SVG Mask for Top Cover Cutout Window (Sector Die-cut Cutout) */}
                <mask id="volvelleCutoutMask">
                  <rect x="0" y="0" width="500" height="500" fill="white" />
                  <path
                    d={makePieSectorPath(250, 250, 240, -SLICE_ANGLE / 2, SLICE_ANGLE / 2)}
                    fill="black"
                  />
                </mask>

                {/* Drop shadow filter for pin */}
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* ==================================================== */}
              {/* LAYER 1: BASE WHEEL (วงล้อชั้นล่าง / แผ่นฐานหลากสี 7 ช่อง) */}
              {/* ==================================================== */}
              <g id="base-wheel" transform={`rotate(${rotation}, 250, 250)`}>
                {WheelData.SLICES.map((slice, index) => {
                  const startDeg = index * SLICE_ANGLE - SLICE_ANGLE / 2;
                  const endDeg = startDeg + SLICE_ANGLE;
                  const midDeg = index * SLICE_ANGLE;
                  const midRad = (midDeg - 90) * (Math.PI / 180);

                  const textR = 175;
                  const tx = 250 + textR * Math.cos(midRad);
                  const ty = 250 + textR * Math.sin(midRad);

                  return (
                    <g key={slice.id}>
                      <path
                        d={makePieSectorPath(250, 250, 245, startDeg, endDeg)}
                        fill={slice.bgColor}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />

                      <line
                        x1="250"
                        y1="250"
                        x2={250 + 245 * Math.cos((startDeg - 90) * (Math.PI / 180))}
                        y2={250 + 245 * Math.sin((startDeg - 90) * (Math.PI / 180))}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        opacity="0.6"
                      />

                      <g transform={`translate(${tx}, ${ty}) rotate(${midDeg}, 0, 0)`}>
                        <text
                          x="0"
                          y="-10"
                          textAnchor="middle"
                          fill={slice.textColor}
                          fontSize="22"
                          fontWeight="bold"
                        >
                          {slice.icon}
                        </text>
                        <text
                          x="0"
                          y="14"
                          textAnchor="middle"
                          fill={slice.textColor}
                          fontSize="11"
                          fontWeight="bold"
                          className="font-sans"
                        >
                          {slice.categoryName}
                        </text>
                      </g>
                    </g>
                  );
                })}

                <circle cx="250" cy="250" r="245" fill="none" stroke="#38bdf8" strokeWidth="4" />
              </g>

              {/* ==================================================== */}
              {/* LAYER 2: TOP COVER DISC (วงล้อชั้นบน / วงกลมสีฟ้ามีช่องเจาะ) */}
              {/* ==================================================== */}
              <g id="top-cover-disc" mask="url(#volvelleCutoutMask)">
                <circle cx="250" cy="250" r="242" fill="#38bdf8" />
                <circle cx="250" cy="250" r="242" fill="url(#skyGradient)" opacity="0.9" />

                <path
                  id="headerArcPath"
                  d="M 60,250 A 190,190 0 0,1 440,250"
                  fill="none"
                />
                <text fill="#0f172a" fontSize="16" fontWeight="bold" letterSpacing="1">
                  <textPath href="#headerArcPath" startOffset="50%" textAnchor="middle">
                    เบาหวานระยะสงบ ชีวิตกลับมาคุมได้
                  </textPath>
                </text>

                <text x="250" y="115" textAnchor="middle" fill="#0369a1" fontSize="12" fontWeight="bold">
                  ด้วยการกินเป็น ขยับกาย และติดตามสม่ำเสมอ
                </text>

                <g transform="translate(140, 140)">
                  <rect x="0" y="0" width="100" height="70" rx="16" fill="#ffffff" opacity="0.9" />
                  <text x="50" y="24" textAnchor="middle" fill="#0284c7" fontSize="11" fontWeight="extrabold">
                    หลัก 2:1:1
                  </text>
                  <text x="50" y="44" textAnchor="middle" fill="#e11d48" fontSize="16" fontWeight="extrabold">
                    กินอิ่ม
                  </text>
                  <text x="50" y="60" textAnchor="middle" fill="#0f172a" fontSize="10">
                    เน้นผักใบเขียว
                  </text>
                </g>

                <g transform="translate(260, 140)">
                  <rect x="0" y="0" width="100" height="70" rx="16" fill="#ffffff" opacity="0.9" />
                  <text x="50" y="28" textAnchor="middle" fill="#d97706" fontSize="13" fontWeight="bold">
                    1-2 ทัพพี
                  </text>
                  <text x="50" y="46" textAnchor="middle" fill="#475569" fontSize="10">
                    ต่อมื้ออาหาร
                  </text>
                  <text x="50" y="62" textAnchor="middle" fill="#dc2626" fontSize="9" fontWeight="bold">
                    เลี่ยง ขนมปัง/หวาน
                  </text>
                </g>

                <text x="250" y="430" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">
                  โรงพยาบาลคลองหาด • เครือข่าย NCDs
                </text>
              </g>

              <defs>
                <linearGradient id="skyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7dd3fc" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* LAYER 3: CUTOUT WINDOW DASHED BORDER */}
              <g id="cutout-window-lines">
                <path
                  d={makePieSectorPath(250, 250, 242, -SLICE_ANGLE / 2, SLICE_ANGLE / 2)}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
              </g>

              {/* LAYER 4: CENTER PIN */}
              <circle cx="250" cy="250" r="18" fill="#1e293b" stroke="#f8fafc" strokeWidth="3" filter="url(#shadow)" />
              <circle cx="250" cy="250" r="6" fill="#94a3b8" />
            </svg>
          </div>
        </div>

        {/* 3. Interactive Slice Category Selector Buttons */}
        <div className="w-full max-w-lg mt-2 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>คลิกเลือกหมวดหมู่ด่วน:</span>
            <span className="text-cyan-400 font-bold">หมวดปัจจุบัน: {activeSlice.categoryName}</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {WheelData.SLICES.map((slice) => {
              const isSelected = activeSliceIndex === slice.id;
              return (
                <button
                  key={slice.id}
                  onClick={() => rotateToSlice(slice.id)}
                  className={`py-2 px-1 rounded-xl text-center transition flex flex-col items-center justify-center gap-0.5 border ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-md scale-105'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-base">{slice.icon}</span>
                  <span className="text-[10px] truncate max-w-full">{slice.categoryName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Active Content Drawer / Modal Card */}
        <div className="w-full max-w-lg mt-5 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeSlice.icon}</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">เนื้อหาในช่องเจาะที่กำลังเปิด</span>
                <h3 className="text-base font-bold text-white leading-tight">{activeSlice.title}</h3>
              </div>
            </div>

            <button
              onClick={() => setShowDetailModal(true)}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" /> รายละเอียดเต็ม
            </button>
          </div>

          <ul className="space-y-2 mb-3">
            {activeSlice.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-200 bg-slate-900/60 p-2 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-300 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{activeSlice.carbTip}</span>
          </div>
        </div>
      </main>

      {/* 5. Detail Modal Popup */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{activeSlice.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{activeSlice.title}</h3>
                  <span className="text-xs text-cyan-400 font-semibold">เครือข่ายบริการสุขภาพอำเภอคลองหาด</span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-white p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1">
                <Utensils className="w-4 h-4" />คำแนะนำทางโภชนาการคลินิก:
              </h4>
              <p>{activeSlice.detailDescription}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200">รายการเมนู/คำแนะนำในหมวดนี้:</h4>
              {activeSlice.items.map((item, idx) => (
                <div key={idx} className="text-xs text-slate-300 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                  • {item}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-3 rounded-2xl transition shadow-lg"
            >
              เข้าใจแล้ว ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
