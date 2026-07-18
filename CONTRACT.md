# CONTRACT.md — Contrato de API (frontend ↔ backend)

Este repositório é **somente frontend** (Next.js). Ele consome uma API externa via a variável de
ambiente `NEXT_PUBLIC_API_URL` (padrão de desenvolvimento: `http://localhost:3001`). Este documento
descreve os endpoints que o frontend já espera hoje e os novos endpoints necessários para as
funcionalidades em construção (Avaliação Física e área administrativa).

Este documento é a fonte de verdade para quem for implementar o backend. Onde algo é apenas uma
**proposta** (ainda não validada com um desenvolvedor de backend), isso está marcado explicitamente.

## 1. Visão geral

- Todas as requisições e respostas usam `Content-Type: application/json`.
- **Convenção de erro** (estilo NestJS / `class-validator`): em qualquer erro, o corpo da resposta
  deve ser `{ "message": string | string[] }`. O frontend usa o primeiro item do array quando
  `message` é uma lista. Se `message` estiver ausente, o frontend mostra uma mensagem genérica.
- Endpoints públicos de cadastro (`POST /matricula`, `POST /cortesia`, `POST /avaliacao-fisica`)
  precisam de **CORS liberado** para a origem do site, já que são chamados diretamente do navegador.
- Endpoints administrativos (seção 5) são chamados **apenas server-to-server**, a partir de Route
  Handlers do próprio Next.js — não precisam de CORS.

## 2. Endpoints públicos existentes (já implementados pelo frontend)

### `POST /matricula`

Corpo (`MatriculaPayload`, todos os campos `string`):

| Campo         | Descrição                                                                 |
| ------------- | -------------------------------------------------------------------------- |
| `nome`        | Nome completo                                                              |
| `nascimento`  | Data de nascimento, formato `dd/mm/aaaa`                                   |
| `email`       | E-mail                                                                     |
| `cpf`         | CPF formatado (`000.000.000-00`)                                          |
| `endereco`    | Endereço completo                                                          |
| `whatsapp`    | Dígitos locais (DDD + número), **sem** código do país                      |
| `instagram`   | Opcional — pode vir vazio (`""`)                                          |
| `limitacao`   | `"Não"` ou a descrição da limitação física                                |
| `modalidade`  | Rótulo legível: `"Musculação"`, `"Cross Training"`, `"Funcional Kids"` ou `"Personal Trainer"` |
| `unidade`     | `"Telégrafo"` ou `"Sacramenta"`                                           |
| `horario`     | Rótulo do horário escolhido                                               |
| `cref`        | CREF do personal trainer externo, ou `""` quando não se aplica            |
| `plano`       | Nome do plano escolhido                                                   |
| `aceite`      | Sempre `"Sim"` (usuário aceitou o termo de adesão antes de enviar)         |

Resposta: qualquer `2xx` é tratado como sucesso — o frontend hoje não lê o corpo da resposta de
sucesso. **Isto está sub-especificado de propósito**; o backend tem liberdade aqui, mas recomenda-se
padronizar isso quando a área admin passar a depender de dados retornados no `POST`.

### `POST /cortesia`

Corpo (`CortesiaPayload`, todos os campos `string`):

| Campo        | Descrição                                                          |
| ------------ | -------------------------------------------------------------------- |
| `nome`       | Nome completo                                                        |
| `whatsapp`   | Dígitos locais, sem código do país                                   |
| `email`      | E-mail                                                                |
| `cpf`        | CPF formatado                                                        |
| `modalidade` | `"Musculação"`, `"Cross Training"` ou `"Funcional Kids"`             |
| `horario`    | Rótulo do horário                                                     |
| `dia`        | Dia(s) da semana — no Cross Training pode ser uma lista tipo `"Segunda, Terça, Quarta"` |
| `datasAula`  | Data(s) reais calculadas (`dd/mm/aaaa`), mesma cardinalidade de `dia` |
| `limitacao`  | `"Não"` ou a descrição da limitação física                          |

Resposta: mesmo comportamento de `POST /matricula` (só `2xx` importa hoje).

## 3. Novo endpoint público: `POST /avaliacao-fisica`

