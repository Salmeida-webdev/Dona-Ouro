import { brand } from "./brand.config.js";

const baseUrl = brand.apiBaseUrl.replace(/\/$/, "");

async function request(path, options = {}) {
  const token = localStorage.getItem("dona-de-ouro-session");
  const response = await fetch(baseUrl + path, {
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
}

export const integrationPorts = {
  api: { async health() { return request("/api/health"); }, async bootstrap() { return request("/api/bootstrap"); } },
  auth: {
    async signIn({ email, password } = {}) {
      const response = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      if (response.token) localStorage.setItem("dona-de-ouro-session", response.token);
      return response;
    },
    async me() { return request("/api/auth/me"); },
    async signOut() { const response = await request("/api/auth/logout", { method: "POST" }); localStorage.removeItem("dona-de-ouro-session"); return response; },
    async recoverPassword() { return { ok: true, mode: "demo-d1" }; }
  },
  users: {
    async list() { return request("/api/admin/users"); },
    async roles() { return request("/api/admin/roles"); },
    async create({ fullName, email, roleKey }) { return request("/api/admin/users", { method: "POST", body: JSON.stringify({ fullName, email, roleKey }) }); }
  },
  appointments: { async list() { return (await request("/api/bootstrap")).data.appointments; }, async create() { return { ok: true, mode: "demo-d1" }; } },
  customers: { async list() { return (await request("/api/bootstrap")).data.customers; }, async create() { return { ok: true, mode: "demo-d1" }; } },
  finance: { async summary() { return (await request("/api/bootstrap")).data.transactions; } }
};
