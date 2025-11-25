import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    ArrowLeft,
    User,
    MapPin,
    Mail,
    Phone,
    Calendar,
    Briefcase,
    CheckCircle2,
    Clock,
    MessageSquare,
    Users
} from 'lucide-react'
import { listarCandidaturasEmProcesso } from '@/services/vagas'

interface Candidatura {
    id: string
    createdAt: string
    status: string
    vaga: {
        id: number
        titulo: string
    }
    candidato: {
        id: string
        nome: string
        email?: string
        telefone?: string
        avatarUrl?: string
        cidade?: string
        estado?: string
        escolaridade: string
    }
}

export default function ApplicationsInProcessPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const navigate = useNavigate()
    const [candidaturas, setCandidaturas] = useState<Candidatura[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCandidaturas = async () => {
            try {
                const token = localStorage.getItem('auth_token')
                const empresaId = (user as any)?.empresaId

                if (!token || !empresaId) {
                    return
                }

                // Simulating fetch for now if endpoint is not ready, or using the service
                // In a real scenario, we would call the service
                // const data = await listarCandidaturasEmProcesso(token, empresaId)

                // MOCK DATA FOR DEMONSTRATION since backend might not filter by status yet
                // Ideally we replace this with the actual API call
                const data = await listarCandidaturasEmProcesso(token, empresaId)

                // Filter locally if API returns all (just in case)
                const emProcesso = Array.isArray(data) ? data.filter((c: any) => c.status === 'EM_PROCESSO') : []

                setCandidaturas(emProcesso)
            } catch (error: any) {
                console.error('Erro ao buscar candidaturas em processo:', error)
                toast({
                    title: 'Erro ao carregar',
                    description: 'Não foi possível carregar as candidaturas em processo.',
                    variant: 'destructive'
                })
            } finally {
                setLoading(false)
            }
        }

        fetchCandidaturas()
    }, [user, toast])

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="relative w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Candidaturas em Processo</h1>
                <p className="text-muted-foreground">
                    Gerencie os candidatos que você selecionou para avançar no processo seletivo.
                </p>
            </div>

            {candidaturas.length === 0 ? (
                <Card className="border-2 border-dashed bg-muted/50">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Users className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Nenhum processo ativo</h3>
                        <p className="text-muted-foreground max-w-md mb-6">
                            Você ainda não aceitou nenhuma candidatura. Vá para "Minhas Vagas" e revise os candidatos pendentes.
                        </p>
                        <Button onClick={() => navigate('/dashboard/empresa')}>
                            Ver Minhas Vagas
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {candidaturas.map((candidatura) => (
                        <Card key={candidatura.id} className="overflow-hidden border shadow-md hover:shadow-lg transition-all">
                            <CardHeader className="bg-muted/30 pb-4">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                                            <AvatarImage src={candidatura.candidato.avatarUrl} />
                                            <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                                                {getInitials(candidatura.candidato.nome)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-xl mb-1">{candidatura.candidato.nome}</CardTitle>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                <Briefcase className="h-3.5 w-3.5" />
                                                <span>Vaga: <span className="font-medium text-foreground">{candidatura.vaga.titulo}</span></span>
                                            </div>
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Em Processo
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Button variant="outline" className="gap-2">
                                            <MessageSquare className="h-4 w-4" />
                                            Mensagem
                                        </Button>
                                        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Aprovar Contratação
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">E-mail</p>
                                            <p className="text-sm font-medium">{candidatura.candidato.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                                            <Phone className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Telefone</p>
                                            <p className="text-sm font-medium">{candidatura.candidato.telefone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                            <MapPin className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Localização</p>
                                            <p className="text-sm font-medium">
                                                {candidatura.candidato.cidade && candidatura.candidato.estado
                                                    ? `${candidatura.candidato.cidade}, ${candidatura.candidato.estado}`
                                                    : 'N/A'}
                                            </p>
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
