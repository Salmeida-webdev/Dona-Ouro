import { brand } from "./brand.config.js";
import { integrationPorts } from "./integration.ports.js";
import { demoData } from "./demo.data.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const state = { signedIn: false, section: "dashboard" };
const labels = { dashboard: "Mesa de gestão", agenda: "Agenda", clientes: "Clientes", servicos: "Serviços", equipe: "Equipe", financeiro: "Financeiro", analises: "Análise de dados", relatorios: "Relatórios", configuracoes: "Configurações", acessos: "Usuários e acessos" };

function view(name) {
  $("#public-view").hidden = name !== "public";
  $("#login-view").hidden = name !== "login";
  $("#app-view").hidden = name !== "app";
  $$("[data-public-only]").forEach((node) => { node.hidden = name !== "public"; });
  document.body.classList.toggle("in-app", name === "app");
}

function dashboard() {
  return "<div class='page-heading'><div><p class='eyebrow'>terça-feira, 19 de novembro de 2026</p><h1>Bom dia, Camila.</h1><p class='page-lede'>Veja o que merece sua atenção hoje — e o que já está caminhando bem.</p></div><button class='button button-dark' data-open-modal>＋ Nova ação</button></div>" +
    "<section class='attention-banner'><div class='attention-mark'>✦</div><div><span class='mini-kicker'>Seu próximo foco</span><strong>Três clientes estão esperando um retorno seu.</strong><p>Uma pequena ação hoje pode manter relações importantes em movimento.</p></div><button class='text-button' data-demo-action>Ver lista →</button></section>" +
    "<section class='metrics-grid'><article class='metric-card metric-card-primary'><span class='mini-kicker'>Receita do mês</span><strong>R$ 18.420</strong><span class='metric-change positive'>↗ 12,8% <small>vs. mês anterior</small></span><div class='sparkline'><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></article><article class='metric-card'><span class='mini-kicker'>Atendimentos</span><strong>86</strong><span class='metric-change positive'>↗ 8,4% <small>esta semana</small></span><div class='metric-foot'><span>Meta semanal</span><b>72%</b></div><div class='bar-track'><span style='width:72%'></span></div></article><article class='metric-card'><span class='mini-kicker'>Clientes ativos</span><strong>142</strong><span class='metric-change'>+6 novos <small>neste mês</small></span><div class='avatar-stack'><i>AB</i><i>MC</i><i>JA</i><i>+3</i></div></article><article class='metric-card'><span class='mini-kicker'>Ticket médio</span><strong>R$ 214</strong><span class='metric-change positive'>↗ R$ 18 <small>de evolução</small></span><div class='metric-foot'><span>Melhor resultado</span><b>Outubro</b></div></article></section>" +
    "<section class='dashboard-grid'><article class='panel'><div class='panel-heading'><div><span class='mini-kicker'>Ritmo do negócio</span><h2>O dia em perspectiva</h2></div><button class='more-button'>···</button></div>" +
    "<div class='day-line'><span class='day-time'>08:00</span><div class='day-event'><i class='event-dot green'></i><div><strong>Abertura do espaço</strong><small>Rotina concluída às 08:14</small></div><b class='event-status done'>Concluído</b></div></div>" +
    "<div class='day-line'><span class='day-time'>09:00</span><div class='day-event'><i class='event-dot gold'></i><div><strong>Ana Beatriz · Coloração</strong><small>Hoje, às 09:00 · 2h</small></div><b class='event-status next'>Próximo</b></div></div>" +
    "<div class='day-line'><span class='day-time'>11:30</span><div class='day-event'><i class='event-dot muted'></i><div><strong>Retorno para Mariana Costa</strong><small>Follow-up pendente</small></div><b class='event-status attention'>Atenção</b></div></div>" +
    "<div class='day-line'><span class='day-time'>14:00</span><div class='day-event'><i class='event-dot muted'></i><div><strong>Juliana Alves · Experiência completa</strong><small>Hoje, às 14:00 · 1h30</small></div><b class='event-status'>Agendado</b></div></div></article>" +
    "<article class='panel'><div class='panel-heading'><div><span class='mini-kicker'>Leitura da semana</span><h2>O que está se formando</h2></div><span class='panel-icon'>↗</span></div>" +
    "<div class='opportunity'><span class='opportunity-number'>01</span><div><strong>Seu retorno está criando recorrência</strong><p>Clientes com acompanhamento voltaram 24% mais neste ciclo.</p></div></div>" +
    "<div class='opportunity'><span class='opportunity-number'>02</span><div><strong>Quarta-feira tem espaço</strong><p>Você pode abrir 2 horários sem sobrecarregar a operação.</p></div></div>" +
    "<div class='opportunity'><span class='opportunity-number'>03</span><div><strong>Coloração é seu destaque</strong><p>Representa 38% do seu resultado nos últimos 30 dias.</p></div></div><button class='panel-link' data-demo-action>Explorar leitura completa →</button></article></section>";
}

