'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Heart,
  ChevronRight,
  Activity,
  X,
  UserPlus,
  CheckCircle2,
  FileText,
  Clock,
  Stethoscope,
  Database,
  Calendar,
} from 'lucide-react';

interface Patient {
  id: string;
  hn: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  diseases: string[];
  status: 'active' | 'inactive' | 'transferred';
  lastVisit: string;
  caregiver?: string;
  contactConsent: boolean;
}

interface MedicalVisitHistory {
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

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Sample HOSxP Medical History for selected patient
  const [patientHistory, setPatientHistory] = useState<MedicalVisitHistory[]>([
    {
      vn: '690715200247',
      visitDate: '15 ก.ค. 2026',
      visitTime: '20:02 น.',
      bp: '108/60 mmHg',
      fbs: 'ไม่พบข้อมูล',
      bw: '54.5 kg',
      bmi: '22.1',
      pulse: '72 bpm',
      primaryDiagnosisICD10: 'F322 (Major depressive disorder)',
    },
    {
      vn: '690713090332',
      visitDate: '13 ก.ค. 2026',
      visitTime: '09:03 น.',
      bp: '117/67 mmHg',
      fbs: '112 mg/dL',
      bw: '54.8 kg',
      bmi: '22.2',
      pulse: '76 bpm',
      primaryDiagnosisICD10: 'F322 (Major depressive disorder)',
    },
    {
      vn: '690416074023',
      visitDate: '16 เม.ย. 2026',
      visitTime: '07:40 น.',
      bp: '113/71 mmHg',
      fbs: '105 mg/dL',
      bw: '55.0 kg',
      bmi: '22.3',
      pulse: '70 bpm',
      primaryDiagnosisICD10: 'F322 (Major depressive disorder)',
    },
  ]);

  // New patient state
  const [newPatient, setNewPatient] = useState({
    hn: '',
    name: '',
    age: '',
    gender: 'ชาย',
    phone: '',
    diseases: ['DM'],
    caregiver: '',
    contactConsent: true,
  });

