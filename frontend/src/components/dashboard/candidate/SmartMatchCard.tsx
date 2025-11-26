import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  Building2,
  MapPin,
  ChevronRight,
  TrendingUp,
  Info
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Tipos
interface ScoreBreakdown {
  categoria: string
  nome: string
  score: number
  peso: number
  contribuicao: number
  detalhes: string
  icon: string
}

interface SmartMatchResult {
  candidatoId: number
  vagaId: number
  scoreTotal: number
  scoreNormalizado: number
  classificacao: 'perfeito' | 'excelente' | 'bom' | 'razoavel' | 'baixo'
  compativel: boolean
  breakdown: ScoreBreakdown[]
  razoes: string[]
  alertas: string[]
  vaga: {
    id: number
    titulo: string
    descricao: string
    escolaridade?: string
    regimeTrabalho?: string
    tipo?: string
    beneficios?: string
    isActive: boolean
    empresa: {
      id: number
      nome: string
      nomeFantasia?: string
      cidade?: string
      estado?: string
    }
  }
}

interface SmartMatchCardProps {
  match: SmartMatchResult
  compact?: boolean
}

// Helpers de cores
const getScoreGradient = (score: number) => {
  if (score >= 95) return 'from-blue-500 to-indigo-600'
  if (score >= 80) return 'from-emerald-500 to-green-600'
  if (score >= 60) return 'from-amber-500 to-orange-500'
  if (score >= 40) return 'from-orange-500 to-red-500'
  return 'from-rose-500 to-red-600'
}

const getScoreTextColor = (score: number) => {
  if (score >= 95) return 'text-blue-600 dark:text-blue-400'
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 60) return 'text-amber-600 dark:text-amber-400'
  if (score >= 40) return 'text-orange-600 dark:text-orange-400'
  return 'text-rose-600 dark:text-rose-400'
}

const getScoreBg = (score: number) => {
  if (score >= 95) return 'bg-blue-500/10 border-blue-500/30'
  if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/30'
  if (score >= 60) return 'bg-amber-500/10 border-amber-500/30'
  if (score >= 40) return 'bg-orange-500/10 border-orange-500/30'
  return 'bg-rose-500/10 border-rose-500/30'
}

const getClassificacaoLabel = (classificacao: string) => {
  const labels: Record<string, { emoji: string; text: string; color: string }> = {
    perfeito: { emoji: '💙', text: 'Match Perfeito', color: 'bg-blue-500' },
    excelente: { emoji: '🌟', text: 'Excelente', color: 'bg-emerald-500' },
    bom: { emoji: '✅', text: 'Bom Match', color: 'bg-amber-500' },
    razoavel: { emoji: '🔶', text: 'Razoável', color: 'bg-orange-500' },
    baixo: { emoji: '⚠️', text: 'Match Baixo', color: 'bg-rose-500' },
  }
  return labels[classificacao] || labels.razoavel
}

