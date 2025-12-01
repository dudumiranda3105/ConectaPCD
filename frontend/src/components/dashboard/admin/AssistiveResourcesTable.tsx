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
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { assistiveResourcesService, AssistiveResourceDTO } from '@/services/assistiveResources'
import { getBarriers, Barrier } from '@/services/disabilities'
import { 
  Edit, 
  PlusCircle, 
  Trash2, 
  Cog, 
  Loader2, 
  AlertCircle,
  Link2,
  FileText,
  Type
} from 'lucide-react'

interface AssistiveResourcesTableProps {
  searchTerm?: string
}

export const AssistiveResourcesTable = ({ searchTerm = '' }: AssistiveResourcesTableProps) => {
  const [resources, setResources] = useState<AssistiveResourceDTO[]>([])
  const [barriers, setBarriers] = useState<Barrier[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<AssistiveResourceDTO | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Form state
  const [formNome, setFormNome] = useState('')
  const [formDescricao, setFormDescricao] = useState('')
  const [formMitigacoes, setFormMitigacoes] = useState<{ barreiraId: number; eficiencia: string }[]>([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [resourcesData, barriersData] = await Promise.all([
        assistiveResourcesService.list(),
        getBarriers(),
      ])
      setResources(resourcesData)
      setBarriers(barriersData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Falha ao carregar recursos assistivos.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredResources = resources.filter((resource) =>
    resource.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setFormNome('')
    setFormDescricao('')
    setFormMitigacoes([])
    setEditingResource(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (resource: AssistiveResourceDTO) => {
    setEditingResource(resource)
    setFormNome(resource.nome)
    setFormDescricao(resource.descricao || '')
    setFormMitigacoes(
      resource.mitigacoes.map(m => ({ 
        barreiraId: m.barreiraId, 
        eficiencia: m.eficiencia || 'moderada' 
      }))
    )
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formNome.trim()) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'O nome é obrigatório.',
      })
      return
    }

    setIsSubmitting(true)
    try {
      if (editingResource) {
        await assistiveResourcesService.update(
          editingResource.id,
          formNome,
          formDescricao || undefined,
          formMitigacoes.length > 0 ? formMitigacoes : undefined
        )
        toast({
          title: '✅ Sucesso',
          description: 'Recurso assistivo atualizado.',
        })
      } else {
        await assistiveResourcesService.create(
          formNome,
          formDescricao || undefined,
          formMitigacoes.length > 0 ? formMitigacoes : undefined
        )
        toast({
          title: '✅ Sucesso',
          description: 'Recurso assistivo criado.',
        })
      }
      await fetchData()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: (error as Error).message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await assistiveResourcesService.delete(id)
      toast({
        title: '✅ Sucesso',
        description: 'Recurso assistivo excluído.',
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

  const toggleBarreiraMitigacao = (barreiraId: number, checked: boolean) => {
    if (checked) {
      setFormMitigacoes(prev => [...prev, { barreiraId, eficiencia: 'moderada' }])
    } else {
      setFormMitigacoes(prev => prev.filter(m => m.barreiraId !== barreiraId))
    }
  }

  const updateEficiencia = (barreiraId: number, eficiencia: string) => {
    setFormMitigacoes(prev => 
      prev.map(m => m.barreiraId === barreiraId ? { ...m, eficiencia } : m)
    )
  }

  const getBarreiraNome = (barreiraId: number) => {
    return barriers.find(b => b.id === barreiraId)?.descricao || `Barreira ${barreiraId}`
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center animate-pulse">
          <Cog className="h-8 w-8 text-white" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando recursos assistivos...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button 
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-lg"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Recurso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-3 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Cog className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl">
                    {editingResource ? 'Editar Recurso Assistivo' : 'Novo Recurso Assistivo'}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    {editingResource ? 'Atualize os dados do recurso' : 'Preencha os dados abaixo'}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5 pt-4">
              {/* Nome */}
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Type className="h-4 w-4 text-violet-500" />
                  Nome do Recurso
                </label>
                <Input
                  placeholder="Ex: Cadeira de rodas motorizada"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  className="h-11 border-2 focus:border-violet-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-violet-500" />
                  Descrição <span className="text-muted-foreground font-normal">(opcional)</span>
                </label>
                <Textarea
                  placeholder="Descreva as características deste recurso assistivo..."
                  value={formDescricao}
                  onChange={(e) => setFormDescricao(e.target.value)}
                  className="min-h-[80px] border-2 focus:border-violet-500 resize-none"
                  disabled={isSubmitting}
                />
              </div>

              {/* Mitigações de Barreiras */}
              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-violet-500" />
                  Barreiras que este recurso ajuda a mitigar
                </label>
                <p className="text-xs text-muted-foreground">
                  Selecione as barreiras que este recurso assistivo ajuda a superar e defina a eficiência
                </p>
                
                <div className="max-h-[200px] overflow-y-auto border rounded-lg p-3 space-y-2">
                  {barriers.map((barrier) => {
                    const mitigacao = formMitigacoes.find(m => m.barreiraId === barrier.id)
                    const isChecked = !!mitigacao
                    
                    return (
                      <div 
                        key={barrier.id} 
                        className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                          isChecked ? 'bg-violet-50 dark:bg-violet-950/30' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`barrier-${barrier.id}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => toggleBarreiraMitigacao(barrier.id, checked as boolean)}
                            disabled={isSubmitting}
                          />
                          <label 
                            htmlFor={`barrier-${barrier.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {barrier.descricao}
                          </label>
                        </div>
                        
                        {isChecked && (
                          <Select
                            value={mitigacao?.eficiencia || 'moderada'}
                            onValueChange={(value) => updateEficiencia(barrier.id, value)}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger className="w-[130px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="alta">Alta eficiência</SelectItem>
                              <SelectItem value="moderada">Moderada</SelectItem>
                              <SelectItem value="baixa">Baixa eficiência</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                {formMitigacoes.length > 0 && (
                  <p className="text-xs text-violet-600 dark:text-violet-400">
                    {formMitigacoes.length} barreira{formMitigacoes.length !== 1 ? 's' : ''} selecionada{formMitigacoes.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                  className="h-10 px-6"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="h-10 px-6 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingResource ? 'Atualizando...' : 'Criando...'}
                    </>
                  ) : (
                    editingResource ? 'Atualizar Recurso' : 'Criar Recurso'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {filteredResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
            <Cog className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            {searchTerm ? 'Nenhum recurso encontrado para a busca.' : 'Nenhum recurso assistivo cadastrado.'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Recurso Assistivo</TableHead>
                <TableHead className="font-semibold">Descrição</TableHead>
                <TableHead className="font-semibold">Barreiras Mitigadas</TableHead>
                <TableHead className="text-right font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow
                  key={resource.id}
                  className="group hover:bg-violet-50/50 dark:hover:bg-violet-950/20 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                        <Cog className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium">{resource.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {resource.descricao ? (
                      <span className="text-sm text-muted-foreground line-clamp-2">
                        {resource.descricao}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground/60 italic">
                        Sem descrição
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {resource.mitigacoes.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {resource.mitigacoes.slice(0, 3).map((m) => (
                          <Badge 
                            key={m.barreiraId} 
                            variant="outline"
                            className="text-xs bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800"
                          >
                            {getBarreiraNome(m.barreiraId).slice(0, 20)}
                            {getBarreiraNome(m.barreiraId).length > 20 ? '...' : ''}
                          </Badge>
                        ))}
                        {resource.mitigacoes.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{resource.mitigacoes.length - 3}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground/60 italic">
                        Nenhuma
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(resource)}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-violet-100 dark:hover:bg-violet-900 hover:text-violet-600"
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
                              Esta ação não pode ser desfeita. Isso excluirá permanentemente o recurso assistivo "{resource.nome}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(resource.id)}
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
