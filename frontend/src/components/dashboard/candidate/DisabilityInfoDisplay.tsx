import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Cog, 
  Info, 
  Eye, 
  Ear, 
  Brain, 
  Accessibility, 
  Heart,
  Users,
  AlertTriangle,
  Clock,
  Zap
} from 'lucide-react'
import {
  getDisabilityTypes,
  getSubtypes,
  getBarriers,
  DisabilityType,
  DisabilitySubtype,
  Barrier,
} from '@/services/disabilities'
import { assistiveResourcesService, AssistiveResourceDTO } from '@/services/assistiveResources'
import { DisabilityInfoValues } from '@/lib/schemas/candidate-signup-schema'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface AssistiveResourceData {
  recursoId: number
  usoFrequencia?: string | null
  impactoMobilidade?: string | null
  recurso?: {
    id: number
    nome: string
    descricao?: string | null
  }
}

interface DisabilityInfoDisplayProps {
  disabilities: DisabilityInfoValues['disabilities']
  assistiveResources?: AssistiveResourceData[]
}

// Ícones por nome do tipo de deficiência (fallback)
const getIconForType = (typeName: string) => {
  const name = typeName.toLowerCase()
  if (name.includes('visual')) return Eye
  if (name.includes('auditiva')) return Ear
  if (name.includes('intelectual') || name.includes('mental')) return Brain
  if (name.includes('motora') || name.includes('física')) return Accessibility
  if (name.includes('múltipla')) return Users
  return Heart
}

// Gera estilos dinâmicos baseados na cor do banco de dados
const getDisabilityStyleFromColor = (color: string, typeName: string) => {
  const Icon = getIconForType(typeName)
  
  // Se não tiver cor, usa um fallback baseado no nome
  if (!color) {
    const name = typeName.toLowerCase()
    if (name.includes('visual')) color = '#3b82f6'
    else if (name.includes('auditiva')) color = '#a855f7'
    else if (name.includes('intelectual') || name.includes('mental')) color = '#f59e0b'
    else if (name.includes('motora') || name.includes('física')) color = '#10b981'
    else if (name.includes('múltipla')) color = '#f43f5e'
    else color = '#6366f1'
  }
  
  return {
    icon: Icon,
    color: color,
  }
}

