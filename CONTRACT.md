# CONTRACT.md — Contrato de API (frontend ↔ backend)

Este repositório é **somente frontend** (Next.js). Ele consome uma API externa via a variável de
ambiente `NEXT_PUBLIC_API_URL` (padrão de desenvolvimento: `http://localhost:3001`). Este documento
descreve os endpoints que o frontend já espera hoje e os novos endpoints necessários para as
funcionalidades em construção (Avaliação Física, Avaliação Nutricional e área administrativa).

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

## 3.1 Novo endpoint público: `POST /avaliacao-nutricional`

Mesmo formato do `POST /avaliacao-fisica` acima (mesmos dias, mesmos horários, mesma seleção de
unidade) — é um serviço separado, com seu próprio agendamento e sua própria aba na planilha, só que
com o valor diferente.

Corpo (`AvaliacaoNutricionalPayload`, todos os campos `string`):

| Campo      | Descrição                                                    |
| ---------- | --------------------------------------------------------------- |
| `nome`     | Nome completo                                                   |
| `whatsapp` | Dígitos locais, sem código do país                              |
| `unidade`  | `"Telégrafo"` ou `"Sacramenta"`                                 |
| `dia`      | Um dia entre `"Segunda"`…`"Sexta"` (sem Sábado)                 |
| `data`     | Data real calculada, `dd/mm/aaaa`                                |
| `horario`  | Um dos horários fixos — mesma lista da seção 3                  |
| `valor`    | Sempre `"R$ 150,00"` — informativo, sem gateway de pagamento no site |

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

`GET /matricula`, `GET /cortesia`, `GET /avaliacao-fisica`, `GET /avaliacao-nutricional` — cada um
retorna a lista de registros já enviados aos endpoints de escrita correspondentes (seções 2, 3 e 3.1).

Header obrigatório: `Authorization: Bearer <token>`. Sem token válido → `401`.

Cada registro retornado = os mesmos campos do `POST` correspondente, **mais**:

| Campo       | Descrição                          |
| ----------- | ------------------------------------ |
| `id`        | Identificador único do registro      |
| `createdAt` | Data/hora de criação, ISO 8601       |

Além disso, cada registro de **`GET /cortesia`** especificamente também deve trazer:

| Campo               | Descrição                                                          |
| -------------------- | -------------------------------------------------------------------- |
| `presencaConfirmada` | `boolean` — se a recepção já confirmou que o aluno compareceu à aula |

Se a coluna correspondente na planilha ainda não tiver sido preenchida para um registro antigo,
retornar `false` (nunca omitir o campo).

**Importante:** o `id` retornado aqui precisa ser um identificador **estável**, porque agora ele também
é usado para localizar a linha certa na escrita da seção 5.1 abaixo — não é mais usado só pra exibição.

### 5.1 `PATCH /cortesia/:id/presenca` — confirmar presença

Novo endpoint. Chamado pelo Route Handler `app/api/admin/cortesia/[id]/presenca/route.ts` do frontend
(nunca diretamente pelo navegador) — **não precisa de CORS**. Marca (ou desmarca) a presença do aluno
naquela linha da planilha de cortesias.

Header obrigatório: `Authorization: Bearer <token>`. Sem token válido → `401`.

Requisição:
```json
{ "confirmada": true }
```
(`confirmada: false` desfaz uma confirmação feita por engano.)

Resposta de sucesso: qualquer `2xx` — o frontend não lê o corpo, só atualiza o estado local
otimisticamente. Resposta de erro: convenção padrão `{ "message": "..." }` (seção 1), por exemplo
`404` se o `id` não existir mais na planilha.

No Apps Script, isso implica adicionar uma coluna nova (ex.: "Presença confirmada") na aba de
cortesias e um caminho de escrita que localize a linha pelo `id` e atualize só essa célula — hoje o
`doGet`/`doPost` existentes provavelmente só fazem leitura e append, então essa é uma operação nova
(update por id), não só um campo a mais.

**Proposta de paginação** (não validada com backend real — o backend implementador pode propor algo
diferente): query params `?page=1&limit=20`, resposta:
```json
{ "data": [ /* registros */ ], "total": 132, "page": 1, "limit": 20 }
```

### 5.2 `DELETE /:recurso/:id` — apagar registro

Novo. Existe um endpoint desses para cada uma das quatro coleções:

- `DELETE /matricula/:id`
- `DELETE /cortesia/:id`
- `DELETE /avaliacao-fisica/:id`
- `DELETE /avaliacao-nutricional/:id`

Chamados pelos Route Handlers `app/api/admin/<recurso>/[id]/route.ts` do frontend (nunca diretamente
pelo navegador) — **não precisam de CORS**. Cada um remove a linha correspondente na aba da planilha
daquela coleção.

Header obrigatório: `Authorization: Bearer <token>`. Sem token válido → `401`.

Resposta de sucesso: `200` ou `204` (sem corpo, ambos são aceitos). Resposta de erro: convenção
padrão `{ "message": "..." }` (seção 1), por exemplo `404` se o `id` não existir mais na planilha.

**Importante — isso é destrutivo e imediato no backend.** O frontend só chama esse endpoint depois
que a recepção confirma o apagamento **e** deixa passar 5 segundos sem clicar em "Desfazer" — ou
seja, quando esse endpoint é chamado, não há mais desfazer possível do lado do frontend. Se quiserem
uma segunda camada de segurança (soft-delete/lixeira no próprio Apps Script, por exemplo movendo a
linha pra uma aba "Excluídos" em vez de removê-la de fato), isso fica a critério de quem implementar
o backend — o frontend não depende disso, mas também não atrapalha.

