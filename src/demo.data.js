export const demoData = {
  workspace: { name: "Casa Oliveira", city: "João Pessoa · PB", segment: "Espaço de beleza", health: 86 },
  user: { name: "Camila Oliveira", role: "Administradora", initials: "CA" },
  notifications: [
    { title: "Retorno pendente", text: "Mariana Costa aguarda uma resposta sua.", time: "há 12 min", type: "attention" },
    { title: "Meta semanal", text: "Você alcançou 72% da meta de atendimentos.", time: "há 1 h", type: "positive" },
    { title: "Novo cliente", text: "Paula Martins foi adicionada ao seu espaço.", time: "ontem", type: "new" }
  ],
  appointments: [
    { id: "apt-01", time: "08:00", client: "Abertura do espaço", service: "Rotina operacional", duration: "30 min", professional: "Camila Oliveira", status: "Concluído", tone: "done" },
    { id: "apt-02", time: "09:00", client: "Ana Beatriz", service: "Coloração", duration: "2h", professional: "Lara Mendes", status: "Próximo", tone: "next" },
    { id: "apt-03", time: "11:30", client: "Mariana Costa", service: "Follow-up", duration: "15 min", professional: "Camila Oliveira", status: "Atenção", tone: "attention" },
    { id: "apt-04", time: "14:00", client: "Juliana Alves", service: "Experiência completa", duration: "1h30", professional: "Lara Mendes", status: "Agendado", tone: "scheduled" },
    { id: "apt-05", time: "16:30", client: "Paula Martins", service: "Design de sobrancelhas", duration: "45 min", professional: "Bia Santos", status: "Agendado", tone: "scheduled" },
    { id: "apt-06", time: "18:00", client: "Fernanda Souza", service: "Corte e finalização", duration: "1h", professional: "Nina Rocha", status: "Agendado", tone: "scheduled" }
  ],
  customers: [
    { id: "cli-01", name: "Ana Beatriz", initials: "AB", phone: "(83) 98821-4012", email: "ana.beatriz@email.com", status: "Ativa", lastVisit: "Hoje", nextStep: "Retorno em 30 dias", total: "R$ 2.840", visits: 12, tag: "Coloração", tone: "green" },
    { id: "cli-02", name: "Mariana Costa", initials: "MC", phone: "(83) 99642-1188", email: "mariana.costa@email.com", status: "Atenção", lastVisit: "há 42 dias", nextStep: "Enviar mensagem hoje", total: "R$ 1.920", visits: 8, tag: "Recorrente", tone: "gold" },
    { id: "cli-03", name: "Juliana Alves", initials: "JA", phone: "(83) 99180-7344", email: "juliana.alves@email.com", status: "Ativa", lastVisit: "há 7 dias", nextStep: "Confirmar sexta-feira", total: "R$ 3.480", visits: 15, tag: "Premium", tone: "green" },
    { id: "cli-04", name: "Paula Martins", initials: "PM", phone: "(83) 98734-9061", email: "paula.martins@email.com", status: "Nova", lastVisit: "Nunca", nextStep: "Primeiro atendimento", total: "R$ 0", visits: 0, tag: "Nova", tone: "blue" },
    { id: "cli-05", name: "Fernanda Souza", initials: "FS", phone: "(83) 99873-2264", email: "fernanda.souza@email.com", status: "Ativa", lastVisit: "há 14 dias", nextStep: "Sugerir tratamento", total: "R$ 1.760", visits: 6, tag: "Corte", tone: "green" },
    { id: "cli-06", name: "Larissa Melo", initials: "LM", phone: "(83) 98802-6531", email: "larissa.melo@email.com", status: "Atenção", lastVisit: "há 68 dias", nextStep: "Reativar relacionamento", total: "R$ 980", visits: 4, tag: "Reativação", tone: "gold" },
    { id: "cli-07", name: "Carolina Nunes", initials: "CN", phone: "(83) 99152-8176", email: "carolina.nunes@email.com", status: "Ativa", lastVisit: "há 4 dias", nextStep: "Acompanhar satisfação", total: "R$ 2.110", visits: 9, tag: "Design", tone: "green" },
    { id: "cli-08", name: "Beatriz Lima", initials: "BL", phone: "(83) 99601-4438", email: "beatriz.lima@email.com", status: "Nova", lastVisit: "Nunca", nextStep: "Confirmar cadastro", total: "R$ 0", visits: 0, tag: "Nova", tone: "blue" },
    { id: "cli-09", name: "Renata Gomes", initials: "RG", phone: "(83) 98872-1190", email: "renata.gomes@email.com", status: "Ativa", lastVisit: "há 21 dias", nextStep: "Agendar manutenção", total: "R$ 4.230", visits: 18, tag: "Premium", tone: "green" },
    { id: "cli-10", name: "Isabela Rocha", initials: "IR", phone: "(83) 99723-8004", email: "isabela.rocha@email.com", status: "Atenção", lastVisit: "há 51 dias", nextStep: "Enviar condição especial", total: "R$ 1.340", visits: 5, tag: "Inativa", tone: "gold" }
  ],
  services: [
    { name: "Experiência completa", category: "Experiência", duration: "2h30", price: "R$ 420", bookings: 32, revenue: "R$ 13.440", active: true },
    { name: "Coloração", category: "Cabelos", duration: "2h", price: "R$ 280", bookings: 41, revenue: "R$ 11.480", active: true },
    { name: "Corte e finalização", category: "Cabelos", duration: "1h", price: "R$ 180", bookings: 52, revenue: "R$ 9.360", active: true },
    { name: "Design de sobrancelhas", category: "Beleza", duration: "45 min", price: "R$ 90", bookings: 38, revenue: "R$ 3.420", active: true },
    { name: "Tratamento de reconstrução", category: "Cabelos", duration: "1h30", price: "R$ 210", bookings: 18, revenue: "R$ 3.780", active: true },
    { name: "Manutenção de cor", category: "Cabelos", duration: "1h30", price: "R$ 220", bookings: 14, revenue: "R$ 3.080", active: true },
    { name: "Escova e styling", category: "Finalização", duration: "45 min", price: "R$ 110", bookings: 27, revenue: "R$ 2.970", active: false },
    { name: "Consultoria de imagem", category: "Experiência", duration: "1h", price: "R$ 160", bookings: 9, revenue: "R$ 1.440", active: true }
  ],
  team: [
    { name: "Camila Oliveira", role: "Administradora", initials: "CO", status: "Online", appointments: 18, revenue: "R$ 4.820", color: "gold" },
    { name: "Lara Mendes", role: "Colorista", initials: "LM", status: "Em atendimento", appointments: 31, revenue: "R$ 8.620", color: "rose" },
    { name: "Bia Santos", role: "Designer", initials: "BS", status: "Online", appointments: 24, revenue: "R$ 3.920", color: "green" },
    { name: "Nina Rocha", role: "Cabeleireira", initials: "NR", status: "Ausente hoje", appointments: 13, revenue: "R$ 2.760", color: "blue" },
    { name: "Tainá Alves", role: "Recepção", initials: "TA", status: "Online", appointments: 0, revenue: "—", color: "purple" }
  ],
  transactions: [
    { date: "19 nov", description: "Experiência completa", detail: "Juliana Alves", type: "Entrada", value: "+ R$ 420" },
    { date: "19 nov", description: "Produtos profissionais", detail: "Fornecedor", type: "Saída", value: "− R$ 180" },
    { date: "18 nov", description: "Coloração", detail: "Ana Beatriz", type: "Entrada", value: "+ R$ 280" },
    { date: "18 nov", description: "Corte e finalização", detail: "Fernanda Souza", type: "Entrada", value: "+ R$ 180" },
    { date: "17 nov", description: "Aluguel do espaço", detail: "Custo fixo", type: "Saída", value: "− R$ 2.400" },
    { date: "16 nov", description: "Design de sobrancelhas", detail: "Carolina Nunes", type: "Entrada", value: "+ R$ 90" },
    { date: "15 nov", description: "Manutenção de equipamentos", detail: "Operação", type: "Saída", value: "− R$ 320" }
  ],
  monthlyRevenue: [12400, 14200, 15100, 16800, 16400, 18420],
  analytics: {
    revenueGrowth: "12,8%",
    attendanceGrowth: "8,4%",
    retentionRate: "68%",
    occupancyRate: "78%",
    averageTicket: "R$ 214",
    cancellationRate: "4,2%",
    newCustomers: 18,
    reactivatedCustomers: 11,
    nps: 74,
    conversionRate: "32%",
    bestDay: "quinta-feira",
    bestService: "Coloração",
    bestProfessional: "Lara Mendes"
  },
  tasks: [
    { title: "Retornar Mariana Costa", due: "Hoje, 11:30", priority: "Alta", done: false },
    { title: "Confirmar agenda de sexta-feira", due: "Hoje, 15:00", priority: "Média", done: false },
    { title: "Revisar estoque de coloração", due: "Amanhã", priority: "Média", done: false },
    { title: "Fechar relatório mensal", due: "22 nov", priority: "Baixa", done: true }
  ]
};