function collection(title, description, items) {
  const rows = items.map((item, index) => {
    const initials = item.split(" ").map((word) => word[0]).slice(0, 2).join("");
    const status = index === 1 ? "Atenção" : "Em dia";
    const statusClass = index === 1 ? "status-gold" : "";
    const movement = index % 2 ? "Próximo movimento amanhã" : "Em acompanhamento hoje";
    return "<div class='collection-row'><span class='row-index'>0" + (index + 1) + "</span><div class='row-avatar'>" + initials + "</div><div class='row-main'><strong>" + item + "</strong><small>" + movement + "</small></div><span class='row-status " + statusClass + "'>" + status + "</span><button class='more-button'>···</button></div>";
  }).join("");
  return "<div class='page-heading'><div><p class='eyebrow'>Operação</p><h1>" + title + "</h1><p class='page-lede'>" + description + "</p></div><button class='button button-dark' data-open-modal>＋ Nova ação</button></div>" +
    "<section class='collection-toolbar'><div class='search-field'><span>⌕</span><input placeholder='Buscar em " + title.toLowerCase() + "' /><kbd>⌘ K</kbd></div><button class='filter-button' data-demo-action>Filtros ＋</button><button class='view-button active'>▦</button><button class='view-button'>☷</button></section>" +
    "<section class='panel'><div class='panel-heading'><div><span class='mini-kicker'>Acompanhamento</span><h2>" + items.length + " registros para acompanhar</h2></div><span class='collection-count'>Atualizado agora</span></div><div class='collection-list'>" + rows + "</div></section>";
}

function agendaPage() {
  const rows = demoData.appointments.map((item) => "<div class='agenda-row'><span class='agenda-time'>" + item.time + "</span><span class='agenda-rail rail-" + item.tone + "'></span><div class='agenda-person'><div class='row-avatar'>" + item.client.split(" ").map((word) => word[0]).slice(0, 2).join("") + "</div><div><strong>" + item.client + "</strong><small>" + item.service + " · " + item.duration + " · " + item.professional + "</small></div></div><span class='row-status status-" + item.tone + "'>" + item.status + "</span><button class='more-button'>···</button></div>").join("");
  return "<div class='page-heading'><div><p class='eyebrow'>Operação</p><h1>Agenda</h1><p class='page-lede'>Um lugar calmo para organizar o que acontece a seguir.</p></div><button class='button button-dark' data-open-modal>＋ Novo atendimento</button></div>" +
    "<section class='agenda-summary'><article><span class='mini-kicker'>Hoje</span><strong>06</strong><small>atendimentos</small></article><article><span class='mini-kicker'>Ocupação</span><strong>78%</strong><small>da capacidade</small></article><article><span class='mini-kicker'>Próximo espaço</span><strong>12:15</strong><small>45 minutos livres</small></article><article><span class='mini-kicker'>Confirmações</span><strong>92%</strong><small>já confirmados</small></article></section>" +
    "<section class='agenda-toolbar'><button class='calendar-arrow'>←</button><strong>Hoje, 19 de novembro</strong><button class='calendar-arrow'>→</button><div class='calendar-spacer'></div><button class='filter-button'>Todos os profissionais⌄</button><button class='view-button active'>Dia</button><button class='view-button'>Semana</button></section>" +
    "<section class='panel agenda-panel'><div class='panel-heading'><div><span class='mini-kicker'>Quarta-feira</span><h2>Seu dia em perspectiva</h2></div><span class='collection-count'>Horário de Brasília</span></div>" + rows + "</section>";
}

