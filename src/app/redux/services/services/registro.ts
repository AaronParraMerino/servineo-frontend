const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const CONTROL_C_BASE = `${API_BASE}/api/controlC`;

console.log("API_BASE:", API_BASE);
console.log("CONTROL_C_BASE:", CONTROL_C_BASE);

export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface GoogleAuthResponse {
  status: "ok" | "firstTime" | "exists" | "error";
  firstTime?: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface UbicacionResponse {
  success: boolean;
  message?: string;
}

/**
 * LOGIN CON GOOGLE
 * POST /api/controlC/google/auth
 */
export async function enviarTokenGoogle(
  token: string
): Promise<GoogleAuthResponse> {
  try {
    const res = await fetch(`${CONTROL_C_BASE}/google/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error al conectar con el backend (google/auth):", error);
    throw error;
  }
}

/**
 * VERIFICAR SESIÓN EN BACKEND
 * GET /api/controlC/google/verify
 * Devuelve algo tipo: { valid: boolean, user?: {...} }
 */
export async function verificarSesionBackend(token: string) {
  try {
    const res = await fetch(`${CONTROL_C_BASE}/google/verify`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.warn("google/verify devolvió status", res.status);
      return { valid: false };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error al verificar la sesión (google/verify):", error);
    // No lanzamos error, solo indicamos sesión inválida
    return { valid: false };
  }
}

/**
 * GUARDAR UBICACIÓN DEL USUARIO
 * POST /api/controlC/ubicacion
 */
export async function enviarUbicacion(
  lat: number,
  lng: number,
  direccion: string | null,
  departamento: string | null,
  pais: string | null
): Promise<UbicacionResponse> {
  const token = localStorage.getItem("servineo_token");

  try {
    const res = await fetch(`${CONTROL_C_BASE}/ubicacion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ lat, lng, direccion, departamento, pais }),
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(
      "Error al enviar la ubicación al backend (controlC/ubicacion):",
      error
    );
    throw error;
  }
}

export interface RegistroResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

/**
 * REGISTRO MANUAL
 * POST /api/controlC/registro/manual
 */
export async function enviarRegistroManual(
  name: string,
  email: string,
  password: string
): Promise<RegistroResponse> {
  console.log("Enviando registro manual a:", `${CONTROL_C_BASE}/registro/manual`);

  try {
    const res = await fetch(`${CONTROL_C_BASE}/registro/manual`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      let errorMessage = `Error ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData?.message) errorMessage = errorData.message;
      } catch {
        // body no es JSON, dejamos el mensaje por defecto
      }
      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (error) {
    console.error("Error al registrar manualmente:", error);
    throw error;
  }
}
