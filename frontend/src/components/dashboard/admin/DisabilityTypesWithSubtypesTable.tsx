import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { DisabilityTypeForm } from './DisabilityTypeForm'
import { DisabilitySubtypeForm } from './DisabilitySubtypeForm'
import { Edit, PlusCircle, Trash2, ChevronDown, ChevronRight, Link2, Accessibility, Loader2, AlertCircle, Layers } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface DisabilityTypesWithSubtypesTableProps {
  searchTerm?: string
}

export const DisabilityTypesWithSubtypesTable = ({ searchTerm = '' }: DisabilityTypesWithSubtypesTableProps) => {
  const navigate = useNavigate()
  const [types, setTypes] = useState<DisabilityType[]>([])
  const [subtypes, setSubtypes] = useState<DisabilitySubtype[]>([])
  const [expandedTypes, setExpandedTypes] = useState<number[]>([])
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false)
  const [isSubtypeDialogOpen, setIsSubtypeDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<DisabilityType | null>(null)
  const [selectedTypeForSubtype, setSelectedTypeForSubtype] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchData = async () => {
    try {
      setLoading(true)
      const [typesData, subtypesData] = await Promise.all([
        getDisabilityTypes(),
        getSubtypes(),
      ])
      setTypes(typesData)
      setSubtypes(subtypesData)
    } catch (err) {
      setError('Erro ao carregar dados. Tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
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
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
            <Accessibility className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            {searchTerm ? 'Nenhum tipo encontrado para a busca.' : 'Nenhum tipo de deficiência cadastrado.'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-10"></TableHead>
                <TableHead className="font-semibold">Tipo de Deficiência</TableHead>
                <TableHead className="font-semibold">Subtipos</TableHead>
                <TableHead className="text-right font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTypes.map((type) => {
                const typeSubtypes = getSubtypesForType(type.id)
                const isExpanded = expandedTypes.includes(type.id)

                return (
                  <>
                    <TableRow
                      key={type.id}
                      onClick={() => typeSubtypes.length > 0 && toggleTypeExpand(type.id)}
                      className={`group transition-colors ${typeSubtypes.length > 0 ? 'cursor-pointer' : ''} hover:bg-teal-50/50 dark:hover:bg-teal-950/20`}
                    >
                      <TableCell className="w-10">
                        {typeSubtypes.length > 0 && (
                          <div className={`h-6 w-6 rounded-md flex items-center justify-center transition-colors ${isExpanded ? 'bg-teal-100 dark:bg-teal-900' : 'bg-muted'}`}>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-teal-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {type.nome.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">{type.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`font-medium ${
                            typeSubtypes.length > 0 
                              ? 'bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {typeSubtypes.length} subtipo{typeSubtypes.length !== 1 ? 's' : ''}
                        </Badge>
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
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-600"
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
                                className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900 opacity-0 group-hover:opacity-100 transition-opacity"
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
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-100 dark:hover:bg-rose-900 hover:text-rose-600"
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
                      <TableRow key={`${type.id}-subtypes`} className="bg-gradient-to-r from-teal-50/50 to-emerald-50/50 dark:from-teal-950/20 dark:to-emerald-950/20">
                        <TableCell colSpan={4}>
                          <div className="pl-8 py-4">
                            <div className="text-sm font-medium mb-3 text-muted-foreground">
                              Subtipos ({typeSubtypes.length})
                            </div>
                            <div className="grid gap-2 md:grid-cols-2">
                              {typeSubtypes.map((subtype) => (
                                <div
                                  key={subtype.id}
                                  className="group/subtype flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background hover:border-teal-300 dark:hover:border-teal-700 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
                                      <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                                        {subtype.nome.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <span className="text-sm font-medium">{subtype.nome}</span>
                                  </div>
                                  <div className="flex gap-1 opacity-0 group-hover/subtype:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => navigate(`/admin/system/barrier-connections?subtipoId=${subtype.id}`)}
                                      title="Conectar barreiras"
                                      className="h-7 w-7 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                                    >
                                      <Link2 className="h-3.5 w-3.5 text-blue-600" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          className="h-7 w-7 p-0 hover:bg-rose-100 dark:hover:bg-rose-900"
                                        >
                                          <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Esta ação não pode ser desfeita. Isso
                                            excluirá permanentemente o subtipo de
                                            deficiência.
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
                              ))}
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
    </>
  )
}
