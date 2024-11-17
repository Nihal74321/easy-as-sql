import { createClient } from "@supabase/supabase-js";
const URL = 'https://bmhjbhchvvywxipaygnk.supabase.co';

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtaGpiaGNodnZ5d3hpcGF5Z25rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzE0NzQ2MCwiZXhwIjoyMDQyNzIzNDYwfQ._qPz1g9W7E287D5XFtN7LFF1XE2kCGN-erQKBOTdTec';

export const S_BASE = createClient(URL, API_KEY);