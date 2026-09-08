-- HOSxP Cache & Offline Backup Tables for Supabase (KHH Safe-Connect)

-- 1. Patients Cache Table
CREATE TABLE IF NOT EXISTS public.hosxp_patients_cache (
    hn VARCHAR(20) PRIMARY KEY,
    raw_hn VARCHAR(20),
    patient_name TEXT NOT NULL,
    cid VARCHAR(20),
    birthday DATE,
    sex VARCHAR(10),
    phone VARCHAR(50),
    address TEXT,
    clinic_code VARCHAR(10),
    clinic_name VARCHAR(100),
    disease_type VARCHAR(50),
    reg_date DATE,
    last_vst_date DATE,
    bps INT,
    bpd INT,
    fbs INT,
    bw DECIMAL(5,2),
    bmi DECIMAL(5,2),
    pulse INT,
    pdx VARCHAR(20),
    control_status_code VARCHAR(20),
    control_status_text TEXT,
    is_controlled BOOLEAN DEFAULT FALSE,
    cvd_risk_level VARCHAR(20),
    cvd_risk_text TEXT,
    next_date DATE,
    next_time VARCHAR(20),
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Appointments Cache Table
CREATE TABLE IF NOT EXISTS public.hosxp_appointments_cache (
    id VARCHAR(50) PRIMARY KEY,
    oapp_id BIGINT,
    hn VARCHAR(20) NOT NULL,
    patient_name TEXT NOT NULL,
    phone VARCHAR(50),
    cid VARCHAR(20),
    vst_date DATE,
    next_date DATE,
    next_time VARCHAR(20),
    clinic_code VARCHAR(10),
    clinic_name VARCHAR(100),
    doctor_code VARCHAR(20),
    doctor_name VARCHAR(100),
    app_cause TEXT,
    note TEXT,
    contact_point TEXT,
    status VARCHAR(20) DEFAULT 'confirmed',
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sync Configuration Table for Superadmin Settings
CREATE TABLE IF NOT EXISTS public.hosxp_sync_config (
    key VARCHAR(50) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Superadmin Sync Settings
INSERT INTO public.hosxp_sync_config (key, value)
VALUES (
    'daily_sync_schedule',
    '{"daily_sync_time": "02:00", "auto_sync_enabled": true, "last_synced_at": null, "synced_count": 0, "status": "idle"}'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- RLS Policies (Allow read for anon/authenticated, write for service_role)
ALTER TABLE public.hosxp_patients_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosxp_appointments_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosxp_sync_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on patients_cache" ON public.hosxp_patients_cache FOR SELECT USING (true);
CREATE POLICY "Allow public select on appointments_cache" ON public.hosxp_appointments_cache FOR SELECT USING (true);
CREATE POLICY "Allow public select on sync_config" ON public.hosxp_sync_config FOR SELECT USING (true);

CREATE POLICY "Allow service_role all on patients_cache" ON public.hosxp_patients_cache FOR ALL USING (true);
CREATE POLICY "Allow service_role all on appointments_cache" ON public.hosxp_appointments_cache FOR ALL USING (true);
CREATE POLICY "Allow service_role all on sync_config" ON public.hosxp_sync_config FOR ALL USING (true);