function customersPage() {
  const rows = demoData.customers.map((customer, index) => "<button class='customer-table-row' data-customer='" + customer.id + "'><span class='row-index'>0" + (index + 1) + "</span><span class='row-avatar avatar-" + customer.tone + "'>" + customer.initials + "</span><span class='customer-cell customer-name'><strong>" + customer.name + "</strong><small>" + customer.email + "</small></span><span class='customer-cell'><strong>" + customer.lastVisit + "</strong><small>" + customer.visits + " atendimentos</small></span><span class='customer-cell'><strong>" + customer.nextStep + "</strong><small>" + customer.tag + "</small></span><span class='row-status status-" + customer.tone + "'>" + customer.status + "</span><span class='customer-total'>" + customer.total + "</span></button>").join("");
  return "<div class='page-heading'><div><p class='eyebrow'>Relacionamentos</p><h1>Clientes</h1><p class='page-lede'>Contexto para cuidar de cada relação com mais intenção.</p></div><button class='button button-dark' data-open-modal>＋ Novo cliente</button></div>" +
    "<section class='customer-summary'><div><span class='mini-kicker'>Base ativa</span><strong>142</strong><small>clientes acompanhados</small></div><div><span class='mini-kicker'>Precisam de atenção</span><strong>18</strong><small>próximo passo em aberto</small></div><div><span class='mini-kicker'>Novos no mês</span><strong>24</strong><small>+18,2% vs. outubro</small></div><div><span class='mini-kicker'>Recorrência</span><strong>68%</strong><small>retornaram neste ciclo</small></div></section>" +
    "<section class='collection-toolbar'><div class='search-field'><span>⌕</span><input id='customer-search' placeholder='Buscar por nome, telefone ou etiqueta' /><kbd>⌘ K</kbd></div><button class='filter-button' data-demo-action>Status: todos⌄</button><button class='filter-button' data-demo-action>Mais filtros ＋</button></section>" +
    "<section class='panel customer-table'><div class='customer-table-head'><span>Cliente</span><span>Último movimento</span><span>Próximo passo</span><span>Status</span><span>Total</span></div>" + rows + "</section>";
}

function servicesPage() {
  const cards = demoData.services.map((service) => "<article class='service-card'><div class='service-card-top'><span class='service-symbol'>" + service.category.slice(0, 1) + "</span><span class='row-status " + (service.active ? "status-green" : "status-muted") + "'>" + (service.active ? "Ativo" : "Pausado") + "</span></div><span class='mini-kicker'>" + service.category + "</span><h3>" + service.name + "</h3><div class='service-price'><strong>" + service.price + "</strong><small>" + service.duration + "</small></div><div class='service-card-foot'><span>" + service.bookings + " agendamentos</span><b>" + service.revenue + "</b></div></article>").join("");
  return "<div class='page-heading'><div><p class='eyebrow'>Operação</p><h1>Serviços</h1><p class='page-lede'>Uma visão clara do que você oferece e do que gera valor.</p></div><button class='button button-dark' data-open-modal>＋ Novo serviço</button></div>" +
    "<section class='service-summary'><article><span class='mini-kicker'>Serviços ativos</span><strong>07</strong><small>de 08 cadastrados</small></article><article><span class='mini-kicker'>Mais procurado</span><strong>Corte</strong><small>52 agendamentos</small></article><article><span class='mini-kicker'>Maior receita</span><strong>Experiência</strong><small>R$ 13.440 no ciclo</small></article></section><section class='service-grid'>" + cards + "</section>";
}

