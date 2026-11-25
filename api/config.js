// Renvoie la configuration publique (URL et clé "anon" Supabase, conçues pour le navigateur).
export default function handler(req, res) {
  res.setHeader("Cache-Control", "public, max-age=300");
  res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL || "",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
    ai: Boolean(process.env.ANTHROPIC_API_KEY),
  });
}
