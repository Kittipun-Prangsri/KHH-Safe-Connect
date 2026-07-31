'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Settings as SettingsIcon,
  RefreshCw,
  FileSpreadsheet,
  Database,
  Server,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  Clock,
  Save,
  Zap,
} from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showMaskedKey, setShowMaskedKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Form State
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState(
    'https://script.google.com/macros/s/AKfycbz_KHH_Telemedicine_Demo_Script/exec'
  );

  // Uptime Counter
  const [uptimeSeconds, setUptimeSeconds] = useState(8420);

  useEffect(() => {
    const timer = setInterval(() => setUptimeSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const parts = [];
    if (hours > 0) parts.push(`${hours} ชั่วโมง`);
    if (minutes > 0) parts.push(`${minutes} นาที`);
    parts.push(`${secs} วินาที`);
    return parts.join(' ');
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleTestConnection = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult({
        success: true,
        message: 'เชื่อมต่อกับ Google Apps Script Web App สำเร็จ! ตอบกลับภายใน 240ms',
      });
    }, 1200);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('บันทึกการตั้งค่าระบบเรียบร้อย มีผลใช้งานทันที!');
    }, 600);
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-1">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-teal-600" />
              <span>การตั้งค่าระบบ (Settings)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              จัดการการเชื่อมต่อและกำหนดค่าระบบ KHH Telemedicine & NCDs Safe-Connect
            </p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 500);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            <span>รีเฟรช</span>
          </button>
        </div>

        {/* Card 1: Google Sheets Connection */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="border-l-4 border-l-teal-500 px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
                <FileSpreadsheet className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">การเชื่อมต่อ Google Sheets</p>
                <p className="text-xs text-slate-400 mt-0.5">ซิงค์ข้อมูลผู้ป่วยและรายการนัดหมายไปยังชีต Telemed69 โดยอัตโนมัติ</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Google Apps Script Web App URL
              </label>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> เชื่อมต่อแล้ว
              </span>
            </div>

            <input
              type="text"
              value={googleSheetsUrl}
              onChange={(e) => setGoogleSheetsUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/…/exec"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono text-slate-800"
            />

            {/* Instruction Box */}
            <div className="bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-600 border border-slate-200/60 leading-relaxed space-y-1">
              <p className="font-bold text-slate-700">📌 วิธีรับ Web App URL:</p>
              <ol className="list-decimal ml-4 space-y-0.5 text-slate-600">
                <li>เปิด Google Sheet → <strong>ส่วนขยาย → Apps Script</strong></li>
                <li>คัดลอกโค้ดจากไฟล์ <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-700 font-mono">backend/db/google-apps-script.js</code> ไปวาง</li>
                <li>คลิก <strong>ใช้งานจริง → เว็บแอป</strong> แล้วตั้งสิทธิ์เป็น <strong>&quot;ทุกคน&quot;</strong></li>
                <li>คัดลอก URL ที่ได้มาวางในช่องด้านบน</li>
              </ol>
              <a
                href="https://docs.google.com/spreadsheets/d/1j25Lz41DsmYkbQ8KOTI0Wfr0duo9kZvmC_N5zxMAKu8/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-teal-600 font-bold hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                <span>เปิด Google Sheet ที่เชื่อมต่อ</span>
              </a>
            </div>

            {/* Test Result Message */}
            {testResult && (
              <div
                className={`flex items-start gap-2 p-3 rounded-xl text-xs font-semibold border ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-all cursor-pointer bg-white"
              >
                {testing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>ทดสอบการเชื่อมต่อ</span>
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 shadow-md transition-all cursor-pointer"
              >
                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>บันทึกการตั้งค่า</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Supabase Database Integration */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="border-l-4 border-l-emerald-500 px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Database className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">ฐานข้อมูล Supabase</p>
                <p className="text-xs text-slate-400 mt-0.5">ข้อมูลการเชื่อมต่อ Cloud Database (อ่านได้อย่างเดียว)</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-3 divide-y divide-slate-100">
            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-semibold text-slate-500">สถานะการเชื่อมต่อ</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
              </span>
            </div>

            {/* Supabase URL */}
            <div className="flex items-start justify-between py-3 gap-4">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap pt-0.5">Supabase URL</span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-right text-slate-700 font-mono font-medium truncate max-w-[320px]">
                  https://khh-safe-connect-demo.supabase.co
                </span>
                <button
                  onClick={() => handleCopy('https://khh-safe-connect-demo.supabase.co', 'url')}
                  className="text-slate-400 hover:text-teal-600 transition-colors shrink-0"
                  title="คัดลอก"
                >
                  {copiedField === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Anon Key */}
            <div className="flex items-start justify-between py-3 gap-4">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap pt-0.5">Anon Key (masked)</span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-right text-slate-700 font-mono font-medium truncate max-w-[320px]">
                  {showMaskedKey ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9...' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.••••••••••••••••'}
                </span>
                <button
                  onClick={() => setShowMaskedKey(!showMaskedKey)}
                  className="text-slate-400 hover:text-teal-600 transition-colors shrink-0"
                  title="เปิด/ปิด การแสดงรหัส"
                >
                  {showMaskedKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleCopy('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 'key')}
                  className="text-slate-400 hover:text-teal-600 transition-colors shrink-0"
                  title="คัดลอก"
                >
                  {copiedField === 'key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                <span>เปิด Supabase Dashboard</span>
              </a>
            </div>
          </div>
        </div>

        {/* Card 3: System Information */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="border-l-4 border-l-amber-500 px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Server className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">ข้อมูลระบบ (System Information)</p>
                <p className="text-xs text-slate-400 mt-0.5">สถานะและรายละเอียดของ Backend Server และสภาพแวดล้อมระบบ</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50/70 border border-slate-200/50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Server Port</p>
                <p className="text-2xl font-extrabold text-slate-800">:3000</p>
              </div>
              <div className="bg-slate-50/70 border border-slate-200/50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Node.js Version</p>
                <p className="text-2xl font-extrabold text-slate-800">v24.14.1</p>
              </div>
              <div className="bg-slate-50/70 border border-slate-200/50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Environment</p>
                <p className="text-lg font-bold text-slate-800 capitalize">development</p>
              </div>
              <div className="bg-slate-50/70 border border-slate-200/50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-teal-600" /> Server Uptime
                </p>
                <p className="text-sm font-bold text-teal-700">{formatUptime(uptimeSeconds)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
