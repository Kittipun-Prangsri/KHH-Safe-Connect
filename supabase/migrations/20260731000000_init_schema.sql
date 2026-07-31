-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean up existing conflicting tables if present from previous projects
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.consent_records CASCADE;
DROP TABLE IF EXISTS public.integration_logs CASCADE;
DROP TABLE IF EXISTS public.import_errors CASCADE;
DROP TABLE IF EXISTS public.import_batches CASCADE;
DROP TABLE IF EXISTS public.patient_education_logs CASCADE;
DROP TABLE IF EXISTS public.education_topics CASCADE;
DROP TABLE IF EXISTS public.conversation_assignments CASCADE;
DROP TABLE IF EXISTS public.reply_templates CASCADE;
DROP TABLE IF EXISTS public.message_reads CASCADE;
DROP TABLE IF EXISTS public.message_attachments CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversation_members CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.contact_logs CASCADE;
DROP TABLE IF EXISTS public.follow_up_tasks CASCADE;
DROP TABLE IF EXISTS public.appointment_status_history CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.patient_diseases CASCADE;
DROP TABLE IF EXISTS public.disease_master CASCADE;
DROP TABLE IF EXISTS public.patient_caregivers CASCADE;
DROP TABLE IF EXISTS public.patient_addresses CASCADE;
DROP TABLE IF EXISTS public.patients CASCADE;
DROP TABLE IF EXISTS public.clinics CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;

-- 1. Organizations
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    organization_type TEXT,
    phone TEXT,
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- 2. Profiles (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY, -- Will reference auth.users(id) via foreign key dynamically or via triggers
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    employee_code TEXT,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'hospital_admin', 'ncd_coordinator', 'doctor', 'nurse', 'pharmacist', 'call_center', 'auditor', 'patient', 'caregiver')),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- 3. Clinics
CREATE TABLE IF NOT EXISTS public.clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID,
    updated_by UUID,
    UNIQUE (organization_id, code)
);

-- 4. Patients
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    hn TEXT NOT NULL,
    cid_encrypted TEXT,
    external_patient_id TEXT,
    source_system TEXT NOT NULL DEFAULT 'manual',
    title TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    phone_primary TEXT,
    phone_secondary TEXT,
    line_id TEXT,
    preferred_contact_method TEXT,
    preferred_contact_time TEXT,
    contact_consent BOOLEAN DEFAULT FALSE NOT NULL,
    patient_status TEXT DEFAULT 'active' NOT NULL,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID,
    updated_by UUID,
    UNIQUE (organization_id, hn)
);

-- 5. Patient Addresses
CREATE TABLE IF NOT EXISTS public.patient_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    address_type TEXT DEFAULT 'home' NOT NULL,
    house_number TEXT,
    village_number TEXT,
    road TEXT,
    subdistrict TEXT,
    district TEXT,
    province TEXT,
    postal_code TEXT,
    landmark TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    is_primary BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- 6. Patient Caregivers
CREATE TABLE IF NOT EXISTS public.patient_caregivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    relationship TEXT,
    phone TEXT NOT NULL,
    address TEXT,
    is_primary BOOLEAN DEFAULT TRUE NOT NULL,
    contact_consent BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- 7. Disease Master
CREATE TABLE IF NOT EXISTS public.disease_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name_th TEXT NOT NULL,
    name_en TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- 8. Patient Diseases
CREATE TABLE IF NOT EXISTS public.patient_diseases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    disease_id UUID REFERENCES public.disease_master(id) ON DELETE CASCADE NOT NULL,
    diagnosed_at DATE,
    disease_stage TEXT,
    status TEXT DEFAULT 'active' NOT NULL,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID,
    updated_by UUID,
    UNIQUE (patient_id, disease_id)
);

