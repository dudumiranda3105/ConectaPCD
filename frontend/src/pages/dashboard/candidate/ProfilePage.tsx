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
import { getCandidateProfile, updateCandidateProfile, updateCandidateDisabilities, uploadCurriculo, deleteCurriculo, uploadAvatar, deleteAvatar, CandidateProfileData } from '@/services/profile'
import { Loader2, FileText, Eye, UploadCloud, Trash, Image as ImageIcon, X, CheckCircle2, User as UserIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'

const profileFormSchema = personalDataSchema.pick({
  name: true,
  cpf: true,
  email: true,
})
type ProfileFormValues = Pick<
  CandidateSignupFormValues,
  'name' | 'cpf' | 'email'
>

export default function ProfilePage() {
  const { user } = useAuth() as { user: User | null }
  const { toast } = useToast()
  const [profileData, setProfileData] = useState<CandidateProfileData | null>(null)
  const [isDisabilityEditorOpen, setIsDisabilityEditorOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingCurriculo, setIsUploadingCurriculo] = useState(false)
  const [isRemovingCurriculo, setIsRemovingCurriculo] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      cpf: '',
      email: '',
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
        form.reset({
          name: data.nome || '',
          cpf: data.cpf || '',
          email: data.email || '',
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
      ['escolaridade', profileData.escolaridade],
      ['curriculoUrl', profileData.curriculoUrl],
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
      
      console.log('[ProfilePage] Salvando deficiências:', {
        candidatoId: profileData.id,
        disabilities: disabilitiesPayload,
        count: disabilitiesPayload.length,
      })
      
      const result = await updateCandidateDisabilities(token, profileData.id, disabilitiesPayload)
      console.log('[ProfilePage] Resultado da atualização:', result)
      
      // Recarregar perfil para obter dados atualizados
      const updatedData = await getCandidateProfile(token)
      console.log('[ProfilePage] Perfil atualizado:', updatedData)
      setProfileData(updatedData)
      
      setIsDisabilityEditorOpen(false)
      toast({
        title: 'Informações Atualizadas! ✅',
        description: `${disabilitiesPayload.length} informação${disabilitiesPayload.length !== 1 ? 'ões' : ''} de deficiência salva${disabilitiesPayload.length !== 1 ? 's' : ''} com sucesso.`,
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

  return (
    <div className="space-y-8">
      {/* Header do perfil aprimorado */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 shadow-xl">
        {/* Elementos decorativos */}
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-violet-500/10 blur-2xl" />
        
        <div className="relative p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar grande e moderno */}
            <div className="relative group">
              <div className="relative h-28 w-28 rounded-2xl ring-4 ring-primary/20 overflow-hidden bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-3xl font-bold shadow-lg transition-all group-hover:scale-105 group-hover:ring-primary/40">
                {profileData?.avatarUrl ? (
                  <img
                    src={profileData.avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover transition-opacity duration-300"
                    loading="lazy"
                  />
                ) : (
                  <span className="bg-gradient-to-br from-primary to-violet-600 bg-clip-text text-transparent">
                    {getInitials(profileData?.nome || user?.name)}
                  </span>
                )}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
              </div>
              
              {/* Indicador de completude sobre o avatar */}
              <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-lg border-2 border-background">
                <div className="relative h-12 w-12">
                  <svg className="transform -rotate-90 h-12 w-12">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-muted/20"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - completeness / 100)}`}
                      className="text-primary transition-all duration-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold">{completeness}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações do perfil */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-violet-600 to-pink-600 bg-clip-text text-transparent">
                  {profileData?.nome || user?.name || 'Candidato'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {profileData?.email || user?.email}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {profileData?.escolaridade && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                    📚 {profileData.escolaridade}
                  </div>
                )}
                {profileData?.telefone && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-700 dark:text-violet-300 text-sm font-medium">
                    📱 {profileData.telefone}
                  </div>
                )}
                {profileData?.curriculoUrl && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                    <FileText className="h-4 w-4" />
                    Currículo anexado
                  </div>
                )}
              </div>
            </div>

            {/* Ações do avatar */}
            <div className="flex flex-col gap-2">
              <div className="group relative">
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  disabled={isUploadingAvatar}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <label
                  htmlFor="avatarInput"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border/50 bg-background/60 backdrop-blur-sm px-4 py-2.5 text-sm font-medium transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md"
                >
                  <UploadCloud className="h-4 w-4 text-primary" />
                  <span>{isUploadingAvatar ? 'Enviando...' : profileData?.avatarUrl ? 'Trocar Foto' : 'Adicionar Foto'}</span>
                </label>
              </div>
              {profileData?.avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isRemovingAvatar}
                  onClick={handleAvatarDelete}
                  className="border border-border/50"
                >
                  {isRemovingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />} Remover
                </Button>
              )}
              {savedAt && (
                <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-4 py-2 text-sm font-medium animate-in fade-in shadow-sm">
                  <CheckCircle2 className="h-4 w-4" /> Salvo!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
              <Skeleton className="h-10 w-40 ml-auto" />
              <Skeleton className="h-32" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-16" />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 via-violet-500/5 to-transparent border-b">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary" />
                  </div>
                  Dados Pessoais
                </CardTitle>
                <CardDescription>
                  Mantenha suas informações atualizadas para receber as melhores oportunidades
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onPersonalDataSubmit)}
                    className="space-y-6"
                    aria-label="Formulário de dados pessoais"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Nome Completo</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="h-11 border-border/50 focus:border-primary transition-colors"
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
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">CPF</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled 
                                aria-disabled 
                                className="h-11 border-border/50 bg-muted/50"
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
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-sm font-semibold">Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                {...field} 
                                className="h-11 border-border/50 focus:border-primary transition-colors"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end pt-4 border-t">
                      <Button type="submit" disabled={isSaving} aria-busy={isSaving} size="lg" className="min-w-[140px]">
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Salvar Dados
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-transparent border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-xl">Informações de Deficiência</CardTitle>
                      <CardDescription className="mt-1">
                        Suas necessidades e barreiras identificadas
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsDisabilityEditorOpen(true)}
                    className="border-violet-500/30 hover:bg-violet-500/10"
                  >
                    ✏️ Editar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <DisabilityInfoDisplay disabilities={disabilities} />
              </CardContent>
            </Card>

            {/* Card de Recomendações */}
            <Card className="border-2 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 border-b">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  Recomendações Inteligentes
                </CardTitle>
                <CardDescription className="text-base">Vagas compatíveis baseadas em IA e seu perfil de acessibilidade</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <MatchedJobs />
              </CardContent>
            </Card>
          </div>

          {/* Coluna secundária */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-emerald-500/5 to-transparent border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  Currículo
                </CardTitle>
                <CardDescription>Envie seu currículo em PDF, DOC ou DOCX</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
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
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/50 bg-background/60 backdrop-blur-sm px-6 py-8 text-center transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 group-hover:shadow-md"
                  >
                    <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-7 w-7 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {isUploadingCurriculo ? 'Enviando arquivo...' : 'Clique para selecionar'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DOC ou DOCX (máx. 5MB)
                      </p>
                    </div>
                  </label>
                </div>
                
                {isUploadingCurriculo && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    Processando arquivo...
                  </div>
                )}
                
                {profileData?.curriculoUrl && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate" title={profileData.curriculoUrl.split('/').pop()}>
                            {profileData.curriculoUrl.split('/').pop()}
                          </p>
                          <p className="text-xs text-muted-foreground">Anexado com sucesso</p>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(profileData.curriculoUrl, '_blank')}
                          className="h-9 w-9 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isRemovingCurriculo}
                          onClick={handleCurriculoDelete}
                          className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                        >
                          {isRemovingCurriculo ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
                        </Button>
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
        onSave={handleDisabilitySave}
      />
    </div>
  )
}
