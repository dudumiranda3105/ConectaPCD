import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { User } from '@/providers/AuthProvider'
import { MatchScoreCard } from './MatchScoreCard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getOrCalculateMatches, MatchScore } from '@/services/matching'
import { Button } from '@/components/ui/button'
import { RefreshCw, Sparkles, ArrowRight } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

export const MatchedJobs = () => {
  const { user } = useAuth() as { user: User | null }
  const navigate = useNavigate()
  const [matches, setMatches] = useState<MatchScore[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadMatches = async (forceRefresh = false) => {
    if (!user?.id) return

    try {
      setLoading(true)
      const matchScores = await getOrCalculateMatches(user.id)
      
      // Ordena por score total (maior primeiro) e pega os top 3
      const topMatches = matchScores
        .sort((a, b) => b.scoreTotal - a.scoreTotal)
        .slice(0, 3)
      
      setMatches(topMatches)
    } catch (error) {
      console.error('Erro ao carregar matches:', error)
      toast({
        title: 'Erro ao carregar vagas recomendadas',
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

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadMatches(true)
    toast({
      title: 'Recomendações atualizadas',
      description: 'Suas vagas recomendadas foram recalculadas.',
    })
  }

  return (
    <div className="space-y-4">
      {/* Header com gradiente */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Top 3 Vagas para Você</h3>
            <p className="text-xs text-muted-foreground">Baseado no seu perfil e acessibilidades</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="hover:bg-violet-500/10"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Grid de vagas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-80 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl animate-pulse border-2 border-dashed"
            />
          ))
        ) : matches.length > 0 ? (
          matches.map((match) => (
            <MatchScoreCard key={match.id} matchScore={match} />
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-12 rounded-xl border-2 border-dashed border-border/50 bg-gradient-to-br from-background to-muted/30">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Nenhuma vaga recomendada ainda
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Complete seu perfil com suas deficiências e barreiras para receber recomendações personalizadas.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botão para ver todas */}
      {matches.length > 0 && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/dashboard/candidato/vagas-recomendadas')}
            className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border-2 border-indigo-500/20 hover:border-indigo-500/40 hover:from-indigo-500/20 hover:to-violet-500/20"
          >
            Ver Todas as Recomendações
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
