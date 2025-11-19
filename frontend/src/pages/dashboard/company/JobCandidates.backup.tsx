import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  GraduationCap,
  Briefcase,
  Calendar,
  Star,
  Link as LinkIcon,
  FileText,
  Sparkles,
  Users,
  Award,
} from 'lucide-react'
import { listarCandidaturasVaga } from '@/services/vagas'

interface Candidatura {
  id: string
  createdAt: string
  status: string
  candidato: {
    id: string
    nome: string
    cpf?: string
    telefone?: string
    email?: string
    escolaridade: string
    profileData?: any
    user?: {
      email: string
    }
    subtipos?: Array<{
      subtipo: {
        nome: string
        tipo: {
          nome: string
        }
      }
    }>
  }
  matchScore?: {
    score: number
    compatibilidadeAcessibilidade: number
    compatibilidadeSubtipos: number
  }
}

export const JobCandidates = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCandidaturas = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token || !jobId) return

        const data = await listarCandidaturasVaga(token, parseInt(jobId))
        setCandidaturas(data)
      } catch (error: any) {
        toast({
          title: 'Erro ao carregar candidaturas',
          description: error.message,
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCandidaturas()
  }, [jobId, toast])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APROVADA':
        return 'default'
      case 'REJEITADA':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando candidaturas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Candidatos da Vaga</h1>
          <p className="text-muted-foreground">
            {candidaturas.length} candidatura{candidaturas.length !== 1 ? 's' : ''} encontrada{candidaturas.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {candidaturas.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma candidatura</h3>
            <p className="text-muted-foreground">
              Esta vaga ainda não recebeu candidaturas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {candidaturas
            .sort((a, b) => {
              // Ordenar por match score (se disponível) e depois por data
              const scoreA = a.matchScore?.score || 0
              const scoreB = b.matchScore?.score || 0
              if (scoreA !== scoreB) return scoreB - scoreA
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })
            .map((candidatura) => (
            <Card key={candidatura.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-xl">
                    {candidatura.candidato.nome}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Candidatou-se em {formatDate(candidatura.createdAt)}
                    </div>
                    <Badge variant={getStatusBadgeVariant(candidatura.status)}>
                      {candidatura.status}
                    </Badge>
                  </div>
                </div>
                {candidatura.matchScore && (
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {candidatura.matchScore.score}% compatibilidade
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Match de acessibilidade
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{candidatura.candidato.email || candidatura.candidato.user?.email || 'Não informado'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{candidatura.candidato.telefone || 'Não informado'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{candidatura.candidato.profileData?.endereco || 'Não informado'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {candidatura.candidato.profileData?.dataNascimento ? 
                          calculateAge(candidatura.candidato.profileData.dataNascimento) + ' anos' : 
                          'Idade não informada'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{candidatura.candidato.escolaridade}</span>
                    </div>
                    {candidatura.candidato.subtipos && candidatura.candidato.subtipos.length > 0 && (
                      <div className="flex items-start gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div>Deficiências:</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {candidatura.candidato.subtipos.map((item, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {item.subtipo.nome} ({item.subtipo.tipo.nome})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {candidatura.candidato.profileData?.experiencia && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      Experiência Profissional
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      {candidatura.candidato.profileData.experiencia}
                    </p>
                  </div>
                )}

                {candidatura.candidato.profileData?.objetivos && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      Objetivos Profissionais
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      {candidatura.candidato.profileData.objetivos}
                    </p>
                  </div>
                )}

                {candidatura.matchScore && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Análise de Compatibilidade</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Acessibilidade:</span>
                        <span className="ml-2 font-medium">
                          {candidatura.matchScore.compatibilidadeAcessibilidade}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Deficiências:</span>
                        <span className="ml-2 font-medium">
                          {candidatura.matchScore.compatibilidadeSubtipos}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}