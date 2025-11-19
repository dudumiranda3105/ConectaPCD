import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  jobPostingSchema,
  JobPostingFormValues,
  JOB_TYPES,
  JOB_REGIMES,
  ESCOLARIDADES,
} from '@/lib/schemas/job-posting-schema'
import { ACESSIBILIDADES_OFERECIDAS } from '@/lib/schemas/company-signup-schema'
import { Button } from '@/components/ui/button'
import { getDisabilityTypes, getSubtypes, DisabilityType, DisabilitySubtype } from '@/services/disabilities'
import { acessibilidadesService, Acessibilidade } from '@/services/acessibilidades'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Gift, 
  HeartHandshake, 
  PlusCircle, 
  Edit3, 
  CheckCircle2, 
  Sparkles,
  Star,
  Heart,
  Zap
} from 'lucide-react'

interface JobPublicationModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onJobSubmit: (data: JobPostingFormValues) => void
  jobToEdit?: JobPostingFormValues | null
}

export const JobPublicationModal = ({
  isOpen,
  onOpenChange,
  onJobSubmit,
  jobToEdit,
}: JobPublicationModalProps) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [acessibilidades, setAcessibilidades] = useState<Acessibilidade[]>([])
  const [disabilityTypes, setDisabilityTypes] = useState<DisabilityType[]>([])
  const [subtypes, setSubtypes] = useState<DisabilitySubtype[]>([])
  const [loadingData, setLoadingData] = useState(true)
  
  const form = useForm<JobPostingFormValues>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      title: jobToEdit?.title || '',
      description: jobToEdit?.description || '',
      accessibilities: Array.isArray(jobToEdit?.accessibilities) ? jobToEdit.accessibilities : [],
      benefits: jobToEdit?.benefits || '',
      type: jobToEdit?.type,
      regime: jobToEdit?.regime,
      escolaridade: jobToEdit?.escolaridade,
    },
  })

  // Buscar dados do backend
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return
      
      setLoadingData(true)
      try {
        const [acessData, typesData, subtypesData] = await Promise.all([
          acessibilidadesService.list(),
          getDisabilityTypes(),
          getSubtypes(),
        ])
        setAcessibilidades(acessData)
        setDisabilityTypes(typesData)
        setSubtypes(subtypesData)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [isOpen])

  useEffect(() => {
    console.log('[JobPublicationModal] jobToEdit recebido:', jobToEdit)
    if (jobToEdit) {
      const accessibilities = Array.isArray(jobToEdit.accessibilities) 
        ? jobToEdit.accessibilities 
        : []
      console.log('[JobPublicationModal] Acessibilidades a serem definidas:', accessibilities)
      
      form.reset({
        ...jobToEdit,
        accessibilities: accessibilities
      })
    } else {
      form.reset({
        title: '',
        description: '',
        accessibilities: [],
        benefits: '',
        type: undefined,
        regime: undefined,
        escolaridade: undefined,
      })
    }
  }, [jobToEdit, form, isOpen])

  const onSubmit = async (data: JobPostingFormValues) => {
    console.log('[JobPublicationModal] onSubmit chamado com dados:', data)
    console.log('[JobPublicationModal] Chamando onJobSubmit...')
    await onJobSubmit(data)
    console.log('[JobPublicationModal] onJobSubmit concluído')
    // Modal será fechado pelo handleJobSubmit do CompanyDashboard
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-hidden flex flex-col p-0 border-0 shadow-2xl bg-white dark:bg-slate-950 rounded-2xl">
        {/* Override close button style */}
        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
            opacity: 0;
          }

          .modal-scroll-area {
            scroll-behavior: smooth;
            overflow-y: auto;
          }

          .modal-scroll-area::-webkit-scrollbar {
            width: 10px;
          }

          .modal-scroll-area::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 5px;
          }

          .modal-scroll-area::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #3b82f6 0%, #6366f1 100%);
            border-radius: 5px;
            transition: all 0.3s ease;
          }

          .modal-scroll-area::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #2563eb 0%, #4f46e5 100%);
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
          }

          .accessibility-scroll {
            scroll-behavior: smooth;
            overflow-y: auto;
          }

          .accessibility-scroll::-webkit-scrollbar {
            width: 8px;
          }

          .accessibility-scroll::-webkit-scrollbar-track {
            background: rgba(16, 185, 129, 0.1);
            border-radius: 4px;
          }

          .accessibility-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #10b981 0%, #14b8a6 100%);
            border-radius: 4px;
          }

          .accessibility-scroll::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #059669 0%, #0d9488 100%);
          }

          [role="dialog"] button[aria-label="Close"] {
            position: absolute !important;
            top: 20px !important;
            right: 20px !important;
            height: 44px !important;
            width: 44px !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 12px !important;
            background-color: rgba(255, 255, 255, 0.25) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.4) !important;
            color: white !important;
            cursor: pointer !important;
            transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
            backdrop-filter: blur(10px) !important;
          }
          
          [role="dialog"] button[aria-label="Close"]:hover {
            background-color: rgba(255, 255, 255, 0.35) !important;
            border-color: rgba(255, 255, 255, 0.6) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
            transform: scale(1.08) rotate(90deg) !important;
          }
          
          [role="dialog"] button[aria-label="Close"]:active {
            background-color: rgba(255, 255, 255, 0.4) !important;
            transform: scale(0.92) !important;
          }
          
          [role="dialog"] button[aria-label="Close"] svg {
            width: 20px !important;
            height: 20px !important;
            stroke-width: 2;
          }
        `}</style>
        {/* DialogTitle e DialogDescription - Hidden but required for accessibility */}
        <DialogTitle className="sr-only">
          {jobToEdit ? 'Editar Vaga' : 'Publicar Nova Vaga'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {jobToEdit
            ? 'Atualize os detalhes da vaga e publique novamente para os candidatos'
            : 'Crie uma vaga atraente e encontre o candidato ideal para sua equipe'}
        </DialogDescription>

        {/* ===== HEADER PREMIUM ===== */}
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-6 py-10 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:linear-gradient(0deg,transparent,white,transparent)]"></div>

          {/* Floating accent elements */}
          <div className="absolute top-8 right-12 h-3 w-3 rounded-full bg-white/40 blur-sm"></div>
          <div className="absolute bottom-16 left-12 h-2 w-2 rounded-full bg-white/30 blur-sm"></div>

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/40 flex-shrink-0 transform hover:scale-110 transition-transform duration-300">
                  {jobToEdit ? (
                    <Edit3 className="h-8 w-8 text-white" />
                  ) : (
                    <PlusCircle className="h-8 w-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                      {jobToEdit ? 'Editar Vaga' : 'Publicar Nova Vaga'}
                    </h2>
                    <Sparkles className="h-6 w-6 text-yellow-200 animate-spin" style={{animationDuration: '3s'}} />
                  </div>
                  <p className="text-blue-100 text-sm mt-2 leading-relaxed font-medium">
                    {jobToEdit
                      ? 'Atualize os detalhes da vaga e publique novamente para os candidatos'
                      : 'Crie uma vaga atraente e encontre o candidato ideal para sua equipe'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CONTENT WITH SCROLL ===== */}
        <div 
          className="flex-1 overflow-y-auto modal-scroll-area"
          style={{ 
            maxHeight: 'calc(95vh - 280px)',
            scrollBehavior: 'smooth'
          }}
        >
          <Form {...form}>
            <form 
              id="job-posting-form" 
              onSubmit={async (e) => {
                console.log('[JobPublicationModal] Form submit event triggered')
                e.preventDefault()
                
                const formValues = form.getValues()
                console.log('[JobPublicationModal] Form values:', formValues)
                console.log('[JobPublicationModal] accessibilities value:', formValues.accessibilities)
                console.log('[JobPublicationModal] accessibilities type:', typeof formValues.accessibilities)
                if (Array.isArray(formValues.accessibilities)) {
                  console.log('[JobPublicationModal] accessibilities items:', formValues.accessibilities.map((a, i) => `[${i}] = ${typeof a === 'string' ? a : JSON.stringify(a)}`))
                }
                console.log('[JobPublicationModal] Form state errors:', form.formState.errors)
                
                const isValid = await form.trigger()
                console.log('[JobPublicationModal] Form is valid?', isValid)
                console.log('[JobPublicationModal] Form errors after trigger:', form.formState.errors)
                
                // Log detalhado de cada erro
                Object.keys(form.formState.errors).forEach(key => {
                  console.log(`[JobPublicationModal] Erro no campo "${key}":`, form.formState.errors[key])
                })
                
                if (isValid) {
                  await onSubmit(formValues)
                } else {
                  console.error('[JobPublicationModal] Validação falhou!')
                }
              }} 
              className="px-6 py-8 space-y-6"
            >
              
              {/* ===== SECTION 1: TÍTULO E DESCRIÇÃO ===== */}
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm shadow-lg">1</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Informações Principais</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-800"></div>
                </div>

                <div className="space-y-4 bg-gradient-to-br from-blue-50/60 to-indigo-50/60 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-blue-200/60 dark:border-blue-800/40 backdrop-blur-sm hover:border-blue-300/80 dark:hover:border-blue-700/60 transition-all duration-300 shadow-sm hover:shadow-md">
                  {/* Título */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-sm">
                          <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Título da Vaga
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Desenvolvedor Frontend Senior"
                            className="h-11 text-base border-2 border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 bg-white dark:bg-slate-900 transition-all duration-200 placeholder:text-slate-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Descrição */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-slate-900 dark:text-white text-sm">Descrição Detalhada</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva responsabilidades, requisitos e o dia a dia..."
                            className="min-h-[140px] resize-none text-base border-2 border-blue-200 dark:border-blue-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 bg-white dark:bg-slate-900 transition-all duration-200 placeholder:text-slate-400"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-slate-600 dark:text-slate-400">
                          <Star className="h-3 w-3 inline mr-1 text-amber-500" />
                          Uma descrição clara aumenta a qualidade das candidaturas recebidas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="bg-slate-200 dark:bg-slate-800" />

              {/* ===== SECTION 2: DETALHES DA POSIÇÃO ===== */}
              <div className="space-y-4 animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-bold text-sm shadow-lg">2</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Detalhes da Posição</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent dark:from-indigo-800"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-6 border border-indigo-200/60 dark:border-indigo-800/40 backdrop-blur-sm hover:border-indigo-300/80 dark:hover:border-indigo-700/60 transition-all duration-300 shadow-sm hover:shadow-md">
                  {/* Tipo */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-sm">
                          <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Tipo
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 border-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 bg-white dark:bg-slate-900 transition-all duration-200">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {JOB_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Escolaridade */}
                  <FormField
                    control={form.control}
                    name="escolaridade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-sm">
                          <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Escolaridade
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 border-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 bg-white dark:bg-slate-900 transition-all duration-200">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ESCOLARIDADES.map((esc) => (
                              <SelectItem key={esc} value={esc}>{esc}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Regime */}
                  <FormField
                    control={form.control}
                    name="regime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-sm">
                          <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Regime
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 border-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 bg-white dark:bg-slate-900 transition-all duration-200">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {JOB_REGIMES.map((regime) => (
                              <SelectItem key={regime} value={regime}>{regime}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="bg-slate-200 dark:bg-slate-800" />

              {/* ===== SECTION 3: BENEFÍCIOS ===== */}
              <div className="space-y-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold text-sm shadow-lg">3</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Benefícios Oferecidos</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent dark:from-amber-800"></div>
                </div>

                <FormField
                  control={form.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem className="bg-gradient-to-br from-amber-50/60 to-orange-50/60 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-6 border border-amber-200/60 dark:border-amber-800/40 backdrop-blur-sm hover:border-amber-300/80 dark:hover:border-amber-700/60 transition-all duration-300 shadow-sm hover:shadow-md">
                      <FormLabel className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-sm">
                        <Gift className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        Benefícios
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Vale Refeição, Plano de Saúde, Home Office, etc..."
                          className="h-11 text-base border-2 border-amber-200 dark:border-amber-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-900/50 bg-white dark:bg-slate-900 mt-2 transition-all duration-200 placeholder:text-slate-400"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        <Zap className="h-3 w-3 inline mr-1 text-amber-500" />
                        Separe por vírgula. Quanto mais benefícios, mais candidatos interessados!
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-slate-200 dark:bg-slate-800" />

              {/* ===== SECTION 4: ACESSIBILIDADES ===== */}
              <div className="space-y-4 pb-2 animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-lg">4</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Acessibilidades Oferecidas</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-emerald-200 to-transparent dark:from-emerald-800"></div>
                </div>

                <FormField
                  control={form.control}
                  name="accessibilities"
                  render={() => (
                    <FormItem className="space-y-3">
                      <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/60 to-green-50/70 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-green-950/40 rounded-2xl p-6 border-2 border-emerald-200/70 dark:border-emerald-800/50 backdrop-blur-sm hover:border-emerald-400/80 dark:hover:border-emerald-600/70 transition-all duration-300 shadow-md hover:shadow-xl">
                        
                        {/* Header com ícone e descrição */}
                        <div className="mb-5">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                              <HeartHandshake className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <FormLabel className="text-base font-bold text-slate-900 dark:text-white mb-1 block">
                                Selecione as Acessibilidades
                              </FormLabel>
                              <FormDescription className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                <Heart className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                <span>Quanto mais acessibilidades, maior o match com candidatos PCD!</span>
                              </FormDescription>
                            </div>
                          </div>
                        </div>

                        {/* Lista de checkboxes com scroll */}
                        <div className="relative rounded-xl border-2 border-emerald-300/70 dark:border-emerald-700/70 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden shadow-inner">
                          <div className="h-48 overflow-y-auto accessibility-scroll p-4" style={{ scrollBehavior: 'smooth' }}>
                            {loadingData ? (
                              <div className="space-y-3">
                                {[1, 2, 3, 4].map((i) => (
                                  <Skeleton key={i} className="h-12 w-full" />
                                ))}
                              </div>
                            ) : acessibilidades.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">Nenhuma acessibilidade disponível.</p>
                                <p className="text-xs mt-1">Entre em contato com o administrador.</p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {acessibilidades.map((item, index) => (
                                  <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="accessibilities"
                                    render={({ field }) => {
                                      const isChecked = Array.isArray(field.value) && field.value.includes(item.descricao)
                                      return (
                                        <FormItem className={`flex flex-row items-center space-x-3 space-y-0 p-3 rounded-lg border-2 transition-all duration-200 ${isChecked ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-600 shadow-sm' : 'bg-white/50 dark:bg-slate-800/50 border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30'}`} style={{ animationDelay: `${index * 0.02}s` }}>
                                          <FormControl>
                                            <Checkbox
                                              checked={isChecked}
                                              onCheckedChange={(checked) => {
                                                const current = Array.isArray(field.value) ? field.value : []
                                                if (checked) {
                                                  field.onChange([...current, item.descricao])
                                                } else {
                                                  field.onChange(current.filter((v) => v !== item.descricao))
                                                }
                                              }}
                                              className="h-5 w-5 border-2 border-emerald-400 dark:border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                            />
                                          </FormControl>
                                          <FormLabel className="flex-1 font-medium cursor-pointer text-sm text-slate-800 dark:text-slate-200 leading-snug">
                                            {item.descricao}
                                          </FormLabel>
                                          {isChecked && (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-in zoom-in duration-200" />
                                          )}
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/90 dark:from-slate-900/90 to-transparent pointer-events-none"></div>
                        </div>

                        {/* Badge de selecionadas */}
                        {form.watch('accessibilities')?.length > 0 && (
                          <div className="mt-5 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                {form.watch('accessibilities').length} {form.watch('accessibilities').length === 1 ? 'Selecionada' : 'Selecionadas'}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => form.setValue('accessibilities', [])}
                                className="h-7 text-xs text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                              >
                                Limpar tudo
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 animate-fade-in">
                              {form.watch('accessibilities').map((acc) => (
                                <Badge
                                  key={acc}
                                  className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/70 dark:to-teal-900/70 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-600 py-1 px-3 flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-default text-sm"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>{acc}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 px-6 py-5 flex gap-3 sm:gap-4 shadow-inner">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 font-semibold"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="job-posting-form"
            onClick={() => console.log('[JobPublicationModal] Botão Publicar clicado!')}
            className="flex-1 h-11 gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold transform hover:scale-[1.02]"
          >
            {jobToEdit ? (
              <>
                <Edit3 className="h-4 w-4" />
                Salvar
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                Publicar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