function teamPage() {
  const cards = demoData.team.map((member) => "<article class='team-card'><div class='team-card-head'><span class='team-avatar avatar-" + member.color + "'>" + member.initials + "</span><span class='online-state'><i></i>" + member.status + "</span><button class='more-button'>···</button></div><h3>" + member.name + "</h3><p>" + member.role + "</p><div class='team-stat-row'><span><small>Atendimentos</small><strong>" + member.appointments + "</strong></span><span><small>Gerado no ciclo</small><strong>" + member.revenue + "</strong></span></div><button class='team-link' data-demo-action>Ver desempenho →</button></article>").join("");
  return "<div class='page-heading'><div><p class='eyebrow'>Operação</p><h1>Equipe</h1><p class='page-lede'>Cada pessoa alinhada ao mesmo ritmo de cuidado.</p></div><button class='button button-dark' data-open-modal>＋ Convidar pessoa</button></div><section class='team-summary'><div><span class='mini-kicker'>Pessoas ativas</span><strong>05</strong><small>no espaço</small></div><div><span class='mini-kicker'>Em atendimento</span><strong>01</strong><small>neste momento</small></div><div><span class='mini-kicker'>Atendimentos do mês</span><strong>86</strong><small>+8,4% no ciclo</small></div></section><section class='team-grid'>" + cards + "</section>";
}

function finance() {
  return "<div class='page-heading'><div><p class='eyebrow'>Resultado</p><h1>Financeiro</h1><p class='page-lede'>O resultado do seu trabalho, sem ruído.</p></div><button class='button button-dark' data-open-modal>＋ Novo lançamento</button></div>" +
    "<section class='metrics-grid finance-metrics'><article class='metric-card metric-card-primary'><span class='mini-kicker'>Saldo projetado</span><strong>R$ 24.880</strong><span class='metric-change positive'>↗ 14,2% <small>neste ciclo</small></span></article><article class='metric-card'><span class='mini-kicker'>Entradas</span><strong>R$ 31.240</strong><span class='metric-change positive'>18 lançamentos</span></article><article class='metric-card'><span class='mini-kicker'>Saídas</span><strong>R$ 6.360</strong><span class='metric-change'>9 lançamentos</span></article></section>" +
    "<section class='dashboard-grid'><article class='panel chart-panel'><div class='panel-heading'><div><span class='mini-kicker'>Movimento financeiro</span><h2>O seu resultado ao longo do tempo</h2></div><button class='filter-button'>Últimos 6 meses⌄</button></div><div class='fake-chart'><div class='chart-y'><span>30k</span><span>20k</span><span>10k</span><span>0</span></div><div class='chart-area'><div class='chart-line'></div><div class='chart-bars'><i style='height:42%'></i><i style='height:54%'></i><i style='height:49%'></i><i style='height:66%'></i><i style='height:61%'></i><i style='height:82%'></i></div><div class='chart-x'><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span></div></div></div></article>" +
    "<article class='panel'><div class='panel-heading'><div><span class='mini-kicker'>Últimos movimentos</span><h2>Hoje</h2></div></div><div class='transaction'><span class='transaction-mark in'>↑</span><div><strong>Experiência completa</strong><small>Juliana Alves</small></div><b>+ R$ 420</b></div><div class='transaction'><span class='transaction-mark out'>↓</span><div><strong>Produtos profissionais</strong><small>Fornecedor · hoje</small></div><b class='expense'>− R$ 180</b></div><div class='transaction'><span class='transaction-mark in'>↑</span><div><strong>Coloração</strong><small>Ana Beatriz</small></div><b>+ R$ 280</b></div></article></section>";
}

function reports() {
  return "<div class='page-heading'><div><p class='eyebrow'>Resultado</p><h1>Relatórios</h1><p class='page-lede'>Perguntas melhores para decisões mais tranquilas.</p></div><button class='button button-dark' data-demo-action>Exportar visão</button></div><section class='report-grid'><article class='report-card report-card-dark'><span class='mini-kicker'>Visão mensal</span><h2>O que mudou no seu negócio em novembro?</h2><p>Uma leitura executiva das principais movimentações.</p><button class='button button-light' data-demo-action>Abrir relatório →</button></article><article class='report-card'><span class='mini-kicker'>Clientes</span><strong>142</strong><p>clientes ativos acompanhados</p><div class='report-meter'><span style='width:74%'></span></div><small>74% com próximo passo definido</small></article><article class='report-card'><span class='mini-kicker'>Recorrência</span><strong>68%</strong><p>dos clientes retornaram</p><div class='report-meter gold'><span style='width:68%'></span></div><small>+9% comparado ao ciclo anterior</small></article></section>";
}