  const [patients, setPatients] = useState<Patient[]>([
    { id: '1', hn: 'HN-98302', name: 'นายสมชาย ดีเลิศ', age: 58, gender: 'ชาย', phone: '081-234-5678', diseases: ['DM', 'HT'], status: 'active', lastVisit: '15 ก.ค. 2026', caregiver: 'นางสมศรี ดีเลิศ (ภรรยา)', contactConsent: true },
    { id: '2', hn: 'HN-12493', name: 'นางสาววิมล ศรีใส', age: 64, gender: 'หญิง', phone: '089-876-5432', diseases: ['CKD', 'HT'], status: 'active', lastVisit: '20 ก.ค. 2026', caregiver: 'นายวิชัย ศรีใส (บุตร)', contactConsent: true },
    { id: '3', hn: 'HN-85401', name: 'นายเกรียงไกร ลุยรบ', age: 71, gender: 'ชาย', phone: '086-555-4321', diseases: ['COPD'], status: 'active', lastVisit: '02 ก.ค. 2026', contactConsent: false },
    { id: '4', hn: 'HN-44102', name: 'นางปราณี มั่นคง', age: 52, gender: 'หญิง', phone: '092-333-1122', diseases: ['DM', 'HT', 'CKD'], status: 'active', lastVisit: '28 ก.ค. 2026', caregiver: 'นายสุพจน์ มั่นคง (สามี)', contactConsent: true },
    { id: '5', hn: 'HN-67812', name: 'นายอนันต์ แสงทอง', age: 60, gender: 'ชาย', phone: '084-999-8877', diseases: ['ASTHMA'], status: 'active', lastVisit: '10 ก.ค. 2026', contactConsent: true },
  ]);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.name.includes(searchTerm) || p.hn.toLowerCase().includes(searchTerm.toLowerCase()) || p.phone.includes(searchTerm);
    const matchesDisease = selectedDisease === 'all' || p.diseases.includes(selectedDisease);
    return matchesSearch && matchesDisease;
  });

  const handleDiseaseToggle = (code: string) => {
    if (newPatient.diseases.includes(code)) {
      setNewPatient({ ...newPatient, diseases: newPatient.diseases.filter((d) => d !== code) });
    } else {
      setNewPatient({ ...newPatient, diseases: [...newPatient.diseases, code] });
    }
  };

  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.hn || !newPatient.name) return;

    const created: Patient = {
      id: Date.now().toString(),
      hn: newPatient.hn.startsWith('HN-') ? newPatient.hn : `HN-${newPatient.hn}`,
      name: newPatient.name,
      age: Number(newPatient.age) || 50,
      gender: newPatient.gender,
      phone: newPatient.phone || '081-000-0000',
      diseases: newPatient.diseases.length > 0 ? newPatient.diseases : ['DM'],
      status: 'active',
      lastVisit: 'วันนี้',
      caregiver: newPatient.caregiver || undefined,
      contactConsent: newPatient.contactConsent,
    };

    setPatients([created, ...patients]);
    setShowAddModal(false);
    setNewPatient({
      hn: '',
      name: '',
      age: '',
      gender: 'ชาย',
      phone: '',
      diseases: ['DM'],
      caregiver: '',
      contactConsent: true,
    });

    alert(`✅ ลงทะเบียนผู้ป่วยใหม่ "${created.name}" (${created.hn}) เข้าสู่ฐานข้อมูลเรียบร้อยแล้ว!`);
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <Users className="w-7 h-7 text-teal-600" />
              <span>ทะเบียนผู้ป่วย NCDs (เชื่อมต่อ HOSxP 97,859 รายชื่อ)</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">จัดการประวัติ ข้อมูลการตรวจรักษาย้อนหลัง (ovst, opdscreen, vn_stat) และญาติผู้ดูแล</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ลงทะเบียนผู้ป่วยใหม่</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหา HN, ชื่อ-นามสกุล, หรือเบอร์โทรใน HOSxP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
            />
          </div>

          {/* Disease Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <span className="text-xs text-slate-500 font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> โรค:
            </span>
            {['all', 'DM', 'HT', 'CKD', 'COPD', 'ASTHMA'].map((code) => (
              <button
                key={code}
                onClick={() => setSelectedDisease(code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedDisease === code
                    ? 'bg-teal-600 text-white shadow-sm font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {code === 'all' ? 'ทั้งหมด' : code}
              </button>
            ))}
          </div>
        </div>

        {/* Patient Table */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">HN / ชื่อ-นามสกุล</th>
                  <th className="pb-3 font-semibold">อายุ / เพศ</th>
                  <th className="pb-3 font-semibold">กลุ่มโรค NCDs</th>
                  <th className="pb-3 font-semibold">เบอร์โทรศัพท์</th>
                  <th className="pb-3 font-semibold">ผู้ดูแล / ญาติ</th>
                  <th className="pb-3 font-semibold">ตรวจล่าสุด</th>
                  <th className="pb-3 font-semibold text-right">รายละเอียด & ประวัติ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      ไม่พบข้อมูลผู้ป่วยตามเงื่อนไข
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50 transition-all group">
                      <td className="py-4 pr-3">
                        <span className="block font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                          {patient.name}
                        </span>
                        <span className="block text-[10px] text-teal-600 font-mono font-bold">{patient.hn}</span>
                      </td>
                      <td className="py-4 text-slate-600">
                        {patient.age} ปี ({patient.gender})
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {patient.diseases.map((d) => (
                            <span
                              key={d}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                d === 'DM' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                                d === 'HT' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                d === 'CKD' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              }`}
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 text-slate-700 flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{patient.phone}</span>
                      </td>
                      <td className="py-4 text-slate-600">
                        {patient.caregiver || <span className="text-slate-400 italic">ไม่มีข้อมูล</span>}
                      </td>
                      <td className="py-4 text-slate-500 text-[11px]">{patient.lastVisit}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => setSelectedPatient(patient)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white font-semibold rounded-lg transition-all text-xs cursor-pointer border border-teal-200 shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>ดูประวัติรักษา</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient Medical History Detail Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-teal-600 font-mono font-bold">{selectedPatient.hn}</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                      <Database className="w-3 h-3" /> HOSxP Sync
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800">{selectedPatient.name}</h3>
                </div>
                <button onClick={() => setSelectedPatient(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Demographics Card */}
                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                  <div>
                    <span className="text-slate-400 block text-[10px]">อายุ / เพศ</span>
                    <span className="font-bold text-slate-800">{selectedPatient.age} ปี ({selectedPatient.gender})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">เบอร์โทรศัพท์</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedPatient.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ญาติ / ผู้ดูแล</span>
                    <span className="font-medium text-slate-700">{selectedPatient.caregiver || 'ไม่ระบุ'}</span>
                  </div>
                </div>

                {/* Medical History Section */}
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm mb-2.5 flex items-center gap-1.5 text-teal-700">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <span>ประวัติการตรวจรักษาย้อนหลังใน HOSxP (ovst / opdscreen / vn_stat)</span>
                  </h4>

                  <div className="space-y-3">
                    {patientHistory.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-teal-300 transition-all space-y-2">
                        <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-teal-600" />
                            {item.visitDate} ({item.visitTime})
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            VN: {item.vn}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                            <span className="text-[10px] text-slate-400 block">ความดัน (BP)</span>
                            <span className="font-bold text-slate-800">{item.bp}</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                            <span className="text-[10px] text-slate-400 block">น้ำตาล (FBS)</span>
                            <span className="font-bold text-amber-700">{item.fbs}</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                            <span className="text-[10px] text-slate-400 block">น้ำหนัก / BMI</span>
                            <span className="font-semibold text-slate-700">{item.bw} ({item.bmi})</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                            <span className="text-[10px] text-slate-400 block">วินิจฉัย (ICD-10)</span>
                            <span className="font-bold text-teal-700">{item.primaryDiagnosisICD10}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-all"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Patient Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-teal-600" />
                  <span>ลงทะเบียนผู้ป่วย NCDs ใหม่</span>
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPatientSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">หมายเลข HN *</label>
                    <input
                      required
                      type="text"
                      placeholder="เช่น HN-99001"
                      value={newPatient.hn}
                      onChange={(e) => setNewPatient({ ...newPatient, hn: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">ชื่อ-นามสกุล *</label>
                    <input
                      required
                      type="text"
                      placeholder="ระบุชื่อและนามสกุล"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">อายุ (ปี)</label>
                    <input
                      required
                      type="number"
                      placeholder="เช่น 60"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">เพศ</label>
                    <select
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium"
                    >
                      <option value="ชาย">ชาย</option>
                      <option value="หญิง">หญิง</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">เบอร์โทรศัพท์</label>
                    <input
                      required
                      type="tel"
                      placeholder="08x-xxx-xxxx"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">กลุ่มโรคประจำตัว NCDs (เลือกได้มากกว่า 1)</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['DM', 'HT', 'CKD', 'COPD', 'ASTHMA'].map((code) => {
                      const selected = newPatient.diseases.includes(code);
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => handleDiseaseToggle(code)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                            selected
                              ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {selected ? `✓ ${code}` : `+ ${code}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ข้อมูลผู้ดูแล / ญาติ (ระบุชื่อและเบอร์โทร)</label>
                  <input
                    type="text"
                    placeholder="เช่น นางสมศรี ดีเลิศ (ภรรยา - 081-999-7777)"
                    value={newPatient.caregiver}
                    onChange={(e) => setNewPatient({ ...newPatient, caregiver: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                  />
                </div>

                <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span className="text-xs text-teal-800 font-medium">ยินยอมให้โทรและส่ง SMS/LINE ติดตามนัดหมาย</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={newPatient.contactConsent}
                    onChange={(e) => setNewPatient({ ...newPatient, contactConsent: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium">
                    ยกเลิก
                  </button>
                  <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all">
                    บันทึกข้อมูลผู้ป่วย
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
