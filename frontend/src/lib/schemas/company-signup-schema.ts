import * as z from 'zod'

export const SETORES_ATIVIDADE = [
  'Tecnologia',
  'Saúde',
  'Educação',
  'Varejo',
  'Financeiro',
  'Indústria',
  'Outro',
] as const

export const PORTES_EMPRESA = [
  'MEI',
  'Microempresa',
  'Pequeno Porte',
  'Médio Porte',
  'Grande Porte',
] as const

export const ESTADOS_BRASILEIROS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const

export const ACESSIBILIDADES_OFERECIDAS = [
  'Rampas de acesso',
  'Sanitários adaptados',
  'Piso tátil',
  'Intérprete de Libras',
  'Mobiliário adaptado',
  'Elevadores adaptados',
  'Vagas de estacionamento para PCDs',
  'Sinalização em Braille',
  'Software de leitura de tela',
  'Transporte adaptado',
] as const

export const BARREIRAS = [
  'Arquitetônicas',
  'Comunicacionais',
  'Atitudinais',
  'Tecnológicas',
  'De Transporte',
] as const

// Step 1: Company Data
export const companyDataSchema = z
  .object({
    razaoSocial: z
      .string()
      .min(1, { message: 'A razão social é obrigatória.' }),
    nomeFantasia: z
      .string()
      .min(1, { message: 'O nome fantasia é obrigatório.' }),
    cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
      message: 'CNPJ inválido. Use o formato 00.000.000/0000-00.',
    }),
    porte: z.enum(PORTES_EMPRESA, {
      required_error: 'O porte da empresa é obrigatório.',
    }),
    setorAtividade: z.enum(SETORES_ATIVIDADE, {
      required_error: 'O setor de atividade é obrigatório.',
    }),
    descricao: z.string().max(1000, { message: 'Descrição deve ter no máximo 1000 caracteres.' }).optional(),
    siteEmpresa: z
      .string()
      .url({ message: 'URL inválida.' })
      .optional()
      .or(z.literal('')),
    telefone: z.string().min(1, { message: 'O telefone é obrigatório.' }),
    emailCorporativo: z
      .string()
      .email({ message: 'Por favor, insira um email válido.' }),
    senha: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
      .regex(/[A-Z]/, {
        message: 'A senha deve conter ao menos uma letra maiúscula.',
      })
      .regex(/[0-9]/, { message: 'A senha deve conter ao menos um número.' }),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
  })

// Step 2: Address and Contact
export const addressContactSchema = z.object({
  cep: z.string().regex(/^\d{5}-\d{3}$/, {
    message: 'CEP inválido. Use o formato 00000-000.',
  }),
  logradouro: z.string().min(1, { message: 'O logradouro é obrigatório.' }),
  numero: z.string().min(1, { message: 'O número é obrigatório.' }),
  complemento: z.string().optional(),
  bairro: z.string().min(1, { message: 'O bairro é obrigatório.' }),
  cidade: z.string().min(1, { message: 'A cidade é obrigatória.' }),
  estado: z.enum(ESTADOS_BRASILEIROS, {
    required_error: 'O estado é obrigatório.',
  }),
  nomeCompletoResponsavel: z
    .string()
    .min(1, { message: 'O nome do responsável é obrigatório.' }),
  cargoResponsavel: z
    .string()
    .min(1, { message: 'O cargo do responsável é obrigatório.' }),
  emailResponsavel: z
    .string()
    .email({ message: 'Por favor, insira um email válido.' }),
  telefoneResponsavel: z
    .string()
    .min(1, { message: 'O telefone do responsável é obrigatório.' }),
  possuiSistemaInterno: z.boolean().default(false),
})

// Step 3: Infrastructure
export const infrastructureSchema = z.object({
  acessibilidadesOferecidas: z
    .array(z.enum(ACESSIBILIDADES_OFERECIDAS))
    .min(1, { message: 'Selecione ao menos um recurso de acessibilidade.' }),
  outrosRecursosAcessibilidade: z.string().optional(),
  barreiras: z.array(z.enum(BARREIRAS)).optional(),
  outrasBarreiras: z.string().optional(),
  politicasInclusao: z.string().optional(),
  concordaTermos: z.literal(true, {
    errorMap: () => ({
      message: 'Você deve concordar com os termos para continuar.',
    }),
  }),
})

// Full Schema
export const companySignupSchema = z.object({
  ...companyDataSchema.shape,
  ...addressContactSchema.shape,
  ...infrastructureSchema.shape,
})

export type CompanyDataValues = z.infer<typeof companyDataSchema>
export type AddressContactValues = z.infer<typeof addressContactSchema>
export type InfrastructureValues = z.infer<typeof infrastructureSchema>
export type CompanySignupFormValues = z.infer<typeof companySignupSchema>
