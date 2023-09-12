import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://plazsrgymwabvajemcpl.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYXpzcmd5bXdhYnZhamVtY3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ0OTU2MTcsImV4cCI6MjAxMDA3MTYxN30.8N4V8fIreHpPTGKSavzFwY-6DVB57jYJ3Je9MI4dbn0";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(request, response) {
  const { key } = request.query;

  try {
    const { data, error } = await supabase
      .from("MusicSearch")
      .select("*")
      .textSearch("title", key, {
        type: "websearch",
      });
    if (error) {
      response.status(500).json({ error: error.message });
    } else {
      response.json(data);
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "服务器错误" });
  }
}
