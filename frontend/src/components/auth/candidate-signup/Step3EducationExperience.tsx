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
  const { formData, updateFormData, nextStep } = useCandidateSignup()

  const form = useForm<EducationExperienceValues>({
    resolver: zodResolver(educationExperienceSchema),
    defaultValues: {
      educationLevel: formData.educationLevel,
      course: formData.course || '',
      institution: formData.institution || '',
      experiences: formData.experiences || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'experiences',
  })

  const onSubmit = (data: EducationExperienceValues) => {
    updateFormData(data)
    nextStep()
  }

  useImperativeHandle(ref, () => ({
    triggerSubmit: async () => {
      const isValid = await form.trigger()
      if (isValid) {
        form.handleSubmit(onSubmit)()
      }
      return isValid
    },
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
                      <SelectTrigger>
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
                    <Input placeholder="Ex: Universidade XYZ" {...field} />
                  </FormControl>
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
                        <Input placeholder="Ex: InovaTech" {...field} />
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
                          <Input type="month" {...field} />
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
                          <Input type="month" {...field} />
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
