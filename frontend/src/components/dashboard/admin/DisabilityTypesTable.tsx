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
  getDisabilityTypes,
  createDisabilityType,
  updateDisabilityType,
  deleteDisabilityType,
} from '@/services/disabilities'
import { DisabilityTypeForm } from './DisabilityTypeForm'
import { Edit, PlusCircle, Trash2 } from 'lucide-react'

export const DisabilityTypesTable = () => {
  const [types, setTypes] = useState<DisabilityType[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<DisabilityType | null>(null)
  const { toast } = useToast()

  const fetchTypes = async () => {
    const data = await getDisabilityTypes()
    setTypes(data)
  }

  useEffect(() => {
    fetchTypes()
  }, [])

  const handleFormSubmit = async (data: {
    nome: string
    descricao?: string
    cor?: string
  }) => {
    try {
      if (editingType) {
        await updateDisabilityType(editingType.id, data.nome, data.descricao, data.cor)
        toast({
          title: 'Sucesso',
          description: 'Tipo de deficiência atualizado.',
        })
      } else {
        await createDisabilityType(data.nome, data.descricao, data.cor)
        toast({
          title: 'Sucesso',
          description: 'Novo tipo de deficiência criado.',
        })
      }
      await fetchTypes()
      setIsDialogOpen(false)
      setEditingType(null)
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
      await deleteDisabilityType(id)
      toast({ title: 'Sucesso', description: 'Tipo de deficiência excluído.' })
      await fetchTypes()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: (error as Error).message,
      })
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                  <PlusCircle className="h-6 w-6 text-white" />
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
                onSubmit={handleFormSubmit}
                onCancel={() => setIsDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-xl border border-border/50 shadow-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-500/5 to-transparent border-b">
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Descrição</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{type.nome.charAt(0).toUpperCase()}</span>
                    </div>
                    {type.nome}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {type.descricao || <span className="italic text-muted-foreground/60">Sem descrição</span>}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingType(type)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá
                          permanentemente o tipo de deficiência.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(type.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
