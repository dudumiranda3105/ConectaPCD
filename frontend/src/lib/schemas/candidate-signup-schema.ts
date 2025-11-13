import * as z from 'zod'

export const personalDataSchema = z.object({
  name: z.string().min(3, { message: 'O nome completo é obrigatório.' }),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' }),
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
  uf: z.string().length(2, { message: 'UF deve ter 2 caracteres.' }),
  cidade: z.string().min(1, { message: 'A cidade é obrigatória.' }),
  bairro: z.string().min(1, { message: 'O bairro é obrigatório.' }),
  rua: z.string().min(1, { message: 'A rua é obrigatória.' }),
  numero: z.string().min(1, { message: 'O número é obrigatório.' }),
  complemento: z.string().optional(),
})

export const experienceSchema = z.object({
  company: z.string().min(1, { message: 'Nome da empresa é obrigatório.' }),
  role: z.string().min(1, { message: 'Cargo é obrigatório.' }),
  startDate: z.string().min(1, { message: 'Data de início é obrigatória.' }),
  endDate: z.string().optional(),
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
  experiences: z.array(experienceSchema).optional(),
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

export const candidateSignupSchema = z.object({
  ...personalDataSchema.shape,
  ...addressSchema.shape,
  ...educationExperienceSchema.shape,
  ...disabilityInfoSchema.shape,
  disabilityTypes: z.array(z.enum(DISABILITY_TYPES)).optional(),
  barriers: z.array(z.string()).optional(),
})

export type PersonalDataValues = z.infer<typeof personalDataSchema>
export type AddressValues = z.infer<typeof addressSchema>
export type EducationExperienceValues = z.infer<
  typeof educationExperienceSchema
>
export type DisabilityInfoValues = z.infer<typeof disabilityInfoSchema>
export type CandidateSignupFormValues = z.infer<typeof candidateSignupSchema>
