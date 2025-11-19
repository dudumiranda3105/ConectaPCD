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
- 📄 **Upload de Currículo**: Envio de currículo em PDF com armazenamento seguro
- 🔍 **Busca Inteligente de Vagas**: Filtros por tipo, regime, escolaridade e acessibilidades oferecidas
- 🤝 **Sistema de Match**: Algoritmo que conecta candidatos às vagas mais compatíveis
- 📊 **Dashboard Personalizado**: Visualização de candidaturas, matches e status em tempo real
- 🔔 **Notificações**: Alertas de novas vagas compatíveis e atualizações de candidaturas

### 🏢 Para Empresas

- 📝 **Cadastro Empresarial Completo**: CNPJ, porte, setor, endereço e dados de responsável
- 💼 **Publicação de Vagas**: Formulário detalhado com tipo, regime, benefícios e acessibilidades oferecidas
- 📈 **Dashboard Gerencial**: Métricas de vagas ativas, candidaturas recebidas e visualizações
- 👤 **Gestão de Candidaturas**: Visualização de currículos e perfis dos candidatos
- ♿ **Declaração de Acessibilidade**: Registro de recursos de acessibilidade disponíveis na empresa
- 🔐 **Controle de Vagas**: Abrir, fechar e editar vagas publicadas

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

---

## 🚀 Como Usar

### 📋 Pré-requisitos

- **Node.js** 18+ 
- **PostgreSQL** 14+
- **npm** ou **yarn**

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

# Terminal 2 - Frontend (porta 5173)
cd frontend
npm run dev
```

6. **Acesse a aplicação**

Abra seu navegador em: `http://localhost:5173`

### 👤 Usuários de Teste

Após executar o seed, você terá acesso aos seguintes usuários:

**Administrador:**
- Email: `admin@conectapcd.com`
- Senha: `Admin123`

---

## 🛠️ Tecnologias

### Frontend

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **TailwindCSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Zustand** - Gerenciamento de estado
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones
- **Sonner** - Notificações toast

### Backend

- **Node.js** - Runtime JavaScript
- **Express 5** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma ORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt.js** - Hash de senhas
- **Multer** - Upload de arquivos
- **CORS** - Controle de acesso

### DevOps & Tools

- **tsx** - Executar TypeScript
- **ts-node-dev** - Hot reload para desenvolvimento
- **Prettier** - Formatação de código
- **ESLint** - Linting

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
│   │   ├── 📂 controllers/        # Lógica das rotas
│   │   ├── 📂 services/           # Regras de negócio
│   │   ├── 📂 repositories/       # Acesso ao banco
│   │   ├── 📂 middleware/         # Autenticação e uploads
│   │   └── 📂 routes/             # Definição de rotas
│   └── 📂 uploads/                # Arquivos enviados (currículos, avatares)
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── App.tsx                # Componente raiz
│   │   ├── main.tsx               # Ponto de entrada
│   │   ├── 📂 components/         # Componentes reutilizáveis
│   │   │   ├── 📂 ui/             # Componentes base (Shadcn)
│   │   │   └── 📂 dashboard/      # Componentes de dashboard
│   │   ├── 📂 pages/              # Páginas da aplicação
│   │   │   ├── 📂 auth/           # Login, cadastro
│   │   │   ├── 📂 dashboard/      # Dashboards (admin, company, candidate)
│   │   │   └── 📂 jobs/           # Páginas de vagas
│   │   ├── 📂 services/           # Chamadas à API
│   │   ├── 📂 stores/             # Estado global (Zustand)
│   │   ├── 📂 lib/                # Utilitários
│   │   │   └── 📂 schemas/        # Schemas Zod
│   │   └── 📂 types/              # Tipos TypeScript
│   └── 📂 public/                 # Arquivos estáticos
└── 📄 README.md                    # Este arquivo
```

---

## 🔐 Autenticação e Autorização

A aplicação utiliza **JWT (JSON Web Tokens)** para autenticação com três níveis de acesso:

- **ADMIN** - Acesso completo ao painel administrativo
- **COMPANY** - Publicação de vagas e gestão de candidaturas
- **CANDIDATE** - Candidatura a vagas e gestão de perfil

### Fluxo de Autenticação

1. **Cadastro**: Usuário preenche formulário multi-step
2. **Login**: Credenciais validadas e JWT gerado
3. **Token**: Armazenado no localStorage do navegador
4. **Requisições**: Token enviado no header `Authorization: Bearer <token>`
5. **Middleware**: Valida token e role em rotas protegidas

---

## 📊 Modelo de Dados

### Principais Entidades

- **Usuario** - Credenciais de autenticação (email, senha, role)
- **Candidato** - Perfil completo do candidato PCD
- **Empresa** - Dados da empresa contratante
- **Vaga** - Oportunidades de emprego publicadas
- **Candidatura** - Relação candidato-vaga
- **Tipo** - Tipos de deficiência (visual, auditiva, física, etc.)
- **Subtipo** - Subtipos específicos de cada deficiência
- **Barreira** - Barreiras enfrentadas por candidatos
- **Acessibilidade** - Recursos de acessibilidade oferecidos
- **Match** - Algoritmo de compatibilidade candidato-vaga

### Relacionamentos Principais

```
Usuario 1:1 Candidato
Usuario 1:1 Empresa
Empresa 1:N Vaga
Candidato N:M Vaga (através de Candidatura)
Candidato N:M Subtipo (através de CandidatoSubtipo)
Subtipo N:M Barreira (através de SubtipoBarreira)
Vaga N:M Acessibilidade (através de VagaAcessibilidade)
```

---

## 🎨 Design System

A aplicação utiliza um design system consistente baseado em:

- **Cores Principais**: 
  - Azul (`blue`) - Ações primárias
  - Índigo (`indigo`) - Destaques secundários
  - Rosa (`rose`) - Barreiras e alertas
  - Esmeralda (`emerald`) - Acessibilidades e sucesso
  - Violeta (`violet`) - Admin e vinculações

- **Tipografia**: 
  - Font: System UI Stack
  - Escalas: `text-xs` até `text-4xl`

- **Componentes**: 
  - Radix UI para acessibilidade
  - Shadcn para consistência visual
  - TailwindCSS para customização

- **Animações**:
  - Transições suaves com `transition-all duration-200`
  - Hover effects com `hover:scale-105`
  - Fade-in animations para melhor UX

---

## 🧪 Testes

```bash
# Frontend
cd frontend
npm run test

# Backend
cd backend
npm run test
```

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
