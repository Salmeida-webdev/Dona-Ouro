-- Seed fictício compatível com Cloudflare D1 / SQLite.
insert or ignore into workspaces (id, name, city, segment) values
('ws-demo-001', 'Casa Oliveira', 'João Pessoa · PB', 'Espaço de beleza');

insert or ignore into profiles (id, workspace_id, full_name, email, role) values
('pro-demo-001','ws-demo-001','Camila Oliveira','camila.demo@donadeouro.local','admin'),
('pro-demo-002','ws-demo-001','Lara Mendes','lara.demo@donadeouro.local','professional'),
('pro-demo-003','ws-demo-001','Bia Santos','bia.demo@donadeouro.local','professional'),
('pro-demo-004','ws-demo-001','Nina Rocha','nina.demo@donadeouro.local','professional'),
('pro-demo-005','ws-demo-001','Tainá Alves','taina.demo@donadeouro.local','reception');

insert or ignore into permissions (id, permission_key, description) values
('perm-dashboard-view','dashboard.view','Visualizar a mesa de gestão'),
('perm-appointments-view','appointments.view','Visualizar agenda e atendimentos'),
('perm-appointments-manage','appointments.manage','Criar, editar e cancelar atendimentos'),
('perm-customers-view','customers.view','Visualizar clientes autorizados'),
('perm-customers-manage','customers.manage','Criar e editar clientes'),
('perm-services-view','services.view','Visualizar serviços'),
('perm-services-manage','services.manage','Criar e editar serviços'),
('perm-team-view','team.view','Visualizar equipe'),
('perm-team-manage','team.manage','Gerenciar equipe e acessos'),
('perm-finance-view','finance.view','Visualizar financeiro'),
('perm-finance-manage','finance.manage','Gerenciar lançamentos financeiros'),
('perm-analytics-view','analytics.view','Visualizar análise de dados'),
('perm-reports-view','reports.view','Visualizar relatórios'),
('perm-reports-export','reports.export','Exportar relatórios'),
('perm-settings-view','settings.view','Visualizar configurações'),
('perm-settings-manage','settings.manage','Alterar configurações'),
('perm-users-view','users.view','Visualizar usuários e papéis'),
('perm-users-create','users.create','Criar usuários e enviar convites'),
('perm-users-manage','users.manage','Alterar papéis, status e permissões'),
('perm-audit-view','audit.view','Visualizar trilha de auditoria');

insert or ignore into roles (id, workspace_id, name, role_key, description) values
('role-owner','ws-demo-001','Proprietária','owner','Acesso total ao espaço e à segurança'),
('role-admin','ws-demo-001','Administradora','admin','Acesso operacional e administrativo'),
('role-manager','ws-demo-001','Gestora','manager','Acesso à operação, equipe e indicadores'),
('role-reception','ws-demo-001','Recepção','reception','Agenda, clientes e atendimento'),
('role-professional','ws-demo-001','Profissional','professional','Agenda própria e clientes autorizados'),
('role-analyst','ws-demo-001','Analista','analyst','Indicadores e relatórios sem mutações');

insert or ignore into role_permissions (role_id, permission_id)
select 'role-owner', id from permissions;
insert or ignore into role_permissions (role_id, permission_id)
select 'role-admin', id from permissions where permission_key not in ('audit.view');
insert or ignore into role_permissions (role_id, permission_id)
select 'role-manager', id from permissions where permission_key in ('dashboard.view','appointments.view','appointments.manage','customers.view','customers.manage','services.view','services.manage','team.view','team.manage','analytics.view','reports.view','reports.export','settings.view');
insert or ignore into role_permissions (role_id, permission_id)
select 'role-reception', id from permissions where permission_key in ('dashboard.view','appointments.view','appointments.manage','customers.view','customers.manage','services.view');
insert or ignore into role_permissions (role_id, permission_id)
select 'role-professional', id from permissions where permission_key in ('dashboard.view','appointments.view','customers.view','services.view');
insert or ignore into role_permissions (role_id, permission_id)
select 'role-analyst', id from permissions where permission_key in ('dashboard.view','analytics.view','reports.view','reports.export');

insert or ignore into auth_users (id, email, status, must_change_password)
values ('usr-demo-001','segundoalmeidawebdev@gmail.com','pending',1);

insert or ignore into workspace_members (id, workspace_id, auth_user_id, profile_id, role_id, status)
values ('member-demo-001','ws-demo-001','usr-demo-001','pro-demo-001','role-owner','active');

insert or ignore into services (id, workspace_id, name, category, duration_minutes, price, active) values
('srv-demo-001','ws-demo-001','Experiência completa','Experiência',150,420,1),
('srv-demo-002','ws-demo-001','Coloração','Cabelos',120,280,1),
('srv-demo-003','ws-demo-001','Corte e finalização','Cabelos',60,180,1),
('srv-demo-004','ws-demo-001','Design de sobrancelhas','Beleza',45,90,1),
('srv-demo-005','ws-demo-001','Tratamento de reconstrução','Cabelos',90,210,1),
('srv-demo-006','ws-demo-001','Manutenção de cor','Cabelos',90,220,1),
('srv-demo-007','ws-demo-001','Escova e styling','Finalização',45,110,0),
('srv-demo-008','ws-demo-001','Consultoria de imagem','Experiência',60,160,1);

