import { useState, useEffect } from 'react'
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
import { Loader2, Link as LinkIcon, Unlink, Network, ShieldCheck, Sparkles, Shield } from 'lucide-react'
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
      {/* Seleção de Tipo e Subtipo */}
      <div className="rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Network className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Selecionar Subtipo</h3>
            <p className="text-sm text-muted-foreground">
              Escolha um tipo e subtipo para gerenciar as barreiras associadas
            </p>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Tipo de Deficiência
            </label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-11 border-2 focus:border-violet-500 transition-all bg-white dark:bg-slate-900">
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
            <label className="text-sm font-semibold flex items-center gap-2">
              <Network className="h-4 w-4 text-purple-500" />
              Subtipo de Deficiência
            </label>
            <Select
              value={selectedSubtype}
              onValueChange={handleSubtypeChange}
              disabled={!selectedType}
            >
              <SelectTrigger className="h-11 border-2 focus:border-purple-500 transition-all disabled:opacity-50 bg-white dark:bg-slate-900">
                <SelectValue placeholder={selectedType ? "Selecione um subtipo" : "Selecione um tipo primeiro"} />
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
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center animate-pulse">
            <Network className="h-7 w-7 text-white" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Carregando detalhes...</span>
          </div>
        </div>
      )}

      {!loading && !subtypeDetail && selectedType && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground rounded-xl border-2 border-dashed border-violet-200 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-950/10">
          <Network className="h-16 w-16 mb-4 text-violet-300 dark:text-violet-700" />
          <p className="text-lg font-medium">Selecione um subtipo</p>
          <p className="text-sm mt-1">Escolha um subtipo acima para ver e gerenciar suas barreiras</p>
        </div>
      )}

      {!loading && subtypeDetail && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Barreiras Conectadas */}
          <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4 border-b border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Barreiras Conectadas</h4>
                    <p className="text-xs text-muted-foreground">
                      Associadas a <strong className="text-emerald-600">{subtypeDetail.nome}</strong>
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-500 text-white px-2.5 py-0.5">
                  {subtypeDetail.barreiras.length}
                </Badge>
              </div>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto">
              {subtypeDetail.barreiras.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ShieldCheck className="h-12 w-12 mb-3 opacity-20 text-emerald-500" />
                  <p className="font-medium">Nenhuma barreira conectada</p>
                  <p className="text-xs mt-1">Conecte barreiras da lista ao lado</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {subtypeDetail.barreiras.map((barreira) => (
                    <div
                      key={barreira.id}
                      className="group flex items-center justify-between rounded-lg border border-emerald-200 dark:border-emerald-800 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="font-medium text-sm truncate">{barreira.descricao}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(barreira.id)}
                        disabled={connecting}
                        className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Barreiras Disponíveis */}
          <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 border-b border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <LinkIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Barreiras Disponíveis</h4>
                    <p className="text-xs text-muted-foreground">
                      Clique para conectar
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-500 text-white px-2.5 py-0.5">
                  {barreiras.filter((b) => !connectedBarreiraIds.has(b.id)).length}
                </Badge>
              </div>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto">
              {barreiras.filter((b) => !connectedBarreiraIds.has(b.id)).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <LinkIcon className="h-12 w-12 mb-3 opacity-20 text-blue-500" />
                  <p className="font-medium">Todas as barreiras conectadas</p>
                  <p className="text-xs mt-1">Não há mais barreiras disponíveis</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {barreiras
                    .filter((b) => !connectedBarreiraIds.has(b.id))
                    .map((barreira) => (
                      <div
                        key={barreira.id}
                        className="group flex items-center justify-between rounded-lg border border-gray-200 dark:border-slate-700 p-3 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all cursor-pointer"
                        onClick={() => handleConnect(barreira.id)}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-all flex-shrink-0">
                            <Shield className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-all" />
                          </div>
                          <span className="font-medium text-sm truncate">{barreira.descricao}</span>
                        </div>
                        <Button
                          size="sm"
                          disabled={connecting}
                          className="h-8 px-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleConnect(barreira.id)
                          }}
                        >
                          {connecting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <LinkIcon className="h-3 w-3 mr-1" />
                              Conectar
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
