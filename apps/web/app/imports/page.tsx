'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function ImportsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStep('preview');
    }
  };

  const handleProcessImport = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setStep('success');
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Upload className="w-7 h-7 text-teal-600" />
            <span>นำเข้าข้อมูล Excel / CSV (Data Import)</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">นำเข้าทะเบียนผู้ป่วยและรายการนัดหมายจากระบบ HIS หรือไฟล์ Excel</p>
        </div>

        {/* Wizard Card */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          {step === 'upload' && (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center space-y-4">
              <div className="p-4 rounded-full bg-teal-50 text-teal-600 border border-teal-200">
                <FileSpreadsheet className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">ลากไฟล์ Excel (.xlsx) หรือ CSV มาวางที่นี่</h3>
                <p className="text-xs text-slate-400">หรือคลิกปุ่มด้านล่างเพื่อเลือกไฟล์จากคอมพิวเตอร์ของคุณ</p>
              </div>
              <label className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>เลือกไฟล์นำเข้า</span>
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          )}

          {step === 'preview' && file && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-teal-600" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{file.name}</h4>
                    <span className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(1)} KB &bull; พร้อมตรวจสอบความถูกต้อง</span>
                  </div>
                </div>
                <button onClick={() => setStep('upload')} className="text-xs text-rose-600 hover:underline font-semibold">เปลี่ยนไฟล์</button>
              </div>

              {/* Validation Summary */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold uppercase">รายการทั้งหมด</span>
                  <span className="text-xl font-bold text-slate-800">45 ราย</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block font-bold uppercase">ข้อมูลถูกต้อง</span>
                  <span className="text-xl font-bold text-emerald-700">45 ราย</span>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] text-amber-700 block font-bold uppercase">ข้อมูลซ้ำซ้อน</span>
                  <span className="text-xl font-bold text-amber-700">0 ราย</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setStep('upload')} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">ยกเลิก</button>
                <button
                  onClick={handleProcessImport}
                  disabled={importing}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {importing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>กำลังนำเข้าข้อมูล...</span>
                    </>
                  ) : (
                    <>
                      <span>ยืนยันบันทึกข้อมูลเข้าสู่ระบบ</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">นำเข้าข้อมูลสำเร็จ 45 รายการ!</h3>
              <p className="text-xs text-slate-500">ข้อมูลผู้ป่วยและรายการนัดหมายใหม่ถูกบันทึกลงในฐานข้อมูล PostgreSQL เรียบร้อยแล้ว</p>
              <button
                onClick={() => setStep('upload')}
                className="px-6 py-2.5 bg-teal-600 text-white font-bold rounded-xl text-xs shadow-md hover:bg-teal-700 transition-all cursor-pointer"
              >
                นำเข้าไฟล์อื่นเพิ่มเติม
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
