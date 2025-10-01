// index.js
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

// ⚡ Conexión a Supabase con SERVICE ROLE
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// -----------------------------
// Solicitar recuperación de contraseña
// -----------------------------
app.post("/recover", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requerido" });

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:5173/auth", // frontend donde el usuario cambiará la contraseña
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ success: true });
});

// -----------------------------
// Actualizar contraseña
// -----------------------------
app.post("/reset-password", async (req, res) => {
  const { access_token, new_password } = req.body;
  if (!access_token || !new_password)
    return res.status(400).json({ error: "Token y nueva contraseña requeridos" });

  const { data, error } = await supabase.auth.updateUser(
    { password: new_password },
    { access_token }
  );

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ success: true, user: data.user });
});

// -----------------------------
// Login
// -----------------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ user: data.user, session: data.session });
});

// -----------------------------
// Registro
// -----------------------------
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ user: data.user });
});

// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));

