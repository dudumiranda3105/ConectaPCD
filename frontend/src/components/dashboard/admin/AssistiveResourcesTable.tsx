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
          <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden p-0">
            {/* Header com gradiente */}
            <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-purple-300/20 blur-2xl" />
              
              <div className="relative flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl border border-white/30">
                  <Cog className="h-8 w-8 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    {editingResource ? 'Editar Recurso Assistivo' : 'Novo Recurso Assistivo'}
                  </DialogTitle>
                  <p className="text-white/80 mt-1 text-sm">
                    {editingResource ? 'Atualize os dados do recurso assistivo' : 'Adicione um novo recurso para ajudar candidatos'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin scrollbar-thumb-violet-300 dark:scrollbar-thumb-violet-700 scrollbar-track-transparent hover:scrollbar-thumb-violet-400 dark:hover:scrollbar-thumb-violet-600 scrollbar-thumb-rounded-full">
              {/* Nome */}
              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-violet-500/10 flex items-center justify-center">
                    <Type className="h-3.5 w-3.5 text-violet-500" />
                  </div>
                  Nome do Recurso
                </label>
                <Input
                  placeholder="Ex: Cadeira de rodas motorizada"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  className="h-12 border-2 border-border/60 rounded-xl bg-muted/30 focus:bg-background focus:border-violet-500 transition-all duration-200"
                  disabled={isSubmitting}
                />
              </div>

              {/* Descrição */}
              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-violet-500/10 flex items-center justify-center">
                    <FileText className="h-3.5 w-3.5 text-violet-500" />
                  </div>
                  Descrição 
                  <span className="text-muted-foreground font-normal text-xs">(opcional)</span>
                </label>
                <Textarea
                  placeholder="Descreva as características deste recurso assistivo..."
                  value={formDescricao}
                  onChange={(e) => setFormDescricao(e.target.value)}
                  className="min-h-[90px] border-2 border-border/60 rounded-xl bg-muted/30 focus:bg-background focus:border-violet-500 resize-none transition-all duration-200"
                  disabled={isSubmitting}
                />
              </div>

              {/* Mitigações de Barreiras */}
              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-violet-500/10 flex items-center justify-center">
                    <Link2 className="h-3.5 w-3.5 text-violet-500" />
                  </div>
                  Barreiras Mitigadas
                </label>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/50" />
                  Selecione as barreiras que este recurso ajuda a superar
                </p>
                
                <div className="max-h-[200px] overflow-y-auto border-2 border-border/60 rounded-xl p-3 space-y-2 bg-muted/20 scrollbar-thin scrollbar-thumb-violet-300 dark:scrollbar-thumb-violet-700 scrollbar-track-violet-100/50 dark:scrollbar-track-violet-900/30 hover:scrollbar-thumb-violet-400 dark:hover:scrollbar-thumb-violet-600 scrollbar-thumb-rounded-full">
                  {barriers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                      <span className="text-sm">Nenhuma barreira cadastrada</span>
                    </div>
                  ) : (
                    barriers.map((barrier) => {
                      const mitigacao = formMitigacoes.find(m => m.barreiraId === barrier.id)
                      const isChecked = !!mitigacao
                      
                      return (
                        <div 
                          key={barrier.id} 
                          className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                            isChecked 
                              ? 'bg-gradient-to-r from-violet-100 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/30 border-2 border-violet-300 dark:border-violet-700 shadow-sm' 
                              : 'hover:bg-muted/50 border-2 border-transparent'
                          }`}
                          onClick={() => toggleBarreiraMitigacao(barrier.id, !isChecked)}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={`barrier-${barrier.id}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => toggleBarreiraMitigacao(barrier.id, checked as boolean)}
                              disabled={isSubmitting}
                              className="h-5 w-5 rounded-md data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <label 
                              htmlFor={`barrier-${barrier.id}`}
                              className={`text-sm cursor-pointer ${isChecked ? 'font-medium text-violet-700 dark:text-violet-300' : ''}`}
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
                              <SelectTrigger 
                                className="w-[130px] h-8 text-xs rounded-lg border-2 border-violet-200 dark:border-violet-700 bg-white dark:bg-violet-950"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="alta">
                                  <span className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    Alta eficiência
                                  </span>
                                </SelectItem>
                                <SelectItem value="moderada">
                                  <span className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                                    Moderada
                                  </span>
                                </SelectItem>
                                <SelectItem value="baixa">
                                  <span className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                                    Baixa eficiência
                                  </span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
                
                {formMitigacoes.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 rounded-lg px-3 py-2 border border-violet-200 dark:border-violet-800">
                    <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                    <span className="font-medium">{formMitigacoes.length}</span> barreira{formMitigacoes.length !== 1 ? 's' : ''} selecionada{formMitigacoes.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Dica informativa */}
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-xl p-4 border border-violet-200 dark:border-violet-800">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <Cog className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-violet-800 dark:text-violet-300">
                      Como funciona o matching?
                    </p>
                    <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">
                      Recursos assistivos conectados às barreiras melhoram o matching entre 
                      candidatos e vagas. A eficiência define o peso no algoritmo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                  className="h-11 px-6 rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formNome.trim()}
                  className="h-11 px-6 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingResource ? 'Atualizando...' : 'Criando...'}
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      {editingResource ? 'Atualizar' : 'Criar Recurso'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {filteredResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground rounded-xl border-2 border-dashed border-violet-200 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-950/10">
          <Cog className="h-16 w-16 mb-4 text-violet-300 dark:text-violet-700" />
          <p className="text-lg font-medium">
            {searchTerm ? 'Nenhum recurso encontrado' : 'Nenhum recurso assistivo cadastrado'}
          </p>
          <p className="text-sm mt-1">
            {searchTerm ? 'Tente buscar por outro termo' : 'Clique em "Adicionar Recurso" para começar'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 shadow-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-violet-500/5 to-transparent border-b hover:bg-transparent">
                <TableHead className="font-semibold">Recurso Assistivo</TableHead>
                <TableHead className="font-semibold">Descrição</TableHead>
                <TableHead className="font-semibold w-48">Barreiras Mitigadas</TableHead>
                <TableHead className="text-right font-semibold w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow
                  key={resource.id}
                  className="group hover:bg-violet-50/50 dark:hover:bg-violet-950/20 transition-all duration-200"
                  style={{ borderLeft: '3px solid #8b5cf6' }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                        <Cog className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold text-base">{resource.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {resource.descricao ? (
                      <span className="text-sm text-muted-foreground line-clamp-2">
                        {resource.descricao}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground/50 italic">
                        Sem descrição
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {resource.mitigacoes.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {resource.mitigacoes.slice(0, 2).map((m) => (
                          <span 
                            key={m.barreiraId} 
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                          >
                            {getBarreiraNome(m.barreiraId).slice(0, 18)}
                            {getBarreiraNome(m.barreiraId).length > 18 ? '...' : ''}
                          </span>
                        ))}
                        {resource.mitigacoes.length > 2 && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500 text-white">
                            +{resource.mitigacoes.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground/50 italic">Nenhuma</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(resource)}
                        className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-all hover:bg-violet-100 dark:hover:bg-violet-900 hover:text-violet-600 rounded-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
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
