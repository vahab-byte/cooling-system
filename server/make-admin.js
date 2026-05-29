import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const makeAdmin = async (email) => {
  if (!email) {
    console.error("❌ Please provide an email address.");
    console.log("Usage: node make-admin.js your-email@example.com");
    process.exit(1);
  }

  console.log(`🔍 Looking for user with email: ${email}`);

  // Update the role in the profiles table
  const { data, error } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("email", email)
    .select();

  if (error) {
    console.error("❌ Error updating user role:", error.message);
    process.exit(1);
  }

  if (data && data.length > 0) {
    console.log(`✅ Success! User ${email} is now an ADMIN.`);
    console.log("You can now log in and access the Admin Panel.");
  } else {
    console.error(`❌ User with email ${email} not found in the database.`);
    console.log(
      "Make sure you have registered an account with this email first.",
    );
  }
};

const targetEmail = process.argv[2];
makeAdmin(targetEmail);
