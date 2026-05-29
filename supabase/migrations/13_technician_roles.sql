-- 1. Link technicians to profiles
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id);

-- 2. Update existing booking statuses check to ensure compatibility
-- (Ensure we have all required statuses)
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('pending', 'confirmed', 'assigned', 'en_route', 'in_progress', 'completed', 'cancelled'));

-- 3. Technicians Table Security
-- Allow technicians to view and update their own technician record
CREATE POLICY "Technicians can view own record" ON public.technicians FOR SELECT 
  USING (profile_id = auth.uid() OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Technicians can update own record" ON public.technicians FOR UPDATE
  USING (profile_id = auth.uid());

-- 4. Bookings Security
-- Allow technicians to view and update bookings assigned to them
CREATE POLICY "Technicians can view assigned bookings" ON public.bookings FOR SELECT
  USING (
    technician_id IN (SELECT id FROM public.technicians WHERE profile_id = auth.uid()) 
    OR user_id = auth.uid()
    OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY "Technicians can update assigned bookings" ON public.bookings FOR UPDATE
  USING (
    technician_id IN (SELECT id FROM public.technicians WHERE profile_id = auth.uid())
    OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );
