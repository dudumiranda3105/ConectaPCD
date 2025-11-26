import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Link2, Unlink2, Accessibility, Sparkles, Shield, CheckCircle2, Loader2, AlertCircle, X, Search, Zap } from 'lucide-react';
import { acessibilidadesService, Acessibilidade, Barreira } from '@/services/acessibilidades';
import { getBarreiras } from '@/services/barreiras';
import { toast } from '@/hooks/use-toast';

export function AcessibilidadesTable() {
  const [acessibilidades, setAcessibilidades] = useState<Acessibilidade[]>([]);
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [novaDescricao, setNovaDescricao] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchBarreira, setSearchBarreira] = useState('');
  const [selectedAcessibilidadeId, setSelectedAcessibilidadeId] = useState<number | null>(null);
  const [selectedBarreirasIds, setSelectedBarreirasIds] = useState<number[]>([]);

  useEffect(() => {
    fetchAcessibilidades();
    fetchBarreiras();
  }, []);

  const fetchAcessibilidades = async () => {
    try {
      setLoading(true);
      const data = await acessibilidadesService.list();
      setAcessibilidades(data);
    } catch (error) {
      console.error('Erro ao carregar acessibilidades:', error);
      toast({ title: 'Erro', description: 'Não foi possível carregar as acessibilidades' });
    } finally {
      setLoading(false);
    }
  };

  const fetchBarreiras = async () => {
    try {
      const data = await getBarreiras();
      setBarreiras(data);
    } catch (error) {
      console.error('Erro ao carregar barreiras:', error);
    }
  };

  const handleCreateAcessibilidade = async () => {
    if (!novaDescricao.trim()) {
      toast({ title: 'Erro', description: 'Digite uma descrição para a acessibilidade', variant: 'destructive' });
      return;
    }

    if (novaDescricao.trim().length < 5) {
      toast({ title: 'Erro', description: 'A descrição deve ter pelo menos 5 caracteres', variant: 'destructive' });
      return;
    }

    try {
      setCreateLoading(true);
      await acessibilidadesService.create(novaDescricao.trim());
      setNovaDescricao('');
      setIsCreateModalOpen(false);
      await fetchAcessibilidades();
      toast({ 
        title: '✅ Acessibilidade criada!', 
        description: 'O recurso de acessibilidade foi adicionado com sucesso ao sistema.',
      });
    } catch (error: any) {
      console.error('Erro ao criar acessibilidade:', error);
      toast({ title: 'Erro', description: error.message || 'Erro ao criar acessibilidade', variant: 'destructive' });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleConnectBarreira = async (acessibilidadeId: number, barreiraId: number) => {
    try {
      setLoading(true);
      await acessibilidadesService.connectBarreira(acessibilidadeId, barreiraId);
      await fetchAcessibilidades();
      toast({ title: 'Sucesso', description: 'Barreira conectada com sucesso' });
    } catch (error: any) {
      console.error('Erro ao conectar barreira:', error);
      toast({ title: 'Erro', description: error.message || 'Erro ao conectar barreira' });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectBarreira = async (acessibilidadeId: number, barreiraId: number) => {
    try {
      setLoading(true);
      await acessibilidadesService.disconnectBarreira(acessibilidadeId, barreiraId);
      await fetchAcessibilidades();
      toast({ title: 'Sucesso', description: 'Barreira desconectada com sucesso' });
    } catch (error: any) {
      console.error('Erro ao desconectar barreira:', error);
      toast({ title: 'Erro', description: error.message || 'Erro ao desconectar barreira' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAcessibilidade = async (id: number) => {
    try {
      setLoading(true);
      await acessibilidadesService.delete(id);
      await fetchAcessibilidades();
      toast({ title: 'Sucesso', description: 'Acessibilidade removida com sucesso' });
    } catch (error: any) {
      console.error('Erro ao remover acessibilidade:', error);
      toast({ title: 'Erro', description: error.message || 'Erro ao remover acessibilidade' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com título e botão */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Acessibilidades</h2>
          <p className="text-sm text-muted-foreground">Gerencie as acessibilidades oferecidas pelas empresas</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg gap-2">
              <Plus className="w-4 h-4" />
              Nova Acessibilidade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
            {/* Header com gradiente */}
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-teal-300/20 blur-2xl" />
              
              <div className="relative flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl border border-white/30">
                  <Accessibility className="h-8 w-8 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    Nova Acessibilidade
                  </DialogTitle>
                  <DialogDescription className="text-white/80 mt-1">
                    Adicione um novo recurso de acessibilidade ao sistema
                  </DialogDescription>
                </div>
              </div>
            </div>

            {/* Conteúdo do formulário */}
            <div className="p-6 space-y-6">
              {/* Campo de descrição */}
              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  Descrição da Acessibilidade
                </label>
                <div className="relative">
                  <Textarea
                    placeholder="Descreva o recurso de acessibilidade oferecido...&#10;&#10;Exemplos:&#10;• Rampas de acesso para cadeirantes&#10;• Sinalização em braile&#10;• Intérprete de Libras disponível"
                    value={novaDescricao}
                    onChange={(e) => setNovaDescricao(e.target.value)}
                    disabled={createLoading}
                    className="min-h-[140px] border-2 focus:border-emerald-500 transition-all resize-none text-base"
                  />
                  <div className="absolute bottom-3 right-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      novaDescricao.length === 0 
                        ? 'bg-gray-100 text-gray-400 dark:bg-gray-800' 
                        : novaDescricao.length < 5 
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' 
                          : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
                    }`}>
                      {novaDescricao.length} caracteres
                    </span>
                  </div>
                </div>
                {novaDescricao.length > 0 && novaDescricao.length < 5 && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Mínimo de 5 caracteres necessários
                  </p>
                )}
              </div>

              {/* Dica informativa */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                      Dica para uma boa descrição
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      Seja específico e claro sobre o recurso. Após criar, você poderá conectar 
                      esta acessibilidade às barreiras que ela resolve.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setNovaDescricao('');
                    setIsCreateModalOpen(false);
                  }} 
                  disabled={createLoading}
                  className="h-11 px-6"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateAcessibilidade} 
                  disabled={createLoading || novaDescricao.trim().length < 5}
                  className="h-11 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Acessibilidade
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-border/50 shadow-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-emerald-500/5 to-transparent border-b">
              <TableHead className="font-semibold">Descrição</TableHead>
              <TableHead className="font-semibold w-32">Barreiras</TableHead>
              <TableHead className="font-semibold w-40 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && acessibilidades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Carregando acessibilidades...
                </TableCell>
              </TableRow>
            ) : acessibilidades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Nenhuma acessibilidade cadastrada
                </TableCell>
              </TableRow>
            ) : (
              acessibilidades.map((acess) => (
                <TableRow key={acess.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Accessibility className="h-4 w-4 text-emerald-600" />
                      </div>
                      {acess.descricao}
                    </div>
                  </TableCell>
                  <TableCell>
                    {acess.barreiras && acess.barreiras.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <span className="text-emerald-600 font-bold text-xs">{acess.barreiras.length}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {acess.barreiras.length === 1 ? 'barreira' : 'barreiras'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Nenhuma</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-all"
                            onClick={() => {
                              setSelectedAcessibilidadeId(acess.id);
                              setSelectedBarreirasIds(acess.barreiras?.map(b => b.barreira.id) || []);
                              setSearchBarreira('');
                            }}
                          >
                            <Link2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Conectar Barreiras</span>
                            <span className="sm:hidden">Barreiras</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 overflow-hidden">
                          {/* Header com gradiente */}
                          <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-purple-300/20 blur-2xl" />
                            
                            <div className="relative flex items-center gap-4">
                              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl border border-white/30">
                                <Link2 className="h-8 w-8 text-white" />
                              </div>
                              <div className="flex-1">
                                <DialogTitle className="text-2xl font-bold text-white">
                                  Conectar Barreiras
                                </DialogTitle>
                                <DialogDescription className="text-white/80 mt-1 line-clamp-1">
                                  Selecione as barreiras que <strong className="text-white">{acess.descricao}</strong> resolve
                                </DialogDescription>
                              </div>
                            </div>

                            {/* Stats no header */}
                            <div className="relative flex gap-4 mt-4">
                              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                                <span className="text-white text-sm font-medium">
                                  {acess.barreiras?.length || 0} conectadas
                                </span>
                              </div>
                              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                                <Shield className="h-4 w-4 text-white" />
                                <span className="text-white text-sm font-medium">
                                  {barreiras.length} disponíveis
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Conteúdo */}
                          <div className="p-6 space-y-4">
                            {/* Barra de pesquisa */}
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Buscar barreiras..."
                                value={searchBarreira}
                                onChange={(e) => setSearchBarreira(e.target.value)}
                                className="pl-10 h-11 border-2 focus:border-violet-500"
                              />
                              {searchBarreira && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                  onClick={() => setSearchBarreira('')}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            {/* Lista de barreiras */}
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent hover:scrollbar-thumb-violet-500/40 scrollbar-thumb-rounded-full">
                              {barreiras.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                  <Shield className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                  <p className="text-lg font-medium">Nenhuma barreira cadastrada</p>
                                  <p className="text-sm mt-1">Cadastre barreiras primeiro para poder conectá-las</p>
                                </div>
                              ) : (
                                <>
                                  {/* Barreiras conectadas primeiro */}
                                  {barreiras
                                    .filter(b => b.descricao.toLowerCase().includes(searchBarreira.toLowerCase()))
                                    .sort((a, b) => {
                                      const aConnected = acess.barreiras?.some(ab => ab.barreira.id === a.id) ? 1 : 0;
                                      const bConnected = acess.barreiras?.some(ab => ab.barreira.id === b.id) ? 1 : 0;
                                      return bConnected - aConnected;
                                    })
                                    .map((barreira) => {
                                      const isConnected = acess.barreiras?.some(b => b.barreira.id === barreira.id);
                                      return (
                                        <div
                                          key={barreira.id}
                                          className={`group flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-300 cursor-pointer ${
                                            isConnected 
                                              ? 'bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-300 dark:border-violet-700 shadow-lg' 
                                              : 'bg-card border-border hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md'
                                          }`}
                                          onClick={() =>
                                            isConnected
                                              ? handleDisconnectBarreira(acess.id, barreira.id)
                                              : handleConnectBarreira(acess.id, barreira.id)
                                          }
                                        >
                                          <div className="flex items-center gap-4 flex-1">
                                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
                                              isConnected 
                                                ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg' 
                                                : 'bg-muted text-muted-foreground group-hover:bg-violet-100 group-hover:text-violet-600 dark:group-hover:bg-violet-900/30'
                                            }`}>
                                              <Shield className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                              <span className={`font-medium block ${isConnected ? 'text-violet-900 dark:text-violet-100' : ''}`}>
                                                {barreira.descricao}
                                              </span>
                                              {isConnected && (
                                                <span className="text-xs text-violet-600 dark:text-violet-400 flex items-center gap-1.5 mt-1">
                                                  <Zap className="h-3 w-3" />
                                                  Esta acessibilidade resolve esta barreira
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                            isConnected 
                                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50' 
                                              : 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-900/50'
                                          }`}>
                                            {isConnected ? (
                                              <>
                                                <Unlink2 className="w-4 h-4" />
                                                <span className="text-sm font-medium">Desconectar</span>
                                              </>
                                            ) : (
                                              <>
                                                <Link2 className="w-4 h-4" />
                                                <span className="text-sm font-medium">Conectar</span>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  {barreiras.filter(b => b.descricao.toLowerCase().includes(searchBarreira.toLowerCase())).length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                      <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                      <p className="font-medium">Nenhuma barreira encontrada</p>
                                      <p className="text-sm mt-1">Tente buscar por outro termo</p>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>

                            {/* Dica */}
                            <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-xl p-4 border border-violet-200 dark:border-violet-800">
                              <div className="flex gap-3">
                                <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                                  <Zap className="h-5 w-5 text-violet-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-violet-800 dark:text-violet-300">
                                    Como funciona?
                                  </p>
                                  <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">
                                    Conecte as barreiras que esta acessibilidade ajuda a superar. 
                                    Isso melhora o matching entre candidatos e vagas.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={loading}
                        onClick={() => handleDeleteAcessibilidade(acess.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
