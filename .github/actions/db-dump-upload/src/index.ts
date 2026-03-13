import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const bucket = process.env.BUCKET!;
const filePath = process.env.FILE_PATH!;
const file = process.env.FILE!;

if (!supabaseUrl || !supabaseKey || !bucket || !filePath || !file) {
  throw new Error("Missing required environment variables");
}

if (!fs.existsSync(file)) {
  throw new Error(`File not found: ${file}`);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const fileBuffer = fs.readFileSync(file);
console.log(`Uploading ${fileBuffer.length} bytes...`);

const { error } = await supabase.storage
  .from(bucket)
  .upload(filePath, fileBuffer, {
    upsert: true,
    contentType: "application/sql",
  });

if (error) {
  throw new Error(`Upload failed: ${error.message}`);
}

console.log(`Successfully uploaded to ${bucket}/${filePath}`);
