'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Phone,
  Heart,
  Calendar,
  Clock,
  Activity,
  Stethoscope,
  MessageSquare,
  PhoneCall,
  FileText,
  RefreshCw,
  Database,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Pill,
  Home,
  ClipboardList,
  Eye,
  EyeOff,
} from 'lucide-react';
import { maskName, maskPhone, maskCid } from '@/lib/pdpaMasking';

interface PatientProfile {
  hn: string;
  name: string;
  age?: number;
  gender: string;
  sex?: string;
  phone: string;
  cid?: string;
  diseases: string[];
  status: string;
  lastVisit?: string;
  caregiver?: string;
  contactConsent: boolean;
  address?: string;
}

interface MedicalVisit {
  vn: string;
  visitDate: string;
  visitTime: string;
  bp: string;
  fbs: string;
  bw: string;
  bmi: string;
  pulse: string;
  primaryDiagnosisICD10: string;
}

interface TimelineEvent {
  id: string;
  type: 'visit' | 'appointment' | 'followup' | 'reply' | 'education';
  title: string;
  subtitle: string;
  date: string;
  icon: string;
  color: string;
}

export default function PatientProfilePage() {
  const params = useParams();
  const hn = params?.hn as string;
  const rawHn = hn ? hn.replace(/^HN-?/i, '') : '';

  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [history, setHistory] = useState<MedicalVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showPdpaData, setShowPdpaData] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'vitals' | 'appointments' | 'contact'>('timeline');

  // Fetch patient info from HOSxP patients list
  const fetchPatient = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hosxp/patients?search=${encodeURIComponent(rawHn)}&limit=1`);
      const data = await res.json();
      if (data.success && data.patients?.length > 0) {
        setPatient(data.patients[0]);
      }
    } catch (err) {
      console.error('❌ Failed to fetch patient:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch medical history from HOSxP
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/hosxp/patients/${rawHn}/history`);
      const data = await res.json();
      if (data.success && Array.isArray(data.history)) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error('❌ Failed to fetch history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (rawHn) {
      fetchPatient();
      fetchHistory();
    }
  }, [rawHn]);

  // Build timeline from history
  const timeline: TimelineEvent[] = history.map((h, idx) => ({
    id: `visit-${idx}`,
    type: 'visit',
    title: `ตรวจรักษา: ${h.primaryDiagnosisICD10}`,
    subtitle: `BP: ${h.bp} | FBS: ${h.fbs} | น้ำหนัก: ${h.bw}`,
    date: h.visitDate,
    icon: '🏥',
    color: 'border-teal-400 bg-teal-50',
  }));

  // Get latest vital signs
  const latestVitals = history[0];

  // Determine risk level based on latest FBS
  const fbsNum = latestVitals?.fbs ? parseFloat(latestVitals.fbs) : null;
  const riskLevel = fbsNum
    ? fbsNum >= 200 ? 'red' : fbsNum >= 126 ? 'yellow' : 'green'
    : 'unknown';

  const riskBadge = {
    red: { label: '🔴 เสี่ยงสูง (FBS สูง)', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    yellow: { label: '🟡 ต้องติดตาม (FBS ปานกลาง)', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    green: { label: '🟢 สถานะดี (FBS ควบคุมได้)', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    unknown: { label: '⚪ ไม่มีข้อมูลล่าสุด', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  }[riskLevel];

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/patients" className="hover:text-teal-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> ทะเบียนผู้ป่วย
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{hn || rawHn}</span>
        </div>

        {/* Patient Profile Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-700 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                  {patient?.sex === 'หญิง' || patient?.gender === 'หญิง' ? '👩‍⚕️' : '👨‍⚕️'}
                </div>
                <div>
                  {loading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-6 w-48 bg-white/30 rounded" />
                      <div className="h-4 w-32 bg-white/20 rounded" />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-extrabold">
                        {showPdpaData ? (patient?.name || 'ไม่พบข้อมูล') : maskName(patient?.name || '')}
                      </h1>
                      <div className="flex items-center gap-2 mt-1 text-teal-100 text-xs font-semibold">
                        <Database className="w-3.5 h-3.5" />
                        <span className="font-mono text-sm">{hn || `HN-${rawHn}`}</span>
                        <span>•</span>
                        <span>{patient?.sex || patient?.gender || 'ไม่ระบุ'}</span>
                        {patient?.age && <><span>•</span><span>อายุ {patient.age} ปี</span></>}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 self-start">
                <button
                  onClick={() => setShowPdpaData(!showPdpaData)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    showPdpaData
                      ? 'bg-amber-100/20 text-amber-200 border-amber-300/40 hover:bg-amber-100/30'
                      : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                  }`}
                >
                  {showPdpaData ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showPdpaData ? 'ซ่อนข้อมูล PDPA' : 'แสดงข้อมูลจริง'}
                </button>

                <div className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border ${riskBadge.color}`}>
                  {riskBadge.label}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100 border-b border-slate-100">
            {[
              {
                icon: <Phone className="w-4 h-4 text-teal-500" />,
                label: 'เบอร์โทรศัพท์',
                value: loading ? '...' : (showPdpaData ? (patient?.phone || '-') : maskPhone(patient?.phone || '')),
              },
              {
                icon: <Heart className="w-4 h-4 text-rose-500" />,
                label: 'กลุ่มโรค NCDs',
                value: loading ? '...' : (patient?.diseases?.join(', ') || 'NCDs'),
              },
              {
                icon: <FileText className="w-4 h-4 text-slate-400" />,
                label: 'เลขบัตรประชาชน',
                value: loading ? '...' : (showPdpaData ? (patient?.cid || '-') : maskCid(patient?.cid)),
              },
              {
                icon: <Activity className="w-4 h-4 text-emerald-500" />,
                label: 'จำนวนการเข้ารับบริการ',
                value: loadingHistory ? '...' : `${history.length} ครั้ง`,
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{item.label}</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-3 bg-slate-50/50 flex items-center gap-2 flex-wrap border-b border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mr-1">การดำเนินการ:</span>
            <Link
              href="/follow-ups"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-lg border border-slate-200 text-xs font-semibold transition-all shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5 text-teal-500" /> สร้างงานติดตาม
            </Link>
            <Link
              href="/appointments"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg border border-slate-200 text-xs font-semibold transition-all shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-500" /> สร้างรายการนัดหมาย
            </Link>
            <Link
              href="/reply"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg border border-slate-200 text-xs font-semibold transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> ส่งข้อความ LINE
            </Link>
            <Link
              href="/education"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-lg border border-slate-200 text-xs font-semibold transition-all shadow-sm"
            >
              <ClipboardList className="w-3.5 h-3.5 text-purple-500" /> บันทึกคำแนะนำ
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-sm gap-1">
          {[
            { id: 'timeline', label: 'Patient Timeline', icon: '📋' },
            { id: 'vitals', label: 'ค่าตรวจสุขภาพ', icon: '📊' },
            { id: 'appointments', label: 'นัดหมาย', icon: '📅' },
            { id: 'contact', label: 'การติดต่อ', icon: '📞' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">

          {/* === TIMELINE TAB === */}
          {activeTab === 'timeline' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-teal-600" />
                  <span>Patient Timeline — ประวัติทั้งหมด</span>
                </h2>
                <button
                  onClick={() => { fetchPatient(); fetchHistory(); }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-teal-600 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> รีเฟรช
                </button>
              </div>

              {loadingHistory ? (
                <div className="py-10 text-center text-slate-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />
                  <p className="text-xs">กำลังดึง Timeline จาก HOSxP...</p>
                </div>
              ) : timeline.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">ไม่พบประวัติการเข้ารับบริการในระบบ HOSxP</div>
              ) : (
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
                  <div className="space-y-4 pl-14">
                    {timeline.map((event, idx) => (
                      <div key={event.id} className="relative">
                        <div className="absolute -left-8 w-8 h-8 rounded-full bg-white border-2 border-teal-400 flex items-center justify-center text-sm shadow-sm">
                          {event.icon}
                        </div>
                        <div className={`p-4 rounded-xl border ${event.color} shadow-xs hover:shadow-sm transition-all`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-xs font-extrabold text-slate-800">{event.title}</div>
                              <div className="text-[11px] text-slate-500 mt-1">{event.subtitle}</div>
                            </div>
                            <span className="text-[10px] text-teal-600 font-semibold whitespace-nowrap bg-white px-2 py-0.5 rounded border border-teal-200">
                              {event.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === VITALS TAB === */}
          {activeTab === 'vitals' && (
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  <span>ค่าตรวจสุขภาพย้อนหลัง (HOSxP ovst / opdscreen / vn_stat)</span>
                </h2>
              </div>

              {/* Latest Vitals Summary */}
              {latestVitals && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      label: 'ความดันโลหิต (BP)',
                      value: latestVitals.bp,
                      icon: <Activity className="w-4 h-4 text-rose-500" />,
                      color: 'border-rose-200 bg-rose-50',
                    },
                    {
                      label: 'น้ำตาลในเลือด (FBS)',
                      value: latestVitals.fbs,
                      icon: <TrendingDown className="w-4 h-4 text-amber-500" />,
                      color: fbsNum && fbsNum >= 126 ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50',
                    },
                    {
                      label: 'น้ำหนัก / BMI',
                      value: `${latestVitals.bw} | BMI: ${latestVitals.bmi}`,
                      icon: <User className="w-4 h-4 text-blue-500" />,
                      color: 'border-blue-200 bg-blue-50',
                    },
                    {
                      label: 'ชีพจร (Pulse)',
                      value: latestVitals.pulse,
                      icon: <Heart className="w-4 h-4 text-pink-500" />,
                      color: 'border-pink-200 bg-pink-50',
                    },
                  ].map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${item.color} flex flex-col gap-2`}>
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{item.label}</span>
                      </div>
                      <div className="text-lg font-extrabold text-slate-800">{item.value}</div>
                      <div className="text-[10px] text-slate-400">ข้อมูลล่าสุด: {latestVitals.visitDate}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* History Table */}
              {loadingHistory ? (
                <div className="py-8 text-center text-slate-500">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-600" />
                  <p className="text-xs">กำลังดึงข้อมูล...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 font-semibold">วันที่ / VN</th>
                        <th className="pb-3 font-semibold">ความดัน (BP)</th>
                        <th className="pb-3 font-semibold">น้ำตาล (FBS)</th>
                        <th className="pb-3 font-semibold">น้ำหนัก / BMI</th>
                        <th className="pb-3 font-semibold">วินิจฉัย ICD-10</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {history.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400">
                            ไม่พบประวัติการรักษาใน HOSxP
                          </td>
                        </tr>
                      ) : (
                        history.map((h, idx) => {
                          const hFbs = parseFloat(h.fbs);
                          const fbsColor = hFbs >= 200 ? 'text-rose-600 font-extrabold' : hFbs >= 126 ? 'text-amber-600 font-bold' : 'text-emerald-600 font-semibold';
                          return (
                            <tr key={idx} className="hover:bg-slate-50 transition-all">
                              <td className="py-3">
                                <span className="font-bold text-slate-800">{h.visitDate}</span>
                                <span className="block text-[10px] text-slate-400 font-mono">{h.visitTime} | VN: {h.vn}</span>
                              </td>
                              <td className="py-3 font-semibold text-slate-700">{h.bp}</td>
                              <td className={`py-3 ${fbsColor}`}>{h.fbs}</td>
                              <td className="py-3 text-slate-600">{h.bw} <span className="text-slate-400">(BMI: {h.bmi})</span></td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-md font-bold text-[10px]">
                                  {h.primaryDiagnosisICD10}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* === APPOINTMENTS TAB === */}
          {activeTab === 'appointments' && (
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <span>รายการนัดหมายของผู้ป่วย</span>
                </h2>
                <Link
                  href="/appointments"
                  className="text-xs text-teal-600 hover:underline font-semibold flex items-center gap-0.5"
                >
                  ดูรายการนัดทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="text-center py-10 text-slate-400 text-xs">
                <Calendar className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                <p className="font-semibold text-slate-500">ดูรายการนัดหมายจากหน้าหลัก</p>
                <p className="mt-1">ระบบดึงนัดหมายจาก HOSxP ผ่านหน้าจัดการนัดหมาย</p>
                <Link
                  href={`/appointments?search=${rawHn}`}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  ค้นหานัดหมายสำหรับ HN นี้
                </Link>
              </div>
            </div>
          )}

          {/* === CONTACT TAB === */}
          {activeTab === 'contact' && (
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-teal-600" />
                  <span>บันทึกการติดต่อและ Follow-up</span>
                </h2>
              </div>

              {/* Contact Info Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-teal-500" /> ข้อมูลการติดต่อ
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">ชื่อ-นามสกุล:</span>
                      <span className="font-bold text-slate-800">
                        {loading ? '...' : (showPdpaData ? (patient?.name || '-') : maskName(patient?.name || ''))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">เบอร์โทรศัพท์:</span>
                      <a
                        href={`tel:${patient?.phone}`}
                        className="font-bold text-teal-600 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        {loading ? '...' : (showPdpaData ? (patient?.phone || '-') : maskPhone(patient?.phone || ''))}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">การยินยอมติดต่อ:</span>
                      <span className={`font-bold text-xs px-2 py-0.5 rounded-full border ${patient?.contactConsent ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                        {patient?.contactConsent ? '✓ ยินยอม' : '✕ ไม่ยินยอม'}
                      </span>
                    </div>
                    {patient?.caregiver && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">ผู้ดูแล/ญาติ:</span>
                        <span className="font-semibold text-slate-700">{patient.caregiver}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-500" /> ช่องทางการสื่อสาร
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/reply"
                      className="flex items-center gap-2 p-3 bg-white border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-all"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="font-bold">ส่งข้อความ LINE OA</div>
                        <div className="text-[10px] text-slate-400 font-normal">ส่งข้อความถึงผู้ป่วยโดยตรงผ่าน LINE</div>
                      </div>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </Link>
                    <a
                      href={`tel:${patient?.phone}`}
                      className="flex items-center gap-2 p-3 bg-white border border-teal-200 rounded-xl text-xs font-semibold text-teal-700 hover:bg-teal-50 transition-all"
                    >
                      <PhoneCall className="w-4 h-4 text-teal-500" />
                      <div>
                        <div className="font-bold">โทรติดต่อผู้ป่วย</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {loading ? '...' : (showPdpaData ? (patient?.phone || '-') : maskPhone(patient?.phone || ''))}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Follow-up Quick Actions */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 space-y-3">
                <h3 className="text-xs font-extrabold text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> สร้างงานติดตามด่วนสำหรับผู้ป่วยรายนี้
                </h3>
                <Link
                  href="/follow-ups"
                  className="flex items-center gap-2 text-xs font-bold text-amber-700 hover:underline"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> ไปยังหน้างานติดตามผู้ป่วย NCDs <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
