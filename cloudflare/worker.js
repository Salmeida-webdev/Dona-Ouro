const DEFAULT_WORKSPACE_ID = "ws-demo-001";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://donaouro.netlify.app",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Vary": "Origin"
};

const PASSWORD_ITERATIONS = 100000;
const textEncoder = new TextEncoder();

function bytesToBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

async function digestBase64(value) {
  return bytesToBase64(new Uint8Array(await crypto.subtle.digest("SHA-256", textEncoder.encode(value))));
}

async function derivePasswordHash(password, saltBase64, iterations = PASSWORD_ITERATIONS) {
  const key = await crypto.subtle.importKey("raw", textEncoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: base64ToBytes(saltBase64), iterations, hash: "SHA-256" }, key, 256);
  return bytesToBase64(new Uint8Array(bits));
}

function randomBase64(size = 32) {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return bytesToBase64(bytes);
}

async function passwordMatches(password, user) {
  if (!user?.password_hash || !user?.password_salt) return false;
  const candidate = await derivePasswordHash(password, user.password_salt, user.password_iterations || PASSWORD_ITERATIONS);
  return candidate === user.password_hash;
}

async function readJson(request) {
  try { return await request.json(); } catch { return {}; }
}

async function currentUser(request, db) {
  const authorization = request.headers.get("Authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!token) return null;
  const tokenHash = await digestBase64(token);
  const user = await db.prepare(`
    select s.id as session_id, s.auth_user_id, s.workspace_id, au.email, p.id as profile_id,
           p.full_name, r.id as role_id, r.role_key, r.name as role_name
    from sessions s
    join auth_users au on au.id = s.auth_user_id
    join workspace_members wm on wm.auth_user_id = s.auth_user_id and wm.workspace_id = s.workspace_id
    join roles r on r.id = wm.role_id
    left join profiles p on p.id = wm.profile_id
    where s.token_hash = ?1 and s.revoked_at is null and s.expires_at > datetime('now')
      and au.status = 'active' and wm.status = 'active'
    limit 1
  `).bind(tokenHash).first();
  if (!user) return null;
  await db.prepare("update sessions set last_seen_at = datetime('now') where id = ?1").bind(user.session_id).run();
  const permissions = await db.prepare(`
    select p.permission_key from role_permissions rp
    join permissions p on p.id = rp.permission_id
    where rp.role_id = ?1 order by p.permission_key
  `).bind(user.role_id).all();
  return { ...user, permissions: (permissions.results || []).map((item) => item.permission_key), tokenHash };
}

function unauthorized() {
  return json({ ok: false, error: "Não autorizado" }, 401);
}

function forbidden() {
  return json({ ok: false, error: "Permissão insuficiente" }, 403);
}

function userPayload(user) {
  return {
    id: user.auth_user_id,
    email: user.email,
    fullName: user.full_name,
    workspaceId: user.workspace_id,
    role: user.role_key,
    roleName: user.role_name,
    permissions: user.permissions
  };
}

async function requirePermission(request, db, permissionKey) {
  const user = await currentUser(request, db);
  if (!user) return { response: unauthorized() };
  if (!user.permissions.includes(permissionKey)) return { response: forbidden() };
  return { user };
}

async function writeAudit(db, { workspaceId, actorUserId = null, action, resourceType, resourceId = null, metadata = {} }) {
  await db.prepare(`
    insert into audit_logs (id, workspace_id, actor_user_id, action, resource_type, resource_id, metadata)
    values (?1, ?2, ?3, ?4, ?5, ?6, ?7)
  `).bind(crypto.randomUUID(), workspaceId, actorUserId, action, resourceType, resourceId, JSON.stringify(metadata)).run();
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
  });
}

function rows(result) {
  return result?.results || [];
}

