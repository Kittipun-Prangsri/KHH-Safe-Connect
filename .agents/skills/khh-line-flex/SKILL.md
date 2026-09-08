---
name: khh-line-flex
description: >-
  Build, maintain, and optimize LINE Flex Message templates and digital health innovations for Khlong Hat Hospital NCDs Care (KHH Safe-Connect). Enforces 100% FREE Reply Messages (NO Push Messages).
---

# KHH Safe-Connect: LINE Flex Message Development Skill

## Overview
This skill provides comprehensive instructions, standards, and utilities for building, modifying, and expanding LINE Flex Message templates for **Khlong Hat Hospital (โรงพยาบาลคลองหาด)** NCDs Care Portal (`apps/web/lib/flex/`).

> [!IMPORTANT]
> **STRICT COST-SAVING POLICY: NO LINE PUSH MESSAGES**
> LINE Official Account charges fees/quotas for Push Messages. To support 100 to 1,000+ patients without any monthly costs, **ALL messages MUST be delivered via 100% FREE LINE Reply Messages (`sendLineReplyMessage`)** using the Webhook `replyToken`.

---

## Messaging Policy: 100% FREE Reply Messages Only

| Message Type | LINE Fee / Quota | KHH Policy | Implementation Method |
| :--- | :---: | :---: | :--- |
| **Reply Message** (`replyToken`) | **0 Baht (100% FREE & Unlimited)** | ✅ **MANDATORY** | `sendLineReplyMessage(replyToken, flexCard)` |
| **Push Message** (`to: userId`) | Charges quota / Monthly fee | ❌ **PROHIBITED** | Do NOT use `sendLinePushMessage` |

### How On-Demand Check-in Works (0 Baht for 1,000+ Patients):
1. Patient taps Rich Menu **"🗓️ นัดหมายของฉัน"** or types `"เช็กนัด"`
2. LINE Webhook receives event with `replyToken`
3. Server queries HOSxP database and calls `createMyAppointmentsFlex(name, hn, appointments)`
4. Server replies via `sendLineReplyMessage(replyToken, flexCard)` — **0 Baht, Unlimited Quota**

---

## Directory Architecture

All LINE Flex Message templates are modularized under `apps/web/lib/flex/`:

```
apps/web/lib/
├── flex/
│   ├── flexConstants.ts         # Centralized phone numbers, URLs, operating hours & theme colors
│   ├── appointmentFlex.ts       # Appointment reminders, status, self check-in QR & family share
│   ├── authFlex.ts              # Role selection, registration prompts, role verification & PDPA PIN
│   ├── healthAdviceFlex.ts      # Health education menu, diet 2:1:1, medication, exercise, Thai medicine & mental health
│   ├── contactFlex.ts           # Nurse contact, pharmacy, mental health staff, 1669 emergency & native location
│   └── wellnessAndVitalsFlex.ts # Lab results (FBS/HbA1c/eGFR), visual progress gauges & gamification badges
└── lineFlexTemplates.ts         # Barrel export re-exporting all ./flex/ modules
```

---

## Centralized Constants (`flexConstants.ts`)

Always reference constants from `KHH_CONTACTS` and `KHH_COLORS` rather than hardcoding strings:

```typescript
import { KHH_CONTACTS, KHH_COLORS } from './flexConstants';

// Phone Numbers & URIs
KHH_CONTACTS.NCD_CLINIC_PHONE_DISPLAY // '06-2271-0099'
KHH_CONTACTS.NCD_CLINIC_PHONE_URI     // 'tel:0622710099'
KHH_CONTACTS.MENTAL_HEALTH_PHONE_DISPLAY // '061-3961769'
KHH_CONTACTS.HOTLINE_1323_URI         // 'tel:1323'
KHH_CONTACTS.EMERGENCY_1669_URI       // 'tel:1669'
KHH_CONTACTS.MAPS_LOCATION_URI        // Google Maps URL

// Theme Colors
KHH_COLORS.PRIMARY_TEAL      // '#0D9488'
KHH_COLORS.DARK_TEAL         // '#0B6F8A'
KHH_COLORS.DIET_GREEN        // '#16A34A'
KHH_COLORS.THAI_MEDICINE_GREEN // '#059669'
KHH_COLORS.MEDICATION_BLUE   // '#0284C7'
KHH_COLORS.EXERCISE_ORANGE   // '#EA580C'
KHH_COLORS.MENTAL_PURPLE     // '#7C3AED'
KHH_COLORS.EMERGENCY_RED     // '#DC2626'
```

