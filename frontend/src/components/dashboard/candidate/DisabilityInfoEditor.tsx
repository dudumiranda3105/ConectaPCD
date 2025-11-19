import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info, Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  getDisabilityTypes,
  getSubtypesForType,
  getBarriers,
  DisabilityType,
  DisabilitySubtype,
  Barrier,
} from '@/services/disabilities'
import { DisabilityInfoValues } from '@/lib/schemas/candidate-signup-schema'
import { ScrollArea } from '@/components/ui/scroll-area'

type Selections = {
  [typeId: number]: {
    subtypes: {
      [subtypeId: number]: {
        barriers: Set<number>
      }
    }
  }
}

interface DisabilityInfoEditorProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialDisabilities: DisabilityInfoValues['disabilities']
  onSave: (data: DisabilityInfoValues['disabilities']) => Promise<void>
}

export const DisabilityInfoEditor = ({
  isOpen,
  onOpenChange,
  initialDisabilities,
  onSave,
}: DisabilityInfoEditorProps) => {
  const [types, setTypes] = useState<DisabilityType[]>([])
  const [subtypes, setSubtypes] = useState<Record<number, DisabilitySubtype[]>>(
    {},
  )
  const [barriers, setBarriers] = useState<Barrier[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selections, setSelections] = useState<Selections>({})

  useEffect(() => {
    if (isOpen) {
      const initialSelections: Selections = {}
      if (initialDisabilities) {
        for (const disability of initialDisabilities) {
          initialSelections[disability.typeId] = { subtypes: {} }
          for (const subtype of disability.subtypes) {
            initialSelections[disability.typeId].subtypes[subtype.subtypeId] = {
              barriers: new Set(subtype.barriers),
            }
          }
        }
      }
      setSelections(initialSelections)

      const fetchData = async () => {
        setLoading(true)
        try {
          const [fetchedTypes, fetchedBarriers] = await Promise.all([
            getDisabilityTypes(),
            getBarriers(),
          ])
          setTypes(fetchedTypes)
          setBarriers(fetchedBarriers)

          if (initialDisabilities && initialDisabilities.length > 0) {
            const selectedTypeIds = initialDisabilities.map((d) => d.typeId)
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
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [isOpen, initialDisabilities])

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

  const handleSaveChanges = async () => {
    const formattedData = Object.entries(selections).map(
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
    
    try {
      setSaving(true)
      await onSave(formattedData)
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Informações de Deficiência</DialogTitle>
          <DialogDescription>
            Atualize suas informações para encontrar as vagas mais compatíveis.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1">
          <div className="space-y-8 p-4">
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <>
                <div>
                  <h3 className="text-base font-semibold mb-2">
                    Selecione os tipos de deficiência
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {types.map((type) => (
                      <div
                        key={type.id}
                        onClick={() =>
                          handleTypeSelect(type.id, !selections[type.id])
                        }
                        className={cn(
                          'p-4 border rounded-lg cursor-pointer transition-all',
                          selections[type.id] &&
                            'border-primary ring-2 ring-primary',
                        )}
                      >
                        <h4 className="font-semibold">{type.nome}</h4>
                      </div>
                    ))}
                  </div>
                </div>

                {Object.keys(selections).length > 0 && <Separator />}

                {Object.keys(selections).map((typeIdStr) => {
                  const typeId = Number(typeIdStr)
                  const type = types.find((t) => t.id === typeId)
                  if (!type) return null

                  return (
                    <div key={typeId} className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Subtipos de {type.nome}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(subtypes[typeId] || []).map((subtype) => (
                          <div
                            key={subtype.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`subtype-${subtype.id}`}
                              checked={
                                !!selections[typeId]?.subtypes[subtype.id]
                              }
                              onCheckedChange={(checked) =>
                                handleSubtypeSelect(
                                  typeId,
                                  subtype.id,
                                  !!checked,
                                )
                              }
                            />
                            <label
                              htmlFor={`subtype-${subtype.id}`}
                              className="font-normal cursor-pointer"
                            >
                              {subtype.nome}
                            </label>
                          </div>
                        ))}
                      </div>

                      {Object.keys(selections[typeId].subtypes).length > 0 && (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>Barreiras Encontradas</AlertTitle>
                          <AlertDescription>
                            Para cada subtipo, indique as barreiras que você
                            enfrenta.
                          </AlertDescription>
                        </Alert>
                      )}

                      {Object.keys(selections[typeId].subtypes).map(
                        (subtypeIdStr) => {
                          const subtypeId = Number(subtypeIdStr)
                          const subtype = subtypes[typeId]?.find(
                            (s) => s.id === subtypeId,
                          )
                          if (!subtype) return null

                          return (
                            <div
                              key={subtypeId}
                              className="p-4 border rounded-lg"
                            >
                              <h4 className="font-semibold mb-2">
                                {subtype.nome}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {barriers.map((barrier) => (
                                  <div
                                    key={barrier.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={`barrier-${barrier.id}-${subtypeId}`}
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
                                    <label
                                      htmlFor={`barrier-${barrier.id}-${subtypeId}`}
                                      className="font-normal cursor-pointer"
                                    >
                                      {barrier.descricao}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        },
                      )}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSaveChanges} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