function settings() {
  return "<div class='page-heading'><div><p class='eyebrow'>Seu espaço</p><h1>Configurações</h1><p class='page-lede'>Ajuste a experiência para que ela tenha a sua cara.</p></div><button class='button button-dark' data-demo-action>Salvar alterações</button></div><section class='settings-layout'><nav class='settings-nav'><button class='active'>Identidade do espaço</button><button>Equipe e acessos</button><button>Preferências</button><button>Notificações</button><button>Plano e cobrança</button></nav><article class='panel settings-panel'><span class='mini-kicker'>Identidade do espaço</span><h2>Como sua operação aparece</h2><p class='settings-intro'>Essas informações ajudam a manter sua experiência coerente em todos os pontos.</p><label>Nome do espaço<input value='Casa Oliveira' /></label><label>Mensagem de acolhimento<textarea rows='3'>Cuidar bem também é uma forma de crescer.</textarea></label><div class='settings-divider'></div><div class='settings-brand-preview'><img src='./assets/logo-transparente.png' alt='Prévia da marca' /><div><strong>Logo principal</strong><small>PNG · aplicação clara</small></div><button class='text-button' data-demo-action>Trocar imagem</button></div></article></section>";
}

function accessControlPage() {
  const roles = [
    ["owner", "Proprietária", "Acesso total ao espaço e à segurança."],
    ["admin", "Administradora", "Operação, equipe e configurações."],
    ["manager", "Gestora", "Operação, equipe e indicadores."],
    ["reception", "Recepção", "Agenda, clientes e atendimento."],
    ["professional", "Profissional", "Agenda própria e clientes autorizados."],
    ["analyst", "Analista", "Indicadores e relatórios sem mutações."]
  ];
  const roleCards = roles.map(([key, name, description]) => "<article class='access-role-card'><span class='mini-kicker'>" + key + "</span><h3>" + name + "</h3><p>" + description + "</p><small>Permissões governadas por papel</small></article>").join("");
  return "<div class='page-heading'><div><p class='eyebrow'>Segurança do espaço</p><h1>Usuários e acessos</h1><p class='page-lede'>Defina quem entra, o que cada pessoa pode fazer e mantenha tudo rastreável.</p></div><span class='row-status status-green'>RBAC ativo</span></div>" +
    "<section class='analytics-kpis access-kpis'><article class='analytics-kpi kpi-primary'><span class='mini-kicker'>Usuários cadastrados</span><strong>01</strong><span class='kpi-trend'>Proprietária ativa</span></article><article class='analytics-kpi'><span class='mini-kicker'>Papéis disponíveis</span><strong>06</strong><span class='kpi-trend positive'>Permissões por função</span></article><article class='analytics-kpi'><span class='mini-kicker'>Auditoria</span><strong>Ativa</strong><span class='kpi-trend'>Sessões e alterações registradas</span></article></section>" +
    "<section class='settings-layout access-layout'><article class='panel settings-panel'><div class='panel-heading'><div><span class='mini-kicker'>Novo acesso</span><h2>Adicionar usuário</h2></div></div><p class='settings-intro'>O convite será criado como pendente e a pessoa definirá a própria senha no primeiro acesso.</p><form id='create-user-form'><label>Nome completo<input name='fullName' placeholder='Ex.: Lara Mendes' required /></label><label>E-mail de acesso<input type='email' name='email' placeholder='pessoa@empresa.com' required /></label><label>Tipo de usuário<select name='roleKey' required><option value='professional'>Profissional</option><option value='reception'>Recepção</option><option value='manager'>Gestora</option><option value='analyst'>Analista</option><option value='admin'>Administradora</option></select></label><button class='button button-dark button-full' type='submit'>Criar usuário</button><p class='form-feedback' id='user-form-feedback' role='status'></p></form></article><article class='panel'><div class='panel-heading'><div><span class='mini-kicker'>Acessos atuais</span><h2>Quem pode entrar</h2></div><button class='panel-link' data-demo-action>Ver auditoria →</button></div><div class='collection-list'><div class='collection-row'><span class='row-avatar avatar-green'>CO</span><div class='row-main'><strong>segundoalmeidawebdev@gmail.com</strong><small>Proprietária · Casa Oliveira</small></div><span class='row-status status-green'>Ativo</span></div></div><p class='settings-intro access-note'>A senha nunca aparece nesta tela. O banco guarda somente o hash PBKDF2 e os eventos de acesso.</p></article></section>" +
    "<section class='access-role-grid'><div class='panel-heading'><div><p class='eyebrow'>Matriz de acesso</p><h2>Tipos de usuário</h2></div></div>" + roleCards + "</section>";
}