---

## Key Flex Message Categories & Functions

### 1. Appointment Management (`appointmentFlex.ts`)
* `createAppointmentFlexMessage(data)`: Reminder card with self check-in QR code (`KHH-CHECKIN:{HN}:{DATE}`) & 1-click family share button.
* `createMyAppointmentsFlex(patientName, hn, appointments)`: Live HOSxP appointment card.
* `createConfirmSuccessFlex(patientName, date)`: Confirmation response card.
* `createRescheduleRequestFlex()` & `createRescheduleSuccessFlex(params)`: Rescheduling request & approval cards.

### 2. Registration & PDPA Protection (`authFlex.ts`)
* `createRoleSelectionFlexMessage()`: Initial role selection (Patient vs Staff).
* `createPatientRegistrationPromptFlex()`: CID/HN input instructions & HOSxP barcode scanner link.
* `createPatientInfoVerificationFlex(...)`: HOSxP patient info verification card.
* `createPdpaPinPromptFlex(patientName, hn)`: PDPA protection PIN prompt card.

### 3. NCDs Health Education (`healthAdviceFlex.ts`)
* `createHealthEducationMenuFlex()`: Main 5-category health education menu.
* `createDietAdviceFlex()`: Plate ratio 2:1:1 diet guide & foods to avoid.
* `createThaiMedicineAdviceFlex()`: Traditional massages, herbal compresses & salt pot therapy.
* `createMedicationAdviceFlex()`: Drug adherence, before/after meal rules & storage.
* `createExerciseAdviceFlex()`: 150 min/week exercise targets & physical therapy booking.
* `createStressAndSleepAdviceFlex()`: Mental health assessment guidelines & DMH Check-in links.

### 4. Staff Contacts & Emergency (`contactFlex.ts`)
* `createContactStaffFlex()`: NCDs care nurse contact card.
* `createContactPharmacistFlex()` & `createPharmacistFormPromptFlex()`: Pharmacy department contacts & form prompts.
* `createContactMentalHealthStaffFlex()`: Mental health unit contacts (061-3961769).
* `createEmergencySymptomsFlex()`: B.E.F.A.S.T stroke & MI emergency warning card (1669).
* `createHospitalNativeLocationMessage()`: LINE Native location payload (0% server load).

### 5. Patient Vitals, Lab Gauges & Gamification (`wellnessAndVitalsFlex.ts`)
* `createPatientVitalsFlex(patientName, hn, vitals)`: Visual progress gauge bars for BMI, Blood Pressure, FBS, HbA1c, and eGFR.
* `createHealthGamificationBadgeFlex(params)`: Digital achievement badge cards (🥇 NCDs Patient of Honor, 🌟 Glycemic Control Champion).

---

## Technical Guidelines & LINE API Rules

1. **Strict Messaging Rule**: **ALWAYS use `sendLineReplyMessage(replyToken, ...)`**. Never call LINE Push API.
2. **Footer Container Limit**: Max 5 buttons in `footer` box container per bubble.
3. **Text Wrapping**: Always set `wrap: true` on any text component containing newlines `\n` or long strings.
4. **Empty Box Contents**: Every `box` component MUST have a non-empty `contents` array.
5. **0% Server Load Optimization**: Use LINE Scheme URIs (`https://line.me/R/msg/text/?...` and `https://line.me/R/oaMessage/...`) for client-side actions.
6. **Verification**: Always run `npx tsc --noEmit` inside `apps/web` after editing Flex templates.

---

## Common Commands

```bash
# Verify TypeScript build
cd apps/web && npx tsc --noEmit

# Test Webhook Route locally
npm run dev
```
