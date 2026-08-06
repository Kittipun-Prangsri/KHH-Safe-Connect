'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, CheckCircle2, QrCode, ArrowLeft, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

export default function ScanHnPage() {
  const [scannedHn, setScannedHn] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successHn, setSuccessHn] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Start Camera Stream for Barcode Scanner
  const startCamera = async () => {
    setErrorMsg('');
    setIsScanning(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        setErrorMsg('⚠️ อุปกรณ์นี้ไม่รองรับการเปิดกล้องผ่านเบราว์เซอร์');
        setIsScanning(false);
      }
    } catch (err: any) {
      console.warn('⚠️ Camera access error:', err);
      setErrorMsg('⚠️ ไม่สามารถเปิดกล้องได้ โปรดอนุญาตการเข้าถึงกล้อง หรือพิมพ์หมายเลข HN ด้านล่าง');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleRegisterHn = (hnValue: string) => {
    if (!hnValue || hnValue.trim().length < 3) {
      setErrorMsg('กรุณาระบุหมายเลข HN หรือเลขบัตรประชาชนให้ถูกต้อง');
      return;
    }

    const cleanHn = hnValue.trim().toUpperCase();
    const formattedHn = cleanHn.startsWith('HN-') ? cleanHn : `HN-${cleanHn}`;
    setSuccessHn(formattedHn);
    stopCamera();

    // Redirect to LINE OA DeepLink with 1-tap message prefilled
    setTimeout(() => {
      const lineOaDeepLink = `https://line.me/R/oaMessage/@khhsafeconnect/?${encodeURIComponent(formattedHn)}`;
      window.location.href = lineOaDeepLink;
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-between p-4 sm:p-6 font-sans">
      {/* Header Bar */}
      <div className="w-full max-w-md flex items-center justify-between py-3 border-b border-slate-800">
        <button
          onClick={() => (window.location.href = 'https://line.me/R/ti/p/@khhsafeconnect')}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปยัง LINE</span>
        </button>
        <span className="text-xs font-extrabold text-teal-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> KHH Safe-Connect Scanner
        </span>
      </div>

      {/* Main Content Body */}
      <div className="w-full max-w-md my-auto space-y-5">
        {/* Title Banner */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-2">
            <QrCode className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            สแกนบาร์โค้ดใบนัด HOSxP
          </h1>
          <p className="text-xs text-slate-400">
            ส่องกล้องไปที่บาร์โค้ดมุมใบนัด หรือพิมพ์ HN เพื่อลงทะเบียนใน LINE ทันที
          </p>
        </div>

        {/* Camera Scanner Viewfinder */}
        {!successHn ? (
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-teal-500/30 shadow-2xl aspect-4/3 flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />

            {/* Viewfinder Target Box Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
              <div className="w-full h-32 border-2 border-dashed border-teal-400 rounded-2xl relative animate-pulse flex items-center justify-center bg-teal-500/5">
                <span className="text-[11px] font-bold text-teal-300 bg-slate-900/80 px-3 py-1 rounded-full border border-teal-500/30 shadow-sm">
                  วางบาร์โค้ดใบนัดให้อยู่ในกรอบนี้
                </span>
              </div>
            </div>

            {!isScanning && (
              <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-4 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-400" />
                <p className="text-xs text-slate-300">{errorMsg || 'กล้องไม่พร้อมใช้งาน'}</p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ลองเปิดกล้องอีกครั้ง</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Success Screen Card */
          <div className="p-6 rounded-3xl bg-teal-950/80 border-2 border-teal-500/40 text-center space-y-3 shadow-2xl animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto animate-bounce" />
            <h2 className="text-lg font-black text-white">สแกน/ระบุหมายเลขสำเร็จ!</h2>
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-teal-500/30 font-mono text-xl font-bold text-teal-300">
              {successHn}
            </div>
            <p className="text-xs text-teal-200 animate-pulse">
              กำลังนำท่านไปยัง LINE OA เพื่อลงทะเบียน 1-Tap...
            </p>
          </div>
        )}

        {/* Manual Fallback Input Card */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
          <label className="block text-xs font-bold text-slate-300">
            หรือ พิมพ์หมายเลข HN / เลขบัตรประชาชน ด้วยตนเอง:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ตัวอย่าง: HN-98302 หรือ 98302"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={() => handleRegisterHn(manualInput)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              ส่งข้อมูล
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-md text-center pt-3 border-t border-slate-800">
        <p className="text-[10px] text-slate-500">
          โรงพยาบาลคลองหาด (KHH Safe-Connect) • ระบบดูแลสุขภาพผู้ป่วย NCDs แบบครบวงจร
        </p>
      </div>
    </div>
  );
}