Corpo (`AvaliacaoPayload`, todos os campos `string`):

| Campo      | Descrição                                                    |
| ---------- | --------------------------------------------------------------- |
| `nome`     | Nome completo                                                   |
| `whatsapp` | Dígitos locais, sem código do país                              |
| `unidade`  | `"Telégrafo"` ou `"Sacramenta"`                                 |
| `dia`      | Um dia entre `"Segunda"`…`"Sexta"` (sem Sábado)                 |
| `data`     | Data real calculada, `dd/mm/aaaa`                                |
| `horario`  | Um dos horários fixos (ver lista abaixo)                        |
| `valor`    | Sempre `"R$ 80,00"` — informativo, sem gateway de pagamento no site |

Horários válidos:
- Manhã: `07:00, 07:30, 08:00, 08:30, 09:00, 09:30, 10:00, 10:30`
- Tarde: `17:00, 17:30, 18:00, 18:30, 19:00, 19:30, 20:00, 20:30`

Resposta: mesmo padrão dos endpoints acima (`2xx` = sucesso).

## 4. Autenticação administrativa

### `POST /admin/login`

Chamado apenas pelo Route Handler `app/api/admin/login/route.ts` do frontend (nunca diretamente pelo
navegador) — **não precisa de CORS**.

Requisição:
```json
{ "usuario": "string", "senha": "string" }
```

Resposta de sucesso (`200`):
```json
{ "token": "string", "expiresIn": 28800 }
```
`expiresIn` em segundos, opcional (o frontend usa um padrão se ausente).

Resposta de erro (`401`):
```json
{ "message": "Credenciais inválidas" }
```

O frontend guarda esse `token` num cookie **httpOnly** e o reenvia como `Authorization: Bearer <token>`
em toda chamada aos endpoints da seção 5 — sempre a partir do servidor Next.js, nunca do navegador.

## 5. Endpoints administrativos (leitura)

`GET /matricula`, `GET /cortesia`, `GET /avaliacao-fisica` — cada um retorna a lista de registros já
enviados aos endpoints de escrita correspondentes (seções 2 e 3).

Header obrigatório: `Authorization: Bearer <token>`. Sem token válido → `401`.

Cada registro retornado = os mesmos campos do `POST` correspondente, **mais**:

| Campo       | Descrição                          |
| ----------- | ------------------------------------ |
| `id`        | Identificador único do registro      |
| `createdAt` | Data/hora de criação, ISO 8601       |

**Proposta de paginação** (não validada com backend real — o backend implementador pode propor algo
diferente): query params `?page=1&limit=20`, resposta:
```json
{ "data": [ /* registros */ ], "total": 132, "page": 1, "limit": 20 }
```

### Nota importante sobre o campo `whatsapp`

O frontend monta o link de WhatsApp do **cliente** (não da academia) a partir do campo `whatsapp`
retornado por esses endpoints, prefixando `55` quando os dígitos ainda não o incluem. Para isso
funcionar de forma confiável, o backend deve devolver o campo `whatsapp` **exatamente como foi
recebido no `POST`** (dígitos locais, sem formatação, sem prefixo de país adicionado) — sem
reformatar, mascarar ou alterar esse valor em nenhuma etapa.

## 6. CORS

- `POST /matricula`, `POST /cortesia`, `POST /avaliacao-fisica`: precisam aceitar requisições
  cross-origin do domínio do site (`Content-Type` como header permitido).
- `POST /admin/login`, `GET /matricula`, `GET /cortesia`, `GET /avaliacao-fisica`: chamados
  exclusivamente servidor-a-servidor pelo Next.js — **não precisam de configuração de CORS**.

## 7. Itens em aberto para quem for implementar o backend

- Expiração e renovação do token de admin — o frontend hoje não tem fluxo de refresh, apenas
  redireciona para o login novamente em caso de `401`.
- Se as credenciais de admin são únicas e compartilhadas pela recepção, ou por atendente
  individual (impacta se `usuario` precisa existir como conceito de "conta" no backend).
- Rate limiting em `POST /admin/login` (recomendado, mas não implementado no frontend).
- Formato final da paginação da seção 5 — proposta inicial, sujeita a ajuste.
