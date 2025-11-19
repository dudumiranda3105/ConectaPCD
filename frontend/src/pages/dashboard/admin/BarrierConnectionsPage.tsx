import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Link as LinkIcon, Unlink, AlertCircle, Network, ShieldCheck, Sparkles } from 'lucide-react'
import {
  getDisabilityTypes,
  getSubtypes,
  DisabilityType,
  DisabilitySubtype,
} from '@/services/disabilities'
import { getBarreiras, Barreira } from '@/services/barreiras'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface SubtypeDetail {
  id: number
  nome: string
  tipo: { id: number; nome: string }
  barreiras: Array<{
    id: number
    descricao: string
    acessibilidades: Array<{
      id: number
      descricao: string
    }>
  }>
}

export default function BarrierConnectionsPage() {
  const [types, setTypes] = useState<DisabilityType[]>([])
  const [subtypes, setSubtypes] = useState<DisabilitySubtype[]>([])
  const [barreiras, setBarreiras] = useState<Barreira[]>([])
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedSubtype, setSelectedSubtype] = useState<string>('')
  const [subtypeDetail, setSubtypeDetail] = useState<SubtypeDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      const [typesData, subtypesData, barreirasData] = await Promise.all([
        getDisabilityTypes(),
        getSubtypes(),
        getBarreiras(),
      ])
      setTypes(typesData)
      setSubtypes(subtypesData)
      setBarreiras(barreirasData)
    }
    fetchData()
  }, [])

  const filteredSubtypes = selectedType
    ? subtypes.filter((s) => (s.tipoId || s.tipo_id) === Number(selectedType))
    : []

  const fetchSubtypeDetail = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/subtipos/${id}`)
      if (!res.ok) throw new Error('Erro ao carregar detalhes')
      const data = await res.json()
      setSubtypeDetail(data)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar detalhes do subtipo.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubtypeChange = (value: string) => {
    setSelectedSubtype(value)
    if (value) {
      fetchSubtypeDetail(value)
    } else {
      setSubtypeDetail(null)
    }
  }

  const handleConnect = async (barreiraId: number) => {
    if (!selectedSubtype) return
    setConnecting(true)
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(
        `${API_URL}/subtipos/${selectedSubtype}/barreiras`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ barreiraId }),
        }
      )
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao conectar')
      }
      toast({
        title: 'Conectado!',
        description: 'Barreira associada ao subtipo com sucesso.',
      })
      await fetchSubtypeDetail(selectedSubtype)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: (error as Error).message,
      })
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async (barreiraId: number) => {
    if (!selectedSubtype) return
    setConnecting(true)
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(
        `${API_URL}/subtipos/${selectedSubtype}/barreiras/${barreiraId}`,
        {
          method: 'DELETE',
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      )
      if (!res.ok) throw new Error('Erro ao desconectar')
      toast({
        title: 'Desconectado!',
        description: 'Barreira removida do subtipo.',
      })
      await fetchSubtypeDetail(selectedSubtype)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível desconectar a barreira.',
      })
    } finally {
      setConnecting(false)
    }
  }

  const connectedBarreiraIds = new Set(
    subtypeDetail?.barreiras.map((b) => b.id) || []
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Conexões Subtipo ↔ Barreira</h1>
        <p className="text-muted-foreground mt-2">
          Associe subtipos de deficiência às barreiras correspondentes para
          melhorar o sistema de matching.
        </p>
      </div>

      <Card className="border-2">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Network className="h-7 w-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Selecionar Subtipo</CardTitle>
              <CardDescription className="text-base">
                Escolha um tipo e depois um subtipo para gerenciar suas barreiras
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                Tipo de Deficiência
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-11 border-2">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)}>
                      {type.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                Subtipo
              </label>
              <Select
                value={selectedSubtype}
                onValueChange={handleSubtypeChange}
                disabled={!selectedType}
              >
                <SelectTrigger className="h-11 border-2">
                  <SelectValue placeholder="Selecione um subtipo" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubtypes.map((subtype) => (
                    <SelectItem key={subtype.id} value={String(subtype.id)}>
                      {subtype.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      )}

      {!loading && subtypeDetail && (
        <>
          <Card className="border-2 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Barreiras Conectadas</CardTitle>
                  <CardDescription className="text-base">
                    Barreiras já associadas a <strong>{subtypeDetail.nome}</strong>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {subtypeDetail.barreiras.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mb-3 opacity-30" />
                  <p className="text-sm">Nenhuma barreira conectada ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {subtypeDetail.barreiras.map((barreira) => (
                    <div
                      key={barreira.id}
                      className="flex items-start justify-between rounded-xl border-2 border-emerald-200 dark:border-emerald-800 p-4 bg-emerald-50/30 dark:bg-emerald-950/20"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="font-medium text-base">{barreira.descricao}</div>
                        {barreira.acessibilidades.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {barreira.acessibilidades.map((acess) => (
                              <Badge key={acess.id} variant="outline" className="bg-white dark:bg-slate-900">
                                {acess.descricao}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(barreira.id)}
                        disabled={connecting}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <LinkIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Barreiras Disponíveis</CardTitle>
                  <CardDescription className="text-base">
                    Clique para associar uma barreira a <strong>{subtypeDetail.nome}</strong>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {barreiras
                  .filter((b) => !connectedBarreiraIds.has(b.id))
                  .map((barreira) => (
                    <div
                      key={barreira.id}
                      className="flex items-center justify-between rounded-xl border-2 p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all"
                    >
                      <span className="font-medium text-base">{barreira.descricao}</span>
                      <Button
                        size="sm"
                        onClick={() => handleConnect(barreira.id)}
                        disabled={connecting}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      >
                        {connecting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Conectar
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