### Nota importante sobre o campo `whatsapp`

O frontend monta o link de WhatsApp do **cliente** (não da academia) a partir do campo `whatsapp`
retornado por esses endpoints, prefixando `55` quando os dígitos ainda não o incluem. Para isso
funcionar de forma confiável, o backend deve devolver o campo `whatsapp` **exatamente como foi
recebido no `POST`** (dígitos locais, sem formatação, sem prefixo de país adicionado) — sem
reformatar, mascarar ou alterar esse valor em nenhuma etapa.

## 6. CORS

- `POST /matricula`, `POST /cortesia`, `POST /avaliacao-fisica`, `POST /avaliacao-nutricional`,
  `GET /banners`: precisam aceitar requisições cross-origin do domínio do site (`Content-Type`
  como header permitido).
- **A allowlist de origens precisa incluir também `http://localhost:3000`** (e, se possível,
  `http://127.0.0.1:3000`), não só o domínio de produção — hoje quem desenvolve o frontend
  localmente não consegue testar nenhum desses formulários (`matricula`, `cortesia`,
  `avaliacao-fisica`, `avaliacao-nutricional`) porque o `npm run dev` local roda em
  `localhost:3000` e é bloqueado pelo CORS.
- `POST /admin/login`, `GET /matricula`, `GET /cortesia`, `GET /avaliacao-fisica`,
  `GET /avaliacao-nutricional`, `PATCH /cortesia/:id/presenca`, `GET /admin/banners`,
  `POST /admin/banners`, `PATCH /admin/banners/:id`, e todos os `DELETE /:recurso/:id`
  (seção 5.2 e 6.1): chamados exclusivamente servidor-a-servidor pelo Next.js — **não precisam de
  configuração de CORS**.

## 6.1 Banners (carrossel da home)

Novo recurso: imagens promocionais que rodam em carrossel no topo da home, gerenciadas pela
recepção via área administrativa. O armazenamento em si (Neon, S3, o que for) é decisão de quem
implementar o backend — o contrato abaixo só define a API que o frontend consome.

### `GET /banners`

Público, **precisa de CORS liberado** (mesma exigência da seção 6, ainda que hoje o frontend chame
esse endpoint só a partir do servidor Next.js — deixamos CORS aberto por segurança/flexibilidade
futura). Retorna só os banners com `ativo: true`, ordenados por `ordem` crescente.

Resposta (`200`):
```json
{ "data": [ { "id": "...", "imageUrl": "...", "ordem": 1, "ativo": true, "link": null, "alt": "...", "createdAt": "..." } ] }
```

**Atenção — rate limit:** esse endpoint é chamado a cada carregamento da home (às vezes duas
vezes: uma no servidor, uma no navegador, quando o retrato em cache do Next volta vazio e o
frontend tenta buscar de novo), então recebe bem mais tráfego do que os outros endpoints públicos.
Já observamos `429 ThrottlerException` em produção nele. Como é uma rota pública de leitura, sem
custo de escrita, recomenda-se um limite bem mais alto (ou isenção do throttler) aqui do que em
rotas sensíveis como `/admin/login`.

### `GET /admin/banners`

Chamado apenas pelo Route Handler `app/api/admin/banners/route.ts` — **não precisa de CORS**.
Header obrigatório: `Authorization: Bearer <token>`. Retorna **todos** os banners (ativos e
inativos), mesmo formato paginado da seção 5:
```json
{ "data": [ /* BannerRecord[] */ ], "total": 4, "page": 1, "limit": 20 }
```

### `POST /admin/banners`

Chamado apenas pelo Route Handler acima — **não precisa de CORS**. Corpo `multipart/form-data`:

| Campo    | Descrição                                                          |
| -------- | --------------------------------------------------------------------- |
| `imagem` | Arquivo de imagem. Recomendado: 1600×500px (faixa larga, ~16:5), JPG ou WebP, até 5MB (recomendação, não bloqueio obrigatório) |
| `ordem`  | `number` — posição no carrossel                                       |
| `ativo`  | `boolean` — se aparece no carrossel público                           |
| `link`   | `string` opcional — URL de destino ao clicar no banner                |
| `alt`    | `string` — texto alternativo da imagem                                |

Resposta de sucesso: `BannerRecord` criado (formato da seção `GET /banners` acima, mais `id` e
`createdAt`).

### `PATCH /admin/banners/:id`

Chamado apenas pelo Route Handler `app/api/admin/banners/[id]/route.ts` — **não precisa de CORS**.
Atualiza metadados (`ordem`, `ativo`, `link`, `alt`) — **não** troca a imagem em si; para isso,
apagar o banner e subir um novo. Corpo: qualquer subconjunto desses campos. Resposta de sucesso:
`2xx`.

### `DELETE /admin/banners/:id`

Mesma convenção da seção 5.2 — remove o banner e a imagem associada. Header obrigatório:
`Authorization: Bearer <token>`.

## 7. Itens em aberto para quem for implementar o backend

- Expiração e renovação do token de admin — o frontend hoje não tem fluxo de refresh, apenas
  redireciona para o login novamente em caso de `401`.
- Se as credenciais de admin são únicas e compartilhadas pela recepção, ou por atendente
  individual (impacta se `usuario` precisa existir como conceito de "conta" no backend).
- Rate limiting em `POST /admin/login` (recomendado, mas não implementado no frontend).
- Formato final da paginação da seção 5 — proposta inicial, sujeita a ajuste.
