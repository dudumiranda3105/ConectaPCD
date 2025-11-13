import * as z from 'zod'
import { ACESSIBILIDADES_OFERECIDAS } from './company-signup-schema'

export const JOB_TYPES = [
  'Tempo integral',
  'Meio período',
  'Contrato',
  'Temporário',
  'Estágio',
] as const
export const JOB_REGIMES = ['Presencial', 'Híbrido', 'Remoto'] as const

export const ESCOLARIDADES = [
  'Ensino Fundamental',
  'Ensino Médio',
  'Técnico',
  'Superior Incompleto',
  'Superior Completo',
  'Pós-graduação',
  'Mestrado',
  'Doutorado',
] as const

export const jobPostingSchema = z.object({
  title: z.string().min(1, { message: 'O título da vaga é obrigatório.' }),
  description: z
    .string()
    .min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.' }),
  type: z.enum(JOB_TYPES, { required_error: 'O tipo de vaga é obrigatório.' }),
  regime: z.enum(JOB_REGIMES, {
    required_error: 'O regime de trabalho é obrigatório.',
  }),
  escolaridade: z.enum(ESCOLARIDADES, { required_error: 'Escolaridade obrigatória.' }),
  accessibilities: z
    .array(z.enum(ACESSIBILIDADES_OFERECIDAS))
    .min(1, { message: 'Selecione ao menos uma acessibilidade.' }),
  benefits: z.string().min(1, { message: 'Informe ao menos um benefício.' }),
})

export type JobPostingFormValues = z.infer<typeof jobPostingSchema>
