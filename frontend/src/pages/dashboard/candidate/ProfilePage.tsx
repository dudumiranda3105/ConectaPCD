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
import { getCandidateProfile, updateCandidateProfile, updateCandidateDisabilities, CandidateProfileData } from '@/services/profile'
import { Loader2 } from 'lucide-react'

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

  const handleDisabilitySave = async (
    newDisabilities: DisabilityInfoValues['disabilities'],
  ) => {
    const token = localStorage.getItem('auth_token')
    if (!token || !profileData?.id) return

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
      })
      
      await updateCandidateDisabilities(token, profileData.id, disabilitiesPayload)
      
      // Recarregar perfil para obter dados atualizados
      const updatedData = await getCandidateProfile(token)
      setProfileData(updatedData)
      
      setIsDisabilityEditorOpen(false)
      toast({
        title: 'Informações de Deficiência Atualizadas!',
        description: 'Suas informações foram salvas com sucesso.',
      })
    } catch (error) {
      console.error('Erro ao salvar deficiências:', error)
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível salvar as informações de deficiência.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meu Perfil</h1>
      
      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Mantenha seus dados atualizados para encontrar as melhores vagas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onPersonalDataSubmit)}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-lg font-medium mb-2">Dados Pessoais</h3>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Dados Pessoais'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>

          <Separator className="my-8" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">
                Informações de Deficiência
              </h3>
              <Button
                variant="outline"
                onClick={() => setIsDisabilityEditorOpen(true)}
              >
                Editar
              </Button>
            </div>
            <Separator />
            <div className="mt-4">
              <DisabilityInfoDisplay
                disabilities={disabilities}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <MatchedJobs />
      </div>
        </>
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