async function readBootstrap(db, workspaceId) {
  const [workspace, profiles, customers, services, appointments, transactions, tasks, snapshots] = await Promise.all([
    db.prepare("select id, name, city, segment, logo_url from workspaces where id = ?1").bind(workspaceId).first(),
    db.prepare("select id, full_name, email, role, active from profiles where workspace_id = ?1 and active = 1 order by case when role = 'owner' then 0 else 1 end, full_name").bind(workspaceId).all(),
    db.prepare("select id, full_name, email, phone, status, tags, last_visit_at, next_step, total_spent, visits_count, created_at from customers where workspace_id = ?1 order by full_name").bind(workspaceId).all(),
    db.prepare("select id, name, category, duration_minutes, price, active from services where workspace_id = ?1 order by active desc, name").bind(workspaceId).all(),
    db.prepare("select a.id, a.starts_at, a.ends_at, a.status, c.full_name as customer_name, s.name as service_name, p.full_name as professional_name from appointments a left join customers c on c.id = a.customer_id left join services s on s.id = a.service_id left join profiles p on p.id = a.professional_id where a.workspace_id = ?1 order by a.starts_at").bind(workspaceId).all(),
    db.prepare("select id, description, detail, type, amount, occurred_on from transactions where workspace_id = ?1 order by occurred_on desc, created_at desc").bind(workspaceId).all(),
    db.prepare("select id, title, due_at, priority, completed from tasks where workspace_id = ?1 order by completed asc, due_at asc").bind(workspaceId).all(),
    db.prepare("select period_start, period_end, revenue, appointments_count, retention_rate, occupancy_rate, average_ticket, cancellation_rate, nps from analytics_snapshots where workspace_id = ?1 order by period_start").bind(workspaceId).all()
  ]);

  const profileRows = rows(profiles);
  const customerRows = rows(customers);
  const serviceRows = rows(services);
  const appointmentRows = rows(appointments);
  const transactionRows = rows(transactions);
  const taskRows = rows(tasks);
  const snapshotRows = rows(snapshots);
  const latest = snapshotRows[snapshotRows.length - 1] || {};
  const previous = snapshotRows[snapshotRows.length - 2] || {};
  const safePercent = (value) => `${Number(value || 0).toFixed(1).replace(".", ",")}%`;
  const money = (value) => `R$ ${Number(value || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
  const initials = (name = "") => name.split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase();
  const tag = (value) => { try { return JSON.parse(value || "[]")[0] || "Relacionamento"; } catch { return value || "Relacionamento"; } };

  return {
    workspace,
    profile: profileRows.find((item) => item.role === "admin" || item.role === "owner") || profileRows[0] || null,
    notifications: [
      { title: "3 clientes aguardam um próximo passo", tone: "gold" },
      { title: "Agenda confirmada para hoje", tone: "green" }
    ],
    appointments: appointmentRows.map((item, index) => ({
      id: item.id,
      time: new Date(item.starts_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      client: item.customer_name || "Cliente sem nome",
      service: item.service_name || "Atendimento",
      duration: "1h30",
      professional: item.professional_name || "Equipe",
      status: item.status === "confirmed" ? "Confirmado" : item.status === "completed" ? "Concluído" : "Agendado",
      tone: index % 3 === 0 ? "green" : index % 3 === 1 ? "gold" : "muted"
    })),
    customers: customerRows.map((item, index) => ({
      id: item.id,
      name: item.full_name,
      email: item.email || "Sem e-mail",
      initials: initials(item.full_name),
      lastVisit: item.last_visit_at ? new Date(item.last_visit_at).toLocaleDateString("pt-BR") : "Ainda não",
      visits: item.visits_count,
      nextStep: item.next_step || "Definir próximo passo",
      tag: tag(item.tags),
      status: item.status === "active" ? "Ativo" : "Inativo",
      total: money(item.total_spent),
      tone: index % 3 === 0 ? "green" : index % 3 === 1 ? "gold" : "muted"
    })),
    services: serviceRows.map((item, index) => ({
      id: item.id,
      name: item.name,
      category: item.category || "Serviço",
      duration: `${item.duration_minutes} min`,
      price: money(item.price),
      active: Boolean(item.active),
      bookings: Math.max(8, 52 - index * 5),
      revenue: money(Number(item.price || 0) * Math.max(8, 52 - index * 5))
    })),
    team: profileRows.map((item, index) => ({
      id: item.id,
      name: item.full_name,
      role: item.role === "admin" || item.role === "owner" ? "Gestora" : "Especialista",
      initials: initials(item.full_name),
      status: index === 0 ? "Disponível" : "Em operação",
      appointments: Math.max(8, 24 - index * 3),
      revenue: money(Math.max(2200, 8420 - index * 960)),
      color: ["green", "gold", "rose", "slate"][index % 4]
    })),
    transactions: transactionRows,
    tasks: taskRows,
    monthlyRevenue: snapshotRows.map((item) => Number(item.revenue || 0)),
    analytics: {
      revenueGrowth: `${(((Number(latest.revenue || 0) - Number(previous.revenue || latest.revenue || 0)) / Math.max(1, Number(previous.revenue || latest.revenue || 1))) * 100).toFixed(1).replace(".", ",")}%`,
      attendanceGrowth: "8,4%",
      retentionRate: safePercent(latest.retention_rate),
      occupancyRate: safePercent(latest.occupancy_rate),
      averageTicket: money(latest.average_ticket),
      cancellationRate: safePercent(latest.cancellation_rate),
      newCustomers: customerRows.filter((item) => item.created_at).length,
      reactivatedCustomers: 11,
      nps: Number(latest.nps || 0),
      conversionRate: "32%",
      bestDay: "Quinta-feira",
      bestService: serviceRows[0]?.name || "Serviço em destaque",
      bestProfessional: profileRows[0]?.full_name || "Equipe"
    }
  };
}

async function login(request, env) {
  const body = await readJson(request);
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!email || !password) return json({ ok: false, error: "Credenciais inválidas" }, 401);
  const user = await env.DB.prepare(`
    select au.*, wm.workspace_id, wm.status as member_status, r.id as role_id, r.role_key, r.name as role_name,
           p.id as profile_id, p.full_name
    from auth_users au
    join workspace_members wm on wm.auth_user_id = au.id
    join roles r on r.id = wm.role_id
    left join profiles p on p.id = wm.profile_id
    where lower(au.email) = ?1 and wm.status = 'active'
    limit 1
  `).bind(email).first();
  if (!user || user.status !== "active" || !(await passwordMatches(password, user))) {
    return json({ ok: false, error: "Credenciais inválidas" }, 401);
  }
  const token = randomBase64(32);
  const tokenHash = await digestBase64(token);
  await env.DB.prepare(`
    insert into sessions (id, auth_user_id, workspace_id, token_hash, expires_at, user_agent)
    values (?1, ?2, ?3, ?4, datetime('now', '+8 hours'), ?5)
  `).bind(crypto.randomUUID(), user.id, user.workspace_id, tokenHash, request.headers.get("User-Agent") || null).run();
  await env.DB.prepare("update auth_users set last_login_at = datetime('now'), updated_at = datetime('now') where id = ?1").bind(user.id).run();
  await writeAudit(env.DB, { workspaceId: user.workspace_id, actorUserId: user.id, action: "auth.login", resourceType: "session" });
  const sessionUser = await currentUser(new Request(request.url, { headers: { Authorization: `Bearer ${token}` } }), env.DB);
  return json({ ok: true, token, expiresInHours: 8, user: userPayload(sessionUser || { ...user, auth_user_id: user.id, email, permissions: [] }) });
}

async function listRoles(request, env) {
  const access = await requirePermission(request, env.DB, "users.view");
  if (access.response) return access.response;
  const result = await env.DB.prepare(`
    select r.id, r.role_key, r.name, r.description,
           coalesce(json_group_array(p.permission_key) filter (where p.permission_key is not null), json('[]')) as permissions
    from roles r left join role_permissions rp on rp.role_id = r.id left join permissions p on p.id = rp.permission_id
    where r.workspace_id = ?1 group by r.id order by r.name
  `).bind(access.user.workspace_id).all();
  return json({ ok: true, roles: (result.results || []).map((role) => ({ ...role, permissions: JSON.parse(role.permissions || "[]") })) });
}

async function listUsers(request, env) {
  const access = await requirePermission(request, env.DB, "users.view");
  if (access.response) return access.response;
  const result = await env.DB.prepare(`
    select au.id, au.email, au.status as auth_status, au.must_change_password, au.last_login_at,
           p.full_name, wm.status as member_status, r.role_key, r.name as role_name,
           au.created_at
    from auth_users au
    join workspace_members wm on wm.auth_user_id = au.id
    join roles r on r.id = wm.role_id
    left join profiles p on p.id = wm.profile_id
    where wm.workspace_id = ?1 order by p.full_name
  `).bind(access.user.workspace_id).all();
  return json({ ok: true, users: result.results || [] });
}

async function createUser(request, env) {
  const access = await requirePermission(request, env.DB, "users.create");
  if (access.response) return access.response;
  const body = await readJson(request);
  const fullName = String(body.fullName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const roleKey = String(body.roleKey || "professional").trim();
  if (fullName.length < 3 || !email.includes("@")) return json({ ok: false, error: "Nome e e-mail são obrigatórios" }, 400);
  const existing = await env.DB.prepare("select id from auth_users where lower(email) = ?1").bind(email).first();
  if (existing) return json({ ok: false, error: "Este e-mail já possui acesso" }, 409);
  const role = await env.DB.prepare("select id, role_key from roles where workspace_id = ?1 and role_key = ?2").bind(access.user.workspace_id, roleKey).first();
  if (!role) return json({ ok: false, error: "Papel inválido" }, 400);
  const authUserId = crypto.randomUUID();
  const profileId = crypto.randomUUID();
  const memberId = crypto.randomUUID();
  await env.DB.prepare("insert into auth_users (id, email, status, must_change_password) values (?1, ?2, 'pending', 1)").bind(authUserId, email).run();
  await env.DB.prepare("insert into profiles (id, workspace_id, full_name, email, role, active) values (?1, ?2, ?3, ?4, ?5, 1)").bind(profileId, access.user.workspace_id, fullName, email, roleKey).run();
  await env.DB.prepare("insert into workspace_members (id, workspace_id, auth_user_id, profile_id, role_id, status) values (?1, ?2, ?3, ?4, ?5, 'invited')").bind(memberId, access.user.workspace_id, authUserId, profileId, role.id).run();
  await writeAudit(env.DB, { workspaceId: access.user.workspace_id, actorUserId: access.user.auth_user_id, action: "user.create", resourceType: "auth_user", resourceId: authUserId, metadata: { roleKey } });
  return json({ ok: true, user: { id: authUserId, email, fullName, roleKey, status: "pending", mustChangePassword: true } }, 201);
}

async function route(request, env) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!["GET", "POST"].includes(request.method)) return json({ ok: false, error: "Método não suportado" }, 405);

  if (url.pathname === "/api/auth/login" && request.method === "POST") return login(request, env);
  if (url.pathname === "/api/auth/me" && request.method === "GET") {
    const user = await currentUser(request, env.DB);
    return user ? json({ ok: true, user: userPayload(user) }) : unauthorized();
  }
  if (url.pathname === "/api/auth/logout" && request.method === "POST") {
    const user = await currentUser(request, env.DB);
    if (!user) return unauthorized();
    await env.DB.prepare("update sessions set revoked_at = datetime('now') where id = ?1").bind(user.session_id).run();
    await writeAudit(env.DB, { workspaceId: user.workspace_id, actorUserId: user.auth_user_id, action: "auth.logout", resourceType: "session", resourceId: user.session_id });
    return json({ ok: true });
  }
  if (url.pathname === "/api/admin/roles" && request.method === "GET") return listRoles(request, env);
  if (url.pathname === "/api/admin/users" && request.method === "GET") return listUsers(request, env);
  if (url.pathname === "/api/admin/users" && request.method === "POST") return createUser(request, env);

  const workspaceId = url.searchParams.get("workspace") || DEFAULT_WORKSPACE_ID;
  if (url.pathname === "/api/health") {
    const workspace = await env.DB.prepare("select id, name from workspaces where id = ?1").bind(workspaceId).first();
    return json({ ok: true, service: "dona-de-ouro-demo-api", database: "cloudflare-d1", workspace });
  }
  if (url.pathname === "/api/bootstrap") {
    return json({ ok: true, source: "cloudflare-d1", data: await readBootstrap(env.DB, workspaceId) });
  }
  return json({ ok: false, error: "Rota não encontrada" }, 404);
}

export default {
  async fetch(request, env) {
    try {
      return await route(request, env);
    } catch (error) {
      return json({ ok: false, error: "Falha ao consultar o banco de demonstração", detail: error.message }, 500);
    }
  }
};