-- 9. Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME,
    appointment_type TEXT,
    room TEXT,
    provider_name TEXT,
    status TEXT DEFAULT 'scheduled' NOT NULL CHECK (status IN ('scheduled', 'pending_contact', 'confirmed', 'reschedule_request', 'rescheduled', 'arrived', 'completed', 'missed', 'cancelled', 'referred')),
    reason TEXT,
    notes TEXT,
    external_appointment_id TEXT,
    source_system TEXT DEFAULT 'manual' NOT NULL,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- 10. Appointment Status History
CREATE TABLE IF NOT EXISTS public.appointment_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    reason TEXT,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 11. Follow-up Tasks
CREATE TABLE IF NOT EXISTS public.follow_up_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    task_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    priority TEXT DEFAULT 'normal' NOT NULL CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT DEFAULT 'todo' NOT NULL CHECK (status IN ('todo', 'in_progress', 'waiting_patient', 'completed', 'cancelled', 'overdue')),
    due_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    result TEXT,
    next_follow_up_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- 12. Contact Logs
CREATE TABLE IF NOT EXISTS public.contact_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    contact_method TEXT NOT NULL,
    contacted_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    contact_result TEXT NOT NULL CHECK (contact_result IN ('confirmed', 'caregiver_answered', 'no_answer', 'phone_off', 'invalid_number', 'reschedule_requested', 'treated_elsewhere', 'moved', 'refused_contact', 'deceased', 'other')),
    receiver_name TEXT,
    conversation_summary TEXT,
    advice_given TEXT,
    next_contact_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- 13. Conversations (Reply Module)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    subject TEXT,
    category TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' NOT NULL CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'assigned', 'in_progress', 'waiting_patient', 'waiting_staff', 'escalated', 'resolved', 'closed')),
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    opened_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- 14. Conversation Members
CREATE TABLE IF NOT EXISTS public.conversation_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    member_type TEXT NOT NULL CHECK (member_type IN ('staff', 'patient', 'caregiver')),
    staff_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    caregiver_id UUID REFERENCES public.patient_caregivers(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    left_at TIMESTAMPTZ,
    CHECK (
        (member_type = 'staff' AND staff_id IS NOT NULL AND patient_id IS NULL AND caregiver_id IS NULL) OR
        (member_type = 'patient' AND patient_id IS NOT NULL AND staff_id IS NULL AND caregiver_id IS NULL) OR
        (member_type = 'caregiver' AND caregiver_id IS NOT NULL AND staff_id IS NULL AND patient_id IS NULL)
    )
);

-- 15. Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('staff', 'patient', 'caregiver')),
    sender_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    sender_caregiver_id UUID REFERENCES public.patient_caregivers(id) ON DELETE SET NULL,
    message_type TEXT DEFAULT 'text' NOT NULL CHECK (message_type IN ('text', 'attachment', 'system')),
    message_text TEXT,
    reply_to_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    is_internal_note BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    edited_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    CHECK (
        (sender_type = 'staff' AND sender_staff_id IS NOT NULL) OR
        (sender_type = 'patient' AND sender_patient_id IS NOT NULL) OR
        (sender_type = 'caregiver' AND sender_caregiver_id IS NOT NULL)
    )
);

-- 16. Message Attachments
CREATE TABLE IF NOT EXISTS public.message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 17. Message Reads
CREATE TABLE IF NOT EXISTS public.message_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
    reader_type TEXT NOT NULL CHECK (reader_type IN ('staff', 'patient', 'caregiver')),
    reader_id UUID NOT NULL, -- references profile id, patient id or caregiver id
    read_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 18. Reply Templates
CREATE TABLE IF NOT EXISTS public.reply_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    template_name TEXT NOT NULL,
    category TEXT NOT NULL,
    template_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 19. Conversation Assignments
CREATE TABLE IF NOT EXISTS public.conversation_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    assigned_from UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT,
    assigned_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 20. Education Topics
