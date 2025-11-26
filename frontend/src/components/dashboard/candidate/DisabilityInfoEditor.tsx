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
import { 
  Info, 
  Loader2, 
  CheckCircle2, 
  Eye, 
  Ear, 
  Accessibility, 
  Brain,
  AlertTriangle,
  Sparkles,
  Heart,
  Star
} from 'lucide-react'
import {
  getDisabilityTypes,
  getSubtypesForType,
  getBarriers,
  DisabilityType,
  DisabilitySubtype,
  Barrier,
} from '@/services/disabilities'
import { acessibilidadesService, Acessibilidade } from '@/services/acessibilidades'
import { DisabilityInfoValues } from '@/lib/schemas/candidate-signup-schema'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Selections = {
  [typeId: number]: {
    subtypes: {
      [subtypeId: number]: {
        barriers: Set<number>
      }
    }
  }
}

// Estrutura para acessibilidades do candidato
type AccessibilitySelection = {
  acessibilidadeId: number
  prioridade: 'essencial' | 'importante' | 'desejavel'
}

interface DisabilityInfoEditorProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialDisabilities: DisabilityInfoValues['disabilities']
  initialAccessibilities?: AccessibilitySelection[]
  onSave: (data: DisabilityInfoValues['disabilities'], accessibilities: AccessibilitySelection[]) => Promise<void>
}