function analytics() {
  const a = demoData.analytics;
  const max = Math.max(...demoData.monthlyRevenue);
  const months = ["Jun", "Jul", "Ago", "Set", "Out", "Nov"];
  const bars = demoData.monthlyRevenue.map((value, index) => "<div class='analytics-bar-wrap'><span class='analytics-value'>R$ " + (value / 1000).toFixed(1).replace(".", ",") + "k</span><i class='analytics-bar " + (index === demoData.monthlyRevenue.length - 1 ? "current" : "") + "' style='height:" + Math.round((value / max) * 100) + "%'></i><small>" + months[index] + "</small></div>").join("");
  const teamRows = demoData.team.slice(0, 4).map((member, index) => "<div class='analytics-team-row'><span class='team-rank'>0" + (index + 1) + "</span><span class='team-mini-avatar avatar-" + member.color + "'>" + member.initials + "</span><div><strong>" + member.name + "</strong><small>" + member.role + "</small></div><b>" + member.appointments + " atend.</b><strong class='team-revenue'>" + member.revenue + "</strong></div>").join("");
  return "<div class='page-heading'><div><p class='eyebrow'>Inteligência do negócio</p><h1>Análise de dados</h1><p class='page-lede'>Transforme movimento em clareza para decidir melhor.</p></div><div class='heading-actions'><button class='filter-button'>01–30 nov 2026⌄</button><button class='button button-dark' data-demo-action>Exportar análise</button></div></div>" +
    "<section class='analytics-kpis'><article class='analytics-kpi kpi-primary'><span class='mini-kicker'>Receita acumulada</span><strong>R$ 18.420</strong><span class='kpi-trend'>↗ " + a.revenueGrowth + " <small>vs. período anterior</small></span></article><article class='analytics-kpi'><span class='mini-kicker'>Taxa de ocupação</span><strong>" + a.occupancyRate + "</strong><span class='kpi-trend positive'>↗ 3 p.p. <small>melhor aproveitamento</small></span></article><article class='analytics-kpi'><span class='mini-kicker'>Retenção de clientes</span><strong>" + a.retentionRate + "</strong><span class='kpi-trend positive'>↗ 5 p.p. <small>neste ciclo</small></span></article><article class='analytics-kpi'><span class='mini-kicker'>Ticket médio</span><strong>" + a.averageTicket + "</strong><span class='kpi-trend positive'>↗ 8,2% <small>por atendimento</small></span></article><article class='analytics-kpi'><span class='mini-kicker'>Novos clientes</span><strong>" + a.newCustomers + "</strong><span class='kpi-trend'>+" + a.reactivatedCustomers + " reativados <small>no período</small></span></article><article class='analytics-kpi'><span class='mini-kicker'>NPS do espaço</span><strong>" + a.nps + "</strong><span class='kpi-trend positive'>Excelente <small>experiência percebida</small></span></article></section>" +
    "<section class='analytics-grid'><article class='panel analytics-chart-panel'><div class='panel-heading'><div><span class='mini-kicker'>Evolução financeira</span><h2>Receita mês a mês</h2></div><span class='analytics-legend'><i></i> Receita</span></div><div class='analytics-chart'>" + bars + "</div><div class='analytics-chart-footer'><span>Junho</span><strong>R$ 18.420 no período atual</strong><span>Novembro</span></div></article><article class='panel'><div class='panel-heading'><div><span class='mini-kicker'>Funil de relacionamento</span><h2>Como os clientes avançam</h2></div><button class='more-button'>···</button></div><div class='funnel-row'><span>Interessados</span><div><i style='width:100%'></i></div><b>186</b></div><div class='funnel-row'><span>Primeiro atendimento</span><div><i style='width:72%'></i></div><b>134</b></div><div class='funnel-row'><span>Retornaram</span><div><i style='width:48%'></i></div><b>89</b></div><div class='funnel-row'><span>Recorrentes</span><div><i style='width:31%'></i></div><b>58</b></div><div class='analytics-insight'><span>✦</span><p>A maior oportunidade está entre primeiro atendimento e retorno.</p></div></article></section>" +
    "<section class='analytics-grid analytics-grid-bottom'><article class='panel'><div class='panel-heading'><div><span class='mini-kicker'>Indicadores operacionais</span><h2>Saúde da operação</h2></div></div><div class='health-indicator'><div class='health-head'><span>Cancelamentos</span><b>" + a.cancellationRate + "</b></div><div class='health-track'><i style='width:24%'></i></div><small>Abaixo do limite recomendado de 7%</small></div><div class='health-indicator'><div class='health-head'><span>Conversão de oportunidades</span><b>" + a.conversionRate + "</b></div><div class='health-track'><i style='width:32%'></i></div><small>+6 p.p. comparado ao último ciclo</small></div><div class='health-indicator'><div class='health-head'><span>Melhor dia</span><b>" + a.bestDay + "</b></div><div class='health-track gold-track'><i style='width:84%'></i></div><small>84% de ocupação média</small></div></article><article class='panel'><div class='panel-heading'><div><span class='mini-kicker'>Desempenho da equipe</span><h2>Quem está puxando o resultado</h2></div><button class='panel-link' data-demo-action>Ver equipe →</button></div><div class='analytics-team'>" + teamRows + "</div></article></section>" +
    "<section class='analytics-insights-panel'><div><p class='eyebrow'>Leitura executiva</p><h2>O que os dados estão dizendo</h2></div><div class='executive-insights'><article><span>01</span><strong>" + a.bestService + " é o serviço de maior potencial.</strong><p>Ele combina procura, ticket e possibilidade de recorrência.</p></article><article><span>02</span><strong>" + a.bestProfessional + " lidera o resultado da equipe.</strong><p>Vale investigar o padrão de atendimento para compartilhar com o time.</p></article><article><span>03</span><strong>Existe espaço para recuperar clientes parados.</strong><p>" + a.reactivatedCustomers + " pessoas voltaram após uma ação de relacionamento.</p></article></div></section>";
}

