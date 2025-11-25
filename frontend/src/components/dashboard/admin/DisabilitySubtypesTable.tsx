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
  DisabilitySubtype,
  DisabilityType,
  getSubtypes,
  getDisabilityTypes,
  createDisabilitySubtype,
  updateDisabilitySubtype,
  deleteDisabilitySubtype,
} from '@/services/disabilities'
import { DisabilitySubtypeForm } from './DisabilitySubtypeForm'
import { Edit, PlusCircle, Trash2, FolderTree, Loader2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const DisabilitySubtypesTable = () => {
  const [subtypes, setSubtypes] = useState<DisabilitySubtype[]>([])
  const [types, setTypes] = useState<DisabilityType[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubtype, setEditingSubtype] = useState<DisabilitySubtype | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchData = async () => {
    try {
      setLoading(true)
      const [subtypesData, typesData] = await Promise.all([
        getSubtypes(),
        getDisabilityTypes(),
      ])
      setSubtypes(subtypesData)
      setTypes(typesData)
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

  const handleFormSubmit = async (data: { nome: string; tipo_id: string }) => {
    try {
      const typeId = parseInt(data.tipo_id, 10)
      if (editingSubtype) {
        await updateDisabilitySubtype(editingSubtype.id, data.nome, typeId)
        toast({
          title: '✅ Sucesso',
          description: 'Subtipo de deficiência atualizado.',
        })
      } else {
        await createDisabilitySubtype(data.nome, typeId)
        toast({
          title: '✅ Sucesso',
          description: 'Novo subtipo de deficiência criado.',
        })
      }
      await fetchData()
      setIsDialogOpen(false)
      setEditingSubtype(null)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: (error as Error).message,
      })
    }
  }

  const handleDelete = async (id: number) => {
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

  const getTypeName = (typeId: number) =>
    types.find((t) => t.id === typeId)?.nome || 'N/A'

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center animate-pulse">
          <FolderTree className="h-8 w-8 text-white" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando subtipos...</span>
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setEditingSubtype(null)}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Subtipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader className="space-y-3 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <FolderTree className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl">
                    {editingSubtype ? 'Editar Subtipo' : 'Novo Subtipo de Deficiência'}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {editingSubtype ? 'Atualize os dados do subtipo' : 'Preencha os dados abaixo'}
                  </p>
                </div>
              </div>
            </DialogHeader>
            <div className="pt-4">
              <DisabilitySubtypeForm
                subtype={editingSubtype}
                types={types}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {subtypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
            <FolderTree className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Nenhum subtipo cadastrado.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 shadow-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Subtipo</TableHead>
                <TableHead className="font-semibold">Tipo Associado</TableHead>
                <TableHead className="text-right font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subtypes.map((subtype) => (
                <TableRow 
                  key={subtype.id} 
                  className="group transition-colors hover:bg-teal-50/50 dark:hover:bg-teal-950/20"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {subtype.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">{subtype.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className="bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800 font-medium"
                    >
                      {getTypeName(subtype.tipoId || subtype.tipo_id)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingSubtype(subtype)
                          setIsDialogOpen(true)
                        }}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
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
                              permanentemente o subtipo de deficiência.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(subtype.id)}
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}