export const DisabilityInfoDisplay = ({
  disabilities,
  assistiveResources = [],
}: DisabilityInfoDisplayProps) => {
  const [typeMap, setTypeMap] = useState<Map<number, DisabilityType>>(new Map())
  const [subtypeMap, setSubtypeMap] = useState<Map<number, string>>(new Map())
  const [barrierMap, setBarrierMap] = useState<Map<number, string>>(new Map())
  const [resourceMap, setResourceMap] = useState<Map<number, AssistiveResourceDTO>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, subtypes, barriers, resources] = await Promise.all([
          getDisabilityTypes(),
          getSubtypes(),
          getBarriers(),
          assistiveResourcesService.list(),
        ])
        // Guarda o objeto completo do tipo (incluindo cor)
        setTypeMap(new Map(types.map((t: DisabilityType) => [t.id, t])))
        setSubtypeMap(
          new Map(subtypes.map((s: DisabilitySubtype) => [s.id, s.nome])),
        )
        setBarrierMap(
          new Map(barriers.map((b: Barrier) => [b.id, b.descricao])),
        )
        setResourceMap(new Map(resources.map((r: AssistiveResourceDTO) => [r.id, r])))
      } catch (error) {
        console.error('Failed to fetch disability data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getFrequencyLabel = (freq?: string | null) => {
    if (!freq) return 'Não informado'
    const labels: Record<string, string> = {
      sempre: 'Sempre',
      frequente: 'Frequente',
      ocasional: 'Ocasional'
    }
    return labels[freq] || freq
  }

  const getFrequencyStyle = (freq?: string | null) => {
    if (freq === 'sempre') return 'bg-green-500/20 text-green-300 border-green-500/30'
    if (freq === 'frequente') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
  }

  const getImpactLabel = (impact?: string | null) => {
    if (!impact) return 'Não informado'
    const labels: Record<string, string> = {
      leve: 'Leve',
      moderado: 'Moderado',
      severo: 'Severo'
    }
    return labels[impact] || impact
  }

  const getImpactStyle = (impact?: string | null) => {
    if (impact === 'severo') return 'bg-red-500/20 text-red-300 border-red-500/30'
    if (impact === 'moderado') return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    )
  }

  if ((!disabilities || disabilities.length === 0) && assistiveResources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Accessibility className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          Nenhuma informação de deficiência cadastrada.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {disabilities.map((disability) => {
        const typeData = typeMap.get(disability.typeId)
        const typeName = typeData?.nome || 'Deficiência'
        const typeColor = typeData?.cor || '#6366f1'
        const style = getDisabilityStyleFromColor(typeColor, typeName)
        const Icon = style.icon

        return (
          <div
            key={disability.typeId}
            className="relative overflow-hidden rounded-2xl backdrop-blur-sm"
            style={{ 
              borderColor: `${style.color}50`,
              borderWidth: '1px',
              backgroundColor: `${style.color}10`
            }}
          >
            {/* Gradient accent bar */}
            <div 
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: `linear-gradient(to right, ${style.color}, ${style.color}cc)` }}
            />
            
            {/* Header */}
            <div className="p-5 pb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: style.color }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 
                  className="text-lg font-bold"
                  style={{ color: style.color }}
                >
                  {typeName}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 pb-5 space-y-4">
              {disability.subtypes.map((subtype, idx) => (
                <div 
                  key={subtype.subtypeId}
                  className={`${idx > 0 ? 'pt-4 border-t border-white/10' : ''}`}
                >
                  <h4 className="font-semibold text-foreground/90 mb-3 flex items-center gap-2">
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: style.color }}
                    />
                    {subtypeMap.get(subtype.subtypeId) || '...'}
                  </h4>
                  
                  {subtype.barriers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {subtype.barriers.map((barrierId) => (
                        <Badge 
                          key={barrierId} 
                          variant="outline"
                          className="text-xs font-medium px-3 py-1 rounded-full border transition-all hover:scale-105"
                          style={{
                            backgroundColor: `${style.color}20`,
                            borderColor: `${style.color}50`,
                            color: style.color
                          }}
                        >
                          <AlertTriangle className="w-3 h-3 mr-1.5 opacity-70" />
                          {barrierMap.get(barrierId) || '...'}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Nenhuma barreira informada
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Recursos Assistivos */}
      {assistiveResources.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm">
          {/* Gradient accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
          
          {/* Header */}
          <div className="p-5 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Cog className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-violet-400">
                  Recursos Assistivos
                </h3>
                <p className="text-xs text-muted-foreground">
                  {assistiveResources.length} {assistiveResources.length === 1 ? 'recurso cadastrado' : 'recursos cadastrados'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TooltipProvider>
                {assistiveResources.map((res) => {
                  const resource = res.recurso || resourceMap.get(res.recursoId)
                  return (
                    <div
                      key={res.recursoId}
                      className="group p-4 rounded-xl bg-background/50 border border-violet-500/20 hover:border-violet-500/40 transition-all hover:shadow-lg hover:shadow-violet-500/10"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/30 transition-colors">
                          <Cog className="w-4 h-4 text-violet-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground truncate">
                              {resource?.nome || 'Recurso desconhecido'}
                            </span>
                            {resource?.descricao && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-violet-400 transition-colors flex-shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p className="text-xs">{resource.descricao}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getFrequencyStyle(res.usoFrequencia)}`}
                            >
                              <Clock className="w-2.5 h-2.5 mr-1" />
                              {getFrequencyLabel(res.usoFrequencia)}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getImpactStyle(res.impactoMobilidade)}`}
                            >
                              <Zap className="w-2.5 h-2.5 mr-1" />
                              {getImpactLabel(res.impactoMobilidade)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </TooltipProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
