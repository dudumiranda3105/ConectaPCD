import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    MapPin,
    Calendar,
    Briefcase,
    MessageSquare,
    PartyPopper,
    Award,
    Building2,
    Trophy,
    Star,
    CheckCircle2,
    DollarSign,
    Clock
} from 'lucide-react'

interface VagaAprovada {
    id: string
    createdAt: string
    updatedAt: string
    status: string
    vaga: {
        id: number
        titulo: string
        descricao?: string
        regimeTrabalho?: string
        beneficios?: string
        empresa: {
            id: number
            nome: string
            companyData?: any
        }
    }
}

export default function HiredJobsPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const navigate = useNavigate()
    const [vagasAprovadas, setVagasAprovadas] = useState<VagaAprovada[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchVagasAprovadas = async () => {
            try {
                const token = localStorage.getItem('auth_token')
                const candidatoId = (user as any)?.candidatoId

                if (!token || !candidatoId) {
                    return
                }

                const response = await fetch(`http://localhost:3000/candidatos/${candidatoId}/candidaturas/aprovadas`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    const data = await response.json()
                    setVagasAprovadas(data)
                } else {
                    console.warn('Endpoint de vagas aprovadas pode não existir ainda')
                    setVagasAprovadas([])
                }
            } catch (error: any) {
                console.error('Erro ao buscar vagas aprovadas:', error)
                toast({
                    title: 'Erro ao carregar',
                    description: 'Não foi possível carregar suas contratações.',
                    variant: 'destructive'
                })
            } finally {
                setLoading(false)
            }
        }

        fetchVagasAprovadas()
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
                    <p className="text-muted-foreground font-medium">Carregando suas contratações...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
                        <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Minhas Contratações</h1>
                        <p className="text-muted-foreground">
                            Vagas em que você foi aprovado e contratado.
                        </p>
                    </div>
                </div>
            </div>

            {/* Celebration Banner */}
            {vagasAprovadas.length > 0 && (
                <Card className="bg-gradient-to-r from-emerald-500 to-green-500 border-0 text-white overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <CardContent className="pt-6 relative">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                                    <PartyPopper className="h-10 w-10" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Parabéns! 🎉</h2>
                                    <p className="text-emerald-100">
                                        Você foi contratado em {vagasAprovadas.length} {vagasAprovadas.length === 1 ? 'vaga' : 'vagas'}!
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="h-8 w-8 text-yellow-300 fill-yellow-300" />
                                <Star className="h-8 w-8 text-yellow-300 fill-yellow-300" />
                                <Star className="h-8 w-8 text-yellow-300 fill-yellow-300" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {vagasAprovadas.length === 0 ? (
                <Card className="border-2 border-dashed bg-muted/50">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center mb-6">
                            <Trophy className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">Nenhuma contratação ainda</h3>
                        <p className="text-muted-foreground max-w-md mb-6">
                            Continue se candidatando às vagas! Quando uma empresa aprovar sua contratação, 
                            ela aparecerá aqui. Boa sorte!
                        </p>
                        <Button 
                            onClick={() => navigate('/dashboard/candidato')}
                            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                        >
                            <Briefcase className="h-4 w-4 mr-2" />
                            Ver Vagas Disponíveis
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {vagasAprovadas.map((candidatura) => (
                        <Card 
                            key={candidatura.id} 
                            className="overflow-hidden border shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-white to-emerald-50/30 dark:from-card dark:to-emerald-950/10"
                        >
                            <CardHeader className="pb-4 border-b">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="relative">
                                            <Avatar className="h-16 w-16 border-2 border-emerald-200 shadow-lg ring-2 ring-emerald-500/20">
                                                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold">
                                                    {getInitials(candidatura.vaga.empresa.nome)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 shadow-lg">
                                                <CheckCircle2 className="h-3 w-3 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <CardTitle className="text-xl">{candidatura.vaga.titulo}</CardTitle>
                                                <Award className="h-5 w-5 text-emerald-500" />
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                <Building2 className="h-3.5 w-3.5" />
                                                <span className="font-medium text-foreground">{candidatura.vaga.empresa.nome}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-sm">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Contratado
                                                </Badge>
                                                {candidatura.vaga.regimeTrabalho && (
                                                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        {candidatura.vaga.regimeTrabalho}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Button 
                                            variant="outline" 
                                            className="gap-2"
                                            onClick={() => navigate(`/dashboard/candidato/chat/${candidatura.id}`)}
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            Ver Conversa
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
                                            <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Data da Contratação</p>
                                            <p className="text-sm font-medium">{formatDate(candidatura.updatedAt)}</p>
                                        </div>
                                    </div>
                                    {candidatura.vaga.beneficios && (
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-950/50 flex items-center justify-center">
                                                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Benefícios</p>
                                                <p className="text-sm font-medium truncate max-w-[200px]">{candidatura.vaga.beneficios}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                                            <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Empresa</p>
                                            <p className="text-sm font-medium">{candidatura.vaga.empresa.nome}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {candidatura.vaga.descricao && (
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-xs text-muted-foreground mb-1">Descrição da Vaga</p>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{candidatura.vaga.descricao}</p>
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
