import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { User } from '@/providers/AuthProvider'
import { SmartMatchCard } from '@/components/dashboard/candidate/SmartMatchCard'
import type { SmartMatchResult } from '@/components/dashboard/candidate/SmartMatchCard'
import { getSmartMatches } from '@/services/smartMatch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { toast } from '@/hooks/use-toast'
import {
  RefreshCw,
  Sparkles,
  Filter,
  SlidersHorizontal,
  Zap,
  TrendingUp,
  Target,
  LayoutGrid,
  LayoutList,
  AlertCircle,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

type SortOption = 'scoreTotal' | 'classificacao' | 'empresa'
type ViewMode = 'grid' | 'list'

export default function SmartMatchPage() {
  const { user } = useAuth() as { user: User | null }
  const [matches, setMatches] = useState<SmartMatchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('scoreTotal')
  const [minScore, setMinScore] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showOnlyCompatible, setShowOnlyCompatible] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Obter candidatoId do user ou do próprio id (fallback)
  const candidatoId = user?.candidatoId || (user?.role === 'candidate' ? Number(user?.id) : null)
  const token = localStorage.getItem('auth_token')

  const loadMatches = useCallback(async (showToast = false) => {
    if (!candidatoId || !token) {
      setLoading(false)
      setError('Não foi possível identificar o candidato. Faça login novamente.')
      return
    }

    try {
      setError(null)
      if (showToast) setRefreshing(true)
      else setLoading(true)

      console.log('[SmartMatchPage] Buscando matches para candidato:', candidatoId)
      const data = await getSmartMatches(candidatoId, token, 50)
      console.log('[SmartMatchPage] Matches recebidos:', data.length)
      setMatches(data)

      if (showToast) {
        toast({
          title: '✅ Matches atualizados',
          description: `${data.length} vagas analisadas com match inteligente`,
        })
      }
    } catch (error) {
      console.error('Erro ao carregar smart matches:', error)
      setError('Erro ao carregar matches. Tente novamente.')
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os matches',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [candidatoId, token])

  useEffect(() => {
    loadMatches()
  }, [loadMatches])

  // Filtrar e ordenar matches
  const filteredMatches = matches
    .filter(m => m.scoreTotal >= minScore)
    .filter(m => !showOnlyCompatible || m.compativel)
    .sort((a, b) => {
      switch (sortBy) {
        case 'scoreTotal':
          return b.scoreTotal - a.scoreTotal
        case 'classificacao':
          const ordem = { perfeito: 5, excelente: 4, bom: 3, razoavel: 2, baixo: 1 }
          return (ordem[b.classificacao] || 0) - (ordem[a.classificacao] || 0)
        case 'empresa':
          const nomeA = a.vaga.empresa?.nome || ''
          const nomeB = b.vaga.empresa?.nome || ''
          return nomeA.localeCompare(nomeB)
        default:
          return b.scoreTotal - a.scoreTotal
      }
    })

  // Estatísticas
  const stats = {
    total: matches.length,
    perfeitos: matches.filter(m => m.classificacao === 'perfeito').length,
    excelentes: matches.filter(m => m.classificacao === 'excelente').length,
    bons: matches.filter(m => m.classificacao === 'bom').length,
    compativeis: matches.filter(m => m.compativel).length,
    mediaScore: matches.length > 0 
      ? Math.round(matches.reduce((acc, m) => acc + m.scoreTotal, 0) / matches.length)
      : 0,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-pulse" />
            <Zap className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
          </div>
          <p className="text-lg font-semibold text-muted-foreground">Analisando vagas com IA...</p>
          <p className="text-sm text-muted-foreground">Calculando compatibilidade personalizada</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ops! Algo deu errado</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => loadMatches()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            Smart Match
          </h1>
          <p className="text-muted-foreground mt-1">
            Análise inteligente de compatibilidade com múltiplos critérios
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <LayoutList className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtros e Ordenação</SheetTitle>
                <SheetDescription>
                  Ajuste os filtros para encontrar as melhores vagas
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                {/* Ordenação */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ordenar por</label>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scoreTotal">Score (maior primeiro)</SelectItem>
                      <SelectItem value="classificacao">Classificação</SelectItem>
                      <SelectItem value="empresa">Empresa (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Score mínimo */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Score mínimo</label>
                    <span className="text-sm font-bold text-indigo-600">{minScore}%</span>
                  </div>
                  <Slider
                    value={[minScore]}
                    onValueChange={([v]) => setMinScore(v)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Apenas compatíveis */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Apenas compatíveis</label>
                  <Button
                    variant={showOnlyCompatible ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowOnlyCompatible(!showOnlyCompatible)}
                  >
                    {showOnlyCompatible ? 'Sim' : 'Não'}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button
            onClick={() => loadMatches(true)}
            disabled={refreshing}
            className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
          >
            {refreshing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Recalcular
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border-indigo-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Vagas Analisadas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.perfeitos}</p>
            <p className="text-xs text-muted-foreground">💙 Perfeitos</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{stats.excelentes}</p>
            <p className="text-xs text-muted-foreground">🌟 Excelentes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.bons}</p>
            <p className="text-xs text-muted-foreground">✅ Bons</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-violet-600">{stats.compativeis}</p>
            <p className="text-xs text-muted-foreground">Compatíveis</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-rose-600">{stats.mediaScore}%</p>
            <p className="text-xs text-muted-foreground">Score Médio</p>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-indigo-500/5 to-violet-500/5 border-indigo-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Como funciona o Smart Match?</h3>
              <p className="text-sm text-muted-foreground">
                Nosso algoritmo analisa <strong>5 critérios</strong>: Acessibilidade (35%), Tipo de Deficiência (25%), 
                Escolaridade (15%), Regime de Trabalho (15%) e Localização (10%). Cada vaga recebe um score 
                de 0-100% indicando o nível de compatibilidade com seu perfil.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <strong>{filteredMatches.length}</strong> de {matches.length} vagas
          {minScore > 0 && ` (score ≥ ${minScore}%)`}
        </p>
        
        {filteredMatches.length > 0 && (
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600">
              Melhor match: {filteredMatches[0]?.scoreTotal}%
            </span>
          </div>
        )}
      </div>

      {/* Match Cards */}
      {filteredMatches.length === 0 ? (
        <Card className="p-12 text-center">
          <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma vaga encontrada</h3>
          <p className="text-muted-foreground mb-4">
            {minScore > 0 
              ? `Nenhuma vaga com score acima de ${minScore}%. Tente diminuir o filtro.`
              : 'Não há vagas disponíveis no momento.'}
          </p>
          {minScore > 0 && (
            <Button variant="outline" onClick={() => setMinScore(0)}>
              Limpar filtros
            </Button>
          )}
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid gap-6 md:grid-cols-2 xl:grid-cols-3' 
          : 'space-y-4'
        }>
          {filteredMatches.map((match) => (
            <SmartMatchCard 
              key={match.vagaId} 
              match={match} 
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      )}
    </div>
  )
}
