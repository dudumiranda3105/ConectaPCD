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
    description: string
  }) => {
    try {
      if (editingType) {
        await updateDisabilityType(editingType.id, data.nome, data.description)
        toast({
          title: 'Sucesso',
          description: 'Tipo de deficiência atualizado.',
        })
      } else {
        await createDisabilityType(data.nome, data.description)
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
            <Button onClick={() => setEditingType(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Tipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingType ? 'Editar' : 'Adicionar'} Tipo de Deficiência
              </DialogTitle>
            </DialogHeader>
            <DisabilityTypeForm
              type={editingType}
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
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type.id}>
                <TableCell className="font-medium">{type.nome}</TableCell>
                <TableCell className="text-muted-foreground">
                  {type.description}
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
