import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ConectaPCD API',
      version: '1.0.0',
      description: `
# API ConectaPCD

Plataforma de conexão entre Pessoas com Deficiência (PcD) e empresas.

## Autenticação

A API usa JWT (JSON Web Token) para autenticação. Após o login, inclua o token no header:

\`\`\`
Authorization: Bearer <seu_token>
\`\`\`

## Códigos de Resposta

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Não autorizado |
| 404 | Não encontrado |
| 500 | Erro interno |
      `,
      contact: {
        name: 'Suporte ConectaPCD',
        email: 'suporte@conectapcd.com.br',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento',
      },
      {
        url: 'https://api.conectapcd.com.br',
        description: 'Servidor de produção',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido no login',
        },
      },
      schemas: {
        // Auth
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'usuario@email.com' },
            password: { type: 'string', example: 'senha123' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            password: { type: 'string', minLength: 6, example: 'senha123' },
            role: { type: 'string', enum: ['candidato', 'empresa'], default: 'candidato' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'João Silva' },
                email: { type: 'string', example: 'joao@email.com' },
                role: { type: 'string', example: 'candidato' },
              },
            },
          },
        },

        // Password Reset
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email', 'userType'],
          properties: {
            email: { type: 'string', format: 'email', example: 'usuario@email.com' },
            userType: { type: 'string', enum: ['candidato', 'empresa'] },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['token', 'newPassword', 'userType'],
          properties: {
            token: { type: 'string', example: 'uuid-token-here' },
            newPassword: { type: 'string', minLength: 6, example: 'novaSenha123' },
            userType: { type: 'string', enum: ['candidato', 'empresa'] },
          },
        },

        // Candidato
        Candidato: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Maria Santos' },
            email: { type: 'string', example: 'maria@email.com' },
            cpf: { type: 'string', example: '123.456.789-00' },
            telefone: { type: 'string', example: '(11) 99999-9999' },
            dataNascimento: { type: 'string', format: 'date' },
            tipoDeficienciaId: { type: 'integer' },
            experiencias: { type: 'string' },
            curriculoUrl: { type: 'string' },
            avatarUrl: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // Empresa
        Empresa: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Tech Solutions LTDA' },
            email: { type: 'string', example: 'rh@techsolutions.com.br' },
            cnpj: { type: 'string', example: '12.345.678/0001-90' },
            endereco: { type: 'string' },
            telefone: { type: 'string' },
            website: { type: 'string' },
            descricao: { type: 'string' },
            totalFuncionarios: { type: 'integer' },
            funcionariosPCD: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // Vaga
        Vaga: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'Desenvolvedor Front-end' },
            descricao: { type: 'string' },
            requisitos: { type: 'string' },
            beneficios: { type: 'string' },
            salarioMin: { type: 'number', example: 3000 },
            salarioMax: { type: 'number', example: 5000 },
            cargaHoraria: { type: 'string', example: '40h semanais' },
            localTrabalho: { type: 'string', example: 'São Paulo - SP' },
            tipoContrato: { type: 'string', example: 'CLT' },
            modeloTrabalho: { type: 'string', enum: ['presencial', 'remoto', 'hibrido'] },
            status: { type: 'string', enum: ['ativa', 'pausada', 'encerrada'], default: 'ativa' },
            empresaId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateVagaRequest: {
          type: 'object',
          required: ['titulo', 'descricao', 'empresaId'],
          properties: {
            titulo: { type: 'string', example: 'Desenvolvedor Front-end' },
            descricao: { type: 'string' },
            requisitos: { type: 'string' },
            beneficios: { type: 'string' },
            salarioMin: { type: 'number' },
            salarioMax: { type: 'number' },
            cargaHoraria: { type: 'string' },
            localTrabalho: { type: 'string' },
            tipoContrato: { type: 'string' },
            modeloTrabalho: { type: 'string', enum: ['presencial', 'remoto', 'hibrido'] },
            tiposDeficiencia: { type: 'array', items: { type: 'integer' } },
            acessibilidades: { type: 'array', items: { type: 'integer' } },
          },
        },

        // Candidatura
        Candidatura: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            candidatoId: { type: 'integer' },
            vagaId: { type: 'integer' },
            status: { type: 'string', enum: ['pendente', 'em_analise', 'aprovado', 'rejeitado', 'contratado'] },
            mensagem: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            candidato: { $ref: '#/components/schemas/Candidato' },
            vaga: { $ref: '#/components/schemas/Vaga' },
          },
        },

        // Tipos e Subtipos de Deficiência
        TipoDeficiencia: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Deficiência Física' },
            descricao: { type: 'string' },
            subtipos: { type: 'array', items: { $ref: '#/components/schemas/SubtipoDeficiencia' } },
          },
        },
        SubtipoDeficiencia: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Paraplegia' },
            tipoId: { type: 'integer' },
          },
        },

        // Acessibilidade
        Acessibilidade: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Rampa de acesso' },
            descricao: { type: 'string' },
          },
        },

        // Barreira
        Barreira: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Falta de rampa' },
            descricao: { type: 'string' },
          },
        },

        // Mensagem/Chat
        Mensagem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            conversaId: { type: 'integer' },
            remetenteId: { type: 'integer' },
            remetenteTipo: { type: 'string', enum: ['candidato', 'empresa'] },
            conteudo: { type: 'string' },
            lida: { type: 'boolean', default: false },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        // Stats
        PublicStats: {
          type: 'object',
          properties: {
            totalCandidatos: { type: 'integer', example: 1500 },
            totalEmpresas: { type: 'integer', example: 200 },
            totalVagas: { type: 'integer', example: 350 },
            totalContratacoes: { type: 'integer', example: 450 },
          },
        },

        // Error
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem de erro' },
          },
        },
      },
    },
    tags: [
      { name: 'Autenticação', description: 'Endpoints de login, registro e recuperação de senha' },
      { name: 'Candidatos', description: 'Gerenciamento de candidatos PcD' },
      { name: 'Empresas', description: 'Gerenciamento de empresas' },
      { name: 'Vagas', description: 'Gerenciamento de vagas de emprego' },
      { name: 'Candidaturas', description: 'Gerenciamento de candidaturas' },
      { name: 'Matching', description: 'Sistema de matching inteligente' },
      { name: 'Mensagens', description: 'Sistema de chat' },
      { name: 'Acessibilidades', description: 'Recursos de acessibilidade' },
      { name: 'Tipos de Deficiência', description: 'Categorias de deficiência' },
      { name: 'Estatísticas', description: 'Dados estatísticos da plataforma' },
      { name: 'Admin', description: 'Endpoints administrativos' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

// Documentação inline para rotas principais
export const swaggerDocs = {
  // Auth
  '/auth/register': {
    post: {
      tags: ['Autenticação'],
      summary: 'Registrar novo usuário',
      description: 'Cria uma nova conta de candidato ou empresa',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
      },
      responses: {
        201: { description: 'Usuário criado com sucesso', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
        400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      },
    },
  },
  '/auth/login': {
    post: {
      tags: ['Autenticação'],
      summary: 'Login de usuário',
      description: 'Autentica um usuário e retorna o token JWT',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
      },
      responses: {
        200: { description: 'Login bem sucedido', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
        401: { description: 'Credenciais inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      },
    },
  },
  '/auth/forgot-password': {
    post: {
      tags: ['Autenticação'],
      summary: 'Solicitar reset de senha',
      description: 'Envia um email com link para resetar a senha',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ForgotPasswordRequest' } } },
      },
      responses: {
        200: { description: 'Email enviado (se existir)' },
        400: { description: 'Dados inválidos' },
      },
    },
  },
  '/auth/reset-password': {
    post: {
      tags: ['Autenticação'],
      summary: 'Resetar senha',
      description: 'Define uma nova senha usando o token recebido por email',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordRequest' } } },
      },
      responses: {
        200: { description: 'Senha alterada com sucesso' },
        400: { description: 'Token inválido ou expirado' },
      },
    },
  },

  // Vagas
  '/vagas': {
    get: {
      tags: ['Vagas'],
      summary: 'Listar vagas',
      description: 'Retorna lista de vagas ativas',
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        { name: 'search', in: 'query', schema: { type: 'string' } },
        { name: 'tipoDeficiencia', in: 'query', schema: { type: 'integer' } },
      ],
      responses: {
        200: { description: 'Lista de vagas', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Vaga' } } } } },
      },
    },
    post: {
      tags: ['Vagas'],
      summary: 'Criar vaga',
      description: 'Cria uma nova vaga de emprego',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateVagaRequest' } } },
      },
      responses: {
        201: { description: 'Vaga criada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Vaga' } } } },
        401: { description: 'Não autenticado' },
      },
    },
  },
  '/vagas/{id}': {
    get: {
      tags: ['Vagas'],
      summary: 'Buscar vaga por ID',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Dados da vaga', content: { 'application/json': { schema: { $ref: '#/components/schemas/Vaga' } } } },
        404: { description: 'Vaga não encontrada' },
      },
    },
    put: {
      tags: ['Vagas'],
      summary: 'Atualizar vaga',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateVagaRequest' } } },
      },
      responses: {
        200: { description: 'Vaga atualizada' },
        401: { description: 'Não autenticado' },
        404: { description: 'Vaga não encontrada' },
      },
    },
    delete: {
      tags: ['Vagas'],
      summary: 'Excluir vaga',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Vaga excluída' },
        401: { description: 'Não autenticado' },
      },
    },
  },

  // Candidaturas
  '/candidaturas': {
    post: {
      tags: ['Candidaturas'],
      summary: 'Criar candidatura',
      description: 'Candidata-se a uma vaga',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 
          'application/json': { 
            schema: { 
              type: 'object',
              required: ['vagaId'],
              properties: {
                vagaId: { type: 'integer' },
                mensagem: { type: 'string' },
              },
            } 
          } 
        },
      },
      responses: {
        201: { description: 'Candidatura criada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Candidatura' } } } },
        401: { description: 'Não autenticado' },
        400: { description: 'Já candidatado ou vaga inválida' },
      },
    },
  },
  '/candidaturas/{id}/status': {
    patch: {
      tags: ['Candidaturas'],
      summary: 'Atualizar status da candidatura',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: { 
          'application/json': { 
            schema: { 
              type: 'object',
              properties: {
                status: { type: 'string', enum: ['pendente', 'em_analise', 'aprovado', 'rejeitado', 'contratado'] },
              },
            } 
          } 
        },
      },
      responses: {
        200: { description: 'Status atualizado' },
        401: { description: 'Não autenticado' },
      },
    },
  },

  // Matching
  '/matching/candidato/{candidatoId}': {
    get: {
      tags: ['Matching'],
      summary: 'Vagas recomendadas para candidato',
      description: 'Retorna vagas compatíveis com o perfil do candidato',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'candidatoId', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Lista de vagas recomendadas com score de compatibilidade' },
      },
    },
  },
  '/matching/vaga/{vagaId}': {
    get: {
      tags: ['Matching'],
      summary: 'Candidatos recomendados para vaga',
      description: 'Retorna candidatos compatíveis com os requisitos da vaga',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'vagaId', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Lista de candidatos recomendados com score de compatibilidade' },
      },
    },
  },

  // Stats
  '/stats': {
    get: {
      tags: ['Estatísticas'],
      summary: 'Estatísticas públicas',
      description: 'Retorna estatísticas gerais da plataforma',
      responses: {
        200: { 
          description: 'Estatísticas da plataforma', 
          content: { 'application/json': { schema: { $ref: '#/components/schemas/PublicStats' } } } 
        },
      },
    },
  },

  // Mensagens
  '/mensagens/conversas': {
    get: {
      tags: ['Mensagens'],
      summary: 'Listar conversas',
      description: 'Retorna todas as conversas do usuário',
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'Lista de conversas' },
      },
    },
  },
  '/mensagens/conversas/{conversaId}': {
    get: {
      tags: ['Mensagens'],
      summary: 'Obter mensagens de uma conversa',
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'conversaId', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Lista de mensagens' },
      },
    },
  },
  '/mensagens/enviar': {
    post: {
      tags: ['Mensagens'],
      summary: 'Enviar mensagem',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 
          'application/json': { 
            schema: { 
              type: 'object',
              required: ['conversaId', 'conteudo'],
              properties: {
                conversaId: { type: 'integer' },
                conteudo: { type: 'string' },
              },
            } 
          } 
        },
      },
      responses: {
        201: { description: 'Mensagem enviada' },
      },
    },
  },
};