export const DisabilityInfoEditor = ({
  isOpen,
  onOpenChange,
  initialDisabilities,
  initialAccessibilities = [],
  onSave,
}: DisabilityInfoEditorProps) => {
  const [types, setTypes] = useState<DisabilityType[]>([])
  const [subtypes, setSubtypes] = useState<Record<number, DisabilitySubtype[]>>(
    {},
  )
  const [barriers, setBarriers] = useState<Barrier[]>([])
  const [acessibilidades, setAcessibilidades] = useState<Acessibilidade[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selections, setSelections] = useState<Selections>({})
  const [accessibilitySelections, setAccessibilitySelections] = useState<Map<number, AccessibilitySelection>>(new Map())

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

      // Inicializar seleções de acessibilidade
      const initialAccessMap = new Map<number, AccessibilitySelection>()
      for (const acc of initialAccessibilities) {
        initialAccessMap.set(acc.acessibilidadeId, acc)
      }
      setAccessibilitySelections(initialAccessMap)

      const fetchData = async () => {
        setLoading(true)
        try {
          const [fetchedTypes, fetchedBarriers, fetchedAcessibilidades] = await Promise.all([
            getDisabilityTypes(),
            getBarriers(),
            acessibilidadesService.list(),
          ])
          setTypes(fetchedTypes)
          setBarriers(fetchedBarriers)
          setAcessibilidades(fetchedAcessibilidades)

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
  }, [isOpen, initialDisabilities, initialAccessibilities])

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

  // Handlers para acessibilidades
  const handleAccessibilityToggle = (acessibilidadeId: number, isSelected: boolean) => {
    const newMap = new Map(accessibilitySelections)
    if (isSelected) {
      newMap.set(acessibilidadeId, { acessibilidadeId, prioridade: 'importante' })
    } else {
      newMap.delete(acessibilidadeId)
    }
    setAccessibilitySelections(newMap)
  }

  const handleAccessibilityPriorityChange = (acessibilidadeId: number, prioridade: 'essencial' | 'importante' | 'desejavel') => {
    const newMap = new Map(accessibilitySelections)
    const existing = newMap.get(acessibilidadeId)
    if (existing) {
      newMap.set(acessibilidadeId, { ...existing, prioridade })
      setAccessibilitySelections(newMap)
    }
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

    const formattedAccessibilities = Array.from(accessibilitySelections.values())
    
    try {
      setSaving(true)
      await onSave(formattedData, formattedAccessibilities)
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setSaving(false)
    }
  }

  // Função para obter ícone do tipo de deficiência
  const getTypeIcon = (typeName: string) => {
    const name = typeName.toLowerCase()
    if (name.includes('visual')) return <Eye className="h-5 w-5" />
    if (name.includes('auditiva')) return <Ear className="h-5 w-5" />
    if (name.includes('motora') || name.includes('física')) return <Accessibility className="h-5 w-5" />
    if (name.includes('intelectual') || name.includes('mental')) return <Brain className="h-5 w-5" />
    return <Sparkles className="h-5 w-5" />
  }

  // Função para obter cor do tipo
  const getTypeColor = (typeId: number) => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-purple-500 to-violet-600',
      'from-orange-500 to-amber-600',
      'from-pink-500 to-rose-600',
    ]
    return colors[typeId % colors.length]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Accessibility className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Informações de Acessibilidade
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                Personalize seu perfil para encontrar vagas compatíveis com suas necessidades
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="p-6 space-y-8">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Seleção de Tipos */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      Tipos de Deficiência
                    </h3>
                    {Object.keys(selections).length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {Object.keys(selections).length} selecionado(s)
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {types.map((type) => {
                      const isSelected = !!selections[type.id]
                      return (
                        <div
                          key={type.id}
                          onClick={() => handleTypeSelect(type.id, !isSelected)}
                          className={cn(
                            'group relative p-4 rounded-xl cursor-pointer transition-all duration-300',
                            'border-2 hover:shadow-lg hover:scale-[1.02]',
                            isSelected 
                              ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20' 
                              : 'border-border hover:border-primary/50 bg-card'
                          )}
                        >
                          <div className="flex flex-col items-center text-center gap-3">
                            <div className={cn(
                              'p-3 rounded-xl transition-all duration-300',
                              isSelected 
                                ? `bg-gradient-to-br ${getTypeColor(type.id)} text-white shadow-lg`
                                : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                            )}>
                              {getTypeIcon(type.nome)}
                            </div>
                            <span className={cn(
                              'font-medium text-sm leading-tight',
                              isSelected && 'text-primary'
                            )}>
                              {type.nome}
                            </span>
                          </div>
                          
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5">
                              <div className="bg-primary text-primary-foreground rounded-full p-0.5 shadow-lg">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Subtipos e Barreiras */}
                {Object.keys(selections).map((typeIdStr) => {
                  const typeId = Number(typeIdStr)
                  const type = types.find((t) => t.id === typeId)
                  if (!type) return null

                  const selectedSubtypesCount = Object.keys(selections[typeId].subtypes).length

                  return (
                    <div 
                      key={typeId} 
                      className="space-y-4 p-5 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'p-2 rounded-lg bg-gradient-to-br text-white',
                            getTypeColor(typeId)
                          )}>
                            {getTypeIcon(type.nome)}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold">
                              {type.nome}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Selecione os subtipos aplicáveis
                            </p>
                          </div>
                        </div>
                        {selectedSubtypesCount > 0 && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {selectedSubtypesCount} subtipo(s)
                          </Badge>
                        )}
                      </div>

                      {/* Subtipos */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(subtypes[typeId] || []).map((subtype) => {
                          const isSubtypeSelected = !!selections[typeId]?.subtypes[subtype.id]
                          return (
                            <label
                              key={subtype.id}
                              htmlFor={`subtype-${subtype.id}`}
                              className={cn(
                                'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all',
                                'border hover:bg-background/80',
                                isSubtypeSelected 
                                  ? 'bg-background border-primary/50 shadow-sm' 
                                  : 'bg-background/50 border-transparent'
                              )}
                            >
                              <Checkbox
                                id={`subtype-${subtype.id}`}
                                checked={isSubtypeSelected}
                                onCheckedChange={(checked) =>
                                  handleSubtypeSelect(typeId, subtype.id, !!checked)
                                }
                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                              <span className={cn(
                                'text-sm font-medium',
                                isSubtypeSelected && 'text-primary'
                              )}>
                                {subtype.nome}
                              </span>
                            </label>
                          )
                        })}
                      </div>

                      {/* Barreiras */}
                      {selectedSubtypesCount > 0 && (
                        <div className="mt-4 space-y-4">
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                                Barreiras Encontradas
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Indique as barreiras que você enfrenta no dia a dia
                              </p>
                            </div>
                          </div>

                          {Object.keys(selections[typeId].subtypes).map((subtypeIdStr) => {
                            const subtypeId = Number(subtypeIdStr)
                            const subtype = subtypes[typeId]?.find((s) => s.id === subtypeId)
                            if (!subtype) return null

                            const selectedBarriersCount = selections[typeId].subtypes[subtypeId].barriers.size

                            return (
                              <div
                                key={subtypeId}
                                className="p-4 rounded-xl bg-background border shadow-sm"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    {subtype.nome}
                                  </h4>
                                  {selectedBarriersCount > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      {selectedBarriersCount} barreira(s)
                                    </Badge>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {barriers.map((barrier) => {
                                    const isBarrierSelected = selections[typeId].subtypes[subtypeId].barriers.has(barrier.id)
                                    return (
                                      <label
                                        key={barrier.id}
                                        htmlFor={`barrier-${barrier.id}-${subtypeId}`}
                                        className={cn(
                                          'flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all',
                                          'border hover:bg-muted/50',
                                          isBarrierSelected 
                                            ? 'bg-primary/5 border-primary/30' 
                                            : 'border-border'
                                        )}
                                      >
                                        <Checkbox
                                          id={`barrier-${barrier.id}-${subtypeId}`}
                                          checked={isBarrierSelected}
                                          onCheckedChange={(checked) =>
                                            handleBarrierSelect(typeId, subtypeId, barrier.id, !!checked)
                                          }
                                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                        <span className={cn(
                                          'text-sm',
                                          isBarrierSelected && 'font-medium text-primary'
                                        )}>
                                          {barrier.descricao}
                                        </span>
                                      </label>
                                    )
                                  })}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Seção de Necessidades de Acessibilidade */}
                <div className="space-y-4 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                        <Heart className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">
                          Necessidades de Acessibilidade
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Selecione as acessibilidades que você precisa no ambiente de trabalho
                        </p>
                      </div>
                    </div>
                    {accessibilitySelections.size > 0 && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        {accessibilitySelections.size} selecionada(s)
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {acessibilidades.map((acessibilidade) => {
                      const selection = accessibilitySelections.get(acessibilidade.id)
                      const isSelected = !!selection

                      return (
                        <div
                          key={acessibilidade.id}
                          className={cn(
                            'p-3 rounded-xl border transition-all',
                            isSelected
                              ? 'bg-emerald-500/5 border-emerald-500/30 shadow-sm'
                              : 'bg-background border-border hover:border-emerald-500/30'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id={`accessibility-${acessibilidade.id}`}
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleAccessibilityToggle(acessibilidade.id, !!checked)
                              }
                              className="mt-0.5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                            />
                            <div className="flex-1 min-w-0">
                              <label
                                htmlFor={`accessibility-${acessibilidade.id}`}
                                className={cn(
                                  'text-sm font-medium cursor-pointer block',
                                  isSelected && 'text-emerald-700 dark:text-emerald-400'
                                )}
                              >
                                {acessibilidade.descricao}
                              </label>

                              {isSelected && (
                                <div className="mt-2">
                                  <Select
                                    value={selection?.prioridade || 'importante'}
                                    onValueChange={(value) =>
                                      handleAccessibilityPriorityChange(
                                        acessibilidade.id,
                                        value as 'essencial' | 'importante' | 'desejavel'
                                      )
                                    }
                                  >
                                    <SelectTrigger className="h-8 text-xs bg-background">
                                      <SelectValue placeholder="Prioridade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="essencial">
                                        <span className="flex items-center gap-1.5">
                                          <Star className="h-3 w-3 text-red-500 fill-red-500" />
                                          Essencial
                                        </span>
                                      </SelectItem>
                                      <SelectItem value="importante">
                                        <span className="flex items-center gap-1.5">
                                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                          Importante
                                        </span>
                                      </SelectItem>
                                      <SelectItem value="desejavel">
                                        <span className="flex items-center gap-1.5">
                                          <Star className="h-3 w-3 text-blue-500" />
                                          Desejável
                                        </span>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {acessibilidades.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Nenhuma acessibilidade cadastrada pelo administrador ainda.
                    </div>
                  )}
                </div>

                {/* Empty State */}
                {Object.keys(selections).length === 0 && accessibilitySelections.size === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-4 rounded-full bg-muted mb-4">
                      <Info className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">
                      Nenhum tipo selecionado
                    </h4>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      Selecione os tipos de deficiência acima para configurar seus subtipos e barreiras
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="px-6 py-4 bg-muted/30 border-t gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={saving}
            className="min-w-[100px]"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveChanges} 
            disabled={saving}
            className="min-w-[140px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
