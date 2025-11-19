import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { PlusCircle, Loader2, AlertCircle } from 'lucide-react'
import { getBarreiras, createBarreira, Barreira } from '@/services/barreiras'

export default function BarriersManagementPage() {
  const [barreiras, setBarreiras] = useState<Barreira[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  const fetchBarreiras = async () => {
    setLoading(true)
    try {
      const data = await getBarreiras()
      setBarreiras(data)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar as barreiras.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBarreiras()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!descricao.trim()) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'A descrição é obrigatória.',
      })
      return
    }
    setCreating(true)
    try {
      await createBarreira(descricao.trim())
      toast({
        title: 'Sucesso!',
        description: 'Barreira criada com sucesso.',
      })
      setDescricao('')
      setIsDialogOpen(false)
      await fetchBarreiras()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: (error as Error).message,
      })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Barreiras</h1>
        <p className="text-muted-foreground mt-2">
          Adicione e gerencie as barreiras que candidatos podem enfrentar.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Barreiras Cadastradas</CardTitle>
              <CardDescription>
                Lista de todas as barreiras disponíveis no sistema.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-10 px-6 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Barreira
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg">
                      <PlusCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">Adicionar Barreira</DialogTitle>
                      <DialogDescription className="text-base">
                        Crie uma nova barreira que candidatos podem enfrentar.
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-6 mt-4">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-rose-500" />
                      Descrição da Barreira
                    </label>
                    <Input
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Ex: Dificuldade de locomoção em escadas"
                      disabled={creating}
                      className="h-12 border-2 focus:border-rose-500 transition-all"
                    />
                    <p className="text-xs text-muted-foreground">
                      Seja específico para ajudar no matching de candidatos
                    </p>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={creating}
                      className="h-10 px-6"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={creating}
                      className="h-10 px-6 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg"
                    >
                      {creating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Criar Barreira
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {barreiras.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                        Nenhuma barreira cadastrada ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    barreiras.map((barreira) => (
                      <TableRow key={barreira.id}>
                        <TableCell className="font-medium">
                          {barreira.id}
                        </TableCell>
                        <TableCell>{barreira.descricao}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