CREATE TABLE IF NOT EXISTS public.education_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('diet', 'stress', 'medication')),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- 21. Patient Education Logs
CREATE TABLE IF NOT EXISTS public.patient_education_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    topic_id UUID REFERENCES public.education_topics(id) ON DELETE CASCADE NOT NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    provided_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    provided_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    understanding_level TEXT CHECK (understanding_level IN ('poor', 'fair', 'good', 'excellent')),
    patient_barrier TEXT,
    goal TEXT,
    follow_up_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- 22. Import Batches
CREATE TABLE IF NOT EXISTS public.import_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    import_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'processing', 'previewed', 'validated', 'committed', 'cancelled', 'failed')),
    total_rows INTEGER DEFAULT 0 NOT NULL,
    success_rows INTEGER DEFAULT 0 NOT NULL,
    failed_rows INTEGER DEFAULT 0 NOT NULL,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 23. Import Errors
CREATE TABLE IF NOT EXISTS public.import_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES public.import_batches(id) ON DELETE CASCADE NOT NULL,
    row_number INTEGER NOT NULL,
    column_name TEXT,
    error_code TEXT NOT NULL,
    error_message TEXT NOT NULL,
    raw_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 24. Integration Logs
CREATE TABLE IF NOT EXISTS public.integration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    source_system TEXT NOT NULL,
    operation TEXT NOT NULL,
    external_reference TEXT,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
    request_id UUID,
    error_message TEXT,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL
);

-- 25. Consent Records
CREATE TABLE IF NOT EXISTS public.consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    consent_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('granted', 'revoked')),
    channel TEXT NOT NULL,
    granted_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    evidence_path TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 26. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_role TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    request_id UUID,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------------------------------------------