function render(section = state.section) {
  state.section = section;
  $("#current-section-label").textContent = labels[section];
  $$(".nav-item[data-section]").forEach((item) => item.classList.toggle("active", item.dataset.section === section));
  const content = { dashboard: dashboard(), agenda: agendaPage(), clientes: customersPage(), servicos: servicesPage(), equipe: teamPage(), financeiro: finance(), analises: analytics(), relatorios: reports(), configuracoes: settings(), acessos: accessControlPage() };
  $("#app-main-content").innerHTML = content[section];
  bindActions();
}

function toastMessage(message) { const node = $("#toast"); node.textContent = message; node.classList.add("visible"); clearTimeout(toastMessage.timer); toastMessage.timer = setTimeout(() => node.classList.remove("visible"), 3000); }

async function syncDemoData() {
  try {
    const response = await integrationPorts.api.bootstrap();
    if (response?.data) Object.assign(demoData, response.data);
    return true;
  } catch (error) {
    console.warn("API D1 indisponível; mantendo dados locais de demonstração.", error);
    return false;
  }
}

function openModal() { $("#quick-modal").hidden = false; document.body.classList.add("modal-open"); }
function closeModal() { $("#quick-modal").hidden = true; document.body.classList.remove("modal-open"); }
function bindActions() {
  $$("[data-open-modal]").forEach((button) => button.addEventListener("click", openModal));
  $$("[data-demo-action]").forEach((button) => button.addEventListener("click", () => toastMessage("Esta ação está preparada para a próxima camada de dados.")));
  $$(".nav-item[data-section]").forEach((button) => button.addEventListener("click", () => render(button.dataset.section)));
  $$("[data-customer]").forEach((button) => button.addEventListener("click", () => {
    const customer = demoData.customers.find((item) => item.id === button.dataset.customer);
    if (customer) toastMessage("Ficha de " + customer.name + " pronta para abrir na próxima camada.");
  }));
  $("#customer-search")?.addEventListener("input", (event) => {
    const term = event.target.value.toLowerCase();
    $$("[data-customer]").forEach((row) => { row.hidden = !row.textContent.toLowerCase().includes(term); });
  });
  $("#create-user-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const feedback = $("#user-form-feedback");
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    feedback.textContent = "Criando acesso…";
    try {
      await integrationPorts.users.create({ fullName: form.elements.fullName.value, email: form.elements.email.value, roleKey: form.elements.roleKey.value });
      form.reset();
      feedback.textContent = "";
      toastMessage("Usuário criado como convite pendente.");
      render("acessos");
    } catch {
      feedback.textContent = "Não foi possível criar este usuário. Verifique o e-mail.";
      button.disabled = false;
    }
  });
}
function navigate() {
  const hash = location.hash.replace("#", "") || "home";
  const sections = Object.keys(labels);
  if (state.signedIn && sections.includes(hash)) { view("app"); render(hash); }
  else if (hash === "login") view("login");
  else view("public");
  if (hash === "login") setTimeout(() => $("#login-password")?.focus(), 0);
  scrollTo({ top: 0, behavior: "smooth" });
}

