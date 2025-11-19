import { forwardRef, useImperativeHandle } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  educationExperienceSchema,
  EducationExperienceValues,
  EDUCATION_LEVELS,
} from '@/lib/schemas/candidate-signup-schema'
import { useCandidateSignup } from '@/providers/CandidateSignupProvider'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { StepFormHandle } from './Step1PersonalData'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const Step3EducationExperience = forwardRef<StepFormHandle>((_, ref) => {
  const { formData, updateFormData } = useCandidateSignup()

  const form = useForm<EducationExperienceValues>({
    resolver: zodResolver(educationExperienceSchema),
    defaultValues: {
      educationLevel: formData.educationLevel,
      course: formData.course || '',
      institution: formData.institution || '',
      curriculoUrl: formData.curriculoUrl || '',
      linkedin: formData.linkedin || '',
      portfolio: formData.portfolio || '',
      biografia: formData.biografia || '',
      experiences: formData.experiences || [],
    },
    mode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'experiences',
  })

  const onSubmit = (data: EducationExperienceValues) => {
    updateFormData(data)
  }

  useImperativeHandle(ref, () => ({
    triggerSubmit: async () => {
      const isValid = await form.trigger()
      if (isValid) {
        form.handleSubmit(onSubmit)()
      }
      return isValid
    },
    isFormValid: () => {
      return form.formState.isValid
    }
  }))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Formação Acadêmica</h3>
          <Separator className="my-2" />
          <div className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="educationLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de Escolaridade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 border-2 rounded-xl">
                        <SelectValue placeholder="Selecione seu nível de escolaridade" />
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
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Análise e Desenvolvimento de Sistemas"
                      {...field}
                      className="h-12 border-2 rounded-xl"
                    />
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
                  <FormLabel>Instituição de Ensino</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Universidade XYZ" {...field} className="h-12 border-2 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="curriculoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link do Currículo (Opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: https://drive.google.com/..." 
                      {...field} 
                      className="h-12 border-2 rounded-xl"
                      type="url"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cole o link do seu currículo (Google Drive, Dropbox, etc.)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn (Opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: https://linkedin.com/in/seu-perfil" 
                      {...field} 
                      className="h-12 border-2 rounded-xl"
                      type="url"
                    />
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
                  <FormLabel>Portfólio (Opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: https://seu-portfolio.com" 
                      {...field} 
                      className="h-12 border-2 rounded-xl"
                      type="url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="biografia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biografia (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Conte um pouco sobre você, suas habilidades e objetivos profissionais..." 
                      {...field} 
                      className="min-h-[100px] border-2 rounded-xl resize-none"
                      maxLength={500}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    {field.value?.length || 0}/500 caracteres
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">Experiência Profissional</h3>
          <Separator className="my-2" />
          <div className="space-y-4 mt-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border rounded-md space-y-4 relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <FormField
                  control={form.control}
                  name={`experiences.${index}.role`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Desenvolvedor Frontend"
                          {...field}
                          className="h-12 border-2 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experiences.${index}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: InovaTech" {...field} className="h-12 border-2 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                          <Input type="month" {...field} className="h-12 border-2 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Término (opcional)</FormLabel>
                        <FormControl>
                          <Input type="month" {...field} className="h-12 border-2 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({ company: '', role: '', startDate: '', endDate: '' })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Experiência
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
})
