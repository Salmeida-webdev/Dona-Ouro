# Roteiro da demonstração

## Fluxo comercial

1. Abrir a landing page e apresentar a proposta.
2. Entrar pelo botão principal.
3. Na tela de login, conferir o e-mail `segundoalmeidawebdev@gmail.com` e informar a senha definida para o painel.
4. Apresentar a Mesa de Gestão como a visão diária do negócio.

## Fluxo do painel

- Mostrar o foco do dia e os clientes que precisam de atenção.
- Abrir Agenda e percorrer os horários.
- Abrir Clientes e pesquisar Mariana Costa.
- Mostrar Serviços e a receita por serviço.
- Mostrar Equipe e o status dos profissionais.
- Abrir Financeiro e explicar o movimento.
- Abrir Análises para apresentar os indicadores e comparativos.
- Abrir Relatórios e destacar recorrência.
- Abrir Configurações para demonstrar a personalização white-label.

## Dados

Os dados persistentes da demonstração estão no Cloudflare D1 `dona_de_ouro_demo`; o front consulta o Worker `dona-de-ouro-demo-api`. O fallback local está em src/demo.data.js. O modelo e o seed ficam em database/schema.sql e database/seed_demo.sql. Todos os nomes, contatos e valores são fictícios.

API de demonstração: `https://dona-de-ouro-demo-api.dona-de-ouro-demo.workers.dev`

Antes de produção, restringir CORS ao domínio final, revisar a política de sessões e proteger o domínio com a camada de identidade escolhida. As rotas de criação de usuários já exigem sessão autenticada e permissão `users.create`.
