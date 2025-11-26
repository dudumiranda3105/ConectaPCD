import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    User,
    MapPin,
    Mail,
    Phone,
    Calendar,
    Briefcase,
    MessageSquare,
    UserCheck,
    PartyPopper,
    Award,
    Building2,
    FileText,
    ExternalLink,
    Trophy
} from 'lucide-react'

interface CandidaturaAprovada {
    id: string
    createdAt: string
    updatedAt: string
    status: string
    vaga: {
        id: number
        titulo: string
        descricao?: string
        regimeTrabalho?: string
    }
    candidato: {
        id: string
        nome: string
        email?: string
        telefone?: string
        avatarUrl?: string
        cidade?: string
        estado?: string
        escolaridade?: string
        curriculoUrl?: string
    }
}

export default function HiredCandidatesPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const navigate = useNavigate()
    const [contratados, setContratados] = useState<CandidaturaAprovada[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchContratados = async () => {
            try {
                const token = localStorage.getItem('auth_token')
                const empresaId = (user as any)?.empresaId

                if (!token || !empresaId) {
                    return
                }

                const response = await fetch(`http://localhost:3000/empresas/${empresaId}/candidaturas/aprovadas`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    const data = await response.json()
                    setContratados(data)
                } else {
                    console.warn('Endpoint de contratados pode não existir ainda')
                    setContratados([])
                }
            } catch (error: any) {
                console.error('Erro ao buscar contratados:', error)
                toast({
                    title: 'Erro ao carregar',
                    description: 'Não foi possível carregar os candidatos contratados.',
                    variant: 'destructive'
                })
            } finally {
                setLoading(false)
            }
        }

        fetchContratados()
    }, [user, toast])

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <div className="relative">
                        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 blur-xl animate-pulse" />
                        <div className="relative w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                    <p className="text-muted-foreground font-medium">Carregando contratados...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                        <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Candidatos Contratados</h1>
                        <p className="text-muted-foreground">
                            Histórico de contratações realizadas pela sua empresa.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            {contratados.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-emerald-500 text-white">
                                    <UserCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{contratados.length}</p>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-500">Total de Contratações</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-500 text-white">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                                        {new Set(contratados.map(c => c.vaga.id)).size}
                                    </p>
                                    <p className="text-sm text-blue-600 dark:text-blue-500">Vagas Preenchidas</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-purple-500 text-white">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">100%</p>
                                    <p className="text-sm text-purple-600 dark:text-purple-500">Taxa de Sucesso</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {contratados.length === 0 ? (
                <Card className="border-2 border-dashed bg-muted/50">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center mb-6">
                            <Trophy className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">Nenhuma contratação ainda</h3>
                        <p className="text-muted-foreground max-w-md mb-6">
                            Quando você aprovar a contratação de um candidato, ele aparecerá aqui. 
                            Vá para "Em Processo" e finalize suas contratações.
                        </p>
                        <Button 
                            onClick={() => navigate('/dashboard/empresa/em-processo')}
                            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                        >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Ver Processos Ativos
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {contratados.map((contratacao) => (
                        <Card 
                            key={contratacao.id} 
                            className="overflow-hidden border shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-white to-emerald-50/30 dark:from-card dark:to-emerald-950/10"
                        >
                            <CardHeader className="pb-4 border-b">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="relative">
                                            <Avatar className="h-16 w-16 border-2 border-emerald-200 shadow-lg ring-2 ring-emerald-500/20">
                                                <AvatarImage src={contratacao.candidato.avatarUrl} />
                                                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold">
                                                    {getInitials(contratacao.candidato.nome)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 shadow-lg">
                                                <UserCheck className="h-3 w-3 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <CardTitle className="text-xl">{contratacao.candidato.nome}</CardTitle>
                                                <Award className="h-5 w-5 text-emerald-500" />
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                <Briefcase className="h-3.5 w-3.5" />
                                                <span>Contratado para: <span className="font-medium text-foreground">{contratacao.vaga.titulo}</span></span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-sm">
                                                    <UserCheck className="h-3 w-3 mr-1" />
                                                    Contratado
                                                </Badge>
                                                {contratacao.vaga.regimeTrabalho && (
                                                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                                                        <Building2 className="h-3 w-3 mr-1" />
                                                        {contratacao.vaga.regimeTrabalho}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Button 
                                            variant="outline" 
                                            className="gap-2"
                                            onClick={() => navigate(`/dashboard/empresa/chat/${contratacao.id}`)}
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            Ver Conversa
                                        </Button>
                                        {contratacao.candidato.curriculoUrl && (
                                            <Button 
                                                variant="outline" 
                                                className="gap-2"
                                                onClick={() => window.open(contratacao.candidato.curriculoUrl, '_blank')}
                                            >
                                                <FileText className="h-4 w-4" />
                                                Currículo
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">E-mail</p>
                                            <p className="text-sm font-medium truncate max-w-[150px]">{contratacao.candidato.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-950/50 flex items-center justify-center">
                                            <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Telefone</p>
                                            <p className="text-sm font-medium">{contratacao.candidato.telefone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center">
                                            <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Localização</p>
                                            <p className="text-sm font-medium">
                                                {contratacao.candidato.cidade && contratacao.candidato.estado
                                                    ? `${contratacao.candidato.cidade}, ${contratacao.candidato.estado}`
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
                                            <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Data Contratação</p>
                                            <p className="text-sm font-medium">{formatDate(contratacao.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