insert or ignore into customers (id, workspace_id, full_name, email, phone, status, tags, last_visit_at, next_step, total_spent, visits_count) values
('cli-demo-001','ws-demo-001','Ana Beatriz','ana.beatriz@email.com','(83) 98821-4012','active','["Coloração"]','2026-11-19','Retorno em 30 dias',2840,12),
('cli-demo-002','ws-demo-001','Mariana Costa','mariana.costa@email.com','(83) 99642-1188','attention','["Recorrente"]','2026-10-08','Enviar mensagem hoje',1920,8),
('cli-demo-003','ws-demo-001','Juliana Alves','juliana.alves@email.com','(83) 99180-7344','active','["Premium"]','2026-11-12','Confirmar sexta-feira',3480,15),
('cli-demo-004','ws-demo-001','Paula Martins','paula.martins@email.com','(83) 98734-9061','new','["Nova"]',null,'Primeiro atendimento',0,0),
('cli-demo-005','ws-demo-001','Fernanda Souza','fernanda.souza@email.com','(83) 99873-2264','active','["Corte"]','2026-11-05','Sugerir tratamento',1760,6),
('cli-demo-006','ws-demo-001','Larissa Melo','larissa.melo@email.com','(83) 98802-6531','attention','["Reativação"]','2026-09-12','Reativar relacionamento',980,4),
('cli-demo-007','ws-demo-001','Carolina Nunes','carolina.nunes@email.com','(83) 99152-8176','active','["Design"]','2026-11-15','Acompanhar satisfação',2110,9),
('cli-demo-008','ws-demo-001','Beatriz Lima','beatriz.lima@email.com','(83) 99601-4438','new','["Nova"]',null,'Confirmar cadastro',0,0),
('cli-demo-009','ws-demo-001','Renata Gomes','renata.gomes@email.com','(83) 98872-1190','active','["Premium"]','2026-10-29','Agendar manutenção',4230,18),
('cli-demo-010','ws-demo-001','Isabela Rocha','isabela.rocha@email.com','(83) 99723-8004','attention','["Inativa"]','2026-09-29','Enviar condição especial',1340,5);

insert or ignore into appointments (id, workspace_id, customer_id, service_id, professional_id, starts_at, ends_at, status, notes) values
('apt-demo-001','ws-demo-001',null,null,'pro-demo-001','2026-11-19T08:00:00-03:00','2026-11-19T08:30:00-03:00','completed','Abertura do espaço'),
('apt-demo-002','ws-demo-001','cli-demo-001','srv-demo-002','pro-demo-002','2026-11-19T09:00:00-03:00','2026-11-19T11:00:00-03:00','confirmed','Coloração'),
('apt-demo-003','ws-demo-001','cli-demo-002',null,'pro-demo-001','2026-11-19T11:30:00-03:00','2026-11-19T11:45:00-03:00','attention','Follow-up pendente'),
('apt-demo-004','ws-demo-001','cli-demo-003','srv-demo-001','pro-demo-002','2026-11-19T14:00:00-03:00','2026-11-19T15:30:00-03:00','scheduled','Experiência completa'),
('apt-demo-005','ws-demo-001','cli-demo-004','srv-demo-004','pro-demo-003','2026-11-19T16:30:00-03:00','2026-11-19T17:15:00-03:00','scheduled','Primeiro atendimento'),
('apt-demo-006','ws-demo-001','cli-demo-005','srv-demo-003','pro-demo-004','2026-11-19T18:00:00-03:00','2026-11-19T19:00:00-03:00','scheduled','Corte e finalização');

insert or ignore into transactions (id, workspace_id, appointment_id, description, detail, type, amount, occurred_on) values
('txn-demo-001','ws-demo-001','apt-demo-004','Experiência completa','Juliana Alves','income',420,'2026-11-19'),
('txn-demo-002','ws-demo-001',null,'Produtos profissionais','Fornecedor','expense',180,'2026-11-19'),
('txn-demo-003','ws-demo-001','apt-demo-002','Coloração','Ana Beatriz','income',280,'2026-11-18'),
('txn-demo-004','ws-demo-001','apt-demo-006','Corte e finalização','Fernanda Souza','income',180,'2026-11-18'),
('txn-demo-005','ws-demo-001',null,'Aluguel do espaço','Custo fixo','expense',2400,'2026-11-17'),
('txn-demo-006','ws-demo-001',null,'Manutenção de equipamentos','Operação','expense',320,'2026-11-15');

insert or ignore into tasks (id, workspace_id, customer_id, title, due_at, priority, completed) values
('task-demo-001','ws-demo-001','cli-demo-002','Retornar Mariana Costa','2026-11-19T11:30:00-03:00','high',0),
('task-demo-002','ws-demo-001','cli-demo-003','Confirmar agenda de sexta-feira','2026-11-19T15:00:00-03:00','medium',0),
('task-demo-003','ws-demo-001',null,'Revisar estoque de coloração','2026-11-20T09:00:00-03:00','medium',0),
('task-demo-004','ws-demo-001',null,'Fechar relatório mensal','2026-11-22T17:00:00-03:00','low',1);

insert or ignore into analytics_snapshots (id, workspace_id, period_start, period_end, revenue, appointments_count, retention_rate, occupancy_rate, average_ticket, cancellation_rate, nps) values
('ana-demo-001','ws-demo-001','2026-06-01','2026-06-30',12400,76,61,68,189,6.1,68),
('ana-demo-002','ws-demo-001','2026-07-01','2026-07-31',14200,82,63,71,195,5.8,70),
('ana-demo-003','ws-demo-001','2026-08-01','2026-08-31',15100,84,64,73,201,5.2,71),
('ana-demo-004','ws-demo-001','2026-09-01','2026-09-30',16800,91,66,76,207,4.9,73),
('ana-demo-005','ws-demo-001','2026-10-01','2026-10-31',16400,88,65,75,211,4.7,72),
('ana-demo-006','ws-demo-001','2026-11-01','2026-11-30',18420,96,68,78,214,4.2,74);