-- Indexes (as recommended in README.md)
-- -------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_patients_org_hn ON public.patients (organization_id, hn);
CREATE INDEX IF NOT EXISTS idx_patients_name ON public.patients (organization_id, first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_appointments_date_status ON public.appointments (organization_id, appointment_date, status);
CREATE INDEX IF NOT EXISTS idx_followups_assignee_due ON public.follow_up_tasks (organization_id, assigned_to, status, due_at);
CREATE INDEX IF NOT EXISTS idx_conversations_assignee_status ON public.conversations (organization_id, assigned_to, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON public.audit_logs (organization_id, entity_type, entity_id, created_at DESC);


-- -------------------------------------------------------------
-- Triggers for updated_at
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to relevant tables
DROP TRIGGER IF EXISTS trigger_update_organizations ON public.organizations;
CREATE TRIGGER trigger_update_organizations BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_profiles ON public.profiles;
CREATE TRIGGER trigger_update_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_clinics ON public.clinics;
CREATE TRIGGER trigger_update_clinics BEFORE UPDATE ON public.clinics FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_patients ON public.patients;
CREATE TRIGGER trigger_update_patients BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_patient_addresses ON public.patient_addresses;
CREATE TRIGGER trigger_update_patient_addresses BEFORE UPDATE ON public.patient_addresses FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_patient_caregivers ON public.patient_caregivers;
CREATE TRIGGER trigger_update_patient_caregivers BEFORE UPDATE ON public.patient_caregivers FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_disease_master ON public.disease_master;
CREATE TRIGGER trigger_update_disease_master BEFORE UPDATE ON public.disease_master FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_patient_diseases ON public.patient_diseases;
CREATE TRIGGER trigger_update_patient_diseases BEFORE UPDATE ON public.patient_diseases FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_appointments ON public.appointments;
CREATE TRIGGER trigger_update_appointments BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_follow_up_tasks ON public.follow_up_tasks;
CREATE TRIGGER trigger_update_follow_up_tasks BEFORE UPDATE ON public.follow_up_tasks FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_contact_logs ON public.contact_logs;
CREATE TRIGGER trigger_update_contact_logs BEFORE UPDATE ON public.contact_logs FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_conversations ON public.conversations;
CREATE TRIGGER trigger_update_conversations BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_reply_templates ON public.reply_templates;
CREATE TRIGGER trigger_update_reply_templates BEFORE UPDATE ON public.reply_templates FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_education_topics ON public.education_topics;
CREATE TRIGGER trigger_update_education_topics BEFORE UPDATE ON public.education_topics FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_patient_education_logs ON public.patient_education_logs;
CREATE TRIGGER trigger_update_patient_education_logs BEFORE UPDATE ON public.patient_education_logs FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_consent_records ON public.consent_records;
CREATE TRIGGER trigger_update_consent_records BEFORE UPDATE ON public.consent_records FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();


-- -------------------------------------------------------------
-- Trigger to auto-create public.profiles upon auth.users sign-up
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    default_org_id UUID;
BEGIN
    -- Query or create a default organization if none exists
    SELECT id INTO default_org_id FROM public.organizations LIMIT 1;
    IF default_org_id IS NULL THEN
        INSERT INTO public.organizations (code, name, organization_type)
        VALUES ('KHH', 'โรงพยาบาลส่งเสริมสุขภาพตำบล KHH', 'hospital')
        RETURNING id INTO default_org_id;
    END IF;

    -- Insert into profiles
    -- Extracts full_name from metadata or defaults to email
    INSERT INTO public.profiles (id, organization_id, full_name, role, is_active)
    VALUES (
        NEW.id,
        default_org_id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'nurse'), -- default role is nurse
        TRUE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if auth.users triggers should be created (this references auth.users table which exists in Supabase environments)
DROP TRIGGER IF EXISTS trigger_on_auth_user_created ON auth.users;
CREATE TRIGGER trigger_on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();


-- -------------------------------------------------------------
-- Helper functions for RLS Row Security Policies
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_organization_id()
RETURNS UUID AS $$
    SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_user_is_active()
RETURNS BOOLEAN AS $$
    SELECT is_active FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;


-- -------------------------------------------------------------
-- Enable Row Level Security (RLS) on all tables
-- -------------------------------------------------------------
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reply_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_education_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;


-- -------------------------------------------------------------
-- Baseline RLS Policies (Cross-Organization and Role checking)
-- -------------------------------------------------------------

-- 1. Organizations Policy: Super admins read/write all, normal staff can only read their own org
DROP POLICY IF EXISTS "org_read_policy" ON public.organizations;
CREATE POLICY "org_read_policy" ON public.organizations
    FOR SELECT TO authenticated
    USING (id = public.current_user_organization_id() OR public.current_user_role() = 'super_admin');

DROP POLICY IF EXISTS "org_all_policy_super_admin" ON public.organizations;
CREATE POLICY "org_all_policy_super_admin" ON public.organizations
    FOR ALL TO authenticated
    USING (public.current_user_role() = 'super_admin');

-- 2. Profiles Policy: Staff can view profiles in their own organization.
DROP POLICY IF EXISTS "profiles_select_same_org" ON public.profiles;
CREATE POLICY "profiles_select_same_org" ON public.profiles
    FOR SELECT TO authenticated
    USING (organization_id = public.current_user_organization_id() AND public.current_user_is_active());

DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid() AND public.current_user_is_active());

-- 3. Clinics Policy: Read clinics in same organization
DROP POLICY IF EXISTS "clinics_select_same_org" ON public.clinics;
CREATE POLICY "clinics_select_same_org" ON public.clinics
    FOR SELECT TO authenticated
    USING (organization_id = public.current_user_organization_id() AND public.current_user_is_active());

-- 4. Patients Policy: Read/write patients in same organization
DROP POLICY IF EXISTS "patients_all_same_org" ON public.patients;
CREATE POLICY "patients_all_same_org" ON public.patients
    FOR ALL TO authenticated
    USING (organization_id = public.current_user_organization_id() AND public.current_user_is_active());

-- 5. Patient Addresses Policy
DROP POLICY IF EXISTS "patient_addresses_all_same_org" ON public.patient_addresses;
CREATE POLICY "patient_addresses_all_same_org" ON public.patient_addresses
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.patients p 
            WHERE p.id = patient_id 
            AND p.organization_id = public.current_user_organization_id()
        ) AND public.current_user_is_active()
    );