// Componente de barra de progresso circular
const CircularProgress = ({ score, size = 120 }: { score: number; size?: number }) => {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'} />
            <stop offset="100%" stopColor={score >= 80 ? '#059669' : score >= 60 ? '#d97706' : '#dc2626'} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${getScoreTextColor(score)}`}>{score}</span>
        <span className="text-xs text-muted-foreground font-medium">MATCH</span>
      </div>
    </div>
  )
}

// Componente de breakdown individual
const BreakdownBar = ({ item }: { item: ScoreBreakdown }) => {
  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500'
    if (score >= 60) return 'bg-amber-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-rose-500'
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">{item.icon}</span>
          <span className="font-medium">{item.nome}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{item.detalhes}</p>
                <p className="text-xs text-muted-foreground">Peso: {item.peso}%</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-bold ${getScoreTextColor(item.score)}`}>{item.score}%</span>
          <span className="text-xs text-muted-foreground">(+{item.contribuicao})</span>
        </div>
      </div>
      <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(item.score)}`}
          style={{ width: `${item.score}%` }}
        />
      </div>
    </div>
  )
}

// Componente principal
export function SmartMatchCard({ match, compact = false }: SmartMatchCardProps) {
  const navigate = useNavigate()
  const { vaga, scoreTotal, classificacao, compativel, breakdown, razoes, alertas } = match
  const label = getClassificacaoLabel(classificacao)

  if (compact) {
    return (
      <Card className={`group hover:shadow-lg transition-all duration-300 border-2 hover:border-indigo-500/50 overflow-hidden ${!compativel && 'opacity-70'}`}>
        <div className={`h-1.5 bg-gradient-to-r ${getScoreGradient(scoreTotal)}`} />
        
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Score Circle */}
            <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${getScoreGradient(scoreTotal)} p-0.5 shadow-lg flex-shrink-0`}>
              <div className="h-full w-full rounded-xl bg-background flex flex-col items-center justify-center">
                <span className={`text-xl font-bold ${getScoreTextColor(scoreTotal)}`}>{scoreTotal}</span>
                <span className="text-[8px] text-muted-foreground">MATCH</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {vaga.titulo}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                <span className="line-clamp-1">{vaga.empresa?.nomeFantasia || vaga.empresa?.nome}</span>
              </div>
              <Badge className={`mt-1.5 ${label.color} text-white text-xs`}>
                {label.emoji} {label.text}
              </Badge>
            </div>

            {/* Action */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/dashboard/candidato/vaga/${vaga.id}`)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-2 hover:border-indigo-500/50 overflow-hidden ${!compativel && 'opacity-70'}`}>
      {/* Top gradient bar */}
      <div className={`h-2 bg-gradient-to-r ${getScoreGradient(scoreTotal)}`} />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {vaga.titulo}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                <span className="line-clamp-1">{vaga.empresa?.nomeFantasia || vaga.empresa?.nome}</span>
              </div>
              {(vaga.empresa?.cidade || vaga.empresa?.estado) && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {vaga.empresa?.cidade}{vaga.empresa?.estado ? `, ${vaga.empresa.estado}` : ''}
                  </span>
                </div>
              )}
            </div>
            
            {/* Classification Badge */}
            <div className="flex items-center gap-2 mt-3">
              <Badge className={`${label.color} text-white border-0 shadow-md`}>
                {label.emoji} {label.text}
              </Badge>
              {compativel ? (
                <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Compatível
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400">
                  <XCircle className="h-3 w-3 mr-1" />
                  Incompatível
                </Badge>
              )}
            </div>
          </div>

          {/* Circular Score */}
          <div className="flex-shrink-0">
            <CircularProgress score={scoreTotal} size={100} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Score Breakdown */}
        <div className="space-y-3 p-4 rounded-xl bg-muted/30 border">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            <span className="font-semibold text-sm">Análise de Compatibilidade</span>
          </div>
          
          {breakdown.map((item, idx) => (
            <BreakdownBar key={idx} item={item} />
          ))}
        </div>

        {/* Razões - Por que essa vaga combina */}
        {razoes.length > 0 && (
          <div className={`p-4 rounded-xl border ${getScoreBg(scoreTotal)}`}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span className="font-semibold text-sm">Por que essa vaga combina com você</span>
            </div>
            <ul className="space-y-2">
              {razoes.slice(0, 4).map((razao, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{razao}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Alertas */}
        {alertas.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-sm text-amber-700 dark:text-amber-400">Pontos de Atenção</span>
            </div>
            <ul className="space-y-2">
              {alertas.slice(0, 3).map((alerta, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400">
                  <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{alerta}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <Button
          className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg"
          size="lg"
          onClick={() => navigate(`/dashboard/candidato/vaga/${vaga.id}`)}
        >
          Ver Detalhes da Vaga
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}

export type { SmartMatchResult, ScoreBreakdown }