$("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const password = form.elements.password.value;
  if (password.length < 8) { $("#login-feedback").textContent = "A senha precisa ter pelo menos 8 caracteres."; form.elements.password.focus(); return; }
  $("#login-feedback").textContent = "Preparando sua área de gestão…";
  try {
    await integrationPorts.auth.signIn({ email: form.elements.email.value, password });
    const live = await syncDemoData();
    state.signedIn = true;
    $("#login-feedback").textContent = "";
    location.hash = "dashboard";
    toastMessage(live ? "Login confirmado. Dados carregados do Cloudflare D1." : "Login confirmado. Modo demonstração local carregado.");
  } catch {
    $("#login-feedback").textContent = "E-mail ou senha inválidos.";
    form.elements.password.focus();
  }
});
$$("[data-password-toggle]").forEach((button) => button.addEventListener("click", () => { const input = button.parentElement.querySelector("input"); input.type = input.type === "password" ? "text" : "password"; button.textContent = input.type === "password" ? "Mostrar" : "Ocultar"; }));
$$("[data-mobile-menu]").forEach((button) => button.addEventListener("click", () => { const header = button.closest(".public-header"); const open = header.classList.toggle("menu-open"); button.setAttribute("aria-expanded", String(open)); }));
$("[data-app-menu]").addEventListener("click", () => $("[data-sidebar]").classList.toggle("mobile-open"));
$("[data-close-modal]").addEventListener("click", closeModal);
$("#quick-modal").addEventListener("click", (event) => { if (event.target.id === "quick-modal") closeModal(); });
$$("[data-quick-action]").forEach((button) => button.addEventListener("click", () => { closeModal(); toastMessage("Ação preparada para conexão futura."); }));
$$("[data-forgot-password]").forEach((link) => link.addEventListener("click", (event) => { event.preventDefault(); toastMessage("O fluxo de recuperação está preparado para a integração de autenticação."); }));
window.addEventListener("hashchange", navigate);
window.addEventListener("load", async () => {
  if (localStorage.getItem("dona-de-ouro-session")) {
    try { await integrationPorts.auth.me(); state.signedIn = true; }
    catch { localStorage.removeItem("dona-de-ouro-session"); }
  }
  navigate();
});
Object.entries(brand.colors).forEach(([key, value]) => document.documentElement.style.setProperty("--" + key.replace(/[A-Z]/g, (letter) => "-" + letter.toLowerCase()), value));
