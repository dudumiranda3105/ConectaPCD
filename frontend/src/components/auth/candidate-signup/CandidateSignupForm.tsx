import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  User, Hash, Phone, Calendar, Mail, Lock, MapPin, Home, 
  GraduationCap, Briefcase, Link as LinkIcon, FileText, Accessibility,
  Users, Eye, EyeOff, Check, X, Loader2, Heart, CheckCircle2, Shield, Upload, CheckCircle,
  Plus, Building2, Pencil, Trash2, Stethoscope, AlertCircle
} from 'lucide-react'
import {
  candidateSignupSchema,
  CandidateSignupFormValues,
  GENEROS,
  EDUCATION_LEVELS,
  ExperienceValues,
} from '@/lib/schemas/candidate-signup-schema'
import { fetchCepData } from '@/services/cep'
import { fetchEstados, type Estado } from '@/services/ibge'
import { signUpCandidate } from '@/services/candidate'
import { 
  getDisabilityTypes, 
  getSubtypesForType, 
  getBarriers,
  type DisabilityType,
  type DisabilitySubtype,
  type Barrier
} from '@/services/disabilities'
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
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

// Função para formatar CPF
function formatCpf(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, (m, p1, p2, p3, p4) =>
    p4 ? `${p1}.${p2}.${p3}-${p4}` : p3 ? `${p1}.${p2}.${p3}` : p2 ? `${p1}.${p2}` : p1
  )
}

// Função para formatar telefone
function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 10) {
    return digits.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (m, ddd, p1, p2) =>
      ddd ? `(${ddd})${p1 ? ' ' + p1 : ''}${p2 ? '-' + p2 : ''}` : ''
    )
  } else {
    return digits.replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, (m, ddd, p1, p2) =>
      ddd ? `(${ddd})${p1 ? ' ' + p1 : ''}${p2 ? '-' + p2 : ''}` : ''
    )
  }
}

// Componente para formulário de experiência individual
interface ExperienceFormProps {
  onSubmit: (data: ExperienceValues) => void
  onCancel: () => void
  initialData?: ExperienceValues
}

function ExperienceForm({ onSubmit, onCancel, initialData }: ExperienceFormProps) {
  const [formData, setFormData] = useState<ExperienceValues>(
    initialData || {
      empresa: '',
      cargo: '',
      dataInicio: '',
      dataFim: '',
      atualmenteTrabalha: false,
      descricao: '',
    }
  )

  const handleSubmit = () => {
    if (!formData.empresa || !formData.cargo || !formData.dataInicio) {
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Empresa *
          </label>
          <Input
            value={formData.empresa}
            onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
            placeholder="Nome da empresa"
            required
            className="h-11 border-2 focus:border-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Cargo *
          </label>
          <Input
            value={formData.cargo}
            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
            placeholder="Cargo exercido"
            required
            className="h-11 border-2 focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Data de Início *
          </label>
          <Input
            type="month"
            value={formData.dataInicio}
            onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
            required
            className="h-11 border-2 focus:border-emerald-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Data de Término
          </label>
          <Input
            type="month"
            value={formData.dataFim}
            onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
            disabled={formData.atualmenteTrabalha}
            className="h-11 border-2 focus:border-emerald-500 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer">
        <Checkbox
          id="atualmenteTrabalha"
          checked={formData.atualmenteTrabalha}
          onCheckedChange={(checked) => setFormData({ 
            ...formData, 
            atualmenteTrabalha: checked as boolean,
            dataFim: checked ? '' : formData.dataFim
          })}
          className="h-5 w-5 border-2 border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
        />
        <label 
          htmlFor="atualmenteTrabalha" 
          className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 cursor-pointer select-none flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Atualmente trabalho aqui
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Descrição das Atividades (Opcional)
        </label>
        <Textarea
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Descreva suas principais responsabilidades e conquistas nesta posição..."
          className="min-h-[100px] resize-none border-2 focus:border-emerald-500"
          maxLength={500}
        />
        <p className="text-xs text-gray-500">
          {formData.descricao?.length || 0}/500 caracteres
        </p>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-2"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
        >
          {initialData ? 'Salvar Alterações' : 'Adicionar Experiência'}
        </Button>
      </div>
    </div>
  )
}

// Validação de senha
const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center gap-2 text-xs">
    {met ? (
      <Check className="h-3 w-3 text-green-600" />
    ) : (
      <X className="h-3 w-3 text-gray-400" />
    )}
    <span className={met ? 'text-green-600' : 'text-gray-500'}>{text}</span>
  </div>
)