-- 6. Patient Caregivers Policy
DROP POLICY IF EXISTS "patient_caregivers_all_same_org" ON public.patient_caregivers;
CREATE POLICY "patient_caregivers_all_same_org" ON public.patient_caregivers
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.patients p 
            WHERE p.id = patient_id 
            AND p.organization_id = public.current_user_organization_id()
        ) AND public.current_user_is_active()
    );

-- 7. Disease Master: All authenticated users can view active diseases
DROP POLICY IF EXISTS "disease_master_read_all" ON public.disease_master;
CREATE POLICY "disease_master_read_all" ON public.disease_master
    FOR SELECT TO authenticated
    USING (is_active = TRUE);

-- 8. Patient Diseases Policy
DROP POLICY IF EXISTS "patient_diseases_all_same_org" ON public.patient_diseases;
CREATE POLICY "patient_diseases_all_same_org" ON public.patient_diseases
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.patients p 
            WHERE p.id = patient_id 
            AND p.organization_id = public.current_user_organization_id()
        ) AND public.current_user_is_active()
    );

-- 9. Appointments Policy: Read/write appointments in same organization
DROP POLICY IF EXISTS "appointments_all_same_org" ON public.appointments;
CREATE POLICY "appointments_all_same_org" ON public.appointments
    FOR ALL TO authenticated
    USING (organization_id = public.current_user_organization_id() AND public.current_user_is_active());

-- 10. Appointment Status History Policy
DROP POLICY IF EXISTS "appointment_history_all_same_org" ON public.appointment_status_history;
CREATE POLICY "appointment_history_all_same_org" ON public.appointment_status_history
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.appointments a 
            WHERE a.id = appointment_id 
            AND a.organization_id = public.current_user_organization_id()
        ) AND public.current_user_is_active()
    );

-- 11. Follow-up Tasks Policy
DROP POLICY IF EXISTS "followups_all_same_org" ON public.follow_up_tasks;
CREATE POLICY "followups_all_same_org" ON public.follow_up_tasks
    FOR ALL TO authenticated
    USING (organization_id = public.current_user_organization_id() AND public.current_user_is_active());

-- 12. Contact Logs Policy
DROP POLICY IF EXISTS "contact_logs_all_same_org" ON public.contact_logs;
CREATE POLICY "contact_logs_all_same_org" ON public.contact_logs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.patients p 
            WHERE p.id = patient_id 
            AND p.organization_id = public.current_user_organization_id()
        ) AND public.current_user_is_active()
    );

-- 13. Conversations Policy
DROP POLICY IF EXISTS "conversations_all_same_org" ON public.conversations;
CREATE POLICY "conversations_all_same_org" ON public.conversations
    FOR ALL TO authenticated
    USING (organization_id = public.current_user_organization_id() AND public.current_user_is_active());

-- 14. Conversation Members Policy
DROP POLICY IF EXISTS "conversation_members_all_same_org" ON public.conversation_members;
CREATE POLICY "conversation_members_all_same_org" ON public.conversation_members
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = conversation_id 
            AND c.organization_id = public.current_user_organization_id()
        ) AND public.current_user_is_active()
    );

-- 15. Messages Policy
DROP POLICY IF EXISTS "messages_all_same_org" ON public.messages;
CREATE POLICY "messages_all_same_org" ON public.messages
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations c 
            WHERE c.id = conversation_id 
            AND c.organization_id = public.current_user_organization_id()
        ) AND public.current_user_is_active()
    );

-- 16. Message Attachments Policy
DROP POLICY IF EXISTS "message_attachments_all_same_org" ON public.message_attachments;
CREATE POLICY "message_attachments_all_same_org" ON public.message_attachments
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.messages m
            JOIN public.conversations c ON c.id = m.conversation_id
            WHERE m.id = message_id 
            AND c.organization_id = public.current_user_organization_id()
        ) AND public.current_user_is_active()
    );

