import * as z from 'zod'

export const GENEROS = [
  'Masculino',
  'Feminino',
  'Não-binário',
  'Prefiro não informar',
  'Outro',
] as const

export const personalDataSchema = z.object({
  name: z.string().min(3, { message: 'O nome completo é obrigatório.' }),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido.' }),
  telefone: z
    .string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, { message: 'Telefone inválido.' }),
  dataNascimento: z.string().min(1, { message: 'Data de nascimento é obrigatória.' }),
  genero: z.enum(GENEROS, {
    required_error: 'Gênero é obrigatório.',
  }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
    .regex(/[A-Z]/, { message: 'A senha deve conter pelo menos uma letra maiúscula.' })
    .regex(/[a-z]/, { message: 'A senha deve conter pelo menos uma letra minúscula.' })
    .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número.' })
    .regex(/[^A-Za-z0-9]/, { message: 'A senha deve conter pelo menos um caractere especial.' }),
  confirmPassword: z
    .string()
    .min(8, { message: 'A confirmação de senha é obrigatória.' }),
})

export const personalDataSignupSchema = personalDataSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  },
)

export const addressSchema = z.object({
  cep: z.string().regex(/^\d{5}-\d{3}$/, { message: 'CEP inválido.' }),
  uf: z.string().min(2, { message: 'O estado é obrigatório.' }),
  cidade: z.string().min(1, { message: 'A cidade é obrigatória.' }),
  bairro: z.string().min(1, { message: 'O bairro é obrigatório.' }),
  rua: z.string().min(1, { message: 'A rua é obrigatória.' }),
  numero: z.string().min(1, { message: 'O número é obrigatório.' }),
  complemento: z.string().optional(),
})

export const experienceSchema = z.object({
  empresa: z.string().min(1, { message: 'Nome da empresa é obrigatório.' }),
  cargo: z.string().min(1, { message: 'Cargo é obrigatório.' }),
  dataInicio: z.string().min(1, { message: 'Data de início é obrigatória.' }),
  dataFim: z.string().optional(),
  atualmenteTrabalha: z.boolean().default(false),
  descricao: z.string().max(500, { message: 'Descrição deve ter no máximo 500 caracteres.' }).optional(),
})

export const EDUCATION_LEVELS = [
  'Ensino Fundamental Incompleto',
  'Ensino Fundamental Completo',
  'Ensino Médio Incompleto',
  'Ensino Médio Completo',
  'Ensino Superior Incompleto',
  'Ensino Superior Completo',
  'Pós-graduação',
  'Mestrado',
  'Doutorado',
] as const

export const educationExperienceSchema = z.object({
  educationLevel: z.enum(EDUCATION_LEVELS, {
    required_error: 'Nível de escolaridade é obrigatório.',
  }),
  course: z.string().min(1, { message: 'Curso é obrigatório.' }),
  institution: z.string().min(1, { message: 'Instituição é obrigatória.' }),
  curriculoUrl: z.string().url({ message: 'URL inválida.' }).optional().or(z.literal('')),
  linkedin: z.string().url({ message: 'URL inválida.' }).optional().or(z.literal('')),
  portfolio: z.string().url({ message: 'URL inválida.' }).optional().or(z.literal('')),
  experiences: z.array(experienceSchema).optional().default([]),
})

export const DISABILITY_TYPES = [
  'Visual',
  'Auditiva',
  'Física/Motora',
  'Intelectual/Cognitiva',
  'Mental/Psicossocial',
  'Múltipla',
] as const

export const disabilityInfoSchema = z.object({
  disabilities: z
    .array(
      z.object({
        typeId: z.number(),
        subtypes: z
          .array(
            z.object({
              subtypeId: z.number(),
              barriers: z.array(z.number()),
            }),
          )
          .min(1, {
            message:
              'Selecione ao menos um subtipo para a deficiência escolhida.',
          }),
      }),
    )
    .min(1, { message: 'Selecione ao menos um tipo de deficiência.' }),
})

export const ASSISTIVE_RESOURCE_USE = [
  'sempre',
  'frequente',
  'ocasional',
] as const

export const MOBILITY_IMPACT = [
  'leve',
  'moderado',
  'severo',
] as const

export const assistiveResourceSelectionSchema = z.object({
  recursoId: z.number(),
  usoFrequencia: z.enum(ASSISTIVE_RESOURCE_USE).optional(),
  impactoMobilidade: z.enum(MOBILITY_IMPACT).optional(),
})

export const candidateSignupSchema = z.object({
  ...personalDataSchema.shape,
  ...addressSchema.shape,
  ...educationExperienceSchema.shape,
  ...disabilityInfoSchema.shape,
  disabilityTypes: z.array(z.enum(DISABILITY_TYPES)).optional(),
  barriers: z.array(z.string()).optional(),
  assistiveResources: z.array(assistiveResourceSelectionSchema).optional(),
})

export type PersonalDataValues = z.infer<typeof personalDataSchema>
export type AddressValues = z.infer<typeof addressSchema>
export type ExperienceValues = z.infer<typeof experienceSchema>
export type EducationExperienceValues = z.infer<
  typeof educationExperienceSchema
>
export type DisabilityInfoValues = z.infer<typeof disabilityInfoSchema>
export type AssistiveResourceSelection = z.infer<typeof assistiveResourceSelectionSchema>
export type CandidateSignupFormValues = z.infer<typeof candidateSignupSchema>
