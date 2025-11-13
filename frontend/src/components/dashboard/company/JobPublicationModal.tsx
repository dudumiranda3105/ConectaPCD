import { useEffect } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { ScrollArea } from '@/components/ui/scroll-area'

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

  useEffect(() => {
    if (jobToEdit) {
      form.reset({
        ...jobToEdit,
        accessibilities: Array.isArray(jobToEdit.accessibilities) 
          ? jobToEdit.accessibilities 
          : []
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

  const onSubmit = (data: JobPostingFormValues) => {
    onJobSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {jobToEdit ? 'Editar Vaga' : 'Publicar Nova Vaga'}
          </DialogTitle>
          <DialogDescription>
            {jobToEdit
              ? 'Altere os detalhes da vaga abaixo.'
              : 'Preencha os detalhes abaixo para criar uma nova vaga.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva as responsabilidades e requisitos da vaga."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JOB_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                  <FormItem>
                    <FormLabel>Escolaridade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a escolaridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ESCOLARIDADES.map((esc) => (
                          <SelectItem key={esc} value={esc}>
                            {esc}
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
                name="regime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regime</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o regime" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JOB_REGIMES.map((regime) => (
                          <SelectItem key={regime} value={regime}>
                            {regime}
                          </SelectItem>
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
              name="accessibilities"
              render={() => (
                <FormItem>
                  <FormLabel>Acessibilidades</FormLabel>
                  <FormDescription>
                    Selecione as acessibilidades oferecidas para esta vaga.
                  </FormDescription>
                  <ScrollArea className="h-40 rounded-md border p-4">
                    {ACESSIBILIDADES_OFERECIDAS.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="accessibilities"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-3">
                            <FormControl>
                              <Checkbox
                                checked={Array.isArray(field.value) && field.value.includes(item)}
                                onCheckedChange={(checked) => {
                                  const currentValue = Array.isArray(field.value) ? field.value : []
                                  if (checked) {
                                    field.onChange([...currentValue, item])
                                  } else {
                                    field.onChange(currentValue.filter((value) => value !== item))
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefícios</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Vale Refeição, Plano de Saúde"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {jobToEdit ? 'Salvar Alterações' : 'Publicar Vaga'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
