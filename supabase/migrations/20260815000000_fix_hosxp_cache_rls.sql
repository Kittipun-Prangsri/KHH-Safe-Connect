-- Close the anon-read gap on the HOSxP cache tables.
--
-- These tables mirror live patient health data (PHI) synced from HOSxP.
-- The "Allow public select ... USING (true)" policies from
-- 20260804_create_hosxp_cache_tables.sql let anyone holding the public
-- anon key (embedded in the web bundle and, going forward, the mobile
-- app) read every patient's data with no HN scoping. Nothing in the
-- codebase actually depends on anon/authenticated reading these tables
-- directly — every read and write goes through the service-role admin
-- client from server-side code (hosxpSyncService.ts, /api/mobile/*).
-- So the fix is simply to remove the public policies; service_role
-- (which bypasses RLS anyway, but keeping an explicit policy for
-- clarity) remains the only path in.

DROP POLICY IF EXISTS "Allow public select on patients_cache" ON public.hosxp_patients_cache;
DROP POLICY IF EXISTS "Allow public select on appointments_cache" ON public.hosxp_appointments_cache;
DROP POLICY IF EXISTS "Allow public select on sync_config" ON public.hosxp_sync_config;
