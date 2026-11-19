# Cloudflare demo runtime

O front consome a API pública de demonstração em:

`https://dona-de-ouro-demo-api.dona-de-ouro-demo.workers.dev`

Rotas disponíveis:

- `GET /api/health`
- `GET /api/bootstrap`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/admin/roles`
- `GET /api/admin/users`
- `POST /api/admin/users`

O Worker `dona-de-ouro-demo-api` usa o binding `DB` conectado ao D1 `dona_de_ouro_demo`. O schema e a massa fictícia ficam em `database/schema.sql` e `database/seed_demo.sql`.

O usuário principal já está associado ao papel `owner` e ativo. A senha nunca é armazenada em texto puro. O banco também contém seis papéis, vinte permissões, relacionamento papel-permissão, sessões revogáveis e trilha de auditoria.

## Próxima camada

Esta publicação é deliberadamente de demonstração: as rotas são somente leitura, sem autenticação real e com CORS aberto para facilitar a apresentação. Antes de produção, adicionar Cloudflare Access ou sessão própria, restringir CORS ao domínio publicado e criar rotas protegidas para mutações.
