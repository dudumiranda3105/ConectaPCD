# 🦾 ConectaPCD

<div align="center">

![ConectaPCD Banner](https://img.shields.io/badge/ConectaPCD-Inclusão%20Digital-blue?style=for-the-badge&logo=accessibility&logoColor=white)

**Plataforma de conexão entre empresas e candidatos PCD**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

[📋 Funcionalidades](#-funcionalidades) • [🚀 Como Usar](#-como-usar) • [🛠️ Tecnologias](#️-tecnologias) • [📁 Estrutura](#-estrutura-do-projeto) • [🤝 Contribuindo](#-contribuindo)

</div>

---

## 📖 Sobre o Projeto

**ConectaPCD** é uma plataforma web desenvolvida para facilitar a inclusão de Pessoas com Deficiência (PCD) no mercado de trabalho. A aplicação conecta empresas que buscam cumprir a Lei de Cotas e promover a diversidade com candidatos PCD qualificados, criando um ambiente transparente e acessível para ambas as partes.

### 🎯 Problema Resolvido

- **Para Empresas**: Dificuldade em encontrar e contratar candidatos PCD qualificados
- **Para Candidatos**: Falta de visibilidade de vagas inclusivas e empresas com infraestrutura acessível
- **Para a Sociedade**: Promoção da inclusão digital e profissional de pessoas com deficiência

---

## ✨ Funcionalidades

### 👥 Para Candidatos PCD

- ✅ **Cadastro Detalhado**: Perfil completo com tipo de deficiência, subtipos, barreiras e recursos assistivos necessários
- 📄 **Upload de Currículo e Laudo**: Envio de documentos em PDF com armazenamento seguro
- 🖼️ **Foto de Perfil**: Upload e gestão de avatar personalizado
- 🔍 **Busca Inteligente de Vagas**: Filtros por tipo, regime, escolaridade e acessibilidades oferecidas
- 🤝 **Sistema de Match**: Algoritmo que conecta candidatos às vagas mais compatíveis
- 📊 **Dashboard Personalizado**: Visualização de candidaturas, matches e status
- 💬 **Chat Integrado**: Comunicação direta com empresas
- 🔐 **Recuperação de Senha**: Sistema seguro de reset de senha por email

### 🤖 Smart Match - Match Inteligente

Sistema exclusivo de análise de compatibilidade que avalia **2 critérios principais** com pesos específicos:

| Critério | Peso | Descrição |
|----------|------|-----------|
| ♿ **Tipo de Deficiência** | 40% | Compatibilidade entre subtipos de deficiência do candidato e tipos aceitos pela vaga |
| 🏢 **Acessibilidade** | 60% | Verifica se a vaga oferece as acessibilidades que atendem às barreiras do candidato |

**Fórmula do Match:**
```
scoreTotal = (scoreSubtipos × 0.4) + (scoreAcessibilidades × 0.6)
```

**Recursos do Smart Match:**
- 📊 Score de 0-100% para cada vaga com indicador visual
- 📈 Breakdown visual por categoria com barras de progresso
- 🏆 Classificações visuais: Match Perfeito (100%), Ótimo Match (60%+), Match Razoável (26%+), Match Baixo (<26%)
- 🎯 Cards de vagas com foto/iniciais da empresa
- 📱 Interface totalmente responsiva

### 🏢 Para Empresas

- 📝 **Cadastro Empresarial Completo**: CNPJ, porte, setor, endereço e dados de responsável
- 🖼️ **Logo da Empresa**: Upload de avatar/logo personalizado
- 💼 **Publicação de Vagas**: Formulário detalhado em 5 etapas:
  1. **Informações Básicas**: Título, descrição, tipo de contrato
  2. **Detalhes da Vaga**: Escolaridade, regime de trabalho
  3. **Tipos de Deficiência Aceitos**: Seleção de subtipos por categoria
  4. **Benefícios**: Lista de benefícios oferecidos
  5. **Acessibilidades**: Recursos de acessibilidade disponíveis
- 📈 **Dashboard Gerencial**: Métricas de vagas ativas, candidaturas recebidas e visualizações
- 👤 **Gestão de Candidaturas**: Visualização de currículos e perfis dos candidatos
- 📊 **Detalhes da Vaga**: Página completa com estatísticas, acessibilidades e tipos aceitos
- 💬 **Chat com Candidatos**: Comunicação direta durante o processo seletivo

### 🔐 Para Administradores

- 👨‍💼 **Painel Administrativo Completo**: Gestão centralizada de toda a plataforma
- 📊 **Métricas em Tempo Real**: 
  - Engajamento (candidatos, empresas, vagas)
  - Acessibilidade (tipos de deficiência, barreiras)
  - Atividades (candidaturas, matches, visualizações)
- 🗂️ **Gestão de Tipos de Deficiência**: CRUD completo com interface moderna
- 🚧 **Gestão de Barreiras**: Cadastro e vinculação de barreiras aos subtipos
- ♿ **Gestão de Recursos de Acessibilidade**: Controle dos recursos oferecidos
- 🔗 **Vinculações**: Conectar barreiras a subtipos de deficiência
- 👥 **Gestão de Administradores**: Controle de acesso administrativo

### ♿ Recursos de Acessibilidade

- 🔤 **Ajuste de Fonte**: Aumentar/diminuir tamanho do texto
- 🌓 **Alto Contraste**: Modo de alto contraste para baixa visão
- 🎨 **Simulação de Daltonismo**: Protanopia, Deuteranopia, Tritanopia
- ⌨️ **Navegação por Teclado**: Suporte completo a navegação via teclado
- 🗣️ **Screen Reader**: Compatível com leitores de tela
- 🌙 **Tema Claro/Escuro**: Alternância entre temas em todos os dashboards

---

## 🚀 Como Usar

### 📋 Pré-requisitos

- **Node.js** 18+ 
- **PostgreSQL** 14+
- **npm**, **yarn** ou **pnpm**

### ⚙️ Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/dudumiranda3105/ConectaPCD.git
cd ConectaPCD
```

2. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na pasta `backend/`:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/conectapcd"

# JWT
JWT_SECRET="sua_chave_secreta_super_segura_aqui"

# Server
PORT=3000

# Email (opcional - para notificações)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"
SMTP_FROM="ConectaPCD <noreply@conectapcd.com.br>"
```

3. **Instale as dependências**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

4. **Configure o banco de dados**

```bash
cd backend

# Execute as migrations
npx prisma migrate dev

# Popule o banco com dados iniciais
npm run seed
```

5. **Inicie os servidores**

```bash
# Terminal 1 - Backend (porta 3000)
cd backend
npm run dev

# Terminal 2 - Frontend (porta 8081)
cd frontend
npm run dev
```

6. **Acesse a aplicação**

- **Frontend**: `http://localhost:8080`
- **Backend API**: `http://localhost:3000`
- **Documentação API (Swagger)**: `http://localhost:3000/api-docs`

### 👤 Usuários de Teste

Após executar o seed, você terá acesso aos seguintes usuários:

| Tipo | Email | Senha |
|------|-------|-------|
| **Administrador** | `admin@conectapcd.com` | `Admin123` |
| **Candidato** | `candidato@teste.com` | `123456` |
| **Empresa** | `empresa@teste.com` | `123456` |

---

## 🛠️ Tecnologias

### Frontend

| Tecnologia | Descrição |
|------------|-----------|
| **React 18** | Biblioteca UI |
| **TypeScript** | Tipagem estática |
| **Vite 5** | Build tool e dev server |
| **React Router DOM** | Roteamento SPA |
| **TailwindCSS** | Estilização utility-first |
| **Radix UI** | Componentes acessíveis |
| **Shadcn/ui** | Design system |
| **React Hook Form** | Gerenciamento de formulários |
| **Zod** | Validação de schemas |
| **Zustand** | Gerenciamento de estado |
| **Recharts** | Gráficos e visualizações |
| **Lucide React** | Ícones SVG |
| **date-fns** | Manipulação de datas |

### Backend

| Tecnologia | Descrição |
|------------|-----------|
| **Node.js** | Runtime JavaScript |
| **Express 5** | Framework web |
| **TypeScript** | Tipagem estática |
| **Prisma ORM** | ORM para PostgreSQL |
| **PostgreSQL** | Banco de dados relacional |
| **JWT** | Autenticação stateless |
| **Bcrypt.js** | Hash de senhas |
| **Multer** | Upload de arquivos |
| **Nodemailer** | Envio de emails |
| **Helmet** | Headers de segurança |
| **Express Rate Limit** | Proteção contra DDoS |
| **Swagger** | Documentação da API |

### DevOps & Qualidade

| Tecnologia | Descrição |
|------------|-----------|
| **ESLint** | Linting de código |
| **Prettier** | Formatação de código |
| **tsx** | Executar TypeScript |

---

## 📁 Estrutura do Projeto

```
ConectaPCD/
├── 📂 backend/
│   ├── 📂 prisma/
│   │   ├── schema.prisma          # Schema do banco de dados
│   │   ├── seed.ts                # Dados iniciais
│   │   └── 📂 migrations/         # Histórico de migrations
│   ├── 📂 src/
│   │   ├── server.ts              # Ponto de entrada
│   │   ├── 📂 config/             # Configurações (Swagger)
│   │   ├── 📂 controllers/        # Lógica das rotas
│   │   ├── 📂 services/           # Regras de negócio
│   │   │   ├── email.service.ts   # Notificações por email
│   │   │   ├── smartMatch.service.ts # Algoritmo de match
│   │   │   └── ...
│   │   ├── 📂 repositories/       # Acesso ao banco
│   │   ├── 📂 middleware/         # Auth, uploads, rate limit
│   │   └── 📂 routes/             # Definição de rotas
│   └── 📂 uploads/                # Arquivos (currículos, avatares, laudos)
├── 📂 frontend/
│   ├── 📂 public/                 # Assets públicos
│   ├── 📂 src/
│   │   ├── App.tsx                # Componente raiz + rotas
│   │   ├── main.tsx               # Ponto de entrada
│   │   ├── 📂 components/
│   │   │   ├── 📂 ui/             # Componentes Shadcn
│   │   │   ├── 📂 dashboard/      # Componentes dos dashboards
│   │   │   │   ├── 📂 candidate/  # JobCard, JobCardSkeleton
│   │   │   │   └── 📂 company/    # JobPublicationModal
│   │   │   ├── AccessibilityButton.tsx
│   │   │   ├── AccessibilityPanel.tsx
│   │   │   └── ...
│   │   ├── 📂 pages/
│   │   │   ├── 📂 auth/           # Login, cadastro, reset senha
│   │   │   └── 📂 dashboard/      # Admin, company, candidate
│   │   ├── 📂 providers/          # Context providers
│   │   │   ├── AuthProvider.tsx
│   │   │   └── ...
│   │   ├── 📂 services/           # Chamadas à API
│   │   ├── 📂 stores/             # Estado global (Zustand)
│   │   ├── 📂 hooks/              # Custom hooks
│   │   ├── 📂 lib/                # Utilitários e schemas
│   │   └── 📂 types/              # Tipos TypeScript
├── .gitignore
├── package.json                   # Scripts do projeto raiz
└── README.md
```

---

## 🔐 Autenticação e Segurança

### Níveis de Acesso

| Role | Acesso |
|------|--------|
| **ADMIN** | Painel administrativo completo |
| **COMPANY** | Publicação de vagas e gestão de candidaturas |
| **CANDIDATE** | Candidatura a vagas e gestão de perfil |

### Recursos de Segurança

- 🔑 **JWT (JSON Web Tokens)**: Autenticação stateless
- 🔒 **Bcrypt**: Hash de senhas com salt
- 🛡️ **Helmet**: Headers HTTP de segurança
- ⏱️ **Rate Limiting**: Proteção contra brute force
  - Login: 5 tentativas/minuto
  - Registro: 3/hora
  - Reset senha: 3/hora
  - Upload: 10/hora
- 📧 **Reset de Senha**: Token seguro com expiração de 1h
- 🔐 **CORS**: Controle de origem das requisições

---

## 📚 API Documentation

A documentação completa da API está disponível via Swagger:

```
http://localhost:3000/api-docs
```

### Principais Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/register` | Cadastrar usuário |
| `POST` | `/auth/login` | Login |
| `POST` | `/auth/forgot-password` | Solicitar reset de senha |
| `POST` | `/auth/reset-password` | Redefinir senha |
| `GET` | `/vagas` | Listar vagas públicas |
| `POST` | `/vagas` | Criar vaga (com subtiposAceitos) |
| `PUT` | `/vagas/:id` | Atualizar vaga |
| `POST` | `/candidaturas` | Criar candidatura |
| `GET` | `/matching/candidato/:id` | Vagas recomendadas com score |
| `GET` | `/matching/candidato/:id/scores` | Scores calculados do cache |
| `POST` | `/matching/candidato/:id/calculate` | Recalcular todos os scores |
| `GET` | `/tipos` | Listar tipos de deficiência |
| `GET` | `/subtipos` | Listar subtipos |
| `GET` | `/acessibilidades` | Listar acessibilidades |
| `GET` | `/stats` | Estatísticas públicas |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### 📝 Convenções de Commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças na documentação
- `style:` Formatação (sem mudança de código)
- `refactor:` Refatoração de código
- `test:` Adição ou correção de testes
- `chore:` Tarefas de manutenção

---

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autores

| Nome | GitHub |
|------|--------|
| **Eduardo Miranda** | [@dudumiranda3105](https://github.com/dudumiranda3105) |
| **Eduarda Roberta Borges da Silva** | [@Eduarda-Borges-Silva](https://github.com/Eduarda-Borges-Silva) |
| **Rebeca Souza Lúcio Chagas** | [@RebecaSLChagas](https://github.com/RebecaSLChagas) |
| **Edson Gabriel Klippel Pereira** | - |

---

## 🙏 Agradecimentos

- Comunidade PCD pela inspiração e feedback
- Empresas parceiras comprometidas com a inclusão
- Todos os contribuidores do projeto

---

<div align="center">

**Feito com ❤️ e ♿ por pessoas que acreditam em um mercado de trabalho mais inclusivo**

[⬆ Voltar ao topo](#-conectapcd)

</div>
