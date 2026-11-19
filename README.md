# Dona de Ouro — experiência white-label

Protótipo responsivo da nova experiência da Dona de Ouro, com landing page comercial, tela de login, área de gestão com a proposta “Mesa de Gestão”, navegação por visão/operação/resultado, análise de dados com indicadores fictícios e estrutura white-label conectada a uma API Cloudflare Worker + D1.

## Executar

Como o protótipo usa módulos JavaScript no navegador, execute um servidor local na pasta:

python3 -m http.server 4173

Depois acesse http://localhost:4173.

O acesso de demonstração já abre com o e-mail `segundoalmeidawebdev@gmail.com` preenchido e bloqueado. Informe a senha definida para o painel; após a autenticação, o front consulta o bootstrap do D1 e mantém um fallback local para a apresentação caso a API fique indisponível.

## Estrutura preparada

- src/brand.config.js: preset white-label da marca.
- src/demo.data.js: dados fictícios para a apresentação.
- src/integration.ports.js: portas para autenticação, agenda, clientes e financeiro.
- database/schema.sql: tabelas do núcleo e snapshots de análise.
- database/seed_demo.sql: seed inicial fictício.
- docs/DEMO.md: roteiro para apresentar o produto.
- cloudflare/worker.js: API de bootstrap e health check conectada ao D1.
- cloudflare/wrangler.toml: configuração reproduzível do binding D1.
- cloudflare/README.md: URL pública, rotas e checklist antes de produção.
- database/schema.sql: identidade, sessões, papéis, permissões e auditoria.

## Acessos preparados

O banco já contém o usuário principal `segundoalmeidawebdev@gmail.com` como proprietário da conta, com senha ativa armazenada somente como hash PBKDF2-SHA-256. Os papéis preparados são: Proprietária, Administradora, Gestora, Recepção, Profissional e Analista.
