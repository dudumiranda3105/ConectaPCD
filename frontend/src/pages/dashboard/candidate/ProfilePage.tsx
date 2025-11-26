import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  personalDataSchema,
  CandidateSignupFormValues,
  DisabilityInfoValues,
} from '@/lib/schemas/candidate-signup-schema'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Separator } from '@/components/ui/separator'
import { User } from '@/providers/AuthProvider'
import { DisabilityInfoDisplay } from '@/components/dashboard/candidate/DisabilityInfoDisplay'
import { DisabilityInfoEditor } from '@/components/dashboard/candidate/DisabilityInfoEditor'
import { MatchedJobs } from '@/components/dashboard/candidate/MatchedJobs'
import { getCandidateProfile, updateCandidateProfile, updateCandidateDisabilities, uploadCurriculo, deleteCurriculo, uploadAvatar, deleteAvatar, uploadLaudoMedico, deleteLaudoMedico, CandidateProfileData } from '@/services/profile'
import { Loader2, FileText, Eye, UploadCloud, Trash, Image as ImageIcon, X, CheckCircle2, User as UserIcon, Sparkles, Star, Shield, Award, Briefcase, GraduationCap, Mail, Phone, Edit3, Camera, TrendingUp, Zap, Calendar, Users, Stethoscope, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GENEROS, EDUCATION_LEVELS } from '@/lib/schemas/candidate-signup-schema'

import * as z from 'zod'

const profileFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome completo é obrigatório.' }),
  cpf: z.string(),
  email: z.string().email({ message: 'Email inválido.' }),
  telefone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, { message: 'Telefone inválido. Use (XX) XXXXX-XXXX' }).optional().or(z.literal('')),
  dataNascimento: z.string().optional(),
  genero: z.enum(GENEROS).optional(),
  escolaridade: z.enum(EDUCATION_LEVELS).optional().or(z.literal('')),
})
type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfilePage() {
  const { user } = useAuth() as { user: User | null }
  const { toast } = useToast()
  const [profileData, setProfileData] = useState<CandidateProfileData | null>(null)
  const [isDisabilityEditorOpen, setIsDisabilityEditorOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingCurriculo, setIsUploadingCurriculo] = useState(false)
  const [isRemovingCurriculo, setIsRemovingCurriculo] = useState(false)
  const [isUploadingLaudo, setIsUploadingLaudo] = useState(false)
  const [isRemovingLaudo, setIsRemovingLaudo] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      cpf: '',
      email: '',
      telefone: '',
      dataNascimento: '',
      genero: undefined,
      escolaridade: undefined,
    },
  })

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('auth_token')
      if (!token) return
      try {
        setIsLoading(true)
        const data = await getCandidateProfile(token)
        setProfileData(data)
        // Formatar data de nascimento para o formato yyyy-MM-dd
        let formattedDate = ''
        if (data.dataNascimento) {
          const date = new Date(data.dataNascimento)
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0]
          }
        }
        
        form.reset({
          name: data.nome || '',
          cpf: data.cpf || '',
          email: data.email || '',
          telefone: data.telefone || '',
          dataNascimento: formattedDate,
          genero: (data.genero as typeof GENEROS[number]) || undefined,
          escolaridade: (data.escolaridade as typeof EDUCATION_LEVELS[number]) || undefined,
        })
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar seus dados.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [form, toast])

  // Converter subtipos do backend para formato disabilities
  const disabilities: DisabilityInfoValues['disabilities'] = profileData?.subtipos?.reduce((acc, subtipo) => {
    const existing = acc.find(d => d.typeId === subtipo.subtipo.tipoId)
    const barriers = subtipo.barreiras.map(b => b.barreiraId)
    
    if (existing) {
      existing.subtypes.push({
        subtypeId: subtipo.subtipoId,
        barriers,
      })
    } else {
      acc.push({
        typeId: subtipo.subtipo.tipoId,
        subtypes: [{
          subtypeId: subtipo.subtipoId,
          barriers,
        }],
      })
    }
    return acc
  }, [] as DisabilityInfoValues['disabilities']) || []

  const onPersonalDataSubmit = async (data: ProfileFormValues) => {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    try {
      setIsSaving(true)
      const updated = await updateCandidateProfile(token, {
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        telefone: data.telefone || undefined,
        dataNascimento: data.dataNascimento || undefined,
        genero: data.genero || undefined,
        educationLevel: data.escolaridade || undefined,
      })
      setProfileData(updated)
      toast({
        title: 'Dados Pessoais Atualizados!',
        description: 'Suas informações foram salvas com sucesso.',
      })
      setSavedAt(Date.now())
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar seus dados.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Avatar handlers
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowed.includes(file.type)) {
      toast({ title: 'Formato inválido', description: 'Use PNG, JPG ou WEBP.', variant: 'destructive' })
      e.target.value = ''
      return
    }
    const maxBytes = 2 * 1024 * 1024
    if (file.size > maxBytes) {
      toast({ title: 'Arquivo grande', description: 'Máximo permitido: 2MB.', variant: 'destructive' })
      e.target.value = ''
      return
    }
    const token = localStorage.getItem('auth_token')
    if (!token) return
    try {
      setIsUploadingAvatar(true)
      const result = await uploadAvatar(token, file)
      setProfileData(prev => prev ? { ...prev, avatarUrl: result.avatarUrl } : prev)
      toast({ title: 'Avatar atualizado', description: 'Sua foto foi enviada.' })
    } catch (error) {
      console.error('Erro upload avatar:', error)
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Falha ao enviar avatar.', variant: 'destructive' })
    } finally {
      setIsUploadingAvatar(false)
      e.target.value = ''
    }
  }

  const handleAvatarDelete = async () => {
    const token = localStorage.getItem('auth_token')
    if (!token || !profileData?.avatarUrl) return
    if (!confirm('Remover avatar atual?')) return
    try {
      setIsRemovingAvatar(true)
      const result = await deleteAvatar(token)
      setProfileData(prev => prev ? { ...prev, avatarUrl: result.avatarUrl || undefined } : prev)
      toast({ title: 'Avatar removido', description: 'Você pode enviar outro quando quiser.' })
    } catch (error) {
      console.error('Erro ao remover avatar', error)
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Falha ao remover avatar.', variant: 'destructive' })
    } finally {
      setIsRemovingAvatar(false)
    }
  }

  // Perfil completeness
  const completeness = (() => {
    if (!profileData) return 0
    const fields: Array<[string, any]> = [
      ['nome', profileData.nome],
      ['cpf', profileData.cpf],
      ['email', profileData.email],
      ['telefone', profileData.telefone],
      ['dataNascimento', profileData.dataNascimento],
      ['genero', profileData.genero],
      ['escolaridade', profileData.escolaridade],
      ['curriculoUrl', profileData.curriculoUrl],
      ['laudoMedicoUrl', profileData.laudoMedicoUrl],
      ['avatarUrl', profileData.avatarUrl],
    ]
    const filled = fields.filter(([_, v]) => v && String(v).trim() !== '').length
    return Math.round((filled / fields.length) * 100)
  })()

  // Limpa badge salvo depois de 3s
  useEffect(() => {
    if (!savedAt) return
    const t = setTimeout(() => setSavedAt(null), 3000)
    return () => clearTimeout(t)
  }, [savedAt])

  const getInitials = (name?: string) => {
    if (!name) return '?'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }

  const handleDisabilitySave = async (
    newDisabilities: DisabilityInfoValues['disabilities'],
    newAccessibilities: Array<{ acessibilidadeId: number; prioridade: string }>
  ) => {
    const token = localStorage.getItem('auth_token')
    if (!token || !profileData?.id) {
      console.error('[ProfilePage] Token ou candidatoId não encontrado', { token: !!token, profileData: profileData?.id })
      toast({
        title: 'Erro',
        description: 'Sessão inválida. Faça login novamente.',
        variant: 'destructive',
      })
      return
    }

    try {
      // Converter formato disabilities para o esperado pelo backend
      const disabilitiesPayload = newDisabilities.flatMap(d =>
        d.subtypes.map(s => ({
          typeId: d.typeId,
          subtypeId: s.subtypeId,
          barriers: s.barriers,
        }))
      )
      
      console.log('[ProfilePage] Salvando deficiências e acessibilidades:', {
        candidatoId: profileData.id,
        disabilities: disabilitiesPayload,
        accessibilities: newAccessibilities,
      })
      
      const result = await updateCandidateDisabilities(token, profileData.id, disabilitiesPayload, newAccessibilities)
      console.log('[ProfilePage] Resultado da atualização:', result)
      
      // Recarregar perfil para obter dados atualizados
      const updatedData = await getCandidateProfile(token)
      console.log('[ProfilePage] Perfil atualizado:', updatedData)
      setProfileData(updatedData)
      
      setIsDisabilityEditorOpen(false)
      toast({
        title: 'Informações Atualizadas! ✅',
        description: `Deficiências e ${newAccessibilities.length} necessidade(s) de acessibilidade salvas com sucesso.`,
      })
    } catch (error) {
      console.error('[ProfilePage] Erro ao salvar deficiências:', error)
      toast({
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Não foi possível salvar as informações de deficiência.',
        variant: 'destructive',
      })
    }
  }

  const handleCurriculoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(file.type)) {
      toast({
        title: 'Tipo inválido',
        description: 'Envie apenas PDF, DOC ou DOCX.',
        variant: 'destructive',
      })
      e.target.value = ''
      return
    }
    const maxBytes = 5 * 1024 * 1024
    if (file.size > maxBytes) {
      toast({
        title: 'Arquivo grande demais',
        description: 'Tamanho máximo permitido: 5MB.',
        variant: 'destructive',
      })
      e.target.value = ''
      return
    }
    const token = localStorage.getItem('auth_token')
    if (!token) return
    try {
      setIsUploadingCurriculo(true)
      const result = await uploadCurriculo(token, file)
      setProfileData(prev => prev ? { ...prev, curriculoUrl: result.curriculoUrl } : prev)
      toast({
        title: 'Currículo enviado',
        description: 'Seu currículo foi atualizado com sucesso.',
      })
    } catch (error) {
      console.error('Erro upload currículo:', error)
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Falha ao enviar currículo.',
        variant: 'destructive',
      })
    } finally {
      setIsUploadingCurriculo(false)
      e.target.value = ''
    }
  }

  const handleCurriculoDelete = async () => {
    const token = localStorage.getItem('auth_token')
    if (!token || !profileData?.curriculoUrl) return
    if (!confirm('Remover currículo atual?')) return
    try {
      setIsRemovingCurriculo(true)
      const result = await deleteCurriculo(token)
      setProfileData(prev => prev ? { ...prev, curriculoUrl: result.curriculoUrl || undefined } : prev)
      toast({ title: 'Currículo removido', description: 'Você pode enviar outro quando quiser.' })
    } catch (error) {
      console.error('Erro ao remover currículo', error)
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Falha ao remover currículo.', variant: 'destructive' })
    } finally {
      setIsRemovingCurriculo(false)
    }
  }

  // Handlers de Laudo Médico
  const handleLaudoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Apenas PDF permitido
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Tipo inválido',
        description: 'O laudo médico deve ser um arquivo PDF.',
        variant: 'destructive',
      })
      e.target.value = ''
      return
    }
    
    const maxBytes = 10 * 1024 * 1024 // 10MB
    if (file.size > maxBytes) {
      toast({
        title: 'Arquivo grande demais',
        description: 'Tamanho máximo permitido: 10MB.',
        variant: 'destructive',
      })
      e.target.value = ''
      return
    }
    
    const token = localStorage.getItem('auth_token')
    if (!token) return
    
    try {
      setIsUploadingLaudo(true)
      const result = await uploadLaudoMedico(token, file)
      setProfileData(prev => prev ? { ...prev, laudoMedicoUrl: result.laudoMedicoUrl } : prev)
      toast({
        title: 'Laudo Médico Enviado ✅',
        description: result.validation?.message || 'Seu laudo foi validado e anexado com sucesso.',
      })
    } catch (error) {
      console.error('Erro upload laudo:', error)
      toast({
        title: 'Erro ao enviar laudo',
        description: error instanceof Error ? error.message : 'Falha ao enviar laudo médico.',
        variant: 'destructive',
      })
    } finally {
      setIsUploadingLaudo(false)
      e.target.value = ''
    }
  }

  const handleLaudoDelete = async () => {
    const token = localStorage.getItem('auth_token')
    if (!token || !profileData?.laudoMedicoUrl) return
    if (!confirm('Remover laudo médico atual?')) return
    
    try {
      setIsRemovingLaudo(true)
      const result = await deleteLaudoMedico(token)
      setProfileData(prev => prev ? { ...prev, laudoMedicoUrl: result.laudoMedicoUrl || undefined } : prev)
      toast({ title: 'Laudo removido', description: 'Você pode enviar outro quando quiser.' })
    } catch (error) {
      console.error('Erro ao remover laudo', error)
      toast({ title: 'Erro', description: error instanceof Error ? error.message : 'Falha ao remover laudo médico.', variant: 'destructive' })
    } finally {
      setIsRemovingLaudo(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-6 sm:pb-8">
      {/* Header do perfil com design premium */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/30 shadow-xl sm:shadow-2xl">
        {/* Background gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Elementos decorativos flutuantes */}
        <div className="absolute -right-20 -top-20 h-40 sm:h-64 w-40 sm:w-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute -left-10 top-1/2 h-32 sm:h-48 w-32 sm:w-48 rounded-full bg-pink-500/20 blur-2xl" />
        <div className="absolute right-1/4 bottom-0 h-24 sm:h-32 w-24 sm:w-32 rounded-full bg-cyan-400/20 blur-xl" />
        
        {/* Ícones decorativos - ocultos em mobile */}
        <div className="absolute top-6 right-8 opacity-20 hidden sm:block">
          <Sparkles className="h-8 w-8 text-white animate-pulse" />
        </div>
        <div className="absolute bottom-8 left-8 opacity-15 hidden sm:block">
          <Star className="h-10 w-10 text-white" />
        </div>
        
        <div className="relative px-4 sm:px-8 py-6 sm:py-10 md:px-12 md:py-14">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8">
            {/* Avatar com efeitos premium */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 opacity-70 blur group-hover:opacity-100 transition-opacity" />
              <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-2xl sm:rounded-3xl ring-4 ring-white/30 overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-2xl transition-all group-hover:scale-[1.02]">
                {profileData?.avatarUrl ? (
                  <img
                    src={profileData.avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-white drop-shadow-lg">
                    {getInitials(profileData?.nome || user?.name)}
                  </span>
                )}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-white" />
                  </div>
                )}
                
                {/* Botão de câmera hover */}
                <label 
                  htmlFor="avatarInputHeader" 
                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" />
                </label>
                <input
                  id="avatarInputHeader"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  disabled={isUploadingAvatar}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              
              {/* Badge de completude animado */}
              <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 bg-white rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shadow-xl border-2 border-white">
                <div className="relative h-10 w-10 sm:h-14 sm:w-14">
                  <svg className="transform -rotate-90 h-10 w-10 sm:h-14 sm:w-14">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - completeness / 100)}`}
                      className={`transition-all duration-700 ${
                        completeness >= 80 ? 'text-emerald-500' : 
                        completeness >= 50 ? 'text-amber-500' : 'text-rose-500'
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xs sm:text-sm font-bold ${
                      completeness >= 80 ? 'text-emerald-600' : 
                      completeness >= 50 ? 'text-amber-600' : 'text-rose-600'
                    }`}>{completeness}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações principais */}
            <div className="flex-1 space-y-4 sm:space-y-5 text-center lg:text-left">
              <div>
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                    {profileData?.nome || user?.name || 'Candidato'}
                  </h1>
                  {completeness === 100 && (
                    <div className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30">
                      <Award className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-300" />
                      <span className="text-xs font-medium text-emerald-200">Perfil Completo</span>
                    </div>
                  )}
                </div>
                <p className="text-white/70 text-sm sm:text-lg flex items-center justify-center lg:justify-start gap-2">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{profileData?.email || user?.email}</span>
                </p>
              </div>

              {/* Tags informativas */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                {profileData?.escolaridade && (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors">
                    <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">{profileData.escolaridade}</span>
                    <span className="xs:hidden">{profileData.escolaridade.split(' ')[0]}</span>
                  </div>
                )}
                {profileData?.telefone && (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                    {profileData.telefone}
                  </div>
                )}
                {profileData?.curriculoUrl && (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-emerald-500/20 backdrop-blur-sm text-emerald-200 text-xs sm:text-sm font-medium border border-emerald-400/30">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Currículo anexado</span>
                    <span className="xs:hidden">CV</span>
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                )}
                {profileData?.laudoMedicoUrl ? (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-rose-500/20 backdrop-blur-sm text-rose-200 text-xs sm:text-sm font-medium border border-rose-400/30">
                    <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Laudo verificado</span>
                    <span className="xs:hidden">Laudo</span>
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-amber-500/20 backdrop-blur-sm text-amber-200 text-xs sm:text-sm font-medium border border-amber-400/30 animate-pulse">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Laudo pendente</span>
                    <span className="xs:hidden">Pendente</span>
                  </div>
                )}
                {disabilities.length > 0 && (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-violet-500/20 backdrop-blur-sm text-violet-200 text-xs sm:text-sm font-medium border border-violet-400/30">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                    {disabilities.length} {disabilities.length === 1 ? 'tipo' : 'tipos'}
                  </div>
                )}
              </div>
              
              {/* Barra de progresso do perfil */}
              <div className="max-w-md mx-auto lg:mx-0">
                <div className="flex justify-between text-xs sm:text-sm text-white/70 mb-2">
                  <span>Completude do perfil</span>
                  <span className="font-medium text-white">{completeness}%</span>
                </div>
                <div className="h-1.5 sm:h-2 rounded-full bg-white/20 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      completeness >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 
                      completeness >= 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                      'bg-gradient-to-r from-rose-400 to-rose-500'
                    }`}
                    style={{ width: `${completeness}%` }}
                  />
                </div>
                {completeness < 100 && (
                  <p className="text-xs text-white/50 mt-2 hidden sm:block">
                    💡 Complete seu perfil para ter mais chances de ser encontrado por empresas
                  </p>
                )}
              </div>
            </div>

            {/* Ações rápidas */}
            <div className="flex flex-row lg:flex-col gap-2 sm:gap-3">
              {profileData?.avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isRemovingAvatar}
                  onClick={handleAvatarDelete}
                  className="text-white/70 hover:text-white hover:bg-white/10 border border-white/20 text-xs sm:text-sm"
                >
                  {isRemovingAvatar ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin sm:mr-2" /> : <Trash className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />}
                  <span className="hidden sm:inline">Remover foto</span>
                </Button>
              )}
              {savedAt && (
                <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-emerald-500/20 backdrop-blur-sm text-emerald-200 px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm font-medium animate-in fade-in border border-emerald-400/30">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Salvo com sucesso!</span><span className="sm:hidden">Salvo!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-72 mt-2" />
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-12 rounded-xl" />
                  <Skeleton className="h-12 rounded-xl" />
                  <Skeleton className="h-12 rounded-xl md:col-span-2" />
                </div>
                <Skeleton className="h-11 w-40 ml-auto rounded-xl" />
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-violet-500/5 to-transparent">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent className="p-6">
                <Skeleton className="h-32 rounded-xl" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500/5 to-transparent">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-28 rounded-xl" />
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Dados Pessoais */}
            <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-background to-background/80">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-primary/5 to-transparent border-b border-border/50 pb-4 sm:pb-6">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
                    <UserIcon className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg sm:text-2xl font-bold">Dados Pessoais</CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1 line-clamp-2 sm:line-clamp-none">
                      Mantenha suas informações atualizadas para receber as melhores oportunidades
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 md:p-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onPersonalDataSubmit)}
                    className="space-y-8"
                    aria-label="Formulário de dados pessoais"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-2 sm:space-y-3">
                            <FormLabel className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                              <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                              Nome Completo
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-border/50 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base"
                                placeholder="Seu nome completo"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem className="space-y-2 sm:space-y-3">
                            <FormLabel className="text-xs sm:text-sm font-semibold flex items-center gap-2 flex-wrap">
                              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                              CPF
                              <span className="text-[10px] sm:text-xs text-muted-foreground font-normal">(não editável)</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled 
                                aria-disabled 
                                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-border/50 bg-muted/30 cursor-not-allowed text-sm sm:text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-2 sm:space-y-3">
                            <FormLabel className="text-xs sm:text-sm font-semibold flex items-center gap-2 flex-wrap">
                              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                              Email
                              <span className="text-[10px] sm:text-xs text-muted-foreground font-normal">(não editável)</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                {...field} 
                                disabled
                                aria-disabled
                                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-border/50 bg-muted/30 cursor-not-allowed text-sm sm:text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem className="space-y-2 sm:space-y-3">
                            <FormLabel className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                              Telefone
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-border/50 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base"
                                placeholder="(XX) XXXXX-XXXX"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dataNascimento"
                        render={({ field }) => (
                          <FormItem className="space-y-2 sm:space-y-3">
                            <FormLabel className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                              Data de Nascimento
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="date"
                                {...field} 
                                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-border/50 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="genero"
                        render={({ field }) => (
                          <FormItem className="space-y-2 sm:space-y-3">
                            <FormLabel className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                              Gênero
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ''}>
                              <FormControl>
                                <SelectTrigger className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-border/50 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base">
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {GENEROS.map((genero) => (
                                  <SelectItem key={genero} value={genero}>
                                    {genero}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="escolaridade"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2 space-y-2 sm:space-y-3">
                            <FormLabel className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                              <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                              Escolaridade
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ''}>
                              <FormControl>
                                <SelectTrigger className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-border/50 bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base">
                                  <SelectValue placeholder="Selecione escolaridade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {EDUCATION_LEVELS.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end pt-4 sm:pt-6 border-t border-border/50">
                      <Button 
                        type="submit" 
                        disabled={isSaving} 
                        aria-busy={isSaving} 
                        size="lg" 
                        className="w-full sm:w-auto sm:min-w-[160px] h-10 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 text-sm sm:text-base"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                            Salvar Dados
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Card Informações de Deficiência */}
            <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-background to-background/80">
              <CardHeader className="bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-transparent border-b border-border/50 pb-4 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0">
                      <Shield className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg sm:text-2xl font-bold">Informações de Deficiência</CardTitle>
                      <CardDescription className="text-sm sm:text-base mt-1 line-clamp-2 sm:line-clamp-none">
                        Suas necessidades de acessibilidade e barreiras identificadas
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsDisabilityEditorOpen(true)}
                    className="w-full sm:w-auto rounded-lg sm:rounded-xl border-violet-500/30 hover:bg-violet-500/10 hover:border-violet-500/50 transition-all"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 md:p-8">
                <DisabilityInfoDisplay disabilities={disabilities} />
              </CardContent>
            </Card>

            {/* Card de Recomendações */}
            <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-background to-background/80">
              <CardHeader className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-b border-border/50 pb-4 sm:pb-6">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 relative flex-shrink-0">
                    <Zap className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg sm:text-2xl font-bold flex flex-wrap items-center gap-2">
                      <span>Recomendações</span>
                      <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        IA
                      </span>
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1 line-clamp-2 sm:line-clamp-none">
                      Vagas compatíveis baseadas no seu perfil
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 md:p-8">
                <MatchedJobs />
              </CardContent>
            </Card>
          </div>

          {/* Coluna secundária */}
          <div className="space-y-6">
            {/* Card Currículo */}
            <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-background to-background/80">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-transparent border-b border-border/50 pb-4 sm:pb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-lg font-bold">Currículo</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">PDF, DOC ou DOCX (máx. 5MB)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                <div className="group relative">
                  <input
                    id="curriculoInput"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    disabled={isUploadingCurriculo}
                    onChange={handleCurriculoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="curriculoInput"
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border-2 border-dashed border-border/50 bg-gradient-to-br from-emerald-500/5 to-transparent px-4 sm:px-6 py-6 sm:py-10 text-center transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 group-hover:shadow-lg"
                  >
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                      <UploadCloud className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        {isUploadingCurriculo ? 'Enviando...' : 'Clique para enviar'}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
                        ou arraste e solte aqui
                      </p>
                    </div>
                  </label>
                </div>
                
                {isUploadingCurriculo && (
                  <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground py-3 px-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                    <span>Processando arquivo...</span>
                  </div>
                )}
                
                {profileData?.curriculoUrl && (
                  <div className="rounded-xl sm:rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-3 sm:p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold truncate" title={profileData.curriculoUrl.split('/').pop()}>
                            {profileData.curriculoUrl.split('/').pop()}
                          </p>
                          <p className="text-[10px] sm:text-xs text-emerald-600 flex items-center gap-1 mt-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="hidden xs:inline">Anexado com sucesso</span>
                            <span className="xs:hidden">Anexado</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(profileData.curriculoUrl, '_blank')}
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl border-emerald-500/30 hover:bg-emerald-500/10"
                        >
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={isRemovingCurriculo}
                          onClick={handleCurriculoDelete}
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                        >
                          {isRemovingCurriculo ? (
                            <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                          ) : (
                            <Trash className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card Laudo Médico PCD */}
            <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-background to-background/80">
              <CardHeader className="bg-gradient-to-r from-rose-500/10 to-transparent border-b border-border/50 pb-4 sm:pb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20 flex-shrink-0">
                    <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-lg font-bold flex flex-wrap items-center gap-2">
                      <span>Laudo Médico</span>
                      <span className="text-[10px] sm:text-xs font-normal px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
                        Obrigatório
                      </span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Apenas PDF (máx. 10MB)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                {/* Alerta informativo */}
                <div className="rounded-lg sm:rounded-xl bg-gradient-to-r from-rose-500/5 to-pink-500/5 p-3 sm:p-4 border border-rose-200 dark:border-rose-800">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-rose-700 dark:text-rose-400">Por que o laudo é importante?</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        O laudo é obrigatório por lei para comprovação da deficiência.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group relative">
                  <input
                    id="laudoInput"
                    type="file"
                    accept=".pdf"
                    disabled={isUploadingLaudo}
                    onChange={handleLaudoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="laudoInput"
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border-2 border-dashed border-border/50 bg-gradient-to-br from-rose-500/5 to-transparent px-4 sm:px-6 py-6 sm:py-10 text-center transition-all hover:border-rose-500/50 hover:bg-rose-500/10 group-hover:shadow-lg"
                  >
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                      <UploadCloud className="h-6 w-6 sm:h-8 sm:w-8 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        {isUploadingLaudo ? 'Validando...' : 'Enviar laudo'}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
                        ou arraste e solte aqui
                      </p>
                    </div>
                  </label>
                </div>
                
                {isUploadingLaudo && (
                  <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground py-3 px-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                    <Loader2 className="h-5 w-5 animate-spin text-rose-600" />
                    <span>Validando PDF e verificando autenticidade...</span>
                  </div>
                )}
                
                {profileData?.laudoMedicoUrl && (
                  <div className="rounded-xl sm:rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-pink-500/5 p-3 sm:p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-md">
                          <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold truncate" title={profileData.laudoMedicoUrl.split('/').pop()}>
                            {profileData.laudoMedicoUrl.split('/').pop()}
                          </p>
                          <p className="text-[10px] sm:text-xs text-rose-600 flex items-center gap-1 mt-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="hidden xs:inline">Laudo verificado</span>
                            <span className="xs:hidden">Verificado</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(profileData.laudoMedicoUrl, '_blank')}
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl border-rose-500/30 hover:bg-rose-500/10"
                        >
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={isRemovingLaudo}
                          onClick={handleLaudoDelete}
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                        >
                          {isRemovingLaudo ? (
                            <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                          ) : (
                            <Trash className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card de Estatísticas */}
            <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-background to-background/80">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent border-b border-border/50 pb-4 sm:pb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-lg font-bold">Seu Perfil</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Estatísticas rápidas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/5 p-3 sm:p-4 border border-indigo-500/20">
                    <div className="text-xl sm:text-3xl font-bold text-indigo-600">{disabilities.length}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Tipos de Deficiência</div>
                  </div>
                  <div className="rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 p-3 sm:p-4 border border-violet-500/20">
                    <div className="text-xl sm:text-3xl font-bold text-violet-600">
                      {disabilities.reduce((acc, d) => acc + d.subtypes.length, 0)}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Subtipos</div>
                  </div>
                  <div className="rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-3 sm:p-4 border border-emerald-500/20">
                    <div className="text-xl sm:text-3xl font-bold text-emerald-600">{completeness}%</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Perfil Completo</div>
                  </div>
                  <div className="rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-3 sm:p-4 border border-amber-500/20">
                    <div className="text-xl sm:text-3xl font-bold text-amber-600">
                      {disabilities.reduce((acc, d) => acc + d.subtypes.reduce((a, s) => a + s.barriers.length, 0), 0)}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Barreiras</div>
                  </div>
                </div>
                
                {completeness < 100 && (
                  <div className="rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 p-3 sm:p-4 border border-amber-500/20">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-400">Dica</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                          Complete seu perfil para aumentar suas chances!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <DisabilityInfoEditor
        isOpen={isDisabilityEditorOpen}
        onOpenChange={setIsDisabilityEditorOpen}
        initialDisabilities={disabilities}
        initialAccessibilities={profileData?.acessibilidades?.map(a => ({
          acessibilidadeId: a.acessibilidadeId,
          prioridade: a.prioridade as 'essencial' | 'importante' | 'desejavel'
        })) || []}
        onSave={handleDisabilitySave}
      />
    </div>
  )
}
