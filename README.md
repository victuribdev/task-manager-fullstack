# Task Manager

Aplicação de gerenciamento de tarefas com **backend REST em Node.js + TypeScript** e
**frontend em React + TypeScript**. Permite criar, listar, filtrar, concluir e excluir tarefas.

- **Backend:** Node.js, Express, Zod, dados em memória — `strict: true`, sem `any`.
- **Frontend:** React, Vite, TanStack Query, CSS Modules — `strict: true`, sem `any`.

---

## Estrutura do projeto

```
task_manager/
├── backend/                 # API REST (Node + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/     # handlers HTTP (req/res)
│   │   ├── services/        # regras de negócio
│   │   ├── repositories/    # armazenamento em memória
│   │   ├── routes/          # definição das rotas
│   │   ├── middlewares/     # validação (Zod) e tratamento de erros
│   │   ├── schemas/         # schemas Zod + tipos derivados
│   │   ├── errors/          # classes de erro da aplicação
│   │   ├── types/           # interface Task
│   │   ├── config/          # variáveis de ambiente
│   │   ├── app.ts           # configura o app Express
│   │   └── index.ts         # sobe o servidor
│   └── tests/               # testes de integração (Vitest + Supertest)
└── frontend/                # interface React (Vite)
    └── src/
        ├── api/             # chamadas HTTP isoladas (service)
        ├── hooks/           # estado assíncrono (TanStack Query)
        ├── components/      # componentes de UI (1 pasta por componente)
        ├── utils/           # utilitários (ex.: formatação de data)
        └── types/           # tipos compartilhados
```

---

## Pré-requisitos

- **Node.js >= 18** (usa `crypto.randomUUID` e `fetch` nativos)
- **npm** (acompanha o Node)

> O backend e o frontend são instalados e executados de forma independente.

---

## Como rodar

> Abra **dois terminais**: um para o backend e outro para o frontend.

### 1. Backend (API)

```bash
cd backend
npm install
npm run dev
```

A API sobe em **http://localhost:3000**.

**Variáveis de ambiente** (todas opcionais — há padrões, não precisa de `.env` local):

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `PORT` | `3000` | Porta do servidor (em deploy, o host injeta automaticamente) |
| `CORS_ORIGIN` | `*` | Origem permitida no CORS. Em produção, aponte para a URL do frontend |

```bash
# Windows (PowerShell)
$env:PORT=4000; npm run dev
# Linux/macOS
PORT=4000 npm run dev
```

> O armazenamento é **em memória** (a proposta permite): a lista inicia vazia e os dados
> reiniciam quando o serviço reinicia/hiberna — comportamento esperado para este escopo.

### 2. Frontend (interface)

```bash
cd frontend
npm install
npm run dev
```

A interface sobe em **http://localhost:5173**.

**Variáveis de ambiente:** o frontend lê `VITE_API_URL` para localizar a API.
Há um padrão (`http://localhost:3000`), então funciona sem configuração. Para apontar
para outra URL, copie o exemplo e ajuste:

```bash
cp .env.example .env   # depois edite VITE_API_URL se necessário
```

---

## API REST

Base URL: `http://localhost:3000`

| Método | Rota | Descrição | Sucesso | Erros |
|--------|------|-----------|---------|-------|
| `GET` | `/tasks` | Lista tarefas. Aceita `?status=pending\|done` | `200` | `400` (status inválido) |
| `POST` | `/tasks` | Cria tarefa. Body: `{ "title": string }` | `201` | `400` (título vazio) |
| `PATCH` | `/tasks/:id` | Atualiza `title` e/ou `status` | `200` | `400`, `404` |
| `DELETE` | `/tasks/:id` | Remove tarefa pelo ID | `200` | `404` |

Erros inesperados retornam `500`. Modelo da tarefa:

```ts
interface Task {
  id: string;        // UUID
  title: string;     // obrigatório, não vazio
  status: 'pending' | 'done';
  createdAt: string; // ISO 8601
}
```

Exemplos:

```bash
# Criar
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" -d '{"title":"Estudar TypeScript"}'

# Listar pendentes
curl "http://localhost:3000/tasks?status=pending"

# Concluir
curl -X PATCH http://localhost:3000/tasks/<id> \
  -H "Content-Type: application/json" -d '{"status":"done"}'

# Excluir
curl -X DELETE http://localhost:3000/tasks/<id>
```

---

## Testes

Testes de integração do backend (rotas, validações e status codes):

```bash
cd backend
npm test
```

---

## Scripts disponíveis

**Backend** (`/backend`)
| Script | Ação |
|--------|------|
| `npm run dev` | Sobe a API com reload (tsx watch) |
| `npm run build` | Compila para `dist/` |
| `npm start` | Roda a versão compilada |
| `npm test` | Executa os testes |
| `npm run typecheck` | Checagem de tipos sem emitir |

**Frontend** (`/frontend`)
| Script | Ação |
|--------|------|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Build de produção |
| `npm run preview` | Pré-visualiza o build |
| `npm run typecheck` | Checagem de tipos sem emitir |

---

## Deploy

**Vercel (frontend) + Render (backend)** — ambos com plano gratuito. Como é um monorepo,
cada serviço aponta para a sua subpasta.

### Backend no Render

1. **New → Web Service** → conecte este repositório do GitHub.
2. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
3. (Opcional) Em **Environment**, adicione `CORS_ORIGIN` com a URL do frontend para restringir o CORS.
4. **Create Web Service**. Ao final, copie a URL pública (ex.: `https://seu-app.onrender.com`).

> A porta vem da env `PORT`, injetada pelo Render — já lida no código.
> No plano free o serviço hiberna após ~15 min ociosos; a primeira requisição depois
> disso leva alguns segundos para "acordar" (cold start).

> Alternativas gratuitas equivalentes: **Koyeb** ou **Railway** (este último hoje exige
> cartão/trial).

### Frontend na Vercel

1. **Add New → Project** → importe este repositório.
2. Em **Root Directory**, selecione **`frontend`** (framework Vite é detectado sozinho).
3. Em **Environment Variables**, adicione `VITE_API_URL` = URL pública do backend (passo 4 acima).
4. **Deploy**. A Vercel roda `npm run build` e publica a pasta `dist`.

> Ordem recomendada: subir o **backend primeiro** para ter a URL, depois configurar o
> `VITE_API_URL` no frontend.

---

## Decisões técnicas

**Por que escolheu a estrutura de pastas que usou?**
No backend, arquitetura em camadas (**route → controller → service → repository**): cada
uma com uma responsabilidade só, fácil de testar e de trocar o "banco em memória" por um
real sem mexer no resto. No frontend, separei `api/` (HTTP puro), `hooks/` (estado
assíncrono com TanStack Query) e `components/` (apenas UI) — nenhum componente faz `fetch`
direto. Um componente por pasta, com seu CSS Module.

**Teve alguma dificuldade? Como resolveu?**
O tipo `params` dos handlers do Express não aceitava uma interface `{ id: string }`.
Resolvi declarando a interface com index signature (`[key: string]: string`), tornando-a
compatível com o `ParamsDictionary` do Express e mantendo o `id` tipado.

**O que faria diferente com mais tempo?**
Optimistic updates no TanStack Query (feedback instantâneo ao concluir/excluir), edição
de título inline, paginação e testes no frontend (Testing Library + Playwright).

**Alguma melhoria que deixou de fora por limite de tempo?**
Persistência em banco (trocando só o repository), autenticação e deploy — fora do escopo
obrigatório. Priorizei entregar os requisitos com código limpo, tipado e testado.
