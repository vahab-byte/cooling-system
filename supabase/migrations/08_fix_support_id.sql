-- Migration 08: Fix support_tickets ID default
ALTER TABLE support_tickets ALTER COLUMN id SET DEFAULT gen_random_uuid();