export const CandidateSignupForm = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isFetchingCep, setIsFetchingCep] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [estados, setEstados] = useState<Estado[]>([])
  const [isLoadingEstados, setIsLoadingEstados] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Estados para upload de currículo
  const [curriculoFile, setCurriculoFile] = useState<File | null>(null)
  const [isUploadingCurriculo, setIsUploadingCurriculo] = useState(false)
  
  // Estados para upload de laudo médico PCD
  const [laudoFile, setLaudoFile] = useState<File | null>(null)
  const [isUploadingLaudo, setIsUploadingLaudo] = useState(false)
  const [laudoValidation, setLaudoValidation] = useState<{ valid: boolean; pages?: number; message?: string; error?: string } | null>(null)
  
  // Estados para experiências profissionais
  const [experiences, setExperiences] = useState<ExperienceValues[]>([])
  const [showExperienceForm, setShowExperienceForm] = useState(false)
  const [editingExperience, setEditingExperience] = useState<number | null>(null)
  
  // Estados para deficiências
  const [disabilityTypes, setDisabilityTypes] = useState<DisabilityType[]>([])
  const [selectedTypes, setSelectedTypes] = useState<number[]>([])
  const [subtypesByType, setSubtypesByType] = useState<Record<number, DisabilitySubtype[]>>({})
  const [selectedSubtypes, setSelectedSubtypes] = useState<Record<number, number[]>>({})
  const [barriers, setBarriers] = useState<Barrier[]>([])
  const [selectedBarriers, setSelectedBarriers] = useState<Record<number, number[]>>({})
  const [isLoadingDisabilities, setIsLoadingDisabilities] = useState(true)

  const form = useForm<CandidateSignupFormValues>({
    resolver: zodResolver(candidateSignupSchema),
    defaultValues: {
      disabilities: [],
      assistiveResources: [],
      experiences: [],
    },
  })

  const cepValue = form.watch('cep')
  const passwordValue = form.watch('password') || ''

  // Validações de senha
  const passwordValidations = {
    minLength: passwordValue.length >= 8,
    hasUpperCase: /[A-Z]/.test(passwordValue),
    hasLowerCase: /[a-z]/.test(passwordValue),
    hasNumber: /[0-9]/.test(passwordValue),
    hasSpecial: /[^A-Za-z0-9]/.test(passwordValue),
  }

  // Carregar estados
  useEffect(() => {
    const loadEstados = async () => {
      setIsLoadingEstados(true)
      try {
        const data = await fetchEstados()
        setEstados(data)
      } finally {
        setIsLoadingEstados(false)
      }
    }
    loadEstados()
  }, [])

  // Carregar tipos de deficiência e barreiras
  useEffect(() => {
    const loadDisabilities = async () => {
      setIsLoadingDisabilities(true)
      try {
        const [types, allBarriers] = await Promise.all([
          getDisabilityTypes(),
          getBarriers()
        ])
        setDisabilityTypes(types)
        setBarriers(allBarriers)
      } catch (error) {
        console.error('Erro ao carregar deficiências:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os tipos de deficiência.',
          variant: 'destructive',
        })
      } finally {
        setIsLoadingDisabilities(false)
      }
    }
    loadDisabilities()
  }, [])

  // Carregar subtipos quando um tipo é selecionado
  useEffect(() => {
    const loadSubtypes = async () => {
      for (const typeId of selectedTypes) {
        if (!subtypesByType[typeId]) {
          try {
            const subtypes = await getSubtypesForType(typeId)
            setSubtypesByType(prev => ({ ...prev, [typeId]: subtypes }))
          } catch (error) {
            console.error(`Erro ao carregar subtipos do tipo ${typeId}:`, error)
          }
        }
      }
    }
    loadSubtypes()
  }, [selectedTypes])

  // Auto-completar CEP
  useEffect(() => {
    const handleCepFetch = async () => {
      if (!cepValue || cepValue.length < 8) return

      setIsFetchingCep(true)
      try {
        const cepData = await fetchCepData(cepValue)
        if (cepData) {
          form.setValue('rua', cepData.logradouro || '')
          form.setValue('bairro', cepData.bairro || '')
          form.setValue('cidade', cepData.localidade || '')
          form.setValue('uf', cepData.uf || '')
        }
      } finally {
        setIsFetchingCep(false)
      }
    }

    handleCepFetch()
  }, [cepValue, form])

  // Sincronizar disabilities com o formulário
  useEffect(() => {
    const disabilities = selectedTypes.map(typeId => ({
      typeId,
      subtypes: (selectedSubtypes[typeId] || []).map(subtypeId => ({
        subtypeId,
        barriers: selectedBarriers[subtypeId] || []
      }))
    })).filter(d => d.subtypes.length > 0)

    form.setValue('disabilities', disabilities)
  }, [selectedTypes, selectedSubtypes, selectedBarriers, form])

  // Handlers de experiências profissionais
  const handleAddExperience = (data: ExperienceValues) => {
    const newExperiences = [...experiences, data]
    setExperiences(newExperiences)
    form.setValue('experiences', newExperiences)
    setShowExperienceForm(false)
  }

  const handleEditExperience = (index: number, data: ExperienceValues) => {
    const newExperiences = experiences.map((exp, i) => i === index ? data : exp)
    setExperiences(newExperiences)
    form.setValue('experiences', newExperiences)
    setEditingExperience(null)
    setShowExperienceForm(false)
  }

  const handleDeleteExperience = (index: number) => {
    const newExperiences = experiences.filter((_, i) => i !== index)
    setExperiences(newExperiences)
    form.setValue('experiences', newExperiences)
  }

  const handleToggleExperienceForm = () => {
    setShowExperienceForm(!showExperienceForm)
    setEditingExperience(null)
  }

  const handleStartEdit = (index: number) => {
    setEditingExperience(index)
    setShowExperienceForm(true)
  }

  // Handlers de deficiências
  const handleTypeToggle = (typeId: number) => {
    setSelectedTypes(prev => {
      if (prev.includes(typeId)) {
        // Remove tipo e seus subtipos/barreiras
        const newSelected = prev.filter(id => id !== typeId)
        const newSubtypes = { ...selectedSubtypes }
        delete newSubtypes[typeId]
        setSelectedSubtypes(newSubtypes)
        const newBarriers = { ...selectedBarriers }
        delete newBarriers[typeId]
        setSelectedBarriers(newBarriers)
        return newSelected
      } else {
        return [...prev, typeId]
      }
    })
  }

  const handleSubtypeToggle = (typeId: number, subtypeId: number) => {
    setSelectedSubtypes(prev => {
      const typeSubtypes = prev[typeId] || []
      if (typeSubtypes.includes(subtypeId)) {
        // Remove subtipo e suas barreiras
        const newBarriers = { ...selectedBarriers }
        if (newBarriers[subtypeId]) {
          delete newBarriers[subtypeId]
          setSelectedBarriers(newBarriers)
        }
        return {
          ...prev,
          [typeId]: typeSubtypes.filter(id => id !== subtypeId)
        }
      } else {
        return {
          ...prev,
          [typeId]: [...typeSubtypes, subtypeId]
        }
      }
    })
  }

  const handleBarrierToggle = (subtypeId: number, barrierId: number) => {
    setSelectedBarriers(prev => {
      const subtypeBarriers = prev[subtypeId] || []
      if (subtypeBarriers.includes(barrierId)) {
        return {
          ...prev,
          [subtypeId]: subtypeBarriers.filter(id => id !== barrierId)
        }
      } else {
        return {
          ...prev,
          [subtypeId]: [...subtypeBarriers, barrierId]
        }
      }
    })
  }

  // Handler para upload de currículo
  const handleCurriculoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Formato inválido',
          description: 'Por favor, envie um arquivo PDF ou DOC/DOCX.',
          variant: 'destructive',
        })
        return
      }
      
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O arquivo deve ter no máximo 5MB.',
          variant: 'destructive',
        })
        return
      }
      
      setCurriculoFile(file)
    }
  }

  // Handler para upload de laudo médico PCD
  const handleLaudoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Apenas PDF permitido para laudo
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Formato inválido',
          description: 'O laudo médico deve ser um arquivo PDF.',
          variant: 'destructive',
        })
        return
      }
      
      // Validar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O arquivo deve ter no máximo 10MB.',
          variant: 'destructive',
        })
        return
      }
      
      setLaudoFile(file)
      setLaudoValidation(null) // Reset validation
    }
  }

  const uploadLaudo = async (token: string) => {
    if (!laudoFile) return null

    setIsUploadingLaudo(true)
    try {
      const formData = new FormData()
      formData.append('file', laudoFile)

      const baseUrl = import.meta.env?.VITE_API_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/laudo/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro ao fazer upload do laudo' }))
        throw new Error(errorData.error || errorData.details || 'Erro ao fazer upload do laudo')
      }

      const data = await response.json()
      setLaudoValidation(data.validation)
      return data.laudoMedicoUrl
    } catch (error: any) {
      console.error('Erro ao fazer upload do laudo:', error)
      toast({
        title: 'Erro no upload do laudo',
        description: error.message || 'Não foi possível fazer upload do laudo médico. Você poderá adicioná-lo depois.',
        variant: 'destructive',
      })
      return null
    } finally {
      setIsUploadingLaudo(false)
    }
  }

  const uploadCurriculo = async (token: string) => {
    if (!curriculoFile) return null

    setIsUploadingCurriculo(true)
    try {
      const formData = new FormData()
      formData.append('file', curriculoFile)

      const baseUrl = import.meta.env?.VITE_API_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/curriculo/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro ao fazer upload do currículo')
      }

      const data = await response.json()
      return data.curriculoUrl
    } catch (error) {
      console.error('Erro ao fazer upload do currículo:', error)
      toast({
        title: 'Erro no upload',
        description: 'Não foi possível fazer upload do currículo. Você poderá adicioná-lo depois.',
        variant: 'destructive',
      })
      return null
    } finally {
      setIsUploadingCurriculo(false)
    }
  }

  const onSubmit = async (data: CandidateSignupFormValues) => {
    console.log('🚀 Formulário submetido:', data)
    console.log('📋 Experiências:', experiences)
    setIsSubmitting(true)
    try {
      // Construir array de disabilities no formato esperado
      const disabilities = selectedTypes.map(typeId => ({
        typeId,
        subtypes: (selectedSubtypes[typeId] || []).map(subtypeId => ({
          subtypeId,
          barriers: selectedBarriers[subtypeId] || []
        }))
      })).filter(d => d.subtypes.length > 0) // Apenas tipos com subtipos selecionados

      // Converter array de experiências para JSON string
      const experienciasJson = experiences.length > 0 ? JSON.stringify(experiences) : undefined

      const formDataWithDisabilities = {
        ...data,
        disabilities,
        experiencias: experienciasJson
      }

      console.log('📤 Dados enviados:', formDataWithDisabilities)

      const result = await signUpCandidate(formDataWithDisabilities)
      
      // Se houver arquivo de currículo, fazer upload
      if (curriculoFile && result.user) {
        const token = localStorage.getItem('auth_token')
        if (token) {
          const curriculoUrl = await uploadCurriculo(token)
          if (curriculoUrl) {
            // Atualizar o perfil com a URL do currículo
            const baseUrl = import.meta.env?.VITE_API_URL || 'http://localhost:3000'
            await fetch(`${baseUrl}/profiles/candidate`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ ...data, curriculoUrl }),
            })
          }
        }
      }
      
      // Se houver arquivo de laudo médico, fazer upload
      if (laudoFile && result.user) {
        const token = localStorage.getItem('auth_token')
        if (token) {
          const laudoUrl = await uploadLaudo(token)
          if (laudoUrl) {
            toast({
              title: 'Laudo médico enviado! ✅',
              description: 'Seu laudo foi validado e anexado ao perfil.',
            })
          }
        }
      }

      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Você será redirecionado para o seu painel.',
      })
      form.reset()
      navigate('/dashboard/candidato')
    } catch (error: any) {
      toast({
        title: 'Erro no Cadastro',
        description: error.message || 'Não foi possível completar o cadastro.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-48 sm:h-72 w-48 sm:w-72 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-64 sm:h-96 w-64 sm:w-96 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>
      
      <div className="relative w-full max-w-4xl">
        <Card className="shadow-2xl border-2">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-700 px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 bg-white/20 rounded-xl sm:rounded-2xl backdrop-blur-md flex items-center justify-center shadow-2xl">
                  <User className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2">
                Cadastro de Candidato
              </CardTitle>
              <CardDescription className="text-blue-100 text-sm sm:text-base md:text-lg">
                Complete seu perfil para encontrar as melhores oportunidades
              </CardDescription>
            </div>
          </div>

          <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(
                  onSubmit,
                  (errors) => {
                    console.log('❌ Erros de validação:', errors)
                    toast({
                      title: 'Erro de Validação',
                      description: 'Por favor, verifique os campos obrigatórios.',
                      variant: 'destructive',
                    })
                  }
                )} 
                className="space-y-6 sm:space-y-8"
              >
                {/* Seção 1: Dados Pessoais */}
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Dados Pessoais</h3>
                  </div>
                  <Separator className="mb-4 sm:mb-6" />
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <User className="h-4 w-4 text-blue-600" />
                            Nome Completo
                          </FormLabel>
                          <FormControl>
                            <Input className="h-11 border-2 focus:border-blue-500 transition-all" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Hash className="h-4 w-4 text-blue-600" />
                              CPF
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="000.000.000-00"
                                {...field}
                                onChange={e => field.onChange(formatCpf(e.target.value))}
                                value={field.value || ''}
                                maxLength={14}
                                className="h-11 border-2 focus:border-blue-500 transition-all"
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
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Phone className="h-4 w-4 text-blue-600" />
                              Telefone
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(00) 00000-0000"
                                {...field}
                                onChange={e => field.onChange(formatPhone(e.target.value))}
                                value={field.value || ''}
                                maxLength={15}
                                className="h-11 border-2 focus:border-blue-500 transition-all"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="dataNascimento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              Data de Nascimento
                            </FormLabel>
                            <FormControl>
                              <Input type="date" className="h-11 border-2 focus:border-blue-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="genero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Users className="h-4 w-4 text-blue-600" />
                              Gênero
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-all">
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {GENEROS.map((genero) => (
                                  <SelectItem key={genero} value={genero}>{genero}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <Mail className="h-4 w-4 text-blue-600" />
                            E-mail
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" className="h-11 border-2 focus:border-blue-500 transition-all" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Lock className="h-4 w-4 text-blue-600" />
                              Senha
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPassword ? 'text' : 'password'} 
                                  className="h-11 border-2 focus:border-blue-500 transition-all pr-10" 
                                  {...field} 
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <div className="mt-2 space-y-1">
                              <PasswordRequirement met={passwordValidations.minLength} text="Mínimo 8 caracteres" />
                              <PasswordRequirement met={passwordValidations.hasUpperCase} text="Uma letra maiúscula" />
                              <PasswordRequirement met={passwordValidations.hasLowerCase} text="Uma letra minúscula" />
                              <PasswordRequirement met={passwordValidations.hasNumber} text="Um número" />
                              <PasswordRequirement met={passwordValidations.hasSpecial} text="Um caractere especial" />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Lock className="h-4 w-4 text-blue-600" />
                              Confirmar Senha
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showConfirmPassword ? 'text' : 'password'} 
                                  className="h-11 border-2 focus:border-blue-500 transition-all pr-10" 
                                  {...field} 
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 2: Endereço */}
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Endereço</h3>
                  </div>
                  <Separator className="mb-4 sm:mb-6" />
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem className="w-full md:w-1/3">
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <MapPin className="h-4 w-4 text-violet-600" />
                            CEP
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="00000-000" className="h-11 border-2 focus:border-violet-500 transition-all" {...field} />
                          </FormControl>
                          <FormDescription>
                            {isFetchingCep ? '🔍 Buscando endereço...' : '✨ Auto-completar'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="rua"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Home className="h-4 w-4 text-violet-600" />
                              Rua
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11 border-2 focus:border-violet-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Hash className="h-4 w-4 text-violet-600" />
                              Número
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11 border-2 focus:border-violet-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="complemento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Home className="h-4 w-4 text-violet-600" />
                              Complemento (Opcional)
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11 border-2 focus:border-violet-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bairro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <MapPin className="h-4 w-4 text-violet-600" />
                              Bairro
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11 border-2 focus:border-violet-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="cidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <MapPin className="h-4 w-4 text-violet-600" />
                              Cidade
                            </FormLabel>
                            <FormControl>
                              <Input className="h-11 border-2 focus:border-violet-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="uf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <MapPin className="h-4 w-4 text-violet-600" />
                              Estado
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 border-2 focus:border-violet-500 transition-all">
                                  <SelectValue placeholder={isLoadingEstados ? "Carregando..." : "Selecione"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {estados.map((estado) => (
                                  <SelectItem key={estado.sigla} value={estado.sigla}>
                                    {estado.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 3: Formação */}
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Formação e Experiência</h3>
                  </div>
                  <Separator className="mb-4 sm:mb-6" />
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="educationLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <GraduationCap className="h-4 w-4 text-emerald-600" />
                            Nível de Escolaridade
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 border-2 focus:border-emerald-500 transition-all">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EDUCATION_LEVELS.map((level) => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="course"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <GraduationCap className="h-4 w-4 text-emerald-600" />
                              Curso
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Ciência da Computação" className="h-11 border-2 focus:border-emerald-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="institution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <Briefcase className="h-4 w-4 text-emerald-600" />
                              Instituição
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Universidade Federal" className="h-11 border-2 focus:border-emerald-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Upload de Currículo */}
                    <div className="p-6 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20">
                      <label className="flex flex-col items-center gap-3 cursor-pointer">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                          {curriculoFile ? (
                            <CheckCircle className="h-8 w-8 text-white" />
                          ) : (
                            <Upload className="h-8 w-8 text-white" />
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                            {curriculoFile ? curriculoFile.name : 'Enviar Currículo (Opcional)'}
                          </p>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300">
                            {curriculoFile ? 'Arquivo selecionado' : 'Clique para selecionar ou arraste aqui'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF ou DOC/DOCX - Máximo 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCurriculoChange}
                          className="hidden"
                        />
                        {curriculoFile && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              setCurriculoFile(null)
                            }}
                            className="text-xs text-red-600 hover:text-red-700 underline"
                          >
                            Remover arquivo
                          </button>
                        )}
                      </label>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      <FormField
                        control={form.control}
                        name="curriculoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <FileText className="h-4 w-4 text-emerald-600" />
                              Ou cole o link do seu currículo
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." className="h-11 border-2 focus:border-emerald-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <LinkIcon className="h-4 w-4 text-emerald-600" />
                              LinkedIn (Opcional)
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/..." className="h-11 border-2 focus:border-emerald-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="portfolio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                              <LinkIcon className="h-4 w-4 text-emerald-600" />
                              Portfólio (Opcional)
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." className="h-11 border-2 focus:border-emerald-500 transition-all" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <Briefcase className="h-4 w-4 text-emerald-600" />
                          Experiências Profissionais (Opcional)
                        </FormLabel>
                        <Button
                          type="button"
                          onClick={handleToggleExperienceForm}
                          variant="outline"
                          size="sm"
                          className="gap-2 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 w-full sm:w-auto"
                        >
                          <Plus className="h-4 w-4" />
                          {showExperienceForm ? 'Cancelar' : 'Adicionar Experiência'}
                        </Button>
                      </div>

                      {showExperienceForm && (
                        <div className="p-6 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 space-y-4">
                          <ExperienceForm
                            onSubmit={(data) => {
                              if (editingExperience !== null) {
                                handleEditExperience(editingExperience, data)
                              } else {
                                handleAddExperience(data)
                              }
                            }}
                            onCancel={handleToggleExperienceForm}
                            initialData={editingExperience !== null ? experiences[editingExperience] : undefined}
                          />
                        </div>
                      )}

                      {experiences.length > 0 && (
                        <div className="space-y-3">
                          {experiences.map((exp, index) => (
                            <div
                              key={index}
                              className="p-4 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Building2 className="h-4 w-4 text-emerald-600" />
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{exp.empresa}</h4>
                                  </div>
                                  <p className="text-sm font-medium text-emerald-600 mb-2">{exp.cargo}</p>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {new Date(exp.dataInicio + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                      {' - '}
                                      {exp.atualmenteTrabalha ? 'Atualmente' : (exp.dataFim ? new Date(exp.dataFim + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : 'Não informado')}
                                    </span>
                                  </div>
                                  {exp.descricao && (
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{exp.descricao}</p>
                                  )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStartEdit(index)}
                                    className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteExperience(index)}
                                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Seção 4: Laudo Médico PCD */}
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                      Laudo Médico PCD
                      <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                        Obrigatório para contratação
                      </span>
                    </h3>
                  </div>
                  <Separator className="mb-4 sm:mb-6" />
                  
                  <div className="space-y-6">
                    {/* Alerta informativo */}
                    <div className="p-4 border-2 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border-rose-200 dark:border-rose-800">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-100 mb-1">
                            Por que o laudo médico é importante?
                          </h4>
                          <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300">
                            O laudo médico é <strong>obrigatório por lei</strong> para comprovação da deficiência nas empresas. 
                            Ele será validado automaticamente e ficará armazenado com segurança.
                            Você pode enviá-lo agora ou depois pelo seu perfil.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Upload de Laudo */}
                    <div className="p-6 border-2 border-dashed border-rose-300 dark:border-rose-700 rounded-lg bg-rose-50/50 dark:bg-rose-950/20">
                      <label className="flex flex-col items-center gap-3 cursor-pointer">
                        <div className="h-16 w-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                          {laudoFile ? (
                            <CheckCircle className="h-8 w-8 text-white" />
                          ) : (
                            <Upload className="h-8 w-8 text-white" />
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-rose-900 dark:text-rose-100 mb-1">
                            {laudoFile ? laudoFile.name : 'Enviar Laudo Médico PCD'}
                          </p>
                          <p className="text-xs text-rose-700 dark:text-rose-300">
                            {laudoFile ? 'Arquivo selecionado - clique para trocar' : 'Clique para selecionar ou arraste aqui'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <strong>Apenas PDF</strong> - Máximo 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleLaudoChange}
                          className="hidden"
                        />
                        {laudoFile && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>PDF válido selecionado</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                setLaudoFile(null)
                                setLaudoValidation(null)
                              }}
                              className="text-xs text-red-600 hover:text-red-700 underline"
                            >
                              Remover
                            </button>
                          </div>
                        )}
                      </label>
                    </div>
                    
                    {laudoValidation && (
                      <div className={`p-3 rounded-lg border ${
                        laudoValidation.valid 
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' 
                          : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                      }`}>
                        <div className="flex items-center gap-2">
                          {laudoValidation.valid ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              <span className="text-sm text-emerald-700 dark:text-emerald-300">
                                {laudoValidation.message}
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm text-red-700 dark:text-red-300">
                                {laudoValidation.error}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Seção 5: Informações de Deficiência */}
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Accessibility className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Informações de Acessibilidade</h3>
                  </div>
                  <Separator className="mb-4 sm:mb-6" />
                  
                  <div className="space-y-6">
                    {isLoadingDisabilities ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                        <span className="ml-3 text-muted-foreground">Carregando tipos de deficiência...</span>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 sm:p-4 border-2 rounded-lg bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-rose-500/20 border-purple-200 dark:border-purple-800">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">
                                Informações sobre Acessibilidade
                              </h4>
                              <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">
                                Selecione um ou mais tipos de deficiência, depois escolha os subtipos e barreiras correspondentes. Essas informações nos ajudam a conectar você com vagas mais adequadas.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {disabilityTypes.map((type) => {
                            const isSelected = selectedTypes.includes(type.id)
                            return (
                              <Card 
                                key={type.id} 
                                className={`border-2 transition-all duration-300 ${
                                  isSelected 
                                    ? 'border-purple-400 dark:border-purple-600 shadow-lg shadow-purple-200 dark:shadow-purple-900/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30' 
                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md'
                                }`}
                              >
                                <CardContent className="pt-6">
                                  <div className="flex items-start space-x-4">
                                    <Checkbox
                                      id={`type-${type.id}`}
                                      checked={isSelected}
                                      onCheckedChange={() => handleTypeToggle(type.id)}
                                      className="mt-1 h-5 w-5 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-purple-600 data-[state=checked]:to-pink-600 data-[state=checked]:border-0"
                                    />
                                    <div className="flex-1">
                                      <label
                                        htmlFor={`type-${type.id}`}
                                        className="text-base font-bold cursor-pointer flex items-center gap-2 group"
                                      >
                                        <div className={`p-2 rounded-lg transition-all ${
                                          isSelected 
                                            ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-md' 
                                            : 'bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40'
                                        }`}>
                                          <Accessibility className={`h-5 w-5 ${
                                            isSelected ? 'text-white' : 'text-purple-600 dark:text-purple-400'
                                          }`} />
                                        </div>
                                        <span className={isSelected ? 'text-purple-900 dark:text-purple-100' : 'text-gray-900 dark:text-gray-100'}>
                                          {type.nome}
                                        </span>
                                      </label>
                                      {type.descricao && (
                                        <p className="text-sm text-muted-foreground mt-2 ml-12">
                                          {type.descricao}
                                        </p>
                                      )}

                                      {/* Subtipos */}
                                      {isSelected && subtypesByType[type.id] && (
                                        <div className="mt-6 ml-12 space-y-3">
                                          <div className="flex items-center gap-2 mb-3">
                                            <div className="h-0.5 w-8 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                                            <p className="text-sm font-semibold bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                              Selecione os subtipos:
                                            </p>
                                          </div>
                                          {subtypesByType[type.id].map((subtype) => {
                                          const isSubtypeSelected = (selectedSubtypes[type.id] || []).includes(subtype.id)
                                          return (
                                            <div key={subtype.id} className="space-y-3">
                                              <div className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-all ${
                                                isSubtypeSelected
                                                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-purple-300 dark:border-purple-700'
                                                  : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800'
                                              }`}>
                                                <Checkbox
                                                  id={`subtype-${subtype.id}`}
                                                  checked={isSubtypeSelected}
                                                  onCheckedChange={() => handleSubtypeToggle(type.id, subtype.id)}
                                                  className="mt-0.5 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500 data-[state=checked]:border-0"
                                                />
                                                <label
                                                  htmlFor={`subtype-${subtype.id}`}
                                                  className={`text-sm font-medium cursor-pointer flex-1 ${
                                                    isSubtypeSelected ? 'text-purple-900 dark:text-purple-100' : ''
                                                  }`}
                                                >
                                                  {subtype.nome}
                                                </label>
                                              </div>

                                            {/* Barreiras */}
                                            {isSubtypeSelected && barriers.length > 0 && (
                                              <div className="ml-3 sm:ml-6 p-3 sm:p-4 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border border-pink-200 dark:border-pink-800">
                                                <p className="text-xs font-semibold text-pink-700 dark:text-pink-400 mb-3 flex items-center gap-2">
                                                  <Shield className="h-3 w-3" />
                                                  Barreiras relacionadas (opcional):
                                                </p>
                                                <div className="grid grid-cols-1 gap-2">
                                                  {barriers.map((barrier) => {
                                                    const isBarrierSelected = (selectedBarriers[subtype.id] || []).includes(barrier.id)
                                                    return (
                                                      <div 
                                                        key={barrier.id} 
                                                        className={`flex items-center space-x-2 p-2 rounded transition-all ${
                                                          isBarrierSelected 
                                                            ? 'bg-pink-100 dark:bg-pink-900/40' 
                                                            : 'hover:bg-pink-50 dark:hover:bg-pink-900/20'
                                                        }`}
                                                      >
                                                        <Checkbox
                                                          id={`barrier-${subtype.id}-${barrier.id}`}
                                                          checked={isBarrierSelected}
                                                          onCheckedChange={() => handleBarrierToggle(subtype.id, barrier.id)}
                                                          className="data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-pink-500 data-[state=checked]:to-rose-500 data-[state=checked]:border-0"
                                                        />
                                                        <label
                                                          htmlFor={`barrier-${subtype.id}-${barrier.id}`}
                                                          className="text-xs cursor-pointer flex-1"
                                                        >
                                                          {barrier.descricao}
                                                        </label>
                                                      </div>
                                                    )
                                                  })}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )
                                        })}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                            </Card>
                          )
                        })}

                        {/* Resumo das seleções */}
                        {selectedTypes.length > 0 && (
                          <Card className="border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/40 dark:via-pink-950/40 dark:to-purple-950/40 shadow-lg">
                            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-md">
                                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                </div>
                                <h4 className="text-base sm:text-lg font-bold text-purple-900 dark:text-purple-200">
                                  Resumo das suas seleções
                                </h4>
                              </div>
                              <div className="space-y-3 sm:space-y-4">
                                {selectedTypes.map(typeId => {
                                  const type = disabilityTypes.find(t => t.id === typeId)
                                  const typeSubtypes = selectedSubtypes[typeId] || []
                                  return (
                                    <div key={typeId} className="p-4 rounded-lg bg-white/60 dark:bg-gray-900/40 border border-purple-200 dark:border-purple-800">
                                      <div className="flex items-center gap-2 mb-3">
                                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                        <span className="font-semibold text-purple-900 dark:text-purple-200">{type?.nome}</span>
                                        <Badge variant="secondary" className="ml-auto bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                                          {typeSubtypes.length} {typeSubtypes.length === 1 ? 'subtipo' : 'subtipos'}
                                        </Badge>
                                      </div>
                                      <div className="flex flex-wrap gap-2 ml-4">
                                        {typeSubtypes.map(subtypeId => {
                                          const subtype = subtypesByType[typeId]?.find(s => s.id === subtypeId)
                                          const barrierCount = (selectedBarriers[subtypeId] || []).length
                                          return (
                                            <Badge 
                                              key={subtypeId} 
                                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-sm"
                                            >
                                              {subtype?.nome}
                                              {barrierCount > 0 && (
                                                <span className="ml-1.5 px-1.5 py-0.5 bg-white/30 rounded text-xs">
                                                  {barrierCount}
                                                </span>
                                              )}
                                            </Badge>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </>
                    )}
                  </div>
                </div>

                {/* Botão de Submit */}
                <div className="pt-4 sm:pt-6">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-800 text-white shadow-lg"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />}
                    {isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro'}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Link para login */}
            <div className="mt-6 text-center pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Já tem uma conta?
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all">
                Faça login aqui →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
