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
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)

[📋 Funcionalidades](#-funcionalidades) • [🚀 Como Usar](#-como-usar) • [🛠️ Tecnologias](#️-tecnologias) • [📁 Estrutura](#-estrutura-do-projeto) • [🧪 Testes](#-testes) • [🤝 Contribuindo](#-contribuindo)

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
- 🔍 **Busca Inteligente de Vagas**: Filtros por tipo, regime, escolaridade e acessibilidades oferecidas
- 🤝 **Sistema de Match**: Algoritmo que conecta candidatos às vagas mais compatíveis
- 📊 **Dashboard Personalizado**: Visualização de candidaturas, matches e status em tempo real
- 🔔 **Notificações em Tempo Real**: Alertas via WebSocket de novas vagas e atualizações
- 💬 **Chat Integrado**: Comunicação direta com empresas
- 🔐 **Recuperação de Senha**: Sistema seguro de reset de senha por email
- 🤖 **Smart Match**: Algoritmo inteligente de compatibilidade com análise multi-critérios

### 🤖 Smart Match - Match Inteligente

Sistema exclusivo de análise de compatibilidade que avalia **5 critérios** com pesos específicos:

| Critério | Peso | Descrição |
|----------|------|-----------|
| ♿ **Acessibilidade** | 35% | Verifica se a vaga oferece as acessibilidades que o candidato precisa |
| 👥 **Tipo de Deficiência** | 25% | Compatibilidade entre deficiência do candidato e tipos aceitos pela vaga |
| 🎓 **Escolaridade** | 15% | Compara nível educacional com requisito da vaga |
| 🏢 **Regime de Trabalho** | 15% | Valoriza trabalho remoto/híbrido para maior acessibilidade |
| 📍 **Localização** | 10% | Proximidade geográfica entre candidato e empresa |

**Recursos do Smart Match:**
- 📊 Score de 0-100% para cada vaga com indicador visual circular
- 📈 Breakdown visual por categoria com barras de progresso
- ✅ Lista de "Por que essa vaga combina com você" com razões específicas
- ⚠️ Alertas de pontos de atenção quando há incompatibilidades
- 🏆 Classificações visuais: Perfeito (90%+), Excelente (75%+), Bom (60%+), Razoável (40%+), Baixo (<40%)
- 🎯 Filtro por score mínimo (0-100%)
- 📱 Interface totalmente responsiva para mobile
- 🔄 Visualização em grid ou lista

### 🏢 Para Empresas

- 📝 **Cadastro Empresarial Completo**: CNPJ, porte, setor, endereço e dados de responsável
- 💼 **Publicação de Vagas**: Formulário detalhado com tipo, regime, benefícios e acessibilidades oferecidas
- 📈 **Dashboard Gerencial**: Métricas de vagas ativas, candidaturas recebidas e visualizações
- 👤 **Gestão de Candidaturas**: Visualização de currículos e perfis dos candidatos
- ♿ **Declaração de Acessibilidade**: Registro de recursos de acessibilidade disponíveis na empresa
- 🔐 **Controle de Vagas**: Abrir, fechar e editar vagas publicadas
- 📊 **Analytics**: Relatórios e estatísticas de desempenho
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

### 📱 PWA (Progressive Web App)

- 📲 **Instalável**: App pode ser instalado no celular ou desktop
- 📴 **Modo Offline**: Página offline amigável quando sem conexão
- 🔔 **Push Notifications**: Notificações mesmo com app fechado
- ⚡ **Cache Inteligente**: Carregamento rápido com cache estratégico

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

- **Frontend**: `http://localhost:8081`
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
| **React 19** | Biblioteca UI |
| **TypeScript** | Tipagem estática |
| **Vite** | Build tool e dev server |
| **React Router DOM** | Roteamento SPA |
| **TailwindCSS** | Estilização utility-first |
| **Radix UI** | Componentes acessíveis |
| **Shadcn/ui** | Design system |
| **React Hook Form** | Gerenciamento de formulários |
| **Zod** | Validação de schemas |
| **Zustand** | Gerenciamento de estado |
| **Recharts** | Gráficos e visualizações |
| **Socket.io Client** | WebSocket para tempo real |
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
| **Socket.io** | WebSocket para tempo real |
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
| **Playwright** | Testes E2E |
| **Jest** | Testes unitários |
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
│   │   ├── server.ts              # Ponto de entrada + Socket.io
│   │   ├── 📂 config/             # Configurações (Swagger)
│   │   ├── 📂 controllers/        # Lógica das rotas
│   │   ├── 📂 services/           # Regras de negócio
│   │   │   ├── email.service.ts   # Notificações por email
│   │   │   ├── socket.service.ts  # WebSocket em tempo real
│   │   │   └── ...
│   │   ├── 📂 repositories/       # Acesso ao banco
│   │   ├── 📂 middleware/         # Auth, uploads, rate limit
│   │   └── 📂 routes/             # Definição de rotas
│   └── 📂 uploads/                # Arquivos (currículos, avatares, laudos)
├── 📂 frontend/
│   ├── 📂 public/
│   │   ├── manifest.json          # PWA manifest
│   │   ├── sw.js                  # Service Worker
│   │   ├── offline.html           # Página offline
│   │   └── 📂 icons/              # Ícones do PWA
│   ├── 📂 src/
│   │   ├── App.tsx                # Componente raiz + rotas
│   │   ├── main.tsx               # Ponto de entrada
│   │   ├── 📂 components/
│   │   │   ├── 📂 ui/             # Componentes Shadcn
│   │   │   ├── AccessibilityButton.tsx
│   │   │   ├── AccessibilityPanel.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── PWAInstallPrompt.tsx
│   │   │   └── ...
│   │   ├── 📂 pages/
│   │   │   ├── 📂 auth/           # Login, cadastro, reset senha
│   │   │   └── 📂 dashboard/      # Admin, company, candidate
│   │   ├── 📂 providers/          # Context providers
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── NotificationProvider.tsx
│   │   │   └── ...
│   │   ├── 📂 services/           # Chamadas à API + Socket
│   │   ├── 📂 stores/             # Estado global (Zustand)
│   │   ├── 📂 hooks/              # Custom hooks
│   │   └── 📂 types/              # Tipos TypeScript
│   ├── 📂 e2e/                    # Testes E2E Playwright
│   │   ├── landing.spec.ts
│   │   ├── auth.spec.ts
│   │   ├── accessibility.spec.ts
│   │   └── flows.spec.ts
│   └── playwright.config.ts       # Config do Playwright
├── .gitignore
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
| `GET` | `/vagas` | Listar vagas |
| `POST` | `/vagas` | Criar vaga |
| `POST` | `/candidaturas` | Criar candidatura |
| `GET` | `/matching/candidato/:id` | Vagas recomendadas |
| `GET` | `/smart-match/candidato/:id/vagas` | Smart Match - vagas com score |
| `GET` | `/smart-match/candidato/:id/vaga/:vagaId` | Score detalhado para uma vaga |
| `GET` | `/stats` | Estatísticas públicas |

---

## 📱 PWA - Progressive Web App

O ConectaPCD é um PWA completo, permitindo:

1. **Instalar como App**:
   - Desktop: Chrome > Menu > "Instalar ConectaPCD"
   - Mobile: "Adicionar à tela inicial"

2. **Funcionar Offline**:
   - Páginas em cache são exibidas
   - Página offline amigável quando necessário

3. **Receber Notificações**:
   - Push notifications de novas vagas
   - Alertas de candidaturas

---

## 🧪 Testes

### Testes E2E (Frontend)

```bash
cd frontend

# Rodar todos os testes
npm test

# Interface visual do Playwright
npm run test:ui

# Ver navegador durante os testes
npm run test:headed

# Gerar relatório HTML
npm run test:report
```

### Testes Unitários (Backend)

```bash
cd backend

# Rodar todos os testes
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:coverage
```

### Cobertura de Testes

- **E2E**: Landing, autenticação, acessibilidade, fluxos de usuário
- **Unitários**: Services de auth, candidaturas, rate limiting

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

## 👨‍💻 Autor

**Eduardo Miranda**

- GitHub: [@dudumiranda3105](https://github.com/dudumiranda3105)

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