-- 17. Message Reads Policy
DROP POLICY IF EXISTS "message_reads_all_same_org" ON public.message_reads;
CREATE POLICY "message_reads_all_same_org" ON public.message_reads
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.messages m
            JOIN public.conversations c ON c.id = m.conversation_id
            WHERE m.id = message_id 
            AND c.organization_id = public.current_user_organization_id()
        ) AND public.current_user_is_active()
    );

-- 18. Reply Templates Policy
DROP POLICY IF EXISTS "reply_templates_all_same_org" ON public.reply_templates;
CREATE POLICY "reply_templates_all_same_org" ON public.reply_templates
    FOR ALL TO authenticated
    USING (organization_id = public.current_user_organization_id() AND public.current_user_is_active());

-- 19. Conversation Assignments Policy
DROP POLICY IF EXISTS "conversation_assignments_all_same_org" ON public.conversation_assignments;
CREATE POLICY "conversation_assignments_all_same_org" ON public.conversation_assignments
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = conversation_id 
            AND c.organization_id = public.current_user_organization_id()
        ) AND public.current_user_is_active()
    );

-- 20. Education Topics: Read-only for all active authenticated staff
DROP POLICY IF EXISTS "education_topics_read_all" ON public.education_topics;
CREATE POLICY "education_topics_read_all" ON public.education_topics
    FOR SELECT TO authenticated
    USING (is_active = TRUE);

-- 21. Patient Education Logs Policy
DROP POLICY IF EXISTS "patient_education_logs_all_same_org" ON public.patient_education_logs;
CREATE POLICY "patient_education_logs_all_same_org" ON public.patient_education_logs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.patients p 
            WHERE p.id = patient_id 
            AND p.organization_id = public.current_user_organization_id()
        ) AND public.current_user_is_active()
    );

-- 22. Import Batches Policy
DROP POLICY IF EXISTS "import_batches_all_same_org" ON public.import_batches;
CREATE POLICY "import_batches_all_same_org" ON public.import_batches
    FOR ALL TO authenticated
    USING (organization_id = public.current_user_organization_id() AND public.current_user_is_active());

-- 23. Import Errors Policy
DROP POLICY IF EXISTS "import_errors_all_same_org" ON public.import_errors;
CREATE POLICY "import_errors_all_same_org" ON public.import_errors
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.import_batches b
            WHERE b.id = batch_id 
            AND b.organization_id = public.current_user_organization_id()
        ) AND public.current_user_is_active()
    );

-- 24. Integration Logs Policy
DROP POLICY IF EXISTS "integration_logs_all_same_org" ON public.integration_logs;
CREATE POLICY "integration_logs_all_same_org" ON public.integration_logs
    FOR ALL TO authenticated
    USING (organization_id = public.current_user_organization_id() AND public.current_user_is_active());

-- 25. Consent Records Policy
DROP POLICY IF EXISTS "consent_records_all_same_org" ON public.consent_records;
CREATE POLICY "consent_records_all_same_org" ON public.consent_records
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.patients p 
            WHERE p.id = patient_id 
            AND p.organization_id = public.current_user_organization_id()
        ) AND public.current_user_is_active()
    );

-- 26. Audit Logs Policy: Read-only for same org auditor / admins
DROP POLICY IF EXISTS "audit_logs_select_same_org" ON public.audit_logs;
CREATE POLICY "audit_logs_select_same_org" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (
        organization_id = public.current_user_organization_id() 
        AND public.current_user_is_active()
        AND public.current_user_role() IN ('super_admin', 'hospital_admin', 'ncd_coordinator', 'auditor')
    );

DROP POLICY IF EXISTS "audit_logs_insert_same_org" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_same_org" ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (
        organization_id = public.current_user_organization_id() 
        AND public.current_user_is_active()
    );
