import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  disabilityInfoSchema,
  DisabilityInfoValues,
} from '@/lib/schemas/candidate-signup-schema'
import { useCandidateSignup } from '@/providers/CandidateSignupProvider'
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { StepFormHandle } from './Step1PersonalData'
import {
  getDisabilityTypes,
  getSubtypesForType,
  getBarriers,
  DisabilityType,
  DisabilitySubtype,
  Barrier,
} from '@/services/disabilities'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

type Selections = {
  [typeId: number]: {
    subtypes: {
      [subtypeId: number]: {
        barriers: Set<number>
      }
    }
  }
}

export const Step4DisabilityInfo = forwardRef<StepFormHandle>((_, ref) => {
  const { formData, updateFormData } = useCandidateSignup()
  const [types, setTypes] = useState<DisabilityType[]>([])
  const [subtypes, setSubtypes] = useState<Record<number, DisabilitySubtype[]>>(
    {},
  )
  const [barriers, setBarriers] = useState<Barrier[]>([])
  const [loading, setLoading] = useState(true)

  const [selections, setSelections] = useState<Selections>(() => {
    const initialSelections: Selections = {}
    if (formData.disabilities) {
      for (const disability of formData.disabilities) {
        initialSelections[disability.typeId] = { subtypes: {} }
        for (const subtype of disability.subtypes) {
          initialSelections[disability.typeId].subtypes[subtype.subtypeId] = {
            barriers: new Set(subtype.barriers),
          }
        }
      }
    }
    return initialSelections
  })

  const form = useForm<DisabilityInfoValues>({
    resolver: zodResolver(disabilityInfoSchema),
    defaultValues: { disabilities: formData.disabilities || [] },
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [fetchedTypes, fetchedBarriers] = await Promise.all([
          getDisabilityTypes(),
          getBarriers(),
        ])
        setTypes(fetchedTypes)
        setBarriers(fetchedBarriers)

        if (formData.disabilities && formData.disabilities.length > 0) {
          const selectedTypeIds = formData.disabilities.map((d) => d.typeId)
          const subtypePromises = selectedTypeIds.map((id) =>
            getSubtypesForType(id),
          )
          const subtypesResults = await Promise.all(subtypePromises)

          const newSubtypes: Record<number, DisabilitySubtype[]> = {}
          selectedTypeIds.forEach((typeId, index) => {
            newSubtypes[typeId] = subtypesResults[index]
          })
          setSubtypes((prev) => ({ ...prev, ...newSubtypes }))
        }
      } catch (error) {
        console.error('Failed to fetch initial data', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [formData.disabilities])

  const handleTypeSelect = useCallback(
    async (typeId: number, isSelected: boolean) => {
      const newSelections = { ...selections }
      if (isSelected) {
        newSelections[typeId] = { subtypes: {} }
        if (!subtypes[typeId]) {
          const fetchedSubtypes = await getSubtypesForType(typeId)
          setSubtypes((prev) => ({ ...prev, [typeId]: fetchedSubtypes }))
        }
      } else {
        delete newSelections[typeId]
      }
      setSelections(newSelections)
    },
    [selections, subtypes],
  )

  const handleSubtypeSelect = (
    typeId: number,
    subtypeId: number,
    isSelected: boolean,
  ) => {
    const newSelections = { ...selections }
    if (isSelected) {
      newSelections[typeId].subtypes[subtypeId] = { barriers: new Set() }
    } else {
      delete newSelections[typeId].subtypes[subtypeId]
    }
    setSelections(newSelections)
  }

  const handleBarrierSelect = (
    typeId: number,
    subtypeId: number,
    barrierId: number,
    isSelected: boolean,
  ) => {
    const newSelections = { ...selections }
    if (isSelected) {
      newSelections[typeId].subtypes[subtypeId].barriers.add(barrierId)
    } else {
      newSelections[typeId].subtypes[subtypeId].barriers.delete(barrierId)
    }
    setSelections(newSelections)
  }

  const formatSelectionsForSubmit = (): DisabilityInfoValues => {
    const disabilities = Object.entries(selections).map(
      ([typeId, typeData]) => ({
        typeId: Number(typeId),
        subtypes: Object.entries(typeData.subtypes).map(
          ([subtypeId, subtypeData]) => ({
            subtypeId: Number(subtypeId),
            barriers: Array.from(subtypeData.barriers),
          }),
        ),
      }),
    )
    return { disabilities }
  }

  useImperativeHandle(ref, () => ({
    triggerSubmit: async () => {
      const formattedData = formatSelectionsForSubmit()
      form.setValue('disabilities', formattedData.disabilities, {
        shouldDirty: true,
      })
      const isValid = await form.trigger('disabilities')
      if (isValid) {
        updateFormData(formattedData)
      }
      return isValid
    },
  }))

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormItem>
          <FormLabel className="text-base font-semibold">
            Selecione os tipos de deficiência
          </FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {types.map((type) => (
              <div
                key={type.id}
                onClick={() => handleTypeSelect(type.id, !selections[type.id])}
                className={cn(
                  'p-4 border rounded-lg cursor-pointer transition-all duration-200',
                  selections[type.id]
                    ? 'border-primary ring-2 ring-primary'
                    : 'hover:border-primary/50',
                )}
              >
                <h4 className="font-semibold">{type.nome}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
          <FormMessage>
            {form.formState.errors.disabilities?.message}
          </FormMessage>
        </FormItem>

        {Object.keys(selections).length > 0 && <Separator />}

        {Object.keys(selections).map((typeIdStr) => {
          const typeId = Number(typeIdStr)
          const type = types.find((t) => t.id === typeId)
          if (!type) return null

          return (
            <div key={typeId} className="space-y-4">
              <h3 className="text-lg font-semibold">Subtipos de {type.nome}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                {(subtypes[typeId] || []).map((subtype) => (
                  <FormItem
                    key={subtype.id}
                    className="flex items-center space-x-2"
                  >
                    <FormControl>
                      <Checkbox
                        checked={!!selections[typeId]?.subtypes[subtype.id]}
                        onCheckedChange={(checked) =>
                          handleSubtypeSelect(typeId, subtype.id, !!checked)
                        }
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {subtype.nome}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>

              {Object.keys(selections[typeId].subtypes).length > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Barreiras Encontradas</AlertTitle>
                  <AlertDescription>
                    Para cada subtipo selecionado, indique as barreiras que você
                    enfrenta.
                  </AlertDescription>
                </Alert>
              )}

              {Object.keys(selections[typeId].subtypes).map((subtypeIdStr) => {
                const subtypeId = Number(subtypeIdStr)
                const subtype = subtypes[typeId]?.find(
                  (s) => s.id === subtypeId,
                )
                if (!subtype) return null

                return (
                  <div key={subtypeId} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">{subtype.nome}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {barriers.map((barrier) => (
                        <FormItem
                          key={barrier.id}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={selections[typeId].subtypes[
                                subtypeId
                              ].barriers.has(barrier.id)}
                              onCheckedChange={(checked) =>
                                handleBarrierSelect(
                                  typeId,
                                  subtypeId,
                                  barrier.id,
                                  !!checked,
                                )
                              }
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {barrier.descricao}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </form>
    </Form>
  )
})
