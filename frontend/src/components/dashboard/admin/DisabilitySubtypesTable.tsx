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
import { Edit, PlusCircle, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const DisabilitySubtypesTable = () => {
  const [subtypes, setSubtypes] = useState<DisabilitySubtype[]>([])
  const [types, setTypes] = useState<DisabilityType[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubtype, setEditingSubtype] =
    useState<DisabilitySubtype | null>(null)
  const { toast } = useToast()

  const fetchData = async () => {
    const [subtypesData, typesData] = await Promise.all([
      getSubtypes(),
      getDisabilityTypes(),
    ])
    setSubtypes(subtypesData)
    setTypes(typesData)
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
          title: 'Sucesso',
          description: 'Subtipo de deficiência atualizado.',
        })
      } else {
        await createDisabilitySubtype(data.nome, typeId)
        toast({
          title: 'Sucesso',
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
        title: 'Sucesso',
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

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSubtype(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Subtipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSubtype ? 'Editar' : 'Adicionar'} Subtipo de Deficiência
              </DialogTitle>
            </DialogHeader>
            <DisabilitySubtypeForm
              subtype={editingSubtype}
              types={types}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo Associado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subtypes.map((subtype) => (
              <TableRow key={subtype.id}>
                <TableCell className="font-medium">{subtype.nome}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getTypeName(subtype.tipo_id)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingSubtype(subtype)
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
                          permanentemente o subtipo de deficiência.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(subtype.id)}
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
