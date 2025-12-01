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
import { PlusCircle, Loader2, AlertCircle, Shield, Search } from 'lucide-react'
import { getBarreiras, createBarreira, Barreira } from '@/services/barreiras'

export default function BarriersManagementPage() {
  const [barreiras, setBarreiras] = useState<Barreira[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
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

  const filteredBarreiras = barreiras.filter((barreira) =>
    barreira.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header com botão e busca */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-rose-500" />
            Barreiras Cadastradas
          </h3>
          <p className="text-sm text-muted-foreground">
            {barreiras.length} barreira{barreiras.length !== 1 ? 's' : ''} no sistema
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar barreira..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 px-5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg whitespace-nowrap">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Barreira
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader className="space-y-4 pb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-xl shadow-rose-500/30">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold">Nova Barreira</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                      Adicione uma barreira que candidatos podem enfrentar
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-rose-500/10 flex items-center justify-center">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                    </div>
                    Descrição da Barreira
                  </label>
                  <Input
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Ex: Dificuldade de locomoção em escadas"
                    disabled={creating}
                    className="h-12 border-2 border-border/60 rounded-xl bg-muted/30 focus:bg-background focus:border-rose-500 transition-all duration-200"
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/50" />
                    Seja específico para ajudar no matching de candidatos com vagas
                  </p>
                </div>
                <div className="flex justify-end gap-3 pt-5 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={creating}
                    className="h-11 px-6 rounded-xl"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={creating}
                    className="h-11 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-lg shadow-rose-500/25 transition-all duration-200"
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
      </div>

      {/* Tabela */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center animate-pulse">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Carregando barreiras...</span>
          </div>
        </div>
      ) : filteredBarreiras.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground rounded-xl border-2 border-dashed border-rose-200 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/10">
          <Shield className="h-16 w-16 mb-4 text-rose-300 dark:text-rose-700" />
          <p className="text-lg font-medium">
            {searchTerm ? 'Nenhuma barreira encontrada' : 'Nenhuma barreira cadastrada'}
          </p>
          <p className="text-sm mt-1">
            {searchTerm ? 'Tente buscar por outro termo' : 'Clique em "Nova Barreira" para começar'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 shadow-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-rose-500/5 to-transparent border-b">
                <TableHead className="font-semibold">Barreira</TableHead>
                <TableHead className="font-semibold w-24 text-right">ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBarreiras.map((barreira, index) => (
                <TableRow 
                  key={barreira.id} 
                  className="hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500/10 to-red-500/10 flex items-center justify-center border border-rose-200 dark:border-rose-800">
                        <Shield className="h-5 w-5 text-rose-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{barreira.descricao}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center justify-center h-7 px-2.5 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-mono font-medium">
                      #{barreira.id}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
