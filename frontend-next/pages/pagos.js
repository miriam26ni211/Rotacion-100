// frontend-next/pages/pago.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Pagos from "../components/pagos"; // coincide con tu archivo pagos.jsx
import { supabase } from "../utils/supabase";

export default function PagoPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login"); // redirige a login si no hay sesión
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkSession();

    // Opcional: escucha cambios de sesión en tiempo real
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h1>Pago de Lista Dinámica</h1>
      <Pagos monto={10} /> {/* Puedes cambiar el monto si quieres */}
    </div>
  );
}
