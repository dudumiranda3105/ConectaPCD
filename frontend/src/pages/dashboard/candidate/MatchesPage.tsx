import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { User } from '@/providers/AuthProvider'
import { MatchScoreCard } from '@/components/dashboard/candidate/MatchScoreCard'
import { getOrCalculateMatches, calculateMatches, MatchScore } from '@/services/matching'
import { Button } from '@/components/ui/button'
import { RefreshCw, Filter, ArrowUpDown } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'

type SortOption = 'scoreTotal' | 'scoreSubtipos' | 'scoreAcessibilidades'
type FilterOption = 'all' | 'excellent' | 'good' | 'fair'

export default function MatchesPage() {
  const { user } = useAuth() as { user: User | null }
  const [matches, setMatches] = useState<MatchScore[]>([])
  const [filteredMatches, setFilteredMatches] = useState<MatchScore[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('scoreTotal')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [minScore, setMinScore] = useState<number>(0)

  const loadMatches = async (forceRefresh = false) => {
    if (!user?.id) return

    try {
      setLoading(true)
      let matchScores: MatchScore[]
      
      if (forceRefresh) {
        matchScores = await calculateMatches(user.id)
      } else {
        matchScores = await getOrCalculateMatches(user.id)
      }
      
      console.log('Match scores recebidos:', matchScores)
      setMatches(matchScores)
      applyFiltersAndSort(matchScores, sortBy, filterBy, minScore)
    } catch (error) {
      console.error('Erro ao carregar matches:', error)
      toast({
        title: 'Erro ao carregar recomendações',
        description: 'Não foi possível carregar suas recomendações. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadMatches()
  }, [user?.id])

  useEffect(() => {
    applyFiltersAndSort(matches, sortBy, filterBy, minScore)
  }, [sortBy, filterBy, minScore, matches])

  const applyFiltersAndSort = (
    data: MatchScore[],
    sort: SortOption,
    filter: FilterOption,
    minScoreValue: number
  ) => {
    let filtered = [...data]

    // Aplica filtro de categoria
    if (filter !== 'all') {
      filtered = filtered.filter((match) => {
        if (filter === 'excellent') return match.scoreTotal >= 80
        if (filter === 'good') return match.scoreTotal >= 60 && match.scoreTotal < 80
        if (filter === 'fair') return match.scoreTotal >= 50 && match.scoreTotal < 60
        return true
      })
    }

    // Aplica filtro de score mínimo
    filtered = filtered.filter((match) => match.scoreTotal >= minScoreValue)

    // Ordena
    filtered.sort((a, b) => b[sort] - a[sort])

    setFilteredMatches(filtered)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadMatches(true)
    toast({
      title: 'Recomendações atualizadas',
      description: 'Suas vagas foram recalculadas com base no seu perfil atual.',
    })
  }

  const getFilterLabel = (filter: FilterOption): string => {
    switch (filter) {
      case 'excellent':
        return 'Excelente (80%+)'
      case 'good':
        return 'Bom (60-79%)'
      case 'fair':
        return 'Razoável (50-59%)'
      default:
        return 'Todas'
    }
  }

  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case 'scoreTotal':
        return 'Score Total'
      case 'scoreSubtipos':
        return 'Compatibilidade de Subtipos'
      case 'scoreAcessibilidades':
        return 'Cobertura de Acessibilidades'
      default:
        return 'Score Total'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com gradiente */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 p-8 shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Filter className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Vagas Recomendadas</h1>
            </div>
            <p className="text-white/90 text-lg">
              {filteredMatches.length} {filteredMatches.length === 1 ? 'vaga encontrada' : 'vagas encontradas'} • Algoritmo IA
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            size="lg"
            className="bg-white text-violet-600 hover:bg-white/90 shadow-lg"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Recalcular Matches
          </Button>
        </div>
      </div>

      <Card className="border-2 shadow-lg bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <span>Filtros e Ordenação</span>
          </CardTitle>
          <CardDescription>
            Personalize a visualização das vagas recomendadas por compatibilidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <ArrowUpDown className="h-3 w-3 text-white" />
                </div>
                Ordenar por
              </label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="h-11 border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scoreTotal">🎯 Score Total</SelectItem>
                  <SelectItem value="scoreSubtipos">👥 Compatibilidade de Subtipos</SelectItem>
                  <SelectItem value="scoreAcessibilidades">♿ Cobertura de Acessibilidades</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Filter className="h-3 w-3 text-white" />
                </div>
                Filtrar por categoria
              </label>
              <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
                <SelectTrigger className="h-11 border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">📋 Todas</SelectItem>
                  <SelectItem value="excellent">⭐ Excelente (80%+)</SelectItem>
                  <SelectItem value="good">✅ Bom (60-79%)</SelectItem>
                  <SelectItem value="fair">🔶 Razoável (50-59%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-violet-500/20">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                  %
                </div>
                Score mínimo
              </label>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {minScore}%
              </span>
            </div>
            <Slider
              value={[minScore]}
              onValueChange={(value) => setMinScore(value[0])}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-96 bg-secondary rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <MatchScoreCard key={match.id} matchScore={match} />
          ))}
        </div>
      ) : (
        <Card className="border-2">
          <CardContent className="text-center py-16">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
              <Filter className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Nenhuma vaga encontrada
            </h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              {matches.length === 0
                ? 'Complete seu perfil com suas deficiências para receber recomendações personalizadas.'
                : 'Tente ajustar os filtros para ver mais resultados.'}
            </p>
            {matches.length === 0 && (
              <Button className="mt-6 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white" size="lg" onClick={() => window.location.href = '/candidate/profile'}>
                Completar Perfil
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
