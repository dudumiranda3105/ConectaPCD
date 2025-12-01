import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'
import {
  DisabilityType,
  DisabilitySubtype,
  getDisabilityTypes,
  getSubtypes,
  createDisabilityType,
  updateDisabilityType,
  deleteDisabilityType,
  createDisabilitySubtype,
  deleteDisabilitySubtype,
} from '@/services/disabilities'
import { getBarreiras, Barreira } from '@/services/barreiras'
import { DisabilityTypeForm } from './DisabilityTypeForm'
import { DisabilitySubtypeForm } from './DisabilitySubtypeForm'
import { Edit, PlusCircle, Trash2, ChevronDown, ChevronRight, Link2, Accessibility, Loader2, AlertCircle, Layers, Unlink, ShieldCheck, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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

interface DisabilityTypesWithSubtypesTableProps {
  searchTerm?: string
}

export const DisabilityTypesWithSubtypesTable = ({ searchTerm = '' }: DisabilityTypesWithSubtypesTableProps) => {
  const [types, setTypes] = useState<DisabilityType[]>([])
  const [subtypes, setSubtypes] = useState<DisabilitySubtype[]>([])
  const [barreiras, setBarreiras] = useState<Barreira[]>([])
  const [subtypeBarrierCounts, setSubtypeBarrierCounts] = useState<Record<number, number>>({})
  const [expandedTypes, setExpandedTypes] = useState<number[]>([])
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false)
  const [isSubtypeDialogOpen, setIsSubtypeDialogOpen] = useState(false)
  const [isBarrierModalOpen, setIsBarrierModalOpen] = useState(false)
  const [editingType, setEditingType] = useState<DisabilityType | null>(null)
  const [selectedTypeForSubtype, setSelectedTypeForSubtype] = useState<number | null>(null)
  const [selectedSubtypeForBarriers, setSelectedSubtypeForBarriers] = useState<DisabilitySubtype | null>(null)
  const [subtypeDetail, setSubtypeDetail] = useState<SubtypeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [barrierLoading, setBarrierLoading] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchBarrierCounts = async (subtypeIds: number[]) => {
    const counts: Record<number, number> = {}
    await Promise.all(
      subtypeIds.map(async (id) => {
        try {
          const res = await fetch(`${API_URL}/subtipos/${id}`)
          if (res.ok) {
            const data = await res.json()
            counts[id] = data.barreiras?.length || 0
          }
        } catch {
          counts[id] = 0
        }
      })
    )
    setSubtypeBarrierCounts(counts)
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [typesData, subtypesData, barreirasData] = await Promise.all([
        getDisabilityTypes(),
        getSubtypes(),
        getBarreiras(),
      ])
      setTypes(typesData)
      setSubtypes(subtypesData)
      setBarreiras(barreirasData)
      
      // Fetch barrier counts for all subtypes
      if (subtypesData.length > 0) {
        fetchBarrierCounts(subtypesData.map((s: DisabilitySubtype) => s.id))
      }
    } catch (err) {
      setError('Erro ao carregar dados. Tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubtypeDetail = async (id: number) => {
    setBarrierLoading(true)
    try {
      const res = await fetch(`${API_URL}/subtipos/${id}`)
      if (!res.ok) throw new Error('Erro ao carregar detalhes')
      const data = await res.json()
      setSubtypeDetail(data)
      // Update the count for this subtype
      setSubtypeBarrierCounts(prev => ({ ...prev, [id]: data.barreiras?.length || 0 }))
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar detalhes do subtipo.',
      })
    } finally {
      setBarrierLoading(false)
    }
  }

  const handleConnect = async (barreiraId: number) => {
    if (!selectedSubtypeForBarriers) return
    setConnecting(true)
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(
        `${API_URL}/subtipos/${selectedSubtypeForBarriers.id}/barreiras`,
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
        title: '✅ Conectado!',
        description: 'Barreira associada ao subtipo com sucesso.',
      })
      await fetchSubtypeDetail(selectedSubtypeForBarriers.id)
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
    if (!selectedSubtypeForBarriers) return
    setConnecting(true)
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(
        `${API_URL}/subtipos/${selectedSubtypeForBarriers.id}/barreiras/${barreiraId}`,
        {
          method: 'DELETE',
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      )
      if (!res.ok) throw new Error('Erro ao desconectar')
      toast({
        title: '✅ Desconectado!',
        description: 'Barreira removida do subtipo.',
      })
      await fetchSubtypeDetail(selectedSubtypeForBarriers.id)
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

  const openBarrierModal = (subtype: DisabilitySubtype) => {
    setSelectedSubtypeForBarriers(subtype)
    setIsBarrierModalOpen(true)
    fetchSubtypeDetail(subtype.id)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredTypes = types.filter((type) =>
    type.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleTypeExpand = (typeId: number) => {
    setExpandedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    )
  }

  const getSubtypesForType = (typeId: number) =>
    subtypes.filter((st) => st.tipoId === typeId || st.tipo_id === typeId)

  const handleTypeFormSubmit = async (data: {
    nome: string
    descricao?: string
    cor?: string
  }) => {
    try {
      if (editingType) {
        await updateDisabilityType(editingType.id, data.nome, data.descricao, data.cor)
        toast({
          title: '✅ Sucesso',
          description: 'Tipo de deficiência atualizado.',
        })
      } else {
        await createDisabilityType(data.nome, data.descricao, data.cor)
        toast({
          title: '✅ Sucesso',
          description: 'Novo tipo de deficiência criado.',
        })
      }
      await fetchData()
      setIsTypeDialogOpen(false)
      setEditingType(null)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: (error as Error).message,
      })
    }
  }

  const handleSubtypeFormSubmit = async (data: {
    nome: string
    tipo_id: string
  }) => {
    try {
      const typeId = parseInt(data.tipo_id, 10)
      await createDisabilitySubtype(data.nome, typeId)
      toast({
        title: '✅ Sucesso',
        description: 'Novo subtipo de deficiência criado.',
      })
      await fetchData()
      setIsSubtypeDialogOpen(false)
      setSelectedTypeForSubtype(null)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: (error as Error).message,
      })
    }
  }

  const handleTypeDelete = async (id: number) => {
    try {
      await deleteDisabilityType(id)
      toast({ title: '✅ Sucesso', description: 'Tipo de deficiência excluído.' })
      await fetchData()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: (error as Error).message,
      })
    }
  }

  const handleSubtypeDelete = async (id: number) => {
    try {
      await deleteDisabilitySubtype(id)
      toast({
        title: '✅ Sucesso',
        description: 'Subtipo de deficiência excluído.',
      })
      await fetchData()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: (error as Error).message,
      })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center animate-pulse">
          <Accessibility className="h-8 w-8 text-white" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando tipos de deficiência...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-rose-500" />
        </div>
        <p className="text-rose-500 font-medium">{error}</p>
        <Button variant="outline" onClick={() => fetchData()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setEditingType(null)}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader className="space-y-3 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl">
                    {editingType ? 'Editar Tipo' : 'Novo Tipo de Deficiência'}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {editingType ? 'Atualize os dados do tipo' : 'Preencha os dados abaixo'}
                  </p>
                </div>
              </div>
            </DialogHeader>
            <div className="pt-4">
              <DisabilityTypeForm
                type={editingType}
                onSubmit={handleTypeFormSubmit}
                onCancel={() => setIsTypeDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {filteredTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground rounded-xl border-2 border-dashed border-teal-200 dark:border-teal-800 bg-teal-50/30 dark:bg-teal-950/10">
          <Accessibility className="h-16 w-16 mb-4 text-teal-300 dark:text-teal-700" />
          <p className="text-lg font-medium">
            {searchTerm ? 'Nenhum tipo encontrado' : 'Nenhum tipo de deficiência cadastrado'}
          </p>
          <p className="text-sm mt-1">
            {searchTerm ? 'Tente buscar por outro termo' : 'Clique em "Adicionar Tipo" para começar'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 shadow-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-teal-500/5 to-transparent border-b hover:bg-transparent">
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold">Tipo de Deficiência</TableHead>
                <TableHead className="font-semibold w-32">Subtipos</TableHead>
                <TableHead className="text-right font-semibold w-40">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTypes.map((type) => {
                const typeSubtypes = getSubtypesForType(type.id)
                const isExpanded = expandedTypes.includes(type.id)
                const typeColor = type.cor || '#14b8a6'

                return (
                  <>
                    <TableRow
                      key={type.id}
                      onClick={() => typeSubtypes.length > 0 && toggleTypeExpand(type.id)}
                      className={`group transition-all duration-200 ${typeSubtypes.length > 0 ? 'cursor-pointer' : ''} hover:bg-muted/50`}
                      style={{ 
                        backgroundColor: isExpanded ? `${typeColor}08` : undefined,
                        borderLeft: `3px solid ${typeColor}`
                      }}
                    >
                      <TableCell className="w-12">
                        {typeSubtypes.length > 0 && (
                          <div 
                            className="h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-200"
                            style={{ 
                              backgroundColor: isExpanded ? `${typeColor}20` : 'transparent',
                            }}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" style={{ color: typeColor }} />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-11 w-11 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
                            style={{ background: `linear-gradient(135deg, ${typeColor}, ${typeColor}dd)` }}
                          >
                            <span className="text-white font-bold text-base">
                              {type.nome.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-base">{type.nome}</span>
                            {type.descricao && (
                              <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                                {type.descricao}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                          style={{ 
                            backgroundColor: typeSubtypes.length > 0 ? `${typeColor}15` : 'var(--muted)',
                            color: typeSubtypes.length > 0 ? typeColor : 'var(--muted-foreground)'
                          }}
                        >
                          <span className="text-sm font-bold">{typeSubtypes.length}</span>
                          <span>subtipo{typeSubtypes.length !== 1 ? 's' : ''}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingType(type)
                              setIsTypeDialogOpen(true)
                            }}
                            className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-all hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-600 rounded-lg"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog
                            open={isSubtypeDialogOpen && selectedTypeForSubtype === type.id}
                            onOpenChange={(open) => {
                              setIsSubtypeDialogOpen(open)
                              if (!open) setSelectedTypeForSubtype(null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedTypeForSubtype(type.id)
                                  setIsSubtypeDialogOpen(true)
                                }}
                                className="h-9 px-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                              >
                                <PlusCircle className="h-4 w-4 mr-1" /> Subtipo
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader className="space-y-3 pb-4 border-b">
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <PlusCircle className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <DialogTitle className="text-xl">
                                      Novo Subtipo
                                    </DialogTitle>
                                    <p className="text-sm text-muted-foreground">
                                      Adicionar subtipo para <strong className="text-teal-600">{type.nome}</strong>
                                    </p>
                                  </div>
                                </div>
                              </DialogHeader>
                              <div className="pt-4">
                                {selectedTypeForSubtype && (
                                  <DisabilitySubtypeForm
                                    subtype={null}
                                    types={[type]}
                                    defaultTypeId={type.id.toString()}
                                    onSubmit={handleSubtypeFormSubmit}
                                    onCancel={() => {
                                      setIsSubtypeDialogOpen(false)
                                      setSelectedTypeForSubtype(null)
                                    }}
                                  />
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                                className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-100 dark:hover:bg-rose-900 hover:text-rose-600 rounded-lg"
                              >
                                <Trash2 className="h-4 w-4 text-rose-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-lg bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                                    <AlertCircle className="h-4 w-4 text-rose-500" />
                                  </div>
                                  Você tem certeza?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Isso excluirá
                                  permanentemente o tipo de deficiência e todos os seus subtipos.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleTypeDelete(type.id)}
                                  className="bg-rose-500 hover:bg-rose-600 text-white"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>

                    {isExpanded && typeSubtypes.length > 0 && (
                      <TableRow key={`${type.id}-subtypes`} className="hover:bg-transparent">
                        <TableCell colSpan={4} className="p-0">
                          <div 
                            className="px-6 py-5 border-l-3"
                            style={{ 
                              background: `linear-gradient(90deg, ${typeColor}08, transparent)`,
                              borderLeftColor: typeColor,
                              borderLeftWidth: '3px'
                            }}
                          >
                            <div className="flex items-center gap-2 mb-4">
                              <div 
                                className="h-6 w-6 rounded-md flex items-center justify-center"
                                style={{ backgroundColor: `${typeColor}20` }}
                              >
                                <Layers className="h-3.5 w-3.5" style={{ color: typeColor }} />
                              </div>
                              <span className="text-sm font-semibold" style={{ color: typeColor }}>
                                {typeSubtypes.length} Subtipo{typeSubtypes.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                              {typeSubtypes.map((subtype) => {
                                const barrierCount = subtypeBarrierCounts[subtype.id] || 0
                                return (
                                <div
                                  key={subtype.id}
                                  className="group/subtype flex items-center justify-between p-3 rounded-xl border-2 border-border/50 bg-background hover:border-opacity-100 hover:shadow-md transition-all duration-200"
                                  style={{ 
                                    '--hover-border-color': typeColor,
                                  } as React.CSSProperties}
                                  onMouseEnter={(e) => e.currentTarget.style.borderColor = typeColor}
                                  onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
                                >
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className="h-9 w-9 rounded-lg flex items-center justify-center"
                                      style={{ backgroundColor: `${typeColor}15` }}
                                    >
                                      <span className="font-semibold text-sm" style={{ color: typeColor }}>
                                        {subtype.nome.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{subtype.nome}</span>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <Shield className="h-3 w-3 text-blue-500" />
                                        <span className="text-xs text-muted-foreground">
                                          {barrierCount} barreira{barrierCount !== 1 ? 's' : ''}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-1 opacity-0 group-hover/subtype:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openBarrierModal(subtype)}
                                      title="Conectar barreiras"
                                      className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                                    >
                                      <Link2 className="h-4 w-4 text-blue-600" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          className="h-8 w-8 p-0 hover:bg-rose-100 dark:hover:bg-rose-900 rounded-lg"
                                        >
                                          <Trash2 className="h-4 w-4 text-rose-500" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                                              <AlertCircle className="h-4 w-4 text-rose-500" />
                                            </div>
                                            Excluir Subtipo
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Esta ação não pode ser desfeita. O subtipo <strong>"{subtype.nome}"</strong> será permanentemente excluído.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleSubtypeDelete(subtype.id)}
                                            className="bg-rose-500 hover:bg-rose-600 text-white"
                                          >
                                            Excluir
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              )})}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal de Conexão de Barreiras */}
      <Dialog open={isBarrierModalOpen} onOpenChange={(open) => {
        setIsBarrierModalOpen(open)
        if (!open) {
          setSelectedSubtypeForBarriers(null)
          setSubtypeDetail(null)
        }
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col p-0">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Link2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  Conexão de Barreiras
                </DialogTitle>
                <p className="text-violet-100 text-sm mt-1">
                  Gerenciar barreiras para <strong>{selectedSubtypeForBarriers?.nome}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-violet-300 dark:scrollbar-thumb-violet-700 scrollbar-track-transparent">
            {barrierLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center animate-pulse">
                  <Link2 className="h-7 w-7 text-white" />
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Carregando barreiras...</span>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Barreiras Conectadas */}
                <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4 border-b border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                          <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Barreiras Conectadas</h4>
                          <p className="text-xs text-muted-foreground">
                            Associadas a este subtipo
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500 text-white px-2.5 py-0.5">
                        {subtypeDetail?.barreiras.length || 0}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300 dark:scrollbar-thumb-emerald-700 scrollbar-track-transparent">
                    {!subtypeDetail?.barreiras.length ? (
                      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                        <ShieldCheck className="h-10 w-10 mb-3 opacity-20 text-emerald-500" />
                        <p className="font-medium text-sm">Nenhuma barreira conectada</p>
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
                <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 border-b border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                          <Link2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Barreiras Disponíveis</h4>
                          <p className="text-xs text-muted-foreground">
                            Clique para conectar
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500 text-white px-2.5 py-0.5">
                        {barreiras.filter((b) => !new Set(subtypeDetail?.barreiras.map((x) => x.id) || []).has(b.id)).length}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-blue-700 scrollbar-track-transparent">
                    {barreiras.filter((b) => !new Set(subtypeDetail?.barreiras.map((x) => x.id) || []).has(b.id)).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                        <Link2 className="h-10 w-10 mb-3 opacity-20 text-blue-500" />
                        <p className="font-medium text-sm">Todas conectadas!</p>
                        <p className="text-xs mt-1">Não há mais barreiras disponíveis</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {barreiras
                          .filter((b) => !new Set(subtypeDetail?.barreiras.map((x) => x.id) || []).has(b.id))
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
                                className="h-7 px-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleConnect(barreira.id)
                                }}
                              >
                                {connecting ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <>
                                    <Link2 className="h-3 w-3 mr-1" />
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

          {/* Footer */}
          <div className="border-t p-4 bg-muted/30">
            <Button 
              onClick={() => setIsBarrierModalOpen(false)}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
            >
              Concluído
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
