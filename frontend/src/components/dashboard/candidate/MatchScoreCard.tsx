import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Sparkles, Building2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { MatchScore } from '@/services/matching'

interface MatchScoreCardProps {
  matchScore: MatchScore
}

export function MatchScoreCard({ matchScore }: MatchScoreCardProps) {
  const navigate = useNavigate()
  
  const { vaga, scoreTotal, scoreAcessibilidades, scoreSubtipos, compativel, detalhes } = matchScore
  
  if (!vaga) {
    return null // Proteção caso vaga seja undefined
  }
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-600'
    if (score >= 60) return 'from-amber-500 to-orange-600'
    return 'from-rose-500 to-red-600'
  }

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 60) return 'text-amber-600 dark:text-amber-400'
    return 'text-rose-600 dark:text-rose-400'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { emoji: '⭐', text: 'Excelente Match!' }
    if (score >= 60) return { emoji: '✅', text: 'Bom Match' }
    return { emoji: '🔶', text: 'Match Razoável' }
  }

  const scoreBadge = getScoreBadge(scoreTotal)

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-2 hover:border-violet-500/50 overflow-hidden ${!compativel && 'opacity-60'}`}>
      {/* Score Badge no topo */}
      <div className={`h-2 bg-gradient-to-r ${getScoreColor(scoreTotal)}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
              {vaga.titulo}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span className="line-clamp-1">{vaga.empresa?.nomeFantasia || vaga.empresa?.nome || 'Empresa'}</span>
              </div>
              {vaga.localizacao && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{vaga.localizacao}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Score Circle */}
          <div className="relative">
            <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${getScoreColor(scoreTotal)} p-0.5 shadow-lg`}>
              <div className="h-full w-full rounded-2xl bg-background flex flex-col items-center justify-center">
                <Sparkles className="h-4 w-4 text-violet-500 mb-1" />
                <span className={`text-2xl font-bold bg-gradient-to-br ${getScoreColor(scoreTotal)} bg-clip-text text-transparent`}>
                  {scoreTotal}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">MATCH</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Match Badge */}
        <div className="flex items-center gap-2 mt-3">
          <Badge className={`bg-gradient-to-r ${getScoreColor(scoreTotal)} text-white border-0 shadow-md`}>
            {scoreBadge.emoji} {scoreBadge.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bars */}
        <div className="grid gap-4">
          <div className="space-y-2 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs">
                  👥
                </div>
                Subtipos
              </span>
              <span className={`font-bold ${getScoreTextColor(scoreSubtipos)}`}>{scoreSubtipos}%</span>
            </div>
            <Progress value={scoreSubtipos} className="h-2" />
            <p className="text-xs text-muted-foreground font-medium">
              {detalhes.subtiposAceitos} de {detalhes.subtiposTotal} subtipos aceitos
            </p>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs">
                  ♿
                </div>
                Acessibilidades
              </span>
              <span className={`font-bold ${getScoreTextColor(scoreAcessibilidades)}`}>{scoreAcessibilidades}%</span>
            </div>
            <Progress value={scoreAcessibilidades} className="h-2" />
            <p className="text-xs text-muted-foreground font-medium">
              {detalhes.barreirasAtendidas} de {detalhes.barreirasTotal} barreiras atendidas
            </p>
          </div>
        </div>

        {/* Status */}
        <div className={`flex items-center gap-2 p-3 rounded-lg ${compativel ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}>
          {compativel ? (
            <>
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-600">Vaga Compatível com seu Perfil</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-rose-600" />
              <span className="text-sm font-semibold text-rose-600">Incompatibilidade Detectada</span>
            </>
          )}
        </div>

        {/* Detalhes das Barreiras */}
        {detalhes.barreirasPorSubtipo.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="barreiras" className="border-2 rounded-lg px-4">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                📋 Ver detalhes das barreiras ({detalhes.barreirasTotal})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {detalhes.barreirasPorSubtipo.map((grupo, idx) => (
                    <div key={idx} className="space-y-3">
                      <h4 className="font-semibold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        {grupo.subtipo}
                      </h4>
                      <div className="space-y-3 pl-2">
                        {grupo.barreiras.map((barreira) => (
                          <div
                            key={barreira.id}
                            className={`flex items-start gap-3 text-sm p-3 rounded-lg border-2 ${
                              barreira.atendida 
                                ? 'bg-emerald-500/5 border-emerald-500/20' 
                                : 'bg-amber-500/5 border-amber-500/20'
                            }`}
                          >
                            <div className="mt-0.5">
                              {barreira.atendida ? (
                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <p className={`font-medium ${barreira.atendida ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                {barreira.descricao}
                              </p>
                              {barreira.atendida ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {barreira.acessibilidadesOferecidas.map((acess, i) => (
                                    <Badge key={i} variant="outline" className="text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-700">
                                      ✓ {acess}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <p className="text-xs font-medium text-muted-foreground">Necessário:</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {barreira.acessibilidadesNecessarias.map((acess, i) => (
                                      <Badge key={i} variant="outline" className="text-xs bg-amber-500/10 border-amber-500/30 text-amber-700">
                                        {acess}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Action Button */}
        <Button 
          className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md"
          size="lg"
          onClick={() => navigate(`/dashboard/candidato/vaga/${vaga.id}`)}
        >
          Ver Detalhes da Vaga
        </Button>
      </CardContent>
    </Card>
  )
}
