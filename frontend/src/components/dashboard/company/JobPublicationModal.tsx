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
  Zap,
  FileText,
  Building2,
  Target,
  Rocket,
  X,
  Plus
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
  const [benefitInput, setBenefitInput] = useState('')
  const [benefitTags, setBenefitTags] = useState<string[]>([])
  
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
        console.log('[JobPublicationModal] Acessibilidades carregadas:', acessData)
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
      
      // Carregar benefícios como tags
      if (jobToEdit.benefits) {
        const tags = jobToEdit.benefits.split(',').map(b => b.trim()).filter(b => b.length > 0)
        setBenefitTags(tags)
      } else {
        setBenefitTags([])
      }
      
      form.reset({
        ...jobToEdit,
        accessibilities: accessibilities
      })
    } else {
      setBenefitTags([])
      setBenefitInput('')
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

  // Atualizar o campo benefits do form quando as tags mudam
  useEffect(() => {
    form.setValue('benefits', benefitTags.join(', '))
  }, [benefitTags, form])

  const addBenefitTag = (value: string) => {
    const trimmed = value.trim()
    if (trimmed && !benefitTags.includes(trimmed)) {
      setBenefitTags([...benefitTags, trimmed])
    }
    setBenefitInput('')
  }

  const removeBenefitTag = (tagToRemove: string) => {
    setBenefitTags(benefitTags.filter(tag => tag !== tagToRemove))
  }

  const handleBenefitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addBenefitTag(benefitInput)
    }
  }

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
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
            50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.5); }
          }

          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
            opacity: 0;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-glow {
            animation: glow 2s ease-in-out infinite;
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
          
          .section-card {
            position: relative;
            overflow: hidden;
          }
          
          .section-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .section-card:hover::before {
            opacity: 1;
          }
          
          .gradient-text {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
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
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-6 py-8 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-300 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:linear-gradient(0deg,transparent,white,transparent)]"></div>

          {/* Floating accent elements */}
          <div className="absolute top-6 right-20 h-2 w-2 rounded-full bg-yellow-300/60 animate-float"></div>
          <div className="absolute top-12 right-32 h-3 w-3 rounded-full bg-pink-300/50 animate-float" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-8 left-16 h-2.5 w-2.5 rounded-full bg-cyan-300/50 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-16 left-28 h-2 w-2 rounded-full bg-emerald-300/40 animate-float" style={{animationDelay: '1.5s'}}></div>

          <div className="relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/40 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  {jobToEdit ? (
                    <Edit3 className="h-8 w-8 text-white drop-shadow-lg" />
                  ) : (
                    <Rocket className="h-8 w-8 text-white drop-shadow-lg" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-white drop-shadow-lg tracking-tight">
                    {jobToEdit ? 'Editar Vaga' : 'Publicar Nova Vaga'}
                  </h2>
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                    <Sparkles className="h-4 w-4 text-pink-300 animate-pulse" style={{animationDelay: '0.3s'}} />
                  </div>
                </div>
                <p className="text-blue-100/90 text-sm leading-relaxed max-w-md">
                  {jobToEdit
                    ? 'Atualize os detalhes e publique novamente'
                    : 'Crie uma vaga atraente e encontre o candidato ideal para sua equipe'}
                </p>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-6 flex items-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}></div>
                </div>
              ))}
              <span className="ml-2 text-xs text-white/60 font-medium">4 seções para preencher</span>
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
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25">1</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Informações Principais</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-300/50 via-indigo-200/30 to-transparent dark:from-blue-700/50 dark:via-indigo-800/30"></div>
                </div>

                <div className="section-card space-y-5 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900/50 dark:to-blue-950/30 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50 backdrop-blur-sm hover:border-blue-300/80 dark:hover:border-blue-700/60 transition-all duration-300 shadow-sm hover:shadow-lg" style={{'--accent-start': '#3b82f6', '--accent-end': '#6366f1'} as React.CSSProperties}>
                  {/* Título */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm mb-2">
                          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          Título da Vaga
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Desenvolvedor Frontend Senior"
                            className="h-12 text-base border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 bg-white dark:bg-slate-900 transition-all duration-200 placeholder:text-slate-400 rounded-xl"
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
                        <FormLabel className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-2 block">Descrição Detalhada</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva responsabilidades, requisitos e o dia a dia..."
                            className="min-h-[120px] resize-none text-base border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 bg-white dark:bg-slate-900 transition-all duration-200 placeholder:text-slate-400 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-2">
                          <Star className="h-3.5 w-3.5 text-amber-500" />
                          Uma descrição clara aumenta a qualidade das candidaturas recebidas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

              {/* ===== SECTION 2: DETALHES DA POSIÇÃO ===== */}
              <div className="space-y-4 animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-violet-500/25">2</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Detalhes da Posição</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-violet-300/50 via-purple-200/30 to-transparent dark:from-violet-700/50 dark:via-purple-800/30"></div>
                </div>

                <div className="section-card grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-br from-slate-50 to-violet-50/50 dark:from-slate-900/50 dark:to-violet-950/30 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50 backdrop-blur-sm hover:border-violet-300/80 dark:hover:border-violet-700/60 transition-all duration-300 shadow-sm hover:shadow-lg" style={{'--accent-start': '#8b5cf6', '--accent-end': '#a855f7'} as React.CSSProperties}>
                  {/* Tipo */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm mb-2">
                          <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                            <Briefcase className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                          </div>
                          Tipo
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-500/20 bg-white dark:bg-slate-900 transition-all duration-200 rounded-xl">
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
                        <FormLabel className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm mb-2">
                          <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                            <GraduationCap className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                          </div>
                          Escolaridade
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-500/20 bg-white dark:bg-slate-900 transition-all duration-200 rounded-xl">
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
                        <FormLabel className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm mb-2">
                          <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                            <MapPin className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                          </div>
                          Regime
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:focus:ring-violet-500/20 bg-white dark:bg-slate-900 transition-all duration-200 rounded-xl">
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

              <Separator className="bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

              {/* ===== SECTION 3: BENEFÍCIOS ===== */}
              <div className="space-y-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25">3</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Benefícios Oferecidos</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-amber-300/50 via-orange-200/30 to-transparent dark:from-amber-700/50 dark:via-orange-800/30"></div>
                </div>

                <FormField
                  control={form.control}
                  name="benefits"
                  render={() => (
                    <FormItem className="section-card bg-gradient-to-br from-slate-50 to-amber-50/50 dark:from-slate-900/50 dark:to-amber-950/30 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50 backdrop-blur-sm hover:border-amber-300/80 dark:hover:border-amber-700/60 transition-all duration-300 shadow-sm hover:shadow-lg" style={{'--accent-start': '#f59e0b', '--accent-end': '#ea580c'} as React.CSSProperties}>
                      <FormLabel className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm mb-3">
                        <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                          <Gift className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        Benefícios
                        {benefitTags.length > 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                            {benefitTags.length} adicionado(s)
                          </Badge>
                        )}
                      </FormLabel>
                      
                      {/* Input para adicionar benefícios */}
                      <div className="relative">
                        <Input
                          value={benefitInput}
                          onChange={(e) => setBenefitInput(e.target.value)}
                          onKeyDown={handleBenefitKeyDown}
                          placeholder="Digite um benefício e pressione Enter..."
                          className="h-12 text-base border-2 border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-500/20 bg-white dark:bg-slate-900 transition-all duration-200 placeholder:text-slate-400 rounded-xl pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => addBenefitTag(benefitInput)}
                          disabled={!benefitInput.trim()}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <FormDescription className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-2">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        Pressione Enter ou clique no + para adicionar cada benefício
                      </FormDescription>
                      
                      {/* Tags de benefícios */}
                      {benefitTags.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              Benefícios adicionados:
                            </span>
                            <button
                              type="button"
                              onClick={() => setBenefitTags([])}
                              className="text-xs text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                            >
                              Limpar todos
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {benefitTags.map((tag, index) => (
                              <Badge
                                key={index}
                                className="group bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/60 dark:to-orange-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-600 py-1.5 px-3 flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-default text-sm"
                              >
                                <Gift className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                <span>{tag}</span>
                                <button
                                  type="button"
                                  onClick={() => removeBenefitTag(tag)}
                                  className="ml-1 p-0.5 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors group-hover:text-red-600 dark:group-hover:text-red-400"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

              {/* ===== SECTION 4: ACESSIBILIDADES ===== */}
              <div className="space-y-4 pb-2 animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25">4</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Acessibilidades Oferecidas</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-emerald-300/50 via-teal-200/30 to-transparent dark:from-emerald-700/50 dark:via-teal-800/30"></div>
                </div>

                <FormField
                  control={form.control}
                  name="accessibilities"
                  render={() => (
                    <FormItem className="space-y-3">
                      <div className="section-card bg-gradient-to-br from-slate-50 to-emerald-50/50 dark:from-slate-900/50 dark:to-emerald-950/30 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/50 backdrop-blur-sm hover:border-emerald-300/80 dark:hover:border-emerald-700/60 transition-all duration-300 shadow-sm hover:shadow-lg" style={{'--accent-start': '#10b981', '--accent-end': '#14b8a6'} as React.CSSProperties}>
                        
                        {/* Header com ícone e descrição */}
                        <div className="mb-5">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                              <HeartHandshake className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <FormLabel className="text-base font-bold text-slate-800 dark:text-white mb-1 block">
                                Selecione as Acessibilidades
                              </FormLabel>
                              <FormDescription className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <Heart className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
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
        <div className="border-t border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80 dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-900/80 px-6 py-5 flex gap-4 backdrop-blur-sm">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-12 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 font-semibold rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="job-posting-form"
            onClick={() => console.log('[JobPublicationModal] Botão Publicar clicado!')}
            className="flex-1 h-12 gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 font-semibold transform hover:scale-[1.02] rounded-xl"
          >
            {jobToEdit ? (
              <>
                <Edit3 className="h-4 w-4" />
                Salvar Alterações
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                Publicar Vaga
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
